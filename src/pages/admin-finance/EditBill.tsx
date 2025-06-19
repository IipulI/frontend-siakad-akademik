import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import ButtonClick from "../../components/admin-academic/student-data/ButtonClick";
import MainLayout from "../../components/layouts/MainLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminFinanceRoute } from "../../types/VarRoutes";
import { useEditStudentBill } from "../../hooks/admin-keuangan/useDashboardFinance";

export default function EditBill() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const editBillMutation = useEditStudentBill();

  // State untuk tanggal tenggat
  const [tanggalTenggat, setTanggalTenggat] = useState(
    state?.tanggalTenggat || ""
  );

  console.log(state);

  function handleBack() {
    navigate(AdminFinanceRoute.dashboardAdminFinance);
  }

  const handleSave = async () => {
    try {
      await editBillMutation.mutateAsync({
        id: state.id, // pastikan state memiliki id
        tanggalTenggat: tanggalTenggat,
      });

      // Redirect atau show success message
      alert("Tanggal tenggat berhasil diperbarui!");
      navigate(AdminFinanceRoute.dashboardAdminFinance);
    } catch (error) {
      console.error("Error updating bill:", error);
      alert("Gagal memperbarui tanggal tenggat");
    }
  };

  // Guard clause jika state tidak ada
  if (!state) {
    return (
      <MainLayout isGreeting={false} titlePage="Edit Tagihan">
        <div className="border-t-2 border-t-primary-green border-2 h-lvh rounded-sm p-2">
          <p>Data tidak tersedia</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isGreeting={false} titlePage="Edit Tagihan">
      <div className="border-t-2 border-t-primary-green border-2 h-lvh rounded-sm p-2">
        <h1 className="text-lg sm:text-2xl font-semibold">
          Mahasiswa yang dipilih
        </h1>
        <div className="my-3 flex justify-end">
          <ButtonClick
            color="bg-primary-yellow"
            text="Kembali Ke Daftar"
            icon={<ChevronLeft size={20} />}
            onClick={handleBack}
            spacing="2"
          />
        </div>

        <div>
          <h1 className="text-lg sm:text-2xl font-semibold">Edit Tagihan</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 w-full lg:pr-30 gap-1 mt-2">
            <label htmlFor="periodeAkademik" className="font-medium text-sm">
              Periode Akademik
            </label>
            <input
              id="periodeAkademik"
              disabled
              type="text"
              value={"responnya blum ada"}
              className="text-xs text-gray-500 font-medium mb-3 lg:mb-0"
            />

            <label htmlFor="tanggalTenggat" className="font-medium text-sm">
              Tanggal Tenggat
            </label>
            <input
              id="tanggalTenggat"
              type="date"
              value={tanggalTenggat}
              onChange={(e) => setTanggalTenggat(e.target.value)}
              className="text-xs text-gray-500 font-medium mb-3 lg:mb-0 border-1 p-0.5 px-2"
            />

            <label htmlFor="mahasiswa" className="font-medium text-sm">
              Mahasiswa
            </label>
            <input
              id="mahasiswa"
              disabled
              type="text"
              value={state.nama}
              className="text-xs text-gray-500 font-medium mb-3 lg:mb-0 lg:col-span-3"
            />

            <label htmlFor="kodeInvoice" className="font-medium text-sm">
              Kode Invoice
            </label>
            <input
              id="kodeInvoice"
              disabled
              type="text"
              value={state.kodeTagihan}
              className="text-xs text-gray-500 font-medium mb-3 lg:mb-0"
            />
          </div>

          {/* Button untuk save */}
          <div className="mt-6 flex gap-2">
            <ButtonClick
              color="bg-primary-green"
              text={editBillMutation.isPending ? "Menyimpan..." : "Simpan"}
              onClick={handleSave}
              spacing="2"
              icon={undefined}
            />
            <ButtonClick
              color="bg-gray-500"
              text="Batal"
              onClick={handleBack}
              spacing="2"
              icon={undefined}            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
