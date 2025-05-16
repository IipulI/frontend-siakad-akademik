import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import ProfileRedirectButton from "../../../components/profile/ProfileRedirectButton";
import RoundedBorderLayout from "../../../components/profile/RoundedBorderLayout";
import InputField from "../../../components/profile/InputBoxField";
import { StudentRoute } from "../../../types/VarRoutes";
import { SquareCheckBig } from "lucide-react";
import DataCard from "../../../components/profile/DataCard";

const ProgramStudy = () => {
  const [activeTab, setActiveTab] = useState("orang-tua");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <MainLayout isGreeting={false} titlePage={"Data Mahasiswa"} className={""}>
      <div className="grid md:grid-cols-8 gap-6 p-4 border-t-2 border-primary-yellow rounded-t-sm">
        <div className="md:col-span-2">
          <div className="bg-white p-4 flex flex-col items-center rounded-md shadow-md space-y-3 text-sm font-semibold">
            <img
              width={150}
              src="/img/profile_logo.png"
              alt=""
              className="border-2 shadow rounded-full"
            />
            <h1 className="uppercase text-primary-brown">
              Muhammad Ridho Fathan
            </h1>
            <span className="text-secondary-gray underline">
              idhopatan.2@gmail.com
            </span>
            <ProfileRedirectButton route={String(StudentRoute.profile.profile)}>
              Data Diri
            </ProfileRedirectButton>
            <ProfileRedirectButton route={String(StudentRoute.profile.parent)}>
              Orang Tua Wali
            </ProfileRedirectButton>
            <ProfileRedirectButton
              route={String(StudentRoute.profile.programStudy)}
            >
              Program Studi
            </ProfileRedirectButton>
            <ProfileRedirectButton
              route={String(StudentRoute.profile.educationHistory)}
            >
              Pendidikan Asal
            </ProfileRedirectButton>

            <button className="flex w-full mt-10 bg-primary-green rounded p-2 justify-center items-center space-x-2 text-[#DAB969]">
              <SquareCheckBig color="#DAB969" />
              <p>Edit Data</p>
            </button>
          </div>
        </div>
        <div className="md:col-span-6 space-y-4">
          <ProgramForm />
        </div>
      </div>
    </MainLayout>
  );
};

const ProgramForm = () => {
  return (
    <RoundedBorderLayout className={"items-start gap-4 text-[#617182]"}>
      <div className="flex flex-col space-y-5 ">
        <DataCard title={"Sistem Kuliah"} desc={"Reguler"} />
        <DataCard title={"Fakultas"} desc={"Teknik dan Sains"} />
        <DataCard title={"Tanggal Terdaftar"} desc={"01/03/2022"} />
        <DataCard title={"Priode"} desc={"Ganjil"} />
        <DataCard title={"Status"} desc={"Aktif"} />
        <DataCard title={"Jenis Pendaftaran"} desc={"Peserta Didik Baru"} />
      </div>
      <div className="flex flex-col space-y-5 ">
        <DataCard title={"Jenjang"} desc={"S1"} />
        <DataCard title={"Program Studi"} desc={"Teknik Informatika"} />
        <DataCard title={"NPM"} desc={"221106042807"} />
        <DataCard title={"Angkatan"} desc={"2022"} />
        <DataCard title={"Kelas"} desc={"Reguler B"} />
        <DataCard title={"Jalur Pendafataran"} desc={"Seleksi Mandiri"} />
      </div>
    </RoundedBorderLayout>
  );
};

export default ProgramStudy;
