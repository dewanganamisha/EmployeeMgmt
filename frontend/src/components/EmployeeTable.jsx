import { formatSalary } from '../validation.js';

const initials = (name) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');

export default function EmployeeTable({ employees, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Designation</th>
            <th className="num">Salary</th>
            <th><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>
                <div className="person">
                  <span className="avatar" aria-hidden="true">{initials(emp.name)}</span>
                  <div>
                    <div className="person-name">{emp.name}</div>
                    <div className="person-email">{emp.email}</div>
                  </div>
                </div>
              </td>
              <td>{emp.department}</td>
              <td>{emp.designation}</td>
              <td className="num">{formatSalary(emp.salary)}</td>
              <td className="row-actions">
                <button className="btn small" onClick={() => onEdit(emp)} aria-label={`Edit ${emp.name}`}>Edit</button>
                <button className="btn small danger" onClick={() => onDelete(emp)} aria-label={`Delete ${emp.name}`}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
