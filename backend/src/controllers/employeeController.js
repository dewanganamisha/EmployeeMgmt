// HTTP layer: reads the request, calls the model, shapes the response.
const Employee = require('../models/employeeModel');
const HttpError = require('../middleware/HttpError');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const list = asyncHandler(async (req, res) => {
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const employees = await Employee.findAll(search);
  res.json({ data: employees, count: employees.length });
});

const getOne = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) throw new HttpError(404, 'Employee not found');
  res.json({ data: employee });
});

const create = asyncHandler(async (req, res) => {
  const employee = await Employee.create(req.body);
  res.status(201).location(`/api/employees/${employee.id}`).json({ data: employee });
});

const update = asyncHandler(async (req, res) => {
  const employee = await Employee.update(req.params.id, req.body);
  if (!employee) throw new HttpError(404, 'Employee not found');
  res.json({ data: employee });
});

const remove = asyncHandler(async (req, res) => {
  const deleted = await Employee.remove(req.params.id);
  if (!deleted) throw new HttpError(404, 'Employee not found');
  res.status(204).end();
});

module.exports = { list, getOne, create, update, remove };
