import { ChevronLeft, Save } from "lucide-react";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AdminFinanceRoute } from "../../../types/VarRoutes";
import { useEffect, useState } from "react";
import { Api } from "../../../api/Index";

interface ComponentData {
  id: string;
  kodeKomponen: string;
  nama: string;
  nominal: number;
}

export default function EditComponentBill() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    kodeKomponen: "",
    nama: "",
    nominal: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state?.componentData) {
      const componentData = location.state.componentData as ComponentData;
      setFormData({
        kodeKomponen: componentData.kodeKomponen,
        nama: componentData.nama,
        nominal: componentData.nominal.toString(),
      });
    } else if (id) {
      fetchComponentData(id);
    }
  }, [id, location.state]);

  async function fetchComponentData(id: string) {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await Api.get(
        `/keuangan/invoice-komponen-mahasiswa/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data.data;
      setFormData({
        kodeKomponen: data.kodeKomponen,
        nama: data.nama,
        nominal: data.nominal.toString(),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Gagal memuat data komponen");
      navigate(AdminFinanceRoute.componentBill);
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Validasi input
    if (
      !formData.kodeKomponen ||
      !formData.nama ||
      !formData.nominal ||
      isNaN(parseInt(formData.nominal))
    ) {
      alert("Semua kolom harus diisi dengan benar");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      // Format data sama seperti create
      const payload = {
        kodeKomponen: formData.kodeKomponen,
        nama: formData.nama,
        nominal: parseInt(formData.nominal),
      };

      const response = await Api.put(
        `/keuangan/invoice-komponen-mahasiswa/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Komponen tagihan berhasil diperbarui!");
        navigate(AdminFinanceRoute.componentBill);
      }
    } catch (error: any) {
      console.error("Error update:", error.response?.data || error.message);
      alert(
        error.response?.data?.message || "Gagal memperbarui komponen tagihan"
      );
    } finally {
      setIsLoading(false);
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

        <h1 className="text-lg sm:text-2xl font-semibold mt-4">
          Edit Komponen Tagihan
        </h1>

        <div className="grid grid-cols-2 md:w-1/3 my-5 gap-2">
          <label className="text-sm font-semibold">Kode Komponen</label>
          <input
            type="text"
            name="kodeKomponen"
            value={formData.kodeKomponen}
            onChange={handleInputChange}
            className="p-1 border-2 rounded text-sm md:w-70"
          />

          <label className="text-sm font-semibold">Nama Komponen</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleInputChange}
            className="p-1 border-2 rounded text-sm md:w-70"
          />

          <label className="text-sm font-semibold">Nominal</label>
          <input
            type="number"
            name="nominal"
            value={formData.nominal}
            onChange={handleInputChange}
            className="p-1 border-2 rounded text-sm md:w-70"
            min="0"
          />
        </div>
      </div>
    </MainLayout>
  );
}
