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

// Child Component for the Program Study Form
const ProgramForm = ({ profile }: { profile: MahasiswaProfile }) => {
  return (
      <RoundedBorderLayout className={"items-start gap-4 text-[#617182]"}>
        <div className="flex flex-col space-y-5 ">
          <DataCard title={"Sistem Kuliah"} desc={profile.sistemKuliah || "-"} />
          <DataCard title={"Tanggal Terdaftar"} desc={profile.tanggalMasuk || "-"} />
          <DataCard title={"Periode Masuk"} desc={profile.periodeMasuk || "-"} />
          <DataCard title={"Status"} desc={profile.statusMahasiswa || "-"} />
          <DataCard title={"Jenis Pendaftaran"} desc={profile.jenisPendaftaran || "-"} />
          <DataCard title={"IPK"} desc={String(profile.ipk || "-")} />
        </div>
        <div className="flex flex-col space-y-5 ">
          <DataCard title={"Jenjang"} desc={profile.jenjang || "-"} />
          <DataCard title={"Program Studi"} desc={profile.namaProgramStudi || "-"} />
          <DataCard title={"NPM"} desc={profile.npm || "-"} />
          <DataCard title={"Angkatan"} desc={profile.angkatan || "-"} />
          <DataCard title={"Kelas"} desc={profile.kelas || "-"} />
          <DataCard title={"Jalur Pendaftaran"} desc={profile.jalurPendaftaran || "-"} />
          <DataCard title={"Total SKS"} desc={String(profile.sks || "-")} />
        </div>
      </RoundedBorderLayout>
  );
};


const ProgramStudy = () => {
  const accountInfo = useAccountInfo();
  const { profile, loading, error } = useMahasiswaProfile(accountInfo?.id || null);

  if (loading) {
    return <MainLayout titlePage="Program Studi"><div className="p-4">Loading... ⏳</div></MainLayout>;
  }

  if (error || !profile) {
    return <MainLayout titlePage="Program Studi"><div className="p-4 text-red-500">Error: {error || "Profile not found"} ❌</div></MainLayout>;
  }

  return (
      <MainLayout isGreeting={false} titlePage={"Data Mahasiswa"}>
        <div className="grid md:grid-cols-8 gap-6 p-4 border-t-2 border-primary-yellow rounded-t-sm">
          {/* Sidebar */}
          <div className="md:col-span-2">
            <div className="bg-white p-4 flex flex-col items-center rounded-md shadow-md space-y-3 text-sm font-semibold">
              <img width={150} src="/img/profile_logo.png" alt="Profile" className="border-2 shadow rounded-full"/>
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
            <ProgramForm profile={profile} />
          </div>
        </div>
      </MainLayout>
  );
};

export default ProgramStudy;

//  button edit
// <button className="flex w-full mt-10 bg-primary-green rounded p-2 justify-center items-center space-x-2 text-[#DAB969]">
//   <SquareCheckBig color="#DAB969" />
//   <p>Edit Data</p>
// </button>