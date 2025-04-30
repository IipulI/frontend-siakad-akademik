import React from "react";

interface ContentCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function ContentCard({
  children,
  className = "bg-white rounded-md border-t-2 border-primary-yellow mb-10 h-lvh",
}: ContentCardProps) {
  return (
    <div className={className}>
      <div className="py-10">{children}</div>
    </div>
  );
}
