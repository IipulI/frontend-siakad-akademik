import { MapPin, Phone } from "lucide-react";
import React, { useEffect } from "react";
import LogoUika from "../../../public/img/logo_uika.png";
import { ITagihan } from "../../../types/mahasiswa.types";

// Definisikan props untuk komponen utama
interface PaymentReceiptProps {
  bills: ITagihan[];
  total: number;
  method: string;
  paymentDate: Date;
}

export default function PaymentReceipt({ bills, total, method, paymentDate }: PaymentReceiptProps) {
  // Hapus sesi dari localStorage saat komponen ini dimuat
  useEffect(() => {
    localStorage.removeItem('paymentSession');
  }, []);

  const formattedPaymentDate = paymentDate.toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  return (
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-md border-t-4 border-primary-blueDark space-y-12 border-b-4">
        {/* Bagian Header Statis */}
        <div className="justify-between flex items-center">
          <img src={LogoUika} width={75} alt="" />
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-primary-brown space-x-2 text-sm font-semibold">
              <MapPin />
              <span>Jl KH Sholeh Iskandar KM2<br />Kedung Badak Bogor</span>
            </div>
            <div className="flex items-center text-primary-brown space-x-2 text-sm font-semibold">
              <Phone />
              <span>0251-8356884</span>
            </div>
          </div>
        </div>

        {/* Bagian Detail Dinamis */}
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold">Bukti Pembayaran</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-6 text-lg">
              {/* DATA DINAMIS */}
              <ReceiptAttribute title="No. Transaksi" credential=": PAY/20242/SIMULASI" className="text-primary-blueDark" />
              <ReceiptAttribute title="Periode Tagihan" credential={`: ${bills[0]?.namaPeriode || 'Tidak ada'}`} />
              <ReceiptAttribute title="Tanggal Bayar" credential={`: ${formattedPaymentDate}`} />
              <ReceiptAttribute title="Metode Bayar" credential={`: ${method}`} />
            </div>
            <div className="flex flex-col space-y-6 text-lg">
              {/* Data mahasiswa ini idealnya datang dari state/hook terpisah */}
              <ReceiptAttribute title="NIM" credential=": 22110604xxxx" />
              <ReceiptAttribute title="Nama" credential=": Mahasiswa Simulasi" />
              <ReceiptAttribute title="Program Studi" credential=": Teknik Informatika" />
              <ReceiptAttribute title="Periode Masuk" credential=": 2022 Ganjil" />
            </div>
          </div>
          <ReceiptTable data={bills} total={total} />
          <ReceiptSignature paymentDate={formattedPaymentDate} />
        </div>
      </div>
  );
}

// --- Komponen Sub-Bagian ---

interface ReceiptAttributeProps {
  className?: string;
  title: string;
  credential: string;
}

const ReceiptAttribute = ({ className, title, credential }: ReceiptAttributeProps) => (
    <div className="flex items-center font-semibold text-base space-x-4">
      <span className="text-primary-brown w-32">{title}</span>
      <p className={className ? className : "text-primary-brown"}>{credential}</p>
    </div>
);

interface ReceiptTableProps {
  data: ITagihan[];
  total: number;
}

const ReceiptTable = ({ data, total }: ReceiptTableProps) => (
    <div className="w-full overflow-x-auto mt-6">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
        <tr className="bg-gray-100 text-primary-blueDark">
          <th className="p-3 font-semibold">Nama Tagihan</th>
          <th className="p-3 font-semibold">Nominal</th>
          <th className="p-3 font-semibold">Denda</th>
          <th className="p-3 font-semibold">Potongan</th>
          <th className="p-3 font-semibold text-right">Sub Total</th>
        </tr>
        </thead>
        <tbody>
        {/* DATA DINAMIS */}
        {data.map((item) => (
            <tr key={item.kodeInvoice} className="border-b">
              <td className="p-3">
                <div className="font-medium">{item.namaTagihan}</div>
                <div className="text-xs text-gray-500">{item.kodeInvoice}</div>
              </td>
              <td className="p-3">Rp{item.nominalTagihan.toLocaleString('id-ID')}</td>
              <td className="p-3">-</td>
              <td className="p-3">-</td>
              <td className="p-3 text-right">Rp{item.nominalTagihan.toLocaleString('id-ID')}</td>
            </tr>
        ))}
        </tbody>
        <tfoot>
        <tr className="font-semibold text-base">
          <td colSpan={4} className="p-3 text-right">Total Pembayaran</td>
          <td className="p-3 text-right text-primary-blueDark">
            {/* DATA DINAMIS */}
            Rp{total.toLocaleString('id-ID')}
          </td>
        </tr>
        </tfoot>
      </table>
    </div>
);

const ReceiptSignature = ({ paymentDate }: { paymentDate: string }) => (
    <div className="p-6 mt-12 text-sm text-primary-brown">
      <div className="flex justify-between mb-16">
        <div>
          {/* DATA DINAMIS */}
          <div>Bogor, {paymentDate}</div>
          <div className="font-semibold mt-2">Penerima</div>
        </div>
        <div>
          <div className="invisible">-</div>
          <div className="font-semibold mt-2">Tertanda</div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="font-bold">MAHASISWA SIMULASI</div>
        <div className="font-semibold">Bagian keuangan</div>
      </div>
    </div>
);