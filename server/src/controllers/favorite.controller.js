const mongoose = require("mongoose");
const Movie = require("../models/Movie.model");
const User = require("../models/User.model");
const ApiError = require("../utils/apiError");
const { getFromTMDB } = require("../services/tmdb.service");

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function imageUrl(path) {
  return path ? `${TMDB_IMAGE_BASE}${path}` : "";
}

function normalizeFavoriteMovie(movieDocument) {
  if (!movieDocument) return null;
  return typeof movieDocument.toClient === "function"
    ? movieDocument.toClient()
    : {
        id: String(movieDocument._id || ""),
        title: movieDocument.title || "Untitled",
        posterUrl: movieDocument.posterUrl || "",
        description: movieDocument.description || "Description not available",
      };
}

async function resolveMovieFromPayload(payload = {}) {
  const { movieId, tmdbId, title, posterUrl, description, releaseDate, trailerYoutubeLink, genre, category } = payload;

  if (movieId && mongoose.Types.ObjectId.isValid(movieId)) {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new ApiError(404, "Movie not found");
    }
    return movie;
  }

  const parsedTmdbId = Number.parseInt(tmdbId, 10);
  if (!Number.isFinite(parsedTmdbId)) {
    throw new ApiError(400, "A valid movieId or tmdbId is required");
  }

  const existingMovie = await Movie.findOne({ tmdbId: parsedTmdbId });
  if (existingMovie) return existingMovie;

  let tmdbMovie = null;
  try {
    tmdbMovie = await getFromTMDB(`/movie/${parsedTmdbId}`);
  } catch (error) {
    tmdbMovie = null;
  }

  const movieDoc = await Movie.create({
    tmdbId: parsedTmdbId,
    title: title || tmdbMovie?.title || "Untitled",
    posterUrl: posterUrl || imageUrl(tmdbMovie?.poster_path) || "",
    description: description || tmdbMovie?.overview || "Description not available",
    releaseDate: releaseDate || tmdbMovie?.release_date || null,
    trailerYoutubeLink: trailerYoutubeLink || "",
    genre: Array.isArray(genre)
      ? genre
      : (tmdbMovie?.genres || []).map((item) => item.name),
    category: category || "movie",
    rating: Number(tmdbMovie?.vote_average || 0),
  });

  return movieDoc;
}

async function loadUserFavorites(userId) {
  const user = await User.findById(userId).populate({
    path: "favorites",
    options: { sort: { updatedAt: -1 } },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return (user.favorites || []).map((movie) => normalizeFavoriteMovie(movie)).filter(Boolean);
}

async function addFavorite(req, res, next) {
  try {
    const movie = await resolveMovieFromPayload(req.body || {});

    await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { favorites: movie._id } },
      { new: true }
    );

    const favorites = await loadUserFavorites(req.user.id);

    return res.status(200).json({
      message: "Movie added to favorites",
      favorites,
    });
  } catch (error) {
    return next(error);
  }
}

async function removeFavorite(req, res, next) {
  try {
    const payload = { ...(req.body || {}), ...(req.query || {}) };
    let movieObjectId = null;

    if (payload.movieId && mongoose.Types.ObjectId.isValid(payload.movieId)) {
      movieObjectId = payload.movieId;
    } else if (payload.tmdbId) {
      const parsedTmdbId = Number.parseInt(payload.tmdbId, 10);
      if (Number.isFinite(parsedTmdbId)) {
        const movie = await Movie.findOne({ tmdbId: parsedTmdbId }).select("_id");
        movieObjectId = movie?._id || null;
      }
    }

    if (!movieObjectId) {
      throw new ApiError(400, "A valid movieId or tmdbId is required");
    }

    await User.findByIdAndUpdate(req.user.id, { $pull: { favorites: movieObjectId } });
    const favorites = await loadUserFavorites(req.user.id);

    return res.status(200).json({
      message: "Movie removed from favorites",
      favorites,
    });
  } catch (error) {
    return next(error);
  }
}

async function getFavorites(req, res, next) {
  try {
    const favorites = await loadUserFavorites(req.user.id);
    return res.status(200).json({
      favorites,
    });
  } catch (error) {
    return next(error);
  }
}

async function addHistory(req, res, next) {
  try {
    const { movieId, tmdbId, title, posterPath, posterUrl, source } = req.body || {};
    const user = await User.findById(req.user.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    let resolvedTmdbId = Number.parseInt(tmdbId, 10);
    let resolvedTitle = title || "";
    let resolvedPosterPath = posterPath || posterUrl || "";

    if ((!Number.isFinite(resolvedTmdbId) || !resolvedTitle) && movieId && mongoose.Types.ObjectId.isValid(movieId)) {
      const movie = await Movie.findById(movieId);
      if (movie) {
        resolvedTmdbId = Number.isFinite(resolvedTmdbId) ? resolvedTmdbId : Number(movie.tmdbId);
        resolvedTitle = resolvedTitle || movie.title;
        resolvedPosterPath = resolvedPosterPath || movie.posterUrl || "";
      }
    }

    if (!Number.isFinite(resolvedTmdbId)) {
      throw new ApiError(400, "A valid tmdbId or movieId is required for watch history");
    }

    const normalizedSource = source === "trailer" ? "trailer" : "details";

    user.watchHistory = (user.watchHistory || []).filter((entry) => entry.tmdbId !== resolvedTmdbId);
    user.watchHistory.unshift({
      tmdbId: resolvedTmdbId,
      title: resolvedTitle || "Untitled",
      posterPath: resolvedPosterPath || "",
      source: normalizedSource,
      watchedAt: new Date(),
    });
    user.watchHistory = user.watchHistory.slice(0, 100);

    await user.save();

    return res.status(200).json({
      message: "Watch history updated",
      history: user.watchHistory,
    });
  } catch (error) {
    return next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("watchHistory");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const history = [...(user.watchHistory || [])].sort(
      (a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime()
    );

    return res.status(200).json({
      history,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
  addHistory,
  getHistory,
};
