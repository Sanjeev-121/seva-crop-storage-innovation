# Seva Crop Storage: Backend

FastAPI backend: farmer registration/login, storage listing, application submission aur tracking.

## Run karna
```
pip install -r requirements.txt
python seed.py            # optional: sample data + demo operator
uvicorn main:app --reload
```
API docs: http://localhost:8000/docs

PostgreSQL ke liye environment variable set karein:
```
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/seva_storage
SECRET_KEY=<koi lamba random string>
```
Bina `DATABASE_URL` ke SQLite (`seva.db`) use hota hai.

**Note:** models badalne par purani `seva.db` file delete karni padegi (tables dobara banenge).

## Tests
```
pytest
```

## Roles
- `farmer`: register, apni applications submit/track/cancel karta hai.
- `operator`: storage add karta hai, applications ka status badalta hai.

## Endpoints
| Method | Path | Kaun | Kaam |
|---|---|---|---|
| POST | /auth/register | sab | Naya user (farmer ya operator) |
| POST | /auth/login | sab | JSON login, token milta hai |
| GET / PATCH | /me | login | Profile dekhna / badalna |
| GET | /storages | sab | List (`?district=`, `?min_available_kg=`) |
| GET | /storages/{id} | sab | Ek storage ki detail |
| POST | /storages | operator | Storage add karna |
| POST | /applications | farmer | Application submit |
| GET | /applications | farmer | Meri applications (`?status=`) |
| GET | /applications/{id} | farmer/operator | Tracking + history |
| PATCH | /applications/{id}/cancel | farmer | Cancel karna |
| GET | /operator/applications | operator | Saari applications |
| PATCH | /applications/{id}/status | operator | Status badalna |

## Application status
`pending` → `approved` → `stored` → `completed`  (ya `rejected` / `cancelled`)

Approve karne par storage ki `available_kg` ghat jati hai, aur reject/cancel/complete par wapas badh jati hai.

## Abhi baaki
- Storage ko ek specific operator se link karna.
- Production mein `SECRET_KEY` aur CORS origins set karna.
