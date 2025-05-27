import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import MainLayout from "../../../components/layouts/MainLayout";
import { AdminAcademicRoute } from "../../../types/VarRoutes";

const DetailCourse: React.FC = () => {
  const navigate = useNavigate();

  const sksTatapMuka = 2;
  const sksPraktikum = 1;
  const totalSks = sksTatapMuka + sksPraktikum;
  const semester = 1;
  const unitPengampu = "Universitas Ibn Khaldun Bogor";
  const kodeMataKuliah = "AK001";
  const namaMataKuliah = "Akuntansi Dasar";
  const kurikulum = "2024 Genap";
  const prasyarat1 = "Akuntansi Menengah";
  const prasyarat2 = "Akuntansi Lanjutan";
  const prasyarat3 = "Manajemen Keuangan";

  const handleBack = () => {
    navigate(AdminAcademicRoute.courseManagement.courseManagement);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <MainLayout isGreeting={false} titlePage="Detail Mata Kuliah" className="">
      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center ">
            <button onClick={handleBack} className="flex items-center bg-primary-blueDark text-white px-3 py-3 rounded-l-md">
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

        <div className="flex">
          {/* Sidebar Menu */}
          <div className="w-[20%] h-50 text-white p-3 space-y-2">
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
          <div className="w-[80%] bg-white py-2 px-2">
            <div className="bg-[#DFF0D8] p-5 mb-6 text-black">
              <h2>
                Kode, Nama & Total SKS tidak bisa diubah karena mata kuliah sudah digunakan di kurikulum <strong>S1 Akuntansi</strong>
              </h2>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="w-1/2 flex items-center gap-3">
                <label className="font-semibold w-40">Tahun Kurikulum:</label>
                <p className="px-3 py-2 rounded flex-1">{kurikulum}</p>
              </div>
              <div className="w-1/2 flex items-center gap-10">
                <label className="font-semibold w-40">Unit Pengampu:</label>
                <p className="px-3 py-2 rounded flex-1">{unitPengampu}</p>
              </div>
            </div>
            <hr className="border-t-2 border-gray-200 " />

            <div className="flex gap-4 mb-4">
              <div className="w-1/2 flex items-center gap-3">
                <label className="font-semibold w-40">Kode Mata Kuliah:</label>
                <p className="px-3 py-2 rounded flex-1">{kodeMataKuliah}</p>
              </div>
              <div className="w-1/2 flex items-center gap-11">
                <label className="font-semibold w-40">Semester:</label>
                <p className="px-3 py-2 rounded flex-1">{semester}</p>
              </div>
            </div>
            <hr className="border-t-2 border-gray-200 " />

            <div className="flex gap-4 mb-4">
              <div className="w-1/2 flex items-center gap-3">
                <label className="font-semibold w-40">Nama Mata Kuliah:</label>
                <p className="px-3 py-2 rounded flex-1">{namaMataKuliah}</p>
              </div>
              <div className="w-1/2 flex items-center gap-3">
                <label className="font-semibold w-48 whitespace-nowrap">Mata Kuliah Prasyarat 1:</label>
                <p className="px-3 py-2 rounded flex-1">{prasyarat1}</p>
              </div>
            </div>
            <hr className="border-t-2 border-gray-200 " />

            <div className="flex gap-4 mb-4">
              <div className="w-1/2 flex items-center gap-3">
                <label className="font-semibold w-40">SKS Tatap Muka:</label>
                <p className="px-3 py-2 rounded flex-1">{sksTatapMuka}</p>
              </div>
              <div className="w-1/2 flex items-center gap-3">
                <label className="font-semibold w-48 whitespace-nowrap">Mata Kuliah Prasyarat 2:</label>
                <p className="px-3 py-2 rounded flex-1">{prasyarat2}</p>
              </div>
            </div>
            <hr className="border-t-2 border-gray-200 " />

            <div className="flex gap-4 mb-4">
              <div className="w-1/2 flex items-center gap-3">
                <label className="font-semibold w-40">SKS Praktikum:</label>
                <p className="px-3 py-2 rounded flex-1">{sksPraktikum}</p>
              </div>
              <div className="w-1/2 flex items-center gap-3">
                <label className="font-semibold w-48 whitespace-nowrap">Mata Kuliah Prasyarat 3:</label>
                <p className="px-3 py-2 rounded flex-1">{prasyarat3}</p>
              </div>
            </div>
            <hr className="border-t-2 border-gray-200 " />
            <div className="flex gap-4 mb-4">
              <div className="w-1/2 flex items-center gap-3">
                <label className="font-semibold w-40">Total SKS:</label>
                <p className="px-3 py-2 rounded  flex-1">{totalSks}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DetailCourse;
