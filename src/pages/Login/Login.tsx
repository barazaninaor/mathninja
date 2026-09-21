import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Clear fields on mount (similar to body onload="clearFields()")
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

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid email or password.");
      }

      const data = await res.json();
      const token = data.theToken || data.myToken || data.token;

      if (token) {
        localStorage.setItem("token", token);

        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        setErrorMessage("");
        setIsLoading(true);

        // השהייה של 3 שניות כפי שביקשת בעיצוב
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
      {isLoading && (
        <div id="loadingOverlay" style={{ display: "flex" }}>
          <div className="loader-text">LOADING...</div>
        </div>
      )}

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
