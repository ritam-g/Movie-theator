import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { movieService } from "../../services/movieService";

export const fetchTrendingMovies = createAsyncThunk(
  "movies/fetchTrendingMovies",
  async ({ page = 1, type = "trending", append = false } = {}, thunkAPI) => {
    try {
      const response = await movieService.getMovies({ page, type });
      return {
        results: response.data?.results || [],
        page: response.data?.page || page,
        totalPages: response.data?.totalPages || 1,
        append,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch movies");
    }
  }
);

export const fetchSearchResults = createAsyncThunk(
  "movies/fetchSearchResults",
  async ({ query, page = 1, append = false }, thunkAPI) => {
    try {
      if (!query?.trim()) {
        return { results: [], page: 1, totalPages: 1, query: "", append: false };
      }

      const response = await movieService.search(query, page);
      return {
        results: response.data?.results || [],
        page: response.data?.page || page,
        totalPages: response.data?.totalPages || 1,
        query,
        append,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to search");
    }
  }
);

export const fetchMovieDetails = createAsyncThunk("movies/fetchMovieDetails", async (movieId, thunkAPI) => {
  try {
    const response = await movieService.getMovieById(movieId);
    return response.data?.movie || null;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || "Failed to fetch movie details");
  }
});

const initialState = {
  trending: [],
  trendingPage: 0,
  trendingTotalPages: 1,
  trendingLoading: false,
  searchResults: [],
  searchQuery: "",
  searchPage: 0,
  searchTotalPages: 1,
  searchLoading: false,
  selectedMovie: null,
  detailsLoading: false,
  error: null,
};

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    clearSearchState(state) {
      state.searchResults = [];
      state.searchQuery = "";
      state.searchPage = 0;
      state.searchTotalPages = 1;
      state.searchLoading = false;
    },
    clearSelectedMovie(state) {
      state.selectedMovie = null;
      state.detailsLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.trendingLoading = true;
        state.error = null;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        const { results, page, totalPages, append } = action.payload;
        state.trendingLoading = false;
        state.trending = append ? [...state.trending, ...results] : results;
        state.trendingPage = page;
        state.trendingTotalPages = totalPages;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.trendingLoading = false;
        state.error = action.payload || "Failed to load trending movies";
      })
      .addCase(fetchSearchResults.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        const { results, page, totalPages, query, append } = action.payload;
        state.searchLoading = false;
        state.searchQuery = query;
        state.searchResults = append ? [...state.searchResults, ...results] : results;
        state.searchPage = page;
        state.searchTotalPages = totalPages;
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload || "Failed to search";
      })
      .addCase(fetchMovieDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedMovie = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload || "Failed to load movie details";
      });
  },
});

export const { clearSearchState, clearSelectedMovie } = movieSlice.actions;

export default movieSlice.reducer;
