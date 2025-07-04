import React from "react";

interface FilterDropdownProps {
    title: string;
    options: string[];
    // Make onSelect optional using '?'
    onSelect?: (label: string) => void;
    // Make value optional using '?'
    value?: string;
}

export default function FilterDropdown({ title, options, onSelect, value }: FilterDropdownProps) {

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLabel = event.target.value;
        console.log("FilterDropdown internal handleChange fired. Selected Label:", selectedLabel);

        // CRITICAL FIX: Only call onSelect if it's provided by the parent
        if (onSelect) {
            onSelect(selectedLabel);
        }
    };

    return (
        <div className="flex text-xs bg-white space-x-5 items-center w-full p-2 px-4 border-t-2  rounded-sm shadow-sm">
            <label htmlFor={title.replace(/\s/g, '')} className="font-semibold">
                {title}
            </label>
            <select
                name={title.replace(/\s/g, '')}
                id={title.replace(/\s/g, '')}
                className="border-2 p-1 rounded w-40 "
                onChange={handleChange}
                // CRITICAL FIX: Use the 'value' prop if provided, otherwise default to the first option.
                // This makes it a controlled component if the parent provides 'value',
                // otherwise it behaves like a default selected <select>.
                value={value !== undefined ? value : options[0]}
            >
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}