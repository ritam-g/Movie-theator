const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, index: true },
    title: { type: String, required: true, trim: true },
    posterUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    releaseDate: { type: Date },
    trailerYoutubeLink: { type: String, default: "" },
    genre: [{ type: String }],
    category: { type: String, default: "movie" },
    rating: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Movie", movieSchema);
