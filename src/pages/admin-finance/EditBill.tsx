import { ChevronLeft } from "lucide-react";
import ButtonClick from "../../components/admin-academic/student-data/ButtonClick";
import MainLayout from "../../components/layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import ExpenseSelectionPanel from "@/components/admin-finance/ExpenseSelectionPanel";

export default function EditBill() {
  const usenavigate = useNavigate();
  function Back() {
    usenavigate("/admin-finance/dashboard");
  }
  return (
    <MainLayout isGreeting={false} titlePage="Buat Tagihan">
      <div className="border-t-2 border-t-primary-green border-2 h-lvh rounded-sm p-2">
        <h1 className="text-lg sm:text-2xl font-semibold">
          Mahasiswa yang dipilih
        </h1>
        <div className="my-3 flex justify-end">
          <ButtonClick
            color="bg-primary-yellow"
            text="Kembali Ke Daftar"
            icon={<ChevronLeft size={20} />}
            onClick={Back}
            spacing="2"
          />
        </div>

        <div>
          <h1 className="text-lg sm:text-2xl font-semibold">Edit Tagihan</h1>
          <div className="grid grid-cols-1 lg:grid-cols-4 w-full lg:pr-30 gap-1 mt-2">
            <label htmlFor="" className="font-medium text-sm">
              Periode Akademik
            </label>
            <input
              type="text"
              value={"2024/2025"}
              className="text-xs text-gray-500 font-medium mb-3 lg:mb-0"
            />
            <label htmlFor="" className="font-medium text-sm">
              Tanggal Tenggat
            </label>
            <input
              type="text"
              value={"Senin, 28 April 2025"}
              className="text-xs text-gray-500 font-medium mb-3 lg:mb-0 border-1 p-0.5 px-2"
            />
            <label htmlFor="" className="font-medium text-sm">
              Mahasiswa
            </label>
            <input
              type="text"
              value={"Muhammad Syaifullah Nurrohman"}
              className="text-xs text-gray-500 font-medium mb-3 lg:mb-0 lg:col-span-3"
            />
            <label htmlFor="" className="font-medium text-sm">
              Kode Invoice
            </label>
            <input
              type="text"
              value={"PAY/20242/0004609"}
              className="text-xs text-gray-500 font-medium mb-3 lg:mb-0"
            />
          </div>
        </div>

        {/*<ExpenseSelectionPanel />*/}
      </div>
    </MainLayout>
  );
}
