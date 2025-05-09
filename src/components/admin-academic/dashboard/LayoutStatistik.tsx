import React from "react";

interface LayoutStatistik {
  children: React.ReactNode;
  className?: string;
}

export default function LayoutStatistik({
  children,
  className,
}: LayoutStatistik) {
  return (
    <div
      className={`${className}`}
    >
      {children}
    </div>
  );
}
