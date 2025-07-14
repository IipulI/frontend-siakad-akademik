import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import ProfileRedirectButton from "../../../components/profile/ProfileRedirectButton";
import TabNavigationButton from "../../../components/profile/TabNavigationButton";
import RoundedBorderLayout from "../../../components/profile/RoundedBorderLayout";
import DataCard from "../../../components/profile/DataCard";
import { Check, MapPin, Phone, SquareCheckBig, User } from "lucide-react";
import { StudentRoute } from "../../../types/VarRoutes";
import { MahasiswaProfile } from "../../../types/mahasiswa.types";

// Hooks
import { useAccountInfo } from "../../../hooks/useAccountInfo";
import { useMahasiswaProfile } from "../../../hooks/mahasiswa/useProfile";

// Child Component: Displays personal data
const PersonalProfile = ({ profile }: { profile: MahasiswaProfile }) => {
  return (
      <RoundedBorderLayout className={"items-start gap-4 text-[#617182]"}>
        <div className="flex flex-col space-y-5 ">
          <DataCard title={"Nama Mahasiswa"} desc={profile.nama || "-"} />
          <DataCard title={"Tempat Lahir"} desc={profile.tempatLahir || "-"} />
          <DataCard title={"Agama"} desc={profile.agama || "-"} />
          <DataCard title={"Status Mahasiswa"} desc={profile.statusMahasiswa || "-"} />
          <DataCard title={"Berat Badan"} desc={profile.beratBadan ? `${profile.beratBadan} kg` : "-"} />
          <DataCard title={"Kebutuhan Khusus"} desc={profile.kebutuhanKhusus ? "Ya" : "Tidak"} />
        </div>
        <div className="flex flex-col space-y-5 ">
          <DataCard title={"NIK/No KTP*"} desc={profile.nik || "-"} />
          <DataCard title={"Tanggal Lahir"} desc={profile.tanggalLahir || "-"} />
          <DataCard title={"Jenis Kelamin"} desc={profile.jenisKelamin || "-"} />
          <DataCard title={"Tinggi Badan (cm)"} desc={profile.tinggiBadan ? `${profile.tinggiBadan} cm` : "-"} />
          <DataCard title={"Golongan Darah"} desc={profile.golonganDarah || "-"} />
          <DataCard title={"Biodata Valid"} desc={<Check color="#00A65A" strokeWidth={5} />} />
        </div>
      </RoundedBorderLayout>
  );
};

// Child Component: Displays address data
const Domicile = ({ profile }: { profile: MahasiswaProfile }) => {
  return (
      <RoundedBorderLayout className={" items-start gap-4 text-[#617182]"}>
        <div className="flex flex-col space-y-5 ">
          <h1 className="text-primary-green text-sm font-semibold">Alamat KTP</h1>
          <div className="h-px border-2 border-primary-green"></div>
          <DataCard title={"Alamat"} desc={profile.alamatKtp || "-"} />
          <DataCard title={"Provinsi"} desc={profile.provinsiKtp || "-"} />
          <DataCard title={"Desa/Kelurahan"} desc={profile.desaKtp || "-"} />
          <DataCard title={"RT / RW"} desc={`${profile.rtKtp || "-"} / ${profile.rwKtp || "-"}`} />
          <DataCard title={"Kode Pos"} desc={profile.kodePosKtp || "-"} />
          <DataCard title={"Status Tinggal"} desc={profile.statusTinggalKtp || "-"} />
        </div>
        <div className="flex flex-col space-y-5 ">
          <h1 className="text-primary-green text-sm font-semibold">Alamat Domisili</h1>
          <div className="h-px border-2 border-primary-green"></div>
          <DataCard title={"Alamat"} desc={profile.alamatDomisili || "-"} />
          <DataCard title={"Provinsi"} desc={profile.provinsiDomisili || "-"} />
          <DataCard title={"Desa/Kelurahan"} desc={profile.desaDomisili || "-"} />
          <DataCard title={"RT / RW"} desc={`${profile.rtDomisili || "-"} / ${profile.rwDomisili || "-"}`} />
          <DataCard title={"Kode Pos"} desc={profile.kodePosDomisili || "-"} />
          <DataCard title={"Status Tinggal"} desc={profile.statusTinggalDomisili || "-"} />
        </div>
      </RoundedBorderLayout>
  );
};

// Child Component: Displays contact data
const Contact = ({ profile }: { profile: MahasiswaProfile }) => {
  return (
      <RoundedBorderLayout className={"items-start gap-4 text-[#617182]"}>
        <div className="flex flex-col space-y-4 ">
          <DataCard title={"No. HP*"} desc={profile.noHp || "-"} />
          <DataCard title={"No. Telepon"} desc={profile.noTelepon || "-"} />
        </div>
        <div className="flex flex-col space-y-4 ">
          <DataCard title={"Email Kampus"} desc={profile.emailKampus || "-"} />
          <DataCard title={"Email Pribadi*"} desc={profile.emailPribadi || "-"} />
        </div>
      </RoundedBorderLayout>
  );
};


// ⭐️ Main Page Component ⭐️
const StudentInformation = () => {
  const [activeTab, setActiveTab] = useState("data-diri");

  // 1. Get user info directly from localStorage using our custom hook
  const accountInfo = useAccountInfo();

  // 2. Fetch the detailed profile using the ID from the account info
  const { profile, loading, error } = useMahasiswaProfile(accountInfo?.id || null);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  // 3. Handle loading and error states while data is being fetched
  if (loading) {
    return (
        <MainLayout titlePage="Data Mahasiswa">
          <div className="p-4">Loading Profile... ⏳</div>
        </MainLayout>
    );
  }

  if (error || !profile) {
    return (
        <MainLayout titlePage="Data Mahasiswa">
          <div className="p-4 text-red-500">Error: {error || "Profile data not found"} ❌</div>
        </MainLayout>
    );
  }

  // 4. Render the full page with the fetched data
  return (
      <MainLayout isGreeting={false} titlePage={"Data Mahasiswa"}>
        <div className="grid sm:grid-cols-2 md:grid-cols-8 gap-6 p-4 border-t-2 border-primary-yellow rounded-t-sm">
          {/* Sidebar */}
          <div className="md:col-span-2">
            <div className="bg-white p-4 flex flex-col items-center rounded-md shadow-md space-y-3 text-sm font-semibold">
              <img
                  width={150}
                  src="/img/profile_logo.png"
                  alt="Profile"
                  className="border-2 shadow rounded-full"
              />
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
            <div className="p-1 bg-[#dddddd] rounded-xl flex w-full justify-between">
              <TabNavigationButton icon={<User size={18} />} isActive={activeTab === "data-diri"} onClick={() => handleTabClick("data-diri")}>Data Diri</TabNavigationButton>
              <TabNavigationButton icon={<MapPin size={18} />} isActive={activeTab === "domisili"} onClick={() => handleTabClick("domisili")}>Alamat</TabNavigationButton>
              <TabNavigationButton icon={<Phone size={18} />} isActive={activeTab === "kontak"} onClick={() => handleTabClick("kontak")}>Kontak</TabNavigationButton>
            </div>

            {/* Pass the fetched `profile` data down to the correct child component */}
            {activeTab === "data-diri" && <PersonalProfile profile={profile} />}
            {activeTab === "domisili" && <Domicile profile={profile} />}
            {activeTab === "kontak" && <Contact profile={profile} />}
          </div>
        </div>
      </MainLayout>
  );
};

export default StudentInformation;