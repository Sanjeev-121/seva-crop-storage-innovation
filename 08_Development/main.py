from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

import models, schemas, auth
from database import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Seva Crop Storage API")

# Frontend alag port par chalega, isliye CORS on hai
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health():
    return {"status": "ok"}


# ---------- Auth ----------
@app.post("/auth/register", response_model=schemas.UserOut, status_code=201)
def register(data: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.phone == data.phone).first():
        raise HTTPException(400, "Phone already registered")
    user = models.User(
        name=data.name,
        phone=data.phone,
        village=data.village,
        district=data.district,
        state=data.state,
        role=data.role,
        password_hash=auth.hash_password(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/auth/login", response_model=schemas.Token)
def login(data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.phone == data.phone).first()
    if not user or not auth.verify_password(data.password, user.password_hash):
        raise HTTPException(401, "Invalid phone or password")
    return {"access_token": auth.create_token(user.id), "token_type": "bearer"}


@app.post("/auth/token", response_model=schemas.Token, include_in_schema=False)
def login_form(
    form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    # Swagger ke Authorize button ke liye (form format). username = phone number.
    user = db.query(models.User).filter(models.User.phone == form.username).first()
    if not user or not auth.verify_password(form.password, user.password_hash):
        raise HTTPException(401, "Invalid phone or password")
    return {"access_token": auth.create_token(user.id), "token_type": "bearer"}


@app.get("/me", response_model=schemas.UserOut)
def me(user: models.User = Depends(auth.current_user)):
    return user


@app.patch("/me", response_model=schemas.UserOut)
def update_me(
    data: schemas.UserUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(auth.current_user),
):
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


# ---------- Storage facilities ----------
@app.get("/storages", response_model=list[schemas.StorageOut])
def list_storages(
    district: str | None = None,
    min_available_kg: float | None = None,
    db: Session = Depends(get_db),
):
    q = db.query(models.Storage)
    if district:
        q = q.filter(models.Storage.district.ilike(district))
    if min_available_kg is not None:
        q = q.filter(models.Storage.available_kg >= min_available_kg)
    return q.all()


@app.get("/storages/{storage_id}", response_model=schemas.StorageOut)
def get_storage(storage_id: int, db: Session = Depends(get_db)):
    storage = db.get(models.Storage, storage_id)
    if not storage:
        raise HTTPException(404, "Storage not found")
    return storage


@app.post("/storages", response_model=schemas.StorageOut, status_code=201)
def add_storage(
    data: schemas.StorageCreate,
    db: Session = Depends(get_db),
    operator: models.User = Depends(auth.require_operator),
):
    storage = models.Storage(**data.model_dump())
    db.add(storage)
    db.commit()
    db.refresh(storage)
    return storage


# ---------- Applications ----------
def apply_status(db: Session, row: models.Application, new: str, note: str | None):
    """Status badalta hai, history likhta hai aur storage ki available capacity update karta hai."""
    old = row.status
    if new == old:
        return row
    if old in ("rejected", "cancelled", "completed"):
        raise HTTPException(400, f"Application already {old}, status change nahi ho sakta")

    storage = row.storage
    if new == "approved" and old == "pending":
        if storage.available_kg is not None:
            if row.quantity_kg > storage.available_kg:
                raise HTTPException(400, "Storage mein itni capacity available nahi hai")
            storage.available_kg -= row.quantity_kg
    elif new in ("rejected", "cancelled", "completed") and old in ("approved", "stored"):
        if storage.available_kg is not None:
            storage.available_kg += row.quantity_kg

    row.status = new
    db.add(models.ApplicationEvent(application_id=row.id, status=new, note=note))
    db.commit()
    db.refresh(row)
    return row


@app.post("/applications", response_model=schemas.ApplicationOut, status_code=201)
def submit_application(
    data: schemas.ApplicationCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(auth.current_user),
):
    storage = db.get(models.Storage, data.storage_id)
    if not storage:
        raise HTTPException(404, "Storage not found")
    if data.quantity_kg < (storage.min_quantity_kg or 0):
        raise HTTPException(
            400, f"Is storage ka minimum quantity {storage.min_quantity_kg} kg hai"
        )
    if storage.available_kg is not None and data.quantity_kg > storage.available_kg:
        raise HTTPException(400, "Storage mein itni capacity available nahi hai")

    row = models.Application(farmer_id=user.id, **data.model_dump())
    db.add(row)
    db.flush()
    db.add(models.ApplicationEvent(application_id=row.id, status="pending", note="Application submitted"))
    db.commit()
    db.refresh(row)
    return row


@app.get("/applications", response_model=list[schemas.ApplicationOut])
def my_applications(
    status: str | None = None,
    db: Session = Depends(get_db),
    user: models.User = Depends(auth.current_user),
):
    q = db.query(models.Application).filter(models.Application.farmer_id == user.id)
    if status:
        q = q.filter(models.Application.status == status)
    return q.order_by(models.Application.id.desc()).all()


@app.get("/applications/{app_id}", response_model=schemas.ApplicationOut)
def track_application(
    app_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(auth.current_user),
):
    row = db.get(models.Application, app_id)
    if not row or (row.farmer_id != user.id and user.role != "operator"):
        raise HTTPException(404, "Application not found")
    return row


@app.patch("/applications/{app_id}/cancel", response_model=schemas.ApplicationOut)
def cancel_application(
    app_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(auth.current_user),
):
    row = db.get(models.Application, app_id)
    if not row or row.farmer_id != user.id:
        raise HTTPException(404, "Application not found")
    if row.status not in ("pending", "approved"):
        raise HTTPException(400, "Sirf pending ya approved application cancel ho sakti hai")
    return apply_status(db, row, "cancelled", "Cancelled by farmer")


# ---------- Operator ----------
@app.get("/operator/applications", response_model=list[schemas.ApplicationOut])
def all_applications(
    status: str | None = None,
    storage_id: int | None = None,
    db: Session = Depends(get_db),
    operator: models.User = Depends(auth.require_operator),
):
    q = db.query(models.Application)
    if status:
        q = q.filter(models.Application.status == status)
    if storage_id:
        q = q.filter(models.Application.storage_id == storage_id)
    return q.order_by(models.Application.id.desc()).all()


@app.patch("/applications/{app_id}/status", response_model=schemas.ApplicationOut)
def update_status(
    app_id: int,
    data: schemas.StatusUpdate,
    db: Session = Depends(get_db),
    operator: models.User = Depends(auth.require_operator),
):
    # TODO: storage ko specific operator se link karna (abhi koi bhi operator badal sakta hai)
    row = db.get(models.Application, app_id)
    if not row:
        raise HTTPException(404, "Application not found")
    return apply_status(db, row, data.status, data.note)
