import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import MovieCard from "../../components/MovieCard";
import Loader from "../../components/Loader";
import { fetchFavorites, fetchHistory, removeFavoriteMovie } from "../../redux/slices/favoriteSlice";

function Favorites() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: favorites, history, loading, error } = useSelector((state) => state.favorites);

  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(fetchFavorites());
    dispatch(fetchHistory());
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section>
      <h1 className="section-title">Favorites</h1>
      {loading ? <Loader label="Loading your favorites..." /> : null}
      {error ? <p className="empty">{error}</p> : null}

      {favorites.length === 0 ? (
        <p className="empty">Your favorite list is empty.</p>
      ) : (
        <div className="card-grid">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.id || movie.tmdbId}
              movie={movie}
              showFavoriteAction
              isFavorite
              onToggleFavorite={() => dispatch(removeFavoriteMovie({ movieId: movie.id, tmdbId: movie.tmdbId }))}
            />
          ))}
        </div>
      )}

      <h2 className="section-title" style={{ marginTop: "1.5rem" }}>
        Recently Watched
      </h2>
      {history.length === 0 ? (
        <p className="empty">You have not watched anything yet.</p>
      ) : (
        <div className="history-list">
          {history.map((item, index) => (
            <article key={`${item.tmdbId}-${index}`} className="history-item">
              <span>{item.title || "Untitled"}</span>
              <span className="meta">{item.source === "trailer" ? "Trailer" : "Details"}</span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Favorites;
