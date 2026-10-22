// All communication with the backend lives here.
const BASE = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(message, status, details = []) {
    super(message);
    this.status = status;
    this.details = details; // [{ field, message }]
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiError('Cannot reach the server. Check that the backend is running.', 0);
  }

  if (res.status === 204) return null;

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(body?.error?.message || 'Something went wrong', res.status, body?.error?.details || []);
  }
  return body;
}

export const getEmployees = (search = '') =>
  request(`/employees${search ? `?search=${encodeURIComponent(search)}` : ''}`).then((r) => r.data);

export const getEmployee = (id) => request(`/employees/${id}`).then((r) => r.data);

export const createEmployee = (payload) =>
  request('/employees', { method: 'POST', body: JSON.stringify(payload) }).then((r) => r.data);

export const updateEmployee = (id, payload) =>
  request(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(payload) }).then((r) => r.data);

export const deleteEmployee = (id) => request(`/employees/${id}`, { method: 'DELETE' });
