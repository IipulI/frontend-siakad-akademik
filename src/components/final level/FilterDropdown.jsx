export default function FilterDropdown({
  value,
  onChange,
  options,
  placeholder = "-Semua-",
}) {
  return (
    <div className="relative w-full md:w-32">
      <select
        className="w-full p-1.5 border border-gray-300 rounded-md bg-white pr-8 text-gray-500 text-sm xl:text-base"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
