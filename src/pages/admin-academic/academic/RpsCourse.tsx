import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useNavigate } from "react-router-dom";
import { TableRps } from "../../../components/Table"; // Pastikan TableRps diimport
import { Search, ArrowLeft, Save, Edit } from "lucide-react";

const RPS: React.FC = () => {
  const navigate = useNavigate();

  const [sksTatapMuka, setSksTatapMuka] = useState<number>(0);
  const [sksPraktikum, setSksPraktikum] = useState<number>(0);
  const [totalSks, setTotalSks] = useState<number>(0);
  const [semester, setSemester] = useState<number>(1);
  const [unitPengampu, setUnitPengampu] = useState<string>("Universitas Ibn Khaldun Bogor");

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

  // Data for RPS
  const rpsData = [
    { id: "1", dosenPenyusun: "Dr. Joko", periodeAkademik: "2024 Genap", kelas: "Reguler_B, Reguler_A, Reguler_C, Reguler_D" },
    { id: "2", dosenPenyusun: "Prof. Sari", periodeAkademik: "2024 Genap", kelas: "Reguler_B, Reguler_A, Reguler_C, Reguler_D" },
  ];

  const tableHeadRps = ["Dosen Penyusun", "Periode Akademik", "Kelas", "Aksi"];

  return (
    <MainLayout isGreeting={false} titlePage="Data Mata Kuliah" className="">
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

        <div className="flex ">
          {/* Sidebar Menu */}
          <div className="w-[20%] h-50 text-white p-3 space-y-2">
            <div className="flex items-center bg-[#116E63]/30  mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.courseManagement)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>Data Mata Kuliah</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.cplCpmkCourse)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>CPL dan CPMK</p>
            </div>
            <div className="flex items-center bg-[#116E63]/60 mb-1 text-black cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.rpsCourse)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p className="text-black font-semibold">RPS</p>
            </div>
          </div>

          {/* Detail Data Mata Kuliah */}
          <div className="w-[80%] p-3">
            <div className="flex bg-primary-green/10">
              {/* Sidebar Biru */}
              <div className="w-2 bg-primary-green"></div>

              {/* Konten */}
              <div className="flex-1 p-4 grid grid-cols-2 gap-x-6">
                {/* Kolom Kiri */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold w-40">Kode Mata Kuliah:</span>
                    <span className="flex-1 text-left">MK001</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold w-40">Tahun Kurikulum:</span>
                    <span className="flex-1 text-left">2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold w-40">Mata Kuliah:</span>
                    <span className="flex-1 text-left">Pemrograman Lanjut</span>
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold w-40">Semester:</span>
                    <span className="flex-1 text-left">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold w-40">Unit Pengampu:</span>
                    <span className="flex-1 text-left">Teknik Informatika</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold w-40">SKS:</span>
                    <span className="flex-1 text-left">3</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <TableRps data={rpsData} tableHead={tableHeadRps} error="Data RPS tidak ditemukan." />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RPS;
