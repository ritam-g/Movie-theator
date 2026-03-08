import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const links = [
    { to: "/", label: "Home" },
    { to: "/search", label: "Search" },
    { to: "/favorites", label: "Favorites" },
  ];

  if (user?.isAdmin) {
    links.push({ to: "/admin", label: "Admin" });
  }

  if (!isAuthenticated) {
    links.push({ to: "/login", label: "Login" });
    links.push({ to: "/register", label: "Register" });
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="section-title">
          Movie Platform
        </NavLink>
        <nav className="nav-links">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
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
