/**
 * Favorites Slice - Redux State Management for User Favorites and History
 * 
 * This file manages:
 * - User's favorite movies list
 * - User's watch history (movies they've viewed)
 * - Adding/removing favorites
 * - Adding watch history items
 */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { favoriteService } from "../../services/favoriteService";
// Import logoutUser to clear favorites when user logs out
import { logoutUser } from "./authSlice";

/**
 * Async Thunk: Fetch all favorite movies for the current user
 * @returns {Array} Array of favorite movie objects
 */
export const fetchFavorites = createAsyncThunk("favorites/fetchFavorites", async (_, thunkAPI) => {
  try {
    const response = await favoriteService.getFavorites();
    return response.data?.favorites || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || "Failed to fetch favorites");
  }
});

/**
 * Async Thunk: Add a movie to favorites
 * @param {Object} payload - Movie data to add
 * @returns {Array} Updated array of favorites
 */
export const addFavoriteMovie = createAsyncThunk("favorites/addFavoriteMovie", async (payload, thunkAPI) => {
  try {
    const response = await favoriteService.addFavorite(payload);
    return response.data?.favorites || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || "Failed to add favorite");
  }
});

/**
 * Async Thunk: Remove a movie from favorites
 * @param {Object} payload - Identifier for the movie to remove (movieId or tmdbId)
 * @returns {Array} Updated array of favorites
 */
export const removeFavoriteMovie = createAsyncThunk(
  "favorites/removeFavoriteMovie",
  async (payload, thunkAPI) => {
    try {
      const response = await favoriteService.removeFavorite(payload);
      return response.data?.favorites || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to remove favorite");
    }
  }
);

/**
 * Async Thunk: Fetch user's watch history
 * @returns {Array} Array of history items
 */
export const fetchHistory = createAsyncThunk("favorites/fetchHistory", async (_, thunkAPI) => {
  try {
    const response = await favoriteService.getHistory();
    return response.data?.history || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || "Failed to fetch watch history");
  }
});

/**
 * Async Thunk: Add an item to watch history
 * @param {Object} payload - Movie data to add to history
 * @returns {Array} Updated history array
 */
export const addHistoryItem = createAsyncThunk("favorites/addHistoryItem", async (payload, thunkAPI) => {
  try {
    const response = await favoriteService.addHistory(payload);
    return response.data?.history || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || "Failed to update watch history");
  }
});

// Initial state for favorites slice
const initialState = {
  items: [],       // Array of favorite movies
  history: [],     // Array of watch history items
  loading: false,  // Loading state
  error: null,     // Error message if any
};

// Create the favorites slice
const favoriteSlice = createSlice({
  name: "favorites",
  initialState,

  // No synchronous reducers needed
  reducers: {},

  // Handle async thunk actions
  extraReducers: (builder) => {
    builder
      // Handle fetchFavorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch favorites";
      })

      // Handle addFavoriteMovie
      .addCase(addFavoriteMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavoriteMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addFavoriteMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add favorite";
      })

      // Handle removeFavoriteMovie
      .addCase(removeFavoriteMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavoriteMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(removeFavoriteMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove favorite";
      })

      // Handle fetchHistory
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load watch history";
      })

      // Handle addHistoryItem - just update history without loading state
      .addCase(addHistoryItem.fulfilled, (state, action) => {
        state.history = action.payload;
      })

      // Clear favorites and history when user logs out
      .addCase(logoutUser.fulfilled, (state) => {
        state.items = [];
        state.history = [];
        state.loading = false;
        state.error = null;
      });
  },
});

// Export the reducer
export default favoriteSlice.reducer;
