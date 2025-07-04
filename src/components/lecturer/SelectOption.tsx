// src/components/admin-academic/student-data/SelectOption.tsx
import React from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectOptionProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

const SelectOption: React.FC<SelectOptionProps> = ({ label, options, value, onChange }) => (
  <div className="input-filter-container grid grid-cols-2 items-center">
    <label className="text-xs w-fit font-medium">{label}</label>
    <select
      className="bg-white border border-gray-300 text-black/60 font-semibold text-xs rounded focus:ring-blue-500 focus:border-blue-500 p-1"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default SelectOption;