import Biodata from "../../../biodata/Biodata";

export default function CollegeGrades() {
  const courses = [
    {
      kurikulum: "2021",
      kodeMK: "TIF362",
      namaMataKuliah: "E-Commerce",
      namaKelas: "REG_A",
      komponen: 18,
      persentase: 18,
      nilai: 18,
      nilaiAkhir: "",
    },
    {
      kurikulum: "2021",
      kodeMK: "TIF234",
      namaMataKuliah: "Kapita Selekta",
      namaKelas: "REG_A",
      komponen: 39,
      persentase: 39,
      nilai: 39,
      nilaiAkhir: "",
    },
    {
      kurikulum: "2021",
      kodeMK: "TIF254",
      namaMataKuliah: "Manajemen Proyek",
      namaKelas: "REG_A",
      komponen: 61,
      persentase: 61,
      nilai: 61,
      nilaiAkhir: "",
    },
    {
      kurikulum: "2021",
      kodeMK: "TIF249",
      namaMataKuliah: "Metode Penelitian",
      namaKelas: "REG_A",
      komponen: 82,
      persentase: 82,
      nilai: 82,
      nilaiAkhir: "",
    },
    {
      kurikulum: "2021",
      kodeMK: "TIF342",
      namaMataKuliah: "Teknologi Multimedia",
      namaKelas: "REG_A",
      komponen: 105,
      persentase: 105,
      nilai: 105,
      nilaiAkhir: "",
    },
    {
      kurikulum: "2021",
      kodeMK: "TIF312",
      namaMataKuliah: "Kerja Praktek",
      namaKelas: "REG_A",
      komponen: 105,
      persentase: 105,
      nilai: 105,
      nilaiAkhir: "",
    },
  ];
  return (
    <div className="p-4 border-1 rounded-sm shadow-sm">
      <Biodata showLine={false} />

      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse border border-gray-500">
          <thead>
            <tr>
              <th
                rowSpan={2}
                className="bg-primary-green text-white border border-gray-500 font-semibold p-2 align-middle"
              >
                Kurikulum
              </th>
              <th
                rowSpan={2}
                className="bg-primary-green text-white border border-gray-500 font-semibold p-2 align-middle"
              >
                Kode MK
              </th>
              <th
                rowSpan={2}
                className="bg-primary-green text-white border border-gray-500 font-semibold p-2 align-middle"
              >
                Nama Mata Kuliah
              </th>
              <th
                rowSpan={2}
                className="bg-primary-green text-white border border-gray-500 font-semibold p-2 align-middle"
              >
                Nama Kelas
              </th>
              <th
                colSpan={3}
                className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center"
              >
                Nilai Komponen
              </th>
              <th
                rowSpan={2}
                className="bg-primary-green text-white border border-gray-500 font-semibold p-2 align-middle"
              >
                Nilai Akhir
              </th>
            </tr>
            <tr>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Komponen
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                %
              </th>
              <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                Nilai
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.kurikulum}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.kodeMK}
                </td>
                <td className="border border-gray-500 font-semibold p-2">
                  {course.namaMataKuliah}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.namaKelas}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.komponen}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.persentase}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.nilai}
                </td>
                <td className="border border-gray-500 font-semibold p-2 text-center">
                  {course.nilaiAkhir}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
