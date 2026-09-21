import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Signup.css";

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.pathname === "/profile";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Notification");
  const [modalMessage, setModalMessage] = useState("");
  const [modalCallback, setModalCallback] = useState<(() => void) | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    if (isEditMode && token && userData && Object.keys(userData).length > 0) {
      if (userData.fullName) setFullName(userData.fullName);
      if (userData.email) setEmail(userData.email);
      document.title = "Update Profile";
    }
  }, [isEditMode]);

  const showAlert = (title: string, message: string, callback?: () => void) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalCallback(() => callback || null);
    setModalOpen(true);
  };

  const handleModalConfirm = () => {
    setModalOpen(false);
    if (modalCallback) {
      modalCallback();
    }
  };

  const handleFormAction = async () => {
    const token = isEditMode ? localStorage.getItem("token") : null;
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      showAlert("Validation Error", "All fields are required.");
      return;
    }

    if (!token && !password) {
      showAlert("Validation Error", "Password is required for Sign Up.");
      return;
    }

    const userData = {
      fullName: trimmedName,
      email: trimmedEmail,
      password,
    };

    const method = token ? "PUT" : "POST";
    const url = token ? "/updateProfile" : "/signUp";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        showAlert("Error", data.message || "Action failed.");
        return;
      }

      const successTitle = method === "PUT" ? "Profile Updated" : "Success";

      showAlert(successTitle, data.message || "Action completed!", () => {
        if (method === "POST" && data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else if (token) {
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          const updatedUser = {
            ...storedUser,
            fullName: trimmedName,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        navigate("/");
      });
    } catch (err) {
      console.error("Connection Error:", err);
      showAlert("Error", "Could not connect to the server.");
    }
  };

  return (
    <div className="signup-page">
      <div className="container signup-container">
        <h2 id="formTitle">{isEditMode ? "Update Your Profile" : "Sign Up"}</h2>

        <div>
          <label>Full Name:</label>
          <input
            type="text"
            id="fullName"
            placeholder="e.g. Elon Musk"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            id="email"
            placeholder="example@email.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isEditMode}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            id="password"
            placeholder={
              isEditMode
                ? "Leave empty to keep current password"
                : "At least 6 characters"
            }
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!isEditMode}
          />
        </div>

        <button id="submitBtn" onClick={handleFormAction}>
          {isEditMode ? "Save Changes" : "Sign Up"}
        </button>

        {!isEditMode && (
          <div id="signInSection">
            <h3>
              Already have a User? <br />
              <br />
              Log in Now!
            </h3>
            <button onClick={() => navigate("/signin")}>Log In</button>
          </div>
        )}
      </div>

      {modalOpen && (
        <div id="customModal" className="modal" style={{ display: "flex" }}>
          <div className="modal-content container">
            <h3 id="modalTitle">{modalTitle}</h3>
            <p id="modalMessage">{modalMessage}</p>

            <div className="modal-actions">
              <button
                id="modalConfirm"
                className="btn-small"
                onClick={handleModalConfirm}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
