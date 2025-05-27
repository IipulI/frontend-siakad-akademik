import React from "react";

interface TabNavigationButtonProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
  colorTab?: string;
  padding?: string;
}

export function TabNavigationButton({
  children,
  isActive = false,
  onClick,
  colorTab = "bg-blue-500",
  padding = "py-3 sm:p-4",
}: TabNavigationButtonProps) {
  return (
    <button
      onClick={onClick}
      className={
        isActive
          ? `w-full text-center ${colorTab} rounded-t-md p-2 ${padding} text-sm text-white transition-all duration-500 flex justify-center space-x-2 items-center `
          : `w-full text-center bg-[#dddddd] rounded-t-md p-2 ${padding} text-sm text-secondary-gray cursor-pointer flex justify-center space-x-2 items-center`
      }
    >
      <span className="text-xs sm:text-sm xl:text-base">{children}</span>
    </button>
  );
}

// for student
export function TabNavigationButtonStudent({
  children,
  isActive = false,
  onClick,
}: TabNavigationButtonProps) {
  return (
    <button
      onClick={onClick}
      className={
        isActive
          ? `w-full text-black bg-[#116E63]/40 text-xs font-bold text-left p-2 px-2`
          : `w-full bg-[#116E63]/20 text-xs text-black cursor-pointer text-left p-2 px-2`
      }
    >
      <span className="text-xs sm:text-sm xl:text-base">{children}</span>
    </button>
  );
}
