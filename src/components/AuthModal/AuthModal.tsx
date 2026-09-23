import { useNavigate } from "react-router-dom";
import "./AuthModal.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string; // כותרת דינמית עם ברירת מחדל
  message?: string; // הודעה דינמית
  onConfirm?: () => void; // פעולה לכפתור ראשי
  confirmText?: string; // טקסט לכפתור ראשי
  showSecondaryButton?: boolean; // האם להציג כפתור נוסף (למשל הרשמה)
}

export default function AuthModal({
  isOpen,
  onClose,
  title = "RESTRICTED ACCESS",
  message = "You must be logged in as a Math Ninja to access this training zone and view scores!",
  onConfirm,
  confirmText = "OK",
  showSecondaryButton = false,
}: AuthModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleConfirmClick = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-container">
        <h2>{title}</h2>
        <p>{message}</p>

        <div className="auth-modal-actions">
          <button
            className="action-btn login-action"
            onClick={handleConfirmClick}
          >
            <span style={{ color: "#ffffff", position: "relative", zIndex: 2 }}>
              {confirmText}
            </span>
          </button>

          {showSecondaryButton && (
            <button
              className="action-btn signup-action"
              onClick={() => navigate("/signup")}
            >
              <span
                style={{ color: "#ffffff", position: "relative", zIndex: 2 }}
              >
                SIGN UP
              </span>
            </button>
          )}
        </div>

        <button className="close-modal-btn" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
