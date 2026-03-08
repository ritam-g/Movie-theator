import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  trending: [],
  popular: [],
  tvShows: [],
  people: [],
  loading: false,
  error: null,
  page: 1,
};

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setTrendingMovies(state, action) {
      state.trending = action.payload || [];
    },
    appendTrendingMovies(state, action) {
      state.trending = [...state.trending, ...(action.payload || [])];
    },
    setMovieLoading(state, action) {
      state.loading = Boolean(action.payload);
    },
    setMovieError(state, action) {
      state.error = action.payload || null;
    },
    setMoviePage(state, action) {
      state.page = action.payload || 1;
    },
  },
});

export const {
  setTrendingMovies,
  appendTrendingMovies,
  setMovieLoading,
  setMovieError,
  setMoviePage,
} = movieSlice.actions;

export default movieSlice.reducer;
