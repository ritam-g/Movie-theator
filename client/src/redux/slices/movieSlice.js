/**
 * Movie Slice - Redux State Management for Movies
 * 
 * This file manages all movie-related state in the Redux store including:
 * - Trending movies (home page)
 * - Search results
 * - Movie details
 * 
 * It uses Redux Toolkit's createAsyncThunk for handling async API calls
 */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { movieService } from "../../services/movieService";

/**
 * Async Thunk: Fetch trending movies from the API
 * 
 * @param {Object} params - Parameters for fetching movies
 * @param {number} params.page - Page number for pagination (default: 1)
 * @param {string} params.type - Type of movies to fetch (default: "trending")
 * @param {boolean} params.append - Whether to append results to existing list
 * @returns {Object} Movie results with pagination info
 */
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

/**
 * Async Thunk: Search for movies by query
 * 
 * @param {Object} params - Search parameters
 * @param {string} params.query - Search query string
 * @param {number} params.page - Page number for pagination
 * @param {boolean} params.append - Whether to append results
 * @returns {Object} Search results with pagination info
 */
export const fetchSearchResults = createAsyncThunk(
  "movies/fetchSearchResults",
  async ({ query, page = 1, append = false }, thunkAPI) => {
    try {
      // Don't search if query is empty or whitespace
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

/**
 * Async Thunk: Fetch detailed information about a specific movie
 * 
 * @param {string|number} movieId - The TMDB ID or local ID of the movie
 * @returns {Object} Detailed movie information
 */
export const fetchMovieDetails = createAsyncThunk("movies/fetchMovieDetails", async (movieId, thunkAPI) => {
  try {
    const response = await movieService.getMovieById(movieId);
    return response.data?.movie || null;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || "Failed to fetch movie details");
  }
});

// Initial state for the movies slice
// Defines all the state properties and their default values
const initialState = {
  trending: [],              // Array of trending movies
  trendingPage: 0,           // Current page for trending movies
  trendingTotalPages: 1,     // Total available pages
  trendingLoading: false,    // Loading state for trending movies
  searchResults: [],         // Array of search results
  searchQuery: "",           // Current search query
  searchPage: 0,             // Current page for search results
  searchTotalPages: 1,       // Total available pages for search
  searchLoading: false,      // Loading state for search
  selectedMovie: null,       // Currently selected movie for details view
  detailsLoading: false,     // Loading state for movie details
  error: null,               // Error message if any
};

// Create the movie slice with reducers and extraReducers
const movieSlice = createSlice({
  name: "movies",
  initialState,

  // Synchronous reducers - direct state updates
  reducers: {
    /**
     * Clear search state - resets all search-related values
     * Called when user clears the search input
     */
    clearSearchState(state) {
      state.searchResults = [];
      state.searchQuery = "";
      state.searchPage = 0;
      state.searchTotalPages = 1;
      state.searchLoading = false;
    },

    /**
     * Clear selected movie - resets movie details view
     * Called when leaving the movie details page
     */
    clearSelectedMovie(state) {
      state.selectedMovie = null;
      state.detailsLoading = false;
    },
  },

  // ExtraReducers - handle async thunk actions (pending/fulfilled/rejected)
  extraReducers: (builder) => {
    builder
      // Handle fetchTrendingMovies async thunk
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.trendingLoading = true;
        state.error = null;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        const { results, page, totalPages, append } = action.payload;
        state.trendingLoading = false;
        // Append or replace results based on append flag
        state.trending = append ? [...state.trending, ...results] : results;
        state.trendingPage = page;
        state.trendingTotalPages = totalPages;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.trendingLoading = false;
        state.error = action.payload || "Failed to load trending movies";
      })

      // Handle fetchSearchResults async thunk
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

      // Handle fetchMovieDetails async thunk
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

// Export actions for use in components
export const { clearSearchState, clearSelectedMovie } = movieSlice.actions;

// Export the reducer to be used in the Redux store
export default movieSlice.reducer;
