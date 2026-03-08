/**
 * Home Page Component
 * 
 * The main landing page of the application that displays trending movies.
 * Features:
 * - Fetches and displays trending movies from TMDB
 * - Infinite scroll pagination
 * - Favorite toggle functionality for logged-in users
 * - Loading states with skeleton cards
 */
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MovieCard from "../../components/MovieCard";
import Skeleton from "../../components/Skeleton";
import Loader from "../../components/Loader";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
// Redux actions
import { fetchTrendingMovies } from "../../redux/slices/movieSlice";
import { addFavoriteMovie, removeFavoriteMovie } from "../../redux/slices/favoriteSlice";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get movie data from Redux store
  const { trending, trendingLoading, trendingPage, trendingTotalPages, error } = useSelector(
    (state) => state.movies
  );
  
  // Get favorites from Redux store
  const { items: favorites } = useSelector((state) => state.favorites);
  
  // Get auth state
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Fetch trending movies on component mount
  useEffect(() => {
    dispatch(fetchTrendingMovies({ page: 1, append: false }));
  }, [dispatch]);

  // Check if there are more pages to load
  const hasMore = trendingPage < trendingTotalPages;

  // Create a Set of favorite TMDB IDs for quick lookup
  // Memoized to prevent unnecessary recalculations
  const favoriteTmdbIds = useMemo(() => {
    return new Set((favorites || []).map((item) => Number(item.tmdbId)).filter(Number.isFinite));
  }, [favorites]);

  // Callback to load next page of movies (for infinite scroll)
  const loadNextPage = useCallback(() => {
    // Don't load if already loading or no more pages
    if (trendingLoading || !hasMore) return;
    dispatch(fetchTrendingMovies({ page: trendingPage + 1, append: true }));
  }, [dispatch, trendingLoading, hasMore, trendingPage]);

  // Ref for infinite scroll sentinel element
  const sentinelRef = useInfiniteScroll(loadNextPage, { threshold: 0.2 });

  /**
   * Handle favorite toggle
   * If not logged in, redirects to login page
   * Otherwise adds or removes from favorites
   */
  const handleToggleFavorite = useCallback(
    (movie) => {
      // Redirect to login if not authenticated
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      // Get TMDB ID from movie
      const tmdbId = Number(movie.tmdbId || movie.id);
      // Check if already a favorite
      const isFavorite = favoriteTmdbIds.has(tmdbId);

      if (isFavorite) {
        // Remove from favorites
        dispatch(removeFavoriteMovie({ tmdbId }));
        return;
      }

      // Add to favorites
      dispatch(
        addFavoriteMovie({
          tmdbId,
          title: movie.title || "Untitled",
          posterUrl: movie.posterUrl || "",
          description: movie.description || "Description not available",
          releaseDate: movie.releaseDate || movie.release_date || null,
          category: movie.category || "movie",
          rating: movie.rating || movie.vote_average || 0,
        })
      );
    },
    [dispatch, favoriteTmdbIds, isAuthenticated, navigate]
  );

  return (
    <section>
      <h1 className="section-title">Trending Movies</h1>
      
      {/* Show skeleton loading on initial load */}
      {trendingLoading && trending.length === 0 ? <Skeleton count={12} /> : null}
      
      {/* Show error message if fetch failed */}
      {error ? <p className="empty">{error}</p> : null}

      {/* Show empty message if no movies */}
      {!trendingLoading && trending.length === 0 ? (
        <p className="empty">No movies available right now.</p>
      ) : (
        /* Render movie grid */
        <div className="card-grid">
          {trending.map((movie) => {
            const tmdbId = Number(movie.tmdbId || movie.id);
            return (
              <MovieCard
                key={`${tmdbId}-${movie.title}`}
                movie={movie}
                showFavoriteAction
                isFavorite={favoriteTmdbIds.has(tmdbId)}
                onToggleFavorite={handleToggleFavorite}
              />
            );
          })}
        </div>
      )}

      {/* Infinite scroll sentinel element */}
      <div ref={sentinelRef} style={{ minHeight: 1, marginTop: 12 }} />
      
      {/* Show loading indicator when loading more */}
      {trendingLoading && trending.length > 0 ? <Loader label="Loading more movies..." /> : null}
      
      {/* Show end message when no more pages */}
      {!hasMore && trending.length > 0 ? <p className="meta">You have reached the end.</p> : null}
    </section>
  );
}

export default Home;
