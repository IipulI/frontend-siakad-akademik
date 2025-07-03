import React, {useState, useEffect, useRef} from "react";
import {Check, Eye, Trash, X} from "lucide-react";

// Perbaiki interface TableProps
interface TableProps {
    data: Array<Record<string, any>>;
    error: string | null; // Error bisa null, sesuaikan dengan AnnouncementAdminAcademic
    setId?: (id: string | null) => void;
    onDelete: (announcementId: string) => Promise<void>; // Tambahkan prop onDelete
}

export const TableAnnouncement = ({
                                      data,
                                      error,
                                      setId,
                                      onDelete, // Destructure onDelete prop
                                  }: TableProps) => {
    // Ubah tipe state selected dari number[] menjadi string[] karena ID dari API adalah string
    const [selected, setSelected] = useState<string[]>([]);
    const selectAllRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!data || data.length === 0) {
            setSelected([]); // Clear selection if data is empty
            return;
        }
        if (selected.length === data.length) {
            if (selectAllRef.current) {
                selectAllRef.current.indeterminate = false;
                selectAllRef.current.checked = true;
            }
        } else if (selected.length === 0) {
            if (selectAllRef.current) {
                selectAllRef.current.indeterminate = false;
                selectAllRef.current.checked = false;
            }
        } else {
            if (selectAllRef.current) {
                selectAllRef.current.indeterminate = true;
            }
        }
    }, [selected, data]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelected(data.map((row) => row.id)); // Pastikan row.id adalah string
        } else {
            setSelected([]);
        }
    };

    // Ubah tipe id dari number menjadi string
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
                <th className="p-2 lg:text-sm text-xs font-normal bg-primary-green text-center text-white border border-gray-600">
                    Tanggal
                </th>
                <th className="p-2 lg:text-sm text-xs font-normal bg-primary-green text-center text-white border border-gray-600">
                    Penulis
                </th>
                <th className="p-2 lg:text-sm text-xs font-normal bg-primary-green text-center text-white border border-gray-600">
                    Judul
                </th>
                <th className="p-2 lg:text-sm text-xs font-normal bg-primary-green text-center text-white border border-gray-600">
                    Aktif
                </th>
                <th className="p-2 lg:text-sm text-xs font-normal bg-primary-green text-center text-white border border-gray-600">
                    Prioritas
                </th>
                <th className="p-2 lg:text-sm text-xs font-normal bg-primary-green text-center text-white border border-gray-600">
                    Aksi
                </th>
            </tr>
            </thead>
            <tbody className="font-semibold">
            {data && data.length > 0 ? (
                data.map((row, index) => {
                    return (
                        <tr key={row.id || index}
                            className="text-center"> {/* Gunakan row.id sebagai key jika tersedia */}
                            <td className="p-2 border text-center lg:text-sm text-xs border-black/50">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(row.id)} // Pastikan row.id adalah string
                                    onChange={() => handleSelectRow(row.id)}
                                />
                            </td>
                            <td className="p-2 border text-center lg:text-sm text-xs border-black/50">
                                {row.tanggal}
                            </td>
                            <td className="p-2 border text-center lg:text-sm text-xs border-black/50">
                                {row.penulis}
                            </td>
                            <td className="p-2 border text-center lg:text-sm text-xs border-black/50">
                                {row.judul}
                            </td>
                            <td className="p-2 border text-center lg:text-sm text-xs border-black/50">
                                <div className="flex items-center justify-center">
                                    {row.aktif ? <Check color="green" size={16}/> : <X color="red" size={16}/>}
                                </div>
                            </td>
                            <td className="p-2 border text-center lg:text-sm text-xs border-black/50">
                                <div className="flex items-center justify-center">
                                    {row.prioritas ? <Check color="green" size={16}/> : <X color="red" size={16}/>}
                                </div>
                            </td>
                            <td className="p-2 border text-center lg:text-sm text-xs border-black/50">
                                <div className="flex items-center justify-center w-full">
                                    <div className="flex items-center justify-center space-x-2">
                                        <div
                                            onClick={() => setId && setId(row.id)} // Pastikan row.id adalah string
                                            className="bg-primary-blueSoft cursor-pointer rounded-sm flex items-center justify-center w-8 h-7"
                                        >
                                            <Eye className="text-white w-4 h-4"/>
                                        </div>
                                        <div
                                            // Panggil prop onDelete dan teruskan ID baris
                                            onClick={() => onDelete(row.id)}
                                            className="bg-red-400 cursor-pointer rounded-sm flex items-center justify-center w-8 h-7"
                                        >
                                            <Trash className="text-white w-4 h-4"/>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    );
                })
            ) : (
                <tr>
                    <td colSpan={8} className="text-center border-black border p-2">
                        {error || "Tidak ada data pengumuman."} {/* Tampilkan pesan jika tidak ada data */}
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    );
};
