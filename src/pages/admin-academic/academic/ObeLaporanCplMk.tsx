import React from "react";
import { useParams } from "react-router-dom";
import { Printer } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useLaporanCplMk } from "../../../hooks/academic/useObeMatriksCplMk";

// Halaman cetak/pratinjau mandiri (tanpa MainLayout) -- dibuka di tab baru
// saat klik "Cetak Laporan" di halaman Pemetaan CPL -> MK.
export default function ObeLaporanCplMk() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useLaporanCplMk(id!, !!id);

  const handleCetak = () => window.print();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="no-print sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <p className="font-semibold text-gray-700">Laporan Pemetaan CPL &rarr; MK</p>
          <button onClick={handleCetak} className="bg-primary-blueSoft text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
            <Printer size={16} /> Cetak
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {isLoading || !data ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm">
            <h3 className="text-lg font-bold text-center underline mb-4">Laporan Pemetaan CPL &rarr; MK</h3>
            <div className="flex justify-between text-sm mb-4">
              <p>
                <span className="font-semibold">Program Studi:</span> &nbsp; {data.header.programStudi}
              </p>
              <p>
                <span className="font-semibold">Tahun Kurikulum:</span> &nbsp; {data.header.tahunKurikulum}
              </p>
            </div>

            <table className="w-full border-collapse border border-gray-400 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border border-gray-400 w-12">No.</th>
                  <th className="p-2 border border-gray-400">Kode CPL</th>
                  <th className="p-2 border border-gray-400">Kode MK</th>
                  <th className="p-2 border border-gray-400">Kode CPMK</th>
                  <th className="p-2 border border-gray-400">Bobot</th>
                  <th className="p-2 border border-gray-400">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((cplGroup, cplIdx) => {
                  const totalRowsForCpl = cplGroup.mks.reduce((sum, mk) => sum + mk.cpmks.length, 0) || 1;
                  let cplRendered = false;
                  return cplGroup.mks.length === 0 ? (
                    <tr key={cplIdx}>
                      <td className="p-2 border border-gray-400 text-center">{cplIdx + 1}.</td>
                      <td className="p-2 border border-gray-400">{cplGroup.kodeCpl}</td>
                      <td className="p-2 border border-gray-400 text-gray-400" colSpan={3}>
                        Belum ada pemetaan
                      </td>
                      <td className="p-2 border border-gray-400 text-center">0,00</td>
                    </tr>
                  ) : (
                    cplGroup.mks.map((mk, mkIdx) =>
                      mk.cpmks.map((cpmk, cpmkIdx) => {
                        const isFirstMkRow = cpmkIdx === 0;
                        const isFirstCplRow = !cplRendered;
                        if (isFirstCplRow) cplRendered = true;
                        return (
                          <tr key={`${mkIdx}-${cpmkIdx}`}>
                            {isFirstCplRow && (
                              <>
                                <td className="p-2 border border-gray-400 text-center align-top" rowSpan={totalRowsForCpl}>
                                  {cplIdx + 1}.
                                </td>
                                <td className="p-2 border border-gray-400 align-top" rowSpan={totalRowsForCpl}>
                                  {cplGroup.kodeCpl}
                                </td>
                              </>
                            )}
                            {isFirstMkRow && (
                              <td className="p-2 border border-gray-400 align-top" rowSpan={mk.cpmks.length}>
                                {mk.kodeMk}
                              </td>
                            )}
                            <td className="p-2 border border-gray-400">{cpmk.kodeCpmk || "-"}</td>
                            <td className="p-2 border border-gray-400 text-right">{cpmk.bobot.toFixed(2).replace(".", ",")}</td>
                            {isFirstCplRow && (
                              <td className="p-2 border border-gray-400 text-right align-top" rowSpan={totalRowsForCpl}>
                                {cplGroup.total.toFixed(2).replace(".", ",")}
                              </td>
                            )}
                          </tr>
                        );
                      })
                    )
                  );
                })}
                {data.data.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-400 italic">
                      Belum ada data pemetaan CPL ke MK.
                    </td>
                  </tr>
                )}
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
