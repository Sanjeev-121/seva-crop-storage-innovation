from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

import models, schemas, auth
from database import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Seva Crop Storage API")

# Frontend (Naim) alag port par chalega, isliye CORS on hai
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


# ---------- Storage facilities (Member 5 ka database yahan se connect hoga) ----------
@app.get("/storages", response_model=list[schemas.StorageOut])
def list_storages(district: str | None = None, db: Session = Depends(get_db)):
    q = db.query(models.Storage)
    if district:
        q = q.filter(models.Storage.district.ilike(district))
    return q.all()


@app.post("/storages", response_model=schemas.StorageOut, status_code=201)
def add_storage(data: schemas.StorageCreate, db: Session = Depends(get_db)):
    storage = models.Storage(**data.model_dump())
    db.add(storage)
    db.commit()
    db.refresh(storage)
    return storage


# ---------- Applications ----------
@app.post("/applications", response_model=schemas.ApplicationOut, status_code=201)
def submit_application(
    data: schemas.ApplicationCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(auth.current_user),
):
    if not db.get(models.Storage, data.storage_id):
        raise HTTPException(404, "Storage not found")
    app_row = models.Application(farmer_id=user.id, **data.model_dump())
    db.add(app_row)
    db.commit()
    db.refresh(app_row)
    return app_row


@app.get("/applications", response_model=list[schemas.ApplicationOut])
def my_applications(
    db: Session = Depends(get_db), user: models.User = Depends(auth.current_user)
):
    return db.query(models.Application).filter(models.Application.farmer_id == user.id).all()


@app.get("/applications/{app_id}", response_model=schemas.ApplicationOut)
def track_application(
    app_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(auth.current_user),
):
    row = db.get(models.Application, app_id)
    if not row or row.farmer_id != user.id:
        raise HTTPException(404, "Application not found")
    return row


@app.patch("/applications/{app_id}/status", response_model=schemas.ApplicationOut)
def update_status(
    app_id: int, data: schemas.StatusUpdate, db: Session = Depends(get_db)
):
    # TODO: sirf storage operator/admin ko allow karna (role check)
    row = db.get(models.Application, app_id)
    if not row:
        raise HTTPException(404, "Application not found")
    row.status = data.status
    db.commit()
    db.refresh(row)
    return row
