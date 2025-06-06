import React from "react";

interface DashboardCardAcademicProps {
  number: number;
  title: string;
  color: string;
}

export default function DashboardCardAcademic({ number, title, color }: DashboardCardAcademicProps) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-md border">
      <h1 className={`${color} font-semibold text-2xl`}>{number}</h1>
      <h1 className="text-secondary-gray font-semibold opacity-65 text-sm">
        {title}
      </h1>
    </div>
  );
}
