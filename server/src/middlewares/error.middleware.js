const ApiError = require("../utils/apiError");

function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
}

function errorMiddleware(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  if (process.env.NODE_ENV !== "test") {
    console.error("[API ERROR]", message);
  }

  res.status(statusCode).json({
    message,
    details: error.details || null,
  });
}

module.exports = {
  notFoundHandler,
  errorMiddleware,
};
