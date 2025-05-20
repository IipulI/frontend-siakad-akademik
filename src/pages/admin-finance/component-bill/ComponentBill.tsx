import { Plus, RefreshCw, Search } from "lucide-react";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import MainLayout from "../../../components/layouts/MainLayout";
import Table from "../../../components/admin-finance/Tabel";
import { useState } from "react";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { useNavigate } from "react-router-dom";
import { AdminFinanceRoute } from "../../../types/VarRoutes";

export default function ComponentBill() {
    const usenavigate = useNavigate()
  function SearchSubmit() {
    alert("oke search");
  }
  function Refres() {
    window.location.reload();
  }
  function Create() {
    usenavigate(AdminFinanceRoute.createComponentBill)
  }

  const headers = ["Kode Komponen", "Nama", "Nominal"];

  const componentData = [
    {
      id: 1,
      kodeKomponen: "INV/20242/0000001",
      nama: "SPP",
      nominal: "Rp 2.000.000",
    },
    {
      id: 2,
      kodeKomponen: "2211060642918",
      nama: "Ujian Akhir Semester",
      nominal: "Rp 900.000",
    },
  ];

  function handleEdit() {
    alert("oke edit");
  }

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
        <Table
          headers={headers}
          data={componentData}
          showCheckbox={false}
          actions={{
            edit: () => handleEdit(),
          }}
        />

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
