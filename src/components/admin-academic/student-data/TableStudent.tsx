import { useNavigate } from "react-router-dom";
import { StudentData } from "../../../hooks/admin-akademik/useMahasiswa";

interface TableProps {
  data: StudentData[];
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function TableStudent({ data, children, isLoading }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-primary-green text-white">
            <th className="p-2 border font-semibold border-gray-300">NPM</th>
            <th className="p-2 border font-semibold border-gray-300">Nama</th>
            <th className="p-2 border font-semibold border-gray-300">
              Jenjang
            </th>
            <th className="p-2 border font-semibold border-gray-300">
              Program Studi
            </th>
            <th className="p-2 border font-semibold border-gray-300">Masuk</th>
            <th className="p-2 border font-semibold border-gray-300">Status</th>
            <th className="p-2 border font-semibold border-gray-300">
              Semester
            </th>
            <th className="p-2 border font-semibold border-gray-300">SKS</th>
            <th className="p-2 border font-semibold border-gray-300">IPK</th>
            <th className="p-2 border font-semibold border-gray-300">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={10} className="text-center py-4 text-gray-500">
                Memuat data...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={10} className="text-center py-4 text-gray-500">
                Tidak ada data yang ditemukan
              </td>
            </tr>
          ) : (
            data.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="p-2 border border-gray-300 font-semibold text-center">
                  {student.npm}
                </td>
                <td className="p-2 border border-gray-300 font-semibold">
                  {student.nama}
                </td>
                <td className="p-2 border border-gray-300 font-semibold text-center">
                  {student.jenjang}
                </td>
                <td className="p-2 border border-gray-300 font-semibold text-center">
                  {student.namaProgramStudi}
                </td>
                <td className="p-2 border border-gray-300 font-semibold text-center">
                  {student.periodeMasuk}
                </td>
                <td className="p-2 border border-gray-300 font-semibold text-center">
                  {student.statusMahasiswa}
                </td>
                <td className="p-2 border border-gray-300 font-semibold text-center">
                  {student.semester}
                </td>
                <td className="p-2 border border-gray-300 font-semibold text-center">
                  {student.sks}
                </td>
                <td className="p-2 border border-gray-300 font-semibold text-center">
                  {student.ipk}
                </td>
                <td className="p-2 border border-gray-300 font-semibold">
                  {children}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
