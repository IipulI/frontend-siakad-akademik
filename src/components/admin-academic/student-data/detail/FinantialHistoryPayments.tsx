import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { getActiveBill } from "../../../../hooks/admin-akademik/useStudentDetail";
import { formatToRupiah } from "../../../admin-finance/FormatToRupiah";
import { getAcademicPeriodeDropdown } from "../../../../hooks/useGeneral";

export default function FinantialHistoryPayments() {
  const [filters, setFilters] = useState({
    namaPeriode: "",
  });
  const { state } = useLocation();

  const { data: tagihanData } = getActiveBill(state, filters.namaPeriode);
  const { data: periodeAkademikDropdown } = getAcademicPeriodeDropdown();

  const reversedDataPeriodeAkademik = periodeAkademikDropdown
    ?.slice()
    .reverse();

  // Filter hanya tagihan yang sudah lunas
  const tagihanLunas =
    tagihanData?.filter((item) => item.lunas === "lunas") || [];

  // Hitung total nominal tagihan yang sudah lunas
  const totalNominal = tagihanLunas.reduce(
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
                Tanggal Pembayaran
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
            {tagihanLunas.length > 0 ? (
              <>
                {tagihanLunas.map((item, index) => (
                  <tr key={index + 1} className="hover:bg-gray-100">
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {item.kodeKomponen}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {item.tanggalBayar}
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
                    colSpan={4}
                    className="border border-gray-500 font-semibold p-2 text-center"
                  >
                    Total
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {formatToRupiah(totalNominal)}
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="border border-gray-500 font-semibold p-4 text-center text-gray-500"
                >
                  Tidak ada tagihan yang sudah lunas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
