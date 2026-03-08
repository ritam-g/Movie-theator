const app = require("./app");
const connectDB = require("./config/db");
const config = require("./config/env");
const mongoose = require("mongoose");

let serverInstance = null;

async function startServer() {
  try {
    await connectDB();

    serverInstance = app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

async function gracefulShutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully.`);

  if (serverInstance) {
    await new Promise((resolve, reject) => {
      serverInstance.close((error) => {
        if (error) return reject(error);
        return resolve();
      });
    });
  }

  await mongoose.connection.close();
  process.exit(0);
}

process.on("SIGINT", () => {
  gracefulShutdown("SIGINT").catch((error) => {
    console.error("Graceful shutdown failed:", error.message);
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  gracefulShutdown("SIGTERM").catch((error) => {
    console.error("Graceful shutdown failed:", error.message);
    process.exit(1);
  });
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

startServer();
