/**
 * Environment Configuration
 * 
 * Loads and validates environment variables required for the application.
 * Provides default values where appropriate and throws errors for missing required variables.
 */
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

/**
 * Parse a number from environment variable with fallback
 * 
 * @param {string} value - The value to parse
 * @param {number} fallbackValue - Fallback value if parsing fails
 * @returns {number} Parsed number or fallback
 */
function parseNumber(value, fallbackValue) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallbackValue;
}

/**
 * Build and validate configuration object
 * Reads from process.env and provides defaults
 */
function buildConfig() {
  const config = {
    // Node environment (development, production, test)
    nodeEnv: process.env.NODE_ENV || "development",

    // Server port
    port: parseNumber(process.env.PORT, 5000),

    // MongoDB connection URI
    mongoUri: process.env.MONGO_URI,

    // JWT secret for token signing
    jwtSecret: process.env.JWT_SECRET,

    // JWT token expiration time
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

    // TMDB API key for movie data
    tmdbApiKey: process.env.TMDB_API_KEY || "",

    // TMDB API base URL
    tmdbBaseUrl: process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3",

    // Client URL for CORS
    clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  };

  // List of required environment variables
  const requiredVariables = [
    { key: "MONGO_URI", value: config.mongoUri },
    { key: "JWT_SECRET", value: config.jwtSecret },
  ];

  // Find missing required variables
  const missingKeys = requiredVariables.filter((entry) => !entry.value).map((entry) => entry.key);

  // Throw error if any required variables are missing
  if (missingKeys.length > 0) {
    throw new Error(`Missing required environment variables: ${missingKeys.join(", ")}`);
  }

  return config;
}

// Export the configuration object
module.exports = buildConfig();
