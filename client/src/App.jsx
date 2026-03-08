/**
 * Root App Component
 * This is the main component that wraps the entire application
 * It initializes the navbar and routes, and handles authentication state
 */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
// Thunk action to fetch user profile from the server
import { fetchProfile } from "./redux/slices/authSlice";
// Thunk actions to fetch user's favorites and watch history
import { fetchFavorites, fetchHistory } from "./redux/slices/favoriteSlice";

function App() {
  const dispatch = useDispatch();
  // Get authentication state from Redux store
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  // Effect to fetch user data when authenticated
  // This runs when the user logs in or when the app first loads with a valid token
  useEffect(() => {
    // Only fetch profile if user has a token and is authenticated
    if (!token || !isAuthenticated) return;

    // Fetch user profile, favorites, and watch history
    dispatch(fetchProfile());
    dispatch(fetchFavorites());
    dispatch(fetchHistory());
  }, [dispatch, token, isAuthenticated]);

  return (
    <div className="app-shell">
      {/* Navigation bar is always visible */}
      <Navbar />
      {/* Main content area with routing */}
      <main className="container">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
