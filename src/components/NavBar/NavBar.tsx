import { NavLink } from "react-router-dom";
import "./Navbar.css";

/**
 * Navbar component for site-wide navigation with a neon dark aesthetic.
 */
export function Navbar() {
  return (
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
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
