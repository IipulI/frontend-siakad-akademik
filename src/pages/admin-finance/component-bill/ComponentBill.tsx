import { Pen, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import MainLayout from "../../../components/layouts/MainLayout";
import { useEffect, useState } from "react";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { useNavigate } from "react-router-dom";
import { AdminFinanceRoute } from "../../../types/VarRoutes";
import { Api } from "../../../api/Index";

interface ComponentBillData {
  id: string;
  kodeKomponen: string;
  nama: string;
  nominal: number;
}

export default function ComponentBill() {
  const [data, setData] = useState<ComponentBillData[]>([]);

  // fetch data dari API
  async function fetchData() {
    try {
      const token = localStorage.getItem("token");

      const response = await Api.get("/keuangan/invoice-komponen-mahasiswa", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const usenavigate = useNavigate();

  // fungsi untuk submit pencarian
  function SearchSubmit() {
    alert("oke search");
  }

  // fungsi untuk refresh halaman
  function Refres() {
    window.location.reload();
  }

  // fungsi untuk membuat komponen tagihan baru
  function Create() {
    usenavigate(AdminFinanceRoute.createComponentBill);
  }

  // fungsi untuk mengedit komponen tagihan
  function handleEdit(item: ComponentBillData) {
    usenavigate(AdminFinanceRoute.editComponentBill, {
      state: item,
    });
  }

  // fungsi untuk menghapus komponen tagihan
  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus data ini?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await Api.delete(`/keuangan/invoice-komponen-mahasiswa/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Setelah berhasil menghapus, perbarui data
      fetchData();
      alert("Data berhasil dihapus!");
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  }

  // state untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const headerClassName =
    "bg-primary-green text-white p-2 border border-gray-500 font-semibold text-sm md:text-base text-center";
  const cellClassName =
    "border border-gray-500 font-semibold p-2 text-center text-sm md:text-base";

  return (
    <MainLayout isGreeting={false} titlePage="Komponen Tagihan">
      <div className="bg-white shadow-md p-3 rounded-sm">
        <h1 className="text-lg sm:text-2xl font-semibold">
          Data Komponen Tagihan
        </h1>
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

          <ButtonClick
            text="Tambah"
            icon={<Plus size={16} strokeWidth={3} />}
            color="bg-primary-green"
            onClick={Create}
            spacing="1"
          />
        </div>

        {/* table */}
        <div className={`overflow-x-auto`}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <td className={headerClassName}>Kode Komponen</td>
                <td className={headerClassName}>Nama</td>
                <td className={headerClassName}>Nominal</td>
                <td className={headerClassName}>Aksi</td>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td className={cellClassName}>{item.kodeKomponen}</td>
                  <td className={`${cellClassName} text-left`}>{item.nama}</td>
                  <td className={cellClassName}>{item.nominal}</td>
                  <td className={cellClassName}>
                    <div className={` flex justify-center gap-2`}>
                      <ButtonClick
                        icon={<Pen size={16} />}
                        color="bg-primary-yellow"
                        onClick={() => handleEdit(item)}
                      />
                      <ButtonClick
                        icon={<Trash2 size={16} />}
                        color="bg-red-500"
                        onClick={() => handleDelete(item.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={1000}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          totalRows={65}
          onRowsPerPageChange={setRowsPerPage}
        />
      </div>
      <div className="py-10"></div>
    </MainLayout>
  );
}
