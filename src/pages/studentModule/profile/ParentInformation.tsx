import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import ProfileRedirectButton from "../../../components/profile/ProfileRedirectButton";
import TabNavigationButton from "../../../components/profile/TabNavigationButton";
import RoundedBorderLayout from "../../../components/profile/RoundedBorderLayout";
import DataCard from "../../../components/profile/DataCard";
import { SquareCheckBig, Users } from "lucide-react";
import { StudentRoute } from "../../../types/VarRoutes";
import { MahasiswaProfile, KeluargaMahasiswa } from "../../../types/mahasiswa.types";

// Hooks
import { useAccountInfo } from "../../../hooks/useAccountInfo";
import { useMahasiswaProfile } from "../../../hooks/mahasiswa/useProfile";

// Child Component for Parent Data (Ayah & Ibu)
const Parent = ({ ayah, ibu }: { ayah?: KeluargaMahasiswa; ibu?: KeluargaMahasiswa }) => {
  return (
      <RoundedBorderLayout className={"items-start gap-4 text-[#617182]"}>
        {/* Ayah's Data */}
        <div className="flex flex-col space-y-5 ">
          <h1 className="text-primary-green text-sm font-semibold">Biodata Ayah</h1>
          <div className="h-px border-2 border-primary-green"></div>
          <DataCard title={"Nama Lengkap"} desc={ayah?.nama || "-"} />
          <DataCard title={"NIK"} desc={ayah?.nik || "-"} />
          <DataCard title={"Tanggal Lahir"} desc={ayah?.tanggalLahir || "-"} />
          <DataCard title={"Status Hidup"} desc={ayah?.statusHidup || "-"} />
          <DataCard title={"Pendidikan Terakhir"} desc={ayah?.pendidikan || "-"} />
          <DataCard title={"Pekerjaan"} desc={ayah?.pekerjaan || "-"} />
          <DataCard title={"Penghasilan"} desc={ayah?.penghasilan || "-"} />
          <DataCard title={"No. Telepon"} desc={ayah?.noTelepon || "-"} />
        </div>
        {/* Ibu's Data */}
        <div className="flex flex-col space-y-5 ">
          <h1 className="text-primary-green text-sm font-semibold">Biodata Ibu</h1>
          <div className="h-px border-2 border-primary-green"></div>
          <DataCard title={"Nama Lengkap"} desc={ibu?.nama || "-"} />
          <DataCard title={"NIK"} desc={ibu?.nik || "-"} />
          <DataCard title={"Tanggal Lahir"} desc={ibu?.tanggalLahir || "-"} />
          <DataCard title={"Status Hidup"} desc={ibu?.statusHidup || "-"} />
          <DataCard title={"Pendidikan Terakhir"} desc={ibu?.pendidikan || "-"} />
          <DataCard title={"Pekerjaan"} desc={ibu?.pekerjaan || "-"} />
          <DataCard title={"Penghasilan"} desc={ibu?.penghasilan || "-"} />
          <DataCard title={"No. Telepon"} desc={ibu?.noTelepon || "-"} />
        </div>
      </RoundedBorderLayout>
  );
};

// Child Component for Wali (Guardian) Data
const Wali = ({ wali }: { wali?: KeluargaMahasiswa }) => {
  return (
      <RoundedBorderLayout className={"items-start gap-4 text-[#617182]"}>
        <div className="flex flex-col space-y-5 ">
          <DataCard title={"Nama Lengkap"} desc={wali?.nama || "-"} />
          <DataCard title={"NIK"} desc={wali?.nik || "-"} />
          <DataCard title={"Tanggal Lahir"} desc={wali?.tanggalLahir || "-"} />
          <DataCard title={"Pendidikan Terakhir"} desc={wali?.pendidikan || "-"} />
        </div>
        <div className="flex flex-col space-y-5 ">
          <DataCard title={"Pekerjaan"} desc={wali?.pekerjaan || "-"} />
          <DataCard title={"Penghasilan"} desc={wali?.penghasilan || "-"} />
          <DataCard title={"No. Telepon"} desc={wali?.noTelepon || "-"} />
          <DataCard title={"Alamat Email"} desc={wali?.email || "-"} />
        </div>
      </RoundedBorderLayout>
  );
};


// ⭐️ Main Page Component ⭐️
const ParentInformation = () => {
  const [activeTab, setActiveTab] = useState("orang-tua");
  const accountInfo = useAccountInfo();
  const { profile, loading, error } = useMahasiswaProfile(accountInfo?.id || null);

  // Find specific family members from the list
  const ayah = profile?.keluargaMahasiswaList.find(p => p.hubungan.toLowerCase() === 'ayah');
  const ibu = profile?.keluargaMahasiswaList.find(p => p.hubungan.toLowerCase() === 'ibu');
  const wali = profile?.keluargaMahasiswaList.find(p => p.hubungan.toLowerCase() === 'wali');

  if (loading) {
    return <MainLayout titlePage="Data Orang Tua / Wali"><div className="p-4">Loading... ⏳</div></MainLayout>;
  }

  if (error || !profile) {
    return <MainLayout titlePage="Data Orang Tua / Wali"><div className="p-4 text-red-500">Error: {error || "Profile not found"} ❌</div></MainLayout>;
  }

  return (
      <MainLayout isGreeting={false} titlePage={"Data Mahasiswa"}>
        <div className="grid sm:grid-cols-2 md:grid-cols-8 gap-6 p-4 border-t-2 border-primary-yellow rounded-t-sm">
          {/* Sidebar */}
          <div className="md:col-span-2">
            <div className="bg-white p-4 flex flex-col items-center rounded-md shadow-md space-y-3 text-sm font-semibold">
              <img width={150} src="/img/profile_logo.png" alt="Profile" className="border-2 shadow rounded-full" />
              <h1 className="uppercase text-primary-brown">{profile.nama}</h1>
              <span className="text-secondary-gray underline">{profile.emailPribadi}</span>
              <ProfileRedirectButton route={String(StudentRoute.profile.profile)}>Data Diri</ProfileRedirectButton>
              <ProfileRedirectButton route={String(StudentRoute.profile.parent)}>Orang Tua Wali</ProfileRedirectButton>
              <ProfileRedirectButton route={String(StudentRoute.profile.programStudy)}>Program Studi</ProfileRedirectButton>
              <ProfileRedirectButton route={String(StudentRoute.profile.educationHistory)}>Pendidikan Asal</ProfileRedirectButton>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-6 space-y-4">
            <div className="p-1 bg-[#dddddd] rounded-xl flex w-full justify-between">
              <TabNavigationButton icon={<Users size={18} />} isActive={activeTab === "orang-tua"} onClick={() => setActiveTab("orang-tua")}>Orang Tua</TabNavigationButton>
              <TabNavigationButton icon={<Users size={18} />} isActive={activeTab === "wali"} onClick={() => setActiveTab("wali")}>Wali</TabNavigationButton>
            </div>
            {activeTab === "orang-tua" && <Parent ayah={ayah} ibu={ibu} />}
            {activeTab === "wali" && <Wali wali={wali} />}
          </div>
        </div>
      </MainLayout>
  );
};

export default ParentInformation;