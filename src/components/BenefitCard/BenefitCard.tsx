import "./BenefitCard.css";

interface BenefitCardProps {
  title: string;
  text: string;
}

/**
 * BenefitCard component renders an individual neon-styled benefit block.
 */
export function BenefitCard({ title, text }: BenefitCardProps) {
  return (
    <div className="benefit-item">
      <h4 className="benefit-title">{title}</h4>
      <p className="benefit-text">{text}</p>
    </div>
  );
}

export default BenefitCard;
