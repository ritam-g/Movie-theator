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
 * - React static file serving for production
 * - Error handling
 */
const express = require("express");
// Cross-Origin Resource Sharing - allows requests from the client
const cors = require("cors");
// HTTP request logger for development
const morgan = require("morgan");
// Security headers middleware
const helmet = require("helmet");
// Path module for file paths
const path = require("path");
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
// Configure helmet to allow images from TMDB and other external sources
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https://image.tmdb.org", "https://*.tmdb.org"],
        connectSrc: ["'self'", "https://api.themoviedb.org"],
      },
    },
  })
);

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

// The dist folder is created after running npm run build in client folder
if (config.nodeEnv === "production") {
  // Serve static files from the dist folder
  // Path: from server/src/ go up to root, then into client/dist
  app.use(express.static(path.join(__dirname, "../../client/dist")));

  // Handle React routing - serve index.html for all non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
  });
} else {
  // In development, serve static files from the public folder
  app.use(express.static(path.join(__dirname, "../public")));

  // Handle React routing - serve index.html for all non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
}

// Error handling middleware
// 404 handler for undefined routes
app.use(notFoundHandler);
// General error handler
app.use(errorMiddleware);

// Export app for use in server.js
module.exports = app;

