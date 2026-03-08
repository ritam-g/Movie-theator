/**
 * Favorites Page Component
 * 
 * Displays user's favorite movies and watch history.
 * Features:
 * - Only accessible to logged-in users (redirects to login otherwise)
 * - Displays favorite movies in a grid
 * - Allows removing movies from favorites
 * - Shows watch history (recently watched)
 */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import MovieCard from "../../components/MovieCard";
import Loader from "../../components/Loader";
// Redux actions
import { fetchFavorites, fetchHistory, removeFavoriteMovie } from "../../redux/slices/favoriteSlice";

function Favorites() {
  const dispatch = useDispatch();

  // Get auth state from Redux
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Get favorites and history from Redux
  const { items: favorites, history, loading, error } = useSelector((state) => state.favorites);

  // Fetch favorites and history when component mounts
  useEffect(() => {
    // Only fetch if user is authenticated
    if (!isAuthenticated) return;
    dispatch(fetchFavorites());
    dispatch(fetchHistory());
  }, [dispatch, isAuthenticated]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section>
      <h1 className="section-title">Favorites</h1>

      {/* Loading state */}
      {loading ? <Loader label="Loading your favorites..." /> : null}

      {/* Error message */}
      {error ? <p className="empty">{error}</p> : null}

      {/* Empty state for no favorites */}
      {favorites.length === 0 ? (
        <p className="empty">Your favorite list is empty.</p>
      ) : (
        /* Favorites grid */
        <div className="card-grid">
          {favorites.map((movie) => (
            <MovieCard
              key={movie.id || movie.tmdbId}
              movie={movie}
              showFavoriteAction
              isFavorite
              /* Remove from favorites when clicked */
              onToggleFavorite={() => dispatch(removeFavoriteMovie({ movieId: movie.id, tmdbId: movie.tmdbId }))}
            />
          ))}
        </div>
      )}

      {/* Watch History Section */}
      <h2 className="section-title" style={{ marginTop: "1.5rem" }}>
        Recently Watched
      </h2>

      {/* Empty state for no history */}
      {history.length === 0 ? (
        <p className="empty">You have not watched anything yet.</p>
      ) : (
        /* History list */
        <div className="history-list">
          {history.map((item, index) => (
            <article key={`${item.tmdbId}-${index}`} className="history-item">
              {/* Movie title */}
              <span>{item.title || "Untitled"}</span>
              {/* Source (Details or Trailer) */}
              <span className="meta">{item.source === "trailer" ? "Trailer" : "Details"}</span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Favorites;
