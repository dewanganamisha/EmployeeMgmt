CREATE TABLE IF NOT EXISTS employees (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(100)  NOT NULL,
    email        VARCHAR(150)  NOT NULL,
    department   VARCHAR(100)  NOT NULL,
    designation  VARCHAR(100)  NOT NULL,
    salary       NUMERIC(12,2) NOT NULL CHECK (salary >= 0),
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS employees_email_unique
    ON employees (LOWER(email));

CREATE INDEX IF NOT EXISTS employees_name_idx
    ON employees (LOWER(name));
