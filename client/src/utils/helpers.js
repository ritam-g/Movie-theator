/**
 * Helper Utility Functions
 * 
 * This file contains various helper functions used throughout the application:
 * - getPosterUrl: Formats poster image URLs
 * - getReleaseYear: Extracts year from date string
 * - safeText/safeDescription: Safe text handling with fallbacks
 * - getMovieTitle: Gets title from movie object (handles different formats)
 * - formatDate: Formats dates for display
 */
import { FALLBACK_DESCRIPTION, FALLBACK_POSTER, IMAGE_BASE_URL } from "./constants";

/**
 * Get the full poster image URL
 * Handles different formats: full URL, TMDB path, or fallback
 * 
 * @param {string} posterPath - Poster path or URL
 * @returns {string} Full URL to the poster image
 */
export function getPosterUrl(posterPath) {
  // Return fallback if no poster path provided
  if (!posterPath) return FALLBACK_POSTER;
  // If already a full URL (http/https), return as-is
  if (String(posterPath).startsWith("http")) return posterPath;
  // Otherwise, prepend the TMDB image base URL
  return `${IMAGE_BASE_URL}${posterPath}`;
}

/**
 * Extract the release year from a date string
 * 
 * @param {string} dateString - Date string (e.g., "2023-05-15")
 * @returns {string} Year as string (e.g., "2023") or empty string if invalid
 */
export function getReleaseYear(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return String(date.getFullYear());
}

/**
 * Safely get text value with a fallback
 * Used to handle potentially undefined/null values
 * 
 * @param {string} value - The value to check
 * @param {string} fallback - Fallback text if value is empty
 * @returns {string} The value or fallback
 */
export function safeText(value, fallback = "Description not available") {
  return value?.trim?.() ? value : fallback;
}

/**
 * Safe description getter with default fallback
 * 
 * @param {string} value - Description text
 * @returns {string} The description or fallback
 */
export function safeDescription(value) {
  return safeText(value, FALLBACK_DESCRIPTION);
}

/**
 * Get movie title from movie object
 * Movie objects can have different title field names (title, name)
 * 
 * @param {Object} movie - Movie object
 * @returns {string} The movie title or "Untitled"
 */
export function getMovieTitle(movie = {}) {
  return movie.title || movie.name || "Untitled";
}

/**
 * Format a date value for display
 * 
 * @param {string|Date} value - Date value
 * @returns {string} Formatted date string (e.g., "May 15, 2023") or "N/A"
 */
export function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString();
}
