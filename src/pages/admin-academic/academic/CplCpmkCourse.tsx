import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { Api } from "../../../api/Index";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CplData, CourseData, CpmkData } from "../../../components/types.ts";
import { TableCpl, TableCpmk } from "../../../components/Table";
import { Search, ArrowLeft, Save, Edit } from "lucide-react";

// --- api function ---
const fetchCplData = async (page: number, size: number): Promise<CplData[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get(`/akademik/capaian-pembelajaran-lulusan?page=1&size=10&sort=createdAt%2Cdesc`, { headers: { Authorization: `Bearer ${token}` } });

  const apiData = response.data.data;

  console.log("🔍 Raw cpl API data:", apiData);

  const formattedData = Array.isArray(apiData)
    ? apiData.map((item: any) => {
        const formatted = {
          id: item.id,
          programStudi: item.programStudi,
          tahunKurikulum: item.tahunKurikulum,
          kodeCpl: item.kodeCpl,
          deskripsiCpl: item.deskripsiCpl,
          kategoriCpl: item.kategoriCpl,
          pemetaan: item.pemetaan,
        };

        return formatted;
      })
    : [];

  return formattedData;
};

const fetchCpmkData = async (page: number, size: number): Promise<CpmkData[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get(`/akademik/mata-kuliah/all`, { headers: { Authorization: `Bearer ${token}` } });

  const apiData = response.data.data;

  console.log("🔍 Raw graduate profile API data:", apiData);

  const formattedData = Array.isArray(apiData)
    ? apiData.map((item: any) => {
        const formatted = {
          id: item.id,
          kodeMataKuliah: item.kodeMataKuliah,
          namaMataKuliah: item.namaMataKuliah,
          hasCpmk: item.hasCpmk ? "Yes" : "No",
          mataKuliahId: item.mataKuliahId,
          tahunKurikulum: item.tahunKurikulum,
        };

        return formatted;
      })
    : [];

  return formattedData;
};

const fetchCourseDetail = async (id: string): Promise<CourseData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get(`/akademik/mata-kuliah/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("🔍 Raw course detail API data:", response.data.data);

  return response.data.data;
};

// --- cpl cpmk course component ---
const CplCpmkCourse: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // --- state ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // --- query ---
  const {
    data: cplData = [],
    isLoading: loading,
    error: cplError,
    refetch: refetchCplData,
  } = useQuery({
    queryKey: ["cplData", currentPage, itemsPerPage],
    queryFn: () => fetchCplData(currentPage, itemsPerPage),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: cpmkData = [],
    isLoading: loadingCpmk,
    error: cpmkError,
  } = useQuery({
    queryKey: ["cpmkData", currentPage, itemsPerPage],
    queryFn: () => fetchCpmkData(currentPage, itemsPerPage),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

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

  const navigate = useNavigate();

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

        <div className="flex flex-col md:flex-row">
          {/* Sidebar Menu */}
          <div className="w-full  md:w-[20%] h-50 text-white p-3 space-y-2 mr-3">
            <div className="flex items-center bg-[#116E63]/30  mb-1 text-black cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.courseManagement)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>Data Mata Kuliah</p>
            </div>
            <div className="flex items-center bg-[#116E63]/60 mb-1 text-black cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.cplCpmkCourse)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p className="text-black font-semibold">CPL dan CPMK</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.rpsCourse)}>
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
              <TableCpl data={cplData} tableHead={tableHeadCpl} error="Data CPL tidak ditemukan." />
            </div>
            <div className="mt-4 ml-[-10px]">
              <h2 className="font-semibold">CapaianMata Kuliah</h2>
              <TableCpmk data={cpmkData} tableHead={tableHeadCpmk} error="Data CPMK tidak ditemukan." />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CplCpmkCourse;
