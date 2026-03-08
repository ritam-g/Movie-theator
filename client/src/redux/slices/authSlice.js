import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";

const TOKEN_KEY = "movie_platform_token";

function readToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function saveToken(token) {
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export const registerUser = createAsyncThunk("auth/registerUser", async (payload, thunkAPI) => {
  try {
    const response = await authService.register(payload);
    const token = response.data?.token || null;
    if (token) saveToken(token);
    return {
      token,
      user: response.data?.user || null,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || "Registration failed");
  }
});

export const loginUser = createAsyncThunk("auth/loginUser", async (payload, thunkAPI) => {
  try {
    const response = await authService.login(payload);
    const token = response.data?.token || null;
    if (token) saveToken(token);
    return {
      token,
      user: response.data?.user || null,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || "Login failed");
  }
});

export const fetchProfile = createAsyncThunk("auth/fetchProfile", async (_, thunkAPI) => {
  try {
    const response = await authService.profile();
    return response.data?.user || null;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || "Failed to load profile");
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  clearToken();
  return true;
});

const initialState = {
  user: null,
  token: readToken(),
  isAuthenticated: Boolean(readToken()),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = Boolean(action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = Boolean(action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load profile";
        if (state.token) {
          clearToken();
          state.token = null;
          state.isAuthenticated = false;
          state.user = null;
        }
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
