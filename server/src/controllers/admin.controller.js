const mongoose = require("mongoose");
const Movie = require("../models/Movie.model");
const User = require("../models/User.model");
const ApiError = require("../utils/apiError");

function parseDate(rawDate) {
  if (!rawDate) return null;
  const parsed = new Date(rawDate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function buildMoviePayload(input = {}) {
  const payload = {};

  if (input.tmdbId !== undefined && input.tmdbId !== null && input.tmdbId !== "") {
    const parsedTmdbId = Number.parseInt(input.tmdbId, 10);
    if (!Number.isFinite(parsedTmdbId)) {
      throw new ApiError(400, "tmdbId must be a valid number");
    }
    payload.tmdbId = parsedTmdbId;
  }

  if (input.title !== undefined) payload.title = String(input.title).trim();
  if (input.posterUrl !== undefined) payload.posterUrl = String(input.posterUrl || "").trim();
  if (input.description !== undefined) payload.description = String(input.description || "").trim();
  if (input.trailerYoutubeLink !== undefined) {
    payload.trailerYoutubeLink = String(input.trailerYoutubeLink || "").trim();
  }
  if (input.category !== undefined) payload.category = String(input.category || "").trim().toLowerCase();
  if (input.rating !== undefined) payload.rating = Number(input.rating || 0);
  if (input.releaseDate !== undefined) payload.releaseDate = parseDate(input.releaseDate);
  if (input.genre !== undefined) {
    payload.genre = Array.isArray(input.genre)
      ? input.genre.map((item) => String(item).trim()).filter(Boolean)
      : [String(input.genre).trim()].filter(Boolean);
  }

  return payload;
}

async function createMovie(req, res, next) {
  try {
    const payload = buildMoviePayload(req.body || {});
    if (!payload.title) {
      throw new ApiError(400, "title is required");
    }

    const movie = await Movie.create(payload);
    return res.status(201).json({
      message: "Movie created successfully",
      movie: movie.toClient(),
    });
  } catch (error) {
    return next(error);
  }
}

async function updateMovie(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid movie id");
    }

    const payload = buildMoviePayload(req.body || {});
    if (Object.keys(payload).length === 0) {
      throw new ApiError(400, "At least one field is required to update");
    }

    const movie = await Movie.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      throw new ApiError(404, "Movie not found");
    }

    return res.status(200).json({
      message: "Movie updated successfully",
      movie: movie.toClient(),
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteMovie(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid movie id");
    }

    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) {
      throw new ApiError(404, "Movie not found");
    }

    await User.updateMany({}, { $pull: { favorites: movie._id } });

    return res.status(200).json({
      message: "Movie deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [users, totalResults] = await Promise.all([
      User.find({})
        .select("name email isAdmin isBanned createdAt updatedAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments({}),
    ]);

    return res.status(200).json({
      page,
      totalPages: Math.max(1, Math.ceil(totalResults / limit)),
      totalResults,
      users: users.map((user) => ({
        id: String(user._id),
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isBanned: user.isBanned,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    });
  } catch (error) {
    return next(error);
  }
}

async function banUser(req, res, next) {
  try {
    const { userId, isBanned } = req.body || {};
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Valid userId is required");
    }

    if (String(userId) === String(req.user.id)) {
      throw new ApiError(400, "Admin cannot ban/unban self");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isBanned: typeof isBanned === "boolean" ? isBanned : true },
      { new: true }
    ).select("name email isAdmin isBanned createdAt updatedAt");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json({
      message: "User status updated successfully",
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isBanned: user.isBanned,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid user id");
    }

    if (String(id) === String(req.user.id)) {
      throw new ApiError(400, "Admin cannot delete self");
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createMovie,
  updateMovie,
  deleteMovie,
  getUsers,
  banUser,
  deleteUser,
};
