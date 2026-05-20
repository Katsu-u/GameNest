function notFoundHandler(req, res) {
  res.status(404).json({
    error: "Route not found"
  });
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    error: error.message || "Internal server error"
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
