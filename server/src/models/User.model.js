const mongoose = require("mongoose");

const watchHistorySchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, required: true },
    title: { type: String, default: "" },
    posterPath: { type: String, default: "" },
    watchedAt: { type: Date, default: Date.now },
    source: { type: String, enum: ["details", "trailer"], default: "details" },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    watchHistory: [watchHistorySchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
