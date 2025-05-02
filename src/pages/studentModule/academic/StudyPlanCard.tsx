import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import HorizontalLine from "../../../components/profile/HorizontalLine";

const StudyPlanCard = () => {
  const courses = [
    {
      code: "TIF192",
      name: "Bahasa Inggris Teknik + Praktikum (REG_B)",
      schedule: "Rabu, 10.00 - 11.40",
      sks: 2,
      lecturer: "MUHAAMMAD FURQAN, S.Pd., M.Pd.Bi",
    },
    {
      code: "TIF311",
      name: "Keamanan Informasi + Praktikum (REG_B)",
      schedule: "Sabtu, 08.00 - 09.40",
      sks: 3,
      lecturer: "BAYU ADHI PRAKOSA, S.Kom., M.T.",
    },
    {
      code: "TIF321",
      name: "Pemrograman Perangkat Bergerak + Praktikum (REG_B)",
      schedule: "Jumat, 13.00 - 14.40",
      sks: 3,
      lecturer: "SAFARUDDIN HIDAYAT AL IKHSAN, S.Kom., M.Kom",
    },
    {
      code: "TIF341",
      name: "Sistem Pakar dan Penunjang Keputusan (REG_B)",
      schedule: "Selasa, 16.00 - 16.45",
      sks: 3,
      lecturer: "Dr ERWIN HERMAWAN, S.Si., M.Sc",
    },
    {
      code: "TIF343",
      name: "User Interface and Experience (REG_B)",
      schedule: "Rabu, 13.00 - 14.00",
      sks: 2,
      lecturer: "HERSANTO FAJRI, S.Ds.,M.M.D.",
    },
    {
      code: "TIF361",
      name: "Rekayasa Perangkat Lunak Lanjut + Praktikum (REG_B)",
      schedule: "Jumat, 09.40 - 11.20",
      sks: 3,
      lecturer: "FITRAH SATRYA FAJAR KUSUMAH",
    },
    {
      code: "TIF363",
      name: "Verifikasi dan Validasi (REG_B)",
      schedule: "Senin, 13.00 - 14.40",
      sks: 3,
      lecturer: "FITRAH SATRYA FAJAR KUSUMAH",
    },
    {
      code: "TIF391",
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
      </div>
      <InfoAlert />
      <StudyPlanCardTable courses={courses} />
    </MainLayout>
  );
};

const StudyPlanCardHeader = ({ title, subtitle }) => {
  return (
    <div className="w-full">
      <h1 className="font-semibold text-lg">{title}</h1>
      <h1>{subtitle}</h1>
    </div>
  );
};

const StudyPlanCardTable = ({ courses }) => {
  return (
    <div className="pt-4">
      <div className="overflow-x-auto">
        <div className="border-2 p-4 w-fit border-primary-green">
          KRS Tersimpan
        </div>
        <table className="min-w-full bg-white border border-primary-green">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border border-primary-green">
                Nama Matkul
              </th>
              <th className="px-4 py-2 border border-primary-green">Jadwal</th>
              <th className="px-4 py-2 border border-primary-green">SKS</th>
              <th className="px-4 py-2 border border-primary-green">
                Dosen Pengajar
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index} className="text-center">
                <td className="px-4 py-2 border border-primary-green">
                  {course.name}
                </td>
                <td className="px-4 py-2 border border-primary-green">
                  {course.schedule}
                </td>
                <td className="px-4 py-2 border border-primary-green">
                  {course.sks}
                </td>
                <td className="px-4 py-2 border border-primary-green">
                  {course.lecturer}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td
                className="px-4 py-2 border border-primary-green text-right"
                colSpan={2}
              >
                TOTAL SKS
              </td>
              <td className="px-4 py-2 border border-primary-green text-center">
                {courses.reduce((acc, course) => acc + course.sks, 0)}
              </td>
              <td className="px-4 py-2 border border-primary-green"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

const InfoAlert = () => {
  return (
    <div className="bg-green-100 text-green-700 p-3 rounded-md mt-4 mb-6 text-sm">
      Periode pengisian dan pengubahan <strong>KRS Teknik Informatika</strong>{" "}
      belum dibuka/sudah ditutup
    </div>
  );
};

export default StudyPlanCard;
