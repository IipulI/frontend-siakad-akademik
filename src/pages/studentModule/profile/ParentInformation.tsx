import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import ProfileRedirectButton from "../../../components/profile/ProfileRedirectButton";
import TabNavigationButton from "../../../components/profile/TabNavigationButton";
import RoundedBorderLayout from "../../../components/profile/RoundedBorderLayout";
import InputField from "../../../components/profile/InputBoxField";
import { SquareCheckBig, Users } from "lucide-react";
import { StudentRoute } from "../../../types/VarRoutes";
import DataCard from "../../../components/profile/DataCard";

const ParentInformation = () => {
  const [activeTab, setActiveTab] = useState("orang-tua");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <MainLayout isGreeting={false} titlePage={"Data Mahasiswa"} className={""}>
      <div className="grid sm:grid-cols-2 md:grid-cols-8 gap-6 p-4 border-t-2 border-primary-yellow rounded-t-sm">
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
      <div className="flex flex-col space-y-5 ">
        <h1 className="text-primary-green text-sm font-semibold">
          Biodata Ayah
        </h1>
        <div className="h-px border-2 border-primary-green"></div>
        <DataCard title={"Nama Lengkap"} desc={"Steven"} />
        <InputField
          placeholder={"32710600000001"}
          title={"NIK"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={"01 April 2025"}
          title={"Tanggal Lahir"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"Status Hidup"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"Status Kekerabatan"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"Pendidikan Terakhir"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"Pekerjaan"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"Penghasilan"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"Alamat"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={"+628123456789"}
          title={"No. Telepon"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={"ayah@gmail.com"}
          title={"Alamat Email"}
          type={""}
          textArea={false}
        />
      </div>
      <div className="flex flex-col space-y-5 ">
        <h1 className="text-primary-green text-sm font-semibold">
          Biodata Ibu
        </h1>
        <div className="h-px border-2 border-primary-green"></div>
        <DataCard title={"Nama Lengkap"} desc={"Juliet"} />

        <InputField
          placeholder={"32710600000001"}
          title={"NIK"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={"02 April 2025"}
          title={"Tanggal Lahir"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"Status Hidup"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"Status Kekerabatan"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"Pendidikan Terakhir"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"Pekerjaan"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"Penghasilan"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"Alamat"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={"+628123456789"}
          title={"No. Telepon"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={"ibu@gmail.com"}
          title={"Alamat Email"}
          type={""}
          textArea={false}
        />
      </div>
    </RoundedBorderLayout>
  );
};

const Wali = () => {
  return (
    <RoundedBorderLayout className={"items-start gap-4 text-[#617182]"}>
      <div className="flex flex-col space-y-5 ">
        <InputField
          placeholder={""}
          title={"Nama Lengkap"}
          type={""}
          textArea={false}
        />
        <InputField placeholder={""} title={"NIK"} type={""} textArea={false} />
        <InputField
          placeholder={""}
          title={"Tanggal lahir"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"Status Hidup"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"Status Kekerabatan"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"Pendidikan Terakhir"}
          type={""}
          textArea={false}
        />
      </div>
      <div className="flex flex-col space-y-5 ">
        <InputField
          placeholder={""}
          title={"Pekerjaan"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"Penghasilan"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"Alamat"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"No.Telepon"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"Alamat Email"}
          type={""}
          textArea={false}
        />
      </div>
    </RoundedBorderLayout>
  );
};

export default ParentInformation;
