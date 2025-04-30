import React from "react";

interface FilterSectionProps {
  children: React.ReactNode;
  className?: string;
}

export default function FilterSection({
  children,
  className = "flex flex-col lg:flex-row lg:justify-between gap-5 lg:gap-10 mb-4 items-center border-2 p-2 rounded",
}: FilterSectionProps) {
  return <div className={className}>{children}</div>;
}
