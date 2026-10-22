import { useState } from 'react';
import { ApiError } from '../api.js';
import { validateEmployee } from '../validation.js';

const EMPTY = { name: '', email: '', department: '', designation: '', salary: '' };
const DEPARTMENTS = ['Engineering', 'Design', 'Finance', 'Human Resources', 'Marketing', 'Operations', 'Sales'];

const FIELDS = [
  { name: 'name', label: 'Employee name', type: 'text', autoComplete: 'off' },
  { name: 'email', label: 'Email address', type: 'email', autoComplete: 'off' },
  { name: 'department', label: 'Department', type: 'text', list: 'departments' },
  { name: 'designation', label: 'Designation', type: 'text' },
  { name: 'salary', label: 'Salary (INR per year)', type: 'number', min: 0, step: '0.01', inputMode: 'decimal' },
];

export default function EmployeeForm({ employee, onSubmit, onCancel }) {
  const [values, setValues] = useState(
    employee
      ? {
          name: employee.name,
          email: employee.email,
          department: employee.department,
          designation: employee.designation,
          salary: String(employee.salary),
        }
      : EMPTY
  );
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const found = validateEmployee(values);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }

    setSaving(true);
    try {
      await onSubmit({ ...values, salary: Number(values.salary) });
    } catch (err) {
      // Show server-side field errors (e.g. duplicate email) next to the field.
      if (err instanceof ApiError && err.details.length) {
        setErrors(Object.fromEntries(err.details.map((d) => [d.field, d.message])));
      } else {
        setFormError(err.message);
      }
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formError && <div className="alert" role="alert">{formError}</div>}

      {FIELDS.map(({ name, label, ...input }) => (
        <div className="field" key={name}>
          <label htmlFor={name}>{label}</label>
          <input
            id={name}
            name={name}
            value={values[name]}
            onChange={handleChange}
            aria-invalid={Boolean(errors[name])}
            aria-describedby={errors[name] ? `${name}-error` : undefined}
            {...input}
          />
          {errors[name] && <p className="error" id={`${name}-error`}>{errors[name]}</p>}
        </div>
      ))}

      <datalist id="departments">
        {DEPARTMENTS.map((d) => <option key={d} value={d} />)}
      </datalist>

      <div className="actions">
        <button type="button" className="btn ghost" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="btn primary" disabled={saving}>
          {saving ? 'Saving…' : employee ? 'Save changes' : 'Add employee'}
        </button>
      </div>
    </form>
  );
}
