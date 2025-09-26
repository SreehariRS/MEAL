// 404 handler
export function notFoundHandler(_req, res, _next) {
  res.status(404).json({ message: 'Not Found' });
}

// Centralized error handler
export function errorHandler(err, _req, res, _next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server Error' });
}


