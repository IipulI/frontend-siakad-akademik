import { ChevronLeft, Save } from "lucide-react";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import MainLayout from "../../../components/layouts/MainLayout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AdminFinanceRoute } from "../../../types/VarRoutes";
import { useEffect, useState } from "react";
import { Api } from "../../../api/Index";

export default function EditComponentBill() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation(); // mengambil state
  const [kodeKomponen, setKodeKomponen] = useState("");
  const [nama, setNama] = useState("");
  const [nominal, setNominal] = useState("");

  // mengambil data dari state dan set ke form
  useEffect(() => {
    if (location.state && location.state.componentData) {
      const { componentData } = location.state;
      setKodeKomponen(componentData.kodeKomponen || "");
      setNama(componentData.nama || "");
      setNominal(componentData.nominal ? componentData.nominal.toString() : "");
    }
  }, [location.state]);

  // Fungsi simpan (PUT)
  const handleSave = async () => {
    if (!kodeKomponen || !nama || !nominal || isNaN(parseInt(nominal))) {
      alert("Semua kolom harus diisi dengan benar");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await Api.put(
        `/keuangan/invoice-komponen-mahasiswa/${id}`,
        {
          kodeKomponen,
          nama,
          nominal: parseInt(nominal),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Berhasil mengupdate data!");
      navigate(AdminFinanceRoute.componentBill);
    } catch (error) {
      console.error("Gagal update:", error);
      alert("Gagal menyimpan perubahan");
    }
  };

  const handleBack = () => {
    navigate(AdminFinanceRoute.componentBill);
  };

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

        <h1 className="text-lg sm:text-2xl font-semibold mt-6">
          Edit Komponen Tagihan
        </h1>
        <div className="grid grid-cols-2 md:w-1/3 my-5 gap-2">
          <label className="text-sm font-semibold">Kode Komponen</label>
          <input
            type="text"
            value={kodeKomponen}
            onChange={(e) => setKodeKomponen(e.target.value)}
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
