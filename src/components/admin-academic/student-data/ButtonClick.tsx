import React from "react";

interface ButtonClickProps {
  text?: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
  spacing?: string;
}

export default function ButtonClick({
  text,
  icon,
  color,
  onClick,
  spacing,
}: ButtonClickProps) {
  return (
    <button
      onClick={onClick}
<<<<<<< HEAD
      className={`${color} text-white w-fit rounded items-center px-2 cursor-pointer p-1 text-xs md:text-sm font-semibold flex justify-center space-x-${spacing}`}
=======
      className={`${color} text-white rounded items-center px-2 cursor-pointer p-1 text-xs md:text-sm font-semibold flex justify-center space-x-${spacing}`}
>>>>>>> d685ecb07137074c521652c6c12012c786fc6446
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}
