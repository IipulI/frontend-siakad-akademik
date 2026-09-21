import { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { Eye, RefreshCw, Repeat, Search, X } from "lucide-react";
import { IMahasiswaPindahan } from "../../../types/administrasi.types";

const dummyMahasiswaPindahan: IMahasiswaPindahan[] = [
  {
    id: "1",
    nim: "20240500001",
    nama: "Marc Anderson",
    periodeMasuk: "2024 Ganjil",
    jenjang: "S1",
    programStudi: "Manajemen",
    jenisPindahan: "Alih Jenjang",
    perguruanTinggiAsal: "Universitas Indonesia",
    prodiAsal: "Kesejahteraan & Ketenagakerjaan",
    ipkAsal: 3.0,
    sksDiakui: 5,
    sksTransfer: 4,
    statusNilaiTransfer: "Sudah Dikonversi",
  },
  {
    id: "2",
    nim: "20229100001",
    nama: "Lola Loita",
    periodeMasuk: "2024 Ganjil",
    jenjang: "S1",
    programStudi: "Administrasi Bisnis",
    jenisPindahan: "Pindahan",
    perguruanTinggiAsal: "-",
    prodiAsal: "-",
    ipkAsal: 0,
    sksDiakui: 0,
    sksTransfer: 0,
    statusNilaiTransfer: "Belum Dikonversi",
  },
  {
    id: "3",
    nim: "31002020001",
    nama: "Hailie Hermann",
    periodeMasuk: "2022 Genap",
    jenjang: "S1",
    programStudi: "Sistem Informasi",
    jenisPindahan: "Pindahan",
    perguruanTinggiAsal: "Universitas Hang Tuah",
    prodiAsal: "Nautika",
    ipkAsal: 3.23,
    sksDiakui: 86,
    sksTransfer: 84,
    statusNilaiTransfer: "Valid",
  },
  {
    id: "4",
    nim: "922334450",
    nama: "J. Wyon",
    periodeMasuk: "2022 Genap",
    jenjang: "D3",
    programStudi: "Ketatalaksanaan Pelayaran Niaga",
    jenisPindahan: "Pindahan",
    perguruanTinggiAsal: "Universitas Indonesia",
    prodiAsal: "Farmasi Rumah Sakit dan Diet Pemasaran",
    ipkAsal: 3.2,
    sksDiakui: 1,
    sksTransfer: 1,
    statusNilaiTransfer: "Belum Dikonversi",
  },
  {
    id: "5",
    nim: "12345",
    nama: "Rembulan",
    periodeMasuk: "2023 Ganjil",
    jenjang: "D3",
    programStudi: "Ketatalaksanaan Pelayaran Niaga",
    jenisPindahan: "RPL",
    perguruanTinggiAsal: "-",
    prodiAsal: "-",
    ipkAsal: 0,
    sksDiakui: 0,
    sksTransfer: 0,
    statusNilaiTransfer: "Belum Dikonversi",
  },
];

const statusBadgeColor: Record<IMahasiswaPindahan["statusNilaiTransfer"], string> = {
  "Belum Dikonversi": "bg-gray-200 text-gray-700",
  "Sudah Dikonversi": "bg-blue-100 text-blue-700",
  Valid: "bg-green-100 text-green-700",
};

export default function StudentTransferIn() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [filters, setFilters] = useState({
    programStudi: "",
    angkatan: "",
    jenisPindahan: "",
    statusNilaiTransfer: "",
  });

  const programStudi = [
    { value: "", label: "-- Semua Program Studi --" },
    { value: "Manajemen", label: "Manajemen" },
    { value: "Administrasi Bisnis", label: "Administrasi Bisnis" },
    { value: "Sistem Informasi", label: "Sistem Informasi" },
    {
      value: "Ketatalaksanaan Pelayaran Niaga",
      label: "Ketatalaksanaan Pelayaran Niaga",
    },
  ];

  const angkatan = [
    { value: "", label: "-- Semua Angkatan --" },
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
  ];

  const jenisPindahan = [
    { value: "", label: "-- Semua Jenis Pindahan --" },
    { value: "Pindahan", label: "Pindahan" },
    { value: "Alih Jenjang", label: "Alih Jenjang" },
    { value: "Lintas Jalur", label: "Lintas Jalur" },
    { value: "RPL", label: "RPL" },
  ];

  const statusNilaiTransfer = [
    { value: "", label: "-- Semua Status Nilai Transfer --" },
    { value: "Belum Dikonversi", label: "Belum Dikonversi" },
    { value: "Sudah Dikonversi", label: "Sudah Dikonversi" },
    { value: "Valid", label: "Valid" },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  function ResetFilter() {
    setFilters({
      programStudi: "",
      angkatan: "",
      jenisPindahan: "",
      statusNilaiTransfer: "",
    });
    setSearchKeyword("");
    setCurrentPage(1);
  }

  function HitungUlang() {
    alert("Hitung ulang SKS diakui & nilai transfer (dummy)");
  }

  function Detail(item: IMahasiswaPindahan) {
    alert(`Lihat detail pindah program studi: ${item.nama}`);
  }

  const filteredData = dummyMahasiswaPindahan.filter((item) => {
    return (
      (!filters.programStudi || item.programStudi === filters.programStudi) &&
      (!filters.angkatan || item.periodeMasuk.startsWith(filters.angkatan)) &&
      (!filters.jenisPindahan || item.jenisPindahan === filters.jenisPindahan) &&
      (!filters.statusNilaiTransfer ||
        item.statusNilaiTransfer === filters.statusNilaiTransfer) &&
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
    <MainLayout titlePage="Mahasiswa Pindahan" isGreeting={false}>
      <div className="grid xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
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
          options={jenisPindahan}
          label="Jenis Pindahan"
          value={filters.jenisPindahan}
          onChange={(value) => handleFilterChange("jenisPindahan", value)}
        />
        <InputFilter
          options={statusNilaiTransfer}
          label="Status Nilai Transfer"
          value={filters.statusNilaiTransfer}
          onChange={(value) => handleFilterChange("statusNilaiTransfer", value)}
        />
      </div>

      <div className="border-t-2 border-primary-green bg-white mt-5 p-2 py-4 rounded-sm shadow-sm pb-4">
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 justify-between">
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                className="border-2 p-1 rounded text-xs w-60"
                placeholder="Cari NIM / nama mahasiswa pindahan"
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
              icon={<Repeat size={15} strokeWidth={3} />}
              color="bg-primary-green"
              text="Hitung Ulang"
              onClick={HitungUlang}
            />
          </div>
        </div>

        <div className="overflow-x-auto my-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary-green text-white">
                <th className="p-2 border font-semibold border-gray-300">NIM</th>
                <th className="p-2 border font-semibold border-gray-300">Nama</th>
                <th className="p-2 border font-semibold border-gray-300">
                  Periode Masuk
                </th>
                <th className="p-2 border font-semibold border-gray-300">Jenjang</th>
                <th className="p-2 border font-semibold border-gray-300">
                  Program Studi
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Jenis Pindahan
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Perguruan Tinggi Asal
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Prodi Asal
                </th>
                <th className="p-2 border font-semibold border-gray-300">IPK Asal</th>
                <th className="p-2 border font-semibold border-gray-300">
                  SKS Diakui
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  SKS Transfer
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Status Nilai Transfer
                </th>
                <th className="p-2 border font-semibold border-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center py-4 text-gray-500">
                    Tidak ada data mahasiswa pindahan yang ditemukan
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-2 text-sm">{item.nim}</td>
                    <td className="border border-gray-300 p-2 text-sm">{item.nama}</td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      {item.periodeMasuk}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      {item.jenjang}
                    </td>
                    <td className="border border-gray-300 p-2 text-sm">
                      {item.programStudi}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      {item.jenisPindahan}
                    </td>
                    <td className="border border-gray-300 p-2 text-sm">
                      {item.perguruanTinggiAsal}
                    </td>
                    <td className="border border-gray-300 p-2 text-sm">
                      {item.prodiAsal}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      {item.ipkAsal.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      {item.sksDiakui}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      {item.sksTransfer}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-sm">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          statusBadgeColor[item.statusNilaiTransfer]
                        }`}
                      >
                        {item.statusNilaiTransfer}
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
