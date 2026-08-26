import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

export interface SearchableSelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
}

// Dropdown ala Select2 (di SIAKAD lama): tombol nampilin label terpilih, klik buka panel
// dengan kotak cari + daftar opsi yang bisa difilter. Panelnya di-render lewat portal ke
// document.body (bukan nested di dalam tombol) supaya gak kepotong kalau dipakai di dalam
// container yang overflow-hidden/overflow-x-auto (misal sel tabel yang bisa di-scroll).
export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "-- Pilih --",
  searchPlaceholder = "Cari...",
  className = "",
  disabled = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const filteredOptions = searchText.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(searchText.trim().toLowerCase()))
    : options;

  const updatePosition = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const panelHeight = 260; // perkiraan tinggi maksimum panel (search box + list)
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < panelHeight && rect.top > spaceBelow;
    setPosition({
      top: openUpward ? rect.top - 4 : rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    const handleReposition = () => updatePosition();
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (wrapperRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setIsOpen(false);
      setSearchText("");
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
    setSearchText("");
  };

  const panel =
    isOpen && position
      ? createPortal(
          <div
            ref={panelRef}
            style={{ position: "fixed", top: position.top, left: position.left, width: Math.max(position.width, 220) }}
            className="z-50 bg-white border border-gray-300 rounded-md shadow-lg"
          >
            <div className="p-2 border-b border-gray-200">
              <input
                ref={inputRef}
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full p-1.5 border border-gray-300 rounded text-sm outline-none focus:ring-1 focus:ring-primary-green"
              />
            </div>
            <ul className="max-h-56 overflow-y-auto text-sm">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                        opt.value === value ? "bg-primary-green text-white hover:bg-primary-green" : "text-gray-700"
                      }`}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-gray-400 italic">Tidak ditemukan</li>
              )}
            </ul>
          </div>,
          document.body
        )
      : null;

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-600 flex items-center justify-between gap-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <span className="truncate text-left">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={14} className={`flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {panel}
    </div>
  );
}
