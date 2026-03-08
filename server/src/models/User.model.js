const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    isAdmin: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    watchHistory: [watchHistorySchema],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function hashPasswordBeforeSave(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(rawPassword) {
  return bcrypt.compare(rawPassword, this.password);
};

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

module.exports = mongoose.model("User", userSchema);
