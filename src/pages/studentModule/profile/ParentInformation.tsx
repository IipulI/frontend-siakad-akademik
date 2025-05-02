import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import ProfileRedirectButton from "../../../components/profile/ProfileRedirectButton";
import TabNavigationButton from "../../../components/profile/TabNavigationButton";
import RoundedBorderLayout from "../../../components/profile/RoundedBorderLayout";
import InputField from "../../../components/profile/InputBoxField";
import { Users } from "lucide-react";
import HorizontalLine from "../../../components/profile/HorizontalLine";
import { StudentRoute } from "../../../types/VarRoutes";

const ParentInformation = () => {
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
          <div className="p-1 bg-[#dddddd] rounded-xl flex w-full justify-between">
            <TabNavigationButton
              icon={<Users size={18} />}
              isActive={activeTab === "orang-tua"}
              onClick={() => handleTabClick("orang-tua")}
            >
              Orang Tua
            </TabNavigationButton>
            <TabNavigationButton
              icon={<Users size={18} />}
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
        <InputField title={"Nama Lengkap"} type={""} textArea={false} />
        <InputField title={"NIK"} type={""} textArea={false} />
        <InputField title={"Tanggal Lahir"} type={""} textArea={false} />
        <InputField title={"Status Hidup"} type={""} textArea={false} />
        <InputField title={"Status Kekerabatan"} type={""} textArea={false} />
        <InputField title={"Pendidikan Terakhir"} type={""} textArea={false} />
        <InputField title={"Pekerjaan"} type={""} textArea={false} />
        <InputField title={"Penghasilan"} type={""} textArea={false} />
        <InputField title={"Alamat"} type={""} textArea={false} />
        <InputField title={"No. Telepon"} type={""} textArea={false} />
        <InputField title={"Alamat Email"} type={""} textArea={false} />
      </div>
      <div className="flex flex-col space-y-4 ">
        <h1 className="text-primary-green text-sm font-semibold">
          Biodata Ibu
        </h1>
        <div className="h-px border-2 border-primary-green"></div>
        <InputField title={"Nama Lengkap"} type={""} textArea={false} />
        <InputField title={"NIK"} type={""} textArea={false} />
        <InputField title={"Tanggal Lahir"} type={""} textArea={false} />
        <InputField title={"Status Hidup"} type={""} textArea={false} />
        <InputField title={"Status Kekerabatan"} type={""} textArea={false} />
        <InputField title={"Pendidikan Terakhir"} type={""} textArea={false} />
        <InputField title={"Pekerjaan"} type={""} textArea={false} />
        <InputField title={"Penghasilan"} type={""} textArea={false} />
        <InputField title={"Alamat"} type={""} textArea={false} />
        <InputField title={"No. Telepon"} type={""} textArea={false} />
        <InputField title={"Alamat Email"} type={""} textArea={false} />
      </div>
    </RoundedBorderLayout>
  );
};

const Wali = () => {
  return (
    <RoundedBorderLayout className={"items-start gap-4 text-[#617182]"}>
      <div className="flex flex-col space-y-4 ">
        <InputField title={"Nama Lengkap"} type={""} textArea={false} />
        <InputField title={"NIK"} type={""} textArea={false} />
        <InputField title={"Tanggal lahir"} type={""} textArea={false} />
        <InputField title={"Status Hidup"} type={""} textArea={false} />
        <InputField title={"Status Kekerabatan"} type={""} textArea={false} />
        <InputField title={"Pendidikan Terakhir"} type={""} textArea={false} />
      </div>
      <div className="flex flex-col space-y-4 ">
        <InputField title={"Pekerjaan"} type={""} textArea={false} />
        <InputField title={"Penghasilan"} type={""} textArea={false} />
        <InputField title={"Alamat"} type={""} textArea={false} />
        <InputField title={"No.Telp"} type={""} textArea={false} />
        <InputField title={"Alamat Email"} type={""} textArea={false} />
      </div>
    </RoundedBorderLayout>
  );
};

export default ParentInformation;
