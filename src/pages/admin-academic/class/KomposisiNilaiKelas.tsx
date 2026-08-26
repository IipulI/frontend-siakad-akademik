import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { getDetailCollegeClass } from "../../../hooks/useKelasKuliah";
import { useKomposisiNilai } from "../../../hooks/useNilaiPerkuliahan";

const SYARAT_LULUS_LABEL: Record<string, string> = {
  TIDAK_MENJADI_SYARAT_LULUS: "-",
  MENJADI_SYARAT_LULUS: "Wajib Lulus",
  LULUS_DENGAN_NILAI_MINIMUM: "Nilai Minimum",
};

export default function KomposisiNilaiKelas() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: kelas, isLoading: isLoadingKelas } = getDetailCollegeClass(id!);
  const mataKuliahId = kelas?.mataKuliah?.id;
  const periodeId = kelas?.siakPeriodeAkademikId || kelas?.periodeAkademik?.id;

  const { data, isLoading } = useKomposisiNilai(mataKuliahId, periodeId, !!mataKuliahId && !!periodeId);

  const cpmkColumns = (data?.masterCpmk || []).flatMap((parent) => [
    { id: parent.id, kode: parent.kode },
    ...(parent.subCpmk || []).map((s) => ({ id: s.id, kode: s.kode })),
  ]);

  const totalBobot = (data?.rencanaEvaluasi || []).reduce((sum, e) => sum + (e.bobotEvaluasi || 0), 0);

  const pelaporanGroups: { basis: string; items: { komponen: string; bobot: number }[] }[] = [];
  (data?.rencanaEvaluasi || []).forEach((e) => {
    const [basis, komponen] = e.jenisEvaluasi.includes(" - ")
      ? e.jenisEvaluasi.split(" - ")
      : [e.jenisEvaluasi, "-"];
    let group = pelaporanGroups.find((g) => g.basis === basis);
    if (!group) {
      group = { basis, items: [] };
      pelaporanGroups.push(group);
    }
    group.items.push({ komponen, bobot: e.bobotEvaluasi });
  });

  const handleKembali = () => navigate(-1);

  return (
    <MainLayout isGreeting={false} titlePage="Komposisi Nilai Kelas">
      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Komposisi Nilai Kelas</h2>
          <button onClick={handleKembali} className="bg-primary-blueSoft text-white px-4 py-2 rounded flex items-center gap-1.5 hover:opacity-90">
            <ArrowLeft size={16} /> Kembali ke Nilai Perkuliahan
          </button>
        </div>

        {isLoadingKelas || isLoading || !data ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-2 bg-primary-green/10 p-4 md:grid-cols-2 mb-6">
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">Mata Kuliah:</span>
                <span className="w-full text-left">{data.mataKuliah.kode} - {data.mataKuliah.nama} ({data.mataKuliah.totalSks} SKS)</span>
              </div>
              <div className="flex justify-between md:ml-8">
                <span className="font-semibold w-full text-left">Nama Kelas:</span>
                <span className="w-full text-left">{kelas?.nama || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">Program Studi:</span>
                <span className="w-full text-left">{kelas?.programStudi?.nama || "-"}</span>
              </div>
              <div className="flex justify-between md:ml-8">
                <span className="font-semibold w-full text-left">Periode:</span>
                <span className="w-full text-left">{kelas?.periodeAkademik?.nama || "-"}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-primary-green border-b-2 border-primary-green pb-1 mb-3">Komponen Evaluasi</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-sm">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-primary-green text-white">
                      <th className="p-2 border border-gray-400">No.</th>
                      <th className="p-2 border border-gray-400 text-left">Metode Evaluasi</th>
                      <th className="p-2 border border-gray-400 text-left">Jenis Evaluasi</th>
                      {cpmkColumns.map((c) => (
                        <th key={c.id} className="p-2 border border-gray-400">{c.kode}</th>
                      ))}
                      <th className="p-2 border border-gray-400">Bobot Evaluasi</th>
                      <th className="p-2 border border-gray-400">Syarat Lulus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.rencanaEvaluasi || []).map((e, idx) => (
                      <tr key={e.id} className="text-center hover:bg-gray-50">
                        <td className="p-2 border border-gray-200">{idx + 1}</td>
                        <td className="p-2 border border-gray-200 text-left">{e.metodeEvaluasi}</td>
                        <td className="p-2 border border-gray-200 text-left">{e.jenisEvaluasi}</td>
                        {cpmkColumns.map((c) => (
                          <td key={c.id} className="p-2 border border-gray-200">
                            {e.mappingBobotCpmk?.[c.id] ?? "-"}
                          </td>
                        ))}
                        <td className="p-2 border border-gray-200">{e.bobotEvaluasi.toFixed(0)}%</td>
                        <td className="p-2 border border-gray-200">{SYARAT_LULUS_LABEL[e.syaratLulus] || "-"}</td>
                      </tr>
                    ))}
                    <tr className="font-bold bg-gray-50">
                      <td className="p-2 border border-gray-200" colSpan={3 + cpmkColumns.length}>
                        Total Persentase Komponen Evaluasi
                      </td>
                      <td className={`p-2 border border-gray-200 text-center ${totalBobot === 100 ? "text-green-600" : "text-red-600"}`}>
                        {totalBobot.toFixed(0)}%
                      </td>
                      <td className="p-2 border border-gray-200"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded text-xs">
                <span className="font-semibold">Keterangan:</span> Syarat Lulus Mata Kuliah adalah komponen nilai wajib. Mahasiswa yang tidak memiliki komponen ini akan dinyatakan tidak lulus Mata Kuliah.
              </div>
            </div>

            <div>
              <h3 className="font-bold text-primary-green border-b-2 border-primary-green pb-1 mb-3">Pelaporan Metode Evaluasi</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-sm">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-primary-green text-white">
                      <th className="p-2 border border-gray-400 w-10">No.</th>
                      <th className="p-2 border border-gray-400 text-left">Basis Evaluasi</th>
                      <th className="p-2 border border-gray-400 text-left">Komponen Evaluasi</th>
                      <th className="p-2 border border-gray-400">Bobot Evaluasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pelaporanGroups.length > 0 ? (
                      pelaporanGroups.map((group, gi) =>
                        group.items.map((item, ii) => (
                          <tr key={`${gi}-${ii}`} className="hover:bg-gray-50">
                            {ii === 0 && (
                              <>
                                <td className="p-2 border border-gray-200 text-center" rowSpan={group.items.length}>{gi + 1}</td>
                                <td className="p-2 border border-gray-200" rowSpan={group.items.length}>{group.basis}</td>
                              </>
                            )}
                            <td className="p-2 border border-gray-200">{item.komponen}</td>
                            <td className="p-2 border border-gray-200 text-right">{item.bobot ? `${item.bobot.toFixed(0)}%` : "-"}</td>
                          </tr>
                        ))
                      )
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-gray-400 italic">Belum ada rencana evaluasi untuk mata kuliah ini.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded text-xs">
                <span className="font-semibold">Keterangan:</span> Bobot metode evaluasi diambil dari total prosentase metode evaluasi yang ada pada rencana evaluasi.
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
