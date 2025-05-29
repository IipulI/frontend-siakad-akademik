import { ChevronLeft, Save } from "lucide-react";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { AdminFinanceRoute } from "../../../types/VarRoutes";
import { useEffect, useState } from "react";
import { Api } from "../../../api/Index";

export default function EditComponentBill() {
  const navigate = useNavigate();
  const { id } = useParams(); // Menangkap ID dari URL seperti /edit/:id

  const [kodeKomponen, setKodeKomponen] = useState("");
  const [nama, setNama] = useState("");
  const [nominal, setNominal] = useState("");

  // Ambil data komponen berdasarkan ID saat komponen pertama kali dirender
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
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
        setKodeKomponen(data.kodeKomponen);
        setNama(data.nama);
        setNominal(data.nominal.toString());
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        alert(
          "Gagal mengambil data. Silakan periksa koneksi atau coba lagi nanti."
        );
      }
    };

    fetchData();
  }, [id]);

  // Fungsi untuk menyimpan data yang sudah diedit
  const handleSave = async () => {
    if (!kodeKomponen || !nama || !nominal || isNaN(Number(nominal))) {
      alert(
        "Semua kolom harus diisi dengan benar. Nominal harus berupa angka."
      );
      return;
    }

    const token = localStorage.getItem("token");

    try {
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

      alert("Berhasil menyimpan data!");
      navigate(AdminFinanceRoute.componentBill);
    } catch (error) {
      console.error("Gagal menyimpan komponen tagihan:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
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
            min="0"
          />
        </div>
      </div>
    </MainLayout>
  );
}
