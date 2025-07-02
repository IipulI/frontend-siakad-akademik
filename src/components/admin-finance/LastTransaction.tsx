import { MoreVertical } from "lucide-react";
import { useLastTransaction } from "../../hooks/admin-keuangan/useDashboardFinance";

export default function LastTransaction() {
  const { data } = useLastTransaction();

  // Fungsi untuk format Rupiah
  function formatToRupiah(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }
  return (
    <div className=" rounded-lg overflow-hidden border-1 h-fit w-full col-span-7 lg:col-span-5">
      <div className="p-4">
        <h2 className="text-md text-gray-800">Transaksi Terakhir</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Riwayat Pembayaran Terakhir
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/2 border-y-1">
              <th className="py-3 px-6 font-medium text-gray-500 text-sm">
                Nama Mahasiswa
              </th>
              <th className="py-3 px-6 font-medium text-gray-500 text-sm">
                Metode Pembayaran
              </th>
              <th className="py-3 px-6 font-medium text-gray-500 text-sm">
                Tanggal
              </th>
              <th className="py-3 px-6 font-medium text-gray-500 text-sm">
                Jumlah Bayar
              </th>
              <th className="py-3 px-6"></th>
            </tr>
          </thead>
          <tbody>
            {data?.slice(0, 10).map((transaction) => (
              <tr key={transaction.id} className="border-1 text-sm">
                <td className="py-3 px-6">{transaction.namaMahasiswa}</td>
                <td className="py-3 px-6 text-gray-600">
                  {transaction.metodePembayaran}
                </td>
                <td className="py-3 px-6 text-gray-600">
                  {transaction.tanggal}
                </td>
                <td className="py-3 px-6 text-green-500 font-medium">
                  {`+${formatToRupiah(transaction.jumlahBayar)}`}
                </td>
                <td className="py-3 px-6 text-right">
                  <button className="text-gray-500 hover:text-gray-700">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
