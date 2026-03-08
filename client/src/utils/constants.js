export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
export const FALLBACK_POSTER =
  import.meta.env.VITE_PLACEHOLDER_POSTER || "https://placehold.co/500x750?text=No+Poster";
export const FALLBACK_DESCRIPTION = "Description not available";
export const FALLBACK_TRAILER_TEXT = "Trailer for this movie is currently unavailable.";

export const APP_ROUTES = {
  HOME: "/",
  MOVIE_DETAILS: "/movie/:id",
  SEARCH: "/search",
  FAVORITES: "/favorites",
  LOGIN: "/login",
  REGISTER: "/register",
  ADMIN: "/admin",
};
