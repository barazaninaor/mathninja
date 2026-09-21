import React from "react";
import "./GlassCard.css";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
}) => {
  return (
    <div className={`glass-card${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
};
