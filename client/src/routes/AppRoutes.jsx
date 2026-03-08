import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "../pages/Home";
import MovieDetails from "../pages/MovieDetails";
import Search from "../pages/Search";
import Favorites from "../pages/Favorites";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/AdminDashboard";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isAdmin) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/search" element={<Search />} />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
