/**
 * Navbar Component
 * 
 * The main navigation bar for the application.
 * Displays navigation links based on user's authentication status:
 * - Always shows: Home, Search
 * - Logged in: Favorites, Logout (plus Admin if admin)
 * - Not logged in: Login, Register
 * 
 * Uses React Router's NavLink for active state styling.
 */
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// Logout action from auth slice
import { logoutUser } from "../../redux/slices/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  // Get authentication state from Redux store
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Define navigation links
  const links = [
    { to: "/", label: "Home" },
    { to: "/search", label: "Search" },
    { to: "/favorites", label: "Favorites" },
  ];

  // Add Admin link if user is an admin
  if (user?.isAdmin) {
    links.push({ to: "/admin", label: "Admin" });
  }

  // Add Login/Register links if user is not authenticated
  if (!isAuthenticated) {
    links.push({ to: "/login", label: "Login" });
    links.push({ to: "/register", label: "Register" });
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo/Home link */}
        <NavLink to="/" className="section-title">
          Movie Platform
        </NavLink>

        {/* Navigation links */}
        <nav className="nav-links">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}

          {/* Logout button - only shown when authenticated */}
          {isAuthenticated ? (
            <button type="button" onClick={() => dispatch(logoutUser())}>
              Logout
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
