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
export default function DashboardAdminFinance() {
  const [activeTab, setActiveTab] = useState("angkatan");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const periodOptions = ["2024 Ganjil", "2024 Genap", "2025 Ganjil", "2025 Genap"]

  return (
    <MainLayout titlePage={"Beranda"} isGreeting={false}>
      {/* periode akademik */}
      <FilterDropdown title="Periode Akademik" options={periodOptions} />

      <div className="w-full mt-10 grid grid-cols-1 gap-5 sm:gap-10 lg:gap-5 xl:gap-16 sm:grid-cols-2 lg:grid-cols-4 pb-20">
        <Card
          title="Mahasiswa Baru Periode 2024 Genap"
          value="77"
          color="bg-blue-500"
        />
        <Card title="Mahasiswa Aktif" value="8.077" color="bg-primary-green" />
        <Card
          title="Mahasiswa Terdaftar"
          value="36.388"
          color="bg-primary-yellow"
        />
        <Card title="Periode Saat Ini" value="2024 Genap" color="bg-red-700" />

        <div className="border-t-2 p-3 shadow-sm bg-white border-primary-green rounded-sm sm:col-span-2 lg:col-span-3">
          <h1 className="mb-3 font-semibold">
            Statistik Mahasiswa Periode : 2024 Genap
          </h1>
          <div className="p-1 rounded-xl flex w-full space-x-4 justify-between">
            <TabNavigationButton
              isActive={activeTab === "angkatan"}
              onClick={() => handleTabClick("angkatan")}
            >
              AKM Angkatan
            </TabNavigationButton>
            <TabNavigationButton
              isActive={activeTab === "prodi"}
              onClick={() => handleTabClick("prodi")}
            >
              AKM Prodi
            </TabNavigationButton>
            <TabNavigationButton
              isActive={activeTab === "mahasiswa-baru"}
              onClick={() => handleTabClick("mahasiswa-baru")}
            >
              Mahasiswa Baru
            </TabNavigationButton>
          </div>
          {activeTab === "angkatan" && <AKMClassOfYear />}
          {activeTab === "prodi" && <AKMProdi />}
          {activeTab === "mahasiswa-baru" && <NewStudent />}
        </div>

        <div className="flex flex-col gap-10 sm:col-span-2 lg:col-span-1">
          <DashboardInfoCard
            title="Pergantian Periode Semester"
            lineColor="border-primary-green"
          >
            <button className="p-2 bg-primary-green rounded-sm text-white text-sm px-10 font-semibold my-5">
              Ganti
            </button>
          </DashboardInfoCard>

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
    <LayoutStatistik className={"items-start gap-4"}>
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Mahasiswa Aktif Per Angkatan
        </h3>
        <ChartJSAKMClassOfYear />
      </div>
      <button className="p-2 bg-blue-500 rounded-sm text-white text-sm px-5 my-5">
        Download Exel
      </button>

      <TabelAKMAngkatan />
    </LayoutStatistik>
  );
};
const AKMProdi = () => {
  return (
    <LayoutStatistik className={"items-start gap-4 text-[#617182]"}>
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4 text-center">
          AKM Program Studi
        </h3>
        <ChartJSAKMProdi />
      </div>
      <button className="p-2 bg-blue-500 rounded-sm text-white text-sm px-5 my-5">
        Download Exel
      </button>
      <TabelAKMProdi />
    </LayoutStatistik>
  );
};
const NewStudent = () => {
  return (
    <LayoutStatistik className={"items-start gap-4 text-[#617182]"}>
      <button className="p-2 bg-blue-500 rounded-sm text-white text-sm px-5 my-5">
        Download Exel
      </button>
      <TableNewStudent />
    </LayoutStatistik>
  );
};
