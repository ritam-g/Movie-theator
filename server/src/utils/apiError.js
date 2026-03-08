/**
 * Custom API Error Class
 * 
 * A custom error class for handling API errors with HTTP status codes.
 * Extends the built-in Error class to include additional error metadata.
 */
class ApiError extends Error {
  /**
   * Create an API error
   * 
   * @param {number} statusCode - HTTP status code (e.g., 400, 404, 500)
   * @param {string} message - Error message
   * @param {any} details - Additional error details (optional)
   */
  constructor(statusCode, message, details = null) {
    // Call the parent Error constructor
    super(message);

    // Set the HTTP status code
    this.statusCode = statusCode;

    // Set additional details
    this.details = details;

    // Set error name
    this.name = "ApiError";
  }
}

module.exports = ApiError;
