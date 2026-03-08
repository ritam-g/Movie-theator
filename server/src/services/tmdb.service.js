const axios = require("axios");

const tmdbClient = axios.create({
  baseURL: process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3",
  timeout: 15000,
});

async function getFromTMDB(path, params = {}) {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    throw new Error("TMDB_API_KEY is not configured");
  }

  const response = await tmdbClient.get(path, {
    params: {
      api_key: apiKey,
      ...params,
    },
  });

  return response.data;
}

module.exports = {
  getFromTMDB,
};
