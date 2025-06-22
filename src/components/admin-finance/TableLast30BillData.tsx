import { Check, Eye, Pen, Trash2, X } from "lucide-react";
import ButtonClick from "../admin-academic/student-data/ButtonClick";
import { Pagination } from "../admin-academic/Pagination";
import { AdminFinanceRoute } from "../../types/VarRoutes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetStudentBill } from "../../hooks/admin-keuangan/useStudentBill";
import { useDeleteStudentBill } from "../../hooks/admin-keuangan/useStudentBill";
import { ToastNotif, showToast } from "./Toastify";
import ConfirmModal from "./ConfirmModal";

interface StudentBillData {
  id: string;
  kodeTagihan: string;
  npm: string;
  nama: string;
  nominal: number;
  tanggalTenggat: string;
  tanggalBayar: string;
  lunas: boolean;
}

export default function TableLast30BillData() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function openDeleteModal(id: string) {
    setSelectedId(id);
    setIsModalOpen(true);
  }

  const usenavigate = useNavigate();
  // Gunakan hook dengan parameter pagination
  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetStudentBill(currentPage, rowsPerPage);

  // Extract data dari response
  const data = apiResponse?.data || [];
  const pagination = apiResponse?.pagination;
  const deleteStudentBill = useDeleteStudentBill();

  // Fungsi untuk format Rupiah
  function formatToRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  function Detail(studentBill: StudentBillData) {
    usenavigate(AdminFinanceRoute.detailStudentBill, {
      state: studentBill,
    });
  }
  function Edit(item: StudentBillData) {
    usenavigate(AdminFinanceRoute.editBill, {
      state: item,
    });
  }

  // fungsi untuk menghapus komponen tagihan dengan hook
  async function confirmDelete() {
    if (!selectedId) return;

    try {
      await deleteStudentBill.mutateAsync(selectedId);
      showToast.success("Data berhasil dihapus!");
    } catch (err) {
      showToast.error("Gagal menghapus data.");
    } finally {
      setIsModalOpen(false);
      setSelectedId(null);
    }
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

  return (
    <div className="border-2 p-2 shadow-sm">
      <ToastNotif />
      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
      <h1 className="font-semibold text-lg sm:text-xl">
        Data Tagihan 30 Hari Terakhir
      </h1>
      {/* table */}
      <div className=" overflow-x-auto mt-3">
        <table className="w-full">
          <tbody>
            <tr className="bg-primary-green text-white">
              <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                Tanggal
              </td>
              <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                Kode Tagihan
              </td>
              <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                NIM
              </td>
              <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                Nama
              </td>
              <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                Jenis Tagihan
              </td>
              <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                Nominal
              </td>
              <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                Bayar
              </td>
              <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                Lunas
              </td>
              <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                Aksi
              </td>
            </tr>
            {data?.map((data) => (
              <tr key={data.kodeTagihan}>
                <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                  {data.tanggal}  
                </td>
                <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                  {data.kodeTagihan}
                </td>
                <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                  {data.npm}
                </td>
                <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                  {data.nama}
                </td>
                <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                  {data.jenisTagihan}
                </td>
                <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                  {formatToRupiah(data.nominal)}
                </td>
                <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                  {formatToRupiah(data.bayar)}
                </td>
                <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                  <div className="flex justify-center">
                    {data.lunas == true ? (
                      <Check color="green" />
                    ) : (
                      <X color="red" />
                    )}
                  </div>
                </td>
                <td className="border-1 border-gray-500 font-semibold p-2 text-center text-sm md:text-base">
                  <div className="flex justify-center space-x-2 items-center">
                    <ButtonClick
                      color="bg-primary-blueSoft"
                      icon={<Eye size={16} />}
                      onClick={() => Detail(data)}
                    />
                    <ButtonClick
                      color="bg-primary-yellow"
                      icon={<Pen size={16} />}
                      onClick={() => Edit(data)}
                    />
                    <ButtonClick
                      color="bg-red-500"
                      icon={<Trash2 size={16} />}
                      onClick={() => openDeleteModal(data.id)}
                    />
                  </div>
                </td>
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
  );
}
