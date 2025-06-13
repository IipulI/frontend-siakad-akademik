// components/ui/ButtonGroupOption.tsx
import React from "react";

interface Option {
  value: string;
  text: string;
}

interface ButtonGroupOptionProps {
  options: Option[];
  selected: string;
  onChange: (value: string) => void;
}

const ButtonGroupOption: React.FC<ButtonGroupOptionProps> = ({
  options,
  selected,
  onChange,
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`w-full px-2 py-2 text-sm text-primary-green text-left ${
            selected === option.value ? "bg-primary-green/15 border-l-4 border-primary-green" : ""
          } hover:bg-primary-green/10`}
        >
          {option.text}
        </button>
      ))}
    </div>
  );
};

export default ButtonGroupOption;
