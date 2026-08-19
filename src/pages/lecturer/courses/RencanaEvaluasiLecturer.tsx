import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Save, X, Edit, AlertCircle } from "lucide-react";
import { LecturerRoute } from "../../../types/VarRoutes";
import SidebarCourseLecturer from "../../../components/lecturer/SidebarCourseLecturer";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useCourseDetail, useCourseRencanaEvaluasi } from "../../../hooks/lecturer/useFetchCourse";
import { useSaveRencanaEvaluasi, SaveEvaluasiListItem } from "../../../hooks/academic/useObeRencanaEvaluasi";

export default function RencanaEvaluasiLecturer() {
  const navigate = useNavigate();
  const { mataKuliahId } = useParams<{ mataKuliahId: string }>();

  const { data: detail, isLoading: isCourseLoading } = useCourseDetail(mataKuliahId || "");
  const d = detail?.data;
  const isKoordinator = !!d?.isKoordinator;

  const { data: re, isLoading: isReLoading, refetch: refetchRe } = useCourseRencanaEvaluasi(mataKuliahId || "");
  const resp = re?.data || {};
  const masterCpmk: any[] = resp.masterCpmk || [];
  const periodeId: string | undefined = resp.periodeTerpilihId;

  const saveMutation = useSaveRencanaEvaluasi();

  const [isEditMode, setIsEditMode] = useState(false);
  const [rows, setRows] = useState<SaveEvaluasiListItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const flattenCpmk = (list: any[]): any[] =>
    list.flatMap((c) => [{ id: c.id, kode: c.kode }, ...((c.subCpmk || []).map((s: any) => ({ id: s.id, kode: s.kode })))]);
  const cpmkOptions = flattenCpmk(masterCpmk);

  useEffect(() => {
    setRows(
      (resp.rencanaEvaluasi || []).map((e: any) => ({
        metodeEvaluasi: e.metodeEvaluasi,
        jenisEvaluasi: e.jenisEvaluasi,
        bobotEvaluasi: e.bobotEvaluasi,
        syaratLulus: e.syaratLulus,
        cpmkData: Object.entries(e.mappingBobotCpmk || {}).map(([cpmkId, bobotCpmk]) => ({ cpmkId, bobotCpmk: bobotCpmk as number })),
      }))
    );
  }, [re]);

  const isLoading = isCourseLoading || isReLoading;
  const handleBack = () => navigate(LecturerRoute.courses.detailCourse);

  const addRow = () => {
    setRows((prev) => [...prev, { metodeEvaluasi: "", jenisEvaluasi: "", bobotEvaluasi: 0, syaratLulus: "TIDAK_MENJADI_SYARAT_LULUS", cpmkData: [] }]);
  };
  const removeRow = (idx: number) => setRows((prev) => prev.filter((_, i) => i !== idx));
  const updateRow = (idx: number, patch: Partial<SaveEvaluasiListItem>) =>
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  const toggleCpmkBobot = (idx: number, cpmkId: string) => {
    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== idx) return r;
        const has = r.cpmkData.some((c) => c.cpmkId === cpmkId);
        return {
          ...r,
          cpmkData: has ? r.cpmkData.filter((c) => c.cpmkId !== cpmkId) : [...r.cpmkData, { cpmkId, bobotCpmk: 0 }],
        };
      })
    );
  };
  const setCpmkBobot = (idx: number, cpmkId: string, bobot: number) => {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, cpmkData: r.cpmkData.map((c) => (c.cpmkId === cpmkId ? { ...c, bobotCpmk: bobot } : c)) } : r))
    );
  };

  const totalBobot = rows.reduce((s, r) => s + (Number(r.bobotEvaluasi) || 0), 0);

  const handleSave = () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (!periodeId) {
      setErrorMessage("Periode akademik tidak diketahui, tidak bisa disimpan lewat menu ini.");
      return;
    }
    saveMutation.mutate(
      { mataKuliahId: mataKuliahId!, siakPeriodeAkademikId: periodeId, evaluasiList: rows },
      {
        onSuccess: () => {
          setSuccessMessage("Rencana Evaluasi berhasil disimpan.");
          setIsEditMode(false);
          refetchRe();
        },
        onError: (error: any) => setErrorMessage(error?.response?.data?.message || "Gagal menyimpan Rencana Evaluasi."),
      }
    );
  };

  return (
    <MainLayout isGreeting={false} titlePage="Rencana Evaluasi">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px] flex items-center justify-between">
          <p className="text-gray-500 text-sm">Dosen &gt; Perkuliahan &gt; Mata Kuliah &gt; Rencana Evaluasi</p>
          <div className="flex gap-2">
            <button onClick={handleBack} className="bg-primary-blueSoft text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
              <ArrowLeft size={15} /> Kembali
            </button>
            {isKoordinator && !isEditMode && (
              <button onClick={() => setIsEditMode(true)} className="bg-primary-yellow text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
                <Edit size={15} /> Ubah Data
              </button>
            )}
            {isKoordinator && isEditMode && (
              <>
                <button onClick={handleSave} disabled={saveMutation.isPending} className="bg-primary-green text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50">
                  <Save size={15} /> {saveMutation.isPending ? "Menyimpan..." : "Simpan"}
                </button>
                <button onClick={() => setIsEditMode(false)} className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
                  <X size={15} /> Batal
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <SidebarCourseLecturer mataKuliahId={mataKuliahId || ""} activeTab="rencanaEvaluasi" />

            <div className="w-full md:w-[80%]">
              {isLoading ? (
                <div className="flex justify-center p-12">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  {!isKoordinator && (
                    <div className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-3 rounded-md mb-6 flex items-start gap-3 text-sm font-medium">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p>Anda cuma bisa melihat Rencana Evaluasi mata kuliah ini -- yang bisa mengubah cuma Koordinator Mata Kuliah ({d?.koordinatorMataKuliah?.label || "belum ditentukan"}).</p>
                    </div>
                  )}
                  {errorMessage && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>}
                  {successMessage && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{successMessage}</div>}

                  <div className="overflow-x-auto border border-gray-200 rounded-sm mb-3">
                    <table className="min-w-full bg-white border-collapse text-sm">
                      <thead>
                        <tr className="bg-primary-green text-white text-xs uppercase font-bold text-center">
                          <th className="p-2 border border-gray-300 w-32">Metode</th>
                          <th className="p-2 border border-gray-300 w-40">Jenis Evaluasi</th>
                          <th className="p-2 border border-gray-300 w-20">Bobot</th>
                          <th className="p-2 border border-gray-300 text-left">CPMK Diuji</th>
                          {isEditMode && <th className="p-2 border border-gray-300 w-16">Aksi</th>}
                        </tr>
                      </thead>
                      <tbody className="text-gray-700">
                        {rows.length === 0 ? (
                          <tr>
                            <td colSpan={isEditMode ? 5 : 4} className="p-6 text-center text-gray-400 italic">
                              Belum ada komponen evaluasi untuk mata kuliah ini.
                            </td>
                          </tr>
                        ) : (
                          rows.map((row, idx) => (
                            <tr key={idx} className="border-b border-gray-200">
                              <td className="p-2 border border-gray-200">
                                {isEditMode ? (
                                  <input value={row.metodeEvaluasi} onChange={(e) => updateRow(idx, { metodeEvaluasi: e.target.value })} className="w-full border border-gray-300 rounded p-1" />
                                ) : row.metodeEvaluasi}
                              </td>
                              <td className="p-2 border border-gray-200">
                                {isEditMode ? (
                                  <input value={row.jenisEvaluasi} onChange={(e) => updateRow(idx, { jenisEvaluasi: e.target.value })} className="w-full border border-gray-300 rounded p-1" />
                                ) : row.jenisEvaluasi}
                              </td>
                              <td className="p-2 border border-gray-200 text-center">
                                {isEditMode ? (
                                  <input type="number" value={row.bobotEvaluasi} onChange={(e) => updateRow(idx, { bobotEvaluasi: Number(e.target.value) })} className="w-16 border border-gray-300 rounded p-1" />
                                ) : `${row.bobotEvaluasi}%`}
                              </td>
                              <td className="p-2 border border-gray-200 text-xs">
                                {isEditMode ? (
                                  <div className="flex flex-wrap gap-2">
                                    {cpmkOptions.map((c) => {
                                      const found = row.cpmkData.find((x) => x.cpmkId === c.id);
                                      return (
                                        <label key={c.id} className="flex items-center gap-1">
                                          <input type="checkbox" checked={!!found} onChange={() => toggleCpmkBobot(idx, c.id)} />
                                          {c.kode}
                                          {found && (
                                            <input
                                              type="number"
                                              value={found.bobotCpmk}
                                              onChange={(e) => setCpmkBobot(idx, c.id, Number(e.target.value))}
                                              className="w-14 border border-gray-300 rounded p-0.5 ml-1"
                                            />
                                          )}
                                        </label>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  row.cpmkData.map((c) => cpmkOptions.find((o) => o.id === c.cpmkId)?.kode || c.cpmkId).join(", ") || "-"
                                )}
                              </td>
                              {isEditMode && (
                                <td className="p-2 border border-gray-200 text-center">
                                  <button onClick={() => removeRow(idx)} className="bg-red-500 text-white p-1.5 rounded hover:opacity-90">
                                    <Trash2 size={13} />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {isEditMode ? (
                    <button onClick={addRow} className="bg-primary-green text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
                      <Plus size={15} /> Tambah Komponen
                    </button>
                  ) : null}

                  <p className={`mt-3 text-xs font-semibold ${totalBobot === 100 ? "text-green-600" : "text-orange-600"}`}>
                    Total bobot: {totalBobot}% {totalBobot !== 100 && "(harus 100%)"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}