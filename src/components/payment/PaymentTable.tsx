import { ArrowUp, ChevronUp, Wallet } from "lucide-react";
import React from "react";

interface PaymentTableProps {
  data: Array<{
    id: number;
    name: string;
    category: string;
    discount: string;
    penalty: string;
    amount: number;
    status: string;
  }>;
  total: number;
  onClick: () => void;
  className: string;
  loading: boolean;
  error: boolean;
}

// PaymentTable.jsx
export default function PaymentTable({ data, total }: PaymentTableProps) {
  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="bg-white rounded-md shadow-sm p-6 col-span-3">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-3 text-primary-green">
                Nama Tagihan
              </th>
              <th className="text-left py-3 text-primary-green">Potongan</th>
              <th className="text-left py-3 text-primary-green">Denda</th>
              <th className="text-right py-3 text-primary-green">Tagihan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id}>
                <td className="py-4">
                  <div>
                    {index + 1}. {item.name}
                    <span className="text-gray-500">({item.category})</span>
                  </div>
                  {item.status && (
                    <div className="bg-red-100 text-red-600 text-sm px-2 py-1 mt-1 rounded-sm inline-block">
                      {item.status}
                    </div>
                  )}
                </td>
                <td className="py-4">{item.discount}</td>
                <td className="py-4">{item.penalty}</td>
                <td className="py-4 text-right">
                  Rp. {item.amount.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="py-4 font-semibold">
                Total Tagihan
              </td>
              <td className="py-4 text-right font-bold">
                Rp. {total.toLocaleString("id-ID")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="col-span-2 space-y-4">
        <div className="bg-white rounded shadow-sm p-8 flex flex-col">
          <label className="font-semibold" htmlFor="">
            Pilih Metode Pembayaran
          </label>
          <select
            className="border-2 py-2 px-4 text-primary-brown rounded"
            name=""
            id=""
          >
            <option value="">Pilih Metode Pembayaran</option>
          </select>
        </div>
        <div className="bg-white rounded shadow-sm p-8 flex flex-col space-y-8">
          <span className="font-semibold">Rincian Pembayaran</span>
          <div>
            <h1 className="font-semibold">Detail Pembayaran</h1>
            <div className="flex justify-between items-center italic text-primary-brown">
              <span>Ujian Akhir Semester(Sekali Bayar)</span>
              <span>Rp.900.000</span>
            </div>
            <div className="flex justify-between items-center italic text-primary-brown">
              <span>Kerja Praktik(Sekali Bayar)</span>
              <span>Rp.300.000</span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2 font-semibold">
              <h1>Lihat Total Tagihan</h1>
              <ChevronUp />
            </div>
            <div className="flex justify-between items-center text-primary-brown">
              <div className="flex items-center space-x-2 italic text-primary-brown">
                <input type="radio" name="" id="" />
                <span>Telah Diakumulasi</span>
              </div>
              <span className="font-semibold text-primary-yellow">
                Rp.900.000
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
