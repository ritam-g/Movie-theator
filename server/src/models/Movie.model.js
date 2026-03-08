const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, index: true, sparse: true, unique: true },
    title: { type: String, required: true, trim: true, minlength: 1, maxlength: 300 },
    posterUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    releaseDate: { type: Date },
    trailerYoutubeLink: { type: String, default: "" },
    genre: [{ type: String, trim: true }],
    category: { type: String, enum: ["movie", "tv", "person", "custom"], default: "movie" },
    rating: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

movieSchema.methods.toClient = function toClient() {
  return {
    id: String(this._id),
    tmdbId: this.tmdbId || null,
    title: this.title || "Untitled",
    posterUrl: this.posterUrl || "",
    description: this.description || "Description not available",
    releaseDate: this.releaseDate || null,
    trailerYoutubeLink: this.trailerYoutubeLink || "",
    genre: this.genre || [],
    category: this.category || "movie",
    rating: this.rating || 0,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("Movie", movieSchema);
