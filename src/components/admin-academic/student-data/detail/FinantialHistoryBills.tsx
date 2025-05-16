export default function FinantialHistoryBills() {
  const vaData = [
    // {
    //   kodeVA: "1234",
    //   metodePembayaran: "Bank",
    //   tanggalJatuhTempo: "3 Juli 2025",
    //   nominal: "1.000.000",
    //   biayaAdmin: "1.000",
    //   totalPembayaran: "1.001.000",
    // },
  ];

  const billingData = [
    {
      no: 1,
      kodeTagihan: "INV/2042/0013017",
      bulan: "Februari-2025",
      jenisTagihan: "1210",
      cicilan: 1,
      tanggalJatuhTempo: "1 Februari 2025, 23:59",
      nominal: 1050000,
      denda: 0,
      potongan: 0,
      terbayar: 0,
      subTotalTagihan: 1050000,
    },
  ];

  const totalNominal = billingData.reduce((sum, item) => sum + item.nominal, 0);
  const totalDenda = billingData.reduce((sum, item) => sum + item.denda, 0);
  const totalPotongan = billingData.reduce(
    (sum, item) => sum + item.potongan,
    0
  );
  const totalTerbayar = billingData.reduce(
    (sum, item) => sum + item.terbayar,
    0
  );
  const totalSubTotalTagihan = billingData.reduce(
    (sum, item) => sum + item.subTotalTagihan,
    0
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID").format(amount);
  };
  return (
    <div className="flex flex-col gap-6">
      {/* VA Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-500 font-semibold">
          <thead>
            <tr>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Kode VA
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Metode Pembayaran
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Tanggal Jatuh Tempo
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Nominal
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Biaya Admin
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Total pembayaran
              </th>
            </tr>
          </thead>
          <tbody className="border-b-3 border-black/70">
            {vaData.length > 0 ? (
              vaData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {item.kodeVA}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {item.metodePembayaran}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {item.tanggalJatuhTempo}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {item.nominal}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {item.biayaAdmin}
                  </td>
                  <td className="border border-gray-500 font-semibold p-2 text-center">
                    {item.totalPembayaran}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-3">
                  <div className="font-medium">
                    Tidak Ada Kode Virtual Account yang aktif
                  </div>
                </td>
              </tr>
            )}
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
                Tanggal Jatuh tempo
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
                <td className="border border-gray-500 font-semibold p-2 text-center">
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
                  {item.tanggalJatuhTempo}
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
                  {formatCurrency(item.subTotalTagihan)}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-medium">
              <td
                colSpan={6}
                className="border border-gray-500 font-semibold p-2 text-center"
              >
                Total
              </td>
              <td className="border border-gray-500 font-semibold p-2 text-center">
                {formatCurrency(totalNominal)}
              </td>
              <td className="border border-gray-500 font-semibold p-2 text-center">
                {formatCurrency(totalDenda)}
              </td>
              <td className="border border-gray-500 font-semibold p-2 text-center">
                {formatCurrency(totalPotongan)}
              </td>
              <td className="border border-gray-500 font-semibold p-2 text-center">
                {formatCurrency(totalTerbayar)}
              </td>
              <td className="border border-gray-500 font-semibold p-2 text-center">
                {formatCurrency(totalSubTotalTagihan)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
