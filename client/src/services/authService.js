/**
 * Auth Service - API calls for authentication operations
 * 
 * This service provides functions to handle user authentication:
 * - Register new user
 * - Login existing user
 * - Get user profile
 */
import api from "./api";

export const authService = {
  /**
   * Register a new user account
   * @param {Object} payload - User registration data
   * @param {string} payload.name - User's name
   * @param {string} payload.email - User's email
   * @param {string} payload.password - User's password
   * @returns {Promise} Axios response with user data and token
   */
  register(payload) {
    return api.post("/auth/register", payload);
  },

  /**
   * Login with existing credentials
   * @param {Object} payload - Login credentials
   * @param {string} payload.email - User's email
   * @param {string} payload.password - User's password
   * @returns {Promise} Axios response with user data and token
   */
  login(payload) {
    return api.post("/auth/login", payload);
  },

  /**
   * Get the current user's profile
   * Requires authentication (valid JWT token)
   * @returns {Promise} Axios response with user profile data
   */
  profile() {
    return api.get("/auth/profile");
  },
};
