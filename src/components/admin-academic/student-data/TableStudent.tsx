import { Eye, Link2, Trash2 } from "lucide-react";
import ButtonClick from "./ButtonClick";
import { useNavigate } from "react-router-dom";

export interface Student {
  id: string;
  name: string;
  level: string;
  program: string;
  entryYear: string;
  status: string;
  semester: number;
  credits: number;
  gpa: number;
}

interface TableProps {
  data: Student[];
}

export default function TableStudent({ data }: TableProps) {
  const navigate = useNavigate();

  function Link() {
    alert("link");
  }
  function Detail() {
    navigate("/portal/mahasiswa/detail-mahasiswa");
  }
  function Remove() {
    alert("link");
  }

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
          {data.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.id}
              </td>
              <td className="p-2 border border-gray-300 font-semibold">
                {student.name}
              </td>
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.level}
              </td>
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.program}
              </td>
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.entryYear}
              </td>
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.status}
              </td>
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.semester}
              </td>
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.credits}
              </td>
              <td className="p-2 border border-gray-300 font-semibold text-center">
                {student.gpa}
              </td>
              <td className="p-2 border border-gray-300 font-semibold">
                <div className="flex justify-center space-x-2">
                  {
                    <ButtonClick
                      icon={<Link2 size={15} />}
                      color={"bg-primary-yellow"}
                      onClick={Link}
                    />
                  }
                  {
                    <ButtonClick
                      icon={<Eye size={15} />}
                      color={"bg-primary-blueSoft"}
                      onClick={Detail}
                    />
                  }
                  {
                    <ButtonClick
                      icon={<Trash2 size={15} />}
                      color={"bg-red-400"}
                      onClick={Remove}
                    />
                  }
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
