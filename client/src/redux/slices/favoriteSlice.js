import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { favoriteService } from "../../services/favoriteService";
import { logoutUser } from "./authSlice";

export const fetchFavorites = createAsyncThunk("favorites/fetchFavorites", async (_, thunkAPI) => {
  try {
    const response = await favoriteService.getFavorites();
    return response.data?.favorites || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || "Failed to fetch favorites");
  }
});

export const addFavoriteMovie = createAsyncThunk("favorites/addFavoriteMovie", async (payload, thunkAPI) => {
  try {
    const response = await favoriteService.addFavorite(payload);
    return response.data?.favorites || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || "Failed to add favorite");
  }
});

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

export const fetchHistory = createAsyncThunk("favorites/fetchHistory", async (_, thunkAPI) => {
  try {
    const response = await favoriteService.getHistory();
    return response.data?.history || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || "Failed to fetch watch history");
  }
});

export const addHistoryItem = createAsyncThunk("favorites/addHistoryItem", async (payload, thunkAPI) => {
  try {
    const response = await favoriteService.addHistory(payload);
    return response.data?.history || [];
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || "Failed to update watch history");
  }
});

const initialState = {
  items: [],
  history: [],
  loading: false,
  error: null,
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addCase(addHistoryItem.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.items = [];
        state.history = [];
        state.loading = false;
        state.error = null;
      });
  },
});

export default favoriteSlice.reducer;
