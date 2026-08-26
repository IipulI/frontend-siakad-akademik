import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { searchLecturers } from "../../../hooks/useKelasKuliah";

interface DosenOption {
  id: string;
  nama: string;
  nidn?: string;
}

interface DosenAsyncSelectProps {
  value: string;
  selectedLabel?: string;
  onChange: (id: string, label: string) => void;
  className?: string;
}

const MIN_CHARS = 3;

export function DosenAsyncSelect({
  value,
  selectedLabel,
  onChange,
  className = "border p-1 w-full",
}: DosenAsyncSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuRect, setMenuRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const trimmedQuery = query.trim();
  const { data: results, isFetching } = searchLecturers(
    trimmedQuery.length >= MIN_CHARS ? trimmedQuery : ""
  );

  // Dropdown is portaled to <body> (position: fixed) so it isn't clipped by
  // the schedule table's overflow-x-auto wrapper, which also forces
  // overflow-y to auto and clips anything popping out below the row.
  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const rect = inputRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMenuRect({ top: rect.bottom, left: rect.left, width: rect.width });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest("[data-dosen-async-menu]")
      ) {
        setIsOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (dosen: DosenOption) => {
    onChange(dosen.id, dosen.nama);
    setIsOpen(false);
    setQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("", "");
    setQuery("");
  };

  return (
    <div className="relative" ref={containerRef}>
      <input
        ref={inputRef}
        type="text"
        className={className}
        placeholder="Cari nama dosen..."
        value={isOpen ? query : selectedLabel || ""}
        onFocus={() => {
          setIsOpen(true);
          setQuery("");
        }}
        onChange={(e) => setQuery(e.target.value)}
      />
      {value && !isOpen && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60 text-xs"
          aria-label="Hapus pilihan dosen"
        >
          ✕
        </button>
      )}
      {isOpen &&
        menuRect &&
        createPortal(
          <ul
            data-dosen-async-menu
            className="fixed z-50 mt-1 max-h-48 overflow-auto rounded border border-gray-300 bg-white text-xs sm:text-sm shadow text-left"
            style={{
              top: menuRect.top,
              left: menuRect.left,
              width: Math.max(menuRect.width, 200),
            }}
          >
            {trimmedQuery.length === 0 ? (
              <li className="p-1 px-2 text-black/40">
                Ketik nama dosen untuk mencari
              </li>
            ) : trimmedQuery.length < MIN_CHARS ? (
              <li className="p-1 px-2 text-black/40">
                Ketik minimal {MIN_CHARS} huruf
              </li>
            ) : isFetching ? (
              <li className="p-1 px-2 text-black/40">Mencari...</li>
            ) : results?.length > 0 ? (
              results.map((dosen: DosenOption) => (
                <li
                  key={dosen.id}
                  onMouseDown={() => handleSelect(dosen)}
                  className={`cursor-pointer p-1 px-2 hover:bg-blue-100 ${
                    dosen.id === value ? "bg-blue-50 font-semibold" : ""
                  }`}
                >
                  {dosen.nama}
                  {dosen.nidn ? ` (${dosen.nidn})` : ""}
                </li>
              ))
            ) : (
              <li className="p-1 px-2 text-black/40">Tidak ada hasil</li>
            )}
          </ul>,
          document.body
        )}
    </div>
  );
}
