import { Pen, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import MainLayout from "../../../components/layouts/MainLayout";
import { useEffect, useRef, useState } from "react";
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
import {
  showToast,
  ToastNotif,
} from "../../../components/admin-finance/Toastify";
import { formatToRupiah } from "../../../components/admin-finance/FormatToRupiah";

export default function ComponentBill() {
  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // state untuk filter dan search
  const [filters, setFilters] = useState({
    keyword: "",
  });

  const [searchKeyword, setSearchKeyword] = useState("");

  // state untuk modal konfirmasi delete
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const firstLoad = useRef(true);

  const navigate = useNavigate();

  function openDeleteModal(id: string) {
    setSelectedId(id);
    setIsModalOpen(true);
  }

  // Hook dengan parameter pagination
  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useGetComponentBill(currentPage, rowsPerPage, filters.keyword);

  // Extract data dari response
  const data = apiResponse?.data || [];
  const pagination = apiResponse?.pagination;

  useEffect(() => {
    if (!isLoading) {
      firstLoad.current = false;
    }
  }, [isLoading]);

  // Hook untuk delete
  const deleteComponentBill = useDeleteComponentBill();

  if (isLoading && firstLoad.current) {
    return <LoadingSpinner title="Tagihan Komponen" />;
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
      handleSearchSubmit();
    }
  };

  // Fungsi untuk submit pencarian
  function handleSearchSubmit() {
    setFilters((prev) => ({
      ...prev,
      keyword: searchKeyword,
    }));
    setCurrentPage(1); // Reset ke halaman 1 saat search
  }

  // Fungsi untuk refresh halaman
  function handleRefresh() {
    setFilters({
      keyword: "",
    });
    setSearchKeyword("");
    setCurrentPage(1);
  }

  // Fungsi untuk membuat komponen tagihan baru
  function handleCreate() {
    navigate(AdminFinanceRoute.createComponentBill);
  }

  // Fungsi untuk mengedit komponen tagihan
  function handleEdit(item: ComponentBillData) {
    navigate(AdminFinanceRoute.editComponentBill, {
      state: item,
    });
  }

  // Fungsi untuk menghapus komponen tagihan dengan hook
  async function confirmDelete() {
    if (!selectedId) return;

    try {
      await deleteComponentBill.mutateAsync(selectedId);
      showToast.success("Data berhasil dihapus!");
      if (data.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
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
    setCurrentPage(1);
  }

  const headerClassName =
    "bg-primary-green text-white p-2 border border-gray-500 font-semibold text-sm md:text-base text-center";
  const cellClassName =
    "border border-gray-500 font-semibold p-2 text-center text-sm md:text-base";

  return (
    <MainLayout isGreeting={false} titlePage="Komponen Tagihan">
      <ToastNotif />
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
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={handleSearchKeyDown}
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
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    Tidak ada data yang ditemukan
                  </td>
                </tr>
              ) : (
                data.map((item: ComponentBillData) => (
                  <tr key={item.id}>
                    <td className={cellClassName}>{item.kodeKomponen}</td>
                    <td className={`${cellClassName} text-left`}>
                      {item.nama}
                    </td>
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
    </MainLayout>
  );
}
