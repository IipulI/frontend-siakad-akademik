import React from "react";

interface ButtonClickProps {
  text?: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
  spacing?: string;
  disabled?: boolean;
}

export default function ButtonClick({
  text,
  icon,
  color,
  onClick,
  spacing,
  disabled,
}: ButtonClickProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${color} text-white w-fit rounded items-center px-2  p-1 text-xs md:text-sm font-semibold flex justify-center space-x-${spacing}`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}
