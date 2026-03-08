/**
 * Database Connection Configuration
 * 
 * This file handles the MongoDB database connection using Mongoose.
 * Features:
 * - Connection to MongoDB
 * - Automatic reconnection handling
 * - Connection event logging
 */
const mongoose = require("mongoose");
// Environment configuration
const config = require("./env");

/**
 * Connect to MongoDB database
 * Sets up event listeners for connection events
 */
async function connectDB() {
  // Set up event listener for disconnection
  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  // Set up event listener for reconnection
  mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected");
  });

  // Connect to MongoDB with configuration
  await mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: 10000, // Timeout for server selection
    maxPoolSize: 10, // Maximum number of connections in pool
  });

  console.log("MongoDB connected");
}

// Export the connection function
module.exports = connectDB;
