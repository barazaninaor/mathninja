import "./MainTitle.css";

interface MainTitleProps {
  text: string;
}

/**
 * MainTitle component renders a flexible primary heading with a glowing purple aesthetic.
 */
export function MainTitle({ text }: MainTitleProps) {
  return <h2 className="main-title">{text}</h2>;
}
