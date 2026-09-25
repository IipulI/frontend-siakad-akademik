import React, { useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import Card from "../../components/admin-academic/dashboard/Card";
import { TabNavigationButton } from "../../components/admin-academic/dashboard/TabNavigasiButton";
import LayoutStatistik from "../../components/admin-academic/dashboard/LayoutForTabNavigation";
import {
  TabelAKMAngkatan,
  TabelAKMProdi,
  TableNewStudent,
} from "../../components/admin-academic/dashboard/Table";
import ChartJSAKMClassOfYear from "../../components/admin-academic/dashboard/ChartJSAKMClassOfYear";
import ChartJSAKMProdi from "../../components/admin-academic/dashboard/ChartJSAKMProdi";
import DashboardInfoCard from "../../components/admin-academic/dashboard/DashboardInfoCard";
import FilterDropdown from "../../components/admin-academic/FilterDropdown";
import { FileSpreadsheet, BarChart3, GraduationCap, BookOpen, UserPlus } from "lucide-react";
export default function DashboardAdminFinance() {
  const [activeTab, setActiveTab] = useState("angkatan");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const periodOptions = [
    "2024 Ganjil",
    "2024 Genap",
    "2025 Ganjil",
    "2025 Genap",
  ];

  return (
    <MainLayout titlePage={"Beranda"} isGreeting={false}>
      {/* periode akademik */}
      <FilterDropdown title="Periode Akademik" options={periodOptions} />

      <div className="w-full mt-10 grid grid-cols-1 gap-5 sm:gap-10 lg:gap-5 xl:gap-16 sm:grid-cols-2 lg:grid-cols-4 pb-20">
        <Card title="Total Mahasiswa" value="77" color="bg-[#4F46E5]" />
        <Card title="Mahasiswa Aktif" value="8.077" color="bg-[#10B981]" />
        <Card title="Mahasiswa Terdaftar" value="36.388" color="bg-[#F59E0B]" />
        <Card
          title="Periode Saat Ini"
          value="2024 Genap"
          color="bg-[#F43F5E]"
        />

        <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 border-t-4 border-t-primary-green p-5 sm:col-span-2 lg:col-span-3 transition-all">
          {/* Header & Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-primary-green/10 flex items-center justify-center text-primary-green shrink-0">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800 leading-tight">
                  Statistik Mahasiswa
                </h2>
                <p className="text-xs text-slate-500">
                  Periode Akademik: <span className="font-semibold text-primary-green">2024 Genap</span>
                </p>
              </div>
            </div>

            {/* Segmented Pill Tabs */}
            <div className="inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 shadow-inner self-start md:self-auto overflow-x-auto max-w-full gap-1">
              <TabNavigationButton
                isActive={activeTab === "angkatan"}
                onClick={() => handleTabClick("angkatan")}
                icon={<GraduationCap className="w-4 h-4" />}
                padding="py-2 px-3 sm:px-4"
              >
                AKM Angkatan
              </TabNavigationButton>
              <TabNavigationButton
                isActive={activeTab === "prodi"}
                onClick={() => handleTabClick("prodi")}
                icon={<BookOpen className="w-4 h-4" />}
                padding="py-2 px-3 sm:px-4"
              >
                AKM Prodi
              </TabNavigationButton>
              <TabNavigationButton
                isActive={activeTab === "mahasiswa-baru"}
                onClick={() => handleTabClick("mahasiswa-baru")}
                icon={<UserPlus className="w-4 h-4" />}
                padding="py-2 px-3 sm:px-4"
              >
                Mahasiswa Baru
              </TabNavigationButton>
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "angkatan" && <AKMClassOfYear />}
            {activeTab === "prodi" && <AKMProdi />}
            {activeTab === "mahasiswa-baru" && <NewStudent />}
          </div>
        </div>

        <div className="flex flex-col gap-10 sm:col-span-2 lg:col-span-1">
          <DashboardInfoCard
            title="Informasi"
            lineColor="border-primary-blueDark"
          >
            <ul className="list-outside list-disc ml-5">
              <li>Terdapat 56 kelas yang jadwalnya belum diisi</li>
              <li>Terdapat 2005 kelas yang belum dikonci nilai</li>
              <li>
                Terdapat 300 mahasiswa aktif yang belum memiliki status semester
              </li>
              <li>Terdapat 134 mahasiswa yang KRSnya belum disetujui</li>
            </ul>
          </DashboardInfoCard>
          <DashboardInfoCard title="Berita" lineColor="border-primary-yellow">
            <p>Tidak ada berita yang diumumkan</p>
          </DashboardInfoCard>
        </div>
      </div>
    </MainLayout>
  );
}

const AKMClassOfYear = () => {
  return (
    <LayoutStatistik className={"items-start gap-4 text-[#617182]"}>
      <div className="w-full">
        <h3 className="text-sm font-semibold mb-2 text-center text-slate-800">
          Mahasiswa Aktif Per Angkatan
        </h3>
        <ChartJSAKMClassOfYear />
      </div>
      <div className="flex justify-between items-center w-full my-3">
        <span className="text-xs font-medium text-slate-500">Tabel Rincian Angkatan</span>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 bg-primary-green hover:bg-[#0d5950] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer"
        >
          <FileSpreadsheet size={14} />
          <span>Unduh Excel</span>
        </button>
      </div>

      <TabelAKMAngkatan />
    </LayoutStatistik>
  );
};
const AKMProdi = () => {
  return (
    <LayoutStatistik className={"items-start gap-4 text-[#617182]"}>
      <div className="w-full">
        <h3 className="text-sm font-semibold mb-2 text-center text-slate-800">
          AKM Program Studi
        </h3>
        <ChartJSAKMProdi />
      </div>
      <div className="flex justify-between items-center w-full my-3">
        <span className="text-xs font-medium text-slate-500">Tabel Rincian Program Studi</span>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 bg-primary-green hover:bg-[#0d5950] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer"
        >
          <FileSpreadsheet size={14} />
          <span>Unduh Excel</span>
        </button>
      </div>
      <TabelAKMProdi />
    </LayoutStatistik>
  );
};
const NewStudent = () => {
  return (
    <LayoutStatistik className={"items-start gap-4 text-[#617182]"}>
      <div className="flex justify-between items-center w-full mb-3">
        <span className="text-xs font-medium text-slate-500">Tabel Data Mahasiswa Baru</span>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 bg-primary-green hover:bg-[#0d5950] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer"
        >
          <FileSpreadsheet size={14} />
          <span>Unduh Excel</span>
        </button>
      </div>
      <TableNewStudent />
    </LayoutStatistik>
  );
};
