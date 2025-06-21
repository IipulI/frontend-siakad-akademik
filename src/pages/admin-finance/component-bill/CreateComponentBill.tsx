import { useState } from "react";
import { ChevronLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import MainLayout from "../../../components/layouts/MainLayout";
import { AdminFinanceRoute } from "../../../types/VarRoutes";
import { useCreateComponentBill } from "../../../hooks/admin-keuangan/useComponent";
import { ToastNotif, showToast } from "../../../components/admin-finance/Toastify";

export default function CreateComponentBill() {
  const [kodeKomponen, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [nominal, setNominal] = useState("");
  const navigate = useNavigate();
  const { mutateAsync, status } = useCreateComponentBill();

  function handleBack() {
    navigate(AdminFinanceRoute.componentBill);
  }

  async function handleSave() {
    if (!kodeKomponen || !nama || !nominal) {
      showToast.info("Mohon lengkapi semua field!");
      return;
    }

    try {
      await mutateAsync({
        kodeKomponen,
        nama,
        nominal: Number(nominal),
      });
      navigate(AdminFinanceRoute.componentBill);
    } catch (error) {
        showToast.error("Terjadi kesalahan saat menyimpan.");
      
    }
  }

  return (
    <MainLayout isGreeting={false} titlePage="Komponen Tagihan">
      <ToastNotif/>
      <div className="p-3 border-t-2 border-primary-green rounded-sm bg-white shadow-md">
        <div className="flex justify-end gap-4">
          <ButtonClick
            text="Kembali ke Daftar"
            icon={<ChevronLeft size={16} strokeWidth={3} />}
            color="bg-primary-yellow"
            onClick={handleBack}
            spacing="1"
          />
          <ButtonClick
            text={status === "pending" ? "Menyimpan..." : "Simpan"}
            icon={<Save size={16} />}
            color="bg-primary-blueSoft"
            onClick={handleSave}
            spacing="1"
          />
        </div>

        <h1 className="text-lg sm:text-2xl font-semibold mt-4">
          Tambah Komponen Tagihan
        </h1>

        <div className="grid grid-cols-2 md:w-1/3 my-5 gap-2">
          <label className="text-sm font-semibold">Kode Komponen</label>
          <input
            type="text"
            value={kodeKomponen}
            onChange={(e) => setKode(e.target.value)}
            className="p-1 border-2 rounded text-sm md:w-70"
          />

          <label className="text-sm font-semibold">Nama Komponen</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="p-1 border-2 rounded text-sm md:w-70"
          />

          <label className="text-sm font-semibold">Nominal</label>
          <input
            type="number"
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
            className="p-1 border-2 rounded text-sm md:w-70"
          />
        </div>
      </div>
    </MainLayout>
  );
}
