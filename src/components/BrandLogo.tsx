import React from "react";
import logoSrc from "../assets/Logo.png";

interface BrandLogoProps {
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function BrandLogo({ height = 36, className, style }: BrandLogoProps) {
  return (
    <img
      src={logoSrc}
      alt="StatKarmayogi"
      className={className}
      style={{
        height,
        width: "auto",
        objectFit: "contain",
        display: "block",
        ...style,
      }}
    />
  );
}
