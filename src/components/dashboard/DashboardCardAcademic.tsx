import React from "react";

interface DashboardCardAcademicProps {
  number: number;
  title: string;
  color: string;
}

export default function DashboardCardAcademic({ number, title, color }: DashboardCardAcademicProps) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-md border flex flex-col justify-between h-full min-h-[90px]">
      <h1 className={`${color || 'text-primary-blue'} font-bold text-xl sm:text-2xl`}>{number}</h1>
      <p className="text-secondary-gray font-semibold opacity-65 text-xs sm:text-sm mt-1 leading-tight break-words">
        {title}
      </p>
    </div>
  );
}
