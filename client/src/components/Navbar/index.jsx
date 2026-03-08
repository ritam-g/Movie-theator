import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/search", label: "Search" },
  { to: "/favorites", label: "Favorites" },
  { to: "/admin", label: "Admin" },
  { to: "/login", label: "Login" },
];

function Navbar() {
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
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
