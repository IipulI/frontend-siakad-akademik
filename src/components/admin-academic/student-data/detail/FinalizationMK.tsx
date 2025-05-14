import { Check } from "lucide-react";
import Biodata from "../../../biodata/Biodata";

export default function FinalizationMK() {
  const courses = [
    {
      no: 1,
      periode: "2024 Ganjil",
      kurikulum: "2021",
      kodeMK: "TIF302",
      namaMK: "Bahasa Inggris Teknik + Praktikum",
      sks: 2,
      wp: "W",
      grade: "AB",
      status: "Lulus",
      dipakai: true,
      adaTranskrip: true,
    },
    {
      no: 2,
      periode: "2024 Ganjil",
      kurikulum: "2021",
      kodeMK: "TIF304",
      namaMK: "Keamanan Informasi + Praktikum",
      sks: 3,
      wp: "W",
      grade: "AB",
      status: "Lulus",
      dipakai: true,
      adaTranskrip: true,
    },
    {
      no: 3,
      periode: "2024 Ganjil",
      kurikulum: "2021",
      kodeMK: "TIF306",
      namaMK: "Pemrograman Perangkat Bergerak + Praktikum",
      sks: 3,
      wp: "W",
      grade: "A",
      status: "Lulus",
      dipakai: true,
      adaTranskrip: true,
    },
    {
      no: 4,
      periode: "2024 Ganjil",
      kurikulum: "2021",
      kodeMK: "TIF322",
      namaMK: "Sistem Pakar dan Penunjang Keputusan",
      sks: 3,
      wp: "W",
      grade: "A",
      status: "Lulus",
      dipakai: true,
      adaTranskrip: true,
    },
    {
      no: 5,
      periode: "2024 Ganjil",
      kurikulum: "2021",
      kodeMK: "TIF362",
      namaMK: "User Interface and Experience",
      sks: 2,
      wp: "W",
      grade: "AB",
      status: "Lulus",
      dipakai: true,
      adaTranskrip: true,
    },
    {
      no: 6,
      periode: "2024 Ganjil",
      kurikulum: "2021",
      kodeMK: "TIF392",
      namaMK: "Rekayasa Perangkat Lunak Lanjut + Praktikum",
      sks: 3,
      wp: "W",
      grade: "A",
      status: "Lulus",
      dipakai: true,
      adaTranskrip: true,
    },
    {
      no: 7,
      periode: "2024 Ganjil",
      kurikulum: "2021",
      kodeMK: "TIF394",
      namaMK: "Verifikasi dan Validasi Perangkat Lunak",
      sks: 3,
      wp: "W",
      grade: "B",
      status: "Lulus",
      dipakai: true,
      adaTranskrip: true,
    },
    {
      no: 8,
      periode: "2024 Ganjil",
      kurikulum: "2021",
      kodeMK: "TIF394",
      namaMK: "Komputer dan Masyarakat",
      sks: 2,
      wp: "W",
      grade: "A",
      status: "Lulus",
      dipakai: true,
      adaTranskrip: true,
    },
    {
      no: 9,
      periode: "2024 Genap",
      kurikulum: "2021",
      kodeMK: "TIF302",
      namaMK: "Etika Profesi",
      sks: 2,
      wp: "W",
      grade: "A",
      status: "Lulus",
      dipakai: true,
      adaTranskrip: true,
    },
    {
      no: 10,
      periode: "2024 Genap",
      kurikulum: "2021",
      kodeMK: "TIF304",
      namaMK: "Manajemen Proyek",
      sks: 2,
      wp: "W",
      grade: "",
      status: "Belum Dikonsi",
      dipakai: false,
      adaTranskrip: false,
    },
    {
      no: 11,
      periode: "2024 Genap",
      kurikulum: "2021",
      kodeMK: "TIF306",
      namaMK: "Metode Penelitian",
      sks: 2,
      wp: "W",
      grade: "",
      status: "Belum Dikonsi",
      dipakai: false,
      adaTranskrip: false,
    },
    {
      no: 12,
      periode: "2024 Genap",
      kurikulum: "2021",
      kodeMK: "TIF322",
      namaMK: "Teknologi Multimedia + Praktikum",
      sks: 3,
      wp: "W",
      grade: "",
      status: "Belum Dikonsi",
      dipakai: false,
      adaTranskrip: false,
    },
    {
      no: 13,
      periode: "2024 Genap",
      kurikulum: "2021",
      kodeMK: "TIF362",
      namaMK: "E-Commerce (web)",
      sks: 3,
      wp: "W",
      grade: "",
      status: "Belum Dikonsi",
      dipakai: false,
      adaTranskrip: false,
    },
    {
      no: 14,
      periode: "2024 Genap",
      kurikulum: "2021",
      kodeMK: "TIF392",
      namaMK: "Kerja Praktek (KP)",
      sks: 3,
      wp: "W",
      grade: "",
      status: "Belum Dikonsi",
      dipakai: false,
      adaTranskrip: false,
    },
    {
      no: 15,
      periode: "2024 Genap",
      kurikulum: "2021",
      kodeMK: "TIF394",
      namaMK: "Proyek Perangkat Lunak Bidang Keilmuan",
      sks: 6,
      wp: "W",
      grade: "",
      status: "Belum Dikonsi",
      dipakai: false,
      adaTranskrip: false,
    },
  ];

  // Calculate total SKS
  const totalSKS = courses.reduce((acc, course) => acc + course.sks, 0);
  return (
    <div className="p-4 border-1 rounded-sm shadow-sm">
      <Biodata showLine={false} />

      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-primary-green text-white">
            <tr>
              <th className="border border-gray-500 font-semibold p-2">No</th>
              <th className="border border-gray-500 font-semibold p-2">
                Periode
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Kurikulum
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Kode MK
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Nama MK
              </th>
              <th className="border border-gray-500 font-semibold p-2">SKS</th>
              <th className="border border-gray-500 font-semibold p-2">W/P</th>
              <th className="border border-gray-500 font-semibold p-2">
                Grade
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Status
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Dipakai
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Ada di Transkrip
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.no} className="hover:bg-gray-100">
                <td className="border border-gray-500 p-2 text-center font-semibold">
                  {course.no}
                </td>
                <td className="border border-gray-500 p-2 text-center font-semibold">
                  {course.periode}
                </td>
                <td className="border border-gray-500 p-2 text-center font-semibold">
                  {course.kurikulum}
                </td>
                <td className="border border-gray-500 p-2 text-center font-semibold">
                  {course.kodeMK}
                </td>
                <td className="border border-gray-500 p-2 font-semibold">
                  {course.namaMK}
                </td>
                <td className="border border-gray-500 p-2 text-center font-semibold">
                  {course.sks}
                </td>
                <td className="border border-gray-500 p-2 text-center font-semibold">
                  {course.wp}
                </td>
                <td className="border border-gray-500 p-2 text-center font-semibold">
                  {course.grade}
                </td>
                <td className="border border-gray-500 p-2 text-center font-semibold">
                  {course.status === "Lulus" ? (
                    <span className="bg-green-700 text-white px-3 py-1 rounded text-xs">
                      Lulus
                    </span>
                  ) : (
                    <span className="bg-gray-400 text-black py-1 text-center block rounded text-xs">
                      Belum Dikonsi
                    </span>
                  )}
                </td>
                <td className="border border-gray-500 p-2 text-center font-semibold">
                  {course.dipakai ? (
                      <Check className="mx-auto" size={20} color="green" />
                  ) : (
                    <span className="text-red-500">✗</span>
                  )}
                </td>
                <td className="border border-gray-500 p-2 text-center font-semibold">
                  {course.adaTranskrip ? (
                      <Check className="mx-auto" size={20} color="green" />
                  ) : (
                    <span className="text-red-500">✗</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot></tfoot>
        </table>
      </div>
    </div>
  );
}
