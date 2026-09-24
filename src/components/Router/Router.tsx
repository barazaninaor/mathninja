import { useEffect } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { Home } from "../../pages/Home/Home";
import Game from "../../pages/Game/Game";
import { About } from "../../pages/About/About";
import "./Router.css";
import { Navbar } from "../NavBar/NavBar";
import Scores from "../../pages/Scores/Scores";
import Signup from "../../pages/Signup/Signup";
import Login from "../../pages/Login/Login";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

/**
 * Router component for managing application navigation using HashRouter for GitHub Pages compatibility.
 */
export function Router() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/scores" element={<Scores />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Signup />} />
        <Route path="/signin" element={<Login />} />
      </Routes>
    </HashRouter>
  );
}

export default Router;
