import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import HorizontalLine from "../../../components/profile/HorizontalLine";

const StudyPlanCard = () => {
  const courses = [
    {
      code: "TIF192",
      semester: 5,
      name: "Bahasa Inggris Teknik + Praktikum (REG_B)",
      schedule: "Rabu, 10.00 - 11.40",
      sks: 2,
      lecturer: "MUHAAMMAD FURQAN, S.Pd., M.Pd.Bi",
    },
    {
      code: "TIF311",
      semester: 5,
      name: "Keamanan Informasi + Praktikum (REG_B)",
      schedule: "Sabtu, 08.00 - 09.40",
      sks: 3,
      lecturer: "BAYU ADHI PRAKOSA, S.Kom., M.T.",
    },
    {
      code: "TIF321",
      semester: 5,
      name: "Pemrograman Perangkat Bergerak + Praktikum (REG_B)",
      schedule: "Jumat, 13.00 - 14.40",
      sks: 3,
      lecturer: "SAFARUDDIN HIDAYAT AL IKHSAN, S.Kom., M.Kom",
    },
    {
      code: "TIF341",
      semester: 5,
      name: "Sistem Pakar dan Penunjang Keputusan (REG_B)",
      schedule: "Selasa, 16.00 - 16.45",
      sks: 3,
      lecturer: "Dr ERWIN HERMAWAN, S.Si., M.Sc",
    },
    {
      code: "TIF343",
      semester: 5,
      name: "User Interface and Experience (REG_B)",
      schedule: "Rabu, 13.00 - 14.00",
      sks: 2,
      lecturer: "HERSANTO FAJRI, S.Ds.,M.M.D.",
    },
    {
      code: "TIF361",
      semester: 5,
      name: "Rekayasa Perangkat Lunak Lanjut + Praktikum (REG_B)",
      schedule: "Jumat, 09.40 - 11.20",
      sks: 3,
      lecturer: "FITRAH SATRYA FAJAR KUSUMAH",
    },
    {
      code: "TIF363",
      semester: 5,
      name: "Verifikasi dan Validasi (REG_B)",
      schedule: "Senin, 13.00 - 14.40",
      sks: 3,
      lecturer: "FITRAH SATRYA FAJAR KUSUMAH",
    },
    {
      code: "TIF391",
      semester: 5,
      name: "Komputer dan Masyarakat (REG_B)",
      schedule: "Senin, 08.00 - 09.40",
      sks: 2,
      lecturer: "H. IKSAL YANUARSYAH, S.Hut., M.Sc",
    },
  ];

  return (
    <MainLayout
      isGreeting={false}
      titlePage={"Pengisian Kartu Rencana Studi"}
      className=""
    >
      <HorizontalLine />
      <div className="flex justify-between p-4 bg-[#F4F4F4] mx-auto">
        <StudyPlanCardHeader
          title={"Semester Saat Ini"}
          subtitle={"Semester 5"}
        />
        <StudyPlanCardHeader title={"Batas Total SKS"} subtitle={"24"} />
        <StudyPlanCardHeader
          title={"Periode Akademik"}
          subtitle={"2024 Ganjil"}
        />
        <StudyPlanCardHeader
          title={"Status"}
          subtitle={"KRS Sudah di Verifikasi"}
        />
        <StudyPlanCardHeader
          title={"Pembimbing Akademik"}
          subtitle={"BERLINA WULANDARI, S.T., M.KOM"}
        />
      </div>
      <InfoAlert />
      <StudyPlanCardTable courses={courses} />
    </MainLayout>
  );
};

const StudyPlanCardHeader = ({ title, subtitle }) => {
  return (
    <div className="w-full">
      <h1 className="font-semibold">{title}</h1>
      <h1 className="text-sm">{subtitle}</h1>
    </div>
  );
};

const StudyPlanCardTable = ({ courses }) => {
  return (
    <div className="mb-20">
      <div className="overflow-x-auto">
        <div
          className="text-white font-semibold py-2 px-5 pr-14 transform scale-y-[-1] w-fit bg-primary-green rounded-b-sm"
          style={{
            clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)",
          }}
        >
          <p className="transform scale-y-[-1]">KRS Tersimpan</p>
        </div>

        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-3 font-semibold border-y-3 border-x-2 border-y-primary-green">
                Nama Matkul
              </th>
              <th className="px-4 py-3 font-semibold border-y-3 border-x-2 border-y-primary-green">
                Jadwal
              </th>
              <th className="px-4 py-3 font-semibold border-y-3 border-x-2 border-y-primary-green">
                SKS
              </th>
              <th className="px-4 py-3 font-semibold border-y-3 border-x-2 border-y-primary-green">
                Semester
              </th>
              <th className="px-4 py-3 font-semibold border-y-3 border-x-2 border-y-primary-green">
                Dosen Pengajar
              </th>
              <th className="px-4 py-3 font-semibold border-y-3 border-x-2 border-y-primary-green">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="border-b-4 border-primary-green font-semibold">
            {courses.map((course, index) => (
              <tr key={index} className="text-center">
                <td className="px-4 py-3 border-y-3 border-x-2 border-y-primary-green">
                  {course.name}
                </td>
                <td className="px-4 py-3 border-y-3 border-x-2 border-y-primary-green">
                  {course.schedule}
                </td>
                <td className="px-4 py-3 border-y-3 border-x-2 border-y-primary-green">
                  {course.sks}
                </td>
                <td className="px-4 py-3 border-y-3 border-x-2 border-y-primary-green">
                  {course.semester}
                </td>
                <td className="px-4 py-3 border-y-3 border-x-2 border-y-primary-green">
                  {course.lecturer}
                </td>
                <td className="px-4 py-3 border-y-3 border-x-2 border-y-primary-green"></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className=" text-sm font-bold">
              <td className="px-4 py-2 text-left" colSpan={2}>
                TOTAL SKS
              </td>
              <td className="px-4 py-2 flex gap-2">
                {courses.reduce((acc, course) => acc + course.sks, 0)}{" "}
                <div>SKS</div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

const InfoAlert = () => {
  return (
    <div className="bg-green-100 text-green-700 p-4 px-6 rounded-md mt-4 mb-6 text-sm">
      Periode pengisian dan pengubahan <strong>KRS Teknik Informatika</strong>{" "}
      belum dibuka/sudah ditutup
    </div>
  );
};

export default StudyPlanCard;
