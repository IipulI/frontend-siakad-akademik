import MainLayout from "../../../components/layouts/MainLayout";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetStudentBillDetail } from "../../../hooks/admin-keuangan/useStudentBill";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { formatToRupiah } from "../../../components/admin-finance/FormatToRupiah";

const DetailStudentBill = () => {
  // ambil data tagihan mahasiswa
  const { state } = useLocation();

  const usenavigate = useNavigate();

  const studentId = state.id;

  const { data, isLoading, isError } = useGetStudentBillDetail(studentId);

  if (isLoading) {
    return <LoadingSpinner title="Data Tagihan Mahasiswa" />;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center py-4">
        Gagal memuat data tagihan mahasiswa
      </div>
    );
  }

  // Fungsi untuk kembali
  function handleBack() {
    usenavigate(-1);
  }

  return (
    <MainLayout isGreeting={false} titlePage="Tagihan Mahasiswa">
      <div className="p-4 border-t-2 border-primary-green bg-white rounded-sm shadow-md">
        <div className="flex justify-end">
          <ButtonClick
            color="bg-primary-yellow"
            text="Kembali ke Daftar"
            icon={<ChevronLeft size={20} />}
            onClick={handleBack}
          />
        </div>

        <h1 className="text-lg sm:text-2xl mb-5 font-semibold">
          Detail Tagihan
        </h1>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-6 mb-8 text-sm">
          <h2 className="font-semibold">Periode Akademik</h2>
          <p>{data?.periodeAkademik}</p>

          <h2 className="font-semibold">Tanggal Tenggat</h2>
          <p>{state.tanggalTenggat}</p>

          <h2 className="font-semibold">Mahasiswa</h2>
          <p>{data?.nama}</p>

          <h2 className="font-semibold">Tanggal Bayar</h2>
          <p>{data?.tanggalBayar || "-"}</p>

          <h2 className="font-semibold">Kode Invoice</h2>
          <p>{data?.kodeInvoice}</p>

          <h2 className="font-semibold">Metode Bayar</h2>
          <p>{data?.metodeBayar || "-"}</p>
        </div>

        {/* tabel */}
        <div className="bg-gray-50 rounded-lg overflow-auto border-1">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-sm sm:text-base text-black/70">
                  Kode Komponen
                </th>
                <th className="py-3 px-4 text-left font-semibold text-sm sm:text-base text-black/70">
                  Nama Komponen
                </th>
                <th className="py-3 px-4 text-left font-semibold text-sm sm:text-base text-black/70">
                  Nominal
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.tagihanKomponenDtos.map((komponen, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="py-3 px-4 text-sm sm:text-base">
                    {komponen.kodeKomponen}
                  </td>
                  <td className="py-3 px-4 text-sm sm:text-base">
                    {komponen.namaKomponen}
                  </td>
                  <td className="py-3 px-4 text-sm sm:text-base text-left">
                    {formatToRupiah(komponen.tagihan)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default DetailStudentBill;
