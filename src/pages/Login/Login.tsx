import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../../apiService";
import "./Login.css";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Clear fields on mount and set up Enter key listener
  useEffect(() => {
    setEmail("");
    setPassword("");

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        sendSignIn();
      }
    };

    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  const sendSignIn = async () => {
    setErrorMessage("");

    // Grab current values directly from DOM elements to support browser autofill smoothly
    const emailInput =
      (document.getElementById("email") as HTMLInputElement)?.value || email;
    const passwordInput =
      (document.getElementById("password") as HTMLInputElement)?.value ||
      password;

    if (!emailInput.trim() || !passwordInput.trim()) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const data = await signIn(emailInput, passwordInput);
      const token = data.theToken || data.myToken || data.token;

      if (token) {
        // Save token to localStorage upon successful login
        localStorage.setItem("token", token);
        setErrorMessage("");
        setIsLoading(true);

        // Delay navigation to showcase the neon loading overlay
        setTimeout(() => {
          navigate("/game");
        }, 3000);
      } else {
        throw new Error("No token received.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Server error.");
    }
  };

  return (
    <div>
      {/* Neon loading overlay component */}
      <LoadingOverlay isLoading={isLoading} text="LOADING..." />

      <div className="login-page">
        <div className="login-container">
          <h2>LOG IN</h2>

          <div>
            <label>EMAIL:</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label>PASSWORD:</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button id="signinBtn" onClick={sendSignIn}>
            Log IN
          </button>

          <p id="errorMessage">{errorMessage}</p>

          <div id="signUpSection">
            <h3>
              DON'T HAVE A USER? <br />
              <br />
              SIGN UP NOW!
            </h3>
            <button
              className="secondary-btn"
              onClick={() => navigate("/signup")}
            >
              SIGN UP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
