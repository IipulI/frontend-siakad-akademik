import Biodata from "../../../biodata/Biodata";

export default function StudyPlanCard() {
  const courses = [
    {
      no: 1,
      kodeMK: "TIF302",
      namaMataKuliah: "Kapita Selekta",
      kelas: "REG_B",
      sks: 2,
      hari: "Kamis",
      jam: "09.40-11.20",
      ruangan: "206",
      dosenPengajar: "Dewi Primasari, S.Si., M.M",
    },
    {
      no: 2,
      kodeMK: "TIF304",
      namaMataKuliah: "Manajemen Proyek",
      kelas: "REG_B",
      sks: 2,
      hari: "Jumat",
      jam: "08.00-09.40",
      ruangan: "302",
      dosenPengajar: "Fitrah Satrya Fajar Kusumah",
    },
    {
      no: 3,
      kodeMK: "TIF306",
      namaMataKuliah: "Metode Penelitian",
      kelas: "REG_B",
      sks: 2,
      hari: "Selasa",
      jam: "13.00-14.40",
      ruangan: "202",
      dosenPengajar: "Safaruddin Hidayat Ali Ikhsan, S.Kom., M.Kom",
    },
    {
      no: 4,
      kodeMK: "TIF322",
      namaMataKuliah: "Teknologi Multimedia + Praktikum",
      kelas: "REG_B",
      sks: 3,
      hari: "Kamis",
      jam: "13.00-14.40",
      ruangan: "206",
      dosenPengajar: "Hersanto Fajri, S.Ds.,M.M.D.",
    },
    {
      no: 5,
      kodeMK: "TIF362",
      namaMataKuliah: "E-Commerce (web)",
      kelas: "REG_B",
      sks: 3,
      hari: "Rabu",
      jam: "13.00-14.40",
      ruangan: "308",
      dosenPengajar: "Ina Novianty, S.ST., M.M.S.I",
    },
    {
      no: 6,
      kodeMK: "TIF392",
      namaMataKuliah: "Kerja Praktek (KP)",
      kelas: "REG_B",
      sks: 3,
      hari: "Senin",
      jam: "07.00-07.30",
      ruangan: "LAB04",
      dosenPengajar: "-",
    },
    {
      no: 7,
      kodeMK: "TIF394",
      namaMataKuliah: "Proyek Perangkat Lunak Bidang Keilmuan",
      kelas: "REG_B",
      sks: 6,
      hari: "Jumat",
      jam: "13.00-17.00",
      ruangan: "304",
      dosenPengajar: "Fitrah Satrya Fajar Kusumah",
    },
  ];

  const totalSKS = courses.reduce((sum, course) => sum + course.sks, 0);
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

      <div className="mt-4 overflow-x-auto">
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
              <th className="border border-gray-500 font-semibold p-2">
                Kelas
              </th>
              <th className="border border-gray-500 font-semibold p-2">SKS</th>
              <th className="border border-gray-500 font-semibold p-2">Hari</th>
              <th className="border border-gray-500 font-semibold p-2">Jam</th>
              <th className="border border-gray-500 font-semibold p-2">
                Ruangan
              </th>
              <th className="border border-gray-500 font-semibold p-2">
                Dosen Pengajar
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
                  {course.kelas}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.sks}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.hari}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.jam}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.ruangan}
                </td>
                <td className="border border-gray-500 font-semibold p-2">
                  {course.dosenPengajar}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={4}
                className="border border-gray-500 text-center p-2 font-bold"
              >
                Total SKS
              </td>
              <td className="border border-gray-500 p-2 text-center font-semibold">
                {totalSKS}
              </td>
              <td
                colSpan={4}
                className="border border-gray-500 font-bold p-2 text-left"
              ></td>
            </tr>
            <tr>
              <td
                colSpan={4}
                className="border border-gray-500 p-2 font-bold text-center"
              >
                Batas SKS
              </td>
              <td className="border border-gray-500 p-2 text-center font-semibold">
                14
              </td>
              <td
                colSpan={4}
                className="border border-gray-500 font-bold p-2 text-left"
              ></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
