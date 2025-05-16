import React from 'react';
import { User } from "lucide-react";

export default function TabNavigationButton({
  children,
  isActive = false,
  onClick,
  icon,
}) {
  return (
    <button
      onClick={onClick}
      className={
        isActive
          ? `w-full text-center bg-[#198754] rounded-full p-1.5 text-white transition-all duration-500 flex justify-center space-x-2 items-center `
          : `w-full text-center bg-[#dddddd] rounded-full p-1.5 text-secondary-gray cursor-pointer flex justify-center space-x-2 items-center`
      }
    >
      {icon}
      <span className="font-semibold">{children}</span>
    </button>
  );
}
