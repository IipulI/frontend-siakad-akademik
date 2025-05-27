import Biodata from "../../../biodata/Biodata";

export default function Transkrip() {
  const courses = [
    {
      no: 1,
      kodeMK: "TIF302",
      namaMataKuliah: "Kapita Selekta",
      smt: 2,
      sks: 2,
      grade: "A",
      nilaiMutu: 4.0,
      bobot: 8.0,
    },
    {
      no: 2,
      kodeMK: "TIF304",
      namaMataKuliah: "Manajemen Proyek",
      smt: 2,
      sks: 2,
      grade: "A",
      nilaiMutu: 4.0,
      bobot: 8.0,
    },
    {
      no: 3,
      kodeMK: "TIF306",
      namaMataKuliah: "Metode Penelitian",
      smt: 2,
      sks: 2,
      grade: "A",
      nilaiMutu: 4.0,
      bobot: 8.0,
    },
    {
      no: 4,
      kodeMK: "TIF322",
      namaMataKuliah: "Teknologi Multimedia + Praktikum",
      smt: 2,
      sks: 3,
      grade: "A",
      nilaiMutu: 4.0,
      bobot: 8.0,
    },
    {
      no: 5,
      kodeMK: "TIF362",
      namaMataKuliah: "E-Commerce (web)",
      smt: 2,
      sks: 3,
      grade: "A",
      nilaiMutu: 4.0,
      bobot: 8.0,
    },
    {
      no: 6,
      kodeMK: "TIF392",
      namaMataKuliah: "Kerja Praktek (KP)",
      smt: 2,
      sks: 3,
      grade: "A",
      nilaiMutu: 4.0,
      bobot: 8.0,
    },
    {
      no: 7,
      kodeMK: "TIF394",
      namaMataKuliah: "Proyek Perangkat Lunak Bidang Keilmuan",
      smt: 2,
      sks: 6,
      grade: "A",
      nilaiMutu: 4.0,
      bobot: 8.0,
    },
  ];

  const totalSKS = courses.reduce((sum, course) => sum + course.sks, 0);
  const totalBobot = courses.reduce(
    (sum, course) => sum + course.bobot * course.sks,
    0
  );
  return (
    <div className="p-4 border-1 rounded-sm shadow-sm">
      <Biodata showLine={false} />

      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-primary-green text-white">
            <tr>
              <th className="border border-gray-500 font-semibold p-2">No</th>
              <th className="border border-gray-500 font-semibold p-2">
                Kode MK
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Nama Mata Kuliah
              </th>
              <th className="border border-gray-500 font-semibold p-2">Smt</th>
              <th className="border border-gray-500 font-semibold p-2">SKS</th>
              <th className="border border-gray-500 font-semibold p-2">
                Grade
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Nilai Mutu
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Bobot
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
                  {course.kodeMK}
                </td>
                <td className="border border-gray-500 font-semibold p-2">
                  {course.namaMataKuliah}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.smt}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.sks}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.grade}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.nilaiMutu.toFixed(2)}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.bobot.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={4}
                className="border border-gray-500 p-2 font-bold text-left"
              >
                Total
              </td>
              <td className="border border-gray-500 p-2 text-center font-bold">
                {totalSKS}
              </td>
              <td colSpan={2} className="border border-gray-500"></td>
              <td className="border border-gray-500 p-2 text-center font-bold">
                394,00
              </td>
            </tr>
            <tr>
              <td
                colSpan={7}
                className="border border-gray-500 p-2 font-bold text-left"
              >
                Indeks Prestasi Kumulatif
              </td>
              <td className="border border-gray-500 p-2 text-center font-bold">
                3,75
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
