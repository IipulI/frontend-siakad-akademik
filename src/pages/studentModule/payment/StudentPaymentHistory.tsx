import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../components/layouts/MainLayout';
import { useHistoriTagihan } from '../../../hooks/mahasiswa/useKeuanganMahasiswa';
import { Calendar, RefreshCcw, Search } from 'lucide-react';
import { StudentRoute } from '../../../types/VarRoutes'; // Sesuaikan dengan path konstanta route Anda

const StudentPaymentHistory = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');

  const { data: historiTagihan = [], isLoading, isError } = useHistoriTagihan({
    keyword,
    namaPeriode: selectedPeriod,
  });

  const detailTransaction = (invoiceId: string) => {
    navigate(`${StudentRoute.payment.paymentDetailHistory}/${invoiceId}`);
  };

  const ItemList = ({ title, data }: { title: string; data: string | null }) => (
      <div>
        <h1 className="text-[#444] italic text-xs sm:text-sm font-semibold">{title}</h1>
        <h1 className="font-semibold text-xs sm:text-sm">{data || '-'}</h1>
      </div>
  );

  return (
      <MainLayout isGreeting={false} titlePage="Riwayat Keuangan Mahasiswa">
        {/* Bagian Filter */}
        <div className="p-4 border w-full bg-white rounded-md">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex">
              <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="border-2 rounded text-sm py-1.5 px-3"
                  placeholder="Cari histori..."
              />
              {/* Anda bisa menambahkan tombol search di sini jika diperlukan */}
            </div>
            <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border-2 rounded text-sm py-1.5 px-5"
            >
              <option value="">Semua Periode</option>
              <option value="2024 Genap">2024 Genap</option>
              <option value="2024 Ganjil">2024 Ganjil</option>
              {/* Tambahkan periode lain jika ada */}
            </select>
          </div>
        </div>

        {/* Bagian Daftar Transaksi */}
        <div className="p-6 bg-white space-y-6 mt-4 rounded-md">
          {isLoading && <p className="text-center">Memuat riwayat...</p>}
          {isError && <p className="text-center text-red-500">Gagal memuat riwayat.</p>}
          {!isLoading && !isError && historiTagihan.length === 0 && (
              <p className="text-center text-gray-500">Tidak ada riwayat transaksi ditemukan.</p>
          )}
          {historiTagihan.map((item) => (
              <div key={item.kodeInvoice} className="border-b-2 border-dashed pb-6 last:border-b-0">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-4">
                    <h2 className="font-semibold text-sm">{item.namaTagihan}</h2>
                    <span className="text-green-700 bg-green-100 text-xs px-3 py-1 rounded-full">
                  Berhasil
                </span>
                  </div>
                  <h2 className="text-gray-500 text-sm">{item.kodeInvoice}</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                  <ItemList title={"Tanggal Pembayaran"} data={item.tanggalBayar} />
                  <ItemList title={"Periode Pembayaran"} data={item.namaPeriode} />
                  <ItemList title={"Metode Pembayaran"} data={item.metodeBayar} />
                  <ItemList
                      title={"Total Pembayaran"}
                      data={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.nominalTagihan)}
                  />
                  <div className="col-span-2 md:col-span-1 flex justify-end">
                    <button
                        onClick={() => detailTransaction(item.kodeInvoice)}
                        className="py-2 text-sm rounded px-4 cursor-pointer bg-primary-green text-white"
                    >
                      Detail Transaksi
                    </button>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </MainLayout>
  );
};

export default StudentPaymentHistory;