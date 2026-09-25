import { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { Eye, RefreshCw, Search, Settings, X } from "lucide-react";
import { IEvaluasiMahasiswa } from "../../../types/administrasi.types";

const dummyEvaluasiMahasiswa: IEvaluasiMahasiswa[] = [
  {
    id: "1",
    nim: "963200024",
    nama: "Jim Ortega",
    jenjang: "S1",
    programStudi: "Fotografi",
    periodeMasuk: "1996 Ganjil",
    masaStudi: "29 Tahun 3 Bulan 13 Hari",
    semester: 59,
    sksLulus: 0,
    sksEvalMinimal: 40,
    ipk: 0,
    ipkEvalMinimal: 2.0,
    statusEvaluasi: "Melebihi Masa Studi",
  },
  {
    id: "2",
    nim: "96508609",
    nama: "Brandy",
    jenjang: "S1",
    programStudi: "Pendidikan Biologi",
    periodeMasuk: "1996 Ganjil",
    masaStudi: "29 Tahun 3 Bulan 13 Hari",
    semester: 59,
    sksLulus: 0,
    sksEvalMinimal: 40,
    ipk: 0,
    ipkEvalMinimal: 2.0,
    statusEvaluasi: "Melebihi Masa Studi",
  },
  {
    id: "3",
    nim: "20240001002",
    nama: "Siti Aminah",
    jenjang: "S1",
    programStudi: "Manajemen",
    periodeMasuk: "2024 Ganjil",
    masaStudi: "1 Tahun 6 Bulan",
    semester: 3,
    sksLulus: 38,
    sksEvalMinimal: 30,
    ipk: 3.25,
    ipkEvalMinimal: 2.0,
    statusEvaluasi: "Memenuhi",
  },
  {
    id: "4",
    nim: "20230003300",
    nama: "Budi Santoso",
    jenjang: "S1",
    programStudi: "Sistem Informasi",
    periodeMasuk: "2023 Ganjil",
    masaStudi: "2 Tahun 6 Bulan",
    semester: 5,
    sksLulus: 42,
    sksEvalMinimal: 60,
    ipk: 1.85,
    ipkEvalMinimal: 2.0,
    statusEvaluasi: "Tidak Memenuhi",
  },
];

const statusBadgeColor: Record<IEvaluasiMahasiswa["statusEvaluasi"], string> = {
  Memenuhi: "bg-green-100 text-green-700",
  "Tidak Memenuhi": "bg-yellow-100 text-yellow-700",
  "Melebihi Masa Studi": "bg-red-100 text-red-700",
};

export default function StudentEvaluation() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [filters, setFilters] = useState({
    periodeEvaluasi: "2025 Ganjil",
    statusEvaluasi: "",
    unitKerja: "",
    periodeMasuk: "",
  });

  const periodeEvaluasi = [
    { value: "2025 Ganjil", label: "2025 Ganjil" },
    { value: "2024 Genap", label: "2024 Genap" },
    { value: "2024 Ganjil", label: "2024 Ganjil" },
  ];

  const statusEvaluasi = [
    { value: "", label: "-- Semua Status Evaluasi --" },
    { value: "Memenuhi", label: "Memenuhi" },
    { value: "Tidak Memenuhi", label: "Tidak Memenuhi" },
    { value: "Melebihi Masa Studi", label: "Melebihi Masa Studi" },
  ];

  const unitKerja = [{ value: "", label: "Universitas Ibn Khaldun" }];

  const periodeMasuk = [
    { value: "", label: "-- Semua Periode Masuk --" },
    { value: "1996 Ganjil", label: "1996 Ganjil" },
    { value: "2023 Ganjil", label: "2023 Ganjil" },
    { value: "2024 Ganjil", label: "2024 Ganjil" },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  function ResetFilter() {
    setFilters({
      periodeEvaluasi: "2025 Ganjil",
      statusEvaluasi: "",
      unitKerja: "",
      periodeMasuk: "",
    });
    setSearchKeyword("");
    setCurrentPage(1);
  }

  function AturanEvaluasi() {
    alert("Buka pengaturan Aturan Evaluasi (Manajemen Kurikulum) - dummy");
  }

  function Detail(item: IEvaluasiMahasiswa) {
    alert(`Lihat detail evaluasi: ${item.nama}`);
  }

  const filteredData = dummyEvaluasiMahasiswa.filter((item) => {
    return (
      (!filters.statusEvaluasi ||
        item.statusEvaluasi === filters.statusEvaluasi) &&
      (!filters.periodeMasuk || item.periodeMasuk === filters.periodeMasuk) &&
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
    <MainLayout titlePage="Evaluasi Mahasiswa" isGreeting={false}>
      <div className="grid xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
        <InputFilter
          options={periodeEvaluasi}
          label="Periode Evaluasi"
          value={filters.periodeEvaluasi}
          onChange={(value) => handleFilterChange("periodeEvaluasi", value)}
        />
        <InputFilter
          options={statusEvaluasi}
          label="Status Evaluasi"
          value={filters.statusEvaluasi}
          onChange={(value) => handleFilterChange("statusEvaluasi", value)}
        />
        <InputFilter options={unitKerja} label="Unit Kerja" />
        <InputFilter
          options={periodeMasuk}
          label="Periode Masuk"
          value={filters.periodeMasuk}
          onChange={(value) => handleFilterChange("periodeMasuk", value)}
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
              icon={<Settings size={15} strokeWidth={3} />}
              color="bg-primary-green"
              text="Aturan Evaluasi"
              onClick={AturanEvaluasi}
            />
          </div>
        </div>

        <div className="overflow-x-auto my-4">
          <table className="min-w-[1100px] w-full border-collapse">
            <thead>
              <tr className="bg-primary-green text-white">
                <th className="p-2 border font-semibold border-gray-300">NIM</th>
                <th className="p-2 border font-semibold border-gray-300">Nama</th>
                <th className="p-2 border font-semibold border-gray-300">Jenjang</th>
                <th className="p-2 border font-semibold border-gray-300">
                  Program Studi
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Masa Studi
                </th>
                <th className="p-2 border font-semibold border-gray-300">Semester</th>
                <th className="p-2 border font-semibold border-gray-300">
                  SKS Lulus
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  SKS Eval Minimal
                </th>
                <th className="p-2 border font-semibold border-gray-300">IPK</th>
                <th className="p-2 border font-semibold border-gray-300">
                  IPK Eval Minimal
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Status Evaluasi
                </th>
                <th className="p-2 border font-semibold border-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-4 text-gray-500">
                    Tidak ada mahasiswa yang terkena evaluasi pada periode ini
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-2 text-sm">{item.nim}</td>
                    <td className="border border-gray-300 p-2 text-sm">{item.nama}</td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      {item.jenjang}
                    </td>
                    <td className="border border-gray-300 p-2 text-sm">
                      {item.programStudi}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      {item.masaStudi}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      {item.semester}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      {item.sksLulus}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      {item.sksEvalMinimal}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      {item.ipk.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      {item.ipkEvalMinimal.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          statusBadgeColor[item.statusEvaluasi]
                        }`}
                      >
                        {item.statusEvaluasi}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <div className="flex justify-center">
                        <ButtonClick
                          icon={<Eye size={16} />}
                          color="bg-primary-blueSoft"
                          onClick={() => Detail(item)}
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
