/**
 * Redux Store Configuration
 * 
 * The Redux store is the central state management for the entire application.
 * It holds the global state and allows components to access and update it.
 * 
 * This file configures the store by combining multiple "slices" (reducers)
 * that each manage a specific part of the application state.
 */
import { configureStore } from "@reduxjs/toolkit";
// Reducer for managing movie-related state (trending, search, details)
import movieReducer from "./slices/movieSlice";
// Reducer for managing authentication state (user, token, login status)
import authReducer from "./slices/authSlice";
// Reducer for managing favorites and watch history
import favoriteReducer from "./slices/favoriteSlice";

// Configure and create the Redux store
export const store = configureStore({
  // The reducer object defines how the state should be updated
  // Each key corresponds to a slice of the global state
  reducer: {
    // movies slice handles all movie-related data
    movies: movieReducer,
    // auth slice handles user authentication state
    auth: authReducer,
    // favorites slice handles user's favorites and watch history
    favorites: favoriteReducer,
  },
});
