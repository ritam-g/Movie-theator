/**
 * Authentication Controller
 * 
 * Handles user authentication operations:
 * - Registration
 * - Login
 * - Profile retrieval
 */
const User = require("../models/User.model");
const ApiError = require("../utils/apiError");
const { generateToken } = require("../utils/jwt");

/**
 * Create authentication payload for response
 * Generates a JWT token and public user profile
 * 
 * @param {Object} userDocument - Mongoose user document
 * @returns {Object} Object containing token and user data
 */
function createAuthPayload(userDocument) {
  // Get public profile (excludes sensitive data like password)
  const user = userDocument.toPublicProfile();

  // Generate JWT token
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

/**
 * Register a new user
 * Creates a new user account with the provided credentials
 */
async function register(req, res, next) {
  try {
    // Extract user data from request body
    const { name, email, password } = req.body || {};

    // Validate required fields
    if (!name || !email || !password) {
      throw new ApiError(400, "Name, email, and password are required");
    }

    // Validate password length
    if (String(password).length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters long");
    }

    // Normalize email (lowercase, trim whitespace)
    const normalizedEmail = String(email).trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      throw new ApiError(409, "Email is already registered");
    }

    // Create new user
    const newUser = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: String(password),
    });

    // Return success response with token and user data
    return res.status(201).json({
      message: "Registration successful",
      ...createAuthPayload(newUser),
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Login an existing user
 * Authenticates user with email and password
 */
async function login(req, res, next) {
  try {
    // Extract credentials from request body
    const { email, password } = req.body || {};

    // Validate required fields
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    // Normalize email
    const normalizedEmail = String(email).trim().toLowerCase();

    // Find user by email (include password field for comparison)
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    // Check if user exists
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Check if user is banned
    if (user.isBanned) {
      throw new ApiError(403, "This account is banned");
    }

    // Verify password
    const isPasswordCorrect = await user.comparePassword(String(password));
    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Return success response with token and user data
    return res.status(200).json({
      message: "Login successful",
      ...createAuthPayload(user),
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get current user's profile
 * Returns the authenticated user's profile data
 */
async function profile(req, res, next) {
  try {
    // Find user by ID (from auth middleware)
    const user = await User.findById(req.user.id)
      .select("-password") // Exclude password
      .populate("favorites"); // Include favorite movies

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Return user profile and favorites
    return res.status(200).json({
      user: user.toPublicProfile(),
      favorites: (user.favorites || []).map((movie) => movie.toClient()),
      watchHistory: user.watchHistory || [],
    });
  } catch (error) {
    return next(error);
  }
}

// Export controller functions
module.exports = {
  register,
  login,
  profile,
};
