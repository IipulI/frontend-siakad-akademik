import React from "react";
import MainLayout from "../../components/layouts/MainLayout";
import profile_logo from "../../../public/img/profile_logo.png";
import { Link } from "react-router-dom";
import ProfileRedirectButton from "../../components/profile/ProfileRedirectButton";

const StudentInformation = () => {
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
        <div className="col-span-4">
          <h1>Hellow World</h1>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentInformation;
