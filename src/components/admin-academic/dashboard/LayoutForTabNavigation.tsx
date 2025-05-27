import React from "react";

interface LayoutForTabNavigation {
  children: React.ReactNode;
  className?: string;
}

export default function LayoutForTabNavigation({
  children,
  className,
}: LayoutForTabNavigation) {
  return <div className={`${className}`}>{children}</div>;
}
