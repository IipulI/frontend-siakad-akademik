import React from "react";
import { Link } from "react-router-dom";
import { AdminAcademicRoute } from "../types/VarRoutes.tsx";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Save, X, RefreshCw, Paperclip } from "lucide-react";

interface TableProps {
  data: Array<Record<string, any>>;
  tableHead: string[];
  error: string;
  setId?: (id: string | null) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  isEditing: boolean;
  currentData: any | null;
  onSave: () => void;
  onReset: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAdding: boolean;
  onSelect?: (id: number) => void;
  selectedIds?: number[];

  // graduate profile
  newProfile?: any;
  onSaveNewProfile?: () => void;
  onCancelAdd?: () => void;

  // ObeCPL
  onSaveNewCpl?: () => void;
  newCpl?: any;

  // ObeCPMK
  onSaveNewCpmk?: () => void;
  newCpmk?: any;

  // ObeCpmkMatkul
  onSaveNewCpmkMatkul?: () => void;
  newCpmkMatkul?: any;
}

export const Table = ({ data, tableHead, error }: TableProps) => {
  return (
    <table className="w-full my-4">
      <thead>
        <tr>
          {tableHead.map((head) => (
            <th key={head} className="p-4 bg-primary-green text-white border border-gray-600">
              <p className="font-semibold text-center">{head}</p>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="font-semibold">
        {data && data.length > 0 ? (
          data.map((row, index) => {
            const { id, ...rowWithoutId } = row;
            const rowData = Object.values(rowWithoutId);
            return (
              <tr key={index} className="text-center">
                {rowData.map((cell, idx) => (
                  <td key={idx} className="p-2 border text-sm border-black/50">
                    {String(cell)}
                  </td>
                ))}
              </tr>
            );
          })
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

export const TableHistory = ({ data, tableHead, error }: TableProps) => {
  return (
    <table className="w-full my-4">
      <thead>
        <tr>
          {tableHead.map((head) => (
            <th key={head} className="p-4 bg-primary-green text-white border border-gray-600">
              <p className="font-semibold text-center">{head}</p>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="font-semibold">
        {data && data.length > 0 ? (
          data.map((row, index) => {
            const { id, ...rowWithoutId } = row;
            const rowData = Object.values(rowWithoutId);
            return (
              <tr key={index} className="text-center">
                {rowData.map((cell, idx) => (
                  <td key={idx} className="p-2 border text-sm border-black/50">
                    {String(cell)}
                  </td>
                ))}
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={tableHead.length} className="text-center border-black border p-2">
              {error}
            </td>
          </tr>
        )}
        <tr>
          <td colSpan={4} className="border-black/50 text-sm text-center p-2 border">
            Total SKS
          </td>
          <td className="border-black/50 text-sm border text-center p-2">25</td>
          <td colSpan={4} className="border-black/50 text-sm border text-center p-2"></td>
        </tr>
        <tr>
          <td colSpan={4} className="border-black/50 text-center p-2 text-sm border">
            Batas SKS
          </td>
          <td className="border-black/50 text-center p-2 text-sm border">25</td>
          <td colSpan={4} className="border-black/50 text-sm border text-center p-2"></td>
        </tr>
      </tbody>
    </table>
  );
};

export const TableAnnouncement = ({ data, tableHead, error, setId }: TableProps) => {
  return (
    <table className="w-full my-4">
      <thead>
        <tr>
          {tableHead.map((head) => (
            <th key={head} className="p-4 bg-primary-green text-white border border-gray-600">
              <p className="font-semibold text-center">{head}</p>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="font-semibold">
        {data && data.length > 0 ? (
          data.map((row, index) => {
            return (
              <tr key={index} className="text-center">
                <td className="p-2 border text-sm border-black/50">{row.tanggal}</td>
                <td className="p-2 border text-sm border-black/50">{row.penulis}</td>
                <td className="p-2 border text-sm border-black/50">{row.judul}</td>
                <td className="p-2 border text-sm border-black/50 text-center" style={{ verticalAlign: "middle" }}>
                  <div onClick={() => setId && setId(row.id)} className="bg-primary-blueSoft cursor-pointer rounded-sm mx-auto flex items-center justify-center w-8 h-6">
                    <Eye className="text-white w-4 h-4" />
                  </div>
                </td>
              </tr>
            );
          })
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

export const TableCurriculumYear = ({ data, tableHead = [], error, setId, onEdit, onDelete, isEditing, currentData, onSave, onReset, onInputChange, isAdding }: TableProps) => {
  const isDataAvailable = data && data.length > 0;

  const renderDate = (dateString: string) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <table className="w-full my-4">
      <thead>
        <tr>
          {tableHead.length > 0 ? (
            tableHead.map((head) => (
              <th key={head} className="p-4 bg-primary-green text-white border border-gray-600">
                <p className="font-semibold text-center">{head}</p>
              </th>
            ))
          ) : (
            <th className="p-4 bg-primary-green text-white border border-gray-600">
              <p className="font-semibold text-center">Data tidak tersedia</p>
            </th>
          )}
        </tr>
      </thead>
      <tbody className="font-semibold">
        {isAdding && (
          <tr className="text-center">
            <td className="p-2 border text-sm border-black/50">
              <input type="text" name="tahun" value={currentData?.tahun || ""} onChange={onInputChange} className="border p-2 w-full" />
            </td>
            <td className="p-2 border text-sm border-black/50">
              <input type="text" name="Keterangan" value={currentData?.Keterangan || ""} onChange={onInputChange} className="border p-2 w-full" />
            </td>
            <td className="p-2 border text-sm border-black/50">
              <select name="mulaiBerlaku" value={currentData?.mulaiBerlaku || "2025 Genap"} onChange={onInputChange} className="border p-2 w-full">
                <option value="2025 Genap">2025 Genap</option>
                <option value="2025 Ganjil">2025 Ganjil</option>
                <option value="2024 Genap">2024 Genap</option>
                <option value="2024 Ganjil">2024 Ganjil</option>
              </select>
            </td>
            <td className="p-2 border text-sm border-black/50">
              <input type="date" name="tanggalAwal" value={currentData?.tanggalAwal || ""} onChange={onInputChange} className="border p-2 w-full" />
            </td>
            <td className="p-2 border text-sm border-black/50">
              <input type="date" name="tanggalAkhir" value={currentData?.tanggalAkhir || ""} onChange={onInputChange} className="border p-2 w-full" />
            </td>
            <td className="p-2 border text-sm border-black/50">
              <div className="flex justify-center gap-2">
                <div onClick={onSave} className="bg-primary-green cursor-pointer rounded-sm flex items-center justify-center w-8 h-8">
                  <Save className="text-white w-4 h-4" />
                </div>
                <div onClick={onReset} className="bg-yellow-500 cursor-pointer rounded-sm flex items-center justify-center w-8 h-8">
                  <RefreshCw className="text-white w-4 h-4" />
                </div>
              </div>
            </td>
          </tr>
        )}

        {isDataAvailable ? (
          data.map((row) => (
            <tr key={row.id} className="text-center">
              <td className="p-2 border text-sm border-black/50">{row.tahun}</td>
              <td className="p-2 border text-sm border-black/50">{row.Keterangan}</td>
              <td className="p-2 border text-sm border-black/50">{row.mulaiBerlaku}</td>
              <td className="p-2 border text-sm border-black/50">{renderDate(row.tanggalAwal)}</td>
              <td className="p-2 border text-sm border-black/50">{renderDate(row.tanggalAkhir)}</td>
              <td className="p-2 border text-sm border-black/50 text-center">
                <div className="flex justify-center gap-2">
                  <div onClick={() => setId && setId(row.id)} className="bg-blue-500 cursor-pointer rounded-sm flex items-center justify-center w-8 h-8">
                    <Eye className="text-white w-4 h-4" />
                  </div>
                  <div onClick={() => onEdit && onEdit(row.id)} className="bg-yellow-500 cursor-pointer rounded-sm flex items-center justify-center w-8 h-8">
                    <Edit className="text-white w-4 h-4" />
                  </div>
                  <div onClick={() => onDelete && onDelete(row.id)} className="bg-red-500 cursor-pointer rounded-sm flex items-center justify-center w-8 h-8">
                    <Trash2 className="text-white w-4 h-4" />
                  </div>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={tableHead.length || 1} className="text-center border-black border p-2">
              {error}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export const TableCourseManagement: React.FC<TableProps> = ({ data, tableHead = [], error, onEdit, onDelete, selectedIds, onSelect, isEditing, currentData, onSave, onReset, onInputChange, isAdding }) => {
  const isDataAvailable = data && data.length > 0;

  // Cek apakah semua data terpilih
  const isAllSelected = data.length > 0 && (selectedIds?.length ?? 0) === data.length;

  return (
    <table className="w-full my-4 border-collapse border border-gray-400">
      <thead>
        <tr>
          {/* Checkbox header untuk select all */}
          <th className="p-4 bg-primary-green text-white border border-gray-600">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={() => onSelect?.(-1)} // Aman dari error
              className="cursor-pointer"
            />
          </th>

          {tableHead.slice(1).map((head) => (
            <th key={head} className="p-4 bg-primary-green text-white border border-gray-600">
              <p className="font-semibold text-center">{head}</p>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="font-semibold">
        {isDataAvailable ? (
          data.map((row) => {
            const { id, kurikulum, kode, mataKuliah, sks, jenisMK, prodiPengampu } = row;
            const isChecked = selectedIds?.includes(id) ?? false;

            if (isEditing && currentData && currentData.id === id) {
              // Render form input baris edit
              return (
                <tr key={id} className="text-center bg-yellow-50">
                  <td className="p-2 border text-sm border-black/50">
                    <input type="checkbox" checked={isChecked} onChange={() => onSelect?.(id)} className="mx-auto" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="text" name="kurikulum" value={currentData.kurikulum} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="text" name="kode" value={currentData.kode} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="text" name="mataKuliah" value={currentData.mataKuliah} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="number" name="sks" value={currentData.sks} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="text" name="jenisMK" value={currentData.jenisMK} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="text" name="prodiPengampu" value={currentData.prodiPengampu} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
                  </td>
                  <td className="p-2 border text-sm border-black/50 text-center">
                    <button onClick={onSave} className="bg-green-500 text-white px-3 py-1 rounded mr-2">
                      Simpan
                    </button>
                    <button onClick={onReset} className="bg-gray-500 text-white px-3 py-1 rounded">
                      Batal
                    </button>
                  </td>
                </tr>
              );
            }

            if (isAdding && currentData && currentData.id === id) {
              // Render baris input untuk tambah data baru
              return (
                <tr key={id} className="text-center bg-green-50">
                  <td className="p-2 border text-sm border-black/50">
                    <input type="checkbox" checked={isChecked} onChange={() => onSelect?.(id)} className="mx-auto" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="text" name="kurikulum" value={currentData.kurikulum} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="text" name="kode" value={currentData.kode} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="text" name="mataKuliah" value={currentData.mataKuliah} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="number" name="sks" value={currentData.sks} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="text" name="jenisMK" value={currentData.jenisMK} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="text" name="prodiPengampu" value={currentData.prodiPengampu} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
                  </td>
                  <td className="p-2 border text-sm border-black/50 text-center">
                    <button onClick={onSave} className="bg-green-500 text-white px-3 py-1 rounded mr-2">
                      Simpan
                    </button>
                    <button onClick={onReset} className="bg-gray-500 text-white px-3 py-1 rounded">
                      Batal
                    </button>
                  </td>
                </tr>
              );
            }

            // Render baris normal
            return (
              <tr key={id} className="text-center">
                <td className="p-2 border text-sm border-black/50">
                  <input type="checkbox" checked={isChecked} onChange={() => onSelect?.(id)} className="mx-auto cursor-pointer" />
                </td>
                <td className="p-2 border text-sm border-black/50">{kurikulum}</td>
                <td className="p-2 border text-sm border-black/50">{kode}</td>
                <td className="p-2 border text-sm border-black/50">{mataKuliah}</td>
                <td className="p-2 border text-sm border-black/50">{sks}</td>
                <td className="p-2 border text-sm border-black/50">{jenisMK}</td>
                <td className="p-2 border text-sm border-black/50">{prodiPengampu}</td>
                <td className="p-2 border text-sm border-black/50 text-center">
                  <div className="flex justify-center gap-2">
                    <div onClick={() => onEdit?.(id)} className="bg-blue-500 cursor-pointer rounded-sm flex items-center justify-center w-8 h-8" title="Edit">
                      <Eye className="text-white w-4 h-4" />
                    </div>

                    <div onClick={() => onDelete?.(id)} className="bg-red-500 cursor-pointer rounded-sm flex items-center justify-center w-8 h-8" title="Hapus">
                      <Trash2 className="text-white w-4 h-4" />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={tableHead.length || 1} className="text-center border-black border p-2">
              {error}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export const TableCpl = ({ data, tableHead, error }: TableProps) => {
  return (
    <table className="w-full my-4">
      <thead>
        <tr>
          {tableHead.map((head) => (
            <th key={head} className="p-4 bg-primary-green text-white border border-gray-600">
              <p className="font-semibold text-center">{head}</p>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="font-semibold">
        {data && data.length > 0 ? (
          data.map((row, index) => {
            return (
              <tr key={index} className="text-center">
                <td className="p-2 border text-sm border-black/50 text-left align-top">{row.kodeCpl}</td>
                <td className="p-2 border text-sm border-black/50 text-left">{row.deskripsiCpl}</td>
                <td className="p-2 border text-sm border-black/50 align-top ">{row.kategori}</td>
              </tr>
            );
          })
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

export const TableCpmk = ({ data, tableHead, error }: TableProps) => {
  return (
    <table className="w-full my-4">
      <thead>
        <tr>
          {tableHead.map((head) => (
            <th key={head} className="p-4 bg-primary-green text-white border border-gray-600">
              <p className="font-semibold text-center">{head}</p>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="font-semibold">
        {data && data.length > 0 ? (
          data.map((row, index) => {
            return (
              <tr key={index} className="text-center">
                <td className="p-2 border text-sm border-black/50">{row.kodeCpmk}</td>
                <td className="p-2 border text-sm border-black/50 text-left">{row.deskripsiCpmk}</td>
              </tr>
            );
          })
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

export const TableRps = ({ data, error, setId }: TableProps) => {
  return (
    <table className="w-full my-4">
      <thead>
        <tr>
          <th className="p-4 bg-primary-green text-white border border-gray-600">
            <p className="font-semibold text-center">Dosen Penyusun</p>
          </th>
          <th className="p-4 bg-primary-green text-white border border-gray-600">
            <p className="font-semibold text-center">Periode Akademik</p>
          </th>
          <th className="p-4 bg-primary-green text-white border border-gray-600">
            <p className="font-semibold text-center">Kelas</p>
          </th>
          <th className="p-4 bg-primary-green text-white border border-gray-600">
            <p className="font-semibold text-center">Aksi</p>
          </th>
        </tr>
      </thead>
      <tbody className="font-semibold">
        {data && data.length > 0 ? (
          data.map((row) => (
            <tr key={row.id} className="text-center">
              <td className="p-2 border text-sm border-black/50">{row.dosenPenyusun}</td>
              <td className="p-2 border text-sm border-black/50">{row.periodeAkademik}</td>
              <td className="p-2 border text-sm border-black/50">{row.kelas}</td>
              <td className="p-2 border text-sm border-black/50 text-center" style={{ verticalAlign: "middle" }}>
                <div onClick={() => setId && setId(row.id)} className="bg-primary-blueSoft cursor-pointer rounded-sm mx-auto flex items-center justify-center w-8 h-8">
                  <Eye className="text-white w-4 h-4" />
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="text-center border-black border p-2">
              {error}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export const TableOBE = ({ data, tableHead, error }) => {
  const isDataAvailable = data.length > 0;

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-300 my-4">
        <thead>
          <tr className="bg-primary-green text-white">
            <th className="p-4 border border-gray-600" rowSpan={2}>
              Kode Prodi
            </th>
            <th className="p-4 border border-gray-600" rowSpan={2}>
              Program Studi
            </th>
            <th className="p-4 border border-gray-600" rowSpan={2}>
              Ketua Prodi
            </th>
            <th className="p-4 border border-gray-600" colSpan={4}>
              Status Pengisian
            </th>
            <th className="p-4 border border-gray-600" rowSpan={2}>
              Aksi
            </th>
          </tr>
          <tr className="bg-primary-green text-white">
            <th className="p-2 border border-gray-600 w-20">PL</th>
            <th className="p-2 border border-gray-600 w-20">CPL</th>
            <th className="p-2 border border-gray-600 w-24">PL → CPL</th>
            <th className="p-2 border border-gray-600 w-20">CPMK</th>
          </tr>
        </thead>

        <tbody className="font-semibold">
          {isDataAvailable ? (
            data.map((item) => (
              <tr key={item.id} className="text-center hover:bg-gray-100">
                <td className="p-2 border border-black/50">{item.kodeProdi}</td>
                <td className="p-2 border border-black/50">{item.programStudi}</td>
                <td className="p-2 border border-black/50">{item.ketuaProdi}</td>
                <td className="p-2 border border-black/50">{item.pl ? "✅" : "❌"}</td>
                <td className="p-2 border border-black/50">{item.cpl ? "✅" : "❌"}</td>
                <td className="p-2 border border-black/50">{item.plToCpl ? "✅" : "❌"}</td>
                <td className="p-2 border border-black/50">{item.cpmk ? "✅" : "❌"}</td>
                <td className="p-2 border border-black/50 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="bg-blue-500 text-white p-2 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center p-2 border-black border">
                Data tidak ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export const TableGraduateProfile: React.FC<TableProps> = ({ data, error = "Data tidak ditemukan", isAdding = false, newProfile, onInputChange, onSaveNewProfile, onCancelAdd, onEdit, onDelete }) => {
  const isDataAvailable = data && data.length > 0;

  return (
    <table className="w-full my-4 border-collapse border border-gray-300">
      <thead>
        <tr className="bg-primary-green">
          <th className="p-4 text-white border border-gray-600">Kode PL</th>
          <th className="p-4 text-white border border-gray-600">Profil Lulusan</th>
          <th className="p-4 text-white border border-gray-600">Profesi</th>
          <th className="p-4 text-white border border-gray-600">Deskripsi</th>
          <th className="p-4 text-white border border-gray-600">Aksi</th>
        </tr>
      </thead>
      <tbody className="font-semibold">
        {/* Baris input tambah data jika isAdding */}
        {isAdding && newProfile && (
          <tr className="text-center">
            <td className="p-2 border border-black/50">
              <input type="text" name="kodePl" value={newProfile.kodePl} onChange={onInputChange} className="w-full p-1 border rounded" placeholder="Kode PL" />
            </td>
            <td className="p-2 border border-black/50">
              <input type="text" name="profilLulusan" value={newProfile.profilLulusan} onChange={onInputChange} className="w-full p-1 border rounded" placeholder="Profil Lulusan" />
            </td>
            <td className="p-2 border border-black/50">
              <input type="text" name="profesi" value={newProfile.profesi} onChange={onInputChange} className="w-full p-1 border rounded" placeholder="Profesi" />
            </td>
            <td className="p-2 border border-black/50">
              <input type="text" name="deskripsi" value={newProfile.deskripsi} onChange={onInputChange} className="w-full p-1 border rounded" placeholder="Deskripsi" />
            </td>
            <td className="p-2 border border-black/50">
              <div className="flex justify-center gap-2">
                <button onClick={onSaveNewProfile} className="bg-primary-green text-white rounded-sm flex items-center justify-center w-8 h-8" aria-label="Save">
                  <Save className="w-4 h-4" />
                </button>
                <button onClick={onCancelAdd} className="bg-red-500 text-white rounded-sm flex items-center justify-center w-8 h-8" aria-label="Cancel">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        )}

        {/* Baris data biasa */}
        {isDataAvailable ? (
          data.map((row) => (
            <tr key={row.id} className="text-center">
              <td className="p-2 border border-black/50">{row.kodePl}</td>
              <td className="p-2 border border-black/50">{row.profilLulusan}</td>
              <td className="p-2 border border-black/50">{row.profesi}</td>
              <td className="p-2 border border-black/50">{row.deskripsi}</td>
              <td className="p-2 border border-black/50">
                <div className="flex justify-center gap-2">
                  <button onClick={() => onEdit && onEdit(row.id)} className="bg-yellow-500 hover:bg-yellow-600 rounded-sm flex items-center justify-center w-8 h-8" aria-label="Edit">
                    <Edit className="text-white w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete && onDelete(row.id)} className="bg-red-500 hover:bg-red-600 rounded-sm flex items-center justify-center w-8 h-8" aria-label="Delete">
                    <Trash2 className="text-white w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="text-center border border-black/50 p-2">
              {error}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

const mappingOptions = ["PPL001", "PPL002", "PPL003"];

export const TableObeCPL: React.FC<TableProps> = ({ data, isAdding, newCpl, onInputChange, onSaveNewCpl, onCancelAdd, onEdit, onDelete }) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const { value, checked } = e.target;
    const updatedMapping = checked ? [...newCpl.pemetaan, value] : newCpl.pemetaan.filter((item) => item !== value);

    onInputChange({ target: { name: "pemetaan", value: updatedMapping } } as any);
  };

  return (
    <table className="w-full border border-gray-300">
      <thead className="bg-primary-green">
        <tr>
          <th className="p-2 text-white border border-gray-600">Kode PL</th>
          <th className="p-2 text-white border border-gray-600">Deskripsi CPL</th>
          <th className="p-2 text-white border border-gray-600">Kategori</th>
          <th className="p-2 text-white border border-gray-600">Pemetaan PPL</th>
          <th className="p-2 text-white border border-gray-600">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {isAdding && (
          <tr>
            <td className="p-2 border">
              <input type="text" name="kodePl" value={newCpl.kodePl} onChange={onInputChange} className="w-full p-1 border rounded" placeholder="Kode PL" />
            </td>
            <td className="p-2 border">
              <input type="text" name="deskripsiCapaianPembelajaran" value={newCpl.deskripsiCapaianPembelajaran} onChange={onInputChange} className="w-full p-1 border rounded" placeholder="Deskripsi CPL" />
            </td>
            <td className="p-2 border">
              <input type="text" name="kategori" value={newCpl.kategori} onChange={onInputChange} className="w-full p-1 border rounded" placeholder="Kategori" />
            </td>
            <td className="p-2 border">
              <div className="flex flex-col gap-2 ">
                {mappingOptions.map((option) => (
                  <label key={option} className="flex items-center gap-1">
                    <input type="checkbox" value={option} checked={newCpl.pemetaan.includes(option)} onChange={(e) => handleCheckboxChange(e, newCpl.id)} />
                    {option}
                  </label>
                ))}
              </div>
            </td>
            <td className="p-2 border flex justify-center gap-2">
              <button onClick={onSaveNewCpl} className="bg-primary-green text-white px-2 py-1 rounded w-8 h-8">
                <Save className="w-4 h-4" />
              </button>
              <button onClick={onCancelAdd} className="bg-red-500 text-white px-2 py-1 rounded w-8 h-8">
                <X className="w-4 h-4" />
              </button>
            </td>
          </tr>
        )}

        {data.length > 0 ? (
          data.map((cpl) => (
            <tr key={cpl.id} className="text-center">
              <td className="p-2 border">{cpl.kodePl}</td>
              <td className="p-2 border">{cpl.deskripsiCapaianPembelajaran}</td>
              <td className="p-2 border">{cpl.kategori}</td>
              <td className="p-2 border">
                <div className="flex flex-col gap-2">
                  {mappingOptions.map((option) => (
                    <label key={option} className="flex items-center gap-1">
                      <input type="checkbox" value={option} checked={cpl.pemetaan.includes(option)} readOnly />
                      {option}
                    </label>
                  ))}
                </div>
              </td>
              <td className="p-2 border flex justify-center gap-2">
                <button onClick={() => onEdit?.(cpl.id)} className="bg-yellow-500 text-white px-2 py-1 rounded w-8 h-8">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete?.(cpl.id)} className="bg-red-500 text-white px-2 py-1 rounded w-8 h-8">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="p-2 text-center">
              Data tidak ditemukan.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export const TableObeCpmk: React.FC<TableProps> = ({ data, isAdding, newCpmk, onInputChange, onSaveNewCpmk, onCancelAdd, onEdit, onDelete }) => {
  const navigate = useNavigate();

  // Fungsi ini belum digunakan, kalau mau pakai tinggal hubungkan ke tombol
  const handleViewDetail = (id: string) => {
    navigate(AdminAcademicRoute.obeManagement.cpmkMataKuliah);
  };

  return (
    <table className="w-full border border-gray-300">
      <thead className="bg-primary-green">
        <tr>
          <th className="p-2 text-white border border-gray-600">Kode MK</th>
          <th className="p-2 text-white border border-gray-600">Mata Kuliah</th>
          <th className="p-2 text-white border border-gray-600">Status CPMK</th>
          <th className="p-2 text-white border border-gray-600">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {isAdding && (
          <tr>
            <td className="p-2 border">
              <input type="text" name="kodeMk" value={newCpmk.kodeMk} onChange={onInputChange} className="w-full p-1 border rounded" placeholder="Kode MK" />
            </td>
            <td className="p-2 border">
              <input type="text" name="mataKuliah" value={newCpmk.mataKuliah} onChange={onInputChange} className="w-full p-1 border rounded" placeholder="Mata Kuliah" />
            </td>
            <td className="p-2 border">
              <input type="text" name="statusCpmk" value={newCpmk.statusCpmk} onChange={onInputChange} className="w-full p-1 border rounded" placeholder="Status CPMK" />
            </td>
            <td className="p-2 border flex gap-2 justify-center">
              <button onClick={onSaveNewCpmk} className="bg-green-500 text-white px-3 py-1 rounded">
                Save
              </button>
              <button onClick={onCancelAdd} className="bg-red-500 text-white px-3 py-1 rounded">
                Cancel
              </button>
            </td>
          </tr>
        )}

        {data.length > 0 ? (
          data.map((cpmk) => (
            <tr key={cpmk.id} className="text-center">
              <td className="p-2 border">{cpmk.kodeMk}</td>
              <td className="p-2 border">{cpmk.mataKuliah}</td>
              <td className="p-2 border">{cpmk.statusCpmk}</td>
              <td className="p-2 border flex justify-center gap-2">
                <button onClick={() => handleViewDetail?.(cpmk.id)} className="bg-primary-blueSoft text-white px-2 py-1 rounded w-8 h-8">
                  <Eye className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="p-2 text-center">
              Data tidak ditemukan.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export const TableObeCpmkMatkul: React.FC<TableProps> = ({ data, isAdding, newCpmkMatkul, onInputChange, onSaveNewCpmkMatkul, onCancelAdd, onEdit, onDelete }) => {
  return (
    <table className="w-full border border-gray-300">
      <thead className="bg-primary-green">
        <tr>
          <th className="p-2 text-white border border-gray-600">Kode CPMK</th>
          <th className="p-2 text-white border border-gray-600">Deskripsi </th>
          <th className="p-2 text-white border border-gray-600">Pemetaan PPL</th>
          <th className="p-2 text-white border border-gray-600">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {isAdding && (
          <tr className="">
            <td className="p-2 border">
              <input type="text" name="kodeCpmk" value={newCpmkMatkul.kodeCpmk} onChange={onInputChange} className="w-full p-1 border rounded" placeholder="Kode CPMK" />
            </td>
            <td className="p-2 border">
              <input type="text" name="deskripsi" value={newCpmkMatkul.deskripsi} onChange={onInputChange} className="w-full p-1 border rounded" placeholder="Deskripsi" />
            </td>
            <td className="p-2 border">
              <div className="flex flex-col gap-2">
                {mappingOptions.map((option) => (
                  <label key={option} className="flex items-center gap-1">
                    <input type="checkbox" value={option} checked={newCpmkMatkul.pemetaan.includes(option)} onChange={(e) => handleCheckboxChange(e)} />
                    {option}
                  </label>
                ))}
              </div>
            </td>
            <td className="p-2 border flex justify-center gap-2">
              <button onClick={onSaveNewCpmkMatkul} className="bg-primary-green text-white px-2 py-1 rounded w-8 h-8">
                <Save className="w-4 h-4" />
              </button>
              <button onClick={onCancelAdd} className="bg-red-500 text-white px-2 py-1 rounded w-8 h-8">
                <X className="w-4 h-4" />
              </button>
            </td>
          </tr>
        )}

        {data.length > 0 ? (
          data.map((cpmkMatkul) => (
            <tr key={cpmkMatkul.id} className="text-center">
              <td className="p-2 border">{cpmkMatkul.kodeCpmk}</td>
              <td className="p-2 border">{cpmkMatkul.deskripsi}</td>

              <td className="p-2 border">
                <div className="flex flex-col gap-2">
                  {mappingOptions.map((option) => (
                    <label key={option} className="flex items-center gap-1">
                      <input type="checkbox" value={option} checked={cpmkMatkul.pemetaan.includes(option)} readOnly />
                      {option}
                    </label>
                  ))}
                </div>
              </td>
              <td className="p-2 border flex justify-center gap-2">
                <button onClick={() => onEdit?.(cpmkMatkul.id)} className="bg-yellow-500 text-white px-2 py-1 rounded w-8 h-8">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete?.(cpmkMatkul.id)} className="bg-red-500 text-white px-2 py-1 rounded w-8 h-8">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="p-2 text-center">
              Data tidak ditemukan.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export const TableCurriculumProdi: React.FC<TableProps> = ({ data, onEdit, onDelete }) => {
  const totalSKS = data.reduce((acc, item) => acc + parseInt(item.sks), 0);
  const totalWajib = data.filter((item) => item.status === "Wajib").reduce((acc, item) => acc + parseInt(item.sks), 0);
  const totalPilihan = data.filter((item) => item.status === "Pilihan").reduce((acc, item) => acc + parseInt(item.sks), 0);

  return (
    <table className="w-full border border-gray-600">
      <thead className="bg-primary-green">
        <tr>
          <th className="p-2 text-white border " colSpan={9}>
            Semester 1
          </th>
        </tr>
        <tr>
          <th className="p-2 text-white border">No</th>
          <th className="p-2 text-white border">Kode</th>
          <th className="p-2 text-white border">Mata Kuliah</th>
          <th className="p-2 text-white border">SKS</th>
          <th className="p-2 text-white border">Status</th>
          <th className="p-2 text-white border">Nilai Min</th>
          <th className="p-2 text-white border">Prasyarat</th>
          <th className="p-2 text-white border">Konsentrasi</th>
          <th className="p-2 text-white border">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="p-2 border">{item.no}</td>
              <td className="p-2 border">{item.kode}</td>
              <td className="p-2 border">{item.mataKuliah}</td>
              <td className="p-2 border">{item.sks}</td>
              <td className="p-2 border">{item.status}</td>
              <td className="p-2 border">{item.nilaiMin}</td>
              <td className="p-2 border">{item.prasyarat}</td>
              <td className="p-2 border">{item.konsentrasiBidang}</td>
              <td className="p-2 border flex justify-center gap-2">
                <button onClick={() => onEdit?.(item.id)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete?.(item.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={9} className="p-2 text-center">
              Data tidak ditemukan.
            </td>
          </tr>
        )}

        {/* Row for Total SKS and Summary */}
        <tr className="bg-gray-100 font-semibold">
          <td className="p-2 border text-center" colSpan={3}>
            Total SKS
          </td>
          <td className="p-2 border text-center">{totalSKS}</td>
          <td className="p-2 border text-center">
            Wajib: {totalWajib} | Pilihan: {totalPilihan}
          </td>
          <td className="p-2 border text-center">D</td>
          <td className="p-2 border" colSpan={3}></td>
        </tr>
      </tbody>
    </table>
  );
};

export const TableRpsManagement: React.FC<TableProps> = ({
  data = [], // default empty array
  onEdit,
  onDelete,
}) => {
  const totalSKS = data.reduce((acc, item) => acc + Number(item.sks), 0);

  return (
    <table className="w-full border border-gray-600">
      <thead className="bg-primary-green text-white">
        <tr>
          <th className="p-2 border">Kode MK</th>
          <th className="p-2 border">Mata Kuliah</th>
          <th className="p-2 border">Dosen Penyusun</th>
          <th className="p-2 border">Semester</th>
          <th className="p-2 border">SKS</th>
          <th className="p-2 border">Kelas</th>
          <th className="p-2 border">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="p-2 border">{item.kodeMk}</td>
              <td className="p-2 border">{item.mataKuliah}</td>
              <td className="p-2 border">{item.dosenPenyusun}</td>
              <td className="p-2 border">{item.smt}</td>
              <td className="p-2 border">{item.sks}</td>
              <td className="p-2 border">{item.kelas}</td>
              <td className="p-2 border flex justify-center gap-2">
                <button onClick={() => onEdit?.(item.id)} className="bg-purple-500 text-white px-2 py-1 rounded" title="Edit">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button onClick={() => onEdit?.(item.id)} className="bg-yellow-500 text-white px-2 py-1 rounded" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete?.(item.id)} className="bg-red-500 text-white px-2 py-1 rounded w-8 h-8" title="Hapus">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={7} className="p-2 text-center">
              Data tidak ditemukan.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
