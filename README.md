# Employee Management System

A full-stack app to create, view, update, delete and search employee records.

- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express (REST API)
- **Database:** PostgreSQL

```
employee-management-system/
├── backend/
│   ├── db/                 schema.sql (migration) + seed.sql (sample data)
│   ├── scripts/migrate.js  applies the schema / seed
│   └── src/
│       ├── config/db.js            PostgreSQL connection pool
│       ├── routes/                 URL -> controller mapping
│       ├── controllers/            HTTP request/response handling
│       ├── models/                 SQL queries (the only layer that touches the DB)
│       └── middleware/             validation, HttpError, error handler
└── frontend/
    └── src/
        ├── api.js                  all fetch calls + error normalisation
        ├── validation.js           client-side form rules
        ├── App.jsx                 state: list, search, loading, errors, modals
        └── components/             EmployeeTable, EmployeeForm, SearchBar, Modal
```

## Prerequisites

- Node.js 18 or newer
- PostgreSQL 13 or newer

## Setup

### 1. Create the database

```bash
psql -U postgres -c "CREATE DATABASE employee_db;"
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env        # then edit PGUSER / PGPASSWORD to match your PostgreSQL
npm run migrate             # creates the employees table
npm run seed                # optional: adds 5 sample employees
npm run dev                 # http://localhost:5000  (or: npm start)
```

### 3. Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

Open http://localhost:5173. In development Vite proxies `/api` to the backend on port 5000, so no extra configuration is needed.

To build for production: `npm run build` (output in `frontend/dist`). If the API is hosted elsewhere, set `VITE_API_URL` before building (see `frontend/.env.example`).

## Database schema

```sql
CREATE TABLE employees (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(100)  NOT NULL,
    email        VARCHAR(150)  NOT NULL,
    department   VARCHAR(100)  NOT NULL,
    designation  VARCHAR(100)  NOT NULL,
    salary       NUMERIC(12,2) NOT NULL CHECK (salary >= 0),
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX employees_email_unique ON employees (LOWER(email));
```

Full script: `backend/db/schema.sql`.

## API documentation

Base URL: `http://localhost:5000/api`. All bodies are JSON.

| Method | Endpoint             | Description                                   | Success |
|--------|----------------------|-----------------------------------------------|---------|
| GET    | `/employees`         | List all employees. `?search=` filters by name or email (case-insensitive, partial match) | 200 |
| GET    | `/employees/:id`     | Get one employee                              | 200 |
| POST   | `/employees`         | Create an employee                            | 201 |
| PUT    | `/employees/:id`     | Update an employee (send all fields)          | 200 |
| DELETE | `/employees/:id`     | Delete an employee                            | 204 |
| GET    | `/health`            | Health check                                  | 200 |

### Request body (POST / PUT)

| Field         | Rules                                  |
|---------------|----------------------------------------|
| `name`        | required, 2–100 characters             |
| `email`       | required, valid format, unique (case-insensitive) |
| `department`  | required, up to 100 characters         |
| `designation` | required, up to 100 characters         |
| `salary`      | required, number >= 0                  |

### Status codes

| Code | Meaning |
|------|---------|
| 200 / 201 / 204 | Success |
| 400 | Validation failed, invalid id, or malformed JSON |
| 404 | Employee or route not found |
| 409 | Email already in use |
| 500 | Unexpected server error |

### Error format

```json
{
  "error": {
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Enter a valid email address" }
    ]
  }
}
```

### Example requests

```bash
# Create
curl -X POST http://localhost:5000/api/employees \
  -H "Content-Type: application/json" \
  -d '{"name":"Asha Verma","email":"asha@example.com","department":"Engineering","designation":"Developer","salary":1200000}'

# List, and search
curl http://localhost:5000/api/employees
curl "http://localhost:5000/api/employees?search=asha"

# Get one
curl http://localhost:5000/api/employees/1

# Update
curl -X PUT http://localhost:5000/api/employees/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Asha Verma","email":"asha@example.com","department":"Engineering","designation":"Senior Developer","salary":1500000}'

# Delete
curl -X DELETE http://localhost:5000/api/employees/1
```

Example success response (`POST`, status 201):

```json
{
  "data": {
    "id": 1,
    "name": "Asha Verma",
    "email": "asha@example.com",
    "department": "Engineering",
    "designation": "Developer",
    "salary": 1200000,
    "created_at": "2026-10-22T09:30:00.000Z",
    "updated_at": "2026-10-22T09:30:00.000Z"
  }
}
```

## Implementation decisions

- **Layered backend (routes -> controllers -> models).** Each layer has one job, so SQL, HTTP handling and routing can change independently.
- **Validation in two places.** The frontend gives instant feedback; the backend is the real guard and never trusts the client. Both use the same rules.
- **Unique email enforced by the database.** A unique index on `LOWER(email)` is race-safe, unlike checking first and inserting after. The API turns PostgreSQL error `23505` into a `409` that the form shows next to the email field.
- **Parameterised queries everywhere** (`$1, $2…`) to prevent SQL injection. `%` and `_` in search terms are escaped so they match literally.
- **`NUMERIC(12,2)` for salary** to avoid floating-point errors; the API converts it to a JavaScript number.
- **Consistent error shape** (`error.message` + `error.details[]`) so the frontend can map errors to fields.
- **Frontend search is debounced (300 ms)** and ignores stale responses, so fast typing can't show out-of-date results.
- **Loading, empty and error states** are handled explicitly, with a retry button when the API is unreachable.

## Git

```bash
git init
git add .
git commit -m "Employee Management System"
git remote add origin <your-repository-url>
git push -u origin main
```
