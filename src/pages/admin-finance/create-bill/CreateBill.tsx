import { Plus, RefreshCw, Search } from "lucide-react";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import MainLayout from "../../../components/layouts/MainLayout";
import { useState } from "react";
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
  const [selectedStudents, setSelectedStudents] = useState<StudentData[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const usenavigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Gunakan hook dengan parameter pagination
  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useCreateBill(currentPage, rowsPerPage);

  // Extract data dari response
  const data = apiResponse?.data || [];
  const pagination = apiResponse?.pagination;

  if (isLoading) {
    return <LoadingSpinner title="Data Mahasiswa" />;
  }

  const angkatan = [{ value: "", label: "-- Pilih Angkatan --" }];
  const fakultas = [{ value: "", label: "-- Pilih Fakultas --" }];
  const semester = [{ value: "", label: "-- Pilih Semester --" }];
  const programStudi = [{ value: "", label: "-- Pilih Program Studi --" }];

  function SearchSubmit() {
    alert("oke search");
  }

  function Refres() {
    window.location.reload();
  }

  // Handle individual checkbox selection
  function handleCheckboxChange(student: StudentData, isChecked: boolean) {
    if (isChecked) {
      setSelectedStudents((prev) => [...prev, student]);
      setSelectedIds((prev) => [...prev, student.id]);
    } else {
      setSelectedStudents((prev) => prev.filter((s) => s.id !== student.id));
      setSelectedIds((prev) => prev.filter((id) => id !== student.id));
    }
  }

  // Handle select all checkbox
  function handleSelectAll(isChecked: boolean) {
    if (isChecked) {
      setSelectedStudents([...data]);
      setSelectedIds(data.map((student) => student.id));
    } else {
      setSelectedStudents([]);
      setSelectedIds([]);
    }
  }

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

  // Handler untuk perubahan halaman
  function handlePageChange(newPage: number) {
    setCurrentPage(newPage);
  }

  // Handler untuk perubahan rows per page
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
          <InputFilter options={angkatan} label="Angkatan" />
          <InputFilter options={fakultas} label="Fakultas" />
          <InputFilter options={semester} label="Semester" />
          <InputFilter options={programStudi} label="Program Studi" />
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
                  placeholder="Cari Kelas Kuliah"
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
                {data.map((item) => (
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
                ))}
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
