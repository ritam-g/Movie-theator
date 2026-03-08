/**
 * Movie Model
 * 
 * Mongoose schema for the Movie collection.
 * Stores movies from TMDB and locally added content.
 */
const mongoose = require("mongoose");

/**
 * Movie Schema
 * Defines the movie document structure
 */
const movieSchema = new mongoose.Schema(
  {
    // TMDB movie ID (unique, for TMDB-sourced movies)
    tmdbId: {
      type: Number,
      index: true,
      sparse: true,
      unique: true
    },

    // Movie title
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 300
    },

    // Poster image URL
    posterUrl: { type: String, default: "" },

    // Movie description/overview
    description: { type: String, default: "" },

    // Release date
    releaseDate: { type: Date },

    // YouTube trailer link
    trailerYoutubeLink: { type: String, default: "" },

    // Movie genres
    genre: [{ type: String, trim: true }],

    // Category: movie, tv, person, or custom
    category: {
      type: String,
      enum: ["movie", "tv", "person", "custom"],
      default: "movie"
    },

    // User rating (0-10)
    rating: { type: Number, default: 0 },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

/**
 * Convert movie to client-friendly format
 * Returns movie data suitable for frontend consumption
 * 
 * @returns {Object} Movie data for client
 */
movieSchema.methods.toClient = function toClient() {
  return {
    // Convert MongoDB _id to string
    id: String(this._id),
    // TMDB ID (or null if local-only)
    tmdbId: this.tmdbId || null,
    // Title with fallback
    title: this.title || "Untitled",
    // Poster URL with fallback
    posterUrl: this.posterUrl || "",
    // Description with fallback
    description: this.description || "Description not available",
    // Release date
    releaseDate: this.releaseDate || null,
    // Trailer link
    trailerYoutubeLink: this.trailerYoutubeLink || "",
    // Genres array
    genre: this.genre || [],
    // Category
    category: this.category || "movie",
    // Rating (default to 0)
    rating: this.rating || 0,
    // Timestamps
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Create and export Movie model
module.exports = mongoose.model("Movie", movieSchema);
