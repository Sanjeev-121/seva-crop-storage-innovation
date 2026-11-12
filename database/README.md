# Seva Crop Storage Innovation – Database Documentation

## 1. Database Overview

The Seva Crop Storage Innovation project uses **PostgreSQL** as its relational database management system.

The database manages farmer information, storage facility details, storage applications and application status history.

**Database Name:** `seva-storage`  
**Database:** PostgreSQL 18.6  
**Schema:** `public`

## 2. Database Structure

The database currently contains four main tables:

| Table | Description |
|---|---|
| `users` | Stores farmer and user information |
| `storages` | Stores crop storage facility details |
| `applications` | Stores farmer storage applications |
| `application_events` | Maintains application status history |

## 3. Table Details

### 3.1 users

Stores user and farmer information.

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| name | VARCHAR(100) | User name |
| phone | VARCHAR(15) | Phone number (unique) |
| village | VARCHAR(100) | Village |
| district | VARCHAR(100) | District |
| state | VARCHAR(100) | State |
| role | VARCHAR(20) | User role |
| password_hash | VARCHAR(255) | Hashed password |
| created_at | TIMESTAMP | Account creation time |

### 3.2 storages

Stores information about available crop storage facilities.

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| name | VARCHAR(150) | Storage facility name |
| type | VARCHAR(50) | Storage type |
| district | VARCHAR(100) | District |
| state | VARCHAR(100) | State |
| capacity_kg | DOUBLE PRECISION | Total capacity |
| available_kg | DOUBLE PRECISION | Available capacity |
| min_quantity_kg | DOUBLE PRECISION | Minimum storage quantity |
| price_per_kg_month | DOUBLE PRECISION | Monthly price per kg |
| other_charges | TEXT | Additional charges |
| contact_phone | VARCHAR(15) | Contact number |

### 3.3 applications

Stores farmer requests for crop storage.

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| farmer_id | INTEGER | References users(id) |
| storage_id | INTEGER | References storages(id) |
| crop | VARCHAR(100) | Crop name |
| quantity_kg | DOUBLE PRECISION | Crop quantity |
| duration_months | INTEGER | Storage duration |
| status | VARCHAR(30) | Application status |
| created_at | TIMESTAMP | Application creation time |

### 3.4 application_events

Maintains the history of application status changes.

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| application_id | INTEGER | References applications(id) |
| status | VARCHAR(30) | Updated status |
| note | TEXT | Additional remarks |
| created_at | TIMESTAMP | Event creation time |

## 4. Database Relationships

The database uses foreign keys to connect related records.

- One user can submit multiple applications.
- One storage facility can receive multiple applications.
- One application can have multiple status events.

**Foreign key relationships:**

- `applications.farmer_id` → `users.id`
- `applications.storage_id` → `storages.id`
- `application_events.application_id` → `applications.id`

## 5. Indexes and Constraints

The database includes:

- Primary keys on all four tables.
- Unique index on `users.phone`.
- Index on `storages.district`.
- Foreign key constraints for relational integrity.
- Automatically generated IDs using PostgreSQL sequences.

## 6. Database Setup

### Requirements
- PostgreSQL 18 or compatible version.
- pgAdmin 4 (optional, for graphical database management).

### Import Database

1. Create a database named `seva-storage`.
2. Open pgAdmin 4.
3. Select the newly created database.
4. Open Query Tool.
5. Open and execute `seva-storage.sql`.

Alternatively, restore the plain SQL dump using the PostgreSQL command-line tool:

```bash
psql -U postgres -d seva-storage -f seva-storage.sql
```

## 7. Database Backup

The database schema can be exported using pgAdmin 4 Backup with the Plain format and Only schema option.

## 8. Technology Used

- PostgreSQL 18.6
- SQL
- pgAdmin 4

## 9. Project Responsibility

**Database Management, Testing and Integration Support**

The database work includes:
- Database creation and configuration.
- Table structure management.
- Primary key and foreign key configuration.
- Database backup and schema export.
- Database and API testing support.

---

**Project:** Seva Crop Storage Innovation  
**Database File:** `seva-storage.sql`  
**Documentation:** `database/README.md`
