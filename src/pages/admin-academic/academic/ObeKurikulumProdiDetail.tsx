import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "../../../components/layouts/MainLayout";
import { ArrowLeft } from "lucide-react";
import { getProdi } from "../../../hooks/academic/useProdi";
import { getCurriculumYear } from "../../../hooks/academic/useCurriculumYear";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import TabMataKuliahKurikulum from "../../../components/admin-academic/academic/obe/TabMataKuliahKurikulum";
import TabSkalaNilai from "../../../components/admin-academic/academic/obe/TabSkalaNilai";
import TabEkivalensiMataKuliah from "../../../components/admin-academic/academic/obe/TabEkivalensiMataKuliah";
import TabPredikatKelulusan from "../../../components/admin-academic/academic/obe/TabPredikatKelulusan";

type TabKey = "mataKuliah" | "skalaNilai" | "ekivalensi" | "predikat";

const TABS: { key: TabKey; label: string }[] = [
  { key: "mataKuliah", label: "Mata Kuliah Kurikulum" },
  { key: "skalaNilai", label: "Skala Nilai" },
  { key: "ekivalensi", label: "Ekivalensi Mata Kuliah" },
  { key: "predikat", label: "Predikat Kelulusan" },
];

export default function ObeKurikulumProdiDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prodiId = searchParams.get("prodiId") || "";
  const tahunKurikulumId = searchParams.get("tahunKurikulumId") || "";

  const [activeTab, setActiveTab] = useState<TabKey>("mataKuliah");

  const { data: prodiData = [] } = getProdi();
  const { data: curriculumData = [] } = getCurriculumYear();

  const prodi = prodiData.find((p: any) => p.id === prodiId) as any;
  const kurikulum = curriculumData.find((c: any) => c.id === tahunKurikulumId) as any;
  const jenjangId: string = prodi?.siakJenjangId || prodi?.jenjang?.id || "";

  const handleBack = () => navigate(AdminAcademicRoute.obeManagement.kurikulumProdi);

  return (
    <MainLayout isGreeting={false} titlePage="Kurikulum Prodi">
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Beranda &gt; Perkuliahan &gt; Manajemen Kurikulum &gt; Kurikulum Prodi &gt; Detail</p>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <button
              onClick={handleBack}
              className="bg-[#00c0ef] text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90"
            >
              <ArrowLeft size={16} /> Kembali ke Daftar
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-56 flex-shrink-0">
              <div className="border border-gray-200 rounded-md overflow-hidden">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full text-left px-4 py-3 text-sm border-b border-gray-100 last:border-b-0 ${
                      activeTab === tab.key ? "bg-primary-green/10 text-primary-green font-semibold border-l-4 border-l-primary-green" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 pb-4 border-b border-gray-200 text-sm">
                <div>
                  <span className="font-semibold text-gray-500">Kode Prodi</span>
                  <p className="text-gray-800">{prodi?.kode || "-"}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-500">Program Studi</span>
                  <p className="text-gray-800">{prodi?.nama || "-"}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-500">Tahun Kurikulum</span>
                  <p className="text-gray-800">{kurikulum?.tahun || "-"}</p>
                </div>
              </div>

              {!prodiId || !tahunKurikulumId ? (
                <div className="p-6 text-center text-gray-400 italic border border-gray-200 rounded-md">
                  Parameter Program Studi / Tahun Kurikulum tidak lengkap.
                </div>
              ) : (
                <>
                  {activeTab === "mataKuliah" && <TabMataKuliahKurikulum prodiId={prodiId} tahunKurikulumId={tahunKurikulumId} />}
                  {activeTab === "skalaNilai" && <TabSkalaNilai jenjangId={jenjangId} tahunKurikulumId={tahunKurikulumId} />}
                  {activeTab === "ekivalensi" && <TabEkivalensiMataKuliah prodiId={prodiId} tahunKurikulumId={tahunKurikulumId} />}
                  {activeTab === "predikat" && <TabPredikatKelulusan jenjangId={jenjangId} tahunKurikulumId={tahunKurikulumId} prodiId={prodiId} />}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
