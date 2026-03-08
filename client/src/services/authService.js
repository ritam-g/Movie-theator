import api from "./api";

export const authService = {
  register(payload) {
    return api.post("/auth/register", payload);
  },
  login(payload) {
    return api.post("/auth/login", payload);
  },
  profile(token) {
    return api.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
