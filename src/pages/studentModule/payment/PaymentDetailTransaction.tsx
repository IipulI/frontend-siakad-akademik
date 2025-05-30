import React from "react";
import LogoUika from "../../../../public/img/logo_uika.png";
import { ArrowLeft, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StudentRoute } from "../../../types/VarRoutes";

const PaymentDetailTransaction = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen space-y-4">
      <div className="bg-white border-2 py-2">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="font-semibold">Bukti Pembayaran Transaksi</h1>
          <button className="flex items-center bg-[#004680] text-sm rounded text-white py-2 px-4 font-semibold space-x-2">
            <Printer color="#fff" />
            <h1>Cetak Pembayaran</h1>
          </button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(StudentRoute.payment.paymentHistory)}
          className="flex items-center space-x-2 bg-primary-yellow rounded py-2 px-4 text-white cursor-pointer"
        >
          <ArrowLeft color="#fff" />
          <h1>Kembali</h1>
        </button>
      </div>
      <div className="bg-white min-h-screen p-6 max-w-6xl mx-auto border-t-4 border-[#004680] border-b-4">
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-6 mb-6">
          <img src={LogoUika} alt="Logo" className="w-20 h-20 object-contain" />

          <div className="text-sm text-right text-gray-700">
            <p className="font-semibold">Jl KH Sholeh Iskandar KM 2</p>
            <p>Kedung Badak Bogor</p>
            <p>☎ 0251-8356884</p>
          </div>
        </div>

        {/* Judul */}
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Bukti Pembayaran
        </h2>

        {/* Informasi Umum */}
        <div className="flex justify-between text-sm text-gray-700 mb-6">
          <div>
            <p>
              No. Transaksi :{" "}
              <span className="text-blue-600 font-medium">
                PAY/20242/0002325
              </span>
            </p>
            <p>Periode Tagihan : 2024 Genap</p>
            <p>Tanggal Bayar : 26 Februari 2025</p>
            <p>Metode Bayar : Bank Amanah Ummah</p>
          </div>
          <div>
            <p>NIM : 221106042807</p>
            <p>Nama : MUHAMMAD RIDHO FATHAN</p>
            <p>Program Studi : S1 - Teknik Informatika</p>
            <p>Periode Masuk : 2022 Ganjil</p>
          </div>
        </div>

        {/* Tabel Pembayaran */}
        <table className="w-full border text-sm text-gray-700 mb-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border">Nama Tagihan</th>
              <th className="text-right px-4 py-2 border">Nominal</th>
              <th className="text-right px-4 py-2 border">Denda</th>
              <th className="text-right px-4 py-2 border">Potongan</th>
              <th className="text-right px-4 py-2 border">Sub Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border">
                Ujian Akhir Semester
                <br />
                <span className="text-xs text-gray-500">INV/20242/0008779</span>
              </td>
              <td className="px-4 py-2 border text-right">Rp900.000</td>
              <td className="px-4 py-2 border text-right">-</td>
              <td className="px-4 py-2 border text-right">-</td>
              <td className="px-4 py-2 border text-right">Rp900.000</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">
                SKS
                <br />
                <span className="text-xs text-gray-500">INV/20242/0008778</span>
              </td>
              <td className="px-4 py-2 border text-right">Rp2.100.000</td>
              <td className="px-4 py-2 border text-right">-</td>
              <td className="px-4 py-2 border text-right">-</td>
              <td className="px-4 py-2 border text-right">Rp2.100.000</td>
            </tr>
            <tr>
              <td className="px-4 py-2 border">
                Kerja Praktik
                <br />
                <span className="text-xs text-gray-500">INV/20242/0008782</span>
              </td>
              <td className="px-4 py-2 border text-right">Rp300.000</td>
              <td className="px-4 py-2 border text-right">-</td>
              <td className="px-4 py-2 border text-right">-</td>
              <td className="px-4 py-2 border text-right">Rp300.000</td>
            </tr>
          </tbody>
          <tfoot className="font-semibold bg-gray-50">
            <tr>
              <td className="px-4 py-2 border text-right" colSpan="4">
                Total Pembayaran
              </td>
              <td className="px-4 py-2 border text-right text-blue-700">
                Rp3.300.000
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Tanda Tangan */}
        <div className="flex justify-between text-sm text-gray-700 mt-12">
          <div className="text-center">
            <p>Bogor, 26 Februari 2025</p>
            <p className="mt-6 underline font-medium">MUHAMMAD RIDHO FATHAN</p>
            <p>Penerima</p>
          </div>
          <div className="text-center">
            <p className="mt-6 underline font-medium">Bagian keuangan</p>
            <p>Tertanda</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailTransaction;
