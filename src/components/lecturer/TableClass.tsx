import React, { useState, useEffect, useRef } from "react"
import { Check, Eye, Trash, X } from "lucide-react"

interface TableProps {
    data: Array<Record<string, any>>;
    error: string;
    setId?: (id: string | null) => void;
  }

export default function TableClass ({
    data,
    error,
    setId,
  }: TableProps) {
    const [selected, setSelected] = useState<number[]>([]);
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
        setSelected(data.map((row) => row.id));
      } else {
        setSelected([]);
      }
    };

    const handleSelectRow = (id: number) => {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    };

    return (
      <table className="w-full my-4">
        <thead>
          <tr>
            <th
                className="p-2 bg-primary-green text-white border border-gray-600"
            >
                <input
                  type="checkbox"
                  ref={selectAllRef}
                  onChange={handleSelectAll}
                  disabled={!data || data.length === 0}
                />
            </th>
                <th
                    className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600"
                >
                    Kur
                </th>
            <th
                className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600"
            >
                Kode
            </th>
            <th
                className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600"
            >
                Mata Kuliah
            </th>
            <th
                className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600"
            >
                Prodi Pengampu
            </th>
            <th
                className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600"
            >
                Kelas
            </th>
            <th
                className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600"
            >
                Pengajar
            </th>
            <th
                className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600"
            >
                Jadwal Mingguan
            </th>
            <th
                className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600"
            >
                Kop
            </th>
            <th
                className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600"
            >
                Pst
            </th>
            <th
                className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600"
            >
                Nilai dikunci
            </th>
            <th
                className="p-2 text-sm font-normal bg-primary-green text-center text-white border border-gray-600"
            >
                Aksi
            </th>
          </tr>
        </thead>
        <tbody className="font-semibold">
          {data && data.length > 0 ? (
            data.map((row, index) => {
              return (
                <tr key={index} className="text-center">
                  <td className="p-2 border text-center text-sm border-black/50">
                    <input
                      type="checkbox"
                      checked={selected.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                    />
                  </td>
                  <td className="p-2 border text-center text-sm border-black/50">
                    {row.mataKuliah.tahunKurikulum}
                  </td>
                  <td className="p-2 border text-center text-sm border-black/50">
                    {row.mataKuliah.kodeMataKuliah}
                  </td>
                  <td className="p-2 border text-center text-sm border-black/50">
                    {row.mataKuliah.namaMataKuliah}
                  </td>
                  <td className="p-2 border text-center text-sm border-black/50">
                    {row.programStudi.namaProgramStudi}
                  </td>
                  <td className="p-2 border text-center text-sm border-black/50">
                    {row.nama}
                  </td>
                  <td className="p-2 border text-center text-sm border-black/50">
                    {row.dosen[0]}
                  </td>
                  <td className="p-2 border text-center text-sm border-black/50">
                    {row.jadwalMingguan?.join(", ")}
                  </td>
                  <td className="p-2 border text-center text-sm border-black/50">
                    {row.kapasitas}
                  </td>
                  <td className="p-2 border text-center text-sm border-black/50">
                    {row.peserta}
                  </td>
                  <td className="p-2 border text-center text-sm border-black/50">
                    <div className="flex items-center justify-center">
                      {row.kunci ? <Check color="green" size={16} /> : <X color="red" size={16} />}
                    </div>
                  </td>
                  <td
                    className="p-2 border text-center text-sm border-black/50"
                  >
                    <div className="flex items-center justify-center w-full">
                        <div
                          onClick={() => setId && setId(row.id)}
                          className="bg-primary-blueSoft cursor-pointer rounded-sm flex items-center justify-center w-8 h-7"
                        >
                          <Eye className="text-white w-4 h-4" />
                        </div>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={12}
                className="text-center border-black border p-2"
              >
                {error}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };