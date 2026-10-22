import { useCallback, useEffect, useState } from 'react';
import * as api from './api.js';
import SearchBar from './components/SearchBar.jsx';
import EmployeeTable from './components/EmployeeTable.jsx';
import EmployeeForm from './components/EmployeeForm.jsx';
import Modal from './components/Modal.jsx';

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState(''); // debounced search term
  const [reloadKey, setReloadKey] = useState(0);

  const [formTarget, setFormTarget] = useState(null); // null | 'new' | employee
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [toast, setToast] = useState('');

  // Debounce typing so we don't call the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Load employees whenever the query changes or a reload is requested.
  useEffect(() => {
    let ignore = false; // prevents an older, slower response overwriting a newer one
    setLoading(true);
    setLoadError('');
    api
      .getEmployees(query)
      .then((data) => !ignore && setEmployees(data))
      .catch((err) => !ignore && setLoadError(err.message))
      .finally(() => !ignore && setLoading(false));
    return () => { ignore = true; };
  }, [query, reloadKey]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  const handleSave = async (payload) => {
    if (formTarget === 'new') {
      await api.createEmployee(payload);
      setToast('Employee added');
    } else {
      await api.updateEmployee(formTarget.id, payload);
      setToast('Changes saved');
    }
    setFormTarget(null);
    reload();
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await api.deleteEmployee(deleteTarget.id);
      setDeleteTarget(null);
      setToast('Employee deleted');
      reload();
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page">
      <header className="top">
        <div>
          <h1>Employees</h1>
          <p className="muted">
            {loading ? 'Loading…' : `${employees.length} ${employees.length === 1 ? 'person' : 'people'}${query ? ' match your search' : ''}`}
          </p>
        </div>
        <button className="btn primary" onClick={() => setFormTarget('new')}>Add employee</button>
      </header>

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <main className="card">
        {loadError ? (
          <div className="state">
            <p className="error-text">{loadError}</p>
            <button className="btn" onClick={reload}>Try again</button>
          </div>
        ) : loading && employees.length === 0 ? (
          <div className="state"><span className="spinner" aria-hidden="true" /> Loading employees…</div>
        ) : employees.length === 0 ? (
          <div className="state">
            {query ? (
              <p>No employees match “{query}”. Try a different name or email.</p>
            ) : (
              <>
                <p>No employees yet. Add your first one to get started.</p>
                <button className="btn primary" onClick={() => setFormTarget('new')}>Add employee</button>
              </>
            )}
          </div>
        ) : (
          <div className={loading ? 'dim' : ''}>
            <EmployeeTable employees={employees} onEdit={setFormTarget} onDelete={(e) => { setDeleteError(''); setDeleteTarget(e); }} />
          </div>
        )}
      </main>

      {formTarget && (
        <Modal title={formTarget === 'new' ? 'Add employee' : 'Edit employee'} onClose={() => setFormTarget(null)}>
          <EmployeeForm
            employee={formTarget === 'new' ? null : formTarget}
            onSubmit={handleSave}
            onCancel={() => setFormTarget(null)}
          />
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="Delete employee" onClose={() => !deleting && setDeleteTarget(null)}>
          <p>Delete <strong>{deleteTarget.name}</strong>? This removes their record permanently.</p>
          {deleteError && <div className="alert" role="alert">{deleteError}</div>}
          <div className="actions">
            <button className="btn ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
            <button className="btn danger solid" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete employee'}
            </button>
          </div>
        </Modal>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
