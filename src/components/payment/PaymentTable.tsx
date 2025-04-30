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
    <div className="bg-white rounded-md shadow-sm p-6">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left py-3 text-primary-green">Nama Tagihan</th>
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
  );
}
