import { Plus, RefreshCw, Search, Eye, Pen, Trash2 } from "lucide-react";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import MainLayout from "../../../components/layouts/MainLayout";
import { useEffect, useState } from "react";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { useNavigate } from "react-router-dom";
import { AdminFinanceRoute } from "../../../types/VarRoutes";
import { Api } from "../../../api/Index";

interface ComponentData {
  id: string;
  kodeKomponen: string;
  nama: string;
  nominal: number;
}

export default function ComponentBill() {
  const [componentApiData, setComponentApiData] = useState<ComponentData[]>([]);
  console.log("Component API Data:", componentApiData);

  async function fetchComponentData() {
    try {
      const token = localStorage.getItem("token");
      const response = await Api.get("/keuangan/invoice-komponen-mahasiswa", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComponentApiData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchComponentData();
  }, []);

  console.log("Component API Data:", componentApiData);

  const usenavigate = useNavigate();

  function SearchSubmit() {
    alert("oke search");
  }

  function Refres() {
    window.location.reload();
  }

  function Create() {
    usenavigate(AdminFinanceRoute.createComponentBill);
  }

  function handleEdit(id: string) {
    usenavigate(`/admin-keuangan/komponen-tagihan/edit-komponen-tagihan/${id}`);
  }

  function handleDelete() {
    alert("hapus");
  }

  function handleView() {
    console.log("Viewing");
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const headerClassName =
    "bg-primary-green text-white p-2 border border-gray-500 font-semibold text-sm md:text-base";
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

        {/* Integrated Table */}
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
              {componentApiData.map((item, Index) => (
                <tr key={Index}>
                  <td className={cellClassName}>{item.kodeKomponen}</td>
                  <td className={`${cellClassName} text-left`}>{item.nama}</td>
                  <td className={cellClassName}>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    })
                      .format(item.nominal)
                      .replace("Rp", "Rp ")}
                  </td>
                  <td className={cellClassName}>
                    <div className="flex justify-center space-x-2">
                      <ButtonClick
                        icon={<Eye size={16} strokeWidth={3} />}
                        color="bg-blue-500"
                        onClick={() => handleView()}
                      />
                      <ButtonClick
                        icon={<Pen size={16} strokeWidth={3} />}
                        color="bg-yellow-500"
                        onClick={() => handleEdit(item.id)}
                      />
                      <ButtonClick
                        icon={<Trash2 size={16} strokeWidth={3} />}
                        color="bg-red-500"
                        onClick={() => handleDelete()}
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
          totalPages={8}
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
