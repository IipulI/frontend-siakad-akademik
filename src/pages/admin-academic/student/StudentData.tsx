import MainLayout from "../../../components/layouts/MainLayout";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import TableStudent from "../../../components/admin-academic/student-data/TableStudent";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import {
  Plus,
  Printer,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  Eye,
  Link2,
} from "lucide-react";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { useEffect, useRef, useState } from "react";
import Status from "../../../components/admin-academic/student-data/Status";
import { useNavigate } from "react-router-dom";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useStudentData } from "../../../hooks/admin-akademik/useMahasiswa";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function StudentData() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // state untuk filter dan search
  const [filters, setFilters] = useState({
    keyword: "",
    programStudi: "",
    jenisPendaftaran: "",
    kelasPerkuliahan: "",
    angkatan: "",
    jalurPendaftaran: "",
    statusMahasiswa: "",
    gelombang: "",
    jenisKelamin: "",
    sistemKuliah: "",
    kurikulum: "",
    periodeMasuk: "",
    periodeKeluar: "",
  });

  const [searchKeyword, setSearchKeyword] = useState("");

  const navigate = useNavigate();
  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useStudentData(
    currentPage,
    rowsPerPage,
    filters.keyword,
    filters.programStudi,
    filters.jenisPendaftaran,
    filters.kelasPerkuliahan,
    filters.angkatan,
    filters.jalurPendaftaran,
    filters.statusMahasiswa,
    filters.gelombang,
    filters.jenisKelamin,
    filters.sistemKuliah,
    filters.kurikulum,
    filters.periodeMasuk,
    filters.periodeKeluar
  );

  const firstLoad = useRef(true);

  // Extract data dari response
  const studentData = apiResponse?.data || [];
  const pagination = apiResponse?.pagination;

  useEffect(() => {
    if (!isLoading) {
      firstLoad.current = false;
    }
  }, [isLoading]);

  console.log(studentData);

  if (isLoading && firstLoad.current) {
    return <LoadingSpinner title="Mahasiswa" />;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center py-4">
        Gagal memuat data tagihan komponen
      </div>
    );
  }

  // Handle Enter key pada search input
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      SearchSubmit();
    }
  };

  // function buat search
  function SearchSubmit() {
    setFilters((prev) => ({
      ...prev,
      keyword: searchKeyword,
    }));
    setCurrentPage(1); // Reset ke halaman 1 saat search
  }

  function Refres() {
    setFilters({
      keyword: "",
      programStudi: "",
      jenisPendaftaran: "",
      kelasPerkuliahan: "",
      angkatan: "",
      jalurPendaftaran: "",
      statusMahasiswa: "",
      gelombang: "",
      jenisKelamin: "",
      sistemKuliah: "",
      kurikulum: "",
      periodeMasuk: "",
      periodeKeluar: "",
    });
    setSearchKeyword("");
    setCurrentPage(1);
  }

  // function buat tambah, hapus, cetak dan aksi
  function Create() {
    navigate(AdminAcademicRoute.student.createStudent);
  }
  function Delete() {
    alert("delete");
  }
  function Print() {
    alert("print");
  }
  function Setting() {
    alert("aksi");
  }

  function Link() {
    alert("link");
  }
  function Detail() {
    navigate(AdminAcademicRoute.student.detailStudent);
  }
  function Remove() {
    alert("link");
  }

  // Handler untuk perubahan halaman
  function handlePageChange(newPage: number) {
    setCurrentPage(newPage);
  }

  // Handler untuk perubahan rows per page
  function handleRowsPerPageChange(newRowsPerPage: number) {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  }

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

  const jenisPendaftaran = [
    { value: "", label: "-- Pilih Jenis Pendaftaran --" },
    {
      value: "Baru",
      label: "Baru",
    },
  ];

  const kelasPerkuliahan = [
    { value: "", label: "-- Pilih Kelas Perkuliahan --" },
    {
      value: "A",
      label: "A",
    },
    {
      value: "B",
      label: "B",
    },
    {
      value: "C",
      label: "C",
    },
    {
      value: "D",
      label: "D",
    },
  ];

  const periodeKeluar = [{ value: "", label: "-- Pilih Periode Keluar --" }];

  const angkatan = [
    { value: "", label: "-- Pilih Angkatan --" },
    { value: "2021", label: "2021" },
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
  ];

  const jalurPendaftaran = [
    { value: "", label: "-- Pilih Jalur Pendaftaran --" },
    { value: "Mandiri", label: "Mandiri" },
  ];

  const rangeIPK = [{ value: "", label: "-- Pilih Range IPK --" }];

  const statusMahasiswa = [
    { value: "", label: "-- Pilih Status Mahasiswa --" },
    { value: "aktif", label: "Aktive" },
    { value: "tidak aktif", label: "Tidak Aktive" },
  ];

  const gelombang = [
    { value: "", label: "-- Pilih Gelombang --" },
    { value: "1", label: "Gelombang 1" },
    { value: "2", label: "Gelombang 2" },
    { value: "3", label: "Gelombang 3" },
  ];

  const jenisKelamin = [
    { value: "", label: "-- Pilih Jenis Kelamin --" },
    { value: "Laki-Laki", label: "Laki-Laki" },
    { value: "Perempuan", label: "Perempuan" },
  ];

  const sistemKuliah = [
    { value: "", label: "-- Pilih Sistem Kuliah --" },
    { value: "Reguler", label: "Reguler" },
    { value: "Karyawan", label: "Karyawan" },
  ];

  const kurikulum = [{ value: "", label: "-- Pilih Kurikulum --" }];

  const periodeMasuk = [
    { value: "", label: "-- Pilih Periode Masuk --" },
    { value: "20241", label: "20241" },
  ];

  // Handle filter change
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setCurrentPage(1); // Reset ke halaman 1 saat filter berubah
  };

  return (
    <MainLayout titlePage="Mahasiswa" isGreeting={false}>
      {/* filter */}
      <div className="grid xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
        <InputFilter
          options={programStudi}
          label="Unit / Program Studi"
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
          options={statusMahasiswa}
          label="Status Mahasiswa"
          value={filters.statusMahasiswa}
          onChange={(value) => handleFilterChange("statusMahasiswa", value)}
        />
        <InputFilter
          options={sistemKuliah}
          label="Sistem Kuliah"
          value={filters.sistemKuliah}
          onChange={(value) => handleFilterChange("sistemKuliah", value)}
        />
        <InputFilter
          options={jenisPendaftaran}
          label="Jenis Pendaftaran"
          value={filters.jenisPendaftaran}
          onChange={(value) => handleFilterChange("jenisPendaftaran", value)}
        />
        <InputFilter
          options={jalurPendaftaran}
          label="Jalur Pendaftaran"
          value={filters.jalurPendaftaran}
          onChange={(value) => handleFilterChange("jalurPendaftaran", value)}
        />
        <InputFilter
          options={gelombang}
          label="Gelombang"
          value={filters.gelombang}
          onChange={(value) => handleFilterChange("gelombang", value)}
        />
        <InputFilter
          options={kurikulum}
          label="Kurikulum"
          value={filters.kurikulum}
          onChange={(value) => handleFilterChange("kurikulum", value)}
        />
        <InputFilter
          options={kelasPerkuliahan}
          label="Kelas Perkuliahan"
          value={filters.kelasPerkuliahan}
          onChange={(value) => handleFilterChange("kelasPerkuliahan", value)}
        />
        <InputFilter
          options={rangeIPK}
          label="Range IPK"
          value={filters.keyword}
          onChange={(value) => handleFilterChange("kelasPerkuliahan", value)}
        />

        <InputFilter
          options={jenisKelamin}
          label="Jenis Kelamin"
          value={filters.jenisKelamin}
          onChange={(value) => handleFilterChange("jenisKelamin", value)}
        />
        <InputFilter
          options={periodeMasuk}
          label="Periode Masuk"
          value={filters.periodeMasuk}
          onChange={(value) => handleFilterChange("periodeMasuk", value)}
        />
        <InputFilter
          options={periodeKeluar}
          label="Periode Keluar"
          value={filters.periodeKeluar}
          onChange={(value) => handleFilterChange("periodeKeluar", value)}
        />
      </div>

      {/* tabel mahasiswa */}
      <div className="border-t-2 border-primary-green bg-white mt-5 p-1 rounded-sm shadow-sm pb-4">
        <div className="my-4 gap-2 lg:gap-0 flex flex-col lg:flex-row justify-between">
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-10">
            <select name="" id="" className="p-1 text-xs border-1 rounded w-30">
              <option value="semua">-- Semua --</option>
            </select>

            <div className="flex items-center">
              <input
                type="text"
                className="border-2 p-1 rounded text-xs w-50  "
                placeholder="Cari Kelas Kuliah"
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
              text="Tambah"
              onClick={Create}
            />
            <ButtonClick
              icon={<Trash2 size={15} />}
              color="bg-red-400"
              text="Hapus"
              onClick={Delete}
            />
            <ButtonClick
              icon={<Printer size={15} strokeWidth={2.5} />}
              color="bg-primary-blueSoft"
              text="Cetak"
              onClick={Print}
            />
            <ButtonClick
              icon={<Settings size={15} strokeWidth={2.5} />}
              color="bg-primary-yellow"
              text="Aksi"
              onClick={Setting}
            />
          </div>
        </div>
        <TableStudent data={studentData} isLoading={isLoading}>
          <div className="flex justify-center space-x-2">
            {
              <ButtonClick
                icon={<Link2 size={15} />}
                color={"bg-primary-yellow"}
                onClick={Link}
              />
            }
            {
              <ButtonClick
                icon={<Eye size={15} />}
                color={"bg-primary-blueSoft"}
                onClick={Detail}
              />
            }
            {
              <ButtonClick
                icon={<Trash2 size={15} />}
                color={"bg-red-400"}
                onClick={Remove}
              />
            }
          </div>
        </TableStudent>

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
      <Status />
      <div className="py-5"></div>
    </MainLayout>
  );
}
