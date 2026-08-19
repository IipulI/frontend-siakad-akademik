import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertCircle, Save, Edit, X, Plus, Trash2 } from "lucide-react";
import { LecturerRoute } from "../../../types/VarRoutes";
import SidebarCourseLecturer from "../../../components/lecturer/SidebarCourseLecturer";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useCourseDetail } from "../../../hooks/lecturer/useFetchCourse";
import { getPemetaanCpmk, useSavePemetaanCpmk, SaveCpmkListItem } from "../../../hooks/academic/useObeCpmkMk";

interface SubForm {
  kode: string;
  deskripsi: string;
  cplPemetaan: { idCpl: string; bobotCpl: number }[];
}
interface CpmkForm {
  kode: string;
  deskripsi: string;
  target: number;
  bobot: number;
  cplPemetaan: { idCpl: string; bobotCpl: number }[];
  subCpmk: SubForm[];
}

export default function PemetaanCpmkLecturer() {
  const navigate = useNavigate();
  const { mataKuliahId } = useParams<{ mataKuliahId: string }>();

  const { data: detail, isLoading: isCourseLoading } = useCourseDetail(mataKuliahId || "");
  const d = detail?.data;
  const isKoordinator = !!d?.isKoordinator;

  const { data: cpmkData, isLoading: isCpmkLoading, refetch: refetchCpmk } = getPemetaanCpmk(mataKuliahId || "");
  const saveMutation = useSavePemetaanCpmk();
  const cplHeaders = cpmkData?.cplHeaders || [];

  const [isEditMode, setIsEditMode] = useState(false);
  const [levelPemetaan, setLevelPemetaan] = useState<"CPMK" | "Sub-CPMK">("CPMK");
  const [metodePembobotan, setMetodePembobotan] = useState<"Manual" | "Otomatis">("Manual");
  const [rows, setRows] = useState<CpmkForm[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const buildFromData = () => {
    setLevelPemetaan(cpmkData?.levelPemetaan || "CPMK");
    setMetodePembobotan(cpmkData?.metodePembobotan || "Manual");
    setRows(
      (cpmkData?.cpmkData || []).map((c: any) => ({
        kode: c.kode,
        deskripsi: c.deskripsi,
        target: c.target,
        bobot: c.bobot || 0,
        cplPemetaan: (c.cplPemetaan || []).map((p: any) => ({ idCpl: p.idCpl || p.cplId, bobotCpl: p.bobotCpl ?? p.bobot ?? 0 })),
        subCpmk: (c.subCpmk || []).map((s: any) => ({
          kode: s.kode,
          deskripsi: s.deskripsi,
          cplPemetaan: (s.cplPemetaan || []).map((p: any) => ({ idCpl: p.idCpl || p.cplId, bobotCpl: p.bobotCpl ?? p.bobot ?? 0 })),
        })),
      }))
    );
  };

  useEffect(() => {
    buildFromData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cpmkData]);

  const isLoading = isCourseLoading || isCpmkLoading;
  const handleBack = () => navigate(LecturerRoute.courses.detailCourse);

  const startEdit = () => {
    buildFromData();
    setIsEditMode(true);
    setErrorMessage("");
  };

  const addCpmk = () => setRows((prev) => [...prev, { kode: "", deskripsi: "", target: 60, bobot: 0, cplPemetaan: [], subCpmk: [] }]);
  const removeCpmk = (idx: number) => setRows((prev) => prev.filter((_, i) => i !== idx));
  const updateCpmk = (idx: number, patch: Partial<CpmkForm>) => setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

  const toggleCplCpmk = (idx: number, cplId: string) => {
    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== idx) return r;
        const has = r.cplPemetaan.some((p) => p.idCpl === cplId);
        return { ...r, cplPemetaan: has ? r.cplPemetaan.filter((p) => p.idCpl !== cplId) : [...r.cplPemetaan, { idCpl: cplId, bobotCpl: 0 }] };
      })
    );
  };
  const setCplBobotCpmk = (idx: number, cplId: string, bobot: number) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, cplPemetaan: r.cplPemetaan.map((p) => (p.idCpl === cplId ? { ...p, bobotCpl: bobot } : p)) } : r)));
  };

  const addSub = (idx: number) => setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, subCpmk: [...r.subCpmk, { kode: "", deskripsi: "", cplPemetaan: [] }] } : r)));
  const removeSub = (idx: number, subIdx: number) => setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, subCpmk: r.subCpmk.filter((_, si) => si !== subIdx) } : r)));
  const updateSub = (idx: number, subIdx: number, patch: Partial<SubForm>) =>
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, subCpmk: r.subCpmk.map((s, si) => (si === subIdx ? { ...s, ...patch } : s)) } : r)));
  const toggleCplSub = (idx: number, subIdx: number, cplId: string) => {
    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== idx) return r;
        return {
          ...r,
          subCpmk: r.subCpmk.map((s, si) => {
            if (si !== subIdx) return s;
            const has = s.cplPemetaan.some((p) => p.idCpl === cplId);
            return { ...s, cplPemetaan: has ? s.cplPemetaan.filter((p) => p.idCpl !== cplId) : [...s.cplPemetaan, { idCpl: cplId, bobotCpl: 0 }] };
          }),
        };
      })
    );
  };
  const setCplBobotSub = (idx: number, subIdx: number, cplId: string, bobot: number) => {
    setRows((prev) =>
      prev.map((r, i) =>
        i === idx
          ? { ...r, subCpmk: r.subCpmk.map((s, si) => (si === subIdx ? { ...s, cplPemetaan: s.cplPemetaan.map((p) => (p.idCpl === cplId ? { ...p, bobotCpl: bobot } : p)) } : s)) }
          : r
      )
    );
  };

  const handleSave = () => {
    setErrorMessage("");
    setSuccessMessage("");
    const cpmkList: SaveCpmkListItem[] = rows.map((r) => ({
      kode: r.kode,
      deskripsi: r.deskripsi,
      target: r.target,
      bobot: r.bobot,
      cplPemetaan: r.cplPemetaan,
      subCpmk: r.subCpmk,
    }));
    saveMutation.mutate(
      { mataKuliahId: mataKuliahId!, levelPemetaan, metodePembobotan, cpmkList },
      {
        onSuccess: () => {
          setSuccessMessage("Pemetaan CPMK berhasil disimpan.");
          setIsEditMode(false);
          refetchCpmk();
        },
        onError: (error: any) => setErrorMessage(error?.response?.data?.message || "Gagal menyimpan Pemetaan CPMK."),
      }
    );
  };

  return (
    <MainLayout isGreeting={false} titlePage="Pemetaan CPMK">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px] flex items-center justify-between">
          <p className="text-gray-500 text-sm">Dosen &gt; Perkuliahan &gt; Mata Kuliah &gt; Pemetaan CPMK</p>
          <div className="flex gap-2">
            <button onClick={handleBack} className="bg-primary-blueSoft text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
              <ArrowLeft size={15} /> Kembali
            </button>
            {isKoordinator && !isEditMode && (
              <button onClick={startEdit} className="bg-primary-yellow text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
                <Edit size={15} /> Ubah Data
              </button>
            )}
            {isKoordinator && isEditMode && (
              <>
                <button onClick={handleSave} disabled={saveMutation.isPending} className="bg-primary-green text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50">
                  <Save size={15} /> {saveMutation.isPending ? "Menyimpan..." : "Simpan"}
                </button>
                <button onClick={() => { setIsEditMode(false); buildFromData(); }} className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
                  <X size={15} /> Batal
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <SidebarCourseLecturer mataKuliahId={mataKuliahId || ""} activeTab="cpmk" />

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
                      <p>Anda cuma bisa melihat Pemetaan CPMK mata kuliah ini -- yang bisa mengubah cuma Koordinator Mata Kuliah ({d?.koordinatorMataKuliah?.label || "belum ditentukan"}).</p>
                    </div>
                  )}
                  {errorMessage && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>}
                  {successMessage && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{successMessage}</div>}

                  {isEditMode ? (
                    <div className="flex gap-6 mb-4 text-sm">
                      <label className="flex items-center gap-2">
                        Level Pemetaan
                        <select value={levelPemetaan} onChange={(e) => setLevelPemetaan(e.target.value as any)} className="border border-gray-300 rounded p-1.5">
                          <option value="CPMK">CPMK</option>
                          <option value="Sub-CPMK">Sub-CPMK</option>
                        </select>
                      </label>
                      <label className="flex items-center gap-2">
                        Metode Pembobotan
                        <select value={metodePembobotan} onChange={(e) => setMetodePembobotan(e.target.value as any)} className="border border-gray-300 rounded p-1.5">
                          <option value="Manual">Manual</option>
                          <option value="Otomatis">Otomatis</option>
                        </select>
                      </label>
                    </div>
                  ) : (
                    <div className="mb-4 text-xs text-gray-500">
                      Level pemetaan: <span className="font-semibold text-gray-700">{cpmkData?.levelPemetaan || "-"}</span>
                      {" "}&middot; Metode pembobotan: <span className="font-semibold text-gray-700">{cpmkData?.metodePembobotan || "-"}</span>
                    </div>
                  )}

                  {rows.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 italic border border-gray-200 rounded-sm">Belum ada CPMK untuk mata kuliah ini.</div>
                  ) : (
                    <div className="space-y-4">
                      {rows.map((cpmk, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-sm overflow-hidden">
                          <div className="bg-primary-green/10 px-4 py-2 flex justify-between items-center text-sm gap-2">
                            {isEditMode ? (
                              <>
                                <input value={cpmk.kode} onChange={(e) => updateCpmk(idx, { kode: e.target.value })} placeholder="Kode CPMK" className="border border-gray-300 rounded p-1 font-bold text-primary-green w-32" />
                                <label className="flex items-center gap-1 text-xs">Target
                                  <input type="number" value={cpmk.target} onChange={(e) => updateCpmk(idx, { target: Number(e.target.value) })} className="border border-gray-300 rounded p-1 w-16" />
                                </label>
                                <button onClick={() => removeCpmk(idx)} className="bg-red-500 text-white p-1.5 rounded hover:opacity-90"><Trash2 size={13} /></button>
                              </>
                            ) : (
                              <>
                                <span className="font-bold text-primary-green">{cpmk.kode}</span>
                                <span className="text-gray-600">Target: {cpmk.target ?? "-"} &middot; Bobot: {cpmk.bobot ?? "-"}</span>
                              </>
                            )}
                          </div>
                          <div className="p-4 text-sm text-gray-700">
                            {isEditMode ? (
                              <textarea value={cpmk.deskripsi} onChange={(e) => updateCpmk(idx, { deskripsi: e.target.value })} rows={2} className="w-full border border-gray-300 rounded p-2" placeholder="Deskripsi CPMK" />
                            ) : (
                              cpmk.deskripsi || "-"
                            )}
                          </div>

                          {isEditMode && cplHeaders.length > 0 && (
                            <div className="px-4 pb-3">
                              <p className="text-xs font-semibold text-gray-500 mb-1">Pemetaan ke CPL</p>
                              <div className="flex flex-wrap gap-3">
                                {cplHeaders.map((cpl: any) => {
                                  const found = cpmk.cplPemetaan.find((p) => p.idCpl === cpl.id);
                                  return (
                                    <label key={cpl.id} className="flex items-center gap-1 text-xs">
                                      <input type="checkbox" checked={!!found} onChange={() => toggleCplCpmk(idx, cpl.id)} />
                                      {cpl.kode}
                                      {found && (
                                        <input type="number" value={found.bobotCpl} onChange={(e) => setCplBobotCpmk(idx, cpl.id, Number(e.target.value))} className="w-14 border border-gray-300 rounded p-0.5 ml-1" />
                                      )}
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {(cpmk.subCpmk.length > 0 || isEditMode) && (
                            <div className="border-t border-gray-100">
                              <table className="min-w-full text-xs">
                                <thead>
                                  <tr className="bg-gray-50 text-gray-600">
                                    <th className="p-2 border border-gray-200 w-28 text-left">Kode</th>
                                    <th className="p-2 border border-gray-200 text-left">Deskripsi Sub-CPMK</th>
                                    {isEditMode && <th className="p-2 border border-gray-200 text-left">CPL</th>}
                                    {isEditMode && <th className="p-2 border border-gray-200 w-10"></th>}
                                  </tr>
                                </thead>
                                <tbody>
                                  {cpmk.subCpmk.map((sub, subIdx) => (
                                    <tr key={subIdx}>
                                      <td className="p-2 border border-gray-200 font-semibold">
                                        {isEditMode ? <input value={sub.kode} onChange={(e) => updateSub(idx, subIdx, { kode: e.target.value })} className="border border-gray-300 rounded p-1 w-full" /> : sub.kode}
                                      </td>
                                      <td className="p-2 border border-gray-200">
                                        {isEditMode ? <input value={sub.deskripsi} onChange={(e) => updateSub(idx, subIdx, { deskripsi: e.target.value })} className="border border-gray-300 rounded p-1 w-full" /> : sub.deskripsi || "-"}
                                      </td>
                                      {isEditMode && (
                                        <td className="p-2 border border-gray-200">
                                          <div className="flex flex-wrap gap-2">
                                            {cplHeaders.map((cpl: any) => {
                                              const found = sub.cplPemetaan.find((p) => p.idCpl === cpl.id);
                                              return (
                                                <label key={cpl.id} className="flex items-center gap-1">
                                                  <input type="checkbox" checked={!!found} onChange={() => toggleCplSub(idx, subIdx, cpl.id)} />
                                                  {cpl.kode}
                                                  {found && (
                                                    <input type="number" value={found.bobotCpl} onChange={(e) => setCplBobotSub(idx, subIdx, cpl.id, Number(e.target.value))} className="w-14 border border-gray-300 rounded p-0.5 ml-1" />
                                                  )}
                                                </label>
                                              );
                                            })}
                                          </div>
                                        </td>
                                      )}
                                      {isEditMode && (
                                        <td className="p-2 border border-gray-200 text-center">
                                          <button onClick={() => removeSub(idx, subIdx)} className="bg-red-500 text-white p-1 rounded hover:opacity-90"><Trash2 size={11} /></button>
                                        </td>
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              {isEditMode && (
                                <button onClick={() => addSub(idx)} className="text-xs text-primary-green font-semibold px-3 py-2 flex items-center gap-1 hover:underline">
                                  <Plus size={12} /> Tambah Sub-CPMK
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {isEditMode && (
                    <button onClick={addCpmk} className="mt-4 bg-primary-green text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
                      <Plus size={15} /> Tambah CPMK
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}