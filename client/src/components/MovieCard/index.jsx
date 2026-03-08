import { getPosterUrl, getReleaseYear } from "../../utils/helpers";

function MovieCard({ movie = {}, onOpen }) {
  const title = movie.title || movie.name || "Untitled";
  const rating = Number(movie.vote_average || 0).toFixed(1);
  const year = getReleaseYear(movie.release_date || movie.first_air_date);

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
        <button type="button" onClick={() => onOpen?.(movie)}>
          View Details
        </button>
      </div>
    </article>
  );
}

export default MovieCard;
