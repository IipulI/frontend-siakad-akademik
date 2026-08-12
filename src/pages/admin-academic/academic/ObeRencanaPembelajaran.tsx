import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../../api/Index";
import { ArrowLeft, Search, Plus, Trash2, Settings, Sparkles, Eye } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SidebarObeCourse from "../../../components/admin-academic/academic/obe/SidebarObeCourse";
import { AdminAcademicRoute } from "../../../types/VarRoutes";

interface RencanaPembelajaranResponse {
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
  }>;
  targetPeriodeId: string;
  rencanaPembelajaran: Array<{
    id: string;
    sesi: number;
    jenisPertemuan: string;
    materiPembelajaran: string;
    materiPembelajaranEng: string;
    indikatorPenilaian: string;
    kriteriaPenilaian: string;
    metodePembelajaranLuring: string;
    metodePembelajaranDaring: string;
    bobotPenilaian: number;
    cpmkTerpilih: Array<{
      id: string;
      kode: string;
      deskripsi: string;
      subCpmk?: Array<{
        id: string;
        kode: string;
        deskripsi: string;
      }>;
    }>;
    cpmkIdsFlat: string[];
  }>;
}

export default function ObeRencanaPembelajaran() {
  const { obeId, mataKuliahId } = useParams<{ obeId: string; mataKuliahId: string }>();
  const navigate = useNavigate();
  const [selectedPeriode, setSelectedPeriode] = useState<string>("all");

  const { data, isLoading, error } = useQuery<RencanaPembelajaranResponse>({
    queryKey: ["obeRencanaPembelajaran", mataKuliahId, selectedPeriode],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const url = `/akademik/koordinator-mk/mata-kuliah/${mataKuliahId}/rencana-pembelajaran`;
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

  if (isLoading) {
    return (
      <MainLayout isGreeting={false} titlePage="Rencana Pembelajaran">
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  if (error || !data?.mataKuliah) {
    return (
      <MainLayout isGreeting={false} titlePage="Rencana Pembelajaran">
        <div className="p-8 text-center text-red-500">
          Gagal memuat data Rencana Pembelajaran. Silakan coba lagi.
        </div>
      </MainLayout>
    );
  }

  const { mataKuliah: header, daftarPeriode = [], rencanaPembelajaran = [] } = data;

  return (
    <MainLayout isGreeting={false} titlePage="Rencana Pembelajaran">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">
            Admin - Akademik &gt; Obe &gt; Manajemen Obe &gt; Rencana Pembelajaran
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
                  placeholder="Cari Kursus"
                  className="p-2 pl-3 border border-gray-300 rounded-none text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white w-64 text-gray-700"
                  defaultValue={header.nama}
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
              <button className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <Plus size={16} /> Menambahkan
              </button>
              <button className="bg-primary-yellow text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <Settings size={16} /> Tindakan <span className="text-[10px]">▼</span>
              </button>
              <button className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <Sparkles size={16} /> Hasilkan AI
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
              activeTab="rencanaPembelajaran" 
            />

            {/* Main Table Content */}
            <div className="w-full md:w-[80%]">
              
              {/* Header Box (Green Accent) */}
              <div className="flex mb-6 w-full rounded-sm overflow-hidden border border-gray-100 shadow-sm">
                <div className="bg-primary-green w-2 flex-shrink-0"></div>
                <div className="flex-1 bg-[#F5FFF9] p-5 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-sm text-gray-700">
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Kode Mata Kuliah</span>
                    <span className="flex-1 text-gray-800">{header.kode}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Kredit (SKS)</span>
                    <span className="flex-1 text-gray-800">{header.totalSks}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Kursus</span>
                    <span className="flex-1 text-gray-800">{header.nama}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Jenis Kursus</span>
                    <span className="flex-1 text-gray-800">{header.jenis}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Tahun Kurikulum</span>
                    <span className="flex-1 text-gray-800">{header.tahunKurikulum}</span>
                  </div>
                  <div className="flex justify-between border-b border-green-50 pb-2">
                    <span className="font-semibold text-gray-500 w-44">Unit Pengampunan</span>
                    <span className="flex-1 text-gray-800">{header.unitPengampu}</span>
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
                  <option value="all">Periode Kurikulum Awal</option>
                  {daftarPeriode.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} {p.status === "Aktif" ? "(Aktif)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto border border-gray-200 rounded-sm mb-4">
                <table className="min-w-full bg-white border-collapse">
                  <thead>
                    <tr className="bg-primary-green text-white text-xs uppercase font-bold text-center border-b border-gray-300">
                      <th className="p-3 border border-gray-300 w-16">Sidang</th>
                      <th className="p-3 border border-gray-300 text-left w-72">CPMK & Sub-CPMK</th>
                      <th className="p-3 border border-gray-300 text-left">Materi Kuliah</th>
                      <th className="p-3 border border-gray-300 text-left">Indikator Evaluasi</th>
                      <th className="p-3 border border-gray-300 text-left">Metode pembelajaran</th>
                      <th className="p-3 border border-gray-300 w-24">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700 text-center font-semibold">
                    {rencanaPembelajaran.length > 0 ? (
                      rencanaPembelajaran.map((sesi) => (
                        <tr key={sesi.id} className="hover:bg-gray-50 border-b border-gray-200">
                          <td className="p-3 border border-gray-200">{sesi.sesi}</td>
                          
                          {/* CPMK & Sub CPMK List */}
                          <td className="p-3 border border-gray-200 text-left font-normal">
                            <div className="space-y-2">
                              {sesi.cpmkTerpilih.map((cpmk) => (
                                <div key={cpmk.id} className="border-l-2 border-primary-green pl-2">
                                  <p className="font-semibold text-gray-800">{cpmk.kode}</p>
                                  <p className="text-xs text-gray-500 line-clamp-2">{cpmk.deskripsi}</p>
                                  {cpmk.subCpmk && cpmk.subCpmk.length > 0 && (
                                    <div className="ml-2 mt-1 space-y-1">
                                      {cpmk.subCpmk.map((sub) => (
                                        <div key={sub.id} className="text-xs text-gray-600">
                                          <strong>{sub.kode}:</strong> {sub.deskripsi}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Materi Kuliah */}
                          <td className="p-3 border border-gray-200 text-left font-normal">
                            {sesi.materiPembelajaran || <span className="text-gray-400 italic">-</span>}
                          </td>

                          {/* Indikator Penilaian */}
                          <td className="p-3 border border-gray-200 text-left font-normal">
                            {sesi.indikatorPenilaian || <span className="text-gray-400 italic">-</span>}
                          </td>

                          {/* Metode Pembelajaran */}
                          <td className="p-3 border border-gray-200 text-left font-normal">
                            {sesi.metodePembelajaranLuring && (
                              <p className="text-xs"><strong>Luring:</strong> {sesi.metodePembelajaranLuring}</p>
                            )}
                            {sesi.metodePembelajaranDaring && (
                              <p className="text-xs"><strong>Daring:</strong> {sesi.metodePembelajaranDaring}</p>
                            )}
                            {!sesi.metodePembelajaranLuring && !sesi.metodePembelajaranDaring && (
                              <span className="text-gray-400 italic">-</span>
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="p-3 border border-gray-200">
                            <div className="flex gap-1.5 justify-center">
                              <button
                                className="bg-[#00c0ef] hover:bg-opacity-90 text-white p-1.5 rounded transition cursor-pointer"
                                title="Lihat Sesi"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                className="bg-red-500 hover:bg-opacity-90 text-white p-1.5 rounded transition cursor-pointer"
                                title="Hapus"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-400 italic">
                          Belum ada rencana pembelajaran untuk periode ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
