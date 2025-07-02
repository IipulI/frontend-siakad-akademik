import React, { useState, useEffect, useRef } from "react"
import { Eye} from "lucide-react"
import { Link, useNavigate } from "react-router-dom";
import { LecturerRoute } from "../../types/VarRoutes";


  interface Datum {
    id:                   string;
    programStudi:         string;
    tahunKurikulum:       string;
    semester:             string;
    nilaiMin:             string;
    sksTatapMuka:         number;
    sksPraktikum:         number;
    adaPraktikum:         boolean;
    opsiMataKuliah:       boolean;
    kodeMataKuliah:       string;
    namaMataKuliah:       string;
    jenisMataKuliah:      string;
    prasyaratMataKuliah1: null;
    prasyaratMataKuliah2: null;
    prasyaratMataKuliah3: null;
}
interface TableProps {
    data: Datum[];
    error: string;
  }
  
export default function TableCourseLecturer ({
    data,
    error,
  }: TableProps) {
    const navigate = useNavigate()

    const [selected, setSelected] = useState<string[]>([]);
    const selectAllRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!data || data.length === 0) return;
      if (selected.length === data.length) {
        selectAllRef.current && (selectAllRef.current.indeterminate = false);
        selectAllRef.current && (selectAllRef.current.checked = true);
      } else if (selected.length === 0) {
        selectAllRef.current && (selectAllRef.current.indeterminate = false);
        selectAllRef.current && (selectAllRef.current.checked = false);
      } else {
        selectAllRef.current && (selectAllRef.current.indeterminate = true);
      }
    }, [selected, data]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        setSelected(data ? data.map((row) => row.id) : []);
      } else {
        setSelected([]);
      }
    };

    const handleSelectRow = (id: string) => {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    };

    return (
      <table className="w-full my-4">
        <thead>
          <tr>
            <th className="p-2 bg-primary-green text-white border border-gray-600">
                <input
                    type="checkbox"
                    ref={selectAllRef}
                    onChange={handleSelectAll}
                    disabled={!data || data.length === 0}
                />
            </th>
            <th className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600">
                Kurikulum
            </th>
            <th className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600">
                Kode
            </th>
            <th className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600">
                Nama
            </th>
            <th className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600">
                SKS
            </th>
            <th className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600">
                Jenis MK
            </th>
            <th className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600">
                Prodi Pengampu
            </th>
            <th className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600">
                Aksi
            </th>
          </tr>
        </thead>
        <tbody className="font-semibold">
            {(!data || data.length === 0) ? (
                <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500">{error}</td>
                </tr>
            ) : (
                data.map((row) => (
                    <tr key={row.id}>
                        <td className="p-2 border text-center text-sm border-black/50">
                            <input
                                type="checkbox"
                                checked={selected.includes(row.id)}
                                onChange={() => handleSelectRow(row.id)}
                            />
                        </td>
                        <td className="p-2 border text-sm border-black/50">
                            {row.tahunKurikulum}
                        </td>
                        <td className="p-2 border text-sm border-black/50">
                            {row.kodeMataKuliah}
                        </td>
                        <td className="p-2 border text-sm border-black/50">
                            {row.namaMataKuliah}
                        </td>
                        <td className="p-2 border text-sm border-black/50">
                            {row.sksTatapMuka}
                        </td>
                        <td className="p-2 border text-sm border-black/50">
                            {row.jenisMataKuliah}
                        </td>
                        <td className="p-2 border text-sm border-black/50">
                            {row.programStudi}
                        </td>
                        <td className="p-2 border text-center text-sm border-black/50">
                            <div className="flex items-center justify-center w-full">
                                <Link
                                    to={LecturerRoute.courses.detailCourse}
                                    onClick={() => localStorage.setItem("id_mata_kuliah", row.id)}
                                    className="bg-primary-blueSoft cursor-pointer rounded-sm flex items-center justify-center w-8 h-7"
                                >
                                    <Eye className="text-white w-4 h-4" />
                                </Link>
                            </div>
                        </td>
                    </tr>
                ))
            )}
        </tbody>
      </table>
    );
  };