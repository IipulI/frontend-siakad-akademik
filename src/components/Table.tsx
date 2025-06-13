import React from "react";
import { useState } from "react";
import { AdminAcademicRoute } from "../types/VarRoutes.tsx";
import { CourseData, CplData, CurriculumData, PeriodeAkademik, CpmkData, RpsData, CurriculumProdiData } from "../components/types.ts";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Save, X, RefreshCw, Paperclip, CornerUpLeft, Check, Pencil } from "lucide-react";

interface TableProps {
  data: Array<Record<string, any>>;
  tableHead: string[];
  error: string;
  setId?: (id: string | null) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
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

  // ObeCPMK
  onSaveNewCpmk?: () => void;
  newCpmk?: any;

  // ObeCpmkMatkul
  onSaveNewCpmkMatkul?: () => void;
  newCpmkMatkul?: any;
}

interface TableCurriculumYearProps {
  data: CurriculumData[];
  tableHead: string[];
  error: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isEditing: boolean;
  isAdding: boolean;
  currentData: CurriculumData | null;
  onSave: () => void;
  onReset: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
  isFormValid: () => boolean;
  periodeAkademikList: PeriodeAkademik[];
  selectedPeriodeId: string;
  setSelectedPeriodeId: (id: string) => void;
}

interface TableCourseManagementProps {
  data: CourseData[];
  tableHead?: string[];
  error: string;
  onDelete?: (id: string) => void;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
}

interface TableCplProps {
  data: CplData[];
  tableHead: string[];
  error: string;
}

interface TableCpmkProps {
  data: CpmkData[];
  tableHead: string[];
  error: string;
}

interface TableObeCplProps {
  data: CplData[];
  tableHead: string[];
  error: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isEditing: boolean;
  isAdding: boolean;
  currentData: CplData | null;
  onSave: () => void;
  onReset: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
  isFormValid: () => boolean;
}

interface TableObeCpmkProps {
  data: CpmkData[];
  tableHead: string[];
  error: string;
}

interface TableRpsManagementProps {
  data: RpsData[];
  error: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

interface TableCurriculumProdiProps {
  data: CurriculumProdiData[];
  tableHead: string[];
  error: string;
}

// --- table ---

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

export const TableCurriculumYear = ({
  data,
  tableHead = [],
  error,
  onEdit,
  onDelete,
  isEditing,
  isAdding,
  currentData,
  onSave,
  onReset,
  onInputChange,
  isFormValid,
  periodeAkademikList,

  selectedPeriodeId,
  setSelectedPeriodeId,
}: TableCurriculumYearProps) => {
  const isDataAvailable = data && data.length > 0;

  const renderDate = (dateString: string) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const getPeriodeName = (periodeId: string | number) => {
    // 1. Langsung tangani jika ID tidak valid atau kosong
    if (!periodeId) {
      return "Tidak ada periode";
    }

    // 2. Ubah ID yang dicari menjadi string untuk memastikan konsistensi
    const idToFind = String(periodeId).trim();

    // 3. Cari periode dengan membandingkan keduanya sebagai string
    const periode = periodeAkademikList.find((p) => String(p.id).trim() === idToFind);

    // 4. Jika ditemukan, kembalikan nama periode. Jika tidak, kembalikan pesan error.
    if (periode) {
      return periode.namaPeriode || "Nama periode tidak tersedia";
    }

    // Pesan debug ini sangat membantu
    console.log("❌ Periode tidak ditemukan untuk ID:", idToFind);
    console.log(
      "🔍 ID yang tersedia di periodeAkademikList:",
      periodeAkademikList.map((p) => p.id)
    );

    return `ID tidak ditemukan: ${idToFind}`;
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full my-4 ">
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
          {/* Form tambah */}
          {isAdding && currentData && (
            <tr className="text-center">
              <td className="p-2 border text-sm border-black/50">
                <input type="text" name="tahun" value={currentData.tahun} onChange={onInputChange} className="border p-2 w-full" />
              </td>
              <td className="p-2 border text-sm border-black/50">
                <input type="text" name="keterangan" value={currentData.keterangan} onChange={onInputChange} className="border p-2 w-full" />
              </td>
              <td className="p-2 border text-sm border-black/50">
                <select name="siakPeriodeAkademikId" value={selectedPeriodeId} onChange={(e) => setSelectedPeriodeId(e.target.value)} className="border px-2 py-1 rounded w-full">
                  <option value="">-- Pilih Periode Akademik --</option>
                  {periodeAkademikList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.namaPeriode}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2 border text-sm border-black/50">
                <input type="date" name="tanggalMulai" value={currentData.tanggalMulai} onChange={onInputChange} className="border p-2 w-full" />
              </td>
              <td className="p-2 border text-sm border-black/50">
                <input type="date" name="tanggalSelesai" value={currentData.tanggalSelesai} onChange={onInputChange} className="border p-2 w-full" />
              </td>
              <td className="p-2 border text-sm border-black/50">
                <div className="flex gap-2 justify-center">
                  <button onClick={onSave} className="bg-primary-green p-2 text-white cursor-pointer rounded disabled:opacity-50" disabled={!isFormValid()}>
                    <Save size={17} />
                  </button>
                  <button onClick={onReset} className="bg-yellow-500 p-2 text-white cursor-pointer rounded">
                    <RefreshCw size={17} />
                  </button>
                </div>
              </td>
            </tr>
          )}

          {/* Data rows */}
          {isDataAvailable ? (
            data.map((row) => (
              <tr key={row.id} className="text-center">
                {isEditing && currentData?.id === row.id ? (
                  <>
                    <td className="p-2 border text-sm border-black/50">
                      <input type="text" name="tahun" value={currentData.tahun} onChange={onInputChange} className="border p-2 w-full" />
                    </td>
                    <td className="p-2 border text-sm border-black/50">
                      <input type="text" name="keterangan" value={currentData.keterangan} onChange={onInputChange} className="border p-2 w-full" />
                    </td>
                    <td className="p-2 border text-sm border-black/50">
                      <select name="siakPeriodeAkademikId" value={selectedPeriodeId} onChange={(e) => setSelectedPeriodeId(e.target.value)} className="border p-2 w-full">
                        <option value="">-- Pilih Periode Akademik --</option>
                        {periodeAkademikList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.namaPeriode}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 border text-sm border-black/50">
                      <input type="date" name="tanggalMulai" value={currentData.tanggalMulai} onChange={onInputChange} className="border p-2 w-full" />
                    </td>
                    <td className="p-2 border text-sm border-black/50">
                      <input type="date" name="tanggalSelesai" value={currentData.tanggalSelesai} onChange={onInputChange} className="border p-2 w-full" />
                    </td>
                    <td className="p-2 border text-sm border-black/50">
                      <div className="flex gap-2 justify-center">
                        <button onClick={onSave} className="bg-primary-green p-2 text-white cursor-pointer rounded disabled:opacity-50" disabled={!isFormValid()}>
                          <Save size={17} />
                        </button>
                        <button onClick={onReset} className="bg-yellow-500 p-2 text-white cursor-pointer rounded">
                          <RefreshCw size={17} />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2 border text-sm border-black/50">{row.tahun}</td>
                    <td className="p-2 border text-sm border-black/50">{row.keterangan}</td>
                    <td className="p-2 border text-sm border-black/50">
                      {/* <span className={row.siakPeriodeAkademikId ? "" : "text-red-500 italic"}>{getPeriodeName(row.siakPeriodeAkademikId)}</span> */}

                      {row.mulaiBerlaku}
                    </td>
                    <td className="p-2 border text-sm border-black/50">{renderDate(row.tanggalMulai)}</td>
                    <td className="p-2 border text-sm border-black/50">{renderDate(row.tanggalSelesai)}</td>
                    <td className="p-2 border text-sm border-black/50">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => onEdit && onEdit(row.id)} className="bg-yellow-500 p-2 text-white cursor-pointer rounded">
                          <Pencil size={17} />
                        </button>
                        <button onClick={() => onDelete && onDelete(row.id)} className="bg-red-500 p-2 text-white cursor-pointer rounded">
                          <Trash2 size={17} />
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
    </div>
  );
};

export const TableCourseManagement: React.FC<TableCourseManagementProps> = ({ data, tableHead = [], error, onDelete, selectedIds, onSelect }) => {
  const navigate = useNavigate();
  const isDataAvailable = data && data.length > 0;
  const isAllSelected = data.length > 0 && (selectedIds?.length ?? 0) === data.length;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full my-4 border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="p-4 bg-primary-green text-white border border-gray-600">
              <input type="checkbox" checked={isAllSelected} onChange={() => onSelect?.("-1")} className="cursor-pointer" />
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
              const { id, siakTahunKurikulumId, kodeMataKuliah, namaMataKuliah, sksTatapMuka, sksPraktikum, jenisMataKuliah, siakProgramStudiId, programStudi, tahunKurikulum } = row;
              const isChecked = selectedIds?.includes(id) ?? false;

              return (
                <tr key={id} className="text-center">
                  <td className="p-2 border text-sm border-black/50">
                    <input type="checkbox" checked={isChecked} onChange={() => onSelect?.(id)} className="mx-auto cursor-pointer" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">{tahunKurikulum}</td>
                  <td className="p-2 border text-sm border-black/50">{kodeMataKuliah}</td>
                  <td className="p-2 border text-sm border-black/50">{namaMataKuliah}</td>
                  <td className="p-2 border text-sm border-black/50">{sksTatapMuka + sksPraktikum}</td>
                  <td className="p-2 border text-sm border-black/50">{jenisMataKuliah}</td>
                  <td className="p-2 border text-sm border-black/50">{programStudi}</td>
                  <td className="p-2 border text-sm border-black/50 text-center">
                    <div className="flex justify-center gap-2">
                      <div onClick={() => navigate(`${AdminAcademicRoute.courseManagement.detailCourse}/${id}`)} className="bg-blue-500 cursor-pointer rounded-sm flex items-center justify-center w-8 h-8" title="View">
                        <Eye className="text-white w-4 h-4" />
                      </div>
                      <div onClick={() => navigate(`${AdminAcademicRoute.courseManagement.editCourse}/${id}`)} className="bg-primary-yellow cursor-pointer rounded-sm flex items-center justify-center w-8 h-8" title="Edit">
                        <Pencil className="text-white w-4 h-4" />
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
    </div>
  );
};

export const TableCpl = ({ data, tableHead, error }: TableCplProps) => {
  return (
    <div className="w-full overflow-x-auto">
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
                  <td className="p-2 border text-sm border-black/50 align-top text-left ">{row.kategoriCpl}</td>
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
    </div>
  );
};

export const TableCpmk = ({ data, tableHead, error }: TableCpmkProps) => {
  return (
    <div className="w-full overflow-x-auto">
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
                  <td className="p-2 border text-sm border-black/50">{row.kodeMataKuliah}</td>
                  <td className="p-2 border text-sm border-black/50 text-left">tets</td>
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
    </div>
  );
};

export const TableRps = ({ data, error, setId }: TableProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-x-auto">
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
    </div>
  );
};

export const TableOBE = ({ data, tableHead, error }) => {
  const isDataAvailable = data.length > 0;

  const navigate = useNavigate();

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
                    <button className="bg-primary-blueSoft text-white p-2 rounded" onClick={() => navigate(AdminAcademicRoute.obeManagement.graduateProfile)}>
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
              <input type="text" name="profil" value={currentData.profil} onChange={onInputChange} className="border p-2 w-full" placeholder="Profil" />
            </td>
            <td className="p-2 border text-sm border-black/50">
              <input type="text" name="profesi" value={currentData.profesi} onChange={onInputChange} className="border p-2 w-full" placeholder="Profesi" />
            </td>
            <td className="p-2 border text-sm border-black/50">
              <input type="text" name="deskripsiPl" value={currentData.deskripsiPl} onChange={onInputChange} className="border p-2 w-full" placeholder="Deskripsi Pl" />
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
                    <input type="text" name="profil" value={currentData.profil} onChange={onInputChange} className="border p-2 w-full" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="text" name="profesi" value={currentData.profesi} onChange={onInputChange} className="border p-2 w-full" />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input type="text" name="deskripsiPl" value={currentData.deskripsiPl} onChange={onInputChange} className="border p-2 w-full" />
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
                  <td className="p-2 border text-sm border-black/50">{row.profil}</td>
                  <td className="p-2 border text-sm border-black/50">{row.profesi}</td>
                  <td className="p-2 border text-sm border-black/50">{row.deskripsiPl}</td>
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
              <input type="text" name="kodeCpl" value={currentData.kodeCpl} onChange={onInputChange} className="w-full p-1 border rounded" placeholder="Kode CPL" />
            </td>
            <td className="p-2 border">
              <input type="text" name="deskripsiCpl" value={currentData.deskripsiCpl} onChange={onInputChange} className="w-full p-1 border rounded" placeholder="Deskripsi CPL" />
            </td>
            <td className="p-2 border">
              <input type="text" name="kategoriCpl" value={currentData.kategoriCpl} onChange={onInputChange} className="w-full p-1 border rounded" placeholder="Kategori" />
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
                    <input type="text" name="kodePl" value={currentData.kodeCpl} onChange={onInputChange} className="w-full p-1 border rounded" />
                  </td>
                  <td className="p-2 border">
                    <input type="text" name="deskripsiCapaianPembelajaran" value={currentData.deskripsiCpl} onChange={onInputChange} className="w-full p-1 border rounded" />
                  </td>
                  <td className="p-2 border">
                    <input type="text" name="kategori" value={currentData.kategoriCpl} onChange={onInputChange} className="w-full p-1 border rounded" />
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
                  <td className="p-2 border">{row.kodeCpl}</td>
                  <td className="p-2 border">{row.deskripsiCpl}</td>
                  <td className="p-2 border">{row.kategoriCpl}</td>
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

export const TableObeCpmk: React.FC<TableObeCpmkProps> = ({ data, tableHead, error }) => {
  const navigate = useNavigate();

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
        {data.length > 0 ? (
          data.map((cpmk) => (
            <tr key={cpmk.id} className="text-center">
              <td className="p-2 border">{cpmk.kodeMataKuliah}</td>
              <td className="p-2 border">{cpmk.namaMataKuliah}</td>
              <td className="p-2 border">{cpmk.hasCpmk}</td>
              <td className="p-2 border flex justify-center gap-2">
                <button onClick={() => handleViewDetail?.(cpmk.id)} className="bg-primary-blueSoft text-white px-2 py-1 rounded w-8 h-8 cursor-pointer">
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

export const TableCurriculumProdi: React.FC<TableCurriculumProdiProps> = ({ data, tableHead, error }) => {
  // Calculate totals
  const totalSKS = data.reduce((acc, item) => acc + parseInt(String(item.totalSks || "0")), 0);
  const totalWajib = data.filter((item) => item.mataKuliah.jenisMataKuliah === "Wajib").reduce((acc, item) => acc + parseInt(String(item.totalSks || "0")), 0);
  const totalPilihan = data.filter((item) => item.mataKuliah.jenisMataKuliah === "Pilihan").reduce((acc, item) => acc + parseInt(String(item.totalSks || "0")), 0);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border border-gray-600 border-collapse">
        <thead className="bg-primary-green">
          <tr>
            <th className="p-2 text-white border " colSpan={9}>
              Kurikulum Program Studi
            </th>
          </tr>
          <tr>
            {tableHead.map((head, index) => (
              <th key={index} className="p-2 text-white border font-medium">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            <>
              {data.map((item, index) => (
                <tr key={item.id} className="text-center hover:bg-gray-50">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{item.mataKuliah.kodeMataKuliah}</td>
                  <td className="p-2 border text-left">{item.mataKuliah.namaMataKuliah}</td>
                  <td className="p-2 border">{item.totalSks}</td>
                  <td className="p-2 border text-center">
                    <div
                      className={`inline-block px-3 py-1 rounded font-semibold text-sm
                ${item.mataKuliah.jenisMataKuliah === "Wajib" ? "bg-primary-blueSoft text-white" : ""}
                ${item.mataKuliah.jenisMataKuliah === "Pilihan" ? "bg-yellow-400 text-black" : ""}
              `}
                    >
                      {item.mataKuliah.jenisMataKuliah}
                    </div>
                  </td>
                  <td className="p-2 border">{item.mataKuliah.nilaiMin || "-"}</td>
                  <td className="p-2 border">{item.mataKuliah.prasyaratMataKuliah1?.namaMataKuliah || "-"}</td>
                  <td className="p-2 border">{item.mataKuliah.programStudi || "-"}</td>
                  <td className="p-2 border">
                    <div className="flex justify-center gap-2">
                      <button className="bg-primary-yellow text-white px-2 py-1 rounded w-8 h-8 hover:bg-yellow-600 transition duration-200" title="Lampiran">
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <button className="bg-primary-blueSoft text-white px-2 py-1 rounded w-8 h-8 hover:bg-blue-600 transition duration-200" title="Lihat Detail">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="bg-red-500 text-white px-2 py-1 rounded w-8 h-8 hover:bg-red-600 transition duration-200" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Summary Row -- DENGAN KEY YANG SUDAH DITAMBAHKAN */}
              <tr key="summary-row" className="bg-gray-100 font-semibold border-t-2">
                <td className="p-2 border text-center" colSpan={3}>
                  <strong>Total SKS</strong>
                </td>
                <td className="p-2 border text-center">
                  <strong>{totalSKS}</strong>
                </td>
                <td className="p-2 border text-center">
                  <span className="text-sm">
                    Wajib: <strong>{totalWajib}</strong> | Pilihan: <strong>{totalPilihan}</strong>
                  </span>
                </td>
                <td className="p-2 border text-center">D</td>
                <td className="p-2 border" colSpan={3}></td>
              </tr>
            </>
          ) : (
            <tr>
              <td colSpan={9} className="p-8 text-center text-gray-500">
                {error}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// rps

export const TableRpsManagement: React.FC<TableRpsManagementProps> = ({ data = [], error, onEdit, onDelete, onView }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RpsData | null>(null);

  const navigate = useNavigate();

  const handlePaperclipClick = (item: RpsData) => {
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
      <div className="w-full overflow-x-auto">
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
                  <td className="p-2 border">{item.mataKuliah.namaMataKuliah}</td>
                  <td className="p-2 border">{item.mataKuliah.namaMataKuliah}</td>
                  <td className="p-2 border">{item.dosenPenyusun.nama}</td>
                  <td className="p-2 border">{item.mataKuliah.semester}</td>
                  <td className="p-2 border">{item.mataKuliah.sksTatapMuka}</td>
                  <td className="p-2 border">{item.kelas.nama}</td>
                  <td className="p-2 border flex justify-center gap-2">
                    <button onClick={() => handlePaperclipClick(item)} className="bg-purple-500 text-white px-2 py-1 rounded" title="Edit">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button onClick={() => navigate(AdminAcademicRoute.rpsManagement.editRps)} className="bg-yellow-500 text-white px-2 py-1 rounded" title="Edit">
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
      </div>

      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white py-4 px-16 rounded-lg shadow-lg w-[400px] border-primary-green border-t-3">
            <h3 className="text-center text-lg mb-6 font-medium">Memetakan RPS ke Kelas</h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-2 mb-4">
              <span>Mata Kuliah:</span>
              <span className="text-gray-700">{selectedItem.mataKuliah.namaMataKuliah}</span>

              <span>SKS:</span>
              <span className="text-gray-700">{selectedItem.sks}</span>

              <span>Semester:</span>
              <span className="text-gray-700">{selectedItem.mataKuliah.semester}</span>

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
