import React from "react";
import { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { Api } from "../../../api/Index";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useNavigate } from "react-router-dom";
import { TableObeCpmk } from "../../../components/Table";
import { Search, ArrowLeft, Save } from "lucide-react";
import { CpmkData } from "../../../components/types.ts";

// api functions

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

const ObeCpmk: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // state
  const [selectedYear, setSelectedYear] = useState("2024");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Queries
  const {
    data: cpmkData = [],
    isLoading: loading,
    error: cpmkError,
    refetch: refetchCpmkData,
  } = useQuery({
    queryKey: ["cpmkData", currentPage, itemsPerPage],
    queryFn: () => fetchCpmkData(currentPage, itemsPerPage),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // handlers
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  const handleBack = () => {
    navigate(AdminAcademicRoute.courseManagement.courseManagement);
  };

  return (
    <MainLayout isGreeting={false} titlePage="CPMK" className="">
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
          <div className="w-full  md:w-[20%] h-50 text-white p-3 space-y-2">
            <div className="flex items-center bg-[#116E63]/30  mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.obeManagement.graduateProfile)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>Profil Lulusan</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.obeManagement.cpl)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>CPL</p>
            </div>
            <div className="flex items-center bg-[#116E63]/60 mb-1 text-black cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.obeManagement.cpmk)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p className="text-black font-semibold">CPMK</p>
            </div>
          </div>

          <div className="w-full  md:w-[80%] p-3">
            <div className="grid grid-cols-1 gap-2 bg-primary-green/10 p-4 md:grid-cols-2">
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">Kode Prodi:</span>
                <span className="w-full text-left">MK001</span>
              </div>
              <div className="flex justify-between md:ml-8 ">
                <span className="font-semibold w-full text-left">Tahun Kurikulum:</span>
                <span className="w-full text-left">{selectedYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">Program Studi:</span>
                <span className="w-full text-left">Pemrograman Lanjut</span>
              </div>
              <div className="flex justify-between md:ml-8">
                <span className="font-semibold w-full text-left">Ketua Prodi:</span>
                <span className="w-full text-left">1</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col md:items-center gap-2 md:flex-row">
              <h2 className="text-lg font-semibold">Tahun Kurikulum</h2>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="border border-black/50 rounded-md px-2 py-1 w-full  md:w-40">
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
            <div className="overflow-x-auto mt-4">
              <TableObeCpmk data={cpmkData} tableHead={["Kode MK", "Mata Kuliah", "Status CPMK"]} error="Data tidak ditemukan." />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ObeCpmk;
