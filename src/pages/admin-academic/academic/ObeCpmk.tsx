import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useParams, useNavigate } from "react-router-dom";
import { TableObeCpmk } from "../../../components/Table";
import { Search, ArrowLeft } from "lucide-react";
import { getGraduateProfileData } from "../../../hooks/academic/useGraduateProfile.ts";
import { getObeMataKuliah } from "../../../hooks/academic/useObeManagement.ts";
import LoadingSpinner from "../../../components/LoadingSpinner.tsx";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import SidebarOBE from "../../../components/admin-academic/academic/obe/SidebarOBE.tsx";

const ObeCpmk: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50); // Show more courses
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch OBE configuration header
  const {
    data: graduateProfileResponse,
    isLoading: isHeaderLoading,
  } = getGraduateProfileData(id!);

  const header = graduateProfileResponse?.header || {};
  const prodiId = header.idProdi || header.siakProgramStudiId;
  const tahunKurikulumId = header.idKurikulum || header.siakTahunKurikulumId;

  // Fetch courses under this OBE context
  const {
    data: coursesResponse,
    isLoading: isCoursesLoading,
    error: coursesError,
  } = getObeMataKuliah({
    page: currentPage,
    limit: itemsPerPage,
    prodiId: prodiId || "",
    tahunKurikulumId: tahunKurikulumId || "",
    search: searchTerm,
  });

  // Loading states
  if (isHeaderLoading || (isCoursesLoading && prodiId && tahunKurikulumId)) {
    return <LoadingSpinner />;
  }

  // Error states
  if (coursesError) {
    return <div className="text-red-500">Gagal memuat data mata kuliah</div>;
  }

  const rawCourses = coursesResponse?.data?.rows || coursesResponse?.rows || coursesResponse?.data || [];
  const cpmkData = rawCourses.map((item: any) => ({
    id: item.id,
    kodeMataKuliah: item.kode || item.kodeMataKuliah,
    namaMataKuliah: item.nama || item.namaMataKuliah,
    hasCpmk: item.statusCpmk || (item.hasCpmk ? "Sudah Terisi" : "Belum Terisi"),
  }));

  const handleBack = () => {
    navigate(AdminAcademicRoute.obeManagement.obeManagement);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <MainLayout isGreeting={false} titlePage="CPMK" className="">
      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex flex-col items-center justify-between mb-10 md:flex-row gap-4">
          <div className="flex items-center">
            <button onClick={handleBack} className="flex items-center bg-primary-blueSoft text-white px-2 py-3 rounded-l-md">
              <ArrowLeft className="mr-2" size={16} />
            </button>
            <div className="flex items-center">
              <input
                type="search"
                placeholder="Cari Mata Kuliah"
                className="px-3 py-2 border border-black/50 w-64"
                value={searchTerm}
                onChange={handleSearchChange}
              />
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
          {/* Shared Sidebar */}
          <SidebarOBE id={id!} activeTab="cplMk" />

          <div className="w-full md:w-[80%] p-3">
            <div className="grid grid-cols-1 gap-2 bg-primary-green/10 p-4 md:grid-cols-2">
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">Kode Prodi:</span>
                <span className="w-full text-left">{header?.kodeProgramStudi || header?.kodeProdi || "-"}</span>
              </div>
              <div className="flex justify-between md:ml-8 ">
                <span className="font-semibold w-full text-left">Tahun Kurikulum:</span>
                <span className="w-full text-left">{header?.tahunKurikulum || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold w-full text-left">Program Studi:</span>
                <span className="w-full text-left">{header?.programStudi || "-"}</span>
              </div>
            </div>

            <div className="overflow-x-auto mt-6">
              <TableObeCpmk
                data={cpmkData}
                tableHead={["Kode MK", "Mata Kuliah", "Status CPMK"]}
                error="Data tidak ditemukan."
                obeId={id!}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ObeCpmk;
