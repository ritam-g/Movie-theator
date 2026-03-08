import api from "./api";

export const favoriteService = {
  getFavorites() {
    return api.get("/favorites");
  },
  addFavorite(payload) {
    return api.post("/favorites/add", payload);
  },
  removeFavorite(payload) {
    return api.delete("/favorites/remove", { data: payload });
  },
  getHistory() {
    return api.get("/history");
  },
  addHistory(payload) {
    return api.post("/history/add", payload);
  },
};
