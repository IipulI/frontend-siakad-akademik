import React, { useMemo } from "react";
import { useState } from "react";
import { AdminAcademicRoute } from "../types/VarRoutes.tsx";
import { CplData, PeriodeAkademik, CpmkData, RpsData, CurriculumProdiData, KelasData } from "../components/types.ts";
import { CurriculumData } from "../hooks/academic/useCurriculumYear.ts";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, Save, X, RefreshCw, Paperclip, CornerUpLeft, Check, Pencil, Loader2 } from "lucide-react";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";

import { Api } from "../api/Index";
import { CourseData} from "./types";
import { IPengumuman } from '../types/common.types';

import { CplCpmkCourseResponse } from '../hooks/academic/useCplCpmkCourse';
import { getKelas, getRps, useAddRps, useMapKelasToRps } from "../hooks/academic/useRpsManagement";


interface TableProps {
  data: Array<Record<string, any>>;
  tableHead: string[];
  error: string;
  setId?: (id: string | null) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isEditing?: boolean;
  currentData?: any | null;
  onSave?: () => void;
  onReset?: () => void;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
  isAdding?: boolean;
  onSelect?: (id: number) => void;
  selectedIds?: number[];
  isFormValid?: () => boolean;
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
}

interface TableCourseManagementProps {
  data: CourseData[];
  tableHead?: string[];
  error: string;
  onDelete?: (id: string) => void;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
}

interface TableRpsProps {
  data: RpsData[];
  error: string;
}

interface TableCplProps {
  data: CplCpmkCourseResponse[];
  tableHead: string[];
  error: string;
}

interface TableCpmkProps {
  data: CplCpmkCourseResponse[];
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
  onDelete?: (id: string) => void;
}

interface TableAnnouncementProps {
  data: IPengumuman[];
  tableHead: string[];
  error: string;
  isLoading: boolean;
  isError: boolean;
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

// Table History
interface TableHistoryProps {
  data: Array<Record<string, any>>;
  tableHead: string[];
  error: string;
  totalSks: number;
  batasSks: number;
}

export const TableHistory = ({ data, tableHead, error, totalSks, batasSks }: TableHistoryProps) => {
  const isDataAvailable = data && data.length > 0;

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
        {isDataAvailable ? (
          data.map((row, index) => {
            // Gunakan row.kodeMataKuliah atau ID unik lain jika tersedia sebagai key
            const uniqueKey = row.kodeMataKuliah ? `${row.kodeMataKuliah}-${index}` : index;
            const { id, ...rowWithoutId } = row;
            const rowData = Object.values(rowWithoutId);
            return (
              <tr key={uniqueKey} className="text-center">
                {rowData.map((cell, idx) => (
                  <td key={idx} className="p-2 border text-sm border-black/50">
                    {String(cell ?? "-")} {/* Tampilkan '-' jika data null */}
                  </td>
                ))}
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={tableHead.length} className="text-center border-black border p-2">
              {error || "Data riwayat KRS untuk periode ini tidak ditemukan."}
            </td>
          </tr>
        )}

        {/* Baris Total dan Batas SKS sekarang menggunakan props dinamis */}
        <tr>
          <td colSpan={4} className="border-black/50 text-sm text-center p-2 border">
            Total SKS
          </td>
          <td className="border-black/50 text-sm border text-center p-2">{totalSks}</td>
          <td colSpan={4} className="border-black/50 text-sm border text-center p-2"></td>
        </tr>
        <tr>
          <td colSpan={4} className="border-black/50 text-center p-2 text-sm border">
            Batas SKS
          </td>
          <td className="border-black/50 text-center p-2 text-sm border">{batasSks}</td>
          <td colSpan={4} className="border-black/50 text-sm border text-center p-2"></td>
        </tr>
      </tbody>
    </table>
  );
};

export const TableAnnouncement = ({
                                    data,
                                    tableHead,
                                    error,
                                    isLoading,
                                    isError,
                                  }: TableAnnouncementProps) => {
  const navigate = useNavigate();

  return (
      <table className="w-full my-4">
        <thead>
        <tr>
          {tableHead.map((head) => (
              <th
                  key={head}
                  className="p-4 bg-primary-green text-white border border-gray-600"
              >
                <p className="font-semibold text-center">{head}</p>
              </th>
          ))}
        </tr>
        </thead>
        <tbody className="font-semibold">
        {isLoading && (
            <tr>
              <td
                  colSpan={tableHead.length}
                  className="text-center border-black border p-4"
              >
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              </td>
            </tr>
        )}
        {isError && (
            <tr>
              <td
                  colSpan={tableHead.length}
                  className="text-center border-black border p-4 text-red-600"
              >
                {error}
              </td>
            </tr>
        )}
        {!isLoading && !isError && data && data.length > 0 ? (
            data.map((row) => (
                <tr key={row.id} className="text-center hover:bg-gray-50">
                  <td className="p-2 border text-sm border-black/50">
                    {new Date("2025-07-01").toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-2 border text-sm border-black/50 text-left">
                    {row.judul}
                  </td>
                  <td className="p-2 border text-sm border-black/50">{row.user}</td>
                  <td
                      className="p-2 border text-sm border-black/50 text-center"
                      style={{ verticalAlign: "middle" }}
                  >
                    {/* 2. onClick now navigates to the detail page URL */}
                    <div
                        onClick={() => navigate(`/jadwal/pengumuman/detail/${row.id}`)}
                        className="bg-primary-blueSoft cursor-pointer rounded-sm mx-auto flex items-center justify-center w-8 h-6"
                        title="Lihat Detail"
                    >
                      <Eye className="text-white w-4 h-4" />
                    </div>
                  </td>
                </tr>
            ))
        ) : null}
        {!isLoading && !isError && data.length === 0 && (
            <tr>
              <td
                  colSpan={tableHead.length}
                  className="text-center border-black border p-4"
              >
                Tidak ada pengumuman yang ditemukan.
              </td>
            </tr>
        )}
        </tbody>
      </table>
  );
};

export const TableCurriculumYear = ({ data, tableHead = [], error, onEdit, onDelete, isEditing, isAdding, currentData, onSave, onReset, onInputChange, isFormValid, periodeAkademikList }: TableCurriculumYearProps) => {
  const isDataAvailable = data && data.length > 0;

  const renderDate = (dateString: string) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
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
          {isAdding && currentData && (
            <tr className="text-center">
              <td className="p-2 border text-sm border-black/50">
                <input type="text" name="tahun" value={currentData.tahun} onChange={onInputChange} className="border p-2 w-full" />
              </td>
              <td className="p-2 border text-sm border-black/50">
                <input type="text" name="keterangan" value={currentData.keterangan} onChange={onInputChange} className="border p-2 w-full" />
              </td>
              <td className="p-2 border text-sm border-black/50">
                <select name="siakPeriodeAkademikId" value={currentData.siakPeriodeAkademikId} onChange={onInputChange} className="border px-2 py-1 rounded w-full">
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
                      <select name="siakPeriodeAkademikId" value={currentData.siakPeriodeAkademikId} onChange={onInputChange} className="border p-2 w-full">
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
                    <td className="p-2 border text-sm border-black/50">{row.mulaiBerlaku}</td>
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
              const { id, kodeMataKuliah, namaMataKuliah, sksTatapMuka, sksPraktikum, opsiMataKuliah, programStudi, tahunKurikulum } = row;
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
                  <td className="p-2 border text-sm border-black/50">{opsiMataKuliah === true ? "Wajib" : opsiMataKuliah === false ? "Pilihan" : "-"}</td>
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
    </div>
  );
};

export const TableRps = ({ data, error }: TableRpsProps) => {
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
                <td className="p-2 border text-sm border-black/50">{row.dosenPenyusun?.map((dosen) => dosen.nama).join(", ")}</td>
                <td className="p-2 border text-sm border-black/50">{row.periodeAkademik.namaPeriode}</td>
                <td className="p-2 border text-sm border-black/50">{row.kelas?.map((k) => k.nama).join(", ")}</td>
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

export const TableOBE = ({ data, error }) => {
  const isDataAvailable = data.length > 0;
  const navigate = useNavigate();

  const handleViewProfile = (obeItem) => {
    // Pass ID dan data penting via URL params
    navigate(`${AdminAcademicRoute.obeManagement.graduateProfile}/${obeItem.id}`, {
      state: {
        obeData: obeItem,
      },
    });
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-white border border-gray-300 my-4">
        <thead>
          <tr className="bg-primary-green text-white">
            <th className="p-4 border border-gray-600" rowSpan={2}>
              Kode Prodi
            </th>
            <th className="p-4 border border-gray-600" rowSpan={2}>
              Jenjang - Program Studi
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
                <td className="p-2 border border-black/50">{item.kodeProgramStudi}</td>
                <td className="p-2 border border-black/50">
                  {item.jenjang.jenjang} - {item.programStudi}
                </td>
                <td className="p-2 border border-black/50">{item.pl ? "✅" : "❌"}</td>
                <td className="p-2 border border-black/50">{item.cpl ? "✅" : "❌"}</td>
                <td className="p-2 border border-black/50">{item.plToCpl ? "✅" : "❌"}</td>
                <td className="p-2 border border-black/50">{item.cpmk ? "✅" : "❌"}</td>
                <td className="p-2 border border-black/50 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="bg-primary-blueSoft text-white p-2 rounded cursor-pointer" onClick={() => handleViewProfile(item)}>
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

export const TableCurriculumProdi: React.FC<TableCurriculumProdiProps> = ({ data, tableHead, error, onDelete }) => {
  const navigate = useNavigate();

  // Group data by semester for better display
  const groupedData = React.useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    data.forEach((item) => {
      const semester = item.semester || "1";
      if (!groups[semester]) {
        groups[semester] = [];
      }
      groups[semester].push(item);
    });
    return groups;
  }, [data]);

  // Calculate totals
  const totalSKS = data.reduce((acc, item) => acc + parseInt(String(item.totalSks || "0")), 0);
  const totalWajib = data.filter((item) => item.mataKuliah?.opsiMataKuliah === true).reduce((acc, item) => acc + parseInt(String(item.totalSks || "0")), 0);
  const totalPilihan = data.filter((item) => item.mataKuliah?.opsiMataKuliah === false).reduce((acc, item) => acc + parseInt(String(item.totalSks || "0")), 0);

  const semesters = Object.keys(groupedData).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border border-gray-600 border-collapse ">
        <tbody>
          {data.length > 0 ? (
            <>
              {semesters.map((semester, idx) => (
                <React.Fragment key={`semester-${semester}`}>
                  {/* Spacer untuk jarak antar semester */}
                  {idx !== 0 && (
                    <tr>
                      <td colSpan={tableHead.length} className="h-8"></td>
                    </tr>
                  )}

                  {/* Semester Header */}
                  <tr>
                    <th className="p-2 text-white border bg-primary-green" colSpan={tableHead.length}>
                      Semester {semester}
                    </th>
                  </tr>

                  {/* Table Headers */}
                  <tr>
                    {tableHead.map((head, index) => (
                      <th key={`header-${semester}-${index}`} className="p-2 text-white border font-medium bg-primary-green">
                        {head}
                      </th>
                    ))}
                  </tr>

                  {/* Semester Data */}
                  {groupedData[semester].map((item, index) => (
                    <tr key={`${semester}-${item.id}-${index}`} className="text-center hover:bg-gray-50">
                      <td className="p-2 border">{index + 1}</td>
                      <td className="p-2 border">{semester}</td>
                      <td className="p-2 border">{item.kodeMataKuliah}</td>
                      <td className="p-2 border text-left">{item.namaMataKuliah}</td>
                      <td className="p-2 border">{item.totalSks}</td>
                      <td className="p-2 border text-center">
                        <div className={`inline-block px-3 py-1 rounded font-semibold text-sm ${item.opsiMataKuliah === true ? "bg-primary-blueSoft text-white" : "bg-yellow-400 text-black"}`}>
                          {item.opsiMataKuliah === true ? "Wajib" : "Pilihan"}
                        </div>
                      </td>
                      <td className="p-2 border">{item.nilaiMin || "-"}</td>
                      <td className="p-2 border">{item.prasyarat || "-"}</td>
                      <td className="p-2 border">
                        <div className="flex justify-center gap-2">
                          <button className="bg-primary-blueSoft text-white px-2 py-1 rounded w-8 h-8 cursor-pointer" title="Lihat Detail" onClick={() => navigate(`${AdminAcademicRoute.courseManagement.detailCourse}/${item.id}`)}>
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="bg-red-500 text-white px-2 py-1 rounded w-8 h-8 cursor-pointer" title="Hapus" onClick={() => onDelete?.(item.id)}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Semester Summary */}
                  <tr key={`summary-${semester}`} className="bg-gray-100 font-normal border-t">
                    <td className="p-2 border text-center" colSpan={4}>
                      <strong>Total SKS </strong>
                    </td>
                    <td className="p-2 border text-center">
                      <strong>{groupedData[semester].reduce((acc, item) => acc + parseInt(String(item.totalSks || "0")), 0)}</strong>
                    </td>
                    <td className="p-2 border text-center">
                      <span className="text-sm">
                        W: <strong>{groupedData[semester].filter((item) => item.opsiMataKuliah === true).reduce((acc, item) => acc + parseInt(String(item.totalSks || "0")), 0)}</strong> | P:{" "}
                        <strong>{groupedData[semester].filter((item) => item.opsiMataKuliah === false).reduce((acc, item) => acc + parseInt(String(item.totalSks || "0")), 0)}</strong>
                      </span>
                    </td>
                    <td className="p-2 border" colSpan={3}></td>
                  </tr>
                </React.Fragment>
              ))}
            </>
          ) : (
            <tr>
              <td colSpan={tableHead.length} className="p-8 text-center text-gray-500">
                {error}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export const TableRpsManagement: React.FC<TableRpsManagementProps> = ({ data = [], error, onEdit, onDelete, onView }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RpsData | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  // const { data: classData, isLoading: isClassLoading, error: classError } = getKelas();
  const { data: classData, isLoading: isClassLoading } = useQuery<KelasData[]>({
    queryKey: ["kelas"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const response = await Api.get("/akademik/kelas-kuliah", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("🔍 Raw kelas API data:", response.data.data);
      return response.data.data;
    },
    enabled: isModalOpen,
  });

  const mapKelasMutation = useMapKelasToRps();
  const queryClient = useQueryClient();
  const mutation = useAddRps();
  const navigate = useNavigate();

  const uniqueClasses = useMemo(() => {
    if (!classData) return [];
    const seen = new Map();
    // Filter data kelas, hanya simpan yang namanya unik
    return classData.filter((kelas: KelasData) => {
      if (!seen.has(kelas.nama)) {
        seen.set(kelas.nama, true);
        return true;
      }
      return false;
    });
  }, [classData]);

  const handlePaperclipClick = (item: RpsData) => {
    setSelectedItem(item);
    const existingClassIds = item.kelas?.map((k) => k.id) || [];
    setSelectedClasses(existingClassIds);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setSelectedClasses([]);
  };

  const handleClassToggle = (id: string) => {
    setSelectedClasses((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleSaveClassMapping = () => {
    if (!selectedItem) return;

    // Buat payload sederhana sesuai dokumentasi
    const payload = {
      rpsId: selectedItem.id,
      kelasIds: selectedClasses,
    };

    console.log("PAYLOAD FINAL (SIMPLE & CORRECT):", payload);

    mapKelasMutation.mutate(payload, {
      onSuccess: () => {
        handleCloseModal();
        queryClient.invalidateQueries({ queryKey: ["rps"] });
      },
    });
  };

  // Improved safe value access function
  const getSafeValue = (obj: any, path: string, defaultValue: string = "-") => {
    try {
      const value = path.split(".").reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
      }, obj);
      return value !== null && value !== undefined && value !== "" ? String(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // Improved SKS calculation
  const getSKS = (item: any) => {
    try {
      // First try to get from mataKuliah object
      const sksTatapMuka = Number(getSafeValue(item, "mataKuliah.sksTatapMuka", "0"));
      const sksPraktikum = Number(getSafeValue(item, "mataKuliah.sksPraktikum", "0"));
      const totalSKS = sksTatapMuka + sksPraktikum;

      if (totalSKS > 0) {
        return totalSKS.toString();
      }

      // Fallback to direct sks property
      const directSKS = getSafeValue(item, "sks", "0");
      if (directSKS !== "0" && directSKS !== "-") {
        return directSKS;
      }

      // Last fallback to mataKuliah.sks
      return getSafeValue(item, "mataKuliah.sks", "0");
    } catch {
      return "0";
    }
  };

  // Function to get course code safely
  const getCourseCode = (item: any) => {
    return getSafeValue(item, "mataKuliah.kodeMataKuliah") || getSafeValue(item, "kodeMataKuliah") || getSafeValue(item, "mataKuliah.kode");
  };

  // Function to get course name safely
  const getCourseName = (item: any) => {
    return getSafeValue(item, "mataKuliah.namaMataKuliah") || getSafeValue(item, "namaMataKuliah") || getSafeValue(item, "mataKuliah.nama");
  };

  const getLecturerName = (item: any): string => {
    if (Array.isArray(item.dosenPenyusun) && item.dosenPenyusun.length > 0) {
      return item.dosenPenyusun.map((dosen) => dosen.nama).join(", ");
    }

    if (Array.isArray(item.dosen) && item.dosen.length > 0) {
      return item.dosen.map((dosen) => dosen.nama).join(", ");
    }

    if (typeof item.dosenPenyusun === "string" && item.dosenPenyusun) {
      return item.dosenPenyusun;
    }

    return "-";
  };

  const getSemester = (item: any) => {
    return getSafeValue(item, "mataKuliah.semester") || getSafeValue(item, "semester");
  };

  const getClassName = (item: any) => {
    if (Array.isArray(item.kelas) && item.kelas.length > 0) {
      return item.kelas.map((k) => k.nama || k.namaKelas).join(", ");
    }

    return getSafeValue(item, "namaKelas", "-");
  };
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
              data.map((item, index) => (
                <tr key={item.id || index} className="text-center">
                  <td className="p-2 border">{getCourseCode(item)}</td>
                  <td className="p-2 border text-left">{getCourseName(item)}</td>
                  <td className="p-2 border">{getLecturerName(item)}</td>
                  <td className="p-2 border">{getSemester(item)}</td>
                  <td className="p-2 border">{getSKS(item)}</td>
                  <td className="p-2 border">{getClassName(item)}</td>
                  <td className="p-2 border">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handlePaperclipClick(item)} className="bg-purple-500 text-white px-2 py-1 rounded cursor-pointer hover:bg-purple-600 transition-colors" title="Pemetaan Kelas">
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <div onClick={() => navigate(`${AdminAcademicRoute.rpsManagement.editRps}/${item.id}`)} className="bg-primary-yellow cursor-pointer rounded-sm flex items-center justify-center w-8 h-8" title="Edit">
                        <Pencil className="text-white w-4 h-4" />
                      </div>
                      <div onClick={() => navigate(`${AdminAcademicRoute.rpsManagement.detailRps}/${item.id}`)} className="bg-blue-500 cursor-pointer rounded-sm flex items-center justify-center w-8 h-8" title="View">
                        <Eye className="text-white w-4 h-4" />
                      </div>
                      <button onClick={() => onDelete?.(item.id)} className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer hover:bg-red-600 transition-colors" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-2 text-center text-gray-500 py-8">
                  {error || "Data tidak ditemukan."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for class mapping */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white py-4 px-16 rounded-lg shadow-lg w-[400px] border-primary-green border-t-4">
            <h3 className="text-center text-lg mb-6 font-medium">Memetakan RPS ke Kelas</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
              <span className="font-medium">Kode Mata Kuliah:</span>
              <span className="text-gray-700">{getCourseCode(selectedItem)}</span>

              <span className="font-medium">Mata Kuliah:</span>
              <span className="text-gray-700">{getCourseName(selectedItem)}</span>

              <span className="font-medium">SKS:</span>
              <span className="text-gray-700">{getSKS(selectedItem)}</span>

              <span className="font-medium">Semester:</span>
              <span className="text-gray-700">{getSemester(selectedItem)}</span>

              <div className="col-span-2">
                <label className="font-medium text-gray-600 mb-2 block">Pilih Kelas:</label>
                {isClassLoading ? (
                  <div className="text-center p-4">Memuat kelas...</div>
                ) : (
                  <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md max-h-48 overflow-y-auto">
                    {uniqueClasses.map((kelas: KelasData) => {
                      const isSelected = selectedClasses.includes(kelas.id);
                      return (
                        <button
                          key={kelas.id}
                          onClick={() => handleClassToggle(kelas.id)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isSelected ? "bg-primary-green text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                        >
                          {kelas.nama}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button className="bg-gray-200 px-4 py-2 rounded-lg text-gray-800 flex items-center gap-2 cursor-pointer" onClick={handleCloseModal} disabled={mapKelasMutation.isPending}>
                <CornerUpLeft className="w-4 h-4" />
                <span>Batal</span>
              </button>
              <button
                className="bg-primary-green text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:bg-primary-green/50 cursor-pointer"
                onClick={handleSaveClassMapping}
                disabled={mapKelasMutation.isPending || selectedClasses.length === 0}
              >
                {mapKelasMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>{mapKelasMutation.isPending ? "Menyimpan..." : "Simpan"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
