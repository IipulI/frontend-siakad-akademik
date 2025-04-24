import React, { useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import profile_logo from "../../../public/img/profile_logo.png";
import { Link } from "react-router-dom";
import ProfileRedirectButton from "../../components/profile/ProfileRedirectButton";
import TabNavigationButton from "../../components/profile/TabNavigationButton";
import RoundedBorderLayout from "../../components/profile/RoundedBorderLayout";
import InputField from "../../components/profile/InputBoxField";
import { User, Users } from "lucide-react";
import HorizontalLine from "../../components/profile/HorizontalLine";

const ProgramStudy = () => {
  const [activeTab, setActiveTab] = useState("orang-tua");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <MainLayout isGreeting={false} titlePage={"Data Mahasiswa"}>
      <HorizontalLine />

      <div className="grid grid-cols-6 gap-6 p-4">
        <div className="col-span-2">
          <div className="bg-white p-4 flex flex-col items-center rounded-md shadow-md space-y-3 text-sm font-semibold">
            <img width={150} src={profile_logo} alt="" />
            <h1 className="uppercase text-primary-brown">
              Muhammad Ridho Fathan
            </h1>
            <span className="text-secondary-gray underline">
              idhopatan.2@gmail.com
            </span>
            <ProfileRedirectButton route={"/profile"}>
              Data Diri
            </ProfileRedirectButton>
            <ProfileRedirectButton route={"/profile/parent"}>
              Orang Tua Wali
            </ProfileRedirectButton>
            <ProfileRedirectButton route={"/profile/program-study"}>
              Program Studi
            </ProfileRedirectButton>
            <ProfileRedirectButton route={"/profile/education-history"}>
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
        <InputField title={"Program"} />
        <InputField title={"Fakultas"} />
        <InputField title={"Tanggal Terdaftar"} />
        <InputField title={"Angkatan"} />
        <InputField title={"Status"} />
      </div>
      <div className="flex flex-col space-y-4 ">
        <InputField title={"Jenjang"} />
        <InputField title={"Program Studi"} />
        <InputField title={"No.Terdaftar"} />
        <InputField title={"Angkatan"} />
        <InputField title={"Kelas"} />
      </div>
    </RoundedBorderLayout>
  );
};

export default ProgramStudy;
