import React from "react";
import { useState } from "react";
import { AdminAcademicRoute } from "../types/VarRoutes.tsx";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Save, X, RefreshCw, Paperclip, CornerUpLeft, Check, Pencil } from "lucide-react";

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
  onInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
  isAdding: boolean;
  onSelect?: (id: number) => void;
  selectedIds?: number[];

  // curriculum year
  isFormValid?: () => boolean;

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

export const TableCurriculumYear = ({ data, tableHead = [], error, onEdit, onDelete, isEditing, isAdding, currentData, onSave, onReset, onInputChange, isFormValid }: TableProps) => {
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
        {isAdding && currentData && (
          <tr className="text-center ">
            <td className="p-2 border text-sm border-black/50">
              <input type="text" name="tahun" value={currentData.tahun} onChange={onInputChange} className="border p-2 w-full" />
            </td>
            <td className="p-2 border text-sm border-black/50">
              <input type="text" name="Keterangan" value={currentData.Keterangan} onChange={onInputChange} className="border p-2 w-full" />
            </td>
            <td className="p-2 border text-sm border-black/50">
              <select name="mulaiBerlaku" value={currentData.mulaiBerlaku} onChange={onInputChange} className="border p-2 w-full">
                <option value="2025 Genap">2025 Genap</option>
                <option value="2025 Ganjil">2025 Ganjil</option>
                <option value="2024 Genap">2024 Genap</option>
                <option value="2024 Ganjil">2024 Ganjil</option>
              </select>
            </td>
            <td className="p-2 border text-sm border-black/50">
              <input type="date" name="tanggalAwal" value={currentData.tanggalAwal} onChange={onInputChange} className="border p-2 w-full" />
            </td>
            <td className="p-2 border text-sm border-black/50">
              <input type="date" name="tanggalAkhir" value={currentData.tanggalAkhir} onChange={onInputChange} className="border p-2 w-full" />
            </td>
            <td className="p-2 border text-sm border-black/50">
              <div className="flex gap-2 justify-center">
                <button onClick={onSave} className="bg-primary-green p-2 text-white cursor-pointer rounded">
                  <Save size={15} />
                </button>
                <button onClick={onReset} className="bg-yellow-500 p-2 text-white cursor-pointer rounded">
                  <RefreshCw size={15} />
                </button>
              </div>
            </td>
          </tr>
        )}

        {isDataAvailable ? (
          data.map((row) => (
            <tr key={row.id} className="text-center">
              {isEditing && currentData?.id === row.id ? (
                <>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="text" name="tahun" value={currentData.tahun} onChange={onInputChange} className="border p-2 w-full" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="text" name="Keterangan" value={currentData.Keterangan} onChange={onInputChange} className="border p-2 w-full" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <select name="mulaiBerlaku" value={currentData.mulaiBerlaku} onChange={onInputChange} className="border p-2 w-full">
                      <option value="2025 Genap">2025 Genap</option>
                      <option value="2025 Ganjil">2025 Ganjil</option>
                      <option value="2024 Genap">2024 Genap</option>
                      <option value="2024 Ganjil">2024 Ganjil</option>
                    </select>
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="date" name="tanggalAwal" value={currentData.tanggalAwal} onChange={onInputChange} className="border p-2 w-full" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="date" name="tanggalAkhir" value={currentData.tanggalAkhir} onChange={onInputChange} className="border p-2 w-full" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <div className="flex gap-2 justify-center">
                      <button onClick={onSave} className="bg-primary-green p-2 text-white cursor-pointer rounded">
                        <Save size={15} />
                      </button>
                      <button onClick={onReset} className="bg-yellow-500 p-2 text-white cursor-pointer rounded">
                        <RefreshCw size={15} />
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2 border text-sm border-black/50">{row.tahun}</td>
                  <td className="p-2 border text-sm border-black/50">{row.Keterangan}</td>
                  <td className="p-2 border text-sm border-black/50">{row.mulaiBerlaku}</td>
                  <td className="p-2 border text-sm border-black/50">{renderDate(row.tanggalAwal)}</td>
                  <td className="p-2 border text-sm border-black/50">{renderDate(row.tanggalAkhir)}</td>
                  <td className="p-2 border text-sm border-black/50">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => onEdit && onEdit(row.id)} className="bg-yellow-500 p-2 text-white cursor-pointer rounded">
                        <Edit size={15} />
                      </button>

                      <button onClick={() => onDelete && onDelete(row.id)} className="bg-red-500 p-2 text-white cursor-pointer rounded">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </>
              )}
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
  const navigate = useNavigate();
  const isDataAvailable = data && data.length > 0;

  // Cek apakah semua data terpilih
  const isAllSelected = data.length > 0 && (selectedIds?.length ?? 0) === data.length;

  return (
    <table className="w-full my-4 border-collapse border border-gray-400">
      <thead>
        <tr>
          <th className="p-4 bg-primary-green text-white border border-gray-600">
            <input type="checkbox" checked={isAllSelected} onChange={() => onSelect?.(-1)} className="cursor-pointer" />
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

            // if (isEditing && currentData && currentData.id === id) {
            //   return (
            //     <tr key={id} className="text-center bg-yellow-50">
            //       <td className="p-2 border text-sm border-black/50">
            //         <input type="checkbox" checked={isChecked} onChange={() => onSelect?.(id)} className="mx-auto" />
            //       </td>
            //       <td className="p-2 border text-sm border-black/50">
            //         <input type="text" name="kurikulum" value={currentData.kurikulum} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
            //       </td>
            //       <td className="p-2 border text-sm border-black/50">
            //         <input type="text" name="kode" value={currentData.kode} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
            //       </td>
            //       <td className="p-2 border text-sm border-black/50">
            //         <input type="text" name="mataKuliah" value={currentData.mataKuliah} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
            //       </td>
            //       <td className="p-2 border text-sm border-black/50">
            //         <input type="number" name="sks" value={currentData.sks} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
            //       </td>
            //       <td className="p-2 border text-sm border-black/50">
            //         <input type="text" name="jenisMK" value={currentData.jenisMK} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
            //       </td>
            //       <td className="p-2 border text-sm border-black/50">
            //         <input type="text" name="prodiPengampu" value={currentData.prodiPengampu} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
            //       </td>
            //       <td className="p-2 border text-sm border-black/50 text-center">
            //         <button onClick={onSave} className="bg-green-500 text-white px-3 py-1 rounded mr-2">
            //           Simpan
            //         </button>
            //         <button onClick={onReset} className="bg-gray-500 text-white px-3 py-1 rounded">
            //           Batal
            //         </button>
            //       </td>
            //     </tr>
            //   );
            // }

            // if (isAdding && currentData && currentData.id === id) {
            //   // Render baris input untuk tambah data baru
            //   return (
            //     <tr key={id} className="text-center bg-green-50">
            //       <td className="p-2 border text-sm border-black/50">
            //         <input type="checkbox" checked={isChecked} onChange={() => onSelect?.(id)} className="mx-auto" />
            //       </td>
            //       <td className="p-2 border text-sm border-black/50">
            //         <input type="text" name="kurikulum" value={currentData.kurikulum} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
            //       </td>
            //       <td className="p-2 border text-sm border-black/50">
            //         <input type="text" name="kode" value={currentData.kode} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
            //       </td>
            //       <td className="p-2 border text-sm border-black/50">
            //         <input type="text" name="mataKuliah" value={currentData.mataKuliah} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
            //       </td>
            //       <td className="p-2 border text-sm border-black/50">
            //         <input type="number" name="sks" value={currentData.sks} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
            //       </td>
            //       <td className="p-2 border text-sm border-black/50">
            //         <input type="text" name="jenisMK" value={currentData.jenisMK} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
            //       </td>
            //       <td className="p-2 border text-sm border-black/50">
            //         <input type="text" name="prodiPengampu" value={currentData.prodiPengampu} onChange={onInputChange} className="w-full border border-gray-300 rounded px-2 py-1" />
            //       </td>
            //       <td className="p-2 border text-sm border-black/50 text-center">
            //         <button onClick={onSave} className="bg-green-500 text-white px-3 py-1 rounded mr-2">
            //           Simpan
            //         </button>
            //         <button onClick={onReset} className="bg-gray-500 text-white px-3 py-1 rounded">
            //           Batal
            //         </button>
            //       </td>
            //     </tr>
            //   );
            // }

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
                    <div onClick={() => navigate(AdminAcademicRoute.courseManagement.detailCourse)} className="bg-blue-500 cursor-pointer rounded-sm flex items-center justify-center w-8 h-8" title="Edit">
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
                <td className="p-2 border text-sm border-black/50 align-top text-left ">{row.kategori}</td>
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
  const navigate = useNavigate();

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
                <div onClick={() => navigate(AdminAcademicRoute.rpsManagement.rpsManagement)} className="bg-primary-blueSoft cursor-pointer rounded-sm mx-auto flex items-center justify-center w-8 h-8">
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
              Ketua Program Studi
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
                    <button className="bg-primary-blueSoft text-white p-2 rounded">
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

export const TableGraduateProfile = ({ data, tableHead = [], error, onEdit, onDelete, isEditing, isAdding, currentData, onSave, onReset, onInputChange, isFormValid }: TableProps) => {
  const isDataAvailable = data && data.length > 0;

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
        {isAdding && currentData && (
          <tr className="text-center">
            <td className="p-2 border text-sm border-black/50">
              <input type="text" name="kodePl" value={currentData.kodePl} onChange={onInputChange} className="border p-2 w-full" placeholder="Kode PL" />
            </td>
            <td className="p-2 border text-sm border-black/50">
              <input type="text" name="profilLulusan" value={currentData.profilLulusan} onChange={onInputChange} className="border p-2 w-full" placeholder="Profil Lulusan" />
            </td>
            <td className="p-2 border text-sm border-black/50">
              <input type="text" name="profesi" value={currentData.profesi} onChange={onInputChange} className="border p-2 w-full" placeholder="Profesi" />
            </td>
            <td className="p-2 border text-sm border-black/50">
              <input type="text" name="deskripsi" value={currentData.deskripsi} onChange={onInputChange} className="border p-2 w-full" placeholder="Deskripsi" />
            </td>
            <td className="p-2 border text-sm border-black/50">
              <div className="flex gap-2 justify-center">
                <button onClick={onSave} className="bg-primary-green p-2 text-white cursor-pointer rounded">
                  <Save size={18} />
                </button>
                <button onClick={onReset} className="bg-yellow-500 p-2 text-white cursor-pointer rounded">
                  <CornerUpLeft size={18} />
                </button>
              </div>
            </td>
          </tr>
        )}

        {isDataAvailable ? (
          data.map((row) => (
            <tr key={row.id} className="text-center">
              {isEditing && currentData?.id === row.id ? (
                <>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="text" name="kodePl" value={currentData.kodePl} onChange={onInputChange} className="border p-2 w-full" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="text" name="profilLulusan" value={currentData.profilLulusan} onChange={onInputChange} className="border p-2 w-full" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="text" name="profesi" value={currentData.profesi} onChange={onInputChange} className="border p-2 w-full" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="text" name="deskripsi" value={currentData.deskripsi} onChange={onInputChange} className="border p-2 w-full" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <div className="flex gap-2 justify-center">
                      <button onClick={onSave} className="bg-primary-green p-2 text-white cursor-pointer rounded">
                        Save
                      </button>
                      <button onClick={onReset} className="bg-yellow-500 p-2 text-white cursor-pointer rounded">
                        Cancel
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2 border text-sm border-black/50">{row.kodePl}</td>
                  <td className="p-2 border text-sm border-black/50">{row.profilLulusan}</td>
                  <td className="p-2 border text-sm border-black/50">{row.profesi}</td>
                  <td className="p-2 border text-sm border-black/50">{row.deskripsi}</td>
                  <td className="p-2 border text-sm border-black/50">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => onEdit && onEdit(row.id)} className="bg-yellow-500 p-2 text-white cursor-pointer rounded">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => onDelete && onDelete(row.id)} className="bg-red-500 p-2 text-white cursor-pointer rounded">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </>
              )}
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

const mappingOptions = ["PPL001", "PPL002", "PPL003"];

export const TableObeCPL: React.FC<TableProps> = ({ data, tableHead = [], error, onEdit, onDelete, isEditing, isAdding, currentData, onSave, onReset, onInputChange, isFormValid }) => {
  const isDataAvailable = data && data.length > 0;

  const renderPemetaanCheckboxes = (selectedValues: string[] = []) => {
    const options = ["CPL01", "CPL02", "CPL03"];
    return (
      <div className="flex flex-col items-centern">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2">
            <input type="checkbox" name="pemetaan" value={option} checked={selectedValues.includes(option)} onChange={onInputChange} />
            {option}
          </label>
        ))}
      </div>
    );
  };

  return (
    <table className="w-full border border-gray-300">
      <thead className="bg-primary-green">
        <tr>
          {tableHead.length > 0 ? (
            tableHead.map((head) => (
              <th key={head} className="p-2 text-white border border-gray-600 font-medium">
                {head}
              </th>
            ))
          ) : (
            <th className="p-2 text-white border border-gray-600 font-medium">Data tidak tersedia</th>
          )}
        </tr>
      </thead>
      <tbody>
        {isAdding && currentData && (
          <tr>
            <td className="p-2 border">
              <input type="text" name="kodePl" value={currentData.kodePl} onChange={onInputChange} className="w-full p-1 border rounded" placeholder="Kode PL" />
            </td>
            <td className="p-2 border">
              <input type="text" name="deskripsiCapaianPembelajaran" value={currentData.deskripsiCapaianPembelajaran} onChange={onInputChange} className="w-full p-1 border rounded" placeholder="Deskripsi CPL" />
            </td>
            <td className="p-2 border">
              <input type="text" name="kategori" value={currentData.kategori} onChange={onInputChange} className="w-full p-1 border rounded" placeholder="Kategori" />
            </td>
            <td className="p-2 border">{renderPemetaanCheckboxes(currentData.pemetaan ? currentData.pemetaan.split(",") : [])}</td>
            <td className="p-2 border flex justify-center gap-2">
              <button onClick={onSave} className="bg-primary-green text-white px-2 py-1 rounded">
                <Save className="w-4 h-4" />
              </button>
              <button onClick={onReset} className="bg-yellow-500 text-white px-2 py-1 rounded">
                <CornerUpLeft size={16} />
              </button>
            </td>
          </tr>
        )}

        {isDataAvailable ? (
          data.map((row) => (
            <tr key={row.id} className="text-center">
              {isEditing && currentData?.id === row.id ? (
                <>
                  <td className="p-2 border">
                    <input type="text" name="kodePl" value={currentData.kodePl} onChange={onInputChange} className="w-full p-1 border rounded" />
                  </td>
                  <td className="p-2 border">
                    <input type="text" name="deskripsiCapaianPembelajaran" value={currentData.deskripsiCapaianPembelajaran} onChange={onInputChange} className="w-full p-1 border rounded" />
                  </td>
                  <td className="p-2 border">
                    <input type="text" name="kategori" value={currentData.kategori} onChange={onInputChange} className="w-full p-1 border rounded" />
                  </td>
                  <td className="p-2 border">{renderPemetaanCheckboxes(currentData.pemetaan ? currentData.pemetaan.split(",") : [])}</td>
                  <td className="p-2 border ">
                    <div className="flex gap-2 justify-center">
                      <button onClick={onSave} className="bg-primary-green text-white px-2 py-1 rounded">
                        <Save size={18} />
                      </button>
                      <button onClick={onReset} className="bg-yellow-500 text-white px-2 py-1 rounded">
                        <CornerUpLeft size={18} />
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2 border">{row.kodePl}</td>
                  <td className="p-2 border">{row.deskripsiCapaianPembelajaran}</td>
                  <td className="p-2 border">{row.kategori}</td>
                  <td className="p-2 border">{renderPemetaanCheckboxes(row.pemetaan ? row.pemetaan.split(",") : [])}</td>
                  <td className="p-2 border text-sm ">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => onEdit && onEdit(row.id)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => onDelete && onDelete(row.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </>
              )}
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

export const TableObeCpmkMatkul: React.FC<TableProps> = ({ data, tableHead = [], error, onEdit, onDelete, isEditing, isAdding, currentData, onSave, onReset, onInputChange, isFormValid }) => {
  const isDataAvailable = data && data.length > 0;

  const renderPemetaanCheckboxes = (selectedValues: string[] = []) => {
    const options = ["CPL01", "CPL02", "CPL03"];
    return (
      <div className="flex flex-col items-center">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2">
            <input type="checkbox" name="pemetaan" value={option} checked={selectedValues.includes(option)} onChange={onInputChange} />
            {option}
          </label>
        ))}
      </div>
    );
  };

  return (
    <table className="w-full border border-gray-300">
      <thead className="bg-primary-green">
        <tr>
          {tableHead.length > 0 ? (
            tableHead.map((head) => (
              <th key={head} className="p-2 text-white border border-gray-600 font-medium">
                {head}
              </th>
            ))
          ) : (
            <th className="p-2 text-white border border-gray-600 font-medium">Data tidak tersedia</th>
          )}
        </tr>
      </thead>
      <tbody>
        {isAdding && currentData && (
          <tr>
            <td className="p-2 border">
              <input type="text" name="kodeCpmk" value={currentData.kodeCpmk} onChange={onInputChange} className="w-full p-1 border rounded" placeholder="Kode CPMK" />
            </td>
            <td className="p-2 border">
              <input type="text" name="deskripsi" value={currentData.deskripsi} onChange={onInputChange} className="w-full p-1 border rounded" placeholder="Deskripsi CPMK" />
            </td>
            <td className="p-2 border">{renderPemetaanCheckboxes(currentData.pemetaan ? currentData.pemetaan.split(",") : [])}</td>
            <td className="p-2 border">
              <div className="flex gap-2 justify-center">
                <button onClick={onSave} className="bg-primary-green text-white px-2 py-1 rounded">
                  <Save size={18} />
                </button>
                <button onClick={onReset} className="bg-yellow-500 text-white px-2 py-1 rounded">
                  <CornerUpLeft size={16} />
                </button>
              </div>
            </td>
          </tr>
        )}

        {isDataAvailable ? (
          data.map((row) => (
            <tr key={row.id} className="text-center">
              {isEditing && currentData?.id === row.id ? (
                <>
                  <td className="p-2 border">
                    <input type="text" name="kodeCpmk" value={currentData.kodeCpmk} onChange={onInputChange} className="w-full p-1 border rounded" />
                  </td>
                  <td className="p-2 border">
                    <input type="text" name="deskripsi" value={currentData.deskripsi} onChange={onInputChange} className="w-full p-1 border rounded" />
                  </td>
                  <td className="p-2 border">{renderPemetaanCheckboxes(currentData.pemetaan ? currentData.pemetaan.split(",") : [])}</td>
                  <td className="p-2 border">
                    <div className="flex gap-2 justify-center">
                      <button onClick={onSave} className="bg-primary-green text-white px-2 py-1 rounded">
                        <Save size={18} />
                      </button>
                      <button onClick={onReset} className="bg-yellow-500 text-white px-2 py-1 rounded">
                        <CornerUpLeft size={18} />
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2 border">{row.kodeCpmk}</td>
                  <td className="p-2 border">{row.deskripsi}</td>
                  <td className="p-2 border">{renderPemetaanCheckboxes(row.pemetaan ? row.pemetaan.split(",") : [])}</td>
                  <td className="p-2 border text-sm">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => onEdit && onEdit(row.id)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => onDelete && onDelete(row.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </>
              )}
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

export const TableCurriculumProdi: React.FC<TableProps> = ({ data, onEdit, onDelete }) => {
  const totalSKS = data.reduce((acc, item) => acc + parseInt(item.sks), 0);
  const totalWajib = data.filter((item) => item.status === "Wajib").reduce((acc, item) => acc + parseInt(item.sks), 0);
  const totalPilihan = data.filter((item) => item.status === "Pilihan").reduce((acc, item) => acc + parseInt(item.sks), 0);

  return (
    <table className="w-full border border-gray-600 border-collapse">
      <thead className="bg-primary-green">
        <tr>
          <th className="p-2 text-white border " colSpan={9}>
            Semester 1
          </th>
        </tr>
        <tr>
          <th className="p-2 text-white border font-medium">No</th>
          <th className="p-2 text-white border font-medium">Kode</th>
          <th className="p-2 text-white border font-medium">Mata Kuliah</th>
          <th className="p-2 text-white border font-medium">SKS</th>
          <th className="p-2 text-white border font-medium">Status</th>
          <th className="p-2 text-white border font-medium">Nilai Min</th>
          <th className="p-2 text-white border font-medium">Prasyarat</th>
          <th className="p-2 text-white border font-medium">Konsentrasi</th>
          <th className="p-2 text-white border font-medium">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="p-2 border">{item.no}</td>
              <td className="p-2 border">{item.kode}</td>
              <td className="p-2 border text-left">{item.mataKuliah}</td>
              <td className="p-2 border">{item.sks}</td>
              <td className="p-2 border text-center">
                <div
                  className={`inline-block px-3 py-1 rounded font-semibold
      ${item.status === "Wajib" ? "bg-primary-blueSoft text-white" : ""}
      ${item.status === "Pilihan" ? "bg-yellow-400 text-black" : ""}
    `}
                >
                  {item.status}
                </div>
              </td>
              <td className="p-2 border">{item.nilaiMin}</td>
              <td className="p-2 border">{item.prasyarat}</td>
              <td className="p-2 border">{item.konsentrasiBidang}</td>
              <td className="p-2 border flex justify-center gap-2">
                <button onClick={() => onEdit?.(item.id)} className="bg-primary-yellow text-white px-2 py-1 rounded w-8 h-8">
                  <Paperclip className="w-4 h-4" />
                </button>

                <button onClick={() => onEdit?.(item.id)} className="bg-primary-blueSoft text-white px-2 py-1 rounded w-8 h-8">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete?.(item.id)} className="bg-red-500 text-white px-2 py-1 rounded w-8 h-8">
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

// rps

interface RPSData {
  id: number;
  kodeMk: string;
  mataKuliah: string;
  dosenPenyusun: string;
  smt: string;
  sks: string;
  kelas: string;
}

export const TableRpsManagement: React.FC<TableProps> = ({ data = [], onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RPSData | null>(null);

  const handlePaperclipClick = (item: RPSData) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const totalSKS = data.reduce((acc, item) => acc + Number(item.sks), 0);

  return (
    <>
      <table className="w-full border border-gray-600">
        <thead className="bg-primary-green text-white">
          <tr>
            <th className="p-2 border font-medium">Kode MK</th>
            <th className="p-2 border font-medium">Mata Kuliah</th>
            <th className="p-2 border font-medium">Dosen Penyusun</th>
            <th className="p-2 border font-medium">Smt.</th>
            <th className="p-2 border font-medium">SKS</th>
            <th className="p-2 border font-medium">Kelas</th>
            <th className="p-2 border font-medium">Aksi</th>
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
                  <button onClick={() => handlePaperclipClick(item)} className="bg-purple-500 text-white px-2 py-1 rounded" title="Edit">
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

      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white py-4 px-16 rounded-lg shadow-lg w-[400px] border-primary-green border-t-3">
            <h3 className="text-center text-lg mb-6 font-medium">Memetakan RPS ke Kelas</h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-2 mb-4">
              <span>Mata Kuliah:</span>
              <span className="text-gray-700">{selectedItem.mataKuliah}</span>

              <span>SKS:</span>
              <span className="text-gray-700">{selectedItem.sks}</span>

              <span>Semester:</span>
              <span className="text-gray-700">{selectedItem.smt}</span>

              <label>Pilih Kelas:</label>
              <select className="border px-2 py-1 rounded">
                <option value="">Reguler_A</option>
                <option value="">Reguler_B</option>
                <option value="">Reguler_C</option>
                <option value="">Reguler_D</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button className="bg-[#828282] px-4 py-2 rounded-lg text-primary-white flex items-center gap-2 cursor-pointer" onClick={handleCloseModal}>
                <CornerUpLeft className="w-4 h-4" />
                <span>Batal</span>
              </button>
              <button className="bg-primary-green text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
                <Check className="w-4 h-4" />
                <span>Simpan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
