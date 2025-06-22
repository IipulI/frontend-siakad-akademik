import {
  Check,
  ChevronDown,
  Eye,
  RefreshCw,
  Search,
  Settings,
  X,
} from "lucide-react";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import MainLayout from "../../../components/layouts/MainLayout";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminFinanceRoute } from "../../../types/VarRoutes";
import {
  StudentBillData,
  useGetStudentBill,
  useTandaiLunas,
} from "../../../hooks/admin-keuangan/useStudentBill";
import { useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  ToastNotif,
  showToast,
} from "../../../components/admin-finance/Toastify";
import { error } from "console";

export default function StudentBill() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // state pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const TandaiLunas = useTandaiLunas();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Gunakan hook dengan parameter pagination
  const { data: apiResponse, isLoading, isError } = useGetStudentBill(
    currentPage,
    rowsPerPage
  );

  // Extract data dari response
  const data = apiResponse?.data || [];
  const pagination = apiResponse?.pagination;

  if (isLoading) {
    return <LoadingSpinner title="Data Tagihan Mahasiswa" />;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center py-4">
        Gagal memuat data tagihan mahasiswa
      </div>
    );
  }

  // variabel untuk filter
  const periode = [{ value: "", label: "2025 Ganjil" }];
  const semester = [{ value: "", label: "7" }];
  const angkatan = [{ value: "", label: "-- Pilih Angkatan --" }];
  const fakultas = [{ value: "", label: "-- Pilih Fakultas --" }];
  const programStudi = [{ value: "", label: "-- Pilih Program Studi --" }];

  // fungsi untuk tandai lunas tagihan mahasiswa
  async function tandaiLunasTagihan() {
    if (selectedItems.length === 0) {
      showToast.info("Pilih minimal satu tagihan untuk ditandai lunas");
      return;
    }

    try {
      await TandaiLunas.mutateAsync(selectedItems, {
        onSuccess: () => {
          // Invalidate dan refetch data
          queryClient.invalidateQueries({ queryKey: ["getStudentBill"] });
          // Reset selected items
          setSelectedItems([]);
          showToast.success("Tagihan berhasil ditandai lunas!");
        },
        onError: (error: any) => {
          showToast.error(
            "Gagal menandai tagihan sebagai lunas. Silakan coba lagi."
          );
        },
      });
    } catch (error) {
    }
  }

  // Handle individual checkbox selection
  const handleItemSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectedItems.length === data.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map((item) => item.id));
    }
  };

  // Fungsi untuk refresh data
  function handleRefresh() {
    window.location.reload();
  }

  // Fungsi untuk submit pencaharian
  function SearchSubmit() {
    alert("oke search");
  }

  // Fungsi untuk kirm data tagihan mahasiwa
  function handleView(studentBill: StudentBillData) {
    navigate(AdminFinanceRoute.detailStudentBill, {
      state: studentBill,
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
    "bg-primary-green text-white p-2 border border-gray-500 font-semibold text-sm md:text-base";
  const cellClassName =
    "border border-gray-500 font-semibold p-2 text-center text-sm md:text-base";

  return (
    <MainLayout isGreeting={false} titlePage="Tagihan Mahasiswa">
      <ToastNotif />
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-10 p-5 rounded-sm shadow-md gap-2 bg-white">
        <h1 className="text-lg sm:text-2xl col-span-1 md:col-span-3 mb-2 font-semibold">
          Urutkan Berdasarkan
        </h1>
        <InputFilter options={periode} label="Periode Akademik" />
        <InputFilter
          options={periode}
          label="NIM"
          select={false}
          placeholder="Masukkan NIM"
        />
        <InputFilter options={fakultas} label="Fakultas" />
        <InputFilter options={semester} label="Semester" />
        <InputFilter
          options={periode}
          label="Nama"
          select={false}
          placeholder="Masukkan Nama Mahasiswa"
        />
        <InputFilter options={programStudi} label="Program Studi" />
        <InputFilter options={angkatan} label="Angkatan" />
      </div>

      <div className="rounded-sm bg-white shadow-md p-2 mt-2">
        <h1 className="text-lg sm:text-2xl font-semibold">
          Data Tagihan Mahasiswa
        </h1>

        <div className="my-4 gap-2 lg:gap-0 flex flex-col lg:flex-row justify-between">
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-10">
            <select name="" id="" className="p-1 text-xs border-1 rounded w-30">
              <option value="semua">-- Semua --</option>
            </select>

            <div className="flex items-center">
              <input
                type="text"
                className="border-2 p-1 rounded text-xs w-50"
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
                onClick={handleRefresh}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedItems.length > 0 && (
              <span className="text-sm text-gray-600">
                {selectedItems.length} dipilih
              </span>
            )}

            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading || TandaiLunas.isPending}
                className={`flex items-center rounded p-1 px-2 w-fit text-white font-semibold text-sm transition-colors ${
                  isLoading || TandaiLunas.isPending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }`}
              >
                <Settings color="white" size={17} />
                <span className="ml-1">
                  {TandaiLunas.isPending ? "Processing..." : "Aksi"}
                </span>
                <ChevronDown
                  size={16}
                  className={`ml-1 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && !isLoading && !TandaiLunas.isPending && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-full">
                  <button
                    onClick={tandaiLunasTagihan}
                    disabled={selectedItems.length === 0}
                    className={`block w-full text-left px-3 py-2 text-xs transition-colors ${
                      selectedItems.length === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    Tandai Lunas ({selectedItems.length})
                  </button>
                </div>
              )}

              {/* Overlay untuk menutup dropdown ketika klik di luar */}
              {isOpen && (
                <div
                  className="fixed inset-0 z-0"
                  onClick={() => setIsOpen(false)}
                />
              )}
            </div>
          </div>
        </div>

        {/* table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={headerClassName}>
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={
                      selectedItems.length === data.length && data.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className={headerClassName}>Kode Tagihan</th>
                <th className={headerClassName}>NIM</th>
                <th className={headerClassName}>Nama</th>
                <th className={headerClassName}>Nominal</th>
                <th className={headerClassName}>Tanggal Tenggat</th>
                <th className={headerClassName}>Tanggal Bayar</th>
                <th className={headerClassName}>Lunas</th>
                <th className={headerClassName}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={9} className={`${cellClassName} text-center`}>
                    Tidak ada data tagihan
                  </td>
                </tr>
              ) : (
                data.map((studentBill, index) => (
                  <tr key={`${studentBill.id}-${index}`}>
                    <td className={cellClassName}>
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={selectedItems.includes(studentBill.id)}
                        onChange={() => handleItemSelect(studentBill.id)}
                      />
                    </td>
                    <td className={cellClassName}>{studentBill.kodeTagihan}</td>
                    <td className={cellClassName}>{studentBill.npm}</td>
                    <td className={cellClassName}>{studentBill.nama}</td>
                    <td className={cellClassName}>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(studentBill.nominal)}
                    </td>
                    <td className={cellClassName}>
                      {studentBill.tanggalTenggat}
                    </td>
                    <td className={cellClassName}>
                      {studentBill.tanggalBayar
                        ? studentBill.tanggalBayar
                        : "-"}
                    </td>
                    <td className={cellClassName}>
                      {studentBill.lunas ? (
                        <Check className="mx-auto text-green-600" size={18} />
                      ) : (
                        <X className="mx-auto text-red-600" size={18} />
                      )}
                    </td>
                    <td className={cellClassName}>
                      <div className="flex justify-center gap-2">
                        <ButtonClick
                          icon={<Eye size={16} />}
                          color="bg-primary-blueSoft"
                          onClick={() => handleView(studentBill)}
                        />
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
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            rowsPerPage={pagination.perPage}
            totalRows={pagination.totalItems}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}
      </div>
      <div className="py-10"></div>
    </MainLayout>
  );
}
