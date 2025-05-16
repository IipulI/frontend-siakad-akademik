import { Check } from "lucide-react";
import Biodata from "../../../biodata/Biodata";

export default function StudyResultCard() {
  const courses = [
    {
      no: 1,
      kodeMK: "TIF302",
      namaMataKuliah: "Kapita Selekta",
      sks: 2,
      nilaiMutu: 4.0,
      bobot: 8,
      nilai: "A",
      keterangan: "",
      transkrip: true,
    },
    {
      no: 2,
      kodeMK: "TIF304",
      namaMataKuliah: "Manajemen Proyek",
      sks: 2,
      nilaiMutu: 4.0,
      bobot: 8,
      nilai: "A",
      keterangan: "",
      transkrip: true,
    },
    {
      no: 3,
      kodeMK: "TIF306",
      namaMataKuliah: "Metode Penelitian",
      sks: 2,
      nilaiMutu: 4.0,
      bobot: 8,
      nilai: "A",
      keterangan: "",
      transkrip: true,
    },
    {
      no: 4,
      kodeMK: "TIF322",
      namaMataKuliah: "Teknologi Multimedia + Praktikum",
      sks: 3,
      nilaiMutu: 4.0,
      bobot: 8,
      nilai: "A",
      keterangan: "",
      transkrip: true,
    },
    {
      no: 5,
      kodeMK: "TIF362",
      namaMataKuliah: "E-Commerce (web)",
      sks: 3,
      nilaiMutu: 4.0,
      bobot: 8,
      nilai: "A",
      keterangan: "",
      transkrip: true,
    },
    {
      no: 6,
      kodeMK: "TIF392",
      namaMataKuliah: "Kerja Praktek (KP)",
      sks: 3,
      nilaiMutu: 4.0,
      bobot: 8,
      nilai: "A",
      keterangan: "",
      transkrip: true,
    },
    {
      no: 7,
      kodeMK: "TIF394",
      namaMataKuliah: "Proyek Perangkat Lunak Bidang Keilmuan",
      sks: 6,
      nilaiMutu: 4.0,
      bobot: 8,
      nilai: "A",
      keterangan: "",
      transkrip: true,
    },
  ];

  const totalSKS = courses.reduce((sum, course) => sum + course.sks, 0);
  const totalBobot = courses.reduce(
    (sum, course) => sum + course.bobot * course.sks,
    0
  );
  const ips = (totalBobot / totalSKS).toFixed(2);
  return (
    <div className="p-4 border-1 rounded-sm shadow-sm">
      <Biodata showLine={false} />

      <div className="flex items-center space-x-2 mt-4">
        <label htmlFor="" className="text-sm font-medium">
          Periode
        </label>
        <select name="" id="" className="border-2 rounded p-1 text-sm w-40">
          <option value="2024">2024 Genap</option>
        </select>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-primary-green text-white">
            <tr>
              <th className="border border-gray-500 font-semibold p-2">No</th>
              <th className="border border-gray-500 font-semibold p-2">Kode MK</th>
              <th className="border border-gray-500 font-semibold p-2">Nama Mata Kuliah</th>
              <th className="border border-gray-500 font-semibold p-2">SKS</th>
              <th className="border border-gray-500 font-semibold p-2">Nilai Mutu</th>
              <th className="border border-gray-500 font-semibold p-2">Bobot</th>
              <th className="border border-gray-500 font-semibold p-2">Nilai</th>
              <th className="border border-gray-500 font-semibold p-2">Keterangan</th>
              <th className="border border-gray-500 font-semibold p-2">Transkrip</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.no} className="hover:bg-gray-100">
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.no}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.kodeMK}
                </td>
                <td className="border border-gray-500 font-semibold p-2">
                  {course.namaMataKuliah}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.sks}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.nilaiMutu.toFixed(2)}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.bobot}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.nilai}
                </td>
                <td className="border border-gray-500 font-semibold p-2">
                  {course.keterangan}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.transkrip && (
                    <Check className="mx-auto" size={20} color="green" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={3}
                className="border border-gray-500 p-2 font-bold text-center"
              >
                Total SKS
              </td>
              <td className="border border-gray-500 font-semibold p-2 text-center">
                {totalSKS}
              </td>
              <td colSpan={5} className="border border-gray-500 font-semibold"></td>
            </tr>
            <tr>
              <td
                colSpan={3}
                className="border border-gray-500 font-bold p-2 text-center"
              >
                Indeks Prestasi Semester
              </td>
              <td className="border border-gray-500 font-semibold p-2 text-center">
                3,75
              </td>
              <td colSpan={5} className="border border-gray-500 font-semibold"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
