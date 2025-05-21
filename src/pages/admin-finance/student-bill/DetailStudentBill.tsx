import MainLayout from "../../../components/layouts/MainLayout";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AdminFinanceRoute } from "../../../types/VarRoutes";

const DetailStudentBill = () => {
  const usenavigate = useNavigate();
  function handleBack() {
    usenavigate(AdminFinanceRoute.studentBill);
  }
  // Sample data - in a real app this would come from props or an API
  const billData = {
    academicPeriod: "2024/2025",
    studentName: "Muhammad Syaifullah Nurrohman",
    invoiceCode: "PAY/20242/0004809",
    dueDateFull: "Senin, 28 April 2025",
    paymentDateFull: "Jumat, 26 April 2025",
    paymentMethod: "Amanah Ummah",
    components: [
      {
        code: "INV/20242/0015550",
        name: "Ujian Akhir Semester",
        amount: 1500000,
      },
      {
        code: "INV/20242/0015549",
        name: "SPP",
        amount: 500000,
      },
      {
        code: "INV/20242/0015549",
        name: "SKS",
        amount: 0,
      },
    ],
  };

  // Calculate total amount
  const totalAmount = billData.components.reduce(
    (sum, component) => sum + component.amount,
    0
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };

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
          <p>{billData.academicPeriod}</p>

          <h2 className="font-semibold">Tanggal Tenggat</h2>
          <p>{billData.dueDateFull}</p>

          <h2 className="font-semibold">Mahasiswa</h2>
          <p>{billData.studentName}</p>

          <h2 className="font-semibold">Tanggal Bayar</h2>
          <p>{billData.paymentDateFull}</p>

          <h2 className="font-semibold">Kode Invoice</h2>
          <p>{billData.invoiceCode}</p>

          <h2 className="font-semibold">Metode Bayar</h2>
          <p>{billData.paymentMethod}</p>
        </div>

        {/* Bill Components Table */}
        <div className="bg-gray-50 rounded-lg overflow-auto border-1">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-sm sm:text-base text-black/70">Kode Komponen</th>
                <th className="py-3 px-4 text-left font-semibold text-sm sm:text-base text-black/70">Nama Komponen</th>
                <th className="py-3 px-4 text-left font-semibold text-sm sm:text-base text-black/70">Nominal</th>
              </tr>
            </thead>
            <tbody>
              {billData.components.map((component, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="py-3 px-4 text-sm sm:text-base">{component.code}</td>
                  <td className="py-3 px-4 text-sm sm:text-base">{component.name}</td>
                  <td className="py-3 px-4 text-sm sm:text-base text-left">
                    Rp. {formatCurrency(component.amount)}
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
