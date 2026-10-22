// Client-side validation. Mirrors the rules enforced by the API.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmployee(values) {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const department = values.department.trim();
  const designation = values.designation.trim();
  const salary = String(values.salary).trim();

  if (!name) errors.name = 'Name is required';
  else if (name.length < 2) errors.name = 'Name must be at least 2 characters';
  else if (name.length > 100) errors.name = 'Name must be 100 characters or fewer';

  if (!email) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address';

  if (!department) errors.department = 'Department is required';
  if (!designation) errors.designation = 'Designation is required';

  if (!salary) errors.salary = 'Salary is required';
  else if (Number.isNaN(Number(salary))) errors.salary = 'Salary must be a number';
  else if (Number(salary) < 0) errors.salary = 'Salary cannot be negative';

  return errors;
}

export const formatSalary = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
