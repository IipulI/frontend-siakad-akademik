import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import ProfileRedirectButton from "../../../components/profile/ProfileRedirectButton";
import RoundedBorderLayout from "../../../components/profile/RoundedBorderLayout";
import InputField from "../../../components/profile/InputBoxField";
import { StudentRoute } from "../../../types/VarRoutes";
import { SquareCheckBig } from "lucide-react";

const EducationHistory = () => {
  return (
    <MainLayout isGreeting={false} titlePage={"Data Mahasiswa"} className={""}>
      <div className="grid md:grid-cols-8 gap-6 p-4 border-t-2 border-primary-yellow rounded-t-sm">
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
          <EducationForm />
        </div>
      </div>
    </MainLayout>
  );
};

const EducationForm = () => {
  return (
    <RoundedBorderLayout className={"items-start gap-4 text-[#617182]"}>
      <div className="flex flex-col space-y-4 ">
        <InputField
          placeholder={"SMK"}
          title={"Pendidikan Asal"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={"Jawa Barat"}
          title={"Provinsi Sekolah"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={"Kota Bogor"}
          title={"Kota/Kab Sekolah"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={"20220274 - SMKN 2 BOGOR"}
          title={"Sekolah"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={
            "Jl. Pangeran Sogiri No.404, RT.06/RW.01, Tanah Baru, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16154"
          }
          textArea={false}
          title={"Alamat sekolah"}
          type={""}
        />
      </div>
      <div className="flex flex-col space-y-4 ">
        <InputField
          placeholder={"02518652085"}
          title={"Telepon Sekolah"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"No Izajah Sekolah"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={"12345566778"}
          title={"NISN"}
          type={""}
          textArea={false}
        />
        <InputField
          placeholder={""}
          title={"File Ijazah Terakhir"}
          type={""}
          textArea={false}
        />
      </div>
    </RoundedBorderLayout>
  );
};

export default EducationHistory;
