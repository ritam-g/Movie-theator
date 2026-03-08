/**
 * TMDB Service
 * 
 * Handles communication with The Movie Database (TMDB) API.
 * Provides movie data, search results, and detailed information.
 */
const axios = require("axios");
// Environment configuration
const config = require("../config/env");

// Create axios instance for TMDB API
const tmdbClient = axios.create({
  baseURL: config.tmdbBaseUrl, // TMDB API base URL
  timeout: 15000, // 15 second timeout
});

/**
 * Fetch data from TMDB API
 * 
 * @param {string} path - API endpoint path (e.g., '/trending/movie/day')
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} TMDB API response data
 * @throws {Error} If API key is not configured or request fails
 */
async function getFromTMDB(path, params = {}) {
  // Check if TMDB API key is configured
  if (!config.tmdbApiKey) {
    throw new Error("TMDB_API_KEY is not configured");
  }

  // Make GET request to TMDB
  const response = await tmdbClient.get(path, {
    params: {
      api_key: config.tmdbApiKey, // Include API key in all requests
      ...params, // Spread additional parameters
    },
  });

  return response.data;
}

// Export service functions
module.exports = {
  getFromTMDB,
};
