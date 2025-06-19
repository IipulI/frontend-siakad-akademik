import MainLayout from "../../components/layouts/MainLayout";
import ButtonClick from "../../components/admin-academic/student-data/ButtonClick";
import {Search} from "lucide-react";
import Card from "../../components/admin-academic/dashboard/Card";
import FacultyBill from "../../components/admin-finance/facultyBill";
import LastTransaction from "../../components/admin-finance/LastTransaction";
import { useGetAllbill } from "../../hooks/admin-keuangan/useDashboardFinance";
import TableLast30BillData from "../../components/admin-finance/TableLast30BillData";
import LoadingSpinner from "../../components/LoadingSpinner";

const DashboardAdminFinance = () => {

  const { data, isLoading, error } = useGetAllbill();
  console.log(data);

  if (isLoading) {
    return <LoadingSpinner title="" />;
  }

  const formatCurrencyShort = (value) => {
    let numValue;
    if (typeof value === "string") {
      numValue = parseFloat(value.replace(/[^\d.-]/g, ""));
    } else {
      numValue = value;
    }

    if (isNaN(numValue) || numValue === 0) return "0";

    // Simpan tanda negatif
    const absValue = Math.abs(numValue);

    let result = "";

    // Miliar (1,000,000,000+)
    if (absValue >= 1000000000) {
      const formatted = (absValue / 1000000000).toFixed(1);
      result = formatted.endsWith(".0")
        ? `${parseInt(formatted)}M`
        : `${formatted}M`;
    }
    // Juta (1,000,000+)
    else if (absValue >= 1000000) {
      const formatted = (absValue / 1000000).toFixed(1);
      result = formatted.endsWith(".0")
        ? `${parseInt(formatted)}JT`
        : `${formatted}JT`;
    }
    // Ribu (1,000+)
    else if (absValue >= 1000) {
      const formatted = (absValue / 1000).toFixed(1);
      result = formatted.endsWith(".0")
        ? `${parseInt(formatted)}RB`
        : `${formatted}RB`;
    }
    // Kurang dari 1000
    else {
      result = absValue.toString();
    }

    // Tambahkan tanda minus jika negatif
    return result;
  };

  function SearchSubmit() {
    alert("oke");
  }


  return (
    <MainLayout titlePage={"Beranda"} isGreeting={false}>
      <div className="border-t-2 border-primary-green rounded-sm py-2">
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-10 border-2 p-2">
          <select
            name=""
            id=""
            className="p-1 text-xs border-1 rounded w-22 text-gray-500"
          >
            <option value="semua">- Semua -</option>
          </select>

          <div className="flex items-center">
            <input
              type="text"
              className="border-2 p-1 rounded text-xs w-50  "
              placeholder="Cari Data Tagihan"
            />
            <ButtonClick
              icon={<Search size={16} strokeWidth={3} />}
              color="bg-primary-blueDark"
              onClick={SearchSubmit}
            />
          </div>
        </div>

        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:px-40 my-7">
            <Card
              title="Total Tagihan"
              value={formatCurrencyShort(data.totalTagihan)}
              color="bg-primary-blueSoft"
            />
            <Card
              title="total Tagihan Terbayar"
              value={formatCurrencyShort(data.totalTerbayar)}
              color="bg-primary-yellow"
            />
            <Card
              title="Total Tagihan Belum Terbayar"
              value={formatCurrencyShort(data.totalBelumBayar)}
              color="bg-red-500"
            />
          </div>
        )}

        <TableLast30BillData />

        <div className="grid grid-cols-7 mt-7 gap-10 mb-10">
          <FacultyBill />
          <LastTransaction />
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardAdminFinance;
