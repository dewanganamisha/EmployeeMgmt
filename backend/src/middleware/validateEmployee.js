const HttpError = require('./HttpError');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_SALARY = 9999999999.99;

/**
 * Validates and sanitises the request body for POST / PUT.
 * On success req.body is replaced with trimmed, typed values.
 */
function validateEmployee(req, res, next) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const errors = [];
  const add = (field, message) => errors.push({ field, message });

  const text = (field) => (typeof body[field] === 'string' ? body[field].trim() : '');

  const name = text('name');
  if (!name) add('name', 'Name is required');
  else if (name.length < 2) add('name', 'Name must be at least 2 characters');
  else if (name.length > 100) add('name', 'Name must be 100 characters or fewer');

  const email = text('email').toLowerCase();
  if (!email) add('email', 'Email is required');
  else if (email.length > 150 || !EMAIL_RE.test(email)) add('email', 'Enter a valid email address');

  const department = text('department');
  if (!department) add('department', 'Department is required');
  else if (department.length > 100) add('department', 'Department must be 100 characters or fewer');

  const designation = text('designation');
  if (!designation) add('designation', 'Designation is required');
  else if (designation.length > 100) add('designation', 'Designation must be 100 characters or fewer');

  let salary = body.salary;
  if (salary === undefined || salary === null || (typeof salary === 'string' && salary.trim() === '')) {
    add('salary', 'Salary is required');
  } else {
    salary = typeof salary === 'string' ? Number(salary.trim()) : salary;
    if (typeof salary !== 'number' || !Number.isFinite(salary)) add('salary', 'Salary must be a number');
    else if (salary < 0) add('salary', 'Salary cannot be negative');
    else if (salary > MAX_SALARY) add('salary', 'Salary is too large');
  }

  if (errors.length) return next(new HttpError(400, 'Validation failed', errors));

  req.body = { name, email, department, designation, salary: Math.round(salary * 100) / 100 };
  next();
}

/** Ensures :id is a positive integer. */
function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return next(new HttpError(400, 'Employee id must be a positive integer'));
  }
  req.params.id = id;
  next();
}

module.exports = { validateEmployee, validateId };
