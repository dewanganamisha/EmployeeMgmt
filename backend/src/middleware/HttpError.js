class HttpError extends Error {
  constructor(status, message, details = []) {
    super(message);
    this.status = status;
    this.details = details; // [{ field, message }]
  }
}

module.exports = HttpError;
