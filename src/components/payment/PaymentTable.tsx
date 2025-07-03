import React from 'react';
import { ChevronUp } from 'lucide-react';
import { ITagihan } from '../../types/mahasiswa.types';

// DIUBAH: Props disederhanakan, tidak ada lagi props untuk seleksi
interface PaymentTableProps {
  data: ITagihan[];
  total: number;
  loading: boolean;
  error: boolean;
  paymentOptions: Array<{ value: string; label: string }>;
  onProceed: () => void;
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

export default function PaymentTable({
                                       data,
                                       total,
                                       loading,
                                       error,
                                       onProceed,
                                       paymentOptions,
                                       selectedMethod,
                                       onMethodChange,
                                     }: PaymentTableProps) {

  if (loading) return <p className="text-center py-8">Memuat data tagihan...</p>;
  if (error) return <p className="text-center py-8 text-red-500">Gagal memuat data tagihan.</p>;

  return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Kolom Kiri: Tabel Tagihan */}
        <div className="bg-white rounded-md shadow-sm p-6 col-span-1 lg:col-span-3">
          <table className="w-full text-sm">
            <thead>
            <tr className="border-b">
              {/* DIUBAH: Kolom checkbox dihapus */}
              <th className="text-left py-3 text-primary-green">Nama Tagihan</th>
              <th className="text-left py-3 text-primary-green">Potongan</th>
              <th className="text-left py-3 text-primary-green">Denda</th>
              <th className="text-right py-3 text-primary-green">Tagihan</th>
            </tr>
            </thead>
            <tbody>
            {data.map((item) => (
                <tr key={item.kodeInvoice} className="border-b last:border-b-0">
                  {/* DIUBAH: Kolom checkbox dihapus */}
                  <td className="py-4">
                    <div>{item.namaTagihan}</div>
                    <div className="text-xs text-gray-500">
                      (Tenggat: {item.tanggalTenggat})
                    </div>
                  </td>
                  <td className="py-4">-</td>
                  <td className="py-4">-</td>
                  <td className="py-4 text-right font-medium">
                    Rp {item.nominalTagihan.toLocaleString('id-ID')}
                  </td>
                </tr>
            ))}
            </tbody>
            <tfoot>
            <tr>
              <td colSpan={3} className="py-4 font-semibold text-base">
                Total Tagihan
              </td>
              <td className="py-4 text-right font-bold text-base">
                Rp {total.toLocaleString('id-ID')}
              </td>
            </tr>
            </tfoot>
          </table>
        </div>

        {/* Kolom Kanan: Rincian */}
        <div className="col-span-1 lg:col-span-2 space-y-4">
          <div className="bg-white rounded-md shadow-sm p-6 flex flex-col">
            <label className="font-semibold text-sm mb-2" htmlFor="paymentMethod">
              Pilih Metode Pembayaran
            </label>
            <select
                id="paymentMethod"
                className="border-2 py-2 px-4 w-full text-primary-brown rounded"
                value={selectedMethod}
                onChange={(e) => onMethodChange(e.target.value)}
            >
              <option value="" disabled>Pilih Metode Pembayaran</option>
              {paymentOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
              ))}
            </select>
          </div>
          <div className="bg-white rounded-md shadow-sm p-6 flex flex-col space-y-6">
            <span className="font-semibold">Rincian Pembayaran</span>
            <div className="space-y-1">
              <h1 className="font-semibold text-sm">Detail Pembayaran</h1>
              {/* DIUBAH: Rincian sekarang menampilkan SEMUA item dari props 'data' */}
              {data.length > 0 ? (
                  data.map(item => (
                      <div key={item.kodeInvoice} className="flex justify-between items-center italic text-primary-brown text-sm">
                        <span>{item.namaTagihan}</span>
                        <span>Rp {item.nominalTagihan.toLocaleString('id-ID')}</span>
                      </div>
                  ))
              ) : (
                  <p className="italic text-gray-400 text-sm">Tidak ada tagihan aktif.</p>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2 font-semibold">
                <h1>Total Tagihan</h1>
              </div>
              <div className="flex justify-between items-center text-primary-brown mt-2">
                <div className="flex items-center space-x-2 italic text-primary-brown text-sm">
                  <label htmlFor="total">Total Tagihan yang Telah Diakumulasi</label>
                </div>
                <span className="font-semibold text-primary-yellow">
                Rp {total.toLocaleString('id-ID')}
              </span>
              </div>
            </div>
            <button
                onClick={onProceed}
                disabled={data.length === 0}
                className="w-full bg-primary-green text-white font-bold py-3 rounded-md mt-4
                       hover:bg-green-700 transition-colors
                       disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Lanjutkan Pembayaran
            </button>
          </div>
        </div>
      </div>
  );
}