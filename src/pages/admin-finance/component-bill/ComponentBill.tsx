import { Pen, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import MainLayout from "../../../components/layouts/MainLayout";
import { useState } from "react";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { useNavigate } from "react-router-dom";
import { AdminFinanceRoute } from "../../../types/VarRoutes";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  useGetComponentBill,
  useDeleteComponentBill,
  ComponentBillData,
} from "../../../hooks/admin-keuangan/useComponent";
import ConfirmModal from "../../../components/admin-finance/ConfirmModal";
import { showToast, ToastNotif } from "../../../components/admin-finance/Toastify";

export default function ComponentBill() {
  // state untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  function openDeleteModal(id: string) {
    setSelectedId(id);
    setIsModalOpen(true);
  }
  

  const navigate = useNavigate();

  // Gunakan hook dengan parameter pagination dan search
  const { data, isLoading, isError } = useGetComponentBill();

  // Hook untuk delete
  const deleteComponentBill = useDeleteComponentBill();

  if (isLoading) {
    return <LoadingSpinner title="Tagihan Komponen" />;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center py-4">
        Gagal memuat data tagihan komponen
      </div>
    );
  }

  // Fungsi untuk format Rupiah
  function formatToRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  // fungsi untuk submit pencarian
  function handleSearchSubmit() {}

  // fungsi untuk refresh halaman
  function handleRefresh() {
    window.location.reload();
  }

  // fungsi untuk membuat komponen tagihan baru
  function handleCreate() {
    navigate(AdminFinanceRoute.createComponentBill);
  }

  // fungsi untuk mengedit komponen tagihan
  function handleEdit(item: any) {
    navigate(AdminFinanceRoute.editComponentBill, {
      state: item,
    });
  }

  // fungsi untuk menghapus komponen tagihan dengan hook
  async function confirmDelete() {
    if (!selectedId) return;

    try {
      await deleteComponentBill.mutateAsync(selectedId);
      showToast.success("Data berhasil dihapus!");
    } catch (err) {
      showToast.error("Gagal menghapus data.");
    } finally {
      setIsModalOpen(false);
      setSelectedId(null);
    }
  }
  

  const headerClassName =
    "bg-primary-green text-white p-2 border border-gray-500 font-semibold text-sm md:text-base text-center";
  const cellClassName =
    "border border-gray-500 font-semibold p-2 text-center text-sm md:text-base";

  return (
    <MainLayout isGreeting={false} titlePage="Komponen Tagihan">
      <ToastNotif/>
      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />

      <div className="bg-white shadow-md p-3 rounded-sm">
        <h1 className="text-lg sm:text-2xl font-semibold">
          Data Komponen Tagihan
        </h1>

        {/* Search and Filter Section */}
        <div className="my-4 gap-2 lg:gap-0 flex flex-col lg:flex-row justify-between">
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-10">
            <select className="p-1 text-xs border-1 rounded w-30">
              <option value="semua">-- Semua --</option>
              <option value="kodeKomponen">Kode Komponen</option>
              <option value="nama">Nama</option>
            </select>

            <div className="flex items-center">
              <input
                type="text"
                className="border-2 p-1 rounded text-xs w-50"
                placeholder="Cari Tagihan Komponen"
              />
              <ButtonClick
                icon={<Search size={16} strokeWidth={3} />}
                color="bg-primary-yellow"
                onClick={handleSearchSubmit}
              />
              <ButtonClick
                icon={<RefreshCw size={16} strokeWidth={3} />}
                color="bg-blue-900"
                onClick={handleRefresh}
              />
            </div>
          </div>

          <ButtonClick
            text="Tambah"
            icon={<Plus size={16} strokeWidth={3} />}
            color="bg-primary-green"
            onClick={handleCreate}
            spacing="1"
          />
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={headerClassName}>Kode Komponen</th>
                <th className={headerClassName}>Nama</th>
                <th className={headerClassName}>Nominal</th>
                <th className={headerClassName}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item: ComponentBillData) => (
                <tr key={item.id}>
                  <td className={cellClassName}>{item.kodeKomponen}</td>
                  <td className={`${cellClassName} text-left`}>{item.nama}</td>
                  <td className={cellClassName}>
                    {formatToRupiah(item.nominal)}
                  </td>
                  <td className={cellClassName}>
                    <div className="flex justify-center gap-2">
                      <ButtonClick
                        icon={<Pen size={16} />}
                        color="bg-primary-yellow"
                        onClick={() => handleEdit(item)}
                      />
                      <ButtonClick
                        icon={<Trash2 size={16} />}
                        color="bg-red-500"
                        onClick={() => openDeleteModal(item.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <Pagination
          currentPage={currentPage}
          totalPages={1000}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          totalRows={65}
          onRowsPerPageChange={setRowsPerPage}
        />
      </div>
    </MainLayout>
  );
}
