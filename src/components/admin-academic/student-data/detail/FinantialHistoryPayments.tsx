import React from "react";

export default function FinantialHistoryPayments() {
  // Payment history data from the image
  const paymentData = [
    {
      no: 1,
      kodePembayaran: "INV/2042/0013017",
      tanggal: "25 Feb 2025, 12:08:17",
      switching: "SevimaPay",
      bank: "Tokopedia",
      biayaAdmin: 4000,
      nominal: 2000000,
      aksi: "",
    },
  ];

  // Billing data from the image
  const billingData = [
    {
      no: 1,
      kodeTagihan: "INV/2042/0013017",
      bulan: "Februari- 2025",
      jenisTagihan: "1210",
      cicilan: 1,
      nominal: 1050000,
      denda: 0,
      potongan: 0,
      terbayar: 0,
      subTotalTagihan: 1050.0,
    },
  ];

  // Calculate totals
  const totalPaymentNominal = paymentData.reduce(
    (sum, item) => sum + item.nominal,
    0
  );
  const totalSubTotalTagihan = billingData.reduce(
    (sum, item) => sum + item.subTotalTagihan,
    0
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Payment History Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-500 font-semibold">
          <thead>
            <tr>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                No
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Kode Pembayaran
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Tanggal
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Switching
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Bank
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Biaya Admin
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Nominal
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {paymentData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {item.no}
                </td>
                <td className="border border-gray-500 font-semibold p-2">
                  {item.kodePembayaran}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {item.tanggal}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {item.switching}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {item.bank}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {formatCurrency(item.biayaAdmin)}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {formatCurrency(item.nominal)}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {item.aksi}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-medium">
              <td colSpan={6} className="border border-gray-500 font-semibold p-2 text-center">
                Total
              </td>
              <td className="border border-gray-500 font-semibold p-2 text-center">
                {formatCurrency(totalPaymentNominal)}
              </td>
              <td className="border border-gray-500 font-semibold p-2"></td>
            </tr>
          </tbody>
        </table>
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
                Kode Tagihan
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Bulan
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Jenis Tagihan
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Cicilan Ke-
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Nominal
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Denda
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Potongan
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Terbayar
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Sub Total Tagihan
              </th>
            </tr>
          </thead>
          <tbody>
            {billingData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {item.no}
                </td>
                <td className="border border-gray-500 font-semibold p-2">
                  {item.kodeTagihan}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {item.bulan}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {item.jenisTagihan}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {item.cicilan}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {formatCurrency(item.nominal)}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {formatCurrency(item.denda)}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {formatCurrency(item.potongan)}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {formatCurrency(item.terbayar)}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {item.subTotalTagihan.toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-medium">
              <td colSpan={9} className="border border-gray-500 font-semibold p-2 text-center">
                Total
              </td>
              <td className="border border-gray-500 font-semibold p-2 text-center">
                {totalSubTotalTagihan.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}