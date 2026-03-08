const dotenv = require("dotenv");

dotenv.config();

function parseNumber(value, fallbackValue) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallbackValue;
}

function buildConfig() {
  const config = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseNumber(process.env.PORT, 5000),
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
    tmdbApiKey: process.env.TMDB_API_KEY || "",
    tmdbBaseUrl: process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3",
    clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  };

  const requiredVariables = [
    { key: "MONGO_URI", value: config.mongoUri },
    { key: "JWT_SECRET", value: config.jwtSecret },
  ];

  const missingKeys = requiredVariables.filter((entry) => !entry.value).map((entry) => entry.key);

  if (missingKeys.length > 0) {
    throw new Error(`Missing required environment variables: ${missingKeys.join(", ")}`);
  }

  return config;
}

module.exports = buildConfig();
