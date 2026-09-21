import "./TransparentButton.css";

interface TransparentButtonProps {
  text: string;
  onClick?: () => void;
}

export function TransparentButton({ text, onClick }: TransparentButtonProps) {
  return (
    <button className="transparent-btn" onClick={onClick}>
      {text}
    </button>
  );
}
