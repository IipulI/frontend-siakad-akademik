import { FaSearch } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

export default function SearchBar({
  value,
  onChange,
  onSearch,
  onRefresh,
  placeholder = "Cari...",
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <div className="flex-grow w-full lg:w-[600px]">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          placeholder={placeholder}
          className="flex-grow p-1.5 border border-gray-300 rounded-l-md text-sm xl:text-base"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 text-white p-2 px-3 hover:bg-green-700 cursor-pointer"
        >
          <FaSearch />
        </button>
        <button
          type="button"
          onClick={onRefresh}
          className="bg-primary-blueDark text-white p-2 px-3 rounded-r-md hover:bg-blue-900 cursor-pointer"
        >
          <FiRefreshCw />
        </button>
      </form>
    </div>
  );
}
