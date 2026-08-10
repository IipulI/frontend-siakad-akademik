import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../../api/Index";
import { ArrowLeft, Search, Printer, Copy, Edit, Sparkles } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SidebarObeCourse from "../../../components/admin-academic/academic/obe/SidebarObeCourse";
import { AdminAcademicRoute } from "../../../types/VarRoutes";

interface RpsDetailResponse {
  mataKuliah: {
    id: string;
    kode: string;
    nama: string;
    totalSks: number;
    jenis: string;
    tahunKurikulum: string;
    unitPengampu: string;
  };
  daftarPeriode: Array<{
    id: string;
    nama: string;
    status: string;
    adaDataRps: boolean;
  }>;
  rpsData: {
    id: string;
    tanggalPenyusunan: string;
    deskripsiMataKuliah: string;
    deskripsiMataKuliahEng: string;
    tujuanMataKuliah: string;
    materiPembelajaran: string;
    pustakaUtama: string;
    pustakaPendukung: string;
    mediaPerangkatLunak: string;
    mediaPerangkatKeras: string;
    dokumenRps: string;
    dokumenRpsUrl: string | null;
    dokumenRpsNamaFile: string | null;
  } | null;
}

export default function ObeDetailRps() {
  const { obeId, mataKuliahId } = useParams<{ obeId: string; mataKuliahId: string }>();
  const navigate = useNavigate();
  const [selectedPeriode, setSelectedPeriode] = useState<string>("all");

  const { data, isLoading, error, refetch } = useQuery<RpsDetailResponse>({
    queryKey: ["obeDetailRps", mataKuliahId, selectedPeriode],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const url = `/akademik/koordinator-mk/mata-kuliah/${mataKuliahId}/detail-rps`;
      const response = await Api.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        params: selectedPeriode !== "all" ? { periodeId: selectedPeriode } : {},
      });
      return response.data.data;
    },
    enabled: !!mataKuliahId,
  });

  const handleBack = () => {
    navigate(AdminAcademicRoute.obeManagement.obeManagement);
  };

  const handleOpenDocument = () => {
    if (data?.rpsData?.dokumenRpsUrl) {
      window.open(data.rpsData.dokumenRpsUrl, "_blank");
    } else {
      alert("Dokumen RPS belum diunggah.");
    }
  };

  if (isLoading) {
    return (
      <MainLayout isGreeting={false} titlePage="Detail RPS">
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  if (error || !data) {
    return (
      <MainLayout isGreeting={false} titlePage="Detail RPS">
        <div className="p-8 text-center text-red-500">
          Gagal memuat data Detail RPS. Silakan coba lagi.
        </div>
      </MainLayout>
    );
  }

  const { mataKuliah, daftarPeriode, rpsData } = data;

  return (
    <MainLayout isGreeting={false} titlePage="Detail RPS">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">
            Admin - Akademik &gt; Obe &gt; Manajemen Obe &gt; Detail RPS
          </p>
        </div>

        {/* Action Header */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center w-full md:w-auto">
              <button 
                onClick={handleBack} 
                className="bg-primary-yellow text-white p-2.5 rounded-l-md flex items-center justify-center hover:bg-opacity-90"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Cari Mata Kuliah"
                  className="p-2 pl-3 border border-gray-300 rounded-none text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white w-64 text-gray-700"
                  defaultValue={mataKuliah.nama}
                  readOnly
                />
                <button className="bg-primary-blueDark text-white p-2.5 rounded-r-md flex items-center justify-center hover:bg-opacity-90">
                  <Search size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
              <button onClick={handleBack} className="bg-[#00c0ef] text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <ArrowLeft size={16} /> Kembali ke Daftar
              </button>
              <button className="bg-primary-yellow text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <Edit size={16} /> Ubah RPS
              </button>
              <button className="bg-orange-500 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <Copy size={16} /> Salin Data
              </button>
              <button className="bg-primary-blueSoft text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <Printer size={16} /> Cetak
              </button>
              <button className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <Sparkles size={16} /> Generate AI
              </button>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Sidebar */}
            <SidebarObeCourse 
              obeId={obeId!} 
              mataKuliahId={mataKuliahId!} 
              activeTab="detailRps" 
            />

            {/* Main Form Content */}
            <div className="w-full md:w-[80%]">
              
              {/* Header Box (Green Accent) */}
              <div className="flex mb-6 w-full rounded-sm overflow-hidden border border-gray-100 shadow-sm">
                <div className="bg-primary-green w-2 flex-shrink-0"></div>
                <div className="flex-1 bg-[#F5FFF9] p-5 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-sm text-gray-700">
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Kode Mata Kuliah</span>
                    <span className="flex-1 text-gray-800">{mataKuliah.kode}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">SKS</span>
                    <span className="flex-1 text-gray-800">{mataKuliah.totalSks}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Mata Kuliah</span>
                    <span className="flex-1 text-gray-800">{mataKuliah.nama}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Jenis Mata Kuliah</span>
                    <span className="flex-1 text-gray-800">{mataKuliah.jenis}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Tahun Kurikulum</span>
                    <span className="flex-1 text-gray-800">{mataKuliah.tahunKurikulum}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Unit Pengampu</span>
                    <span className="flex-1 text-gray-800">{mataKuliah.unitPengampu}</span>
                  </div>
                </div>
              </div>

              {/* Periode Dropdown */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-sm font-semibold text-gray-700">Berlaku Sejak Periode</label>
                <select
                  value={selectedPeriode}
                  onChange={(e) => setSelectedPeriode(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white text-gray-600 w-64"
                >
                  <option value="all">Periode Awal Kurikulum</option>
                  {daftarPeriode.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} {p.adaDataRps ? "(Data Tersedia)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Detail RPS Content List */}
              <div className="border border-gray-200 rounded-sm overflow-hidden text-sm">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="font-bold text-primary-green">Detail RPS</h4>
                </div>
                <div className="divide-y divide-gray-200">
                  {/* Tanggal Penyusunan */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <span className="font-semibold text-gray-600">Tanggal Penyusunan</span>
                    <span className="md:col-span-3 text-gray-800">
                      {rpsData?.tanggalPenyusunan ? new Date(rpsData.tanggalPenyusunan).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : <span className="text-gray-400 italic">Belum diisi</span>}
                    </span>
                  </div>
                  {/* Deskripsi IND */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <span className="font-semibold text-gray-600">Deskripsi Mata Kuliah (IND)</span>
                    <span className="md:col-span-3 text-gray-800 whitespace-pre-line">
                      {rpsData?.deskripsiMataKuliah || <span className="text-gray-400 italic">Belum diisi</span>}
                    </span>
                  </div>
                  {/* Deskripsi ENG */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <span className="font-semibold text-gray-600">Deskripsi Mata Kuliah (ENG)</span>
                    <span className="md:col-span-3 text-gray-800 whitespace-pre-line">
                      {rpsData?.deskripsiMataKuliahEng || <span className="text-gray-400 italic">Belum diisi</span>}
                    </span>
                  </div>
                  {/* Tujuan */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <span className="font-semibold text-gray-600">Tujuan Mata Kuliah</span>
                    <span className="md:col-span-3 text-gray-800 whitespace-pre-line">
                      {rpsData?.tujuanMataKuliah || <span className="text-gray-400 italic">Belum diisi</span>}
                    </span>
                  </div>
                  {/* Materi */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <span className="font-semibold text-gray-600">Materi Pembelajaran</span>
                    <span className="md:col-span-3 text-gray-800 whitespace-pre-line">
                      {rpsData?.materiPembelajaran || <span className="text-gray-400 italic">Belum diisi</span>}
                    </span>
                  </div>
                  {/* Pustaka Utama */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <span className="font-semibold text-gray-600">Pustaka Utama</span>
                    <span className="md:col-span-3 text-gray-800 whitespace-pre-line">
                      {rpsData?.pustakaUtama || <span className="text-gray-400 italic">Belum diisi</span>}
                    </span>
                  </div>
                  {/* Pustaka Pendukung */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <span className="font-semibold text-gray-600">Pustaka Pendukung</span>
                    <span className="md:col-span-3 text-gray-800 whitespace-pre-line">
                      {rpsData?.pustakaPendukung || <span className="text-gray-400 italic">Belum diisi</span>}
                    </span>
                  </div>
                  {/* Media Lunak */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <span className="font-semibold text-gray-600">Media Perangkat Lunak</span>
                    <span className="md:col-span-3 text-gray-800 whitespace-pre-line">
                      {rpsData?.mediaPerangkatLunak || <span className="text-gray-400 italic">Belum diisi</span>}
                    </span>
                  </div>
                  {/* Media Keras */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <span className="font-semibold text-gray-600">Media Perangkat Keras</span>
                    <span className="md:col-span-3 text-gray-800 whitespace-pre-line">
                      {rpsData?.mediaPerangkatKeras || <span className="text-gray-400 italic">Belum diisi</span>}
                    </span>
                  </div>
                  {/* Dokumen RPS */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <span className="font-semibold text-gray-600">Dokumen RPS</span>
                    <div className="md:col-span-3">
                      {rpsData?.dokumenRpsUrl ? (
                        <button
                          onClick={handleOpenDocument}
                          className="bg-primary-green hover:bg-opacity-90 text-white px-4 py-2 rounded text-xs font-semibold cursor-pointer"
                        >
                          Lihat Dokumen
                        </button>
                      ) : (
                        <span className="text-gray-400 italic">Belum diisi</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
