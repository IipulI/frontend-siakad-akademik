export default function PeriodeSelector({
  value,
  onChange,
  options,
  label = "Periode Akademik",
}) {
  return (
    <div className="flex items-center">
      <h2 className="font-semibold">{label}</h2>
      <div className="relative w-full md:w-64 ml-3">
        <select
          className="w-full p-1.5 border border-gray-300 rounded-md bg-white pr-8 text-gray-500 text-sm xl:text-base"
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
