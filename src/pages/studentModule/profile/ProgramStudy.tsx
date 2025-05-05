import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import ProfileRedirectButton from "../../../components/profile/ProfileRedirectButton";
import RoundedBorderLayout from "../../../components/profile/RoundedBorderLayout";
import InputField from "../../../components/profile/InputBoxField";
import HorizontalLine from "../../../components/profile/HorizontalLine";
import { StudentRoute } from "../../../types/VarRoutes";

const ProgramStudy = () => {
  const [activeTab, setActiveTab] = useState("orang-tua");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <MainLayout isGreeting={false} titlePage={"Data Mahasiswa"} className={""}>
      <HorizontalLine />

      <div className="grid grid-cols-6 gap-6 p-4">
        <div className="col-span-2">
          <div className="bg-white p-4 flex flex-col items-center rounded-md shadow-md space-y-3 text-sm font-semibold">
            <img width={150} src="/img/profile_logo.png" alt="" />
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
          </div>
        </div>
        <div className="col-span-4 space-y-4">
          <ProgramForm />
        </div>
      </div>
    </MainLayout>
  );
};

const ProgramForm = () => {
  return (
    <RoundedBorderLayout className={"items-start gap-4 text-[#617182]"}>
      <div className="flex flex-col space-y-4 ">
        <InputField title={"Program"} type={""} textArea={false} />
        <InputField title={"Fakultas"} type={""} textArea={false} />
        <InputField title={"Tanggal Terdaftar"} type={""} textArea={false} />
        <InputField title={"Angkatan"} type={""} textArea={false} />
        <InputField title={"Status"} type={""} textArea={false} />
      </div>
      <div className="flex flex-col space-y-4 ">
        <InputField title={"Jenjang"} type={""} textArea={false} />
        <InputField title={"Program Studi"} type={""} textArea={false} />
        <InputField title={"No.Terdaftar"} type={""} textArea={false} />
        <InputField title={"Angkatan"} type={""} textArea={false} />
        <InputField title={"Kelas"} type={""} textArea={false} />
      </div>
    </RoundedBorderLayout>
  );
};

export default ProgramStudy;
