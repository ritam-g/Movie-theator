import { FALLBACK_POSTER, IMAGE_BASE_URL } from "./constants";

export function getPosterUrl(posterPath) {
  if (!posterPath) return FALLBACK_POSTER;
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
