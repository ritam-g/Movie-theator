import api from "./api";

export const movieService = {
  getMovies(params = {}) {
    return api.get("/movies", { params });
  },
  getMovieById(id) {
    return api.get(`/movies/${id}`);
  },
  search(query, page = 1, type = "search") {
    return api.get("/movies", { params: { query, page, type } });
  },
};
