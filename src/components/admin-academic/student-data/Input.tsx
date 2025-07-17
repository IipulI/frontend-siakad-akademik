import { useState } from "react";

interface OptionProps {
  value: string;
  label: string;
}

interface InputFilterProps {
  options?: OptionProps[];
  label: string;
  select?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

// Input for filter student
export function InputFilter({
  options = [],
  select = true,
  label,
  placeholder,
  value,
  onChange,
}: InputFilterProps) {
  const isControlled = value !== undefined && onChange !== undefined;
  const inputValue = isControlled ? value : "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={`input-filter-container grid grid-cols-2 items-center`}>
      <label className="text-xs w-fit font-medium">{label}</label>
      {select ? (
        <select
          className="bg-white border border-gray-300 text-black/60 font-semibold text-xs rounded focus:ring-blue-500 focus:border-blue-500 p-1"
          value={inputValue}
          onChange={isControlled ? handleChange : undefined}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          placeholder={placeholder}
          className="bg-white border border-gray-300 text-black/60 font-semibold text-xs rounded focus:ring-blue-500 focus:border-blue-500 p-1"
          value={inputValue}
          onChange={isControlled ? handleChange : undefined}
        />
      )}
    </div>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps<T> {
  label?: string;
  options: T[];
  required?: boolean;
  value?: string;
  defaultValue?: string;
  error?: string;
  onChange?: (val: T | null) => void;
  getOptionLabel?: (option: T) => string; // optional
  getOptionValue?: (option: T) => string; // optional
}

export function SelectInput<T>({
  label,
  options,
  required = false,
  value,
  defaultValue = "",
  error,
  getOptionLabel = (opt: T) => String(opt), // ✅ fallback
  getOptionValue = (opt: T) => String(opt), // ✅ fallback
  onChange,
}: SelectProps<T>) {
  const isControlled = value !== undefined;
  const selectValue = isControlled ? value : defaultValue ?? "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedOption = options.find(
      (option) => getOptionValue(option) === selectedValue
    );
    if (onChange) {
      onChange(selectedOption ?? null);
    }
  };

  return (
    <div className="grid grid-cols-2 items-center mb-3">
      {label ? (
        <label className="w-fit font-medium text-sm sm:text-base">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      ) : (
        ""
      )}
      <div className="flex flex-col">
        <select
          className={`bg-white border text-sm sm:text-base ${
            error ? "border-red-500" : "border-gray-300"
          } text-black/60 font-semibold rounded focus:ring-blue-500 focus:border-blue-500 p-1`}
          value={selectValue}
          onChange={handleChange}
          required={required}
        >
          <option value="">{`-- Pilih ${label} --`}</option>
          {options?.map((option) => {
            const val = getOptionValue(option);
            return (
              <option key={val} value={val}>
                {getOptionLabel(option)}
              </option>
            );
          })}
        </select>
        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      </div>
    </div>
  );
}

interface InputProps {
  label: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  error?: string;
}
export function TextInput({
  label,
  required = false,
  value,
  defaultValue = "",
  placeholder,
  onChange,
  error,
}: InputProps) {
  const isControlled = value !== undefined && onChange !== undefined;
  const inputValue = isControlled ? value : defaultValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="grid grid-cols-2 items-center mb-3">
      <label className="w-fit font-medium text-sm sm:text-base">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex flex-col">
        <input
          placeholder={placeholder}
          className={`bg-white border text-sm sm:text-base ${
            error ? "border-red-500" : "border-gray-300"
          } text-black/60 font-semibold rounded focus:ring-blue-500 focus:border-blue-500 p-1`}
          value={inputValue}
          onChange={isControlled ? handleChange : undefined}
          defaultValue={!isControlled ? defaultValue : undefined}
        />
        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      </div>
    </div>
  );
}

interface DateInputProps {
  label?: string;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function DateInput({
  label,
  required = true,
  value,
  defaultValue = "",
  onChange,
  error,
}: DateInputProps) {
  const isControlled = value !== undefined && onChange !== undefined;
  const [internalDate, setInternalDate] = useState(defaultValue);

  const dateValue = isControlled ? value : internalDate;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Jika parent tidak mengatur value (uncontrolled), simpan lokal
    if (value === undefined) {
      setInternalDate(newValue);
    }

    // Selalu kirim perubahan ke parent
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="mb-3 grid grid-cols-2 items-center">
      <label className="block font-medium mb-2 text-sm sm:text-base">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex">
        <div className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-l p-2">
          {/* Icon Kalender */}
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
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <input
          type="date"
          className="w-full bg-white border text-sm sm:text-base border-gray-300 text-gray-400 rounded-r p-2"
          value={value !== undefined ? value : internalDate}
          onChange={handleDateChange}
        />
      </div>
    </div>
  );
}

interface RadioOptionProps {
  value: string | boolean;
  label: string;
}

interface RadioInputProps {
  label?: string;
  options?: RadioOptionProps[];
  value?: string | boolean;
  defaultValue?: string | boolean;
  onChange?: (value: boolean) => void;
  name?: string;
  error?: string;
}

export function RadioInput({
  label = "Kebutuhan Khusus",
  options = [
    { value: false, label: "Tidak" },
    { value: true, label: "Ya" },
  ],
  value,
  defaultValue = false,
  onChange,
  name = "radio-group",
  error,
}: RadioInputProps) {
  const isControlled = value !== undefined && onChange !== undefined;
  const [internalSelected, setInternalSelected] = useState(defaultValue);

  const selectedValue = isControlled ? value : internalSelected;

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === "true";

    if (isControlled && onChange) {
      onChange(newValue);
    } else {
      setInternalSelected(newValue);
    }
  };

  return (
    <div className="mb-3 grid grid-cols-2">
      <label className="block font-medium mb-2 text-sm sm:text-base">
        {label}
      </label>
      <div className="flex flex-col">
        <div className="flex gap-6">
          {options?.map((option) => (
            <div key={String(option.value)} className="flex items-center">
              <input
                type="radio"
                id={`${name}-${option.value}`}
                name={name}
                value={String(option.value)}
                checked={selectedValue === option.value}
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
        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      </div>
    </div>
  );
}
