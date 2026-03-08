/**
 * App Routes - Application Route Configuration
 * 
 * This file defines all the routes for the application using React Router.
 * It handles:
 * - Public routes (Home, Search, Login, Register)
 * - Protected routes (Favorites - requires login)
 * - Admin routes (AdminDashboard - requires admin privileges)
 * 
 * The file also includes two wrapper components:
 * - ProtectedRoute: Ensures user is logged in
 * - AdminRoute: Ensures user is an admin
 */
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "../pages/Home";
import MovieDetails from "../pages/MovieDetails";
import Search from "../pages/Search";
import Favorites from "../pages/Favorites";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/AdminDashboard";

/**
 * ProtectedRoute Component
 * 
 * A wrapper component that only allows access to logged-in users.
 * If user is not authenticated, redirects to login page.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  // If not authenticated, redirect to login page
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  // Otherwise, render the protected content
  return children;
}

/**
 * AdminRoute Component
 * 
 * A wrapper component that only allows access to admin users.
 * If user is not an admin, redirects to home page.
 * Requires user to be authenticated first.
 */
function AdminRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  // First check if user is authenticated
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  // Then check if user is an admin
  if (!user?.isAdmin) return <Navigate to="/" replace />;
  // Otherwise, render the admin content
  return children;
}

/**
 * Main AppRoutes Component
 * 
 * Defines all application routes and wraps protected routes
 * with appropriate route guards (ProtectedRoute, AdminRoute)
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Home page - accessible to everyone */}
      <Route path="/" element={<Home />} />

      {/* Movie details page - accessible to everyone */}
      <Route path="/movie/:id" element={<MovieDetails />} />

      {/* Search page - accessible to everyone */}
      <Route path="/search" element={<Search />} />

      {/* Favorites page - only for logged-in users */}
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />

      {/* Login page - accessible to everyone */}
      <Route path="/login" element={<Login />} />

      {/* Register page - accessible to everyone */}
      <Route path="/register" element={<Register />} />

      {/* Admin dashboard - only for admin users */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* Catch-all route - redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
