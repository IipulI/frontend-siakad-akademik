import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useLaporanPerkuliahan } from "../../../hooks/useNilaiPerkuliahan";

const LogoUika = "/img/logo_uika.png";

// Halaman cetak/pratinjau mandiri (tanpa MainLayout) -- dibuka di tab baru saat
// klik "Cetak Nilai Perkuliahan" di dropdown Aksi tab Nilai Perkuliahan.
export default function LaporanNilaiPerkuliahan() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useLaporanPerkuliahan(id!, !!id);

  const handleCetak = () => window.print();
  const handleKembali = () => window.close();

  const tanggalCetak = new Date().toLocaleString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="no-print sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <p className="font-semibold text-gray-700">Laporan Nilai Perkuliahan Mahasiswa</p>
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
              <h2 className="font-bold uppercase">Laporan Nilai Perkuliahan Mahasiswa</h2>
              <p>Program Studi {data.programStudi.jenjang} {data.programStudi.nama}</p>
              <p>Periode {data.periode.nama}</p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-1 mb-4">
              <div className="flex"><span className="w-32 shrink-0">Mata kuliah</span><span>: {data.mataKuliah.nama}</span></div>
              <div className="flex"><span className="w-32 shrink-0">Nama Kelas</span><span>: {data.kelas.nama}</span></div>
              <div className="flex"><span className="w-32 shrink-0">Kelas / Kelompok</span><span>:</span></div>
              <div className="flex"><span className="w-32 shrink-0">SKS</span><span>: {data.mataKuliah.sks}</span></div>
              <div className="flex"><span className="w-32 shrink-0">Kode Mata kuliah</span><span>: {data.mataKuliah.kode}</span></div>
            </div>

            <table className="w-full border-collapse border border-gray-400 text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-1.5 border border-gray-400">No</th>
                  <th className="p-1.5 border border-gray-400">NIM</th>
                  <th className="p-1.5 border border-gray-400">Nama Mahasiswa</th>
                  {(data.komponenEvaluasi || []).map((k) => (
                    <th key={k.id} className="p-1.5 border border-gray-400">{k.labelKolom}</th>
                  ))}
                  <th className="p-1.5 border border-gray-400">Nilai</th>
                  <th className="p-1.5 border border-gray-400">Grade</th>
                  <th className="p-1.5 border border-gray-400">Lulus</th>
                  <th className="p-1.5 border border-gray-400">Sunting KRS?</th>
                  <th className="p-1.5 border border-gray-400">Info</th>
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
                    <td className="p-1.5 border border-gray-400 text-center">{m.grade}</td>
                    <td className="p-1.5 border border-gray-400 text-center">{m.lulus ? "✔" : ""}</td>
                    <td className="p-1.5 border border-gray-400"></td>
                    <td className="p-1.5 border border-gray-400"></td>
                  </tr>
                ))}
                {data.rataRataKelas && (
                  <tr className="font-semibold bg-gray-50">
                    <td className="p-1.5 border border-gray-400" colSpan={3}>Rata-rata nilai kelas</td>
                    {(data.komponenEvaluasi || []).map((k) => (
                      <td key={k.id} className="p-1.5 border border-gray-400 text-center">
                        {data.rataRataKelas?.rataPerKomponen[k.label]?.toFixed(2) ?? "-"}
                      </td>
                    ))}
                    <td className="p-1.5 border border-gray-400 text-center">{data.rataRataKelas.rataNilaiAkhir.toFixed(2)}</td>
                    <td className="p-1.5 border border-gray-400" colSpan={3}></td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="mt-3 border border-gray-400 p-2 text-xs">
              Tanggal Cetak : {tanggalCetak}
            </div>

            <div className="mt-6 flex justify-end">
              <div className="text-center w-56">
                <p>Paraf Dosen :</p>
                <div className="h-16"></div>
                <p className="font-semibold">{(data.dosen || [])[0]?.nama || "-"}</p>
              </div>
            </div>
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
