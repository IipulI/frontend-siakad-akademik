import MainLayout from "../../components/layouts/MainLayout";
import ButtonClick from "../../components/admin-academic/student-data/ButtonClick";
import { Search } from "lucide-react";
import Card from "../../components/admin-academic/dashboard/Card";
import FacultyBill from "../../components/admin-finance/FacultyBill";
import LastTransaction from "../../components/admin-finance/LastTransaction";
import { useGetAllbill } from "../../hooks/admin-keuangan/useDashboardFinance";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Check, Eye, Pen, Trash2, X } from "lucide-react";
import { Pagination } from "../../components/admin-academic/Pagination";
import { AdminFinanceRoute } from "../../types/VarRoutes";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  StudentBillData,
  useGetStudentBill,
} from "../../hooks/admin-keuangan/useStudentBill";
import { useDeleteStudentBill } from "../../hooks/admin-keuangan/useStudentBill";
import { ToastNotif, showToast } from "../../components/admin-finance/Toastify";
import ConfirmModal from "../../components/admin-finance/ConfirmModal";

const DashboardAdminFinance = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filters, setFilters] = useState({
    keyword: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const firstLoad = useRef(true);

  const usenavigate = useNavigate();

  const { data, isError, isLoading } = useGetAllbill();

  // Gunakan hook dengan parameter pagination
  const { data: apiResponse, isLoading: TableLoading } = useGetStudentBill(
    currentPage,
    rowsPerPage,
    filters.keyword
  );

  useEffect(() => {
    if (!isLoading) {
      firstLoad.current = false;
    }
  }, [isLoading]);

  const deleteStudentBill = useDeleteStudentBill();

  if (isLoading && firstLoad.current) {
    return <LoadingSpinner title="" />;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center py-4">Gagal memuat data</div>
    );
  }

  function openDeleteModal(id: string) {
    setSelectedId(id);
    setIsModalOpen(true);
  }

  // Extract data dari response
  const dataStudentBill = apiResponse?.data || [];
  const pagination = apiResponse?.pagination;

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

  // format mata uang
  const formatCurrencyShort = (value) => {
    let numValue;
    if (typeof value === "string") {
      numValue = parseFloat(value.replace(/[^\d.-]/g, ""));
    } else {
      numValue = value;
    }

    if (isNaN(numValue) || numValue === 0) return "0";

    // Simpan tanda negatif
    const absValue = Math.abs(numValue);

    let result = "";

    // Miliar (1,000,000,000+)
    if (absValue >= 1000000000) {
      const formatted = (absValue / 1000000000).toFixed(1);
      result = formatted.endsWith(".0")
        ? `${parseInt(formatted)}M`
        : `${formatted}M`;
    }
    // Juta (1,000,000+)
    else if (absValue >= 1000000) {
      const formatted = (absValue / 1000000).toFixed(1);
      result = formatted.endsWith(".0")
        ? `${parseInt(formatted)}JT`
        : `${formatted}JT`;
    }
    // Ribu (1,000+)
    else if (absValue >= 1000) {
      const formatted = (absValue / 1000).toFixed(1);
      result = formatted.endsWith(".0")
        ? `${parseInt(formatted)}RB`
        : `${formatted}RB`;
    }
    // Kurang dari 1000
    else {
      result = absValue.toString();
    }

    // Tambahkan tanda minus jika negatif
    return result;
  };

  // fungsi untuk submit pencaharian
  function SearchSubmit() {
    setFilters((prev) => ({
      ...prev,
      keyword: searchKeyword,
    }));
    setCurrentPage(1); // Reset ke halaman 1 saat search
  }

  // Handle Enter key pada search input
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      SearchSubmit();
    }
  };

  return (
    <MainLayout titlePage={"Beranda"} isGreeting={false}>
      <div className="border-t-2 border-primary-green rounded-sm py-2">
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-10 border-2 p-2">
          <select
            name=""
            id=""
            className="p-1 text-xs border-1 rounded w-22 text-gray-500"
          >
            <option value="semua">- Semua -</option>
          </select>

          <div className="flex items-center">
            <input
              type="text"
              className="border-2 p-1 rounded text-xs w-50  "
              placeholder="Cari Data Tagihan"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <ButtonClick
              icon={<Search size={16} strokeWidth={3} />}
              color="bg-primary-blueDark"
              onClick={SearchSubmit}
            />
          </div>
        </div>

        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:px-40 my-7">
            <Card
              title="Total Tagihan"
              value={formatCurrencyShort(data.totalTagihan)}
              color="bg-primary-blueSoft"
            />
            <Card
              title="total Tagihan Terbayar"
              value={formatCurrencyShort(data.totalTerbayar)}
              color="bg-primary-yellow"
            />
            <Card
              title="Total Tagihan Belum Terbayar"
              value={formatCurrencyShort(data.totalBelumBayar)}
              color="bg-red-500"
            />
          </div>
        )}

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
                {TableLoading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-4 text-gray-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-4 text-gray-500">
                      Tidak ada data tagihan
                    </td>
                  </tr>
                ) : (
                  dataStudentBill?.map((data) => (
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

        <div className="grid grid-cols-7 mt-7 gap-10 mb-10">
          <FacultyBill />
          <LastTransaction />
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardAdminFinance;
