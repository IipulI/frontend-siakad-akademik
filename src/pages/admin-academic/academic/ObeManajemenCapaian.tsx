import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { getObe } from "../../../hooks/academic/useObeManagement";
import { getProdi } from "../../../hooks/academic/useProdi";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { Eye, Search, Filter } from "lucide-react";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { useNavigate } from "react-router-dom";
import { AdminAcademicRoute } from "../../../types/VarRoutes";

const ObeManajemenCapaian: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedCurriculum, setSelectedCurriculum] = useState("all");
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const { data: prodiData = [], isLoading: isProdiLoading } = getProdi();
  const { data: curriculumData = [], isLoading: isCurriculumLoading } = getCurriculumYear();
  
  // Dummy data for Jenjang Pendidikan since endpoint is not available
  const levelData = [
    { id: "S1", nama: "S1" },
    { id: "D3", nama: "D3" },
    { id: "S2", nama: "S2" },
  ];

  const { data: obeResponse, isLoading: isObeLoading } = getObe({
    page: currentPage,
    limit: itemsPerPage,
    tahunKurikulumId: selectedCurriculum === "all" ? undefined : selectedCurriculum,
    prodiId: selectedProdi === "all" ? undefined : selectedProdi,
  });

  const isLoading = isProdiLoading || isCurriculumLoading || isObeLoading;
  const obeList = obeResponse?.data || [];
  const totalItems = obeResponse?.count || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const StatusIcon = ({ status }: { status: boolean }) => (
    status ? (
      <span className="text-green-500 font-bold flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </span>
    ) : (
      <span className="text-red-500 font-bold flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </span>
    )
  );

  return (
    <MainLayout isGreeting={false} titlePage="Manajemen Capaian">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Beranda &gt; Perkuliahan &gt; Manajemen Kurikulum &gt; Manajemen Capaian</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-yellow shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Tahun Kurikulum</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-600"
                value={selectedCurriculum}
                onChange={(e) => { setSelectedCurriculum(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">-- Semua --</option>
                {curriculumData.map((item) => (
                  <option key={item.id} value={item.id}>{item.tahun}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Jenjang Pendidikan</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-600"
                value={selectedLevel}
                onChange={(e) => { setSelectedLevel(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">-- Semua --</option>
                {levelData.map((item: any) => (
                  <option key={item.id} value={item.id}>{item.nama}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Program Studi</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-600"
                value={selectedProdi}
                onChange={(e) => { setSelectedProdi(e.target.value); setCurrentPage(1); }}
              >
                <option value="all">-- Semua --</option>
                {prodiData.map((prodi) => (
                  <option key={prodi.id} value={prodi.id}>{prodi.nama}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 text-sm">
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center" rowSpan={2}>No</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-left" rowSpan={2}>Kurikulum</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-left" rowSpan={2}>Program Studi</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-left" rowSpan={2}>Ketua Program Studi</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center" colSpan={4}>Status Pengisian</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center" rowSpan={2}>Aksi</th>
                  </tr>
                  <tr className="bg-gray-50 text-gray-700 text-sm">
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center">PL</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center">CPL</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center">PL-&gt;CPL</th>
                    <th className="border border-gray-200 px-4 py-2 font-semibold text-center">CPL-&gt;MK</th>
                  </tr>
                </thead>
                <tbody>
                  {obeList.length > 0 ? (
                    obeList.map((item: any, index: number) => (
                      <tr key={item.id || index} className="text-sm text-gray-700 hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="border border-gray-200 px-4 py-2">{item.programStudi} {item.tahunKurikulum}</td>
                        <td className="border border-gray-200 px-4 py-2">{item.programStudi}</td>
                        <td className="border border-gray-200 px-4 py-2">{item.ketuaProgramStudi}</td>
                        <td className="border border-gray-200 px-4 py-2 text-center"><StatusIcon status={item.pl} /></td>
                        <td className="border border-gray-200 px-4 py-2 text-center"><StatusIcon status={item.cpl} /></td>
                        <td className="border border-gray-200 px-4 py-2 text-center"><StatusIcon status={item.plToCpl} /></td>
                        <td className="border border-gray-200 px-4 py-2 text-center"><StatusIcon status={item.cpmk} /></td>
                        <td className="border border-gray-200 px-4 py-2 text-center">
                          <button 
                            className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded"
                            title="Detail"
                            onClick={() => {
                              // If there's an OBE ID, navigate to detail
                              if (item.id) {
                                navigate(`${AdminAcademicRoute.obeManagement.detailOBE}/${item.id}`);
                              } else {
                                alert("Data OBE belum tersedia untuk prodi ini.");
                              }
                            }}
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="border border-gray-200 px-4 py-4 text-center text-gray-500">
                        Tidak ada data Manajemen Capaian
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {obeList.length > 0 && (
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ObeManajemenCapaian;
