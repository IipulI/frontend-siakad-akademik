import React, { useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import ProfileRedirectButton from "../../components/profile/ProfileRedirectButton";
import TabNavigationButton from "../../components/profile/TabNavigationButton";
import RoundedBorderLayout from "../../components/profile/RoundedBorderLayout";
import InputField from "../../components/profile/InputBoxField";
import { MapPin, Phone, User } from "lucide-react";
import HorizontalLine from "../../components/profile/HorizontalLine";

const StudentInformation = () => {
  const [activeTab, setActiveTab] = useState("data-diri");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <MainLayout isGreeting={false} titlePage={"Data Mahasiswa"} className={""}>
      <HorizontalLine />
      <div className="grid sm:grid-cols-2 md:grid-cols-6 gap-6 p-4">
        <div className="md:col-span-2">
          <div className="bg-white p-4 flex flex-col items-center rounded-md shadow-md space-y-3 text-sm font-semibold">
            <img width={150} src="/img/profile_logo.png" alt="" />
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
              icon={<User size={18} />}
              isActive={activeTab === "data-diri"}
              onClick={() => handleTabClick("data-diri")}
            >
              Data Diri
            </TabNavigationButton>
            <TabNavigationButton
              icon={<MapPin size={18} />}
              isActive={activeTab === "domisili"}
              onClick={() => handleTabClick("domisili")}
            >
              Domisili
            </TabNavigationButton>
            <TabNavigationButton
              icon={<Phone size={18} />}
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
        <InputField title={"Alamat"} type={""} textArea={false} />
        <InputField title={"RT"} type={""} textArea={false} />
        <InputField title={"RW"} type={""} textArea={false} />
        <InputField title={"Dusun"} type={""} textArea={false} />
        <InputField title={"Desa/Kelurahan"} type={""} textArea={false} />
        <InputField title={"Provinsi"} type={""} textArea={false} />
        <InputField title={"Kota"} type={""} textArea={false} />
        <InputField title={"Kecamatan"} type={""} textArea={false} />
        <InputField title={"Kode/Pos"} type={""} textArea={false} />
        <InputField title={"Alamat(Sesuai KTP)"} type={""} textArea={false} />
      </div>
      <div className="flex flex-col space-y-4 ">
        <h1 className="text-primary-green text-sm font-semibold">
          Tempat Tinggal
        </h1>
        <div className="h-px border-2 border-primary-green"></div>
        <InputField title={"Alamat"} type={""} textArea={false} />
        <InputField title={"RT"} type={""} textArea={false} />
        <InputField title={"RW"} type={""} textArea={false} />
        <InputField title={"Dusun"} type={""} textArea={false} />
        <InputField title={"Desa/Kelurahan"} type={""} textArea={false} />
        <InputField title={"Provinsi"} type={""} textArea={false} />
        <InputField title={"Kota"} type={""} textArea={false} />
        <InputField title={"Kecamatan"} type={""} textArea={false} />
        <InputField title={"Kode/Pos"} type={""} textArea={false} />
        <InputField title={"Alamat(Sesuai KTP)"} type={""} textArea={false} />
      </div>
    </RoundedBorderLayout>
  );
};

const Contact = () => {
  return (
    <RoundedBorderLayout className={"items-start gap-4 text-[#617182]"}>
      <div className="flex flex-col space-y-4 ">
        <InputField title={"No.Telepon"} type={""} textArea={false} />
        <InputField title={"No. HP"} type={""} textArea={false} />
        <InputField title={"Kepemilikan"} type={""} textArea={false} />
      </div>
      <div className="flex flex-col space-y-4 ">
        <InputField title={"Email Kampus"} type={""} textArea={false} />
        <InputField title={"Email Pribadi"} type={""} textArea={false} />
      </div>
    </RoundedBorderLayout>
  );
};

const PersonalProfile = () => {
  return (
    <RoundedBorderLayout className={"items-start gap-4 text-[#617182]"}>
      <div className="flex flex-col space-y-4 ">
        <InputField title={"NIM"} type={""} textArea={false} />
        <InputField title={"Nama Mahasiswa"} type={""} textArea={false} />
        <InputField title={"Program Studi"} type={""} textArea={false} />
        <InputField title={"Konsentrasi"} type={""} textArea={false} />
        <InputField title={"Periode Masuk"} type={""} textArea={false} />
        <InputField title={"Tahun Kurikulum"} type={""} textArea={false} />
        <InputField title={"Kelas/Kelompok"} type={""} textArea={false} />
      </div>
      <div className="flex flex-col space-y-4 ">
        <InputField title={"Jenis Pendaftaran"} type={""} textArea={false} />
        <InputField title={"Jalur Pendaftaran"} type={""} textArea={false} />
        <InputField title={"Gelombang"} type={""} textArea={false} />
        <InputField title={"Tanggal Masuk"} type={""} textArea={false} />
        <InputField title={"Kebutuhan Khusus"} type={""} textArea={false} />
        <InputField title={"Status Mahasiswa"} type={""} textArea={false} />
        <InputField title={"Kampus"} type={""} textArea={false} />
      </div>
    </RoundedBorderLayout>
  );
};

export default StudentInformation;
