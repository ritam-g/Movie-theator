/**
 * Application Constants
 * 
 * This file exports various constant values used throughout the application:
 * - IMAGE_BASE_URL: TMDB base URL for poster images
 * - FALLBACK_POSTER: Placeholder image when no poster is available
 * - FALLBACK_DESCRIPTION: Default description text
 * * FALLBACK_TRAILER_TEXT: Message shown when trailer is unavailable
 * - APP_ROUTES: Application route paths
 */

// TMDB base URL for poster images (w500 size)
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Fallback poster image when movie has no poster
// Can be overridden with VITE_PLACEHOLDER_POSTER environment variable
export const FALLBACK_POSTER =
  import.meta.env.VITE_PLACEHOLDER_POSTER || "https://placehold.co/500x750?text=No+Poster";

// Default description when movie has no description
export const FALLBACK_DESCRIPTION = "Description not available";

// Message shown when trailer is not available for a movie
export const FALLBACK_TRAILER_TEXT = "Trailer for this movie is currently unavailable.";

// Application route paths - centralized route constants
export const APP_ROUTES = {
  HOME: "/",
  MOVIE_DETAILS: "/movie/:id",
  SEARCH: "/search",
  FAVORITES: "/favorites",
  LOGIN: "/login",
  REGISTER: "/register",
  ADMIN: "/admin",
};
