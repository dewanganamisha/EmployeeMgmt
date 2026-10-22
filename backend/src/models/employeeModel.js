// Database access only: no HTTP concerns live here.
const pool = require('../config/db');

const COLUMNS = 'id, name, email, department, designation, salary, created_at, updated_at';

// NUMERIC comes back from pg as a string; the API exposes it as a number.
const toEmployee = (row) => (row ? { ...row, salary: Number(row.salary) } : null);

// Escape LIKE wildcards so a search for "50%" is treated literally.
const escapeLike = (text) => text.replace(/[\\%_]/g, '\\$&');

async function findAll(search) {
  if (search) {
    const { rows } = await pool.query(
      `SELECT ${COLUMNS} FROM employees
       WHERE name ILIKE $1 OR email ILIKE $1
       ORDER BY id DESC`,
      [`%${escapeLike(search)}%`]
    );
    return rows.map(toEmployee);
  }
  const { rows } = await pool.query(`SELECT ${COLUMNS} FROM employees ORDER BY id DESC`);
  return rows.map(toEmployee);
}

async function findById(id) {
  const { rows } = await pool.query(`SELECT ${COLUMNS} FROM employees WHERE id = $1`, [id]);
  return toEmployee(rows[0]);
}

async function create({ name, email, department, designation, salary }) {
  const { rows } = await pool.query(
    `INSERT INTO employees (name, email, department, designation, salary)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${COLUMNS}`,
    [name, email, department, designation, salary]
  );
  return toEmployee(rows[0]);
}

async function update(id, { name, email, department, designation, salary }) {
  const { rows } = await pool.query(
    `UPDATE employees
     SET name = $1, email = $2, department = $3, designation = $4, salary = $5, updated_at = NOW()
     WHERE id = $6
     RETURNING ${COLUMNS}`,
    [name, email, department, designation, salary, id]
  );
  return toEmployee(rows[0]);
}

async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM employees WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = { findAll, findById, create, update, remove };
