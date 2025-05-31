import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import HorizontalLine from "../../../components/profile/HorizontalLine";
import Biodata from "../../../components/biodata/Biodata";
import { Trash2, X, Check } from "lucide-react";

const DetailAdvisorLecturer = () => {
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
    <>
      <HorizontalLine />
      <Biodata showLine={false} />
      <StudyPlanCardTable courses={courses} />
    </>
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
    <div className="mb-20 mt-4">
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
              <th className="px-4 py-3 font-semibold border-y-3 border-x-2 border-y-primary-green">Nama Matkul</th>
              <th className="px-4 py-3 font-semibold border-y-3 border-x-2 border-y-primary-green">Jadwal</th>
              <th className="px-4 py-3 font-semibold border-y-3 border-x-2 border-y-primary-green">SKS</th>
              <th className="px-4 py-3 font-semibold border-y-3 border-x-2 border-y-primary-green">Semester</th>
              <th className="px-4 py-3 font-semibold border-y-3 border-x-2 border-y-primary-green">Dosen Pengajar</th>
              <th className="px-4 py-3 font-semibold border-y-3 border-x-2 border-y-primary-green">Status</th>
              <th className="px-4 py-3 font-semibold border-y-3 border-x-2 border-y-primary-green text-center">
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded flex items-center gap-2 text-xs font-semibold mx-auto">
                  <Trash2 size={16} /> Hapus Semua
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="border-b-4 border-primary-green font-semibold">
            {courses.map((course, index) => (
              <tr key={index} className="text-center">
                <td className="px-4 py-3 border-y-3 border-x-2 border-y-primary-green">{course.name}</td>
                <td className="px-4 py-3 border-y-3 border-x-2 border-y-primary-green">{course.schedule}</td>
                <td className="px-4 py-3 border-y-3 border-x-2 border-y-primary-green">{course.sks}</td>
                <td className="px-4 py-3 border-y-3 border-x-2 border-y-primary-green">{course.semester}</td>
                <td className="px-4 py-3 border-y-3 border-x-2 border-y-primary-green">{course.lecturer}</td>
                <td className="px-4 py-3 border-y-3 border-x-2 border-y-primary-green"></td>
                <td className="px-4 py-3 border-y-3 border-x-2 border-y-primary-green text-center">
                  <button className="text-red-500 hover:text-red-700 mx-auto">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className=" text-sm font-bold">
              <td className="px-4 py-2 text-left" colSpan={2}>
                TOTAL SKS
              </td>
              <td className="px-4 py-2 flex gap-2">
                {courses.reduce((acc, course) => acc + course.sks, 0)} <div>SKS</div>
              </td>
              <td colSpan={4}></td>
            </tr>
          </tfoot>
        </table>
      </div>
      {/* Action Buttons */}
      <div className="flex gap-4 justify-start mt-6">
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-semibold flex items-center gap-2">
          <X size={18} /> Batalkan KRS
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold flex items-center gap-2">
          <Check size={18} /> Setujui KRS
        </button>
      </div>
    </div>
  );
};


export default DetailAdvisorLecturer;
