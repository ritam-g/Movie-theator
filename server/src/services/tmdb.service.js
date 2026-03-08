const axios = require("axios");
const config = require("../config/env");

const tmdbClient = axios.create({
  baseURL: config.tmdbBaseUrl,
  timeout: 15000,
});

async function getFromTMDB(path, params = {}) {
  if (!config.tmdbApiKey) {
    throw new Error("TMDB_API_KEY is not configured");
  }

  const response = await tmdbClient.get(path, {
    params: {
      api_key: config.tmdbApiKey,
      ...params,
    },
  });

  return response.data;
}

module.exports = {
  getFromTMDB,
};
