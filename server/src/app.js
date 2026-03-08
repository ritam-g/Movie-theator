/**
 * Express Application Setup
 * 
 * This is the main Express application configuration file.
 * It sets up:
 * - Express server
 * - Security middleware (helmet, cors)
 * - Request parsing (JSON, URL-encoded)
 * - Request logging (morgan)
 * - API routes
 * - Error handling
 */
const express = require("express");
// Cross-Origin Resource Sharing - allows requests from the client
const cors = require("cors");
// HTTP request logger for development
const morgan = require("morgan");
// Security headers middleware
const helmet = require("helmet");
// Environment configuration
const config = require("./config/env");

// Import route modules
const authRoutes = require("./routes/auth.routes");
const movieRoutes = require("./routes/movie.routes");
const favoriteRoutes = require("./routes/favorite.routes");
const historyRoutes = require("./routes/history.routes");
const adminRoutes = require("./routes/admin.routes");
// Error handling middleware
const { notFoundHandler, errorMiddleware } = require("./middlewares/error.middleware");

// Create Express application
const app = express();

// Disable X-Powered-By header for security
app.disable("x-powered-by");

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.clientUrl, // Allow requests from client URL
    credentials: true, // Allow cookies to be sent
  })
);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Request logging in development mode
app.use(morgan("dev"));

// Health check endpoint
app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Movie Platform API",
    environment: config.nodeEnv,
  });
});

// Another health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

// Mount API routes
app.use("/api/auth", authRoutes);      // Authentication routes (login, register, profile)
app.use("/api/movies", movieRoutes);  // Movie routes (trending, search, details)
app.use("/api/favorites", favoriteRoutes); // Favorites routes
app.use("/api/history", historyRoutes);     // Watch history routes
app.use("/api/admin", adminRoutes);  // Admin routes

// Error handling middleware
// 404 handler for undefined routes
app.use(notFoundHandler);
// General error handler
app.use(errorMiddleware);

// Export app for use in server.js
module.exports = app;
