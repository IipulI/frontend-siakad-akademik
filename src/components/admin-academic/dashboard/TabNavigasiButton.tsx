import React from "react";

interface TabNavigationButtonProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
  colorTab?: string;
  padding?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: "pill" | "button";
}

export function TabNavigationButton({
  children,
  isActive = false,
  onClick,
  colorTab = "bg-primary-green",
  padding = "py-2 px-3.5 sm:px-4",
  icon,
  className = "",
  variant = "pill",
}: TabNavigationButtonProps) {
  const activeClass = `${colorTab} text-white shadow-xs font-semibold`;
  const inactiveClass =
    variant === "pill"
      ? "text-slate-600 hover:text-slate-900 hover:bg-white/80 font-medium"
      : "bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60 font-medium";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg text-xs sm:text-sm transition-all duration-200 cursor-pointer flex justify-center items-center gap-2 whitespace-nowrap ${padding} ${
        isActive ? activeClass : inactiveClass
      } ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
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
          ? `w-full text-black bg-primary-green/40 text-xs font-bold text-left p-2 px-2`
          : `w-full bg-primary-green/20 text-xs text-black cursor-pointer text-left p-2 px-2`
      }
    >
      <span className="text-xs sm:text-sm xl:text-base">{children}</span>
    </button>
  );
}

// for OBE
export function TabNavigationButtonOBE({ onClick, isActive = false, label }) {
  return (
    <div
      className={
        isActive
          ? `flex items-center bg-primary-green/60 mb-1 text-black cursor-pointer`
          : `flex items-center bg-primary-green/30 mb-1 text-black cursor-pointer`
      }
      onClick={onClick}
    >
      <div
        className={
          isActive
            ? `w-1 h-10 bg-primary-green mr-3`
            : `w-1 h-10 bg-primary-green mr-3 opacity-40`
        }
      ></div>
      <p
        className={
          isActive ? `text-black font-semibold` : `text-black font-light`
        }
      >
        {label}
      </p>
    </div>
  );
}
