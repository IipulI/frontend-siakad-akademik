import React from "react";
interface DashboardInfoCardProps {
  children: React.ReactNode;
  title: string;
  lineColor: string;
}

export default function DashboardInfoCard({
  title,
  children,
  lineColor,
}: DashboardInfoCardProps) {
  return (
    <div
      className={`p-4 bg-white border-t-2 xl:-ml-10  ${lineColor} rounded-sm shadow-sm h-fit`}
    >
      <h1 className="font-semibold">{title}</h1>
      <div className="mt-5">{children}</div>
    </div>
  );
}
