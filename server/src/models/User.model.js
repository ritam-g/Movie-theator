/**
 * User Model
 * 
 * Mongoose schema for the User collection.
 * Handles user data, authentication, favorites, and watch history.
 */
const mongoose = require("mongoose");
// Password hashing library
const bcrypt = require("bcryptjs");

/**
 * Watch History Schema
 * Stores movies that user has watched
 */
const watchHistorySchema = new mongoose.Schema(
  {
    // TMDB movie ID
    tmdbId: { type: Number, required: true },
    // Movie title
    title: { type: String, default: "" },
    // Poster image path
    posterPath: { type: String, default: "" },
    // When the movie was watched
    watchedAt: { type: Date, default: Date.now },
    // Source: 'details' (viewed from details page) or 'trailer' (watched trailer)
    source: { type: String, enum: ["details", "trailer"], default: "details" },
  },
  { _id: false } // Disable _id for subdocuments
);

/**
 * User Schema
 * Defines the user document structure
 */
const userSchema = new mongoose.Schema(
  {
    // User's display name
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },

    // User's email (unique, lowercase)
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email format validation
    },

    // User's password (hashed, never stored in plain text)
    // select: false means it's not returned by default in queries
    password: { type: String, required: true, minlength: 6, select: false },

    // Admin flag - grants access to admin features
    isAdmin: { type: Boolean, default: false },

    // Banned flag - prevents login if true
    isBanned: { type: Boolean, default: false },

    // Array of favorite movies (references Movie collection)
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],

    // User's watch history
    watchHistory: [watchHistorySchema],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Pre-save middleware: Hash password before saving
userSchema.pre("save", async function hashPasswordBeforeSave(next) {
  // Only hash if password is being modified
  if (!this.isModified("password")) {
    return next();
  }

  // Hash password with bcrypt (12 rounds)
  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

/**
 * Compare password method
 * Compares provided password with stored hashed password
 * 
 * @param {string} rawPassword - Plain text password to compare
 * @returns {Promise<boolean>} True if passwords match
 */
userSchema.methods.comparePassword = function comparePassword(rawPassword) {
  return bcrypt.compare(rawPassword, this.password);
};

/**
 * Convert to public profile
 * Returns user data suitable for client (excludes sensitive fields)
 * 
 * @returns {Object} Public user profile
 */
userSchema.methods.toPublicProfile = function toPublicProfile() {
  return {
    id: String(this._id),
    name: this.name,
    email: this.email,
    isAdmin: this.isAdmin,
    isBanned: this.isBanned,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Create and export User model
module.exports = mongoose.model("User", userSchema);
