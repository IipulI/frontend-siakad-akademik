import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useNavigate, useParams } from "react-router-dom";
import { TableRps } from "../../../components/Table";
import { Search, ArrowLeft, Save, Edit } from "lucide-react";
import { CourseData } from "../../../components/types.ts";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../../api/Index";
import { getRpsMatkulById } from "../../../hooks/academic/useRpsManagement.ts";

const fetchCourseDetail = async (id: string): Promise<CourseData> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

  const response = await Api.get(`/akademik/mata-kuliah/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("🔍 Raw course detail API data:", response.data.data);

  return response.data.data;
};

const RPS: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [sksTatapMuka, setSksTatapMuka] = useState<number>(0);
  const [sksPraktikum, setSksPraktikum] = useState<number>(0);
  const [totalSks, setTotalSks] = useState<number>(0);
  const [semester, setSemester] = useState<number>(1);
  const [unitPengampu, setUnitPengampu] = useState<string>("Universitas Ibn Khaldun Bogor");

  const { data: rpsData = [], isLoading: isRpsLoading, error: rpsError } = getRpsMatkulById(id!);

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

  useEffect(() => {
    // Update total SKS whenever sksTatapMuka or sksPraktikum changes
    setTotalSks(sksTatapMuka + sksPraktikum);
  }, [sksTatapMuka, sksPraktikum]);

  const handleBack = () => {
    navigate(AdminAcademicRoute.courseManagement.courseManagement);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // const tableHeadRps = ["Dosen Penyusun", "Periode Akademik", "Kelas", "Aksi"];

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
          <div className=" w-full md:w-[20%] h-50 text-white p-3 space-y-2">
            <div className="flex items-center bg-[#116E63]/30  mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(`${AdminAcademicRoute.courseManagement.detailCourse}/${id}`)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>Data Mata Kuliah</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(`${AdminAcademicRoute.courseManagement.cplCpmkCourse}/${id}`)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>CPL dan CPMK</p>
            </div>
            <div className="flex items-center bg-[#116E63]/60 mb-1 text-black cursor-pointer" onClick={() => handleNavigation(`${AdminAcademicRoute.courseManagement.rpsCourse}/${id}`)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p className="text-black font-semibold">RPS</p>
            </div>
          </div>

          {/* Detail Data Mata Kuliah */}
          <div className=" w-full md:w-[80%] p-3">
            <div className="flex  bg-primary-green/10 ">
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
                    <span className="flex-1 text-left">{courseDetail?.sksPraktikum}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <TableRps data={rpsData} error="Data RPS tidak ditemukan." />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RPS;
