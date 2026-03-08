/**
 * Server Entry Point
 * 
 * This file starts the Express server and handles:
 * - Database connection
 * - Server startup
 * - Graceful shutdown (handling SIGINT/SIGTERM)
 * - Unhandled error handling
 */
const app = require("./app");
// Database connection function
const connectDB = require("./config/db");
// Environment configuration
const config = require("./config/env");
// Mongoose for MongoDB
const mongoose = require("mongoose");

// Reference to the running server instance
let serverInstance = null;

/**
 * Start the server
 * Connects to database and starts listening on configured port
 */
async function startServer() {
  try {
    // Connect to MongoDB database
    await connectDB();

    // Start HTTP server
    serverInstance = app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

/**
 * Graceful Shutdown Handler
 * Handles cleanup when server needs to stop (SIGINT or SIGTERM)
 * Closes database connection and HTTP server properly
 * 
 * @param {string} signal - The signal that triggered the shutdown
 */
async function gracefulShutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully.`);

  // Close HTTP server if running
  if (serverInstance) {
    await new Promise((resolve, reject) => {
      serverInstance.close((error) => {
        if (error) return reject(error);
        return resolve();
      });
    });
  }

  // Close MongoDB connection
  await mongoose.connection.close();
  process.exit(0);
}

// Handle SIGINT (Ctrl+C)
process.on("SIGINT", () => {
  gracefulShutdown("SIGINT").catch((error) => {
    console.error("Graceful shutdown failed:", error.message);
    process.exit(1);
  });
});

// Handle SIGTERM ( termination signal from system)
process.on("SIGTERM", () => {
  gracefulShutdown("SIGTERM").catch((error) => {
    console.error("Graceful shutdown failed:", error.message);
    process.exit(1);
  });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

// Start the server
startServer();
