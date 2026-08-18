import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Edit, AlertCircle, Search } from "lucide-react";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { getCourseDataById } from "../../../hooks/academic/useCourseManagement";
import { getPemetaanCplMk, useSavePemetaanCplMk } from "../../../hooks/academic/useObePemetaanCplMk";
import SidebarObeCourse from "../../../components/admin-academic/academic/obe/SidebarObeCourse";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useSetBreadcrumbLabel } from "../../../context/BreadcrumbLabelContext";

export default function ObePemetaanCpl() {
  const navigate = useNavigate();
  const { obeId, mataKuliahId } = useParams<{ obeId: string; mataKuliahId: string }>();

  // Fetch Course Data
  const { data: courseDetail, isLoading: isCourseLoading, error: courseError } = getCourseDataById(mataKuliahId || "");
  useSetBreadcrumbLabel(mataKuliahId, courseDetail?.nama);

  // Fetch CPL list + mapped status for this course
  const { data: cplMkData, isLoading: isCplLoading } = getPemetaanCplMk(mataKuliahId || "");
  const saveMutation = useSavePemetaanCplMk();

  const [isEditMode, setIsEditMode] = useState(false);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const daftarCpl = cplMkData?.daftarCpl || [];

  useEffect(() => {
    setCheckedIds(new Set(daftarCpl.filter((c) => c.isMapped).map((c) => c.id)));
  }, [cplMkData]);

  const handleBack = () => {
    navigate(AdminAcademicRoute.obeManagement.obeManagement);
  };

  const isLoading = isCourseLoading || isCplLoading;

  if (isLoading) {
    return (
      <MainLayout isGreeting={false} titlePage="Pemetaan CPL">
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  if (courseError || !courseDetail) {
    return (
      <MainLayout isGreeting={false} titlePage="Pemetaan CPL">
        <div className="p-8 text-center text-red-500">
          Gagal memuat data Mata Kuliah. Silakan coba lagi.
        </div>
      </MainLayout>
    );
  }

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
        },
        onError: (error: any) => {
          setErrorMessage(error?.response?.data?.message || "Gagal menyimpan pemetaan CPL.");
        },
      }
    );
  };

  return (
    <MainLayout isGreeting={false} titlePage="Pemetaan CPL">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">
            Admin - Akademik &gt; Obe &gt; Manajemen Obe &gt; Pemetaan CPL
          </p>
        </div>

        {/* Action Header */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center w-full md:w-auto">
              <button 
                onClick={handleBack} 
                className="bg-primary-yellow text-white p-2.5 rounded-l-md flex items-center justify-center hover:bg-opacity-90 cursor-pointer"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Cari Mata Kuliah"
                  className="p-2 pl-3 border border-gray-300 rounded-none text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white w-64 text-gray-700"
                />
                <button className="bg-indigo-600 text-white p-2.5 rounded-r-md flex items-center justify-center hover:bg-opacity-90 cursor-pointer">
                  <Search size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
              <button 
                onClick={handleBack} 
                className="bg-[#00c0ef] text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer"
              >
                <ArrowLeft size={16} /> Kembali ke Daftar
              </button>
              {!isEditMode ? (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="bg-primary-yellow text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer"
                >
                  <Edit size={16} /> Ubah Data
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                  className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer disabled:opacity-50"
                >
                  <Save size={16} /> {saveMutation.isPending ? "Menyimpan..." : "Simpan"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <SidebarObeCourse 
              obeId={obeId || "default"}
              mataKuliahId={mataKuliahId || ""}
              activeTab="cpl"
            />
            
            {/* Main Content */}
            <div className="w-full md:w-[80%]">
              
              {/* Course Summary Box (Green Accent) */}
              <div className="flex mb-6 w-full rounded-sm overflow-hidden border border-gray-100 shadow-sm">
                <div className="bg-primary-green w-2 flex-shrink-0"></div>
                <div className="flex-1 bg-[#F5FFF9] p-5 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-sm text-gray-700">
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Kode Mata Kuliah</span>
                    <span className="flex-1 text-gray-800">{courseDetail.kode || "-"}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">SKS</span>
                    <span className="flex-1 text-gray-800">{courseDetail.totalSks ?? (courseDetail.sksTatapMuka || 0)}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Mata Kuliah</span>
                    <span className="flex-1 text-gray-800">{courseDetail.nama || "-"}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Jenis Mata Kuliah</span>
                    <span className="flex-1 text-gray-800">{courseDetail.jenis || "Kuliah"}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Tahun Kurikulum</span>
                    <span className="flex-1 text-gray-800">
                      {typeof courseDetail.tahunKurikulum === "object" ? courseDetail.tahunKurikulum?.tahun : (courseDetail.tahunKurikulum || "-")}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Unit Pengampu</span>
                    <span className="flex-1 text-gray-800">
                      {typeof courseDetail.programStudi === "object" ? courseDetail.programStudi?.nama : (courseDetail.programStudi || "-")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Alert Info */}
              <div className="bg-[#fff7e6] border border-[#ffe0b2] text-[#e65100] px-4 py-3 rounded-md mb-6 flex items-start gap-3 text-sm font-medium">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                  {isEditMode
                    ? "Centang CPL yang berlaku untuk mata kuliah ini, lalu klik Simpan. Menyimpan akan menggantikan seluruh daftar CPL yang terpetakan sebelumnya."
                    : "Klik \"Ubah Data\" untuk menyesuaikan CPL yang dipetakan ke mata kuliah ini."}
                </p>
              </div>
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{successMessage}</div>
              )}

              {/* CPL List */}
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
                    {(isEditMode ? daftarCpl : daftarCpl.filter((c) => checkedIds.has(c.id))).length > 0 ? (
                      (isEditMode ? daftarCpl : daftarCpl.filter((c) => checkedIds.has(c.id))).map((cpl, index) => (
                        <tr key={cpl.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-3 text-center">{index + 1}</td>
                          <td className="p-3 font-semibold">{cpl.kode || "-"}</td>
                          <td className="p-3 text-justify">{cpl.deskripsi || "-"}</td>
                          {isEditMode ? (
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={checkedIds.has(cpl.id)}
                                onChange={(e) => toggleCpl(cpl.id, e.target.checked)}
                                className="w-4 h-4"
                              />
                            </td>
                          ) : null}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={isEditMode ? 4 : 3} className="p-6 text-center text-gray-500 italic">
                          Belum ada data CPL. Tambahkan CPL pada level OBE terlebih dahulu.
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

            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
