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

    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setUsername("");
      setIsLoading(false);
      navigate("/");
    }, 800); // Simulate network/cleanup delay for a polished UX
  };

  return (
    <>
      {/* Global neon loading overlay activated only on heavy/specific actions */}
      <LoadingOverlay isLoading={isLoading} text="LOADING..." />

      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            Math <span>Ninja</span>
          </div>

          <ul className="nav-links nav-main">
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

          <ul className="nav-links nav-auth">
            {isAuthenticated ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "15px" }}
              >
                <span style={{ color: "#ffffff", fontSize: "0.95rem" }}>
                  Welcome,{" "}
                  <strong style={{ color: "#ffffff" }}>{username}</strong>
                </span>
                <li>
                  <button
                    onClick={handleLogout}
                    className="logout-link"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "inherit",
                      fontFamily: "inherit",
                      padding: 0,
                    }}
                  >
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
      </nav>
    </>
  );
}

export default Navbar;
