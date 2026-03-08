import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MovieCard from "../../components/MovieCard";
import Skeleton from "../../components/Skeleton";
import Loader from "../../components/Loader";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import { fetchTrendingMovies } from "../../redux/slices/movieSlice";
import { addFavoriteMovie, removeFavoriteMovie } from "../../redux/slices/favoriteSlice";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trending, trendingLoading, trendingPage, trendingTotalPages, error } = useSelector(
    (state) => state.movies
  );
  const { items: favorites } = useSelector((state) => state.favorites);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTrendingMovies({ page: 1, append: false }));
  }, [dispatch]);

  const hasMore = trendingPage < trendingTotalPages;

  const favoriteTmdbIds = useMemo(() => {
    return new Set((favorites || []).map((item) => Number(item.tmdbId)).filter(Number.isFinite));
  }, [favorites]);

  const loadNextPage = useCallback(() => {
    if (trendingLoading || !hasMore) return;
    dispatch(fetchTrendingMovies({ page: trendingPage + 1, append: true }));
  }, [dispatch, trendingLoading, hasMore, trendingPage]);

  const sentinelRef = useInfiniteScroll(loadNextPage, { threshold: 0.2 });

  const handleToggleFavorite = useCallback(
    (movie) => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      const tmdbId = Number(movie.tmdbId || movie.id);
      const isFavorite = favoriteTmdbIds.has(tmdbId);

      if (isFavorite) {
        dispatch(removeFavoriteMovie({ tmdbId }));
        return;
      }

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
      {trendingLoading && trending.length === 0 ? <Skeleton count={12} /> : null}
      {error ? <p className="empty">{error}</p> : null}

      {!trendingLoading && trending.length === 0 ? (
        <p className="empty">No movies available right now.</p>
      ) : (
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

      <div ref={sentinelRef} style={{ minHeight: 1, marginTop: 12 }} />
      {trendingLoading && trending.length > 0 ? <Loader label="Loading more movies..." /> : null}
      {!hasMore && trending.length > 0 ? <p className="meta">You have reached the end.</p> : null}
    </section>
  );
}

export default Home;
