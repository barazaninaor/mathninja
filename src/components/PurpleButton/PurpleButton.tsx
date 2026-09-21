import "./PurpleButton.css";

interface PurpleButtonProps {
  text: string;
  onClick?: () => void;
}

export function PurpleButton({ text, onClick }: PurpleButtonProps) {
  return (
    <button className="purple-btn" onClick={onClick}>
      {text}
    </button>
  );
}
