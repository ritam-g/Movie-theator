const mongoose = require("mongoose");
const Movie = require("../models/Movie.model");
const ApiError = require("../utils/apiError");
const { getFromTMDB } = require("../services/tmdb.service");

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function toPositivePage(rawPage) {
  const page = Number.parseInt(rawPage, 10);
  if (!Number.isFinite(page) || page < 1) return 1;
  return page;
}

function imageUrl(path) {
  return path ? `${TMDB_IMAGE_BASE}${path}` : "";
}

function normalizeMediaItem(item = {}, fallbackCategory = "movie") {
  const mediaType = item.media_type || fallbackCategory;
  const title = item.title || item.name || "Untitled";

  return {
    id: item.id || null,
    tmdbId: item.id || null,
    title,
    description: item.overview || "Description not available",
    posterPath: item.poster_path || "",
    posterUrl: imageUrl(item.poster_path),
    backdropPath: item.backdrop_path || "",
    backdropUrl: imageUrl(item.backdrop_path),
    releaseDate: item.release_date || item.first_air_date || null,
    rating: Number(item.vote_average || 0),
    category: mediaType,
    popularity: Number(item.popularity || 0),
  };
}

function normalizeMovieDetail(item = {}) {
  const videos = item.videos?.results || [];
  const trailer = videos.find((video) => video.site === "YouTube" && video.type === "Trailer");

  return {
    id: item.id || null,
    tmdbId: item.id || null,
    title: item.title || item.name || "Untitled",
    description: item.overview || "Description not available",
    posterPath: item.poster_path || "",
    posterUrl: imageUrl(item.poster_path),
    backdropPath: item.backdrop_path || "",
    backdropUrl: imageUrl(item.backdrop_path),
    releaseDate: item.release_date || item.first_air_date || null,
    genres: (item.genres || []).map((genre) => genre.name),
    rating: Number(item.vote_average || 0),
    runtime: item.runtime || null,
    trailerKey: trailer?.key || null,
    trailerUrl: trailer?.key ? `https://www.youtube.com/watch?v=${trailer.key}` : "",
    trailerMessage: trailer ? null : "Trailer for this movie is currently unavailable.",
    images: (item.images?.backdrops || []).slice(0, 10).map((image) => imageUrl(image.file_path)),
    cast: (item.credits?.cast || []).slice(0, 10).map((person) => ({
      id: person.id,
      name: person.name,
      character: person.character || "",
      profilePath: person.profile_path || "",
      profileUrl: imageUrl(person.profile_path),
    })),
  };
}

async function getMovies(req, res, next) {
  try {
    const page = toPositivePage(req.query.page);
    const type = String(req.query.type || "trending").trim().toLowerCase();
    const query = String(req.query.query || "").trim();
    const source = String(req.query.source || "tmdb").trim().toLowerCase();

    if (source === "local") {
      const localCategory = String(req.query.category || "").trim().toLowerCase();
      const filter = localCategory ? { category: localCategory } : {};
      const limit = 20;
      const skip = (page - 1) * limit;

      const [movies, totalResults] = await Promise.all([
        Movie.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Movie.countDocuments(filter),
      ]);

      return res.status(200).json({
        page,
        totalPages: Math.max(1, Math.ceil(totalResults / limit)),
        totalResults,
        source: "local",
        results: movies.map((movie) => movie.toClient()),
      });
    }

    let endpoint = "/trending/movie/day";
    let params = { page };
    let fallbackCategory = "movie";

    if (query) {
      endpoint = "/search/multi";
      params = { page, query };
      fallbackCategory = "multi";
    } else {
      switch (type) {
        case "popular":
          endpoint = "/movie/popular";
          fallbackCategory = "movie";
          break;
        case "tv":
        case "tvshows":
          endpoint = "/tv/popular";
          fallbackCategory = "tv";
          break;
        case "people":
        case "person":
          endpoint = "/person/popular";
          fallbackCategory = "person";
          break;
        case "trending":
        default:
          endpoint = "/trending/movie/day";
          fallbackCategory = "movie";
      }
    }

    const tmdbData = await getFromTMDB(endpoint, params);
    const results = (tmdbData.results || []).map((item) => normalizeMediaItem(item, fallbackCategory));

    return res.status(200).json({
      page: tmdbData.page || page,
      totalPages: tmdbData.total_pages || 1,
      totalResults: tmdbData.total_results || results.length,
      source: "tmdb",
      results,
    });
  } catch (error) {
    return next(new ApiError(502, error.message || "Failed to fetch movies from TMDB"));
  }
}

async function getMovieById(req, res, next) {
  try {
    const rawId = req.params.id;

    if (mongoose.Types.ObjectId.isValid(rawId)) {
      const localMovie = await Movie.findById(rawId);
      if (!localMovie) {
        throw new ApiError(404, "Movie not found");
      }

      return res.status(200).json({
        source: "local",
        movie: localMovie.toClient(),
      });
    }

    const tmdbId = Number.parseInt(rawId, 10);
    if (!Number.isFinite(tmdbId)) {
      throw new ApiError(400, "Movie id must be a valid TMDB id or local id");
    }

    const [tmdbMovie, localMovie] = await Promise.all([
      getFromTMDB(`/movie/${tmdbId}`, { append_to_response: "videos,images,credits" }),
      Movie.findOne({ tmdbId }),
    ]);

    const movie = normalizeMovieDetail(tmdbMovie);
    if (localMovie) {
      movie.localMovieId = String(localMovie._id);
      movie.adminOverrides = localMovie.toClient();
    }

    return res.status(200).json({
      source: "tmdb",
      movie,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }

    const status = error?.response?.status;
    if (status === 404) {
      return next(new ApiError(404, "Movie not found on TMDB"));
    }

    return next(new ApiError(502, error.message || "Failed to fetch movie details"));
  }
}

module.exports = {
  getMovies,
  getMovieById,
};
