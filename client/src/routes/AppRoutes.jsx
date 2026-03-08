import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import MovieDetails from "../pages/MovieDetails";
import Search from "../pages/Search";
import Favorites from "../pages/Favorites";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/AdminDashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/search" element={<Search />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
