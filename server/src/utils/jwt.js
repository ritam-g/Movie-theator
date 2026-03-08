/**
 * JWT Utility Functions
 * 
 * Provides functions for generating and verifying JWT (JSON Web Tokens).
 * JWTs are used for authentication and maintaining user sessions.
 */
const jwt = require("jsonwebtoken");
// Environment configuration
const config = require("../config/env");

/**
 * Generate a new JWT token
 * 
 * @param {Object} payload - Data to encode in the token
 * @returns {string} Signed JWT token
 */
function generateToken(payload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

/**
 * Verify and decode a JWT token
 * 
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

// Export the functions
module.exports = {
  generateToken,
  verifyToken,
};
