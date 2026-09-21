import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
 * Router component for managing application navigation.
 * Automatically adjusts the basename depending on whether the app is running locally or in production (GitHub Pages).
 */
export function Router() {
  return (
    <BrowserRouter basename="/mathninja">
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
    </BrowserRouter>
  );
}

export default Router;
