import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AdminAcademicRoute } from "../../../types/VarRoutes";

const DetailRps = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(AdminAcademicRoute.rpsManagement.rpsManagement);
  };

  const sampleData = {
    mataKuliah: "MK001",
    tanggalPenyusunan: "2025-05-15",
    dosenPenyusun: "Dr. Aulia Rahman",
    deskripsi: "Pemrograman Lanjut dengan fokus pada pengembangan aplikasi berbasis web.",
    tujuan: "Mahasiswa mampu membuat aplikasi web menggunakan framework modern.",
    materi: "React.js, Next.js, API Integration, State Management",
    pustakaUtama: "JavaScript: The Good Parts",
    pustakaPendukung: "Learning React, Next.js Handbook",
    dokumenRps: "rps_mk001.pdf",
  };

  return (
    <MainLayout isGreeting={false} titlePage="Detail RPS">
      <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5">
        <div className="flex items-center  justify-start md:justify-end mb-10">
          <button onClick={handleBack} className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center cursor-pointer">
            <ArrowLeft className="mr-2" size={16} />
            Kembali ke Daftar
          </button>
        </div>

        <div className="bg-primary-green/10 p-4 flex flex-col gap-8 md:justify-between rounded mb-6 md:flex-row">
          <div className="flex justify-between items-center gap-2 w-full md:w-1/3 ">
            <span className="font-semibold  w-full  md:w-1/3 text-left">Kode Prodi:</span>
            <span className="w-2/3 text-left">{sampleData.mataKuliah}</span>
          </div>
          <div className="flex justify-between items-center gap-2 w-full md:w-1/3">
            <span className="font-semibold w-1/3 text-left">Program Studi:</span>
            <span className="w-2/3 text-left">Pemrograman Lanjut</span>
          </div>
          <div className="flex justify-between items-center gap-2 w-full md:w-1/3">
            <span className="font-semibold w-1/3 text-left">Ketua Prodi:</span>
            <span className="w-2/3 text-left">1</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <div className="flex flex-col gap-4">
            <hr className="my-2 " />
            <div className="flex items-center gap-2">
              <label className=" w-1/3 text-left">Mata Kuliah:</label>
              <span className="flex-1">{sampleData.mataKuliah}</span>
            </div>
            <hr className="my-2" />
            <div className="flex items-center gap-2">
              <label className="w-1/3 text-left">Tanggal Penyusunan:</label>
              <span className="flex-1">{sampleData.tanggalPenyusunan}</span>
            </div>
            <hr className="my-2" />
            <div className="flex items-center gap-2">
              <label className="w-1/3 text-left">Dosen Penyusun:</label>
              <span className="flex-1">{sampleData.dosenPenyusun}</span>
            </div>
            <hr className="my-2" />
            <div className="flex items-center gap-2">
              <label className="w-1/3 text-left">Deskripsi Mata Kuliah:</label>
              <span className="flex-1">{sampleData.deskripsi}</span>
            </div>
            <hr className="my-2" />
            <div className="flex items-center gap-2">
              <label className="w-1/3 text-left">Tujuan Mata Kuliah:</label>
              <span className="flex-1">{sampleData.tujuan}</span>
            </div>
            <hr className="my-2" />
            <div className="flex items-center gap-2">
              <label className="w-1/3 text-left">Materi Pembelajaran:</label>
              <span className="flex-1">{sampleData.materi}</span>
            </div>
            <hr className="my-2" />
            <div className="flex items-center gap-2">
              <label className="w-1/3 text-left">Pustaka Utama:</label>
              <span className="flex-1">{sampleData.pustakaUtama}</span>
            </div>
            <hr className="my-2" />
            <div className="flex items-center gap-2">
              <label className="w-1/3 text-left">Pustaka Pendukung:</label>
              <span className="flex-1">{sampleData.pustakaPendukung}</span>
            </div>
            <hr className="my-2" />
            <div className="flex items-center gap-2">
              <label className="w-1/3 text-left">Dokumen RPS:</label>
              <span className="flex-1">{sampleData.dokumenRps}</span>
            </div>
          </div>
          <hr className="my-2" />
        </div>
      </div>
    </MainLayout>
  );
};

export default DetailRps;
