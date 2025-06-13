import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { Api } from "../../../api/Index";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, ArrowLeft } from "lucide-react";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { CourseData } from "../../../components/types";

// --- api function ---
const fetchCourseDetail = async (id: string): Promise<CourseData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get(`/akademik/mata-kuliah/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.data;
};

//  --- detail course component ---
const DetailCourse: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // --- query ---
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

  // --- event handlers ---
  const handleBack = () => {
    navigate(AdminAcademicRoute.courseManagement.courseManagement);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // --- show loading state ---
  if (isLoading) {
    return (
      <MainLayout isGreeting={false} titlePage="Detail Mata Kuliah" className="">
        <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
          <div className="flex items-center justify-center h-64">
            <p>Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // --- show error state ---
  if (error || !courseDetail) {
    return (
      <MainLayout isGreeting={false} titlePage="Detail Mata Kuliah" className="">
        <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">Error loading course detail or course not found</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // --- Calculate values from fetched data ---
  const sksTatapMuka = courseDetail.sksTatapMuka || 0;
  const sksPraktikum = courseDetail.sksPraktikum || 0;
  const totalSks = sksTatapMuka + sksPraktikum;

  return (
    <MainLayout isGreeting={false} titlePage="Detail Mata Kuliah" className="">
      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex flex-col items-center justify-between mb-10 md:flex-row gap-4">
          <div className="flex items-center ">
            <button onClick={handleBack} className="flex items-center bg-primary-blueSoft text-white px-2 py-3 rounded-l-md">
              <ArrowLeft className="mr-2" size={16} />
            </button>
            <div className="flex items-center">
              <input type="search" placeholder="Cari Mata Kuliah" className="px-3 py-2 border border-black/50  w-64" />
              <button className="bg-primary-yellow px-3 py-3 rounded-r-md">
                <Search color="white" size={20} />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleBack} className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center cursor-pointer">
              <ArrowLeft className="mr-2" size={16} />
              Kembali ke Daftar
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row ">
          {/* Sidebar Menu */}
          <div className="w-full h-50 text-white p-3 space-y-2 md:w-[20%]">
            <div className="flex items-center bg-[#116E63]/60 mb-1 text-black cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.courseManagement)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3"></div>
              <p className="text-black font-semibold">Data Mata Kuliah</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.cplCpmkCourse)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3"></div>
              <p>CPL dan CPMK</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.rpsCourse)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3"></div>
              <p>RPS</p>
            </div>
          </div>

          {/* Detail Data Mata Kuliah */}
          <div className="w-full bg-white py-2 px-2 md:w-[80%]">
            <div className="bg-[#DFF0D8] p-5 mb-6 text-black">
              <h2>
                Kode, Nama & Total SKS tidak bisa diubah karena mata kuliah sudah digunakan di kurikulum <strong>S1 {courseDetail.programStudi}</strong>
              </h2>
            </div>

            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <div className=" w-full md:w-1/2 flex items-center gap-3">
                <label className="font-semibold w-40">Tahun Kurikulum:</label>
                <p className="px-3 py-2 rounded flex-1">{courseDetail.tahunKurikulum}</p>
              </div>
              <div className=" w-full md:w-1/2 flex items-center gap-3 md:gap-10">
                <label className="font-semibold w-40">Unit Pengampu:</label>
                <p className="px-3 py-2 rounded flex-1">{courseDetail.programStudi}</p>
              </div>
            </div>
            <hr className="border-t-2 border-gray-200 " />

            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <div className=" w-full md:w-1/2 flex items-center gap-3">
                <label className="font-semibold w-40">Kode Mata Kuliah:</label>
                <p className="px-3 py-2 rounded flex-1">{courseDetail.kodeMataKuliah}</p>
              </div>
              <div className="w-full md:w-1/2 flex items-center gap-3 md:gap-11">
                <label className="font-semibold w-40">Semester:</label>
                <p className="px-3 py-2 rounded flex-1">{courseDetail.semester}</p>
              </div>
            </div>
            <hr className="border-t-2 border-gray-200 " />

            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <div className=" w-full md:w-1/2 flex items-center gap-3">
                <label className="font-semibold w-40">Nama Mata Kuliah:</label>
                <p className="px-3 py-2 rounded flex-1">{courseDetail.namaMataKuliah}</p>
              </div>
              <div className=" w-full md:w-1/2 flex items-center gap-3">
                <label className="font-semibold w-40 md:w-48 whitespace-nowrap">Mata Kuliah Prasyarat 1:</label>
                <p className="px-3 py-2 rounded flex-1">{courseDetail.prasyaratMataKuliah1?.namaMataKuliah || "-"}</p>
              </div>
            </div>
            <hr className="border-t-2 border-gray-200 " />

            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <div className="w-full md:w-1/2 flex items-center gap-3">
                <label className="font-semibold w-40">SKS Tatap Muka:</label>
                <p className="px-3 py-2 rounded flex-1">{sksTatapMuka}</p>
              </div>
              <div className="w-full md:w-1/2 flex items-center gap-3">
                <label className="font-semibold w-40 md:w-48 whitespace-nowrap">Mata Kuliah Prasyarat 2:</label>
                <p className="px-3 py-2 rounded flex-1">{courseDetail.prasyaratMataKuliah2?.namaMataKuliah || "-"}</p>
              </div>
            </div>
            <hr className="border-t-2 border-gray-200 " />

            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <div className="w-full md:w-1/2 flex items-center gap-3">
                <label className="font-semibold w-40">SKS Praktikum:</label>
                <p className="px-3 py-2 rounded flex-1">{sksPraktikum}</p>
              </div>
              <div className=" w-full md:w-1/2 flex items-center gap-3">
                <label className="font-semibold w-40 md:w-48 whitespace-nowrap">Mata Kuliah Prasyarat 3:</label>
                <p className="px-3 py-2 rounded flex-1">{courseDetail.prasyaratMataKuliah3?.namaMataKuliah || "-"}</p>
              </div>
            </div>
            <hr className="border-t-2 border-gray-200 " />
            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <div className="w-full md:w-1/2 flex items-center gap-3">
                <label className="font-semibold w-40">Total SKS:</label>
                <p className="px-3 py-2 rounded  flex-1">{totalSks}</p>
              </div>
              <div className="w-full md:w-1/2 flex items-center gap-3">
                <label className="font-semibold w-40">Jenis Mata Kuliah:</label>
                <p className="px-3 py-2 rounded flex-1">{courseDetail.jenisMataKuliah}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DetailCourse;
