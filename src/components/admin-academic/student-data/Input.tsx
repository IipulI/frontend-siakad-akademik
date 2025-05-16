import { useState } from "react";

interface OptionProps {
  value: string;
  label: string;
}

interface InputFilterProps {
  options?: OptionProps[];
  label: string;
  select: boolean;
  defaultValue?: string;
}

// input for filter student
export function InputFilter({
  options,
  select = true,
  label,
  defaultValue = "",
}: InputFilterProps) {
  return (
    <div className={`input-filter-container grid grid-cols-2 items-center`}>
      <label className="text-xs w-fit font-medium">{label}</label>
      {select ? (
        <select
          className="bg-white border border-gray-300 text-black/60 font-semibold text-xs rounded focus:ring-blue-500 focus:border-blue-500 p-1"
          defaultValue={defaultValue}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          className="bg-white border border-gray-300 text-black/60 font-semibold text-xs rounded focus:ring-blue-500 focus:border-blue-500 p-1"
          defaultValue={defaultValue}
        />
      )}
    </div>
  );
}

interface OptionProps {
  value: string;
  label: string;
}

interface InputProps {
  label: string;
  required?: boolean;
  defaultValue?: string;
  placeHolder?: string;
}

interface SelectProps extends InputProps {
  options: OptionProps[];
}

export function TextInput({
  label,
  required = false,
  defaultValue = "",
  placeHolder,
}: InputProps) {
  return (
    <div className="grid grid-cols-2 items-center mb-3">
      <label className=" w-fit font-medium text-sm sm:text-base">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        placeholder={placeHolder}
        className="bg-white border text-sm sm:text-base border-gray-300 text-black/60 font-semibold  rounded focus:ring-blue-500 focus:border-blue-500 p-1"
        defaultValue={defaultValue}
      />
    </div>
  );
}

export function SelectInput({
  label,
  options,
  required = false,
  defaultValue = "",
}: SelectProps) {
  return (
    <div className="grid grid-cols-2 items-center mb-3">
      <label className=" w-fit font-medium text-sm sm:text-base">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <select
        className="bg-white border text-sm sm:text-base border-gray-300 text-black/60 font-semibold  rounded focus:ring-blue-500 focus:border-blue-500 p-1"
        defaultValue={defaultValue}
      >
        <option value="">{`-- Pilih ${label} --`}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface DateInputProps {
  label?: string;
  required?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function DateInput({
  label,
  required = true,
  defaultValue = "",
  onChange = () => {},
}: DateInputProps) {
  const [date, setDate] = useState(defaultValue);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDate(newValue);
    onChange(newValue);
  };

  return (
    <div className="mb-3 grid grid-cols-2 items-center">
      <label className="block font-medium mb-2 text-sm sm:text-base">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex">
        <div className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-l p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            color="gray"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <input
          type="date"
          className="w-full bg-white border text-sm sm:text-base border-gray-300 text-gray-400 rounded-r p-2"
          value={date}
          onChange={handleDateChange}
        />
      </div>
    </div>
  );
}

// Radio Options Component
interface RadioOptionProps {
  value: string;
  label: string;
}

interface RadioInputProps {
  label?: string;
  options?: RadioOptionProps[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
}

export function RadioInput({
  label = "Kebutuhan Khusus",
  options = [
    { value: "tidak", label: "Tidak" },
    { value: "ya", label: "Ya" },
  ],
  defaultValue = "tidak",
  onChange = () => {},
  name = "radio-group",
}: RadioInputProps) {
  const [selected, setSelected] = useState(defaultValue);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSelected(newValue);
    onChange(newValue);
  };

  return (
    <div className="mb-3 grid grid-cols-2">
      <label className="block font-medium mb-2 text-sm sm:text-base">
        {label}
      </label>
      <div className="flex gap-6">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={selected === option.value}
              onChange={handleRadioChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="ml-2 text-sm sm:text-base font-medium text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
