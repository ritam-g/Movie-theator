/**
 * Error Middleware
 * 
 * Handles errors throughout the Express application.
 * Provides centralized error handling with proper HTTP status codes.
 */
const ApiError = require("../utils/apiError");
// Environment configuration
const config = require("../config/env");

/**
 * 404 Not Found Handler
 * Catches requests to undefined routes
 */
function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
}

/**
 * Global Error Handler
 * Catches all errors and returns appropriate JSON response
 */
function errorMiddleware(error, req, res, next) {
  // Determine HTTP status code
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";
  let details = error.details || null;

  // Handle Mongoose ValidationError
  if (error?.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    details = Object.values(error.errors || {}).map((entry) => entry.message);
  }

  // Handle Mongoose duplicate key error (11000)
  if (error?.code === 11000) {
    statusCode = 409;
    message = "Duplicate value violates unique constraint";
    details = error.keyValue || null;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (error?.name === "CastError") {
    statusCode = 400;
    message = "Invalid identifier format";
  }

  // Log error in non-test environments
  if (config.nodeEnv !== "test") {
    console.error("[API ERROR]", message);
  }

  // Send error response
  res.status(statusCode).json({
    message,
    details,
    // Include stack trace only in development
    stack: config.nodeEnv === "development" ? error.stack : undefined,
  });
}

// Export middleware functions
module.exports = {
  notFoundHandler,
  errorMiddleware,
};
