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
        <div className="flex text-xs md:text-sm bg-white gap-3 items-center w-full p-3 px-4 rounded-xl border border-slate-200/80 border-t-4 border-t-primary-yellow shadow-xs">
            <label htmlFor={title.replace(/\s/g, '')} className="font-semibold text-slate-800 whitespace-nowrap">
                {title}:
            </label>
            <select
                name={title.replace(/\s/g, '')}
                id={title.replace(/\s/g, '')}
                className="border border-slate-300 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium text-slate-700 bg-white shadow-2xs focus:ring-1 focus:ring-primary-green focus:border-primary-green flex-1 transition-all"
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