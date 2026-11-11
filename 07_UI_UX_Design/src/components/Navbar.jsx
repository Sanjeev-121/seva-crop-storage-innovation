import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSeedling } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/storages", label: "Cold Storages" },
    { to: "/schemes", label: "Govt Schemes" },
  ];

  if (isLoggedIn) {
    links.push({ to: "/dashboard", label: "My Dashboard" });
    links.push({ to: "/applications", label: "My Applications" });
  } else {
    links.push({ to: "/login", label: "Login" });
    links.push({ to: "/register", label: "Register" });
  }

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link to="/" className="brand" onClick={closeMenu}>
            <FaSeedling className="brand-icon" aria-hidden="true" />
            <span>Crop Storage Help</span>
          </Link>

          <button
            type="button"
            className="nav-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </div>

        <nav aria-label="Main menu">
          <ul
            id="main-menu"
            className={menuOpen ? "nav-links open" : "nav-links"}
          >
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={linkClass}
                  onClick={closeMenu}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            {isLoggedIn && (
              <li>
                <button type="button" className="nav-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
