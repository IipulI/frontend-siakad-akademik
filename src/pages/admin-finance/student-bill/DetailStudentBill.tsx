import MainLayout from "../../../components/layouts/MainLayout";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const DetailStudentBill = () => {
  const usenavigate = useNavigate();
  function handleBack() {
    usenavigate(-1);
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };

  const { state } = useLocation();

  console.log(state);

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
          <p>-</p>

          <h2 className="font-semibold">Tanggal Tenggat</h2>
          <p>{state.tanggalTenggat}</p>

          <h2 className="font-semibold">Mahasiswa</h2>
          <p>{state.nama}</p>

          <h2 className="font-semibold">Tanggal Bayar</h2>
          <p>{state.tanggalBayar}</p>

          <h2 className="font-semibold">Kode Invoice</h2>
          <p>{state.kodeTagihan}</p>

          <h2 className="font-semibold">Metode Bayar</h2>
          <p>{state.metodeBayar}</p>
        </div>

        {/* Bill Components Table */}
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
            {/* <tbody>
              {state.komponen.map((komponen, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="py-3 px-4 text-sm sm:text-base">
                    {komponen.kodeKomponen}
                  </td>
                  <td className="py-3 px-4 text-sm sm:text-base">
                    {komponen.nama}
                  </td>
                  <td className="py-3 px-4 text-sm sm:text-base text-left">
                    Rp. {formatCurrency(komponen.nominal)}
                  </td>
                </tr>
              ))}
            </tbody> */}
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default DetailStudentBill;
