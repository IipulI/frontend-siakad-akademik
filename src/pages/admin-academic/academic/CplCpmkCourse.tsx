import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { Api } from "../../../api/Index";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CourseData } from "../../../components/types.ts";
import { TableCpl, TableCpmk } from "../../../components/Table";
import { Search, ArrowLeft, Save, Edit } from "lucide-react";
import { getCplCpmkCourse } from "../../../hooks/academic/useCplCpmkCourse.ts";

const fetchCourseDetail = async (id: string): Promise<CourseData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get(`/akademik/mata-kuliah/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.data;
};

const CplCpmkCourse: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // --- state ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: cplCpmkData, isLoading: isCplCpmkLoading, error: cplCpmkError } = getCplCpmkCourse(id!);

  const {
    data: courseDetail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courseDetail", id],
    queryFn: () => fetchCourseDetail(id!),
    enabled: !!id, // Only run query if id exists
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleBack = () => {
    navigate(AdminAcademicRoute.courseManagement.courseManagement);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const tableHeadCpl = ["Kode CPL", "Deskripsi Capaian Pembelajaran Lulusan (CPL)", "Kategori"];
  const tableHeadCpmk = ["Kode CPMK", "Deskripsi"];

  return (
    <MainLayout isGreeting={false} titlePage="Data Mata Kuliah" className="">
      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex flex-col items-center justify-end mb-10 md:flex-row gap-4">
          <div className="flex gap-2">
            <button onClick={handleBack} className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center cursor-pointer">
              <ArrowLeft className="mr-2" size={16} />
              Kembali ke Daftar
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar Menu */}
          <div className="w-full  md:w-[20%] h-50 text-white p-3 space-y-2 mr-3">
            <div className="flex items-center bg-[#116E63]/30  mb-1 text-black cursor-pointer" onClick={() => handleNavigation(`${AdminAcademicRoute.courseManagement.detailCourse}/${id}`)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>Data Mata Kuliah</p>
            </div>
            <div className="flex items-center bg-[#116E63]/60 mb-1 text-black cursor-pointer" onClick={() => handleNavigation(`${AdminAcademicRoute.courseManagement.cplCpmkCourse}/${id}`)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p className="text-black font-semibold">CPL dan CPMK</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(`${AdminAcademicRoute.courseManagement.rpsCourse}/${id}`)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>RPS</p>
            </div>
          </div>
          {/* Detail Data Mata Kuliah */}
          <div className="w-full md:w-[80%] p-3">
            <div className="flex flex-col bg-primary-green/10 md:flex-row">
              {/* Sidebar Biru */}
              <div className="w-2 bg-primary-green"></div>

              {/* Konten */}
              <div className="flex-1 p-4 grid grid-cols-1 gap-x-6 md:grid-cols-2">
                {/* Kolom Kiri */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold w-40">Kode Mata Kuliah:</span>
                    <span className="flex-1 text-left">{courseDetail?.kodeMataKuliah}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold w-40">Tahun Kurikulum:</span>
                    <span className="flex-1 text-left">{courseDetail?.tahunKurikulum}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold w-40">Mata Kuliah:</span>
                    <span className="flex-1 text-left">{courseDetail?.namaMataKuliah}</span>
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold w-40">Semester:</span>
                    <span className="flex-1 text-left">{courseDetail?.semester}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold w-40">Unit Pengampu:</span>
                    <span className="flex-1 text-left">{courseDetail?.programStudi}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold w-40">SKS:</span>
                    <span className="flex-1 text-left">{(courseDetail?.sksPraktikum || 0) + (courseDetail?.sksTatapMuka || 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 ml-[-10px]">
              <h2 className="font-semibold">Capaian Pembelajaran Lulusan</h2>
              <TableCpl data={cplCpmkData?.capaianPembelajaranLulusan} tableHead={tableHeadCpl} error="Data CPL tidak ditemukan." />
            </div>
            <div className="mt-4 ml-[-10px]">
              <h2 className="font-semibold">CapaianMata Kuliah</h2>
              <TableCpmk data={cplCpmkData?.capaianMataKuliah} tableHead={tableHeadCpmk} error="Data CPMK tidak ditemukan." />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CplCpmkCourse;
