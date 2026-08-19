import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { LecturerRoute } from "../../../types/VarRoutes";
import SidebarCourseLecturer from "../../../components/lecturer/SidebarCourseLecturer";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useCourseDetail } from "../../../hooks/lecturer/useFetchCourse";
import { getPemetaanCpmk } from "../../../hooks/academic/useObeCpmkMk";

export default function PemetaanCpmkLecturer() {
  const navigate = useNavigate();
  const { mataKuliahId } = useParams<{ mataKuliahId: string }>();

  const { data: detail, isLoading: isCourseLoading } = useCourseDetail(mataKuliahId || "");
  const d = detail?.data;
  const isKoordinator = !!d?.isKoordinator;

  const { data: cpmkData, isLoading: isCpmkLoading } = getPemetaanCpmk(mataKuliahId || "");
  const isLoading = isCourseLoading || isCpmkLoading;
  const cpmkList = cpmkData?.cpmkData || [];

  const handleBack = () => navigate(LecturerRoute.courses.detailCourse);

  return (
    <MainLayout isGreeting={false} titlePage="Pemetaan CPMK">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px] flex items-center justify-between">
          <p className="text-gray-500 text-sm">Dosen &gt; Perkuliahan &gt; Mata Kuliah &gt; Pemetaan CPMK</p>
          <div className="flex gap-2">
            <button onClick={handleBack} className="bg-primary-blueSoft text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
              <ArrowLeft size={15} /> Kembali
            </button>
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
                  {isKoordinator ? (
                    <div className="bg-[#fff7e6] border border-[#ffe0b2] text-[#e65100] px-4 py-3 rounded-md mb-6 flex items-start gap-3 text-sm font-medium">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p>Anda Koordinator mata kuliah ini. Perubahan Pemetaan CPMK (bobot, target, Sub-CPMK, pemetaan ke CPL) untuk sementara masih perlu dibantu Admin Akademik lewat menu Manajemen OBE.</p>
                    </div>
                  ) : (
                    <div className="bg-gray-100 border border-gray-300 text-gray-600 px-4 py-3 rounded-md mb-6 flex items-start gap-3 text-sm font-medium">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p>Anda cuma bisa melihat Pemetaan CPMK mata kuliah ini -- yang bisa mengubah cuma Koordinator Mata Kuliah ({d?.koordinatorMataKuliah?.label || "belum ditentukan"}).</p>
                    </div>
                  )}

                  <div className="mb-4 text-xs text-gray-500">
                    Level pemetaan: <span className="font-semibold text-gray-700">{cpmkData?.levelPemetaan || "-"}</span>
                    {" "}&middot; Metode pembobotan: <span className="font-semibold text-gray-700">{cpmkData?.metodePembobotan || "-"}</span>
                  </div>

                  {cpmkList.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 italic border border-gray-200 rounded-sm">
                      Belum ada CPMK untuk mata kuliah ini.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cpmkList.map((cpmk: any, idx: number) => (
                        <div key={cpmk.id || idx} className="border border-gray-200 rounded-sm overflow-hidden">
                          <div className="bg-primary-green/10 px-4 py-2 flex justify-between items-center text-sm">
                            <span className="font-bold text-primary-green">{cpmk.kode}</span>
                            <span className="text-gray-600">Target: {cpmk.target ?? "-"} &middot; Bobot: {cpmk.bobot ?? "-"}</span>
                          </div>
                          <div className="p-4 text-sm text-gray-700">{cpmk.deskripsi || "-"}</div>
                          {(cpmk.subCpmk || []).length > 0 && (
                            <div className="border-t border-gray-100">
                              <table className="min-w-full text-xs">
                                <thead>
                                  <tr className="bg-gray-50 text-gray-600">
                                    <th className="p-2 border border-gray-200 w-28 text-left">Kode</th>
                                    <th className="p-2 border border-gray-200 text-left">Deskripsi Sub-CPMK</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {cpmk.subCpmk.map((sub: any, subIdx: number) => (
                                    <tr key={sub.id || subIdx}>
                                      <td className="p-2 border border-gray-200 font-semibold">{sub.kode}</td>
                                      <td className="p-2 border border-gray-200">{sub.deskripsi || "-"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
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