import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Edit, AlertCircle } from "lucide-react";
import { LecturerRoute } from "../../../types/VarRoutes";
import SidebarCourseLecturer from "../../../components/lecturer/SidebarCourseLecturer";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useCourseDetail, useCoursePemetaanCpl } from "../../../hooks/lecturer/useFetchCourse";
import { useSavePemetaanCplMk } from "../../../hooks/academic/useObePemetaanCplMk";

export default function PemetaanCplLecturer() {
  const navigate = useNavigate();
  const { mataKuliahId } = useParams<{ mataKuliahId: string }>();

  const { data: detail, isLoading: isCourseLoading } = useCourseDetail(mataKuliahId || "");
  const d = detail?.data;

  const { data: cplData, isLoading: isCplLoading, refetch: refetchCpl } = useCoursePemetaanCpl(mataKuliahId || "");
  const saveMutation = useSavePemetaanCplMk();

  const [isEditMode, setIsEditMode] = useState(false);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const daftarCpl = cplData?.data?.daftarCpl || [];
  const isKoordinator = !!d?.isKoordinator;

  useEffect(() => {
    setCheckedIds(new Set(daftarCpl.filter((c: any) => c.isMapped).map((c: any) => c.id)));
  }, [cplData]);

  const isLoading = isCourseLoading || isCplLoading;
  const handleBack = () => navigate(LecturerRoute.courses.detailCourse);

  const toggleCpl = (cplId: string, checked: boolean) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(cplId);
      else next.delete(cplId);
      return next;
    });
  };

  const handleSave = () => {
    setErrorMessage("");
    setSuccessMessage("");
    saveMutation.mutate(
      { mataKuliahId: mataKuliahId!, cplIds: Array.from(checkedIds) },
      {
        onSuccess: () => {
          setSuccessMessage("Pemetaan CPL berhasil disimpan.");
          setIsEditMode(false);
          refetchCpl();
        },
        onError: (error: any) => setErrorMessage(error?.response?.data?.message || "Gagal menyimpan pemetaan CPL."),
      }
    );
  };

  return (
    <MainLayout isGreeting={false} titlePage="Pemetaan CPL">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px] flex items-center justify-between">
          <p className="text-gray-500 text-sm">Dosen &gt; Perkuliahan &gt; Mata Kuliah &gt; Pemetaan CPL</p>
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
              <button onClick={handleSave} disabled={saveMutation.isPending} className="bg-primary-green text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50">
                <Save size={15} /> {saveMutation.isPending ? "Menyimpan..." : "Simpan"}
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <SidebarCourseLecturer mataKuliahId={mataKuliahId || ""} activeTab="cpl" />

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
                      <p>Anda cuma bisa melihat pemetaan CPL mata kuliah ini -- yang bisa mengubah cuma Koordinator Mata Kuliah ({d?.koordinatorMataKuliah?.label || "belum ditentukan"}).</p>
                    </div>
                  )}
                  {errorMessage && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>}
                  {successMessage && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{successMessage}</div>}

                  <div className="overflow-x-auto border border-gray-200 rounded-sm">
                    <table className="min-w-full bg-white border-collapse">
                      <thead>
                        <tr className="bg-primary-green text-white text-sm font-semibold text-left">
                          <th className="p-3 border-b border-gray-300 w-16 text-center">No.</th>
                          <th className="p-3 border-b border-gray-300 w-32">Kode CPL</th>
                          <th className="p-3 border-b border-gray-300">Deskripsi Capaian Pembelajaran Lulusan (CPL)</th>
                          {isEditMode && <th className="p-3 border-b border-gray-300 w-24 text-center">Dipetakan</th>}
                        </tr>
                      </thead>
                      <tbody className="text-sm text-gray-700">
                        {(isEditMode ? daftarCpl : daftarCpl.filter((c: any) => checkedIds.has(c.id))).length > 0 ? (
                          (isEditMode ? daftarCpl : daftarCpl.filter((c: any) => checkedIds.has(c.id))).map((cpl: any, index: number) => (
                            <tr key={cpl.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="p-3 text-center">{index + 1}</td>
                              <td className="p-3 font-semibold">{cpl.kode || "-"}</td>
                              <td className="p-3 text-justify">{cpl.deskripsi || "-"}</td>
                              {isEditMode ? (
                                <td className="p-3 text-center">
                                  <input type="checkbox" checked={checkedIds.has(cpl.id)} onChange={(e) => toggleCpl(cpl.id, e.target.checked)} className="w-4 h-4" />
                                </td>
                              ) : null}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={isEditMode ? 4 : 3} className="p-6 text-center text-gray-500 italic">
                              Belum ada CPL yang dipetakan ke mata kuliah ini.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {!isEditMode && (
                    <p className="mt-2 text-xs text-gray-500">
                      {checkedIds.size} dari {daftarCpl.length} CPL terpetakan ke mata kuliah ini.
                    </p>
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