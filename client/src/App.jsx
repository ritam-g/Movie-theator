import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { fetchProfile } from "./redux/slices/authSlice";
import { fetchFavorites, fetchHistory } from "./redux/slices/favoriteSlice";

function App() {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token || !isAuthenticated) return;
    dispatch(fetchProfile());
    dispatch(fetchFavorites());
    dispatch(fetchHistory());
  }, [dispatch, token, isAuthenticated]);

  return (
    <div className="app-shell">
      <Navbar />
      <main className="container">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
