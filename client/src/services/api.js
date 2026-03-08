
/**
 * API Configuration & Axios Instance
 * 
 * This file creates and configures the central Axios instance used for all HTTP requests.
 * It sets up:
 * - Base URL for API requests
 * - Request timeout
 * - Request interceptor for adding authentication token
 * - Response interceptor for error handling
 */
import axios from "axios";

// Get the API base URL from environment variable or use relative URL
// In production (served from same server), use /api
// In development, use localhost:5000/api
const getApiBaseUrl = () => {
  // Check if we're in production mode first
  const isProduction = import.meta.env.MODE === "production" || import.meta.env.PROD === "true";

  // In production, always use relative /api (ignore VITE_API_BASE_URL if set to localhost)
  if (isProduction) {
    return "/api";
  }

  // If explicitly set and NOT localhost, use that URL
  if (import.meta.env.VITE_API_BASE_URL && !import.meta.env.VITE_API_BASE_URL.includes("localhost")) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Development fallback
  return "http://localhost:5000/api";
};

// Create axios instance with default configuration
const api = axios.create({
  // Base URL for all API requests
  baseURL: getApiBaseUrl(),
  // Request timeout in milliseconds (15 seconds)
  timeout: 15000,
});

/**
 * Request Interceptor
 * 
 * Runs before each request is sent to the server.
 * Adds the JWT token from localStorage to the Authorization header.
 */
api.interceptors.request.use((config) => {
  // Get the stored authentication token
  const token = localStorage.getItem("movie_platform_token");

  // If token exists, add it to the Authorization header
  // Format: "Bearer <token>"
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Response Interceptor
 * 
 * Runs after each response is received from the server.
 * Handles errors and transforms them into a consistent format.
 */
api.interceptors.response.use(
  // On success, just return the response
  (response) => response,

  // On error, transform the error message
  (error) => {
    // Extract error message from response or use default
    const message = error?.response?.data?.message || error.message || "Request failed";
    // Return a rejected promise with a standardized Error object
    return Promise.reject(new Error(message));
  }
);

// Export the configured axios instance for use in other files
export default api;


