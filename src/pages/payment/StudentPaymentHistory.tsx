import React from "react";
import MainLayout from "../../components/layouts/MainLayout";
import { Calendar, RefreshCcw, Search } from "lucide-react";

const StudentPaymentHistory = () => {
  const transactionData = [
    {
      nama: "Praktikum Teknologi Multimedia",
      tanggal: "11 April 2025, 16:42:34",
      periode: "2024 Genap",
      metode: "SevimaPay",
      total: "Rp150.000",
      invoice: "INV/20242/0008779",
    },
    {
      nama: "SKS",
      tanggal: "25 Maret 2025, 08:57:11",
      periode: "2024 Genap",
      metode: "SevimaPay",
      total: "Rp2.100.000",
      invoice: "INV/20242/0008779",
    },
    {
      nama: "Ujian Akhir Semester",
      tanggal: "25 Maret 2025, 08:57:11",
      periode: "2024 Genap",
      metode: "SevimaPay",
      total: "Rp900.000",
      invoice: "INV/20242/0008779",
    },
    {
      nama: "Kerja Praktik",
      tanggal: "25 Maret 2025, 08:57:11",
      periode: "2024 Genap",
      metode: "SevimaPay",
      total: "Rp300.000",
      invoice: "INV/20242/0008779",
    },
    {
      nama: "SPP",
      tanggal: "12 Februari 2025, 08:08:19",
      periode: "2024 Genap",
      metode: "SevimaPay",
      total: "Rp2.000.000",
      invoice: "INV/20242/0008779",
    },
    {
      nama: "Praktikum Rekayasa Perangkat Lunak Lanjut",
      tanggal: "19 Oktober 2024, 09:08:19",
      periode: "2024 Ganjil",
      metode: "Bank Amanah Ummah",
      total: "Rp150.000",
      invoice: "INV/20242/0008779",
    },
    {
      nama: "Prak. Pemrograman Perangkat Bergerak",
      tanggal: "19 Oktober 2024, 09:08:19",
      periode: "2024 Ganjil",
      metode: "Bank Amanah Ummah",
      total: "Rp150.000",
      invoice: "INV/20242/0008779",
    },
  ];
  return (
    <MainLayout isGreeting={false} titlePage={"Riwayat Keuangan Mahasiswa"} className={""}>
      <InfoAlert />
      <div className="p-4 border w-full">
        <div className="flex justify-between items-center ">
          <div className="flex items-center ">
            <input
              type="text"
              className="text-[#444444] border-2 border-r-0 rounded text-sm w-[300px] py-1.5 px-3"
              placeholder="Cari Histori Pembayaran Anda Disini"
            />
            <div className="p-1.5 flex rounded relative bg-primary-green right-7">
              <Search className="cursor-pointer" color="#fff" size={22} />
            </div>
            <div className="p-1.5 flex rounded relative bg-[#3850C9] right-7">
              <RefreshCcw className="cursor-pointer" color="#fff" size={22} />
            </div>
          </div>
          <div className="flex items-center ">
            <select className="text-[#444444] border-2 border-r-0 rounded text-sm w-[300px] py-1.5 px-3">
              <option value="">Berdasarkan Tagihan</option>
            </select>
          </div>
          <div className="flex items-center">
            <Calendar
              className="border-2 border-r-0"
              color="#FDA31B"
              size={36}
            />
            <select className="text-[#444444] border-2 border-r-0 rounded text-sm w-[300px] py-1.5 px-3">
              <option value="">Pilih Tanggal Transaksi</option>
            </select>
          </div>
        </div>
      </div>
      <div className="p-6 bg-white space-y-6 mt-4">
        {transactionData.map((item, index) => (
          <>
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h2 className="font-semibold">{item.nama}</h2>
                <span className="text-green-700 bg-green-100 text-xs px-3 py-1 rounded">
                  Berhasil
                </span>
              </div>
              <h2 className="text-[#444]">{item.invoice}</h2>
            </div>
            <div className="flex justify-between items-center">
              {/* Item List Komponennya ada di bawah ya :) */}
              <ItemList title={"Tanggal Pembayaran"} data={item.tanggal} />
              <ItemList title={"Periode Pembayaran"} data={item.periode} />
              <ItemList title={"Metode Pembayaran"} data={item.metode} />
              <ItemList title={"Total Pembayaran"} data={item.total} />
              <div>
                <button className="py-2 rounded px-4 cursor-pointer bg-[#00A65A] text-white">
                  Detail Transaksi
                </button>
              </div>
            </div>
          </>
        ))}
      </div>
    </MainLayout>
  );
};

const InfoAlert = () => {
  return (
    <div className="bg-green-100 text-green-700 font-semibold p-4 rounded-md mt-4 mb-6 text-sm">
      Yeay , Sekarang kamu bisa melihat riwayat pembayaran berdasarkan invoice
      atau kategori pembayaran
    </div>
  );
};

const ItemList = ({ title, data }) => {
  return (
    <div>
      <h1 className="text-[#444] italic font-semibold">{title}</h1>
      <h1 className="font-semibold">{data}</h1>
    </div>
  );
};

export default StudentPaymentHistory;
