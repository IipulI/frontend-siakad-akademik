import React from "react";

interface TabNavigationButtonProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

export default function TabNavigationButtonStatistik({
  children,
  isActive = false,
  onClick,
}: TabNavigationButtonProps) {
  return (
    <button
      onClick={onClick}
      className={
        isActive
          ? `w-full text-center border-1 border-gray-400 bg-blue-500 rounded-t-lg p-2 py-3 sm:p-4 text-sm text-white transition-all duration-500 flex justify-center space-x-2 items-center `
          : `w-full text-center border-1 border-gray-400 bg-[#dddddd] rounded-t-lg p-2 py-3 sm:p-4 text-sm text-secondary-gray cursor-pointer flex justify-center space-x-2 items-center`
      }
    >
      <span className="text-xs sm:text-sm xl:text-base">{children}</span>
    </button>
  );
}
