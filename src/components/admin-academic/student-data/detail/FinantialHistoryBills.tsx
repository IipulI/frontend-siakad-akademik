import { useLocation } from "react-router-dom";
import { getActiveBill } from "../../../../hooks/admin-akademik/useStudentDetail";
import { formatToRupiah } from "../../../admin-finance/FormatToRupiah";
import { useState } from "react";
import { getAcademicPeriodeDropdown } from "../../../../hooks/useFilter";

export default function FinantialHistoryBills() {
  const [filters, setFilters] = useState({
    namaPeriode: "",
  });

  const { state } = useLocation();

  const { data: tagihanBelumLunas } = getActiveBill(state, filters.namaPeriode);
  const { data: periodeAkademikDropdown } = getAcademicPeriodeDropdown();

  const reversedDataPeriodeAkademik = periodeAkademikDropdown
    ?.slice()
    .reverse();

  // Filter hanya tagihan yang belum lunas
  const tagihanBelumLunasFiltered =
    tagihanBelumLunas?.filter((item) => item.lunas === "belum lunas") || [];

  // Hitung total nominal tagihan yang belum lunas
  const totalNominal = tagihanBelumLunasFiltered.reduce(
    (total, item) => total + Number(item.nominalTagihan),
    0
  );

  // Handle filter change
  const handleFilterChange = (field: string, value: string) => {
    console.log(`Filter changed: ${field} = ${value}`);

    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [field]: value,
      };
      console.log("New filters:", newFilters);
      return newFilters;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center space-x-2 mt-4">
        <label htmlFor="" className="text-sm font-medium">
          Periode
        </label>
        <select
          name=""
          id=""
          className="border-2 rounded p-1 text-sm w-40"
          onChange={(e) => handleFilterChange("namaPeriode", e.target.value)}
          value={filters.namaPeriode}
        >
          {reversedDataPeriodeAkademik?.map((periode) => (
            <option key={periode.id} value={periode.namaPeriode}>
              {periode.namaPeriode}
            </option>
          ))}
        </select>
      </div>

      {/* Billing Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-500 font-semibold">
          <thead>
            <tr>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                No
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Kode Invoice
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Tanggal Jatuh tempo
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Nama Tagihan
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Nominal
              </th>
            </tr>
          </thead>
          <tbody>
            {tagihanBelumLunasFiltered.length > 0 ? (
              <>
                {tagihanBelumLunasFiltered.map((item, index) => (
                  <tr key={index + 1} className="hover:bg-gray-100">
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {item.kodeKomponen}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {item.tanggalTenggat}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {item.namaTagihan}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {formatToRupiah(Number(item.nominalTagihan))}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-medium">
                  <td
                    colSpan={3}
                    className="border border-gray-500 font-semibold p-2 text-center"
                  >
                    Total
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center"></td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {formatToRupiah(totalNominal)}
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td
                  className="border-1 text-center border-gray-500 font-semibold p-2"
                  colSpan={5}
                >
                  Tidak Ada Data Tagihan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
