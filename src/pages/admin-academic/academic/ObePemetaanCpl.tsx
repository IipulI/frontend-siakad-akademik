import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Sparkles, AlertCircle, Search } from "lucide-react";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { getCourseDataById } from "../../../hooks/academic/useCourseManagement";
import { getCplCpmkCourse } from "../../../hooks/academic/useCplCpmkCourse";
import SidebarObeCourse from "../../../components/admin-academic/academic/obe/SidebarObeCourse";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function ObePemetaanCpl() {
  const navigate = useNavigate();
  const { obeId, mataKuliahId } = useParams<{ obeId: string; mataKuliahId: string }>();

  // Fetch Course Data
  const { data: courseDetail, isLoading: isCourseLoading, error: courseError } = getCourseDataById(mataKuliahId || "");

  // Fetch CPL mapped to this course
  const { data: cplCpmkData, isLoading: isCplLoading, error: cplError } = getCplCpmkCourse(mataKuliahId || "");

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

  const cplList = cplCpmkData?.capaianPembelajaranLulusan || [];

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
              <button className="bg-primary-yellow text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <Edit size={16} /> Ubah Data
              </button>
              <button className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <Sparkles size={16} /> Generate AI
              </button>
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
              
              {/* Course Summary Box */}
              <div className="bg-[#f4f9fb] p-6 rounded-md border border-[#e5f1f6] mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm font-semibold text-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-[#00c0ef]">Kode Mata Kuliah</span>
                    <span className="text-gray-800">{courseDetail.kodeMataKuliah || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#00c0ef]">SKS</span>
                    <span className="text-gray-800">{courseDetail.totalSKS ?? (courseDetail.sksTatapMuka || 3)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#00c0ef]">Mata Kuliah</span>
                    <span className="text-gray-800">{courseDetail.namaMataKuliah || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#00c0ef]">Jenis Mata Kuliah</span>
                    <span className="text-gray-800">{courseDetail.jenis || "Kuliah"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#00c0ef]">Tahun Kurikulum</span>
                    <span className="text-gray-800">Tahun {courseDetail.tahunKurikulum || "2025"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#00c0ef]">Unit Pengampu</span>
                    <span className="text-gray-800">{courseDetail.programStudi || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Alert Info */}
              <div className="bg-[#fff7e6] border border-[#ffe0b2] text-[#e65100] px-4 py-3 rounded-md mb-6 flex items-start gap-3 text-sm font-medium">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>Anda masih dapat menyesuaikan CPL sesuai kebutuhan Anda.</p>
              </div>

              {/* CPL Table */}
              <div className="overflow-x-auto border border-gray-200 rounded-sm">
                <table className="min-w-full bg-white border-collapse">
                  <thead>
                    <tr className="bg-[#0b5c77] text-white text-sm font-semibold text-left">
                      <th className="p-3 border-b border-gray-300 w-16 text-center">No.</th>
                      <th className="p-3 border-b border-gray-300 w-32">Kode CPL</th>
                      <th className="p-3 border-b border-gray-300">Deskripsi Capaian Pembelajaran Lulusan (CPL)</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    {cplList.length > 0 ? (
                      cplList.map((cpl, index) => (
                        <tr key={cpl.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-3 text-center">{index + 1}</td>
                          <td className="p-3 font-semibold">{cpl.kodeCpl || "-"}</td>
                          <td className="p-3 text-justify">{cpl.deskripsiCpl || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-6 text-center text-gray-500 italic">
                          Belum ada data Pemetaan CPL.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
