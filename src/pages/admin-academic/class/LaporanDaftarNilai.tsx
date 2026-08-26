import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useLaporanDaftarNilai } from "../../../hooks/useNilaiPerkuliahan";

const LogoUika = "/img/logo_uika.png";

// Halaman cetak/pratinjau mandiri (tanpa MainLayout) -- dibuka di tab baru saat
// klik "Cetak Nilai Mahasiswa" di dropdown Aksi tab Nilai Perkuliahan.
export default function LaporanDaftarNilai() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useLaporanDaftarNilai(id!, !!id);

  const handleCetak = () => window.print();
  const handleKembali = () => window.close();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="no-print sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <p className="font-semibold text-gray-700">Laporan Daftar Nilai Mahasiswa</p>
          <div className="flex gap-2">
            <button onClick={handleKembali} className="bg-primary-blueSoft text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
              <ArrowLeft size={16} /> Kembali ke Daftar
            </button>
            <button onClick={handleCetak} className="bg-primary-blueDark text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
              <Printer size={16} /> Cetak
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {isLoading || !data ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-sm shadow-sm text-sm">
            <div className="flex items-center gap-4 border-b-2 border-gray-800 pb-3 mb-4">
              <img src={LogoUika} width={64} alt="Logo UIKA" />
              <div className="text-center flex-1">
                <h1 className="text-xl font-bold">UNIVERSITAS IBN KHALDUN BOGOR</h1>
                <p className="text-xs text-gray-600">Jl KH Sholeh Iskandar KM 2 Kedung Badak Bogor</p>
                <p className="text-xs text-gray-600">Website :uika-bogor.ac.id/ e-Mail :mail@uika-bogor.ac.id / Telepon :0251-8356884</p>
              </div>
            </div>

            <div className="text-center mb-4">
              <h2 className="font-bold uppercase">Laporan Daftar Nilai Mahasiswa</h2>
              <p>Program Studi {data.programStudi.jenjang} {data.programStudi.nama}</p>
              <p>Periode {data.periode.nama}</p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mb-4">
              <div className="flex"><span className="w-24 shrink-0">Mata kuliah</span><span>: {data.mataKuliah.nama}</span></div>
              <div className="flex"><span className="w-24 shrink-0">Nama Kelas</span><span>: {data.kelas.nama}</span></div>
              <div className="flex"><span className="w-24 shrink-0">Pengajar</span><span>: {(data.dosen || []).map((d) => d.nama).join(", ") || "-"}</span></div>
              <div className="flex"><span className="w-24 shrink-0">Sistem Kuliah</span><span>: {data.kelas.sistemKuliah}</span></div>
            </div>

            <table className="w-full border-collapse border border-gray-400 text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-1.5 border border-gray-400">No</th>
                  <th className="p-1.5 border border-gray-400">NIM</th>
                  <th className="p-1.5 border border-gray-400">NAMA</th>
                  {(data.komponenEvaluasi || []).map((k) => (
                    <th key={k.id} className="p-1.5 border border-gray-400">{k.labelKolom}</th>
                  ))}
                  <th className="p-1.5 border border-gray-400">NILAI</th>
                  <th className="p-1.5 border border-gray-400">NILAI ANGKA</th>
                  <th className="p-1.5 border border-gray-400">NILAI HURUF</th>
                  <th className="p-1.5 border border-gray-400">KET.</th>
                </tr>
              </thead>
              <tbody>
                {(data.mahasiswa || []).map((m) => (
                  <tr key={m.rincianKrsId}>
                    <td className="p-1.5 border border-gray-400 text-center">{m.no}</td>
                    <td className="p-1.5 border border-gray-400">{m.nim}</td>
                    <td className="p-1.5 border border-gray-400">{m.nama}</td>
                    {(data.komponenEvaluasi || []).map((k) => (
                      <td key={k.id} className="p-1.5 border border-gray-400 text-center">
                        {m.nilaiPerKomponen?.[k.label] ?? "-"}
                      </td>
                    ))}
                    <td className="p-1.5 border border-gray-400 text-center">{m.nilaiAkhir.toFixed(2)}</td>
                    <td className="p-1.5 border border-gray-400 text-center">{m.nilaiAngka.toFixed(2)}</td>
                    <td className="p-1.5 border border-gray-400 text-center">{m.nilaiHuruf}</td>
                    <td className="p-1.5 border border-gray-400"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}
