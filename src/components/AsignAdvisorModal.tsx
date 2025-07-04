import { ILecturer, useSearchLecturers } from "../hooks/admin-akademik/usePembimbingAkademik.tsx";
import { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function AssignAdvisorModal({ isOpen, onClose, onSave, selectedStudentCount }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedLecturer, setSelectedLecturer] = useState<ILecturer | null>(null);
  // 1. State baru untuk kontrol manual dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const { data: lecturers, isLoading } = useSearchLecturers(debouncedSearchTerm);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedLecturer(null); // Hapus pilihan jika pengguna mengetik lagi
    if (e.target.value) {
      setIsDropdownOpen(true); // Buka dropdown saat mulai mengetik
    } else {
      setIsDropdownOpen(false); // Tutup jika input kosong
    }
  };

  const handleSelectLecturer = (lecturer: ILecturer) => {
    setSelectedLecturer(lecturer);
    setSearchTerm(`${lecturer.nidn} - ${lecturer.nama}`);
    // 2. Tutup dropdown secara manual setelah memilih
    setIsDropdownOpen(false);
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40 rounded-md">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
        <h2 className="text-xl font-bold mb-4">Set Pembimbing Akademik</h2>
        <p className="mb-4 text-sm text-gray-600">Anda akan menetapkan Dosen Pembimbing untuk {selectedStudentCount} mahasiswa terpilih.</p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Dosen</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau NIDN..."
              value={searchTerm}
              onChange={handleInputChange}
              // 3. (Opsional) Tutup dropdown jika pengguna klik di luar
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)}
              className="w-full border-2 p-2 rounded-md text-sm"
            />
            {/* 4. Gunakan state isDropdownOpen untuk menampilkan dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                {isLoading && <div className="p-3 text-sm text-gray-500">Mencari...</div>}
                {!isLoading && lecturers?.length === 0 && <div className="p-3 text-sm text-gray-500">Dosen tidak ditemukan.</div>}
                {lecturers?.map((lecturer) => (
                  <div key={lecturer.id} onClick={() => handleSelectLecturer(lecturer)} className="p-3 hover:bg-gray-100 cursor-pointer text-sm">
                    {lecturer.nidn} - {lecturer.nama}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-md border bg-gray-100 text-gray-800 hover:bg-gray-200 font-semibold text-sm">
            Batal
          </button>
          <button
            onClick={() => selectedLecturer && onSave(selectedLecturer.id)}
            disabled={!selectedLecturer || isLoading} // Disable tombol simpan saat sedang loading
            className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-400 font-semibold text-sm"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
