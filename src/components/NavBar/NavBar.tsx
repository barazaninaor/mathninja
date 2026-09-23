import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";
import "./Navbar.css";

/**
 * Navbar component for site-wide navigation with a neon dark aesthetic.
 */
export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Controlled loading state
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile hamburger menu state

  // Update authentication state on route change without triggering full-screen loading
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    if (token) {
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        if (userData && userData.fullName) {
          setUsername(userData.fullName);
        } else {
          setUsername("Math Ninja");
        }
      } catch {
        setUsername("Math Ninja");
      }
    }
  }, [location]);

  // Handle user logout with a deliberate, smooth loading overlay transition
  const handleLogout = () => {
    setIsLoading(true); // Trigger the loading overlay purposefully
    setIsMenuOpen(false);

    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setUsername("");
      setIsLoading(false);
      navigate("/");
    }, 800); // Simulate network/cleanup delay for a polished UX
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Global neon loading overlay activated only on heavy/specific actions */}
      <LoadingOverlay isLoading={isLoading} text="LOADING..." />

      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            Math <span>Ninja</span>
          </div>

          {/* Hamburger Menu Toggle Button for Mobile */}
          <button
            className={`navbar-toggle ${isMenuOpen ? "active" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Wrapper for links and auth that collapses on mobile */}
          <div className={`nav-menu-wrapper ${isMenuOpen ? "active" : ""}`}>
            <ul className="nav-links nav-main" onClick={closeMenu}>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/game"
                  id="nav-game"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Game
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/scores"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Scores
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  About
                </NavLink>
              </li>
            </ul>

            <ul className="nav-links nav-auth" onClick={closeMenu}>
              {isAuthenticated ? (
                <div className="auth-logged-in-container">
                  <span className="welcome-text">
                    Welcome, <strong>{username}</strong>
                  </span>
                  <li>
                    <button onClick={handleLogout} className="logout-link">
                      Log Out
                    </button>
                  </li>
                </div>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="/signup"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      Sign Up
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/signin"
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      Log In
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
