import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { IOption } from "../../../types/models";

interface SearchableSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: IOption[];
  placeholder?: string;
}

// Dropdown filter yang bisa diketik untuk mencari opsi — ikon kaca pembesar
// di kiri menandai bahwa field ini bisa langsung diketik, bukan sekadar dropdown biasa.
export default function SearchableSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Cari & pilih...",
}: SearchableSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedOption = options.find((opt) => opt.value === value);
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(opt: IOption) {
    onChange(opt.value);
    setIsOpen(false);
    setSearch("");
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange("");
    setSearch("");
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-primary-yellow mb-1">
        {label}
      </label>
      <div className="relative" ref={containerRef}>
        <Search
          size={13}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          className="w-full bg-white border border-gray-300 text-xs sm:text-sm text-gray-700 rounded p-1.5 pl-7 pr-14 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
          value={isOpen ? search : selectedOption?.label ?? ""}
          onFocus={() => {
            setIsOpen(true);
            setSearch("");
          }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {selectedOption && !isOpen && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Bersihkan"
            >
              <X size={13} />
            </button>
          )}
          <ChevronDown
            size={14}
            className={`pointer-events-none text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        {isOpen && (
          <ul className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded border border-gray-300 bg-white text-xs sm:text-sm shadow">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  onMouseDown={() => handleSelect(opt)}
                  className={`cursor-pointer px-2 py-1 hover:bg-blue-50 ${
                    opt.value === value ? "bg-blue-50 font-semibold" : ""
                  }`}
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="px-2 py-1 text-gray-400">Tidak ada hasil</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
