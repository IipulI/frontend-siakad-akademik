import MainLayout from "../../../components/layouts/MainLayout";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import {
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Eye,
} from "lucide-react";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { useEffect, useRef, useState } from "react";
import Status from "../../../components/admin-academic/student-data/Status";
import { useNavigate } from "react-router-dom";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import {
  useDeleteStudent,
  useStudentData,
} from "../../../hooks/admin-akademik/useMahasiswa";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  showToast,
  ToastNotif,
} from "../../../components/admin-finance/Toastify";
import ConfirmModal from "../../../components/admin-finance/ConfirmModal";
import { getProgramStudi } from "../../../hooks/useGeneral";

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
  // state untuk modal konfirmasi delete
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const deleteStudent = useDeleteStudent();
  const { data: programStudiData } = getProgramStudi();

  const firstLoad = useRef(true);

  // Extract data dari response
  const studentData = apiResponse?.data || [];
  const pagination = apiResponse?.pagination;

  useEffect(() => {
    if (!isLoading) {
      firstLoad.current = false;
    }
  }, [isLoading]);

  if (isLoading && firstLoad.current) {
    return <LoadingSpinner title="Mahasiswa" />;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center py-4">
        Gagal memuat data Mahasiswa
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

  // Handler untuk perubahan halaman
  function handlePageChange(newPage: number) {
    setCurrentPage(newPage);
  }

  // Handler untuk perubahan rows per page
  function handleRowsPerPageChange(newRowsPerPage: number) {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  }

  function openDeleteModal(id: string) {
    setSelectedId(id);
    setIsModalOpen(true);
  }

  function Link() {
    alert("link");
  }
  function Detail(item) {
    navigate(AdminAcademicRoute.student.detailStudent, {
      state: item,
    });
  }

  // Fungsi untuk menghapus komponen tagihan dengan hook
  async function confirmDelete() {
    if (!selectedId || deleteStudent.isPending) return;

    try {
      await deleteStudent.mutateAsync(selectedId);
      if (studentData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      showToast.success("Data berhasil dihapus!");
      Refres();
    } catch (err) {
      showToast.error("Gagal menghapus data.");
    } finally {
      setIsModalOpen(false);
      setSelectedId(null);
    }
  }

  const programStudi = [
    { value: "", label: "-- Pilih Program Studi --" },
    ...(programStudiData?.map((item) => ({
      value: item.namaProgramStudi,
      label: item.namaProgramStudi,
    })) || []),
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
    { value: "2025", label: "2025" },
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
              text="Tambah"
              onClick={Create}
            />
            {/* <ButtonClick
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
            /> */}
          </div>
        </div>
        <div className="overflow-x-auto">
          <ConfirmModal
            isOpen={isModalOpen}
            onConfirm={confirmDelete}
            onCancel={() => setIsModalOpen(false)}
          />
          <ToastNotif />
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary-green text-white">
                <th className="p-2 border font-semibold border-gray-300">
                  NPM
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Nama
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Jenjang
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Program Studi
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Masuk
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Status
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Semester
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  SKS
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  IPK
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : studentData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-gray-500">
                    Tidak ada data yang ditemukan
                  </td>
                </tr>
              ) : (
                studentData.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="p-2 border border-gray-300 font-semibold text-center">
                      {student.npm}
                    </td>
                    <td className="p-2 border border-gray-300 font-semibold">
                      {student.nama}
                    </td>
                    <td className="p-2 border border-gray-300 font-semibold text-center">
                      {student?.programStudi?.jenjang?.jenjang}
                    </td>
                    <td className="p-2 border border-gray-300 font-semibold text-center">
                      {student?.programStudi?.nama}
                    </td>
                    <td className="p-2 border border-gray-300 font-semibold text-center">
                      {student.periodeMasuk}
                    </td>
                    <td className="p-2 border border-gray-300 font-semibold text-center">
                      {student.statusMahasiswa?.nama}
                    </td>
                    <td className="p-2 border border-gray-300 font-semibold text-center">
                      {student.semester}
                    </td>
                    <td className="p-2 border border-gray-300 font-semibold text-center">
                      {student.sks}
                    </td>
                    <td className="p-2 border border-gray-300 font-semibold text-center">
                      {student?.hasilStudi?.ipk}
                    </td>
                    <td className="p-2 border border-gray-300 font-semibold">
                      <div className="flex justify-center space-x-2">
                        {/* {
              <ButtonClick
                icon={<Link2 size={15} />}
                color={"bg-primary-yellow"}
                onClick={Link}
              />
            } */}
                        {
                          <ButtonClick
                            icon={<Eye size={15} />}
                            color={"bg-primary-blueSoft"}
                            onClick={() => Detail(student.id)}
                          />
                        }
                        {
                          <ButtonClick
                            icon={<Trash2 size={15} />}
                            color={"bg-red-400"}
                            onClick={() => openDeleteModal(student.id)}
                          />
                        }
                      </div>
                    </td>
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
            totalPages={pagination.totalPage}
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
