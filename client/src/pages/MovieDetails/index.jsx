/**
 * MovieDetails Page Component
 * 
 * Displays detailed information about a specific movie.
 * Features:
 * - Movie poster, title, rating, release date
 * - Genre chips
 * - Description
 * - Watch trailer button (opens modal)
 * - Add/remove from favorites (for logged-in users)
 * - Automatic watch history tracking
 */
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import TrailerModal from "../../components/TrailerModal";
// Redux actions
import { clearSelectedMovie, fetchMovieDetails } from "../../redux/slices/movieSlice";
import { addFavoriteMovie, addHistoryItem, removeFavoriteMovie } from "../../redux/slices/favoriteSlice";
// Constants and helpers
import { FALLBACK_TRAILER_TEXT } from "../../utils/constants";
import { formatDate, getMovieTitle, getPosterUrl, safeDescription } from "../../utils/helpers";

function MovieDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get movie ID from URL parameters
  const { id } = useParams();
  
  // Local state for trailer modal
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Get movie data from Redux store
  const { selectedMovie, detailsLoading, error } = useSelector((state) => state.movies);
  
  // Get favorites from Redux
  const { items: favorites } = useSelector((state) => state.favorites);
  
  // Get auth state
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Fetch movie details when ID changes
  useEffect(() => {
    if (!id) return;
    dispatch(fetchMovieDetails(id));
    
    // Cleanup: clear selected movie when leaving page
    return () => {
      dispatch(clearSelectedMovie());
    };
  }, [dispatch, id]);

  // Add to watch history when viewing a movie
  useEffect(() => {
    // Only track if authenticated and we have movie data
    if (!isAuthenticated || !selectedMovie) return;
    
    const parsedTmdbId = Number(selectedMovie.tmdbId || selectedMovie.id);
    const historyPayload = {
      // Use TMDB ID or local ID depending on what's available
      ...(Number.isFinite(parsedTmdbId)
        ? { tmdbId: parsedTmdbId }
        : { movieId: selectedMovie.localMovieId || selectedMovie.id }),
      title: getMovieTitle(selectedMovie),
      posterPath: selectedMovie.posterPath || selectedMovie.posterUrl || "",
      source: "details",
    };

    dispatch(addHistoryItem(historyPayload));
  }, [dispatch, isAuthenticated, selectedMovie]);

  // Check if current movie is in favorites
  const isFavorite = useMemo(() => {
    const currentTmdbId = Number(selectedMovie?.tmdbId || selectedMovie?.id);
    const currentLocalId = String(selectedMovie?.localMovieId || selectedMovie?.id || "");

    return (favorites || []).some((item) => {
      const favoriteTmdbId = Number(item.tmdbId || item.id);
      const favoriteLocalId = String(item.id || "");
      return favoriteTmdbId === currentTmdbId || favoriteLocalId === currentLocalId;
    });
  }, [favorites, selectedMovie]);

  /**
   * Toggle favorite status
   * If not logged in, redirects to login
   */
  const toggleFavorite = () => {
    if (!selectedMovie) return;
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const tmdbId = Number(selectedMovie.tmdbId || selectedMovie.id);
    const localMovieId = selectedMovie.localMovieId || selectedMovie.id;
    
    if (isFavorite) {
      // Remove from favorites
      dispatch(removeFavoriteMovie(Number.isFinite(tmdbId) ? { tmdbId } : { movieId: localMovieId }));
      return;
    }

    // Add to favorites
    dispatch(
      addFavoriteMovie({
        ...(Number.isFinite(tmdbId) ? { tmdbId } : { movieId: localMovieId }),
        title: getMovieTitle(selectedMovie),
        posterUrl: selectedMovie.posterUrl || "",
        description: safeDescription(selectedMovie.description),
        releaseDate: selectedMovie.releaseDate || selectedMovie.release_date || null,
        category: selectedMovie.category || "movie",
        rating: selectedMovie.rating || 0,
      })
    );
  };

  /**
   * Open trailer modal and track in history
   */
  const handleOpenTrailer = () => {
    setIsTrailerOpen(true);
    
    // Track trailer watch in history if authenticated
    if (isAuthenticated && selectedMovie) {
      const parsedTmdbId = Number(selectedMovie.tmdbId || selectedMovie.id);
      dispatch(
        addHistoryItem({
          ...(Number.isFinite(parsedTmdbId)
            ? { tmdbId: parsedTmdbId }
            : { movieId: selectedMovie.localMovieId || selectedMovie.id }),
          title: getMovieTitle(selectedMovie),
          posterPath: selectedMovie.posterPath || selectedMovie.posterUrl || "",
          source: "trailer",
        })
      );
    }
  };

  // Loading state
  if (detailsLoading) {
    return <Loader label="Loading movie details..." />;
  }

  // Error state
  if (error) {
    return <p className="empty">{error}</p>;
  }

  // Movie not found state
  if (!selectedMovie) {
    return <p className="empty">Movie not found.</p>;
  }

  // Extract movie data using helpers
  const title = getMovieTitle(selectedMovie);
  const genres = selectedMovie.genres || selectedMovie.genre || [];
  const trailerMessage = selectedMovie.trailerMessage || FALLBACK_TRAILER_TEXT;

  return (
    <section className="details-layout">
      {/* Movie poster */}
      <img
        className="details-poster"
        src={getPosterUrl(selectedMovie.posterPath || selectedMovie.posterUrl)}
        alt={title}
        onError={(event) => {
          event.currentTarget.src = getPosterUrl(null);
        }}
      />

      <div>
        {/* Movie title */}
        <h1 className="section-title">{title}</h1>
        
        {/* Release date */}
        <p className="meta">Release Date: {formatDate(selectedMovie.releaseDate || selectedMovie.release_date)}</p>
        
        {/* Rating */}
        <p className="meta">Rating: {Number(selectedMovie.rating || 0).toFixed(1)}</p>
        
        {/* Description */}
        <p>{safeDescription(selectedMovie.description)}</p>

        {/* Genre chips */}
        <div className="chips">
          {genres.length > 0 ? genres.map((item) => <span key={item}>{item}</span>) : <span>Genre not available</span>}
        </div>

        {/* Action buttons */}
        <div className="details-actions">
          {/* Watch Trailer button */}
          <button type="button" className="primary" onClick={handleOpenTrailer}>
            Watch Trailer
          </button>
          
          {/* Favorite toggle button */}
          <button type="button" onClick={toggleFavorite}>
            {isFavorite ? "Remove Favorite" : "Add to Favorites"}
          </button>
        </div>
        
        {/* Message when no trailer available */}
        {!selectedMovie.trailerKey && !selectedMovie.trailerUrl ? <p className="meta">{trailerMessage}</p> : null}
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerKey={selectedMovie.trailerKey}
        trailerUrl={selectedMovie.trailerUrl || selectedMovie.trailerYoutubeLink}
        title={title}
      />
    </section>
  );
}

export default MovieDetails;
