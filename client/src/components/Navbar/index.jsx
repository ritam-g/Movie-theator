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
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilm, FaSearch, FaHeart, FaUser, FaSignOutAlt, FaBars, FaTimes, FaUserShield } from "react-icons/fa";
// Logout action from auth slice
import { logoutUser } from "../../redux/slices/authSlice";
import { useState } from "react";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Get authentication state from Redux store
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define navigation links
  const links = [
    { to: "/", label: "Home", icon: <FaFilm /> },
    { to: "/search", label: "Search", icon: <FaSearch /> },
  ];

  // Add Favorites link if user is authenticated
  if (isAuthenticated) {
    links.push({ to: "/favorites", label: "Favorites", icon: <FaHeart /> });
  }

  // Add Admin link if user is an admin
  if (user?.isAdmin) {
    links.push({ to: "/admin", label: "Admin", icon: <FaUserShield /> });
  }

  // Add Login/Register links if user is not authenticated
  if (!isAuthenticated) {
    links.push({ to: "/login", label: "Login", icon: <FaUser /> });
    links.push({ to: "/register", label: "Register", icon: <FaUser /> });
  }

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo/Home link */}
        <NavLink to="/" className="navbar-logo">
          <span className="logo-icon">M</span>
          <span className="logo-text">MovieFlix</span>
        </NavLink>

        {/* Desktop Navigation links */}
        <nav className="nav-links">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Desktop Logout button */}
        {isAuthenticated && (
          <div className="navbar-actions desktop-only">
            <motion.button
              type="button"
              className="nav-link"
              onClick={handleLogout}
              whileTap={{ scale: 0.95 }}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <span className="nav-icon"><FaSignOutAlt /></span>
              <span className="nav-label">Logout</span>
            </motion.button>
          </div>
        )}

        {/* Mobile menu toggle */}
        <button
          className="navbar-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              className={`nav-links mobile-nav ${isMobileMenuOpen ? 'is-open' : ''}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {links.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="nav-icon">{link.icon}</span>
                    <span className="nav-label">{link.label}</span>
                  </NavLink>
                </motion.div>
              ))}

              {isAuthenticated && (
                <motion.button
                  type="button"
                  className="nav-link"
                  onClick={handleLogout}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: links.length * 0.05 }}
                  style={{ width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer' }}
                >
                  <span className="nav-icon"><FaSignOutAlt /></span>
                  <span className="nav-label">Logout</span>
                </motion.button>
              )}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default Navbar;

