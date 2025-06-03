import { ChevronLeft, Save } from "lucide-react";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import MainLayout from "../../../components/layouts/MainLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminFinanceRoute } from "../../../types/VarRoutes";
import { Api } from "../../../api/Index";
import { useState } from "react";

interface ComponentBillData {
  id: string;
  kodeKomponen: string;
  nama: string;
  nominal: number;
}

export default function EditComponentBill() {
  // state untuk mengambil data
  const { state } = useLocation();
  const navigate = useNavigate();

  // inisialisasi form data dengan data dari state
  const [formData, setFormData] = useState<ComponentBillData>({
    id: state.id,
    kodeKomponen: state.kodeKomponen,
    nama: state.nama,
    nominal: state.nominal,
  });

  // fungsi untuk menangani perubahan input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // fungsi untuk kembali ke daftar komponen tagihan
  function handleBack() {
    navigate(AdminFinanceRoute.componentBill);
  }

  // fungsi untuk menyimpan perubahan data komponen tagihan
  async function handleSave() {
    try {
      const token = localStorage.getItem("token");

      await Api.put(
        `/keuangan/invoice-komponen-mahasiswa/${formData.id}`,
        {
          kodeKomponen: formData.kodeKomponen,
          nama: formData.nama,
          nominal: formData.nominal,
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
      alert("Terjadi kesalahan saat menyimpan data");
      console.error(error);
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

        <h1 className="text-lg sm:text-2xl font-semibold">
          Edit Komponen Tagihan
        </h1>

        <div className="grid grid-cols-2 md:w-1/3 my-5 gap-2">
          <label htmlFor="kodeKomponen" className="text-sm font-semibold">
            Kode Komponen
          </label>
          <input
            type="text"
            id="kodeKomponen"
            className="p-1 border-2 rounded text-sm md:w-70"
            value={formData.kodeKomponen}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="nama" className="text-sm font-semibold">
            Nama Komponen
          </label>
          <input
            type="text"
            id="nama"
            className="p-1 border-2 rounded text-sm md:w-70"
            value={formData.nama}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="nominal" className="text-sm font-semibold">
            Nominal
          </label>
          <input
            type="number"
            id="nominal"
            className="p-1 border-2 rounded text-sm md:w-70"
            value={formData.nominal}
            onChange={handleInputChange}
            required
            min="0"
          />
        </div>
      </div>
    </MainLayout>
  );
}
