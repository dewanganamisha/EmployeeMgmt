const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/employees', employeeRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
