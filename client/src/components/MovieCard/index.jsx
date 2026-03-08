import { Link } from "react-router-dom";
import { getMovieTitle, getPosterUrl, getReleaseYear } from "../../utils/helpers";

function MovieCard({
  movie = {},
  onOpen,
  onToggleFavorite,
  isFavorite = false,
  showFavoriteAction = false,
}) {
  const title = getMovieTitle(movie);
  const rating = Number(movie.vote_average || movie.rating || 0).toFixed(1);
  const year = getReleaseYear(movie.release_date || movie.first_air_date || movie.releaseDate);
  const identifier = movie.id || movie.tmdbId;

  return (
    <article className="card">
      <img
        src={getPosterUrl(movie.poster_path)}
        alt={title}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.src = getPosterUrl(null);
        }}
      />
      <div className="card-body">
        <strong>{title}</strong>
        <div className="meta">Rating: {rating}</div>
        <div className="meta">Year: {year || "N/A"}</div>
        <div className="card-actions">
          <Link className="button-link" to={`/movie/${identifier}`} onClick={() => onOpen?.(movie)}>
            View Details
          </Link>
          {showFavoriteAction ? (
            <button type="button" onClick={() => onToggleFavorite?.(movie)}>
              {isFavorite ? "Remove Favorite" : "Add Favorite"}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default MovieCard;
