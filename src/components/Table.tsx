import React, { useMemo } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Edit,
  Trash2,
  Save,
  X,
  RefreshCw,
  Paperclip,
  CornerUpLeft,
  Check,
  Pencil,
  Link2,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useAddRps,
  useMapKelasToRps,
} from "../hooks/academic/useRpsManagement";
import { SelectInput } from "./admin-academic/student-data/Input";
import { getAcademicPeriods, getProgramStudi } from "../hooks/useGeneral";
import { AdminAcademicRoute } from "../types/VarRoutes";
import {
  CurriculumData,
  PeriodeAkademik,
  RpsData,
  CplData,
  CpmkData,
  CurriculumProdiData,
} from "./types";
import { CourseData } from "../hooks/academic/useCourseManagement";
import { CplCpmkCourseResponse } from "../hooks/academic/useCplCpmkCourse";
import { IPengumuman } from "../types/common.types";

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
  onInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
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

  // CPL dynamic mapping
  plList?: Array<{ id: string; kode: string; profil: string }>;
  onCheckboxChange?: (plId: string, checked: boolean) => void;
  obeId?: string;
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
  onInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
  isFormValid: () => boolean;
  periodeAkademikList: PeriodeAkademik[];
  // selectedPeriodeId: string;
  // setSelectedPeriodeId: (id: string) => void;
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
  onInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
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
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 my-4">
    <table className="w-full border-collapse text-left">
      <thead>
        <tr>
          {tableHead.map((head) => (
            <th
              key={head}
              className="py-3 px-4 bg-primary-green text-white text-xs md:text-sm font-semibold tracking-wider text-center"
            >
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
        {data && data.length > 0 ? (
          data.map((row, index) => {
            const { id, ...rowWithoutId } = row;
            const rowData = Object.values(rowWithoutId);
            return (
              <tr key={index} className="text-center hover:bg-emerald-50/20 transition-colors">
                {rowData.map((cell, idx) => (
                  <td key={idx} className="py-2.5 px-3 text-slate-700 font-medium">
                    {String(cell)}
                  </td>
                ))}
              </tr>
            );
          })
        ) : (
          <tr>
            <td
              colSpan={tableHead.length}
              className="text-center py-8 text-slate-400 text-xs md:text-sm"
            >
              {error}
            </td>
          </tr>
        )}
      </tbody>
    </table>
    </div>
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

export const TableHistory = ({
  data,
  tableHead,
  error,
  totalSks,
  batasSks,
}: TableHistoryProps) => {
  const isDataAvailable = data && data.length > 0;

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 my-4">
    <table className="w-full border-collapse text-left">
      <thead>
        <tr>
          {tableHead.map((head) => (
            <th
              key={head}
              className="py-3 px-4 bg-primary-green text-white text-xs md:text-sm font-semibold tracking-wider text-center"
            >
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
        {isDataAvailable ? (
          data.map((row, index) => {
            const uniqueKey = row.kodeMataKuliah
              ? `${row.kodeMataKuliah}-${index}`
              : index;
            const { id, ...rowWithoutId } = row;
            const rowData = Object.values(rowWithoutId);
            return (
              <tr key={uniqueKey} className="text-center hover:bg-emerald-50/20 transition-colors">
                {rowData.map((cell, idx) => (
                  <td key={idx} className="py-2.5 px-3 text-slate-700 font-medium">
                    {String(cell ?? "-")}
                  </td>
                ))}
              </tr>
            );
          })
        ) : (
          <tr>
            <td
              colSpan={tableHead.length}
              className="text-center py-8 text-slate-400 text-xs md:text-sm"
            >
              {error}
            </td>
          </tr>
        )}

        <tr className="bg-slate-50 font-semibold text-slate-800">
          <td
            colSpan={4}
            className="py-2.5 px-4 text-center"
          >
            Total SKS
          </td>
          <td className="py-2.5 px-3 text-center">{totalSks ?? 25}</td>
          <td
            colSpan={4}
            className="py-2.5 px-3 text-center"
          ></td>
        </tr>
        <tr className="bg-slate-50 font-semibold text-slate-800">
          <td
            colSpan={4}
            className="py-2.5 px-4 text-center"
          >
            Batas SKS
          </td>
          <td className="py-2.5 px-3 text-center">{batasSks ?? 25}</td>
          <td
            colSpan={4}
            className="py-2.5 px-3 text-center"
          ></td>
        </tr>
      </tbody>
    </table>
    </div>
  );
};

export const TableAnnouncement = ({
  data,
  tableHead,
  error,
  setId,
}: TableProps) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 my-4">
    <table className="w-full border-collapse text-left">
      <thead>
        <tr>
          {tableHead.map((head) => (
            <th
              key={head}
              className="py-3 px-4 bg-primary-green text-white text-xs md:text-sm font-semibold tracking-wider text-center"
            >
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
        {data && data.length > 0 ? (
          data.map((row, index) => {
            return (
              <tr key={index} className="text-center hover:bg-emerald-50/20 transition-colors">
                <td className="py-2.5 px-3 text-slate-700 font-medium">
                  {row.tanggal}
                </td>
                <td className="py-2.5 px-3 text-slate-700 font-medium">
                  {row.penulis}
                </td>
                <td className="py-2.5 px-3 text-slate-700 font-medium">
                  {row.judul}
                </td>
                <td className="py-2.5 px-3 text-center align-middle">
                  <button
                    type="button"
                    onClick={() => setId && setId(row.id)}
                    title="Lihat Pengumuman"
                    className="bg-primary-blueSoft/90 hover:bg-primary-blueSoft text-white cursor-pointer rounded-lg mx-auto flex items-center justify-center w-8 h-7 shadow-2xs transition-transform active:scale-95"
                  >
                    <Eye className="text-white w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td
              colSpan={tableHead.length}
              className="text-center py-8 text-slate-400 text-xs md:text-sm"
            >
              {error}
            </td>
          </tr>
        )}
      </tbody>
    </table>
    </div>
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
}: // selectedPeriodeId,
// setSelectedPeriodeId,
TableCurriculumYearProps) => {
  const isDataAvailable = data && data.length > 0;

  const renderDate = (dateString: string) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const getPeriodeName = (periodeId: string) => {
    // Debug logging
    console.log("🔍 Debug getPeriodeName:");
    console.log("periodeId:", periodeId);
    console.log("periodeAkademikList:", periodeAkademikList);

    if (!periodeId || periodeId.trim() === "") {
      console.log("❌ No periode ID provided");
      return "Tidak ada periode";
    }

    // Try to find exact match first
    let periode = periodeAkademikList.find((p) => p.id === periodeId);

    if (!periode) {
      // Try string comparison in case of type mismatch
      periode = periodeAkademikList.find(
        (p) => String(p.id) === String(periodeId)
      );
    }

    if (!periode) {
      // Try loose matching (trim whitespace)
      periode = periodeAkademikList.find(
        (p) => String(p.id).trim() === String(periodeId).trim()
      );
    }

    if (periode) {
      console.log("✅ Found periode:", periode);
      return (
        periode.namaPeriode || periode.nama || "Nama periode tidak tersedia"
      );
    }

    console.log("❌ Periode not found for ID:", periodeId);
    console.log(
      "Available IDs:",
      periodeAkademikList.map((p) => p.id)
    );
    return `ID tidak ditemukan: ${periodeId}`;
  };

  const { data: academicPeriods, isLoading: isLoadingAcademicPeriods } =
    getAcademicPeriods();

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full my-4 ">
        <thead>
          <tr>
            {tableHead.length > 0 ? (
              tableHead.map((head) => (
                <th
                  key={head}
                  className="p-4 bg-primary-green text-white border border-gray-600"
                >
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
                <input
                  type="text"
                  name="tahun"
                  value={currentData.tahun}
                  onChange={onInputChange}
                  className="border p-2 w-full"
                />
              </td>
              <td className="p-2 border text-sm border-black/50">
                <input
                  type="text"
                  name="keterangan"
                  value={currentData.keterangan}
                  onChange={onInputChange}
                  className="border p-2 w-full"
                />
              </td>
              <td className="p-2 border text-sm border-black/50">
                <SelectInput
                  options={academicPeriods}
                  label="Periode Akademik"
                  required
                  getOptionLabel={(opt) => opt.namaPeriode}
                  getOptionValue={(opt) => opt.id}
                  value={currentData.siakPeriodeAkademikId ?? ""}
                  onChange={(selected) => {
                    // Set ID periode akademik
                    onInputChange({
                      target: {
                        name: "siakPeriodeAkademikId",
                        value: selected?.id ?? "",
                      },
                    });

                    // Hanya isi tanggal awal jika ada
                    if (selected?.tanggalMulai) {
                      onInputChange({
                        target: {
                          name: "tanggalMulai",
                          value: selected.tanggalMulai,
                        },
                      });
                    }
                  }}
                />
              </td>
              <td className="p-2 border text-sm border-black/50">
                <input
                  type="date"
                  name="tanggalMulai"
                  value={currentData.tanggalMulai}
                  onChange={onInputChange}
                  readOnly
                  className="border p-2 w-full cursor-not-allowed "
                />
              </td>
              <td className="p-2 border text-sm border-black/50">
                <input
                  type="date"
                  name="tanggalSelesai"
                  value={currentData.tanggalSelesai}
                  onChange={onInputChange}
                  className="border p-2 w-full"
                />
              </td>
              <td className="p-2 border text-sm border-black/50">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={onSave}
                    className="bg-primary-green p-2 text-white cursor-pointer rounded disabled:opacity-50"
                    disabled={!isFormValid()}
                  >
                    <Save size={17} />
                  </button>
                  <button
                    onClick={onReset}
                    className="bg-yellow-500 p-2 text-white cursor-pointer rounded"
                  >
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
                      <input
                        type="text"
                        name="tahun"
                        value={currentData.tahun}
                        onChange={onInputChange}
                        className="border p-2 w-full"
                      />
                    </td>
                    <td className="p-2 border text-sm border-black/50">
                      <input
                        type="text"
                        name="keterangan"
                        value={currentData.keterangan}
                        onChange={onInputChange}
                        className="border p-2 w-full"
                      />
                    </td>
                    <td className="p-2 border text-sm border-black/50">
                      <SelectInput
                        label="Periode Akademik"
                        required
                        options={academicPeriods}
                        getOptionLabel={(opt) => opt.namaPeriode}
                        getOptionValue={(opt) => String(opt.id)}
                        value={String(currentData?.periodeAkademik?.id ?? "")}
                        onChange={(selected) => {
                          console.log("SELECTED", selected);

                          // Update ID periode akademik
                          onInputChange({
                            target: {
                              name: "siakPeriodeAkademikId",
                              value: selected?.id ?? "",
                            },
                          });

                          // 🔧 Tambahkan: update currentData.periodeAkademik juga
                          onInputChange({
                            target: {
                              name: "periodeAkademik",
                              value: selected,
                            },
                          });

                          if (selected?.tanggalMulai) {
                            onInputChange({
                              target: {
                                name: "tanggalMulai",
                                value: selected.tanggalMulai,
                              },
                            });
                          }
                        }}
                      />
                    </td>
                    <td className="p-2 border text-sm border-black/50">
                      <input
                        type="date"
                        name="tanggalMulai"
                        value={currentData.tanggalMulai}
                        onChange={onInputChange}
                        readOnly
                        className="border p-2 w-full cursor-not-allowed"
                      />
                    </td>
                    <td className="p-2 border text-sm border-black/50">
                      <input
                        type="date"
                        name="tanggalSelesai"
                        value={currentData.tanggalSelesai}
                        onChange={onInputChange}
                        className="border p-2 w-full"
                      />
                    </td>
                    <td className="p-2 border text-sm border-black/50">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={onSave}
                          className="bg-primary-green p-2 text-white cursor-pointer rounded disabled:opacity-50"
                          disabled={!isFormValid()}
                        >
                          <Save size={17} />
                        </button>
                        <button
                          onClick={onReset}
                          className="bg-yellow-500 p-2 text-white cursor-pointer rounded"
                        >
                          <RefreshCw size={17} />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2 border text-sm border-black/50">
                      {row.tahun}
                    </td>
                    <td className="p-2 border text-sm border-black/50">
                      {row.keterangan}
                    </td>
                    <td className="p-2 border text-sm border-black/50">
                      <span
                        className={
                          row.periodeAkademik.namaPeriode
                            ? ""
                            : "text-red-500 italic"
                        }
                      >
                        {getPeriodeName(row.periodeAkademik.id)}
                      </span>
                    </td>
                    <td className="p-2 border text-sm border-black/50">
                      {renderDate(row.tanggalMulai)}
                    </td>
                    <td className="p-2 border text-sm border-black/50">
                      {renderDate(row.tanggalSelesai)}
                    </td>
                    <td className="p-2 border text-sm border-black/50">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => onEdit && onEdit(row.id)}
                          className="bg-yellow-500 p-2 text-white cursor-pointer rounded"
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          onClick={() => onDelete && onDelete(row.id)}
                          className="bg-red-500 p-2 text-white cursor-pointer rounded"
                        >
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
              <td
                colSpan={tableHead.length || 1}
                className="text-center border-black border p-2"
              >
                {error}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export const TableCourseManagement: React.FC<TableProps> = ({
  data,
  tableHead = [],
  error,
  onEdit,
  onDelete,
  selectedIds,
  onSelect,
  isEditing,
  currentData,
  onSave,
  onReset,
  onInputChange,
  isAdding,
}) => {
  const navigate = useNavigate();
  const isDataAvailable = data && data.length > 0;

  // Cek apakah semua data terpilih
  const isAllSelected =
    data.length > 0 && (selectedIds?.length ?? 0) === data.length;

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-primary-green text-white text-xs font-bold tracking-wider select-none">
            <th rowSpan={2} className="py-3 px-3 text-center w-12 border-r border-white/20">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={() => onSelect?.("-1")}
                className="cursor-pointer rounded border-slate-300 text-primary-green focus:ring-primary-green h-4 w-4"
              />
            </th>
            <th rowSpan={2} className="py-3 px-3 text-center border-r border-white/20">KURIKULUM</th>
            <th rowSpan={2} className="py-3 px-3 text-center border-r border-white/20">KODE MK</th>
            <th rowSpan={2} className="py-3 px-4 text-left border-r border-white/20">NAMA MATA KULIAH</th>
            <th rowSpan={2} className="py-3 px-3 text-center border-r border-white/20">SKS</th>
            <th rowSpan={2} className="py-3 px-3 text-center border-r border-white/20">JENIS MK</th>
            <th rowSpan={2} className="py-3 px-4 text-left border-r border-white/20">PRODI PENGAMPU</th>
            <th colSpan={3} className="py-2.5 px-3 text-center border-r border-white/20 border-b border-white/20">STATUS PENGISIAN</th>
            <th rowSpan={2} className="py-3 px-3 text-center">AKSI</th>
          </tr>
          <tr className="bg-primary-green text-white text-[11px] font-bold tracking-wider select-none">
            <th className="py-2 px-3 text-center border-r border-white/20">RPS</th>
            <th className="py-2 px-3 text-center border-r border-white/20">CPL</th>
            <th className="py-2 px-3 text-center border-r border-white/20">CPMK</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {isDataAvailable ? (
            data.map((row) => {
              const {
                id,
                tahunKurikulum,
                kode,
                nama,
                totalSks,
                jenis,
                programStudi,
              } = row;
              const isChecked = selectedIds?.includes(id) ?? false;

              return (
                <tr key={id} className={`border-b border-slate-200 transition-colors ${isChecked ? "bg-emerald-50/50" : "hover:bg-slate-50/80 bg-white"}`}>
                  <td className="py-3 px-3 text-center border-r border-slate-200">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onSelect?.(id)}
                      className="cursor-pointer rounded border-slate-300 text-primary-green focus:ring-primary-green h-4 w-4"
                    />
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800 border-r border-slate-200">
                    {tahunKurikulum?.tahun || "-"}
                  </td>
                  <td className="py-3 px-3 font-bold font-mono text-center text-slate-800 border-r border-slate-200">
                    {kode}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 border-r border-slate-200">
                    {nama}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800 border-r border-slate-200">
                    {totalSks}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-700 border-r border-slate-200">
                    {jenis || "Kuliah"}
                  </td>
                  <td className="py-3 px-4 text-slate-700 border-r border-slate-200">
                    {programStudi?.nama || "-"}
                  </td>
                  <td className="py-2.5 px-3 text-center border-r border-slate-200">
                    <span
                      onClick={() => navigate(`${AdminAcademicRoute.courseManagement.editRps}/${id}`)}
                      className="inline-block border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded px-2.5 py-1 text-[11px] font-medium shadow-2xs cursor-pointer transition-colors"
                      title="Klik untuk kelola RPS"
                    >
                      {row.rpsStatus || "Belum Terisi"}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center border-r border-slate-200">
                    <span
                      onClick={() => navigate(`${AdminAcademicRoute.academic.cplCpmkCourse}/${id}`)}
                      className="inline-block border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded px-2.5 py-1 text-[11px] font-medium shadow-2xs cursor-pointer transition-colors"
                      title="Klik untuk kelola CPL"
                    >
                      {row.cplStatus || "Belum Terisi"}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center border-r border-slate-200">
                    <span
                      onClick={() => navigate(`${AdminAcademicRoute.academic.cplCpmkCourse}/${id}`)}
                      className="inline-block border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded px-2.5 py-1 text-[11px] font-medium shadow-2xs cursor-pointer transition-colors"
                      title="Klik untuk kelola CPMK"
                    >
                      {row.cpmkStatus || "Belum Terisi"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <div className="flex justify-center items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => navigate(`${AdminAcademicRoute.academic.cplCpmkCourse}/${id}`)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded border border-slate-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
                        title="Tautan / CPL CPMK"
                      >
                        <Link2 size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `${AdminAcademicRoute.courseManagement.detailCourse}/${id}`
                          )
                        }
                        className="p-1.5 bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-600 rounded border border-slate-200 shadow-2xs transition-colors active:scale-95 cursor-pointer"
                        title="Detail"
                      >
                        <Eye size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete?.(id)}
                        className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded shadow-2xs transition-all active:scale-95 cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={11}
                className="text-center py-8 text-slate-400"
              >
                {error || "Data tidak ditemukan."}
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
          {data && data.length > 0 ? (
            data.map((row, index) => {
              return (
                <tr key={index} className="text-center">
                  <td className="p-2 border text-sm border-black/50 text-left align-top">
                    {row.kodeCpl}
                  </td>
                  <td className="p-2 border text-sm border-black/50 text-left">
                    {row.deskripsiCpl}
                  </td>
                  <td className="p-2 border text-sm border-black/50 align-top text-left ">
                    {row.kategori}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={tableHead.length}
                className="text-center border-black border p-2"
              >
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
          {data && data.length > 0 ? (
            data.map((row, index) => {
              return (
                <tr key={index} className="text-center">
                  <td className="p-2 border text-sm border-black/50">
                    {row.kodeCpmk}
                  </td>
                  <td className="p-2 border text-sm border-black/50 text-left">
                    {row.deskripsiCpmk}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={tableHead.length}
                className="text-center border-black border p-2"
              >
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
                <td className="p-2 border text-sm border-black/50">
                  {row.dosenPenyusun}
                </td>
                <td className="p-2 border text-sm border-black/50">
                  {row.periodeAkademik}
                </td>
                <td className="p-2 border text-sm border-black/50">
                  {row.kelas}
                </td>
                <td
                  className="p-2 border text-sm border-black/50 text-center align-middle"
                >
                  <div
                    onClick={() =>
                      navigate(AdminAcademicRoute.rpsManagement.rpsManagement)
                    }
                    className="bg-primary-blueSoft cursor-pointer rounded-sm mx-auto flex items-center justify-center w-8 h-8"
                  >
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
    navigate(
      `${AdminAcademicRoute.obeManagement.graduateProfile}/${obeItem.id}`,
      {
        state: {
          obeData: obeItem,
        },
      }
    );
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
                <td className="p-2 border border-black/50">{item.kodeProdi}</td>
                <td className="p-2 border border-black/50">
                  {item.programStudi}
                </td>
                {/* <td className="p-2 border border-black/50">
                  {item.ketuaProdi}
                </td> */}
                <td className="p-2 border border-black/50">
                  {item.pl ? "✅" : "❌"}
                </td>
                <td className="p-2 border border-black/50">
                  {item.cpl ? "✅" : "❌"}
                </td>
                <td className="p-2 border border-black/50">
                  {item.plToCpl ? "✅" : "❌"}
                </td>
                <td className="p-2 border border-black/50">
                  {item.cpmk ? "✅" : "❌"}
                </td>
                <td className="p-2 border border-black/50 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      className="bg-primary-blueSoft text-white p-2 rounded"
                      onClick={() =>
                        navigate(
                          `${AdminAcademicRoute.obeManagement.detailOBE}/${item.id}`
                        )
                      }
                    >
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

export const TableGraduateProfile = ({
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
}: TableProps) => {
  const isDataAvailable = data && data.length > 0;

  return (
    <div className="w-full overflow-x-auto">
    <table className="w-full my-4">
      <thead>
        <tr>
          {tableHead.length > 0 ? (
            tableHead.map((head) => (
              <th
                key={head}
                className="p-4 bg-primary-green text-white border border-gray-600"
              >
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
              <input
                type="text"
                name="kode"
                value={currentData.kode}
                onChange={onInputChange}
                className="border p-2 w-full"
                placeholder="Kode PL"
              />
            </td>
            <td className="p-2 border text-sm border-black/50">
              <input
                type="text"
                name="profil"
                value={currentData.profil}
                onChange={onInputChange}
                className="border p-2 w-full"
                placeholder="Profil Lulusan"
              />
            </td>
            <td className="p-2 border text-sm border-black/50">
              <input
                type="text"
                name="profesi"
                value={currentData.profesi}
                onChange={onInputChange}
                className="border p-2 w-full"
                placeholder="Profesi"
              />
            </td>
            <td className="p-2 border text-sm border-black/50">
              <input
                type="text"
                name="deskripsi"
                value={currentData.deskripsi}
                onChange={onInputChange}
                className="border p-2 w-full"
                placeholder="Deskripsi"
              />
            </td>
            <td className="p-2 border text-sm border-black/50">
              <input
                type="text"
                name="deskripsiEn"
                value={currentData.deskripsiEn || ""}
                onChange={onInputChange}
                className="border p-2 w-full"
                placeholder="Deskripsi (EN) - opsional"
              />
            </td>
            <td className="p-2 border text-sm border-black/50">
              <div className="flex gap-2 justify-center">
                <button
                  onClick={onSave}
                  className="bg-primary-green p-2 text-white cursor-pointer rounded"
                >
                  <Save size={18} />
                </button>
                <button
                  onClick={onReset}
                  className="bg-yellow-500 p-2 text-white cursor-pointer rounded"
                >
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
                    <input
                      type="text"
                      name="kode"
                      value={currentData.kode}
                      onChange={onInputChange}
                      className="border p-2 w-full"
                    />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input
                      type="text"
                      name="profil"
                      value={currentData.profil}
                      onChange={onInputChange}
                      className="border p-2 w-full"
                    />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input
                      type="text"
                      name="profesi"
                      value={currentData.profesi}
                      onChange={onInputChange}
                      className="border p-2 w-full"
                    />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input
                      type="text"
                      name="deskripsi"
                      value={currentData.deskripsi}
                      onChange={onInputChange}
                      className="border p-2 w-full"
                    />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <input
                      type="text"
                      name="deskripsiEn"
                      value={currentData.deskripsiEn || ""}
                      onChange={onInputChange}
                      className="border p-2 w-full"
                    />
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={onSave}
                        className="bg-primary-green p-2 text-white cursor-pointer rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={onReset}
                        className="bg-yellow-500 p-2 text-white cursor-pointer rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2 border text-sm border-black/50">
                    {row.kode}
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    {row.profil}
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    {row.profesi || "-"}
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    {row.deskripsi}
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    {row.deskripsiEn || "-"}
                  </td>
                  <td className="p-2 border text-sm border-black/50">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => onEdit && onEdit(row.id)}
                        className="bg-yellow-500 p-2 text-white cursor-pointer rounded"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(row.id)}
                        className="bg-red-500 p-2 text-white cursor-pointer rounded"
                      >
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
            <td
              colSpan={tableHead.length || 1}
              className="text-center border-black border p-2"
            >
              {error}
            </td>
          </tr>
        )}
      </tbody>
    </table>
    </div>
  );
};

export const TableObeCPL: React.FC<TableProps> = ({
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
}) => {
  const isDataAvailable = data && data.length > 0;

  return (
    <div className="w-full overflow-x-auto">
    <table className="w-full border border-gray-300">
      <thead className="bg-primary-green">
        <tr>
          {tableHead.length > 0 ? (
            tableHead.map((head) => (
              <th
                key={head}
                className="p-2 text-white border border-gray-600 font-medium"
              >
                {head}
              </th>
            ))
          ) : (
            <th className="p-2 text-white border border-gray-600 font-medium">
              Data tidak tersedia
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {isAdding && currentData && (
          <tr>
            <td className="p-2 border">
              <input
                type="text"
                name="kode"
                value={currentData.kode || ""}
                onChange={onInputChange}
                className="w-full p-1 border rounded"
                placeholder="Kode CPL"
              />
            </td>
            <td className="p-2 border">
              <input
                type="text"
                name="deskripsi"
                value={currentData.deskripsi || ""}
                onChange={onInputChange}
                className="w-full p-1 border rounded"
                placeholder="Deskripsi CPL"
              />
            </td>
            <td className="p-2 border">
              <input
                type="text"
                name="kategori"
                value={currentData.kategori || ""}
                onChange={onInputChange}
                className="w-full p-1 border rounded"
                placeholder="Kategori"
              />
            </td>
            <td className="p-2 border">
              <input
                type="number"
                name="targetCpl"
                min={0}
                max={100}
                value={currentData.targetCpl ?? ""}
                onChange={onInputChange}
                className="w-20 p-1 border rounded"
                placeholder="0-100"
              />
            </td>
            <td className="p-2 border">
              <input
                type="text"
                name="deskripsiEn"
                value={currentData.deskripsiEn || ""}
                onChange={onInputChange}
                className="w-full p-1 border rounded"
                placeholder="Deskripsi (EN) - opsional"
              />
            </td>
            <td className="p-2 border flex justify-center gap-2">
              <button
                onClick={onSave}
                className="bg-primary-green text-white px-2 py-1 rounded"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={onReset}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
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
                    <input
                      type="text"
                      name="kode"
                      value={currentData.kode || ""}
                      onChange={onInputChange}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="text"
                      name="deskripsi"
                      value={currentData.deskripsi || ""}
                      onChange={onInputChange}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="text"
                      name="kategori"
                      value={currentData.kategori || ""}
                      onChange={onInputChange}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      name="targetCpl"
                      min={0}
                      max={100}
                      value={currentData.targetCpl ?? ""}
                      onChange={onInputChange}
                      className="w-20 p-1 border rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="text"
                      name="deskripsiEn"
                      value={currentData.deskripsiEn || ""}
                      onChange={onInputChange}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="p-2 border ">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={onSave}
                        className="bg-primary-green text-white px-2 py-1 rounded"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={onReset}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        <CornerUpLeft size={18} />
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2 border">{row.kode}</td>
                  <td className="p-2 border text-left">
                    {row.deskripsi}
                  </td>
                  <td className="p-2 border">{row.kategori}</td>
                  <td className="p-2 border">{row.targetCpl ?? "-"}</td>
                  <td className="p-2 border text-left">{row.deskripsiEn || "-"}</td>
                  <td className="p-2 border text-sm ">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => onEdit && onEdit(row.id)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(row.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
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
            <td
              colSpan={tableHead.length || 1}
              className="text-center border-black border p-2"
            >
              {error}
            </td>
          </tr>
        )}
      </tbody>
    </table>
    </div>
  );
};

export const TableObeCpmk: React.FC<TableProps> = ({
  data,
  isAdding,
  newCpmk,
  onInputChange,
  onSaveNewCpmk,
  onCancelAdd,
  onEdit,
  onDelete,
  obeId,
}) => {
  const navigate = useNavigate();

  const handleViewDetail = (mataKuliahId: string) => {
    navigate(`${AdminAcademicRoute.obeManagement.cpmkMataKuliah}/${obeId}/${mataKuliahId}`);
  };

  return (
    <div className="w-full overflow-x-auto">
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
              <input
                type="text"
                name="kodeMk"
                value={newCpmk.kodeMk}
                onChange={onInputChange}
                className="w-full p-1 border rounded"
                placeholder="Kode MK"
              />
            </td>
            <td className="p-2 border">
              <input
                type="text"
                name="mataKuliah"
                value={newCpmk.mataKuliah}
                onChange={onInputChange}
                className="w-full p-1 border rounded"
                placeholder="Mata Kuliah"
              />
            </td>
            <td className="p-2 border">
              <input
                type="text"
                name="statusCpmk"
                value={newCpmk.statusCpmk}
                onChange={onInputChange}
                className="w-full p-1 border rounded"
                placeholder="Status CPMK"
              />
            </td>
            <td className="p-2 border flex gap-2 justify-center">
              <button
                onClick={onSaveNewCpmk}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Save
              </button>
              <button
                onClick={onCancelAdd}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
            </td>
          </tr>
        )}

        {data.length > 0 ? (
          data.map((cpmk) => (
            <tr key={cpmk.id} className="text-center">
              <td className="p-2 border">{cpmk.kodeMataKuliah}</td>
              <td className="p-2 border">{cpmk.namaMataKuliah}</td>
              <td className="p-2 border">{cpmk.hasCpmk}</td>
              <td className="p-2 border flex justify-center gap-2">
                <button
                  onClick={() => handleViewDetail?.(cpmk.id)}
                  className="bg-primary-blueSoft text-white px-2 py-1 rounded w-8 h-8"
                >
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
    </div>
  );
};

export const TableObeCpmkMatkul: React.FC<TableProps> = ({
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
}) => {
  const isDataAvailable = data && data.length > 0;

  const renderPemetaanCheckboxes = (selectedValues: string[] = []) => {
    const options = ["CPL01", "CPL02", "CPL03"];
    return (
      <div className="flex flex-col items-center">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2">
            <input
              type="checkbox"
              name="pemetaan"
              value={option}
              checked={selectedValues.includes(option)}
              onChange={onInputChange}
            />
            {option}
          </label>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
    <table className="w-full border border-gray-300">
      <thead className="bg-primary-green">
        <tr>
          {tableHead.length > 0 ? (
            tableHead.map((head) => (
              <th
                key={head}
                className="p-2 text-white border border-gray-600 font-medium"
              >
                {head}
              </th>
            ))
          ) : (
            <th className="p-2 text-white border border-gray-600 font-medium">
              Data tidak tersedia
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {isAdding && currentData && (
          <tr>
            <td className="p-2 border">
              <input
                type="text"
                name="kodeCpmk"
                value={currentData.kodeCpmk}
                onChange={onInputChange}
                className="w-full p-1 border rounded"
                placeholder="Kode CPMK"
              />
            </td>
            <td className="p-2 border">
              <input
                type="text"
                name="deskripsi"
                value={currentData.deskripsi}
                onChange={onInputChange}
                className="w-full p-1 border rounded"
                placeholder="Deskripsi CPMK"
              />
            </td>
            <td className="p-2 border">
              {renderPemetaanCheckboxes(
                currentData.pemetaan ? currentData.pemetaan.split(",") : []
              )}
            </td>
            <td className="p-2 border">
              <div className="flex gap-2 justify-center">
                <button
                  onClick={onSave}
                  className="bg-primary-green text-white px-2 py-1 rounded"
                >
                  <Save size={18} />
                </button>
                <button
                  onClick={onReset}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
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
                    <input
                      type="text"
                      name="kodeCpmk"
                      value={currentData.kodeCpmk}
                      onChange={onInputChange}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="text"
                      name="deskripsi"
                      value={currentData.deskripsi}
                      onChange={onInputChange}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    {renderPemetaanCheckboxes(
                      currentData.pemetaan
                        ? currentData.pemetaan.split(",")
                        : []
                    )}
                  </td>
                  <td className="p-2 border">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={onSave}
                        className="bg-primary-green text-white px-2 py-1 rounded"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={onReset}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        <CornerUpLeft size={18} />
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2 border">{row.kodeCpmk}</td>
                  <td className="p-2 border">{row.deskripsi}</td>
                  <td className="p-2 border">
                    {renderPemetaanCheckboxes(
                      row.pemetaan ? row.pemetaan.split(",") : []
                    )}
                  </td>
                  <td className="p-2 border text-sm">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => onEdit && onEdit(row.id)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(row.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
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
            <td
              colSpan={tableHead.length || 1}
              className="text-center border-black border p-2"
            >
              {error}
            </td>
          </tr>
        )}
      </tbody>
    </table>
    </div>
  );
};

export const TableCurriculumProdi: React.FC<TableProps> = ({
  data,
  onEdit,
  onDelete,
}) => {
  const totalSKS = data.reduce((acc, item) => acc + (parseInt(item.sks) || 0), 0);
  const totalWajib = data
    .filter((item) => item.status === "Wajib")
    .reduce((acc, item) => acc + (parseInt(item.sks) || 0), 0);
  const totalPilihan = data
    .filter((item) => item.status === "Pilihan")
    .reduce((acc, item) => acc + (parseInt(item.sks) || 0), 0);

  const semesterGroups = React.useMemo(() => {
    const groups: { semester: string | number; items: typeof data }[] = [];
    data.forEach((item) => {
      const semesterKey = item.semester ?? "-";
      let group = groups.find((g) => g.semester === semesterKey);
      if (!group) {
        group = { semester: semesterKey, items: [] };
        groups.push(group);
      }
      group.items.push(item);
    });
    return groups;
  }, [data]);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border border-gray-600 border-collapse">
        {semesterGroups.length > 0 ? (
          semesterGroups.map((group) => (
            <React.Fragment key={group.semester}>
              <thead className="bg-primary-green">
                <tr>
                  <th className="p-2 text-white border" colSpan={9}>
                    Semester {group.semester}
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
                {group.items.map((item) => (
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
                      <button
                        onClick={() => onEdit?.(item.id)}
                        className="bg-primary-yellow text-white px-2 py-1 rounded w-8 h-8"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEdit?.(item.id)}
                        className="bg-primary-blueSoft text-white px-2 py-1 rounded w-8 h-8"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete?.(item.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded w-8 h-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </React.Fragment>
          ))
        ) : (
          <tbody>
            <tr>
              <td colSpan={9} className="p-2 text-center">
                Data tidak ditemukan.
              </td>
            </tr>
          </tbody>
        )}
        <tfoot>
          {/* Row for Total SKS and Summary */}
          <tr className="bg-gray-100 font-semibold">
            <td className="p-2 border text-center" colSpan={3}>
              Total SKS
            </td>
            <td className="p-2 border text-center">{totalSKS}</td>
            <td className="p-2 border text-center">
              Wajib: {totalWajib} | Pilihan: {totalPilihan}
            </td>
            <td className="p-2 border" colSpan={4}></td>
          </tr>
        </tfoot>
      </table>
    </div>
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

export const TableRpsManagement: React.FC<TableProps> = ({
  data = [],
  onEdit,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RpsData | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  // const { data: classData, isLoading: isClassLoading, error: classError } = getKelas();
  const { data: classData, isLoading: isClassLoading } = useQuery<KelasData[]>({
    queryKey: ["kelas"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error(
          "Token tidak ditemukan. Silakan login terlebih dahulu."
        );

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
    setSelectedClasses((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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
      return value !== null && value !== undefined && value !== ""
        ? String(value)
        : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // Improved SKS calculation
  const getSKS = (item: any) => {
    try {
      // First try to get from mataKuliah object
      const sksTatapMuka = Number(
        getSafeValue(item, "mataKuliah.sksTatapMuka", "0")
      );
      const sksPraktikum = Number(
        getSafeValue(item, "mataKuliah.sksPraktikum", "0")
      );
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
    return (
      getSafeValue(item, "mataKuliah.kodeMataKuliah") ||
      getSafeValue(item, "kodeMataKuliah") ||
      getSafeValue(item, "mataKuliah.kode")
    );
  };

  // Function to get course name safely
  const getCourseName = (item: any) => {
    return (
      getSafeValue(item, "mataKuliah.namaMataKuliah") ||
      getSafeValue(item, "namaMataKuliah") ||
      getSafeValue(item, "mataKuliah.nama")
    );
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
    return (
      getSafeValue(item, "mataKuliah.semester") ||
      getSafeValue(item, "semester")
    );
  };

  const getClassName = (item: any) => {
    if (Array.isArray(item.kelas) && item.kelas.length > 0) {
      return item.kelas.map((k) => k.nama || k.namaKelas).join(", ");
    }

    return getSafeValue(item, "namaKelas", "-");
  };

  console.log("data", data);

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
                  <td className="p-2 border">
                    {item.mataKuliah.kodeMataKuliah}
                  </td>
                  <td className="p-2 border">
                    {item.mataKuliah.namaMataKuliah}
                  </td>
                  <td className="p-2 border">
                    {item.dosenPenyusun.map((lecturer, lecturerId) => (
                      <div key={lecturerId}>{lecturer.nama}</div>
                    ))}
                  </td>
                  <td className="p-2 border">{item.mataKuliah.semester}</td>
                  <td className="p-2 border">{item.mataKuliah.sks}</td>
                  <td className="p-2 border">
                    {item.kelas.map((classes, classesId) => (
                      <div key={classesId}>{classes.nama}</div>
                    ))}
                  </td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => handlePaperclipClick(item)}
                      className="bg-purple-500 text-white px-2 py-1 rounded"
                      title="Edit"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        navigate(
                          `${AdminAcademicRoute.rpsManagement.editRps}/${item.id}`
                        )
                      }
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete?.(item.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      title="Hapus"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
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
          <div className="bg-white py-4 px-6 sm:px-16 rounded-lg shadow-lg w-full max-w-[400px] mx-4 border-primary-green border-t-3">
            <h3 className="text-center text-lg mb-6 font-medium">
              Memetakan RPS ke Kelas
            </h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-2 mb-4">
              <span>Mata Kuliah:</span>
              <span className="text-gray-700">
                {getClassName(selectedItem)}
              </span>

              <span className="font-medium">SKS:</span>
              <span className="text-gray-700">{getSKS(selectedItem)}</span>

              <span className="font-medium">Semester:</span>
              <span className="text-gray-700">{getSemester(selectedItem)}</span>

              <div className="col-span-2">
                <label className="font-medium text-gray-600 mb-2 block">
                  Pilih Kelas:
                </label>
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
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                            isSelected
                              ? "bg-primary-green text-white shadow-md"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {kelas.nama}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="bg-secondary-gray px-4 py-2 rounded-lg text-primary-white flex items-center gap-2 cursor-pointer"
                onClick={handleCloseModal}
              >
                <CornerUpLeft className="w-4 h-4" />
                <span>Batal</span>
              </button>
              <button
                className="bg-primary-green text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:bg-primary-green/50 cursor-pointer"
                onClick={handleSaveClassMapping}
                disabled={
                  mapKelasMutation.isPending || selectedClasses.length === 0
                }
              >
                {mapKelasMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>
                  {mapKelasMutation.isPending ? "Menyimpan..." : "Simpan"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
