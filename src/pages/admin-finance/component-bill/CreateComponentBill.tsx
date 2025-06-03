import { useState } from "react";
import { ChevronLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import MainLayout from "../../../components/layouts/MainLayout";
import { AdminFinanceRoute } from "../../../types/VarRoutes";
import { Api } from "../../../api/Index";

export default function CreateComponentBill() {
  const navigate = useNavigate();

  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [nominal, setNominal] = useState("");

  function handleBack() {
    navigate(AdminFinanceRoute.componentBill);
  }

  async function handleSave() {
    if (!kode || !nama || !nominal) {
      alert("Mohon lengkapi semua field!");
      return;
    }

    try {
      const payload = {
        kode,
        nama,
        nominal: Number(nominal),
      };

      const token = localStorage.getItem("token");

      const response = await Api.post(
        "/keuangan/invoice-komponen-mahasiswa",
        {
          payload,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Data berhasil disimpan!");
      navigate(AdminFinanceRoute.componentBill);
    } catch (error) {
      console.error("Error saat menyimpan:", error);
      alert("Terjadi kesalahan saat menyimpan.");
    }
  }

  return (
    <MainLayout isGreeting={false} titlePage="Komponen Tagihan">
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
            text="Simpan"
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
            value={kode}
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
