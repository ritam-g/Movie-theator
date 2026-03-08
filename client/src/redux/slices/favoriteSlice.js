import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setFavorites(state, action) {
      state.items = action.payload || [];
    },
    addFavorite(state, action) {
      const movie = action.payload;
      if (movie?.id && !state.items.find((item) => item.id === movie.id)) {
        state.items.push(movie);
      }
    },
    removeFavorite(state, action) {
      const movieId = action.payload;
      state.items = state.items.filter((item) => item.id !== movieId);
    },
  },
});

export const { setFavorites, addFavorite, removeFavorite } = favoriteSlice.actions;

export default favoriteSlice.reducer;
