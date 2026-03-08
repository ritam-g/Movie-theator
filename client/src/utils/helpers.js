import { FALLBACK_DESCRIPTION, FALLBACK_POSTER, IMAGE_BASE_URL } from "./constants";

export function getPosterUrl(posterPath) {
  if (!posterPath) return FALLBACK_POSTER;
  if (String(posterPath).startsWith("http")) return posterPath;
  return `${IMAGE_BASE_URL}${posterPath}`;
}

export function getReleaseYear(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return String(date.getFullYear());
}

export function safeText(value, fallback = "Description not available") {
  return value?.trim?.() ? value : fallback;
}

export function safeDescription(value) {
  return safeText(value, FALLBACK_DESCRIPTION);
}

export function getMovieTitle(movie = {}) {
  return movie.title || movie.name || "Untitled";
}

export function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString();
}
