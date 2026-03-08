const User = require("../models/User.model");
const ApiError = require("../utils/apiError");
const { generateToken } = require("../utils/jwt");

function createAuthPayload(userDocument) {
  const user = userDocument.toPublicProfile();
  const token = generateToken({
    userId: String(userDocument._id),
    email: userDocument.email,
    isAdmin: userDocument.isAdmin,
  });

  return {
    token,
    user,
  };
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      throw new ApiError(400, "Name, email, and password are required");
    }

    if (String(password).length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters long");
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      throw new ApiError(409, "Email is already registered");
    }

    const newUser = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: String(password),
    });

    return res.status(201).json({
      message: "Registration successful",
      ...createAuthPayload(newUser),
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    if (user.isBanned) {
      throw new ApiError(403, "This account is banned");
    }

    const isPasswordCorrect = await user.comparePassword(String(password));
    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid credentials");
    }

    return res.status(200).json({
      message: "Login successful",
      ...createAuthPayload(user),
    });
  } catch (error) {
    return next(error);
  }
}

async function profile(req, res, next) {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("favorites");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json({
      user: user.toPublicProfile(),
      favorites: (user.favorites || []).map((movie) => movie.toClient()),
      watchHistory: user.watchHistory || [],
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  profile,
};
