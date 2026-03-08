import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { user, token } = action.payload || {};
      state.user = user || null;
      state.token = token || null;
      state.isAuthenticated = Boolean(token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setAuthLoading(state, action) {
      state.loading = Boolean(action.payload);
    },
    setAuthError(state, action) {
      state.error = action.payload || null;
    },
  },
});

export const { setCredentials, logout, setAuthLoading, setAuthError } = authSlice.actions;

export default authSlice.reducer;
