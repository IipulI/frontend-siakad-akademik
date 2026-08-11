import React, { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import MainLayout from "../../../components/layouts/MainLayout";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Api } from "../../../api/Index";
import { getObeMataKuliah } from "../../../hooks/academic/useObeManagement";
import { useAcademicPeriods } from "../../../hooks/usePeriodeAkademik";
import { getRencanaEvaluasi } from "../../../hooks/academic/useObeRencanaEvaluasi";

export default function ObeCekSoal() {
  const [mkSearch, setMkSearch] = useState("");
  const [mataKuliahId, setMataKuliahId] = useState("");
  const [periodeId, setPeriodeId] = useState("");

  const { data: mkResponse } = getObeMataKuliah({ page: 1, limit: 50, search: mkSearch });
  const { data: periodeList } = useAcademicPeriods();
  const { data: reData, isLoading: isReLoading } = getRencanaEvaluasi(mataKuliahId, periodeId);

  const mkList: any[] = Array.isArray(mkResponse?.data) ? mkResponse.data : mkResponse?.data?.rows || mkResponse?.data?.data?.rows || [];
  const komponenList = reData?.rencanaEvaluasi || [];

  const soalQueries = useQueries({
    queries: komponenList.map((k) => ({
      queryKey: ["cekSoal", k.id],
      queryFn: async () => {
        const response = await Api.get(`/akademik/soal/komponen/${k.id}`);
        return (response.data.data?.daftarSoal || []) as any[];
      },
      enabled: !!mataKuliahId && !!periodeId && komponenList.length > 0,
    })),
  });

  const isLoadingSoal = soalQueries.some((q) => q.isLoading);

  return (
    <MainLayout isGreeting={false} titlePage="Cek Soal yang Sudah Ada (QA)">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Admin - Akademik &gt; Penilaian &amp; Monitoring OBE &gt; Cek Soal (QA)</p>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <p className="text-sm text-gray-600 mb-4">
            Diagnostik: cek jumlah soal per komponen evaluasi suatu mata kuliah/periode. Komponen yang sudah pakai Jalur D
            (CBT) seharusnya memiliki 0 soal di sini.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Mata Kuliah</label>
              <input type="text" value={mkSearch} onChange={(e) => setMkSearch(e.target.value)} placeholder="Cari mata kuliah" className="w-full border border-gray-300 rounded p-2 text-sm mb-2" />
              <select value={mataKuliahId} onChange={(e) => setMataKuliahId(e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm">
                <option value="">-- Pilih Mata Kuliah --</option>
                {mkList.map((mk: any) => (
                  <option key={mk.id} value={mk.id}>{mk.kode} - {mk.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Periode Akademik</label>
              <select value={periodeId} onChange={(e) => setPeriodeId(e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm">
                <option value="">-- Pilih Periode --</option>
                {(periodeList || []).map((p) => (
                  <option key={p.id} value={p.id}>{p.nama}</option>
                ))}
              </select>
            </div>
          </div>

          {!mataKuliahId || !periodeId ? (
            <div className="flex items-center justify-center h-32 border border-gray-200 rounded-md bg-gray-50">
              <p className="text-gray-500">Pilih Mata Kuliah dan Periode untuk mulai cek.</p>
            </div>
          ) : isReLoading || isLoadingSoal ? (
            <div className="flex justify-center p-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-sm">
              <table className="min-w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-700 text-white text-xs">
                    <th className="p-2 border">Metode</th>
                    <th className="p-2 border">Jenis</th>
                    <th className="p-2 border">Jumlah Soal</th>
                    <th className="p-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {komponenList.length > 0 ? (
                    komponenList.map((k, idx) => {
                      const jumlah = (soalQueries[idx]?.data || []).length;
                      return (
                        <tr key={k.id} className="text-center">
                          <td className="p-2 border">{k.metodeEvaluasi}</td>
                          <td className="p-2 border">{k.jenisEvaluasi}</td>
                          <td className="p-2 border font-semibold">{jumlah}</td>
                          <td className="p-2 border">
                            {jumlah === 0 ? (
                              <span className="text-yellow-600 flex items-center justify-center gap-1 text-xs">
                                <AlertTriangle size={14} /> 0 soal
                              </span>
                            ) : (
                              <span className="text-green-600 flex items-center justify-center gap-1 text-xs">
                                <CheckCircle2 size={14} /> Ada soal
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-gray-500 italic">Belum ada Rencana Evaluasi untuk MK/periode ini.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
