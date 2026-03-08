import api from "./api";

export const authService = {
  register(payload) {
    return api.post("/auth/register", payload);
  },
  login(payload) {
    return api.post("/auth/login", payload);
  },
  profile() {
    return api.get("/auth/profile");
  },
};
