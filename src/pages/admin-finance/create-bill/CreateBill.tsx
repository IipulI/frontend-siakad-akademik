import { Plus, RefreshCw, Search } from "lucide-react";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import MainLayout from "../../../components/layouts/MainLayout";
import { useEffect, useRef, useState } from "react";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { useNavigate } from "react-router-dom";
import { AdminFinanceRoute } from "../../../types/VarRoutes";
import {
  StudentData,
  useCreateBill,
} from "../../../hooks/admin-keuangan/useCreateBill";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  ToastNotif,
  showToast,
} from "../../../components/admin-finance/Toastify";

export default function CreateBill() {
  // state untuk pilih mahasiswa
  const [selectedStudents, setSelectedStudents] = useState<StudentData[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // state untuk filter dan search
  const [filters, setFilters] = useState({
    keyword: "",
    periodeMasuk: "",
    fakultas: "",
    semester: "",
    programStudi: "",
  });

  const [searchKeyword, setSearchKeyword] = useState("");

  // state pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const firstLoad = useRef(true);

  const usenavigate = useNavigate();

  // Hook dengan parameter pagination
  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useCreateBill(
    currentPage,
    rowsPerPage,
    filters.keyword,
    filters.periodeMasuk,
    filters.fakultas,
    filters.semester,
    filters.programStudi
  );

  // Extract data dari response
  const data = apiResponse?.data || [];
  const pagination = apiResponse?.pagination;

  useEffect(() => {
    if (!isLoading) {
      firstLoad.current = false;
    }
  }, [isLoading]);

  if (isLoading && firstLoad.current) {
    return <LoadingSpinner title="Data Mahasiswa" />;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center py-4">
        Gagal memuat data mahasiswa
      </div>
    );
  }

  // variabel untuk filter
  const angkatan = [
    { value: "", label: "-- Pilih Angkatan --" },
    { value: "2021", label: "2021" },
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
  ];
  const fakultas = [
    { value: "", label: "-- Pilih Fakultas --" },
    {
      value: "Fakultas Keguruan dan Ilmu Pendidikan",
      label: "Fakultas Keguruan dan Ilmu Pendidikan",
    },
    {
      value: "Fakultas Hukum",
      label: "Fakultas Hukum",
    },
    {
      value: "Fakultas Ekonomi dan Bisnis",
      label: "Fakultas Ekonomi dan Bisnis",
    },
    {
      value: "Fakultas Agama Islam",
      label: "Fakultas Agama Islam",
    },
    {
      value: "Fakultas Teknik dan Sains",
      label: "Fakultas Teknik dan Sains",
    },
    {
      value: "Fakultas Ilmu Kesehatan",
      label: "Fakultas Ilmu Kesehatan",
    },
  ];
  const semester = [
    { value: "", label: "-- Pilih Semester --" },
    { value: "1", label: "Semester 1" },
    { value: "2", label: "Semester 2" },
    { value: "3", label: "Semester 3" },
    { value: "4", label: "Semester 4" },
    { value: "5", label: "Semester 5" },
    { value: "6", label: "Semester 6" },
    { value: "7", label: "Semester 7" },
    { value: "8", label: "Semester 8" },
  ];
  const programStudi = [
    { value: "", label: "-- Pilih Program Studi --" },
    {
      value: "Perbankan dan Keuangan Digital",
      label: "Perbankan dan Keuangan Digital",
    },
    { value: "Pendidikan Bahasa Inggris", label: "Pendidikan Bahasa Inggris" },
    { value: "Pendidikan Luar Sekolah", label: "Pendidikan Luar Sekolah" },
    { value: "Teknologi Pendidikan", label: "Teknologi Pendidikan" },
    {
      value: "Pendidikan Vokasional Desain Fashion",
      label: "Pendidikan Vokasional Desain Fashion",
    },
    { value: "Pendidikan Profesi Guru", label: "Pendidikan Profesi Guru" },
    { value: "Pendidikan Matematika", label: "Pendidikan Matematika" },
    { value: "Ilmu Hukum", label: "Ilmu Hukum" },
    { value: "Manajemen", label: "Manajemen" },
    { value: "Akuntansi", label: "Akuntansi" },
    { value: "Bisnis Digital", label: "Bisnis Digital" },
    { value: "Perdagangan Internasional", label: "Perdagangan Internasional" },
    { value: "Hukum Keluarga Islam", label: "Hukum Keluarga Islam" },
    { value: "Pendidikan Agama Islam", label: "Pendidikan Agama Islam" },
    {
      value: "Komunikasi dan Penyiaran Islam",
      label: "Komunikasi dan Penyiaran Islam",
    },
    { value: "Ekonomi Syariah", label: "Ekonomi Syariah" },
    {
      value: "Pendidikan Guru Madrasah Ibtidaiyah",
      label: "Pendidikan Guru Madrasah Ibtidaiyah",
    },
    {
      value: "Bimbingan dan Konseling Pendidikan Islam",
      label: "Bimbingan dan Konseling Pendidikan Islam",
    },
    { value: "Manajemen Haji dan Umrah", label: "Manajemen Haji dan Umrah" },
    { value: "Ilmu Al-Qur'an dan Tafsir", label: "Ilmu Al-Qur'an dan Tafsir" },
    { value: "Teknik Sipil", label: "Teknik Sipil" },
    { value: "Teknik Mesin", label: "Teknik Mesin" },
    { value: "Teknik Elektro", label: "Teknik Elektro" },
    { value: "Teknik Informatika", label: "Teknik Informatika" },
    { value: "Sistem Informasi", label: "Sistem Informasi" },
    {
      value: "Rekayasa Pertanian dan Biosistem",
      label: "Rekayasa Pertanian dan Biosistem",
    },
    { value: "Ilmu Lingkungan", label: "Ilmu Lingkungan" },
    { value: "Kesehatan Masyarakat", label: "Kesehatan Masyarakat" },
    { value: "Gizi", label: "Gizi" },
  ];

  // Handle filter change
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setCurrentPage(1); // Reset ke halaman 1 saat filter berubah
  };

  // Handle Enter key pada search input
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      SearchSubmit();
    }
  };

  // Fungsi untuk submit pencarian
  function SearchSubmit() {
    setFilters((prev) => ({
      ...prev,
      keyword: searchKeyword,
    }));
    setCurrentPage(1); // Reset ke halaman 1 saat search
  }

  // Fungsi untuk refresh halaman
  function Refres() {
    setFilters({
      keyword: "",
      periodeMasuk: "",
      fakultas: "",
      semester: "",
      programStudi: "",
    });
    setSearchKeyword("");
    setCurrentPage(1);
  }

  // Fungsi individual checkbox selection
  function handleCheckboxChange(student: StudentData, isChecked: boolean) {
    if (isChecked) {
      setSelectedStudents((prev) => [...prev, student]);
      setSelectedIds((prev) => [...prev, student.id]);
    } else {
      setSelectedStudents((prev) => prev.filter((s) => s.id !== student.id));
      setSelectedIds((prev) => prev.filter((id) => id !== student.id));
    }
  }

  // Fungsi select all checkbox
  function handleSelectAll(isChecked: boolean) {
    if (isChecked) {
      setSelectedStudents([...data]);
      setSelectedIds(data.map((student) => student.id));
    } else {
      setSelectedStudents([]);
      setSelectedIds([]);
    }
  }

  // Fungsi untuk kirim data mahasiswa
  function Create() {
    if (selectedStudents.length === 0) {
      showToast.info("Silakan pilih mahasiswa!");
      return;
    }

    // Navigate dengan state berisi data mahasiswa yang dipilih
    usenavigate(AdminFinanceRoute.formCreateBill, {
      state: { selectedStudents },
    });
  }

  // Fungsi untuk perubahan halaman
  function handlePageChange(newPage: number) {
    setCurrentPage(newPage);
  }

  // Fungsi untuk perubahan rows per page
  function handleRowsPerPageChange(newRowsPerPage: number) {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset ke halaman 1 saat mengubah rows per page
  }

  const headerClassName =
    "bg-primary-green text-white p-2 border border-gray-500 font-semibold text-sm md:text-base text-center";
  const cellClassName =
    "border border-gray-500 font-semibold p-2 text-center text-sm md:text-base";

  return (
    <MainLayout isGreeting={false} titlePage="Buat Tagihan">
      <ToastNotif />
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:px-20 lg:px-40 md:gap-x-10 p-2 rounded-sm shadow-md gap-2 bg-white">
          <InputFilter
            options={angkatan}
            label="Angkatan"
            value={filters.periodeMasuk}
            onChange={(value) => handleFilterChange("periodeMasuk", value)}
          />
          <InputFilter
            options={fakultas}
            label="Fakultas"
            value={filters.fakultas}
            onChange={(value) => handleFilterChange("fakultas", value)}
          />
          <InputFilter
            options={semester}
            label="Semester"
            value={filters.semester}
            onChange={(value) => handleFilterChange("semester", value)}
          />
          <InputFilter
            options={programStudi}
            label="Program Studi"
            value={filters.programStudi}
            onChange={(value) => handleFilterChange("programStudi", value)}
          />
        </div>
        <div className="mt-3 shadow-md bg-white p-2">
          <h1 className="text-lg sm:text-2xl font-semibold">
            Daftar Nama Mahasiswa
          </h1>
          <div className="my-3 gap-2 lg:gap-0 flex flex-col lg:flex-row justify-between">
            <div className="flex flex-col lg:flex-row gap-2 lg:gap-10">
              <select
                name=""
                id=""
                className="p-1 text-xs border-1 rounded w-30"
              >
                <option value="semua">-- Semua --</option>
              </select>

              <div className="flex items-center">
                <input
                  type="text"
                  className="border-2 p-1 rounded text-xs w-50  "
                  placeholder="Cari Data Mahasiswa"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                <ButtonClick
                  icon={<Search size={16} strokeWidth={3} />}
                  color="bg-primary-yellow"
                  onClick={SearchSubmit}
                />
                <ButtonClick
                  icon={<RefreshCw size={16} strokeWidth={3} />}
                  color="bg-blue-900"
                  onClick={Refres}
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <ButtonClick
                icon={<Plus size={15} strokeWidth={3} />}
                color="bg-primary-green"
                text={`Tambah`}
                onClick={Create}
                spacing="1"
              />
            </div>
          </div>

          {/* table */}
          <div className={`overflow-x-auto`}>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <td className={headerClassName}>
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={
                        selectedIds.length === data.length && data.length > 0
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </td>
                  <td className={headerClassName}>NPM</td>
                  <td className={headerClassName}>Nama</td>
                  <td className={headerClassName}>Fakultas</td>
                  <td className={headerClassName}>Program Studi</td>
                  <td className={headerClassName}>Semester</td>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      Tidak ada data mahasiswa
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.id}>
                      <td className={cellClassName}>
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selectedIds.includes(item.id)}
                          onChange={(e) =>
                            handleCheckboxChange(item, e.target.checked)
                          }
                        />
                      </td>
                      <td className={cellClassName}>{item.npm}</td>
                      <td className={`${cellClassName} text-left`}>
                        {item.nama}
                      </td>
                      <td className={cellClassName}>{item.namaFakultas}</td>
                      <td className={cellClassName}>{item.namaProgramStudi}</td>
                      <td className={cellClassName}>{item.semester}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          {pagination && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              rowsPerPage={pagination.perPage}
              totalRows={pagination.totalItems}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          )}
        </div>
      </div>
      <div className="py-10"></div>
    </MainLayout>
  );
}
