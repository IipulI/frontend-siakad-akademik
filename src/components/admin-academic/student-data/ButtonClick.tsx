import React from "react";

interface ButtonClickProps {
  text?: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
  spacing?: string;
  hover?: string;
}

export default function ButtonClick({
  text,
  icon,
  color,
  onClick,
  spacing,
  hover,
}: ButtonClickProps) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white w-fit rounded items-center px-2 cursor-pointer p-1 text-xs md:text-sm font-semibold flex justify-center ${hover} active:scale-90 transition-all space-x-${spacing}`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}
