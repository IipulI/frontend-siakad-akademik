import React from "react";

interface TableDetailClassProps {
  data: Array<{
    id: number;
    hari: string;
    jamMulai: string;
    jamSelesai: string;
    jenisPertemuan: string;
    metodePembelajaran: string;
    ruang: string;
  }>;
  tableHead: string[];
  error: string;
}

const TableDetailClass: React.FC<TableDetailClassProps> = ({ data, tableHead, error }) => {
  return (
    <table className="w-full my-4">
      <thead>
        <tr>
          <th
            colSpan={tableHead.length}
            className="bg-primary-green text-white text-center p-2 border border-gray-600 text-base font-semibold"
          >
            Jadwal Mingguan
          </th>
        </tr>
        <tr>
          {tableHead.map((head) => (
            <th
              key={head}
              className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600"
            >
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="font-semibold">
        {data && data.length > 0 ? (
          data.map((row, index) => (
            <tr key={row.id} className="text-center">
              <td className="p-2 border text-sm border-black/50">{index + 1}</td>
              <td className="p-2 border text-sm border-black/50">{row.hari}</td>
              <td className="p-2 border text-sm border-black/50">{row.jamMulai}</td>
              <td className="p-2 border text-sm border-black/50">{row.jamSelesai}</td>
              <td className="p-2 border text-sm border-black/50 font-bold">{row.jenisPertemuan}</td>
              <td className="p-2 border text-sm border-black/50">{row.metodePembelajaran}</td>
              <td className="p-2 border text-sm border-black/50 font-bold">{row.ruang}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={tableHead.length} className="text-center border-black border p-2">
              {error}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TableDetailClass;
