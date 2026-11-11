# Seva Crop Storage: Backend

REST API for the Seva Crop Storage project, built with FastAPI. It handles farmer registration and login, storage facility listings, application submission, and application tracking.

## Getting Started

### Prerequisites
- Python 3.10 or later

### Installation and Run
```bash
pip install -r requirements.txt
python seed.py            # optional: loads sample data and a demo operator account
uvicorn main:app --reload
```

Interactive API documentation is available at http://localhost:8000/docs once the server is running.

### Configuration
The application reads the following environment variables:

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | Database connection string | `sqlite:///./seva.db` |
| `SECRET_KEY` | Secret used to sign authentication tokens | development placeholder (must be changed in production) |

To use PostgreSQL:
```
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/seva_storage
```

> **Note:** If the data models change, delete the existing `seva.db` file so the tables are recreated.

## Testing
```bash
pytest
```
Tests run against a separate database (`test_seva.db`) and do not affect development data.

## User Roles

| Role | Permissions |
|---|---|
| `farmer` | Register, submit, track, and cancel their own applications |
| `operator` | Add storage facilities, view all applications, and update application status |

## API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create a new user (farmer or operator) |
| POST | `/auth/login` | Public | Log in with phone and password; returns an access token |
| GET | `/me` | Authenticated | View the current user's profile |
| PATCH | `/me` | Authenticated | Update the current user's profile |
| GET | `/storages` | Public | List storage facilities (filters: `district`, `min_available_kg`) |
| GET | `/storages/{id}` | Public | Get details of a storage facility |
| POST | `/storages` | Operator | Add a storage facility |
| POST | `/applications` | Authenticated | Submit a storage application |
| GET | `/applications` | Authenticated | List the current user's applications (filter: `status`) |
| GET | `/applications/{id}` | Owner or operator | View an application with its status history |
| PATCH | `/applications/{id}/cancel` | Owner | Cancel a pending or approved application |
| GET | `/operator/applications` | Operator | List all applications (filters: `status`, `storage_id`) |
| PATCH | `/applications/{id}/status` | Operator | Update an application's status |

## Application Lifecycle

```
pending → approved → stored → completed
   └→ rejected        └→ cancelled
```

- Each status change is recorded with a timestamp and an optional note, and is returned in the application's `events` list.
- Submitting an application validates the requested quantity against the storage facility's minimum quantity and available capacity.
- Approving an application reduces the facility's `available_kg`. Rejecting, cancelling, or completing an approved application restores it.
- Applications in a final state (`rejected`, `cancelled`, `completed`) cannot be changed.

## Project Structure

| File | Purpose |
|---|---|
| `main.py` | API routes and application logic |
| `models.py` | Database models |
| `schemas.py` | Request and response validation |
| `auth.py` | Password hashing, token handling, role checks |
| `database.py` | Database connection and session management |
| `seed.py` | Sample data loader (for demonstration only) |
| `test_api.py` | Automated API tests |

## Known Limitations and Next Steps
- Storage facilities are not yet linked to specific operator accounts, so any operator can update any application.
- `SECRET_KEY` and the allowed CORS origins must be configured before any production deployment.
- Data fields may be adjusted once the final problem gap is confirmed through farmer and operator research.
