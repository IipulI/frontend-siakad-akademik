import { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { Check, Pen, RefreshCw, Search, Upload, X } from "lucide-react";
import { IMahasiswaTransfer } from "../../../types/administrasi.types";

const dummyMahasiswaTransfer: IMahasiswaTransfer[] = [
  {
    id: "1",
    nim: "20240450003",
    nama: "Pendaftar Pindahan I",
    programStudi: "Akuntansi",
    kodeMkAsal: "AK1017",
    namaMkAsal: "Akuntansi Dasar",
    sksAsal: 3,
    nilaiHurufAsal: "95",
    mataKuliahKonversi: "",
    nilaiKonversi: "A",
    valid: false,
  },
  {
    id: "2",
    nim: "20240450003",
    nama: "Pendaftar Pindahan I",
    programStudi: "Akuntansi",
    kodeMkAsal: "AK4101",
    namaMkAsal: "Dasar Akuntansi",
    sksAsal: 3,
    nilaiHurufAsal: "90",
    mataKuliahKonversi: "NR2 - Neraca II (2,00 SKS)",
    nilaiKonversi: "A",
    valid: true,
  },
  {
    id: "3",
    nim: "31002020001",
    nama: "Hailie Hermann",
    programStudi: "Sistem Informasi",
    kodeMkAsal: "SI2010",
    namaMkAsal: "Basis Data",
    sksAsal: 3,
    nilaiHurufAsal: "88",
    mataKuliahKonversi: "SI201 - Basis Data (3,00 SKS)",
    nilaiKonversi: "A-",
    valid: true,
  },
  {
    id: "4",
    nim: "922334450",
    nama: "J. Wyon",
    programStudi: "Ketatalaksanaan Pelayaran Niaga",
    kodeMkAsal: "FR1002",
    namaMkAsal: "Farmasi Dasar",
    sksAsal: 2,
    nilaiHurufAsal: "80",
    mataKuliahKonversi: "",
    nilaiKonversi: "B+",
    valid: false,
  },
];

export default function StudentTransfer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [filters, setFilters] = useState({
    programStudi: "",
    statusValid: "",
  });

  const programStudi = [
    { value: "", label: "-- Semua Program Studi --" },
    { value: "Akuntansi", label: "Akuntansi" },
    { value: "Sistem Informasi", label: "Sistem Informasi" },
    {
      value: "Ketatalaksanaan Pelayaran Niaga",
      label: "Ketatalaksanaan Pelayaran Niaga",
    },
  ];

  const statusValid = [
    { value: "", label: "-- Semua Status --" },
    { value: "true", label: "Valid" },
    { value: "false", label: "Belum Valid" },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  function ResetFilter() {
    setFilters({ programStudi: "", statusValid: "" });
    setSearchKeyword("");
    setCurrentPage(1);
  }

  function UploadExcel() {
    alert("Upload nilai transfer dari Excel (dummy)");
  }

  function EditKonversi(item: IMahasiswaTransfer) {
    alert(`Edit MK konversi untuk ${item.nama} - ${item.namaMkAsal}`);
  }

  const filteredData = dummyMahasiswaTransfer.filter((item) => {
    return (
      (!filters.programStudi || item.programStudi === filters.programStudi) &&
      (!filters.statusValid || String(item.valid) === filters.statusValid) &&
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
    <MainLayout titlePage="Transfer Mahasiswa" isGreeting={false}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
        <InputFilter
          options={programStudi}
          label="Program Studi"
          value={filters.programStudi}
          onChange={(value) => handleFilterChange("programStudi", value)}
        />
        <InputFilter
          options={statusValid}
          label="Status Valid"
          value={filters.statusValid}
          onChange={(value) => handleFilterChange("statusValid", value)}
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
              icon={<Upload size={15} strokeWidth={3} />}
              color="bg-primary-green"
              text="Upload Excel"
              onClick={UploadExcel}
            />
          </div>
        </div>

        <div className="overflow-x-auto my-4">
          <table className="min-w-[1100px] w-full border-collapse">
            <thead>
              <tr className="bg-primary-green text-white">
                <th className="p-2 border font-semibold border-gray-300">NIM</th>
                <th className="p-2 border font-semibold border-gray-300">Nama</th>
                <th className="p-2 border font-semibold border-gray-300">
                  Program Studi
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Kode MK Asal
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Nama MK Asal
                </th>
                <th className="p-2 border font-semibold border-gray-300">SKS Asal</th>
                <th className="p-2 border font-semibold border-gray-300">
                  Nilai Asal
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Mata Kuliah Konversi
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Nilai Konversi
                </th>
                <th className="p-2 border font-semibold border-gray-300">Valid</th>
                <th className="p-2 border font-semibold border-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-4 text-gray-500">
                    Tidak ada data nilai transfer yang ditemukan
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
                      {item.kodeMkAsal}
                    </td>
                    <td className="border border-gray-300 p-2 text-sm">
                      {item.namaMkAsal}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      {item.sksAsal.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      {item.nilaiHurufAsal}
                    </td>
                    <td className="border border-gray-300 p-2 text-sm">
                      {item.mataKuliahKonversi || (
                        <span className="text-gray-400">- belum diset -</span>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      {item.nilaiKonversi}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <div className="flex justify-center">
                        {item.valid ? (
                          <Check color="green" size={18} />
                        ) : (
                          <X color="red" size={18} />
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <div className="flex justify-center">
                        <ButtonClick
                          icon={<Pen size={16} />}
                          color="bg-primary-yellow"
                          onClick={() => EditKonversi(item)}
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
