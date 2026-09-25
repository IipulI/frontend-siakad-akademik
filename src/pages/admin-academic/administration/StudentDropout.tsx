import { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { Eye, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import { IMahasiswaKeluar } from "../../../types/administrasi.types";

const dummyMahasiswaKeluar: IMahasiswaKeluar[] = [
  {
    id: "1",
    nim: "21100003508",
    nama: "Andrew",
    programStudi: "Manajemen",
    angkatan: "2021",
    periodeAkmTerakhir: "2024 Ganjil",
    statusKeluar: "Drop Out / Dikeluarkan",
    noSkKeluar: "091234578",
    tanggalSk: "2024-09-01",
  },
  {
    id: "2",
    nim: "20240004004",
    nama: "Irna Nolla",
    programStudi: "Manajemen",
    angkatan: "2023",
    periodeAkmTerakhir: "2024 Genap",
    statusKeluar: "Mengundurkan Diri / Keluar",
    noSkKeluar: "093456123",
    tanggalSk: "2025-02-10",
  },
  {
    id: "3",
    nim: "18041100012",
    nama: "Nur Khofifah",
    programStudi: "Manajemen",
    angkatan: "2019",
    periodeAkmTerakhir: "2023 Ganjil",
    statusKeluar: "Mutasi",
    noSkKeluar: "087654321",
    tanggalSk: "2023-08-15",
  },
  {
    id: "4",
    nim: "20080799",
    nama: "Richardo",
    programStudi: "Ilmu Informatika",
    angkatan: "2020",
    periodeAkmTerakhir: "2024 Genap",
    statusKeluar: "Lulus",
    noSkKeluar: "-",
    tanggalSk: "-",
  },
];

const statusBadgeColor: Record<string, string> = {
  "Drop Out / Dikeluarkan": "bg-red-100 text-red-700",
  "Mengundurkan Diri / Keluar": "bg-orange-100 text-orange-700",
  Mutasi: "bg-purple-100 text-purple-700",
  Transfer: "bg-blue-100 text-blue-700",
  Lulus: "bg-green-100 text-green-700",
  Wafat: "bg-gray-200 text-gray-700",
  Hilang: "bg-gray-200 text-gray-700",
};

export default function StudentDropout() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [filters, setFilters] = useState({
    programStudi: "",
    angkatan: "",
    statusKeluar: "",
  });

  const programStudi = [
    { value: "", label: "-- Semua Program Studi --" },
    { value: "Manajemen", label: "Manajemen" },
    { value: "Ilmu Informatika", label: "Ilmu Informatika" },
  ];

  const angkatan = [
    { value: "", label: "-- Semua Angkatan --" },
    { value: "2019", label: "2019" },
    { value: "2020", label: "2020" },
    { value: "2021", label: "2021" },
    { value: "2023", label: "2023" },
  ];

  const statusKeluar = [
    { value: "", label: "-- Semua Status Keluar --" },
    { value: "Drop Out / Dikeluarkan", label: "Drop Out / Dikeluarkan" },
    { value: "Mengundurkan Diri / Keluar", label: "Mengundurkan Diri / Keluar" },
    { value: "Transfer", label: "Transfer" },
    { value: "Mutasi", label: "Mutasi" },
    { value: "Lulus", label: "Lulus" },
    { value: "Wafat", label: "Wafat" },
    { value: "Hilang", label: "Hilang" },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  function ResetFilter() {
    setFilters({ programStudi: "", angkatan: "", statusKeluar: "" });
    setSearchKeyword("");
    setCurrentPage(1);
  }

  function TambahMahasiswaKeluar() {
    alert("Buka form Data Mahasiswa Keluar (dummy)");
  }

  function Detail(item: IMahasiswaKeluar) {
    alert(`Lihat detail mahasiswa keluar: ${item.nama}`);
  }

  function HapusData(item: IMahasiswaKeluar) {
    alert(`Hapus data mahasiswa keluar: ${item.nama} (dummy)`);
  }

  const filteredData = dummyMahasiswaKeluar.filter((item) => {
    return (
      (!filters.programStudi || item.programStudi === filters.programStudi) &&
      (!filters.angkatan || item.angkatan === filters.angkatan) &&
      (!filters.statusKeluar || item.statusKeluar === filters.statusKeluar) &&
      (!searchKeyword ||
        item.nama.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.nim.includes(searchKeyword))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <MainLayout titlePage="Mahasiswa Keluar" isGreeting={false}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
        <InputFilter
          options={programStudi}
          label="Program Studi"
          value={filters.programStudi}
          onChange={(value) => handleFilterChange("programStudi", value)}
        />
        <InputFilter
          options={angkatan}
          label="Angkatan"
          value={filters.angkatan}
          onChange={(value) => handleFilterChange("angkatan", value)}
        />
        <InputFilter
          options={statusKeluar}
          label="Status Keluar"
          value={filters.statusKeluar}
          onChange={(value) => handleFilterChange("statusKeluar", value)}
        />
      </div>

      <div className="border-t-2 border-primary-green bg-white mt-5 p-2 py-4 rounded-sm shadow-sm pb-4">
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 justify-between">
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                className="border-2 p-1 rounded text-xs w-60"
                placeholder="Cari NIM / nama mahasiswa"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setCurrentPage(1);
                }}
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <ButtonClick
              icon={<Search size={16} strokeWidth={3} />}
              color="bg-primary-yellow"
              onClick={() => setCurrentPage(1)}
            />
            <ButtonClick
              icon={<RefreshCw size={16} strokeWidth={3} />}
              color="bg-blue-900"
              onClick={ResetFilter}
            />
          </div>

          <div className="flex space-x-3">
            <ButtonClick
              icon={<Plus size={15} strokeWidth={3} />}
              color="bg-primary-green"
              text="Tambah"
              onClick={TambahMahasiswaKeluar}
            />
          </div>
        </div>

        <div className="overflow-x-auto my-4">
          <table className="min-w-[900px] w-full border-collapse">
            <thead>
              <tr className="bg-primary-green text-white">
                <th className="p-2 border font-semibold border-gray-300">NIM</th>
                <th className="p-2 border font-semibold border-gray-300">Nama</th>
                <th className="p-2 border font-semibold border-gray-300">
                  Program Studi
                </th>
                <th className="p-2 border font-semibold border-gray-300">Angkatan</th>
                <th className="p-2 border font-semibold border-gray-300">
                  Periode AKM Terakhir
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Status Keluar
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  No. SK Keluar
                </th>
                <th className="p-2 border font-semibold border-gray-300">Tgl SK</th>
                <th className="p-2 border font-semibold border-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    Tidak ada data mahasiswa keluar yang ditemukan
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-2 text-sm">{item.nim}</td>
                    <td className="border border-gray-300 p-2 text-sm">{item.nama}</td>
                    <td className="border border-gray-300 p-2 text-sm">
                      {item.programStudi}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      {item.angkatan}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      {item.periodeAkmTerakhir}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          statusBadgeColor[item.statusKeluar] ??
                          "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {item.statusKeluar}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      {item.noSkKeluar}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      {item.tanggalSk}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <div className="flex justify-center space-x-2">
                        <ButtonClick
                          icon={<Eye size={16} />}
                          color="bg-primary-blueSoft"
                          onClick={() => Detail(item)}
                        />
                        <ButtonClick
                          icon={<Trash2 size={16} />}
                          color="bg-red-400"
                          onClick={() => HapusData(item)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          totalRows={filteredData.length}
          onRowsPerPageChange={(rows) => {
            setRowsPerPage(rows);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="py-10"></div>
    </MainLayout>
  );
}
