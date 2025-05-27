import { MoreVertical } from "lucide-react";

export default function LastTransaction() {
  const transactions = [
    {
      name: "Muhammad Ridho Fatan",
      method: "Bank account",
      date: "2024/04/01",
      amount: "+Rp2.000.000",
    },
    {
      name: "Muhammad Ridho Fatan",
      method: "Tokopedia",
      date: "2024/03/29",
      amount: "+Rp2.000.000",
    },
    {
      name: "Muhammad Ridho Fatan",
      method: "Shopee",
      date: "2024/03/29",
      amount: "+Rp2.000.000",
    },
    {
      name: "Muhammad Ridho Fatan",
      method: "Bank account",
      date: "2024/03/27",
      amount: "+Rp2.000.000",
    },
    {
      name: "Muhammad Ridho Fatan",
      method: "Tokopedia",
      date: "2024/03/26",
      amount: "+Rp2.000.000",
    },
    {
      name: "Muhammad Ridho Fatan",
      method: "Tokopedia",
      date: "2024/03/24",
      amount: "+Rp2.000.000",
    },
    {
      name: "Muhammad Ridho Fatan",
      method: "Shopee",
      date: "2024/03/21",
      amount: "+Rp2.000.000",
    },
  ];

  return (
    <div className=" rounded-lg overflow-hidden border-1 h-fit w-full col-span-7 lg:col-span-5">
      <div className="p-4">
        <h2 className="text-md text-gray-800">
          Transaksi Terakhir
        </h2>
        <p className="text-gray-500 mt-1 text-sm">Riwayat Pembayaran Terakhir</p>
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
              <th className="py-3 px-6 font-medium text-gray-500 text-sm">Tanggal</th>
              <th className="py-3 px-6 font-medium text-gray-500 text-sm">
                Jumlah Bayar
              </th>
              <th className="py-3 px-6"></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index} className="border-1 text-sm">
                <td className="py-3 px-6">{transaction.name}</td>
                <td className="py-3 px-6 text-gray-600">
                  {transaction.method}
                </td>
                <td className="py-3 px-6 text-gray-600">{transaction.date}</td>
                <td className="py-3 px-6 text-green-500 font-medium">
                  {transaction.amount}
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
