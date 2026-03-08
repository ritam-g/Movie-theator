const ApiError = require("../utils/apiError");
const config = require("../config/env");

function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
}

function errorMiddleware(error, req, res, next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";
  let details = error.details || null;

  if (error?.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    details = Object.values(error.errors || {}).map((entry) => entry.message);
  }

  if (error?.code === 11000) {
    statusCode = 409;
    message = "Duplicate value violates unique constraint";
    details = error.keyValue || null;
  }

  if (error?.name === "CastError") {
    statusCode = 400;
    message = "Invalid identifier format";
  }

  if (config.nodeEnv !== "test") {
    console.error("[API ERROR]", message);
  }

  res.status(statusCode).json({
    message,
    details,
    stack: config.nodeEnv === "development" ? error.stack : undefined,
  });
}

module.exports = {
  notFoundHandler,
  errorMiddleware,
};
