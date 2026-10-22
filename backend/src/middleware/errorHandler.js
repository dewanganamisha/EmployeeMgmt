const HttpError = require('./HttpError');

function notFound(req, res, next) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Malformed JSON body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { message: 'Request body contains invalid JSON', details: [] } });
  }

  // PostgreSQL unique violation (duplicate email)
  if (err.code === '23505') {
    return res.status(409).json({
      error: {
        message: 'An employee with this email already exists',
        details: [{ field: 'email', message: 'This email is already in use' }],
      },
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: { message: err.message, details: err.details } });
  }

  console.error(err);
  res.status(500).json({ error: { message: 'Internal server error', details: [] } });
}

module.exports = { notFound, errorHandler };
