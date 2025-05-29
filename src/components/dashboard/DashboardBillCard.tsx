// @ts-ignore
import React from "react";
import { TriangleAlert } from "lucide-react";

interface DashboardBillCardProps {
  title: string;
  price: number;
  pay?: boolean;
}

export default function DashboardBillCard({
  title,
  price,
  pay = false,
}: DashboardBillCardProps) {
  return (
    <>
      <div className="p-4 shadow-md bg-white w-full rounded-xl space-y-2 border">
        <h1 className="text-primary-blue font-semibold text-sm">{title}</h1>
        <h1 className="text-[#4f4f4f] text-2xl font-semibold">
          Rp. {price.toLocaleString("en-US")}
        </h1>
        {pay && (
          <>
            <button className="bg-primary-yellow w-full cursor-pointer rounded-md text-md font-semibold text-white py-2 px-4">
              Bayar Sekarang
            </button>
            <div className="flex text-primary-brown font-semibold text-lg">
              <span>Bayar Tagihan&nbsp;</span>
              <span className="text-red-500">
                Rp. {price.toLocaleString("id")}
              </span>
              <span>&nbsp;sebelum&nbsp;</span>
              <span className="text-red-500">April 2025</span>
            </div>
          </>
        )}
      </div>
      {pay && (
        <div className="bg-red-600 flex items-center space-x-4 px-4 py-2 text-lg text-white relative bottom-3 rounded-b-lg font-semibold tracking-wide">
          <TriangleAlert size={26} />
          <h1>Lunasi Tagihan Untuk Mengikuti Kegiatan Perkuliahan</h1>
        </div>
      )}
    </>
  );
}
