import Biodata from "../../../biodata/Biodata";

export default function Repeat() {
  const courses = [
    // {
    //   no: "1",
    //   kodeMK: "TIF202",
    //   namaMataKuliah: "IOT",
    //   periode: "IOT",
    //   nilai: "IOT",
    //   smt: "IOT",
    //   sks: "IOT",
    // },
  ];
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
          <table className="w-full border-collapse border border-gray-500 font-semibold">
            <thead>
              <tr>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  No
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  Kode MK
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  Nama Mata Kuliah
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  Periode
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  SKS
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  SMT
                </th>
                <th className="bg-primary-green text-white border border-gray-500 font-semibold p-2 text-center">
                  Nilai
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses.map((course, index) => (
                  <tr key={index} className="hover:bg-gray-100">
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
                      {course.periode}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {course.sks}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {course.smt}
                    </td>
                    <td className="border border-gray-500 font-semibold p-2 text-center">
                      {course.nilai}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-4">
                    <h3 className="font-semibold text-lg">
                      Mahasiswa Tidak Pernah Mengulang Mata Kuliah
                    </h3>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
  );
}
