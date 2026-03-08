/**
 * Auth Slice - Redux State Management for Authentication
 * 
 * This file manages all authentication-related state including:
 * - User profile information
 * - Authentication token storage
 * - Login/Logout/Register actions
 * 
 * It handles storing the JWT token in localStorage for persistence
 */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";

// Key used for storing the authentication token in localStorage
const TOKEN_KEY = "movie_platform_token";

/**
 * Read the stored authentication token from localStorage
 * @returns {string|null} The stored token or null if not found
 */
function readToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Save the authentication token to localStorage
 * @param {string} token - The JWT token to store
 */
function saveToken(token) {
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove the authentication token from localStorage
 * Called when user logs out
 */
function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Async Thunk: Register a new user
 * 
 * @param {Object} payload - Registration data
 * @param {string} payload.name - User's name
 * @param {string} payload.email - User's email
 * @param {string} payload.password - User's password
 * @returns {Object} User data and authentication token
 */
export const registerUser = createAsyncThunk("auth/registerUser", async (payload, thunkAPI) => {
  try {
    const response = await authService.register(payload);
    const token = response.data?.token || null;
    // Save token if received from server
    if (token) saveToken(token);
    return {
      token,
      user: response.data?.user || null,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || "Registration failed");
  }
});

/**
 * Async Thunk: Login an existing user
 * 
 * @param {Object} payload - Login credentials
 * @param {string} payload.email - User's email
 * @param {string} payload.password - User's password
 * @returns {Object} User data and authentication token
 */
export const loginUser = createAsyncThunk("auth/loginUser", async (payload, thunkAPI) => {
  try {
    const response = await authService.login(payload);
    const token = response.data?.token || null;
    // Save token if login successful
    if (token) saveToken(token);
    return {
      token,
      user: response.data?.user || null,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || "Login failed");
  }
});

/**
 * Async Thunk: Fetch user profile from the server
 * Requires a valid authentication token
 * @returns {Object} User profile data
 */
export const fetchProfile = createAsyncThunk("auth/fetchProfile", async (_, thunkAPI) => {
  try {
    const response = await authService.profile();
    return response.data?.user || null;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || "Failed to load profile");
  }
});

/**
 * Async Thunk: Logout the current user
 * Clears the token from localStorage and resets auth state
 * @returns {boolean} Always returns true
 */
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  clearToken();
  return true;
});

// Initial auth state
// Note: We check for existing token on app startup to restore session
const initialState = {
  user: null,                      // User profile object
  token: readToken(),              // JWT token from localStorage
  isAuthenticated: Boolean(readToken()), // Whether user is logged in
  loading: false,                 // Loading state during async operations
  error: null,                    // Error message if any
};

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,

  // No synchronous reducers needed - all auth actions are async
  reducers: {},

  // Handle async thunk actions for auth operations
  extraReducers: (builder) => {
    builder
      // Handle registerUser async thunk
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

      // Handle loginUser async thunk
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

      // Handle fetchProfile async thunk
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
        // If token is invalid/expired, clear auth state
        if (state.token) {
          clearToken();
          state.token = null;
          state.isAuthenticated = false;
          state.user = null;
        }
      })

      // Handle logoutUser async thunk
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

// Export the reducer to be used in the Redux store
export default authSlice.reducer;
