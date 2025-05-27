import { Eye, Trash2 } from "lucide-react";
import Biodata from "../../../biodata/Biodata";
import ButtonClick from "../ButtonClick";

export default function EditKRS() {
  const courses = [
    {
      no: 1,
      kur: "2021",
      kodeMK: "TIF322",
      mataKuliah: "Teknologi Multimedia + Praktikum",
      kelas: "REG-B",
      sks: 3,
      nilaiNumerik: "",
      nilaiHuruf: "",
      nilaiMutu: "",
      valid: "",
      lulus: "",
    },
    {
      no: 2,
      kur: "2021",
      kodeMK: "TIF322",
      mataKuliah: "Kapita Selekta",
      kelas: "REG-B",
      sks: 2,
      nilaiNumerik: "",
      nilaiHuruf: "",
      nilaiMutu: "",
      valid: "",
      lulus: "",
    },
    {
      no: 3,
      kur: "2021",
      kodeMK: "TIF322",
      mataKuliah: "Metode Penelitian",
      kelas: "REG-B",
      sks: 2,
      nilaiNumerik: "",
      nilaiHuruf: "",
      nilaiMutu: "",
      valid: "",
      lulus: "",
    },
    {
      no: 4,
      kur: "2021",
      kodeMK: "TIF322",
      mataKuliah: "E-Commerce (web)",
      kelas: "REG-B",
      sks: 2,
      nilaiNumerik: "",
      nilaiHuruf: "",
      nilaiMutu: "",
      valid: "",
      lulus: "",
    },
    {
      no: 5,
      kur: "2021",
      kodeMK: "TIF322",
      mataKuliah: "Manajemen Proyek",
      kelas: "REG-B",
      sks: 2,
      nilaiNumerik: "",
      nilaiHuruf: "",
      nilaiMutu: "",
      valid: "",
      lulus: "",
    },
    {
      no: 6,
      kur: "2021",
      kodeMK: "TIF322",
      mataKuliah: "Proyek Perangkat Lunak Bidang Keilmuan",
      kelas: "REG-B",
      sks: 6,
      nilaiNumerik: "",
      nilaiHuruf: "",
      nilaiMutu: "",
      valid: "",
      lulus: "",
    },
    {
      no: 7,
      kur: "2021",
      kodeMK: "TIF322",
      mataKuliah: "Kerja Praktek (KP)",
      kelas: "REG-B",
      sks: 2,
      nilaiNumerik: "",
      nilaiHuruf: "",
      nilaiMutu: "",
      valid: "",
      lulus: "",
    },
  ];

  const totalSKS = courses.reduce((total, course) => total + course.sks, 0);

  function Detail() {
    alert("oke see");
  }
  function Remove() {
    alert("oke remove");
  }

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
        <table className="w-full border-collapse border border-gray-500">
          <thead>
            <tr>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                No
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Kur
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Kode MK
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Mata Kuliah
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Kelas
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                SKS
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Nilai Numerik
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Nilai Huruf
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Nilai Mutu
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Valid
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Lulus
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.no} className="hover:bg-gray-100">
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.no}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.kur}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.kodeMK}
                </td>
                <td className="border border-gray-500 font-semibold p-2">
                  {course.mataKuliah}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.kelas}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.sks}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.nilaiNumerik}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.nilaiHuruf}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.nilaiMutu}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.valid}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.lulus}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  <div className="flex space-x-2">
                    <ButtonClick
                      icon={<Eye size={16} strokeWidth={3} />}
                      color={"bg-primary-blueSoft"}
                      onClick={Detail}
                    />
                    <ButtonClick
                      icon={<Trash2 size={16} strokeWidth={3} />}
                      color={"bg-red-400"}
                      onClick={Remove}
                    />
                  </div>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100">
              <td
                colSpan={5}
                className="border border-gray-500 p-2 font-bold text-left"
              >
                Jumlah SKS
              </td>
              <td className="border border-gray-500 p-2 text-center font-bold">
                {totalSKS}
              </td>
              <td
                colSpan={6}
                className="border border-gray-500 font-semibold"
              ></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
