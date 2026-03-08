/**
 * Auth Routes
 * 
 * Defines routes for user authentication:
 * - POST /register - Register a new user
 * - POST /login - Login with existing credentials
 * - GET /profile - Get current user's profile (protected)
 */
const express = require("express");
// Controller functions for logic
const authController = require("../controllers/auth.controller");
// Authentication middleware to protect routes
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

// POST /api/auth/register - Register new user
router.post("/register", authController.register);

// POST /api/auth/login - Login user
router.post("/login", authController.login);

// GET /api/auth/profile - Get user profile (requires authentication)
router.get("/profile", authMiddleware, authController.profile);

module.exports = router;
