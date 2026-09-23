import "./LoadingOverlay.css";

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
}

/**
 * LoadingOverlay component for rendering a neon dark themed loading screen.
 */
export default function LoadingOverlay({
  isLoading,
  text = "LOADING...",
}: LoadingOverlayProps) {
  // Return null if loading is false to hide the overlay completely
  if (!isLoading) return null;

  return (
    <div id="loadingOverlay" style={{ display: "flex" }}>
      <div className="loader-text">{text}</div>
    </div>
  );
}
