import React from "react";
import LogoUika from "../../../public/img/logo_uika.png";
import { ChevronDown, Clipboard, Copy, ShoppingCart } from "lucide-react";

export default function PaymentConfirmation() {
  const steps = [
    {
      no: 1,
      description: "Login ke aplikasi mobile Tokopedia.",
    },
    {
      no: 2,
      description: "Pilih 'Semua Kategori'.",
    },
    {
      no: 3,
      description: "Pada bagian 'Top-Up & Tagihan', pilih 'Biaya Pendidikan'.",
    },
    {
      no: 4,
      description:
        "Pilih Institusi Pendidikan dan masukkan Nomor Pembayaran atau Nomor Mahasiswa, klik 'Bayar'.",
    },
    {
      no: 5,
      description: "Cek data tagihan, jika sudah sesuai klik LANJUT.",
    },
    {
      no: 6,
      description:
        "Pilih Metode Pembayaran dan ikuti instruksi untuk menyelesaikan transaksi.",
    },
    {
      no: 7,
      description:
        "Setelah pembayaran dilakukan status tagihan akan menjadi 'lunas'.",
    },
  ];

  return (
    <div className="mx-auto container max-w-3xl space-y-4">
      <div className="flex items-center justify-center space-x-8">
        <img src={LogoUika} width={200} alt="" />
        <div className="flex flex-col space-y-2">
          <h1 className="font-semibold">Lakukan Pembayaran Sebelum</h1>
          <h1 className="font-semibold text-primary-brown">
            Batas Waktu Pembayaran :{" "}
          </h1>
          <h1 className="font-semibold text-red-500">
            Minggu , 4 Mei 2025 , 23:59:59
          </h1>
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="font-semibold text-lg">Detail Informasi Pembayaran</h1>
        <div className="p-6 rounded-md border-2">
          <div className="flex flex-col space-y-4 items-center">
            <div className="flex flex-col w-full space-y-2">
              <h1 className="text-primary-brown text-base font-semibold">
                Metode Pembayaran
              </h1>
              <div className="flex justify-between items-center">
                <h1 className="font-semibold">Tokopedia</h1>
                <ShoppingCart />
              </div>
            </div>
            <div className="flex flex-col w-full space-y-2">
              <h1 className="text-primary-brown text-base font-semibold">
                Nomor Virtual Account
              </h1>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <h1 className="font-semibold">221106043035</h1>
                  <Copy color="#116E63" />
                </div>
                <button className="cursor-pointer text-sm border-2 border-primary-yellow py-1 px-2 rounded text-primary-yellow">
                  Salin
                </button>
              </div>
            </div>
            <div className="flex flex-col w-full space-y-2">
              <div className="flex items-center space-x-2">
                <h1 className="text-primary-brown text-base font-semibold">
                  Total Pembayaran
                </h1>
                <ChevronDown />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 italic text-primary-brown">
                    <input type="radio" name="" id="" />
                    <span>Telah Diakumulasi</span>
                  </div>
                </div>
                <div className="text-base font-semibold flex items-center space-x-1">
                  <span className="text-primary-yellow">Rp.3.300.000</span>
                  <Copy color="#116e63" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="font-semibold text-lg">Cara Pembayaran Tagihan</h1>
        <ul className="flex flex-col space-y-2">
          {steps.map((step, key) => (
            <li className="tracking-tight text-primary-brown flex space-x-2 font-semibold">
              <p>{step.no}</p>
              <p>{step.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
