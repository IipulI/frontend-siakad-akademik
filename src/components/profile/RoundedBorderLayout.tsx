import React from "react";

interface RoundedBorderLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function RoundedBorderLayout({ children, className }: RoundedBorderLayoutProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 p-4 rounded-2xl border-2 border-[#c0c0c0] ${className}`}
    >
      {children}
    </div>
  );
}
