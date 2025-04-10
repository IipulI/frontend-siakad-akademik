import React, { useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import profile_logo from "../../../public/img/profile_logo.png";
import { Link } from "react-router-dom";
import ProfileRedirectButton from "../../components/profile/ProfileRedirectButton";
import TabNavigationButton from "../../components/profile/TabNavigationButton";
import RoundedBorderLayout from "../../components/profile/RoundedBorderLayout";
import InputField from "../../components/profile/ProfileInputField";

const ParentInformation = () => {
  const [activeTab, setActiveTab] = useState("orang-tua");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <MainLayout isGreeting={false} titlePage={"Data Mahasiswa"}>
      <div className="h-px border border-primary-green"></div>

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
          <div className="p-1 bg-[#dddddd] rounded-xl flex w-full justify-between">
            <TabNavigationButton
              isActive={activeTab === "orang-tua"}
              onClick={() => handleTabClick("orang-tua")}
            >
              Orang Tua
            </TabNavigationButton>
            <TabNavigationButton
              isActive={activeTab === "wali"}
              onClick={() => handleTabClick("wali")}
            >
              Wali
            </TabNavigationButton>
          </div>
          {activeTab === "orang-tua" && <Parent />}
          {activeTab === "wali" && <Wali />}
        </div>
      </div>
    </MainLayout>
  );
};

const Parent = () => {
  return (
    <RoundedBorderLayout className={"items-start gap-4 text-[#617182]"}>
      <div className="flex flex-col space-y-4 ">
        <h1 className="text-primary-green text-sm font-semibold">
          Biodata Ayah
        </h1>
        <div className="h-px border-2 border-primary-green"></div>
        <InputField title={"Nama Lengkap"} />
        <InputField title={"NIK"} />
        <InputField title={"Tanggal Lahir"} />
        <InputField title={"Status Hidup"} />
        <InputField title={"Status Kekerabatan"} />
        <InputField title={"Pendidikan Terakhir"} />
        <InputField title={"Pekerjaan"} />
        <InputField title={"Penghasilan"} />
        <InputField title={"Alamat"} />
        <InputField title={"No. Telepon"} />
        <InputField title={"Alamat Email"} />
      </div>
      <div className="flex flex-col space-y-4 ">
        <h1 className="text-primary-green text-sm font-semibold">
          Biodata Ibu
        </h1>
        <div className="h-px border-2 border-primary-green"></div>
        <InputField title={"Nama Lengkap"} />
        <InputField title={"NIK"} />
        <InputField title={"Tanggal Lahir"} />
        <InputField title={"Status Hidup"} />
        <InputField title={"Status Kekerabatan"} />
        <InputField title={"Pendidikan Terakhir"} />
        <InputField title={"Pekerjaan"} />
        <InputField title={"Penghasilan"} />
        <InputField title={"Alamat"} />
        <InputField title={"No. Telepon"} />
        <InputField title={"Alamat Email"} />
      </div>
    </RoundedBorderLayout>
  );
};

const Wali = () => {
  return (
    <RoundedBorderLayout className={"items-start gap-4 text-[#617182]"}>
      <div className="flex flex-col space-y-4 ">
        <InputField title={"Nama Lengkap"} />
        <InputField title={"NIK"} />
        <InputField title={"Tanggal lahir"} />
        <InputField title={"Status Hidup"} />
        <InputField title={"Status Kekerabatan"} />
        <InputField title={"Pendidikan Terakhir"} />
      </div>
      <div className="flex flex-col space-y-4 ">
        <InputField title={"Pekerjaan"} />
        <InputField title={"Penghasilan"} />
        <InputField title={"Alamat"} />
        <InputField title={"No.Telp"} />
        <InputField title={"Alamat Email"} />
      </div>
    </RoundedBorderLayout>
  );
};

export default ParentInformation;
