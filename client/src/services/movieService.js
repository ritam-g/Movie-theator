/**
 * Movie Service - API calls for movie-related operations
 * 
 * This service provides functions to interact with the movie endpoints on the server.
 * All functions return Axios promises that can be used with async/await.
 */
import api from "./api";

export const movieService = {
  /**
   * Get movies list (trending, popular, TV shows, etc.)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number for pagination
   * @param {string} params.type - Type of movies (trending, popular, tv, etc.)
   * @returns {Promise} Axios response with movies data
   */
  getMovies(params = {}) {
    return api.get("/movies", { params });
  },

  /**
   * Get detailed information about a specific movie
   * @param {string|number} id - Movie ID (TMDB ID or local ID)
   * @returns {Promise} Axios response with movie details
   */
  getMovieById(id) {
    return api.get(`/movies/${id}`);
  },

  /**
   * Search for movies by query string
   * @param {string} query - Search query
   * @param {number} page - Page number for pagination
   * @param {string} type - Type of search (default: "search")
   * @returns {Promise} Axios response with search results
   */
  search(query, page = 1, type = "search") {
    return api.get("/movies", { params: { query, page, type } });
  },
};
