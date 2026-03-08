import api from "./api";

export const adminService = {
  createMovie(payload) {
    return api.post("/admin/movie", payload);
  },
  updateMovie(id, payload) {
    return api.put(`/admin/movie/${id}`, payload);
  },
  deleteMovie(id) {
    return api.delete(`/admin/movie/${id}`);
  },
  getUsers(page = 1, limit = 20) {
    return api.get("/admin/users", { params: { page, limit } });
  },
  banUser(userId, isBanned = true) {
    return api.patch("/admin/users/ban", { userId, isBanned });
  },
  deleteUser(userId) {
    return api.delete(`/admin/users/${userId}`);
  },
};
