/**
 * MovieCard Component
 * 
 * Displays a single movie in a card format with:
 * - Poster image
 * - Title
 * - Rating
 * - Release year
 * - Link to movie details
 * - Optional favorite toggle button
 * 
 * @param {Object} props - Component props
 * @param {Object} props.movie - Movie object containing all movie data
 * @param {Function} props.onOpen - Callback when movie is clicked
 * @param {Function} props.onToggleFavorite - Callback when favorite button is clicked
 * @param {boolean} props.isFavorite - Whether this movie is in user's favorites
 * @param {boolean} props.showFavoriteAction - Whether to show favorite button
 */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { getMovieTitle, getPosterUrl, getReleaseYear } from "../../utils/helpers";

function MovieCard({
  movie = {},
  onOpen,
  onToggleFavorite,
  isFavorite = false,
  showFavoriteAction = false,
}) {
  // Extract movie data using helper functions
  const title = getMovieTitle(movie);
  const rating = Number(movie.vote_average || movie.rating || 0).toFixed(1);
  const year = getReleaseYear(movie.release_date || movie.first_air_date || movie.releaseDate);
  // Get unique identifier (supports both TMDB and local IDs)
  const identifier = movie.id || movie.tmdbId;

  return (
    <motion.article
      className="card card-stagger"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -8 }}
    >
      {/* Movie poster image with lazy loading */}
      <div className="card-poster-wrapper">
        <img
          className="card-poster"
          src={getPosterUrl(movie.poster_path || movie.posterPath || movie.posterUrl)}
          alt={title}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = getPosterUrl(null);
          }}
        />

        {/* Rating badge */}
        <div className="card-rating">
          <FaStar className="star-icon" />
          {rating}
        </div>

        {/* Gradient overlay on hover */}
        <div className="card-overlay" />

        {/* Favorite button */}
        {showFavoriteAction && (
          <motion.button
            type="button"
            className={`card-favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite?.(movie);
            }}
            whileTap={{ scale: 0.9 }}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </motion.button>
        )}
      </div>

      <div className="card-body">
        {/* Movie title */}
        <strong>{title}</strong>
        {/* Movie rating */}
        <div className="meta">Rating: {rating}</div>
        {/* Release year */}
        <div className="meta">Year: {year || "N/A"}</div>
        <div className="card-actions">
          {/* Link to movie details page */}
          <Link className="button-link" to={`/movie/${identifier}`} onClick={() => onOpen?.(movie)}>
            View Details
          </Link>
          {/* Favorite toggle button - only shown if enabled */}
          {showFavoriteAction ? (
            <motion.button
              type="button"
              onClick={() => onToggleFavorite?.(movie)}
              whileTap={{ scale: 0.95 }}
            >
              {isFavorite ? "Remove Favorite" : "Add Favorite"}
            </motion.button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

export default MovieCard;

