/**
 * Favorite Service - API calls for favorites and watch history
 * 
 * This service provides functions to manage:
 * - User's favorite movies
 * - User's watch history (movies they've viewed)
 */
import api from "./api";

export const favoriteService = {
  /**
   * Get all favorite movies for the current user
   * Requires authentication
   * @returns {Promise} Axios response with favorites list
   */
  getFavorites() {
    return api.get("/favorites");
  },

  /**
   * Add a movie to favorites
   * Requires authentication
   * @param {Object} payload - Movie data to add
   * @returns {Promise} Axios response with updated favorites
   */
  addFavorite(payload) {
    return api.post("/favorites/add", payload);
  },

  /**
   * Remove a movie from favorites
   * Requires authentication
   * @param {Object} payload - Movie identifier to remove (movieId or tmdbId)
   * @returns {Promise} Axios response with updated favorites
   */
  removeFavorite(payload) {
    return api.delete("/favorites/remove", { data: payload });
  },

  /**
   * Get user's watch history
   * Requires authentication
   * @returns {Promise} Axios response with watch history
   */
  getHistory() {
    return api.get("/history");
  },

  /**
   * Add an item to watch history
   * Requires authentication
   * @param {Object} payload - Movie data to add to history
   * @returns {Promise} Axios response with updated history
   */
  addHistory(payload) {
    return api.post("/history/add", payload);
  },
};
