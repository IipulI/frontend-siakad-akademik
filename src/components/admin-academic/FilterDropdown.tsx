import React from "react"
export default function FilterDropdown({title, options}: {title: string, options: string[]}) {
    return (
        <div className="flex text-xs bg-white sm:text-sm space-x-5 items-center w-full p-2 px-4 border-t-2 border-primary-yellow rounded-sm shadow-sm">
            <label htmlFor="" className="font-semibold">
                {title}
            </label>
            <select name="" id="" className="border-2 p-1 rounded w-40 sm:w-60 ">
                {options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
      </div>
    )
}
