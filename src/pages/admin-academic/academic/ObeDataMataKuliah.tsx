import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search, Edit, Plus, Check, X } from "lucide-react";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { getObeMataKuliahDetail } from "../../../hooks/academic/useObeManagement";
import SidebarObeCourse from "../../../components/admin-academic/academic/obe/SidebarObeCourse";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useSetBreadcrumbLabel } from "../../../context/BreadcrumbLabelContext";

export default function ObeDataMataKuliah() {
  const navigate = useNavigate();
  const { obeId, mataKuliahId } = useParams<{ obeId: string; mataKuliahId: string }>();

  const { data: courseDetail, isLoading, error } = getObeMataKuliahDetail(mataKuliahId || "");
  useSetBreadcrumbLabel(mataKuliahId, courseDetail?.namaMataKuliahInd);

  const handleBack = () => {
    navigate(AdminAcademicRoute.obeManagement.obeManagement);
  };

  if (isLoading) {
    return (
      <MainLayout isGreeting={false} titlePage="Data Mata Kuliah">
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  if (error || !courseDetail) {
    return (
      <MainLayout isGreeting={false} titlePage="Data Mata Kuliah">
        <div className="p-8 text-center text-red-500">
          Error loading course detail or course not found
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isGreeting={false} titlePage="Data Mata Kuliah">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">
            Admin - Akademik &gt; Obe &gt; Manajemen Obe &gt; Data Mata Kuliah
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
                  placeholder="Cari Data Mata Kuliah"
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
              <button
                onClick={() => navigate(AdminAcademicRoute.obeManagement.addObeCourse)}
                className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer"
              >
                <Plus size={16} /> Tambah Baru
              </button>
              <button
                onClick={() => navigate(`${AdminAcademicRoute.obeManagement.editObeCourse}/${obeId || "default"}/${mataKuliahId}`)}
                className="bg-primary-yellow text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer"
              >
                <Edit size={16} /> Edit
              </button>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <SidebarObeCourse 
              obeId={obeId || "default"}
              mataKuliahId={mataKuliahId || ""}
              activeTab="data"
            />
            
            <div className="w-full md:w-[80%]">
              {/* Alert Banner */}
              <div className="bg-[#eef5f9] border-l-4 border-[#00c0ef] p-4 mb-6 flex items-start gap-3">
                <div className="text-[#00c0ef] mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#00c0ef] mb-1">Informasi</p>
                  <p className="text-sm text-gray-700">Kode, Nama &amp; Total SKS tidak bisa diubah karena mata kuliah sudah digunakan di kurikulum S1 Teknik Informatika</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 text-sm">
                
                {/* Column 1 */}
                <div>
                  <div className="flex items-center justify-between border-b border-gray-100 py-3">
                    <span className="font-semibold text-[#666666]">Tahun Kurikulum</span>
                    <span className="text-gray-800">{courseDetail.tahunKurikulum || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 py-3">
                    <span className="font-semibold text-[#666666]">Kode Mata Kuliah</span>
                    <span className="text-gray-800">{courseDetail.kodeMataKuliah || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 py-3">
                    <span className="font-semibold text-[#666666]">Nama Mata Kuliah (IND)</span>
                    <span className="text-gray-800">{courseDetail.namaMataKuliahInd || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 py-3">
                    <span className="font-semibold text-[#666666]">Nama Mata Kuliah (EN)</span>
                    <span className="text-gray-800">
                      {courseDetail.namaMataKuliahEn && courseDetail.namaMataKuliahEn !== "-" ? courseDetail.namaMataKuliahEn : "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 py-3">
                    <span className="font-semibold text-[#666666]">Jenis Mata Kuliah</span>
                    <span className="text-gray-800">{courseDetail.jenisMataKuliah || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 py-3">
                    <span className="font-semibold text-[#666666]">SKS Tatap Muka</span>
                    <span className="text-gray-800">{courseDetail.sksTatapMuka ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 py-3">
                    <span className="font-semibold text-[#666666]">SKS Praktikum</span>
                    <span className="text-gray-800">{courseDetail.sksPraktikum ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 py-3">
                    <span className="font-semibold text-[#666666]">SKS Praktik Lapangan</span>
                    <span className="text-gray-800">{courseDetail.sksPraktikLapangan ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 py-3">
                    <span className="font-semibold text-[#666666]">SKS Simulasi</span>
                    <span className="text-gray-800">{courseDetail.sksSimulasi ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 py-3">
                    <span className="font-semibold text-[#666666]">Total SKS</span>
                    <span className="text-gray-800">{courseDetail.totalSks ?? 0}</span>
                  </div>
                </div>

                {/* Column 2 */}
                <div>
                  <div className="flex items-center justify-between border-b border-gray-100 py-3">
                    <span className="font-semibold text-[#666666]">Unit Pengampu</span>
                    <span className="text-gray-800">{courseDetail.unitPengampu || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 py-3">
                    <span className="font-semibold text-[#666666]">Rumpun Mata Kuliah</span>
                    <span className="text-gray-800">-</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 py-3">
                    <span className="font-semibold text-[#666666]">Kelompok Mata Kuliah</span>
                    <span className="text-gray-800">
                      {courseDetail.kelompokMataKuliah && courseDetail.kelompokMataKuliah !== "-" ? courseDetail.kelompokMataKuliah : "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 py-3">
                    <span className="font-semibold text-[#666666]">Merupakan MKU</span>
                    <span className={courseDetail.atribut?.merupakanMku ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                      {courseDetail.atribut?.merupakanMku ? <Check size={16} /> : <X size={16} />}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 py-3">
                    <span className="font-semibold text-[#666666]">Ada SAP</span>
                    <span className={courseDetail.atribut?.adaSap ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                      {courseDetail.atribut?.adaSap ? <Check size={16} /> : <X size={16} />}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 py-3">
                    <span className="font-semibold text-[#666666]">Ada Silabus</span>
                    <span className={courseDetail.atribut?.adaSilabus ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                      {courseDetail.atribut?.adaSilabus ? <Check size={16} /> : <X size={16} />}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 py-3">
                    <span className="font-semibold text-[#666666]">Ada Bahan Ajar</span>
                    <span className={courseDetail.atribut?.adaBahanAjar ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                      {courseDetail.atribut?.adaBahanAjar ? <Check size={16} /> : <X size={16} />}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 py-3">
                    <span className="font-semibold text-[#666666]">Ada Diktat</span>
                    <span className={courseDetail.atribut?.adaDiktat ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                      {courseDetail.atribut?.adaDiktat ? <Check size={16} /> : <X size={16} />}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dosen Penanggung Jawab */}
              <div className="mt-8">
                <h3 className="font-bold text-lg text-primary-green border-b-2 border-primary-green pb-2 mb-4">
                  Dosen Penanggung Jawab
                </h3>
                <div className="text-sm">
                  <div className="flex flex-col md:flex-row border-b border-gray-100 py-3 gap-2 md:gap-0">
                    <div className="w-full md:w-1/3 font-semibold text-[#666666]">Koordinator Mata Kuliah</div>
                    <div className="w-full md:w-2/3 text-gray-800">
                      {courseDetail.koordinatorMataKuliah?.label || "-"}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row border-b border-gray-100 py-3 gap-2 md:gap-0">
                    <div className="w-full md:w-1/3 font-semibold text-[#666666]">Pengembang RPS</div>
                    <div className="w-full md:w-2/3 text-gray-800">
                      {(courseDetail.pengembangRps || []).map((p: any) => p.label).join(", ") || "-"}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row border-b border-gray-100 py-3 gap-2 md:gap-0">
                    <div className="w-full md:w-1/3 font-semibold text-[#666666]">Pengajar Mata Kuliah</div>
                    <div className="w-full md:w-2/3 text-gray-800">-</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
