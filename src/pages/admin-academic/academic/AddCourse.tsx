import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, Save } from "lucide-react";
import { AdminAcademicRoute } from "../../../types/VarRoutes";

const AddCourse: React.FC = () => {
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

  const handleSave = () => {
    console.log("Data disimpan!");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <MainLayout isGreeting={false} titlePage="Tambah Mata Kuliah" className="">
      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5 ">
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
            <button onClick={handleSave} className="bg-primary-blueSoft text-white px-4 py-2 rounded flex items-center">
              <Save className="mr-2" size={16} />
              Simpan
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar Menu */}
          <div className="w-full h-50 text-white p-3 space-y-2 md:w-[20%]">
            <div className="flex items-center bg-[#116E63]/60  mb-1 text-black cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.courseManagement)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p className="text-black font-semibold">Data Mata Kuliah</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.cplCpmkCourse)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>CPL dan CPMK</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.rpsCourse)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>RPS</p>
            </div>
          </div>

          {/* Form Data Mata Kuliah */}
          <div className="w-full bg-white py-2 px-5 md:w-[80%]">
            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <label className="w-full font-semibold md:w-1/2">Tahun Kurikulum</label>
                <select className="w-full px-3 py-2 border border-black/50 rounded">
                  <option>2024 Genap</option>
                </select>
              </div>
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <label className=" w-full md:w-1/2 font-semibold">Unit Pengampu</label>
                <select value={unitPengampu} onChange={(e) => setUnitPengampu(e.target.value)} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option>Universitas Ibn Khaldun Bogor</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <label className=" w-full md:w-1/2 font-semibold">
                  Kode Mata Kuliah
                  <span className="text-red-500">*</span>
                </label>
                <input type="text" className="w-full px-3 py-2 border border-black/50 rounded" />
              </div>
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <label className=" w-full md:w-1/2 font-semibold">Semester</label>
                <select value={semester} onChange={(e) => setSemester(Number(e.target.value))} className="w-full px-3 py-2 border border-black/50 rounded">
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <label className=" w-full md:w-1/2 font-semibold">Nama Mata Kuliah</label>
                <input type="text" className="w-full px-3 py-2 border border-black/50 rounded" />
              </div>
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <label className=" w-full md:w-1/2 font-semibold">Prasyarat 1</label>
                <select className="w-full px-3 py-2 border border-black/50 rounded">
                  <option>Cari Mata Kuliah</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <label className=" w-full md:w-1/2 font-semibold">
                  SKS Tatap Muka <span className="text-red-500">*</span>
                </label>
                <input type="number" value={sksTatapMuka} onChange={(e) => setSksTatapMuka(Number(e.target.value))} className="w-full px-3 py-2 border border-black/50 rounded" />
              </div>
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <label className=" w-full md:w-1/2 font-semibold">Prasyarat 2</label>
                <select className="w-full px-3 py-2 border border-black/50 rounded">
                  <option>Cari Mata Kuliah</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <label className=" w-full md:w-1/2 font-semibold">
                  SKS Praktikum <span className="text-red-500">*</span>
                </label>
                <input type="number" value={sksPraktikum} onChange={(e) => setSksPraktikum(Number(e.target.value))} className="w-full px-3 py-2 border border-black/50 rounded" />
              </div>
              <div className="flex items-center gap-4  w-full md:w-1/2">
                <label className="w-full md:w-1/2 font-semibold">Prasyarat 3</label>
                <select className="w-full px-3 py-2 border border-black/50 rounded">
                  <option>Cari Mata Kuliah</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-4 md:flex-row">
              <div className="flex items-center gap-4  w-full md:w-1/2">
                <label className=" w-full md:w-1/2 font-semibold">
                  Total SKS <span className="text-red-500">*</span>
                </label>
                <input type="number" value={totalSks} className="w-full px-3 py-2 border border-black/50 rounded bg-gray-200" readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddCourse;
