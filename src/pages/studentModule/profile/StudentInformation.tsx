import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import ProfileRedirectButton from "../../../components/profile/ProfileRedirectButton";
import TabNavigationButton from "../../../components/profile/TabNavigationButton";
import RoundedBorderLayout from "../../../components/profile/RoundedBorderLayout";
import InputField from "../../../components/profile/InputBoxField";
import { Check, MapPin, Phone, SquareCheckBig, User } from "lucide-react";
import { StudentRoute } from "../../../types/VarRoutes";
import DataCard from "../../../components/profile/DataCard";

const StudentInformation = () => {
  const [activeTab, setActiveTab] = useState("data-diri");

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
              Alamat
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
      <div className="flex flex-col space-y-5 ">
        <h1 className="text-primary-green text-sm font-semibold">KTP</h1>
        <div className="h-px border-2 border-primary-green"></div>
        <DataCard title={"Kewarganegaraan*"} desc={"Indonesia"} />
        <DataCard title={"Provinsi"} desc={"Jawa Barat"} />
        <DataCard title={"Kota"} desc={"Kota Bogor"} />
        <DataCard title={"Kecamatan"} desc={"Tanah Sareal"} />
        <DataCard title={"Desa/Kelurahan"} desc={"Sukaresmi"} />
        <DataCard title={"Alamat"} desc={"Kedung Halang Sentral"} />

        <InputField
          placeholder={"15156"}
          title={"Kode Pos"}
          type={""}
          textArea={false}
        />
        <DataCard title={"Rw"} desc={"04"} />
        <DataCard title={"Rt"} desc={"02"} />
        <InputField
          placeholder={""}
          title={"Dusun"}
          type={""}
          textArea={false}
        />
      </div>
      <div className="flex flex-col space-y-5 ">
        <h1 className="text-primary-green text-sm font-semibold">
          Tempat Tinggal
        </h1>
        <div className="h-px border-2 border-primary-green"></div>
        <InputField
          placeholder={"Jawa Barat"}
          title={"Provinsi"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={"Kota Bogor"}
          title={"Kota"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={"Tanah Sareal"}
          title={"Kecamatan"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={"Sukaresmi"}
          title={"Desa/Kelurahan"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={"Kedung Halang Sentral"}
          title={"Alamat"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={"15156"}
          title={"Kode Pos"}
          type={""}
          textArea={false}
        />
        <InputField placeholder={"04"} title={"Rw"} type={""} textArea={false} />
        <InputField placeholder={"02"} title={"Rt"} type={""} textArea={false} />
        <InputField
          placeholder={""}
          title={"Dusun"}
          type={""}
          textArea={false}
        />
        <DataCard title={"Alamat sama dengan KTP?"} desc={"❌"} />
      </div>
    </RoundedBorderLayout>
  );
};

const Contact = () => {
  return (
    <RoundedBorderLayout className={"items-start gap-4 text-[#617182]"}>
      <div className="flex flex-col space-y-4 ">
        <InputField
          placeholder={"+628123456789"}
          title={"No. Whatsapp*"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={"+628123456789"}
          title={"No. HP*"}
          type={""}
          textArea={false}
        />
      </div>
      <div className="flex flex-col space-y-4 ">
        <InputField
          placeholder={""}
          title={"Email Kampus"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={"email@gmail.com"}
          title={"Email Pribadi*"}
          type={""}
          textArea={false}
        />
      </div>
    </RoundedBorderLayout>
  );
};

const PersonalProfile = () => {
  return (
    <RoundedBorderLayout className={"items-start gap-4 text-[#617182]"}>
      <div className="flex flex-col space-y-5 ">
        <DataCard title={"Nama Mahasiswa"} desc={"Muhammad Ridho Fathan"} />
        <DataCard title={"Tempat Lahir"} desc={"Bogor"} />
        <DataCard title={"Agama"} desc={"Islam"} />
        <InputField
          placeholder={""}
          title={"Suku"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={"70"}
          title={"Berat Badan"}
          type={""}
          textArea={false}
        />
        <DataCard title={"Ukuran Almamater"} desc={"XL"} />
        <DataCard title={"Status Mahasiswa"} desc={"Aktif"} />
        <DataCard title={"Kebutuhan Khusus"} desc={"Tidak"} />
      </div>
      <div className="flex flex-col space-y-5 ">
        <DataCard title={"NIK/No KTP*"} desc={"3271060000003"} />
        <DataCard title={"Tanggal Lahir"} desc={"15 Mei 2003"} />
        <DataCard title={"Jenis Kelamin"} desc={"Laki - Laki"} />
        <DataCard title={"Status Nikah"} desc={"Belum Nikah"} />
        <InputField
          placeholder={"183"}
          title={"Tinggi Badan (cm)"}
          type={""}
          textArea={false}
        />
        <DataCard title={"Golongan Darah"} desc={""} />
        <DataCard
          title={"Biodata Valid"}
          desc={<Check color="#00A65A" strokeWidth={5} />}
        />
      </div>
    </RoundedBorderLayout>
  );
};

export default StudentInformation;
