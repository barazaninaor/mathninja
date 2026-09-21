import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "../../pages/Home/Home";
import Game from "../../pages/Game/Game";
import { About } from "../../pages/About/About";
import "./Router.css";
import { Navbar } from "../NavBar/NavBar";
import Scores from "../../pages/Scores/Scores";
import Signup from "../../pages/Signup/Signup";
import Login from "../../pages/Login/Login";

/**
 * Router component for managing application navigation.
 */
export function Router() {
  return (
    <BrowserRouter basename="/mathninja">
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
