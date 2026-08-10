import { TriangleAlert, CircleCheck } from "lucide-react"; // 1. Tambahkan ikon CircleCheck
import React from "react";
import { useNavigate } from "react-router-dom";
import { StudentRoute } from "../../types/VarRoutes";


interface DashboardBillCardProps {
  title: string;
  price: number | null | undefined;
  // 2. Ganti prop 'pay' dengan 'status' yang lebih deskriptif
  status?: 'info' | 'payable' | 'paid';
  date?: string | null | undefined;
}

export default function DashboardBillCard({
                                            title,
                                            price,
                                            status = 'info', // Default status adalah 'info'
                                            date
                                          }: DashboardBillCardProps) {

  const navigate = useNavigate();

  const displayPrice = price ?? 0;
  const formattedPrice = displayPrice.toLocaleString("id-ID");
  const formattedDate = date
      ? new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      : '-';

  const handlePayNowClick = () => {
    navigate(String(StudentRoute.payment.payment));
  };

  return (
      <>
        {/* 3. Tampilan utama kartu */}
        <div className={`p-4 shadow-md bg-white w-full rounded-xl space-y-2 border ${status === 'payable' ? 'border-red-500' : 'border-gray-200'}`}>
          <h1 className="text-primary-blue font-semibold text-xs sm:text-sm">{title}</h1>
          <h1 className="text-[#4f4f4f] text-base sm:text-xl md:text-2xl font-bold tracking-tight break-all truncate" title={`Rp. ${formattedPrice}`}>
            Rp. {formattedPrice}
          </h1>

          {/* 4. Tampilkan tombol bayar HANYA jika statusnya 'payable' */}
          {status === 'payable' && (
              <>
                <button
                    onClick={handlePayNowClick}
                    className="bg-primary-yellow w-full cursor-pointer rounded-md text-md font-semibold text-white py-2 px-4"
                >
                  Bayar Sekarang
                </button>
                <div className="flex text-primary-brown font-semibold text-lg">
                  <span>Bayar sebelum&nbsp;</span>
                  <span className="text-red-500">{formattedDate}</span>
                </div>
              </>
          )}

          {/* 5. Tampilkan status lunas HANYA jika statusnya 'paid' */}
          {status === 'paid' && (
              <div className="flex items-center space-x-2 text-primary-green pt-2">
                <CircleCheck size={20} />
                <span className="font-bold text-lg">Lunas</span>
              </div>
          )}
        </div>

        {/* Tampilkan peringatan HANYA jika statusnya 'payable' */}
        {status === 'payable' && (
            <div className="bg-red-600 flex items-center space-x-4 px-4 py-2 text-lg text-white relative bottom-3 rounded-b-lg font-semibold tracking-wide">
              <TriangleAlert size={26} />
              <h1>Lunasi Tagihan Untuk Mengikuti Kegiatan Perkuliahan</h1>
            </div>
        )}
      </>
  );
}
