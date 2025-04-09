import React, { useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import profile_logo from "../../../public/img/profile_logo.png";
import { Link } from "react-router-dom";
import ProfileRedirectButton from "../../components/profile/ProfileRedirectButton";
import TabNavigationButton from "../../components/profile/TabNavigationButton";
import RoundedBorderLayout from "../../components/profile/RoundedBorderLayout";
import InputField from "../../components/profile/ProfileInputField";

const StudentInformation = () => {
  const [activeTab, setActiveTab] = useState("data-diri");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <MainLayout isGreeting={false} titlePage={"Data Mahasiswa"}>
      <div className="h-px border border-primary-green"></div>

      <div className="grid sm:grid-cols-2 md:grid-cols-6 gap-6 p-4">
        <div className="md:col-span-2">
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
        <div className="md:col-span-4 space-y-4">
          <div className="p-1 bg-[#dddddd] rounded-xl flex w-full justify-between">
            <TabNavigationButton
              isActive={activeTab === "data-diri"}
              onClick={() => handleTabClick("data-diri")}
            >
              Data Diri
            </TabNavigationButton>
            <TabNavigationButton
              isActive={activeTab === "domisili"}
              onClick={() => handleTabClick("domisili")}
            >
              Domisili
            </TabNavigationButton>
            <TabNavigationButton
              isActive={activeTab === "kontak"}
              onClick={() => handleTabClick("kontak")}
            >
              Kontak
            </TabNavigationButton>
          </div>
          {activeTab === "data-diri" && <PersonalProfile />}
          {activeTab === "domisili" && <Domicile />}
          {activeTab === "kontak" && <Contact />}
        </div>
      </div>
    </MainLayout>
  );
};

const Domicile = () => {
  return (
    <RoundedBorderLayout className={" items-start gap-4 text-[#617182]"}>
      <div className="flex flex-col space-y-4 ">
        <h1 className="text-primary-green text-sm font-semibold">KTP</h1>
        <div className="h-px border-2 border-primary-green"></div>
        <InputField title={"Alamat"} />
        <InputField title={"RT"} />
        <InputField title={"RW"} />
        <InputField title={"Dusun"} />
        <InputField title={"Desa/Kelurahan"} />
        <InputField title={"Provinsi"} />
        <InputField title={"Kota"} />
        <InputField title={"Kecamatan"} />
        <InputField title={"Kode/Pos"} />
        <InputField title={"Alamat(Sesuai KTP)"} />
      </div>
      <div className="flex flex-col space-y-4 ">
        <h1 className="text-primary-green text-sm font-semibold">
          Tempat Tinggal
        </h1>
        <div className="h-px border-2 border-primary-green"></div>
        <InputField title={"Alamat"} />
        <InputField title={"RT"} />
        <InputField title={"RW"} />
        <InputField title={"Dusun"} />
        <InputField title={"Desa/Kelurahan"} />
        <InputField title={"Provinsi"} />
        <InputField title={"Kota"} />
        <InputField title={"Kecamatan"} />
        <InputField title={"Kode/Pos"} />
        <InputField title={"Alamat(Sesuai KTP)"} />
      </div>
    </RoundedBorderLayout>
  );
};

const Contact = () => {
  return (
    <RoundedBorderLayout className={"items-start gap-4 text-[#617182]"}>
      <div className="flex flex-col space-y-4 ">
        <InputField title={"No.Telepon"} />
        <InputField title={"No. HP"} />
        <InputField title={"Kepemilikan"} />
      </div>
      <div className="flex flex-col space-y-4 ">
        <InputField title={"Email Kampus"} />
        <InputField title={"Email Pribadi"} />
      </div>
    </RoundedBorderLayout>
  );
};

const PersonalProfile = () => {
  return (
    <RoundedBorderLayout className={"items-start gap-4 text-[#617182]"}>
      <div className="flex flex-col space-y-4 ">
        <InputField title={"NIM"} />
        <InputField title={"Nama Mahasiswa"} />
        <InputField title={"Program Studi"} />
        <InputField title={"Konsentrasi"} />
        <InputField title={"Periode Masuk"} />
        <InputField title={"Tahun Kurikulum"} />
        <InputField title={"Kelas/Kelompok"} />
      </div>
      <div className="flex flex-col space-y-4 ">
        <InputField title={"Jenis Pendaftaran"} />
        <InputField title={"Jalur Pendaftaran"} />
        <InputField title={"Gelombang"} />
        <InputField title={"Tanggal Masuk"} />
        <InputField title={"Kebutuhan Khusus"} />
        <InputField title={"Status Mahasiswa"} />
        <InputField title={"Kampus"} />
      </div>
    </RoundedBorderLayout>
  );
};

export default StudentInformation;
