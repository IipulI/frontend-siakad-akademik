import React from "react";
const LogoUika = "/img/logo_uika.png";
import { ChevronDown, Copy, ShoppingCart } from "lucide-react";

// Definisikan data untuk setiap metode pembayaran
const dataMetode = {
  "amanahummah": {
    nama: "Bank Ammanah Ummah",
    icon: <ShoppingCart />, // Ganti dengan ikon yang sesuai
    nomorVA: "8871234567890",
    instruksi: [
      { no: 1, description: "Login ke aplikasi mobile banking Ammanah Ummah." },
      { no: 2, description: "Pilih menu 'Transfer' lalu 'Virtual Account'." },
      { no: 3, description: "Masukkan nomor Virtual Account di atas dan lanjutkan." },
      // ...tambahkan langkah lainnya
    ],
  },
  "vabsi": {
    nama: "Virtual Account BSI",
    icon: <ShoppingCart />,
    nomorVA: "9988765432109",
    instruksi: [
      { no: 1, description: "Login ke BSI Mobile." },
      { no: 2, description: "Pilih menu 'Bayar' lalu 'Akademik'." },
      { no: 3, description: "Pilih institusi 'Universitas Ibn Khaldun'." },
      { no: 4, description: "Masukkan Nomor Virtual Account dan selesaikan transaksi." },
      // ...tambahkan langkah lainnya
    ],
  },
  "vamuamalat": {
    nama: "Virtual Account Bank Muamalat",
    icon: <ShoppingCart />,
    nomorVA: "7766554433221",
    instruksi: [
      { no: 1, description: "Login ke Muamalat DIN." },
      { no: 2, description: "Pilih menu 'Pembayaran' lalu 'Pendidikan'." },
      { no: 3, description: "Masukkan kode institusi dan Nomor VA lalu lanjutkan." },
      // ...tambahkan langkah lainnya
    ],
  },
};

interface PaymentConfirmationProps {
  method: string;
  total: number;
  deadline: Date | null;
}

export default function PaymentConfirmation({ method, total, deadline }: PaymentConfirmationProps) {
  const formattedDeadline = deadline
      ? deadline.toLocaleString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      : 'Batas waktu tidak tersedia';

  // Pilih data yang akan ditampilkan berdasarkan props 'method'
  const detailMetode = dataMetode[method] || {
    nama: "Metode Tidak Dikenali",
    icon: <ShoppingCart />,
    nomorVA: "Tidak Tersedia",
    instruksi: [{ no: 1, description: "Pilih metode pembayaran yang valid." }],
  };

  return (
      <div className="mx-auto container max-w-3xl space-y-6">
        <div className="flex items-center justify-center space-x-8">
          <img src={LogoUika} className="w-20" alt="" />
          <div className="flex flex-col space-y-2">
            <h1 className="font-semibold">Lakukan Pembayaran Sebelum</h1>
            <h1 className="font-semibold text-primary-brown">Batas Waktu Pembayaran :</h1>
            <h1 className="font-semibold text-red-500">
              {/* Seharusnya data ini datang dari API */}
              {formattedDeadline}
            </h1>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="font-semibold text-lg">Detail Informasi Pembayaran</h1>
          <div className="p-6 rounded-md border-2">
            <div className="flex flex-col space-y-4 items-center">
              {/* --- Bagian Dinamis --- */}
              <div className="flex flex-col w-full space-y-2">
                <h1 className="text-primary-brown text-base font-semibold">Metode Pembayaran</h1>
                <div className="flex justify-between items-center">
                  <h1 className="font-semibold">{detailMetode.nama}</h1>
                  {detailMetode.icon}
                </div>
              </div>
              <div className="flex flex-col w-full space-y-2">
                <h1 className="text-primary-brown text-base font-semibold">Nomor Virtual Account</h1>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <h1 className="font-semibold">{detailMetode.nomorVA}</h1>
                    <Copy color="#116E63" className="cursor-pointer" onClick={() => navigator.clipboard.writeText(detailMetode.nomorVA)}/>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full space-y-2">
                <h1 className="text-primary-brown text-base font-semibold">Total Pembayaran</h1>
                <div className="flex justify-between items-center">
                  <h1 className="text-base font-semibold">
                    Rp{total.toLocaleString('id-ID')}
                  </h1>
                  <Copy color="#116e63" className="cursor-pointer" onClick={() => navigator.clipboard.writeText(total.toString())}/>
                </div>
              </div>
              {/* --- Akhir Bagian Dinamis --- */}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="font-semibold text-lg">Cara Pembayaran Tagihan</h1>
          <ul className="flex flex-col space-y-2">
            {detailMetode.instruksi.map((step) => (
                <li key={step.no} className="tracking-tight text-primary-brown flex space-x-2 font-semibold">
                  <p>{step.no}.</p>
                  <p>{step.description}</p>
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
}