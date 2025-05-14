import Biodata from "../../../biodata/Biodata";

export default function () {
  const tableData = [
    {
      no: 1,
      periode: 2021,
      semester: 1,
      sks: 18,
      ips: 3.64,
      totalSKSTempuh: 18,
      totalSKSLulus: 18,
      ipk: 3.64,
      totalIPK: 3.64,
      keterangan: "BERLINA WULANDAR, S.T., M.Kom",
    },
    {
      no: 2,
      periode: 2022,
      semester: 2,
      sks: 21,
      ips: 3.69,
      totalSKSTempuh: 39,
      totalSKSLulus: 39,
      ipk: 3.67,
      totalIPK: 3.67,
      keterangan: "BERLINA WULANDAR, S.T., M.Kom",
    },
    {
      no: 3,
      periode: 2023,
      semester: 3,
      sks: 22,
      ips: 4.0,
      totalSKSTempuh: 61,
      totalSKSLulus: 61,
      ipk: 3.79,
      totalIPK: 3.79,
      keterangan: "BERLINA WULANDAR, S.T., M.Kom",
    },
    {
      no: 4,
      periode: 2024,
      semester: 4,
      sks: 21,
      ips: 3.69,
      totalSKSTempuh: 82,
      totalSKSLulus: 82,
      ipk: 3.76,
      totalIPK: 3.76,
      keterangan: "BERLINA WULANDAR, S.T., M.Kom",
    },
    {
      no: 5,
      periode: 2025,
      semester: 5,
      sks: 23,
      ips: 3.72,
      totalSKSTempuh: 105,
      totalSKSLulus: 105,
      ipk: 3.75,
      totalIPK: 3.75,
      keterangan: "BERLINA WULANDAR, S.T., M.Kom",
    },
    {
      no: 6,
      periode: 2026,
      semester: 6,
      sks: 21,
      ips: 0.0,
      totalSKSTempuh: 105,
      totalSKSLulus: 105,
      ipk: 3.75,
      totalIPK: 3.75,
      keterangan: "BERLINA WULANDAR, S.T., M.Kom",
    },
  ];
  return (
    <div className="p-4 border-1 rounded-sm shadow-sm">
      <Biodata showLine={false} />
      <div className="mt-4 overflow-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-primary-green text-white">
            <tr>
              <th rowSpan={2} className="border-1 border-gray-500 font-semibold p-2">
                No
              </th>
              <th rowSpan={2} className="border-1 border-gray-500 font-semibold p-2">
                Periode
              </th>
              <th rowSpan={2} className="border-1 border-gray-500 font-semibold p-2">
                Semester
              </th>
              <th rowSpan={2} className="border-1 border-gray-500 font-semibold p-2">
                Status
              </th>
              <th rowSpan={2} className="border-1 border-gray-500 font-semibold p-2">
                SKS
              </th>
              <th rowSpan={2} className="border-1 border-gray-500 font-semibold p-2">
                IPS
              </th>
              <th colSpan={3} className="border-1 border-gray-500 font-semibold p-2">
                Total SKS
              </th>
              <th colSpan={3} className="border-1 border-gray-500 font-semibold p-2">
                IPK
              </th>
              <th rowSpan={2} className="border-1 border-gray-500 font-semibold p-2">
                Keterangan
              </th>
            </tr>
            <tr>
              <th className="border-1 border-gray-500 font-semibold p-2 text-sm">Tempuh</th>
              <th className="border-1 border-gray-500 font-semibold p-2">Total</th>
              <th className="border-1 border-gray-500 font-semibold p-2">Lulus</th>
              <th className="border-1 border-gray-500 font-semibold p-2">Total</th>
              <th className="border-1 border-gray-500 font-semibold p-2">Total</th>
              <th className="border-1 border-gray-500 font-semibold p-2">Lulus</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.no} className="hover:bg-gray-100">
                <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                  {row.no}
                </td>
                <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                  {row.periode}
                </td>
                <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                  {row.semester}
                </td>
                <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                  Aktif
                </td>
                <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                  {row.sks}
                </td>
                <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                  {row.ips}
                </td>
                <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                  {row.totalSKSTempuh}
                </td>
                <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                  {row.totalSKSTempuh}
                </td>
                <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                  {row.totalSKSLulus}
                </td>
                <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                  {row.totalIPK}
                </td>
                <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                  {row.totalIPK}
                </td>
                <td className="border-1 border-gray-500 font-semibold p-2 text-center">
                  {row.totalIPK}
                </td>
                <td className="border-1 border-gray-500 font-semibold p-2">{row.keterangan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
