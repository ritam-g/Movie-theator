import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import TrailerModal from "../../components/TrailerModal";
import { clearSelectedMovie, fetchMovieDetails } from "../../redux/slices/movieSlice";
import { addFavoriteMovie, addHistoryItem, removeFavoriteMovie } from "../../redux/slices/favoriteSlice";
import { FALLBACK_TRAILER_TEXT } from "../../utils/constants";
import { formatDate, getMovieTitle, getPosterUrl, safeDescription } from "../../utils/helpers";

function MovieDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const { selectedMovie, detailsLoading, error } = useSelector((state) => state.movies);
  const { items: favorites } = useSelector((state) => state.favorites);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchMovieDetails(id));
    return () => {
      dispatch(clearSelectedMovie());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (!isAuthenticated || !selectedMovie) return;
    const parsedTmdbId = Number(selectedMovie.tmdbId || selectedMovie.id);
    const historyPayload = {
      ...(Number.isFinite(parsedTmdbId)
        ? { tmdbId: parsedTmdbId }
        : { movieId: selectedMovie.localMovieId || selectedMovie.id }),
      title: getMovieTitle(selectedMovie),
      posterPath: selectedMovie.posterPath || selectedMovie.posterUrl || "",
      source: "details",
    };

    dispatch(addHistoryItem(historyPayload));
  }, [dispatch, isAuthenticated, selectedMovie]);

  const isFavorite = useMemo(() => {
    const currentTmdbId = Number(selectedMovie?.tmdbId || selectedMovie?.id);
    const currentLocalId = String(selectedMovie?.localMovieId || selectedMovie?.id || "");

    return (favorites || []).some((item) => {
      const favoriteTmdbId = Number(item.tmdbId || item.id);
      const favoriteLocalId = String(item.id || "");
      return favoriteTmdbId === currentTmdbId || favoriteLocalId === currentLocalId;
    });
  }, [favorites, selectedMovie]);

  const toggleFavorite = () => {
    if (!selectedMovie) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const tmdbId = Number(selectedMovie.tmdbId || selectedMovie.id);
    const localMovieId = selectedMovie.localMovieId || selectedMovie.id;
    if (isFavorite) {
      dispatch(removeFavoriteMovie(Number.isFinite(tmdbId) ? { tmdbId } : { movieId: localMovieId }));
      return;
    }

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

  const handleOpenTrailer = () => {
    setIsTrailerOpen(true);
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

  if (detailsLoading) {
    return <Loader label="Loading movie details..." />;
  }

  if (error) {
    return <p className="empty">{error}</p>;
  }

  if (!selectedMovie) {
    return <p className="empty">Movie not found.</p>;
  }

  const title = getMovieTitle(selectedMovie);
  const genres = selectedMovie.genres || selectedMovie.genre || [];
  const trailerMessage = selectedMovie.trailerMessage || FALLBACK_TRAILER_TEXT;

  return (
    <section className="details-layout">
      <img
        className="details-poster"
        src={getPosterUrl(selectedMovie.posterPath || selectedMovie.posterUrl)}
        alt={title}
        onError={(event) => {
          event.currentTarget.src = getPosterUrl(null);
        }}
      />

      <div>
        <h1 className="section-title">{title}</h1>
        <p className="meta">Release Date: {formatDate(selectedMovie.releaseDate || selectedMovie.release_date)}</p>
        <p className="meta">Rating: {Number(selectedMovie.rating || 0).toFixed(1)}</p>
        <p>{safeDescription(selectedMovie.description)}</p>

        <div className="chips">
          {genres.length > 0 ? genres.map((item) => <span key={item}>{item}</span>) : <span>Genre not available</span>}
        </div>

        <div className="details-actions">
          <button type="button" className="primary" onClick={handleOpenTrailer}>
            Watch Trailer
          </button>
          <button type="button" onClick={toggleFavorite}>
            {isFavorite ? "Remove Favorite" : "Add to Favorites"}
          </button>
        </div>
        {!selectedMovie.trailerKey && !selectedMovie.trailerUrl ? <p className="meta">{trailerMessage}</p> : null}
      </div>

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
