import "./SubTitle.css";

interface SubTitleProps {
  text: string;
}

/**
 * SubTitle component renders a flexible secondary subtitle with a distinct blue-purple glow.
 */
export function SubTitle({ text }: SubTitleProps) {
  return <h3 className="sub-title">{text}</h3>;
}
