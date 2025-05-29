import { ChevronLeft, Save } from "lucide-react";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { AdminFinanceRoute } from "../../../types/VarRoutes";

export default function EditComponentBill() {
  const usenavigate = useNavigate();
  const dataId = useParams();
  const id = dataId.id;
  alert(`ID Komponen Tagihan: ${id}`);

  function Back() {
    usenavigate(AdminFinanceRoute.componentBill);
  }

  function Savee() {
    alert("oke save");
  }
  return (
    <MainLayout isGreeting={false} titlePage="Komponen Tagihan">
      <div className="p-3 border-t-2 border-primary-green rounded-sm bg-white shadow-md">
        <div className="flex justify-end gap-4">
          <ButtonClick
            text="Kembali ke Daftar"
            icon={<ChevronLeft size={16} strokeWidth={3} />}
            color="bg-primary-yellow"
            onClick={Back}
            spacing="1"
          />
          <ButtonClick
            text="Simpan"
            icon={<Save size={16} />}
            color="bg-primary-blueSoft"
            onClick={Savee}
            spacing="1"
          />
        </div>

        <h1 className="text-lg sm:text-2xl font-semibold">
          Edit Komponen Tagihan
        </h1>
        <div className="grid grid-cols-2 md:w-1/3 my-5 gap-2">
          <label htmlFor="" className="text-sm font-semibold">
            Kode Komponen
          </label>
          <input type="text" className="p-1 border-2 rounded text-sm md:w-70" />
          <label htmlFor="" className="text-sm font-semibold">
            Nama Komponen
          </label>
          <input type="text" className="p-1 border-2 rounded text-sm md:w-70" />
          <label htmlFor="" className="text-sm font-semibold">
            Nominal
          </label>
          <input type="text" className="p-1 border-2 rounded text-sm md:w-70" />
        </div>
      </div>
    </MainLayout>
  );
}
