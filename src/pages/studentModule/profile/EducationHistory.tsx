import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import ProfileRedirectButton from "../../../components/profile/ProfileRedirectButton";
import RoundedBorderLayout from "../../../components/profile/RoundedBorderLayout";
import DataCard from "../../../components/profile/DataCard";
import { StudentRoute } from "../../../types/VarRoutes";
import { SquareCheckBig } from "lucide-react";
import { MahasiswaProfile } from "../../../types/mahasiswa.types";

// Hooks
import { useAccountInfo } from "../../../hooks/useAccountInfo";
import { useMahasiswaProfile } from "../../../hooks/mahasiswa/useProfile";

// Child Component for the Education Form
const EducationForm = ({ profile }: { profile: MahasiswaProfile }) => {
  return (
      <RoundedBorderLayout className={"items-start gap-4 text-[#617182]"}>
        <div className="flex flex-col space-y-4 ">
          <DataCard title={"Pendidikan Asal"} desc={profile.pendidikanAsal || "-"} />
          <DataCard title={"Provinsi Sekolah"} desc={profile.provinsiSekolah || "-"} />
          <DataCard title={"Kota/Kab Sekolah"} desc={profile.kotaKabSekolah || "-"} />
          <DataCard title={"Sekolah"} desc={profile.namaPendidikanAsal || "-"} />
          <DataCard title={"Alamat sekolah"} desc={profile.alamatSekolah || "-"} />
        </div>
        <div className="flex flex-col space-y-4 ">
          <DataCard title={"Telepon Sekolah"} desc={profile.teleponSekolah || "-"} />
          <DataCard title={"No Ijazah Sekolah"} desc={profile.noIjazahSekolah || "-"} />
          <DataCard title={"NISN"} desc={profile.nisn || "-"} />
          <DataCard title={"File Ijazah Terakhir"} desc={"-"} />
        </div>
      </RoundedBorderLayout>
  );
};


// ⭐️ Main Page Component ⭐️
const EducationHistory = () => {
  const accountInfo = useAccountInfo();
  const { profile, loading, error } = useMahasiswaProfile(accountInfo?.id || null);

  if (loading) {
    return <MainLayout titlePage="Pendidikan Asal"><div className="p-4">Loading... ⏳</div></MainLayout>;
  }

  if (error || !profile) {
    return <MainLayout titlePage="Pendidikan Asal"><div className="p-4 text-red-500">Error: {error || "Profile not found"} ❌</div></MainLayout>;
  }

  return (
      <MainLayout isGreeting={false} titlePage={"Data Mahasiswa"}>
        <div className="grid md:grid-cols-8 gap-6 p-4 border-t-2 border-primary-yellow rounded-t-sm">
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
            <EducationForm profile={profile} />
          </div>
        </div>
      </MainLayout>
  );
};

export default EducationHistory;