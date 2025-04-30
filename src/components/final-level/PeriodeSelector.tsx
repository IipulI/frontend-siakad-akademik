import React from "react";

interface PeriodeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
}

export default function PeriodeSelector({
  value,
  onChange,
  options,
  label = "Periode Akademik",
}: PeriodeSelectorProps) {
  return (
    <div className="flex flex-col w-full lg:flex-row lg:w-[900px] lg:items-center">
      <h2 className="font-semibold mb-2 lg:mb-0 lg:w-80">{label}</h2>
      <div className="relative w-full">
        <select
          className="w-full  p-1.5 border border-gray-300 rounded-md bg-white pr-8 text-gray-500 text-sm xl:text-base cursor-pointer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
