import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import {
  InputFilter,
  SelectInput,
} from "../../../components/admin-academic/student-data/Input";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { Eye, Link2, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import BorderedGreenContainer from "../../../components/BorderedGreenContainer";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { getCollegeClass } from "../../../hooks/useKelasKuliah";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  getAcademicPeriodeDropdown,
  getProgramStudi,
  getYearCuriculum,
} from "../../../hooks/useGeneral";

interface Classes {
  id: string;
  year: string;
  code: string;
  subject: string;
  program: string;
  class: string;
  lecturer: string;
  weeklySchedule: string;
  kap: number;
  pst: number;
  status: string;
}

interface CollegeClassTableProps {
  data: Classes[];
}

const CollegeClass = () => {
  const [filter, setFilter] = useState({
    periodeAkademik: "",
    programStudi: "",
    tahunKuriKulum: "",
    sistemKuliah: "",
  });
  const systemOptions = [
    { value: "Reguler", label: "Reguler" },
    { value: "Karyawan", label: "Karyawan" },
  ];

  const { data: periods, isLoading: isLoadingPeriods } = getAcademicPeriodeDropdown();
  const { data: programs, isLoading: isLoadingPrograms } = getProgramStudi();
  const { data: curiculums, isLoading: isLoadingCuriculums } = getYearCuriculum();

  const location = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangeFilter = (fieldName, selectedValue) => {
    setFilter((prev) => ({
      ...prev,
      [fieldName]: selectedValue,
    }));
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const refresh = () => alert("refresh");
  const searchSubmit = () => alert("Search");
  const Create = () => location(AdminAcademicRoute.collegeClass.createClass);
  const Delete = () => alert("Delete");

  const { data: response, isLoading, error } = getCollegeClass(
    filter,
    currentPage,
    rowsPerPage
  );
  const data = response?.data;
  const pagination = response?.pagination;

  //   if (isLoading) {
  //     return <LoadingSpinner title="Kelas Kuliah" />;
  //   }

  if (error) {
    return <div>Terjadi Kesalahan Dalam Mengambil Data</div>;
  }

  return (
    <MainLayout isGreeting={false} titlePage="Kelas Kuliah">
      <div className="space-y-4">
        {/* FILTER SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-white border-t-2 border-primary-yellow p-3 rounded shadow-sm">
          <SelectInput
            getOptionLabel={(opt) => opt.nama}
            getOptionValue={(opt) => opt.id}
            onChange={(val) =>
              handleChangeFilter("periodeAkademik", val?.id ?? "")
            }
            value={filter.periodeAkademik}
            options={periods}
            label="Periode Akademik"
          />
          <SelectInput
            options={programs}
            getOptionLabel={(opt) => opt.nama}
            getOptionValue={(opt) => opt.id}
            onChange={(val) => handleChangeFilter("programStudi", val.id)}
            value={filter.programStudi}
            label="Program Studi"
          />
          <SelectInput
              options={systemOptions}
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
              label="Sistem Kuliah"
              value={filter.sistemKuliah}
              onChange={(val) => handleChangeFilter("sistemKuliah", val?.value ?? "")}
          />
          <SelectInput
            options={curiculums}
            getOptionLabel={(opt) => opt.tahun}
            getOptionValue={(opt) => opt.id}
            onChange={(val) => handleChangeFilter("tahunKuriKulum", val.id)}
            value={filter.tahunKuriKulum}
            label="Tahun Kurikulum"
          />
        </div>

        {/* ACTIONS & TABLE */}
        <BorderedGreenContainer>
          <div className="flex flex-col lg:flex-row justify-between gap-2 items-start lg:items-center">
            {/* SEARCH + REFRESH */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                className="border-2 p-2 rounded text-sm w-full sm:w-[240px]"
                placeholder="Cari Kelas Kuliah"
              />
              <div className="flex gap-1">
                <ButtonClick
                  icon={<Search size={16} strokeWidth={3} />}
                  color="bg-primary-yellow"
                  onClick={searchSubmit}
                />
                <ButtonClick
                  icon={<RefreshCw size={16} strokeWidth={3} />}
                  color="bg-blue-900"
                  onClick={refresh}
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-2">
              <ButtonClick
                icon={<Plus size={15} strokeWidth={3} />}
                color="bg-primary-green"
                text="Tambah"
                onClick={Create}
              />
              <ButtonClick
                icon={<Trash2 size={15} />}
                color="bg-red-400"
                text="Hapus"
                onClick={Delete}
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="w-full overflow-x-auto mt-4">
            <CollegeClassTable data={data} />
          </div>

          {/* PAGINATION */}
          <div className="mt-4">
            <Pagination
              currentPage={pagination?.currentPage ?? currentPage}
              totalPages={pagination?.totalPage ?? 1}
              onPageChange={setCurrentPage}
              rowsPerPage={pagination?.perPage ?? rowsPerPage}
              totalRows={pagination?.totalItems ?? 0}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </div>
        </BorderedGreenContainer>
      </div>
    </MainLayout>
  );
};

const CollegeClassTable = ({ data }) => {
  const navigate = useNavigate();

  console.log("DATA", data);

  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const allChecked =
      data?.length > 0 && data.every((item) => selectedItems[item.id]);
    setSelectAll(allChecked);
  }, [selectedItems, data]);

  const handleSelectAll = () => {
    const newChecked = !selectAll;
    const updated: { [key: string]: boolean } = {};
    data.forEach((item) => {
      updated[item.id] = newChecked;
    });
    setSelectedItems(updated);
  };

  const handleSelectOne = (id: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  function Link() {
    alert("link");
  }

  function Detail(id: string) {
    navigate(`${AdminAcademicRoute.collegeClass.detailClass}/${id}`);
  }

  function Remove() {
    alert("remove");
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-[1000px] w-full border-collapse text-left">
        <thead>
          <tr className="bg-primary-green text-white text-xs font-bold tracking-wider select-none">
            <th className="py-3 px-3 text-center w-12 border-r border-white/20">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="rounded border-slate-300 text-primary-green focus:ring-primary-green cursor-pointer h-4 w-4"
              />
            </th>
            <th className="py-3 px-3 border-r border-white/20 text-center whitespace-nowrap">
              THN. KUR.
            </th>
            <th className="py-3 px-3 border-r border-white/20 text-center whitespace-nowrap">
              KODE
            </th>
            <th className="py-3 px-4 border-r border-white/20 text-left whitespace-nowrap">
              MATA KULIAH
            </th>
            <th className="py-3 px-4 border-r border-white/20 text-left whitespace-nowrap">
              PRODI PENGAMPU
            </th>
            <th className="py-3 px-3 border-r border-white/20 text-center whitespace-nowrap">
              NAMA KELAS
            </th>
            <th className="py-3 px-3 border-r border-white/20 text-center whitespace-nowrap">
              PENGAJAR
            </th>
            <th className="py-3 px-3 border-r border-white/20 text-center whitespace-nowrap">
              JADWAL MINGGUAN
            </th>
            <th className="py-3 px-2 border-r border-white/20 text-center whitespace-nowrap">
              KAP
            </th>
            <th className="py-3 px-2 border-r border-white/20 text-center whitespace-nowrap">
              PST.
            </th>
            <th className="py-3 px-3 border-r border-white/20 text-center whitespace-nowrap">
              STATUS PENILAIAN
            </th>
            <th className="py-3 px-3 text-center whitespace-nowrap">
              AKSI
            </th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {data?.length > 0 ? (
            data?.map((item) => (
              <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50/80 bg-white transition-colors">
                <td className="py-3 px-3 text-center border-r border-slate-200">
                  <input
                    type="checkbox"
                    checked={!!selectedItems[item.id]}
                    onChange={() => handleSelectOne(item.id)}
                    className="rounded border-slate-300 text-primary-green focus:ring-primary-green cursor-pointer h-4 w-4"
                  />
                </td>
                <td className="py-3 px-3 border-r border-slate-200 font-bold text-slate-800 text-center whitespace-nowrap">
                  {item.periodeAkademik?.nama || "-"}
                </td>
                <td className="py-3 px-3 border-r border-slate-200 font-bold font-mono text-center text-slate-800 whitespace-nowrap">
                  {item.mataKuliah?.kode || "-"}
                </td>
                <td className="py-3 px-4 border-r border-slate-200 font-semibold text-slate-800 text-left">
                  {item.mataKuliah?.nama || "-"}
                </td>
                <td className="py-3 px-4 border-r border-slate-200 text-slate-700 text-left">
                  {`${item.mataKuliah?.programStudi?.jenjang?.jenjang || ""} - ${item.mataKuliah?.programStudi?.nama || "-"}`}
                </td>
                <td className="py-3 px-3 border-r border-slate-200 font-semibold text-center whitespace-nowrap">
                  {item.nama}
                </td>
                <td className="py-3 px-3 border-r border-slate-200 text-slate-700 text-center">
                  {item.jadwalKuliah?.length > 0
                    ? [
                        ...new Set(
                          item.jadwalKuliah
                            .map((jadwal: any) => jadwal.dosen?.nama)
                            .filter(Boolean)
                        ),
                      ].map((nama, i) => (
                        <span key={i} className="block text-slate-800 font-medium">
                          {String(nama)}
                        </span>
                      ))
                    : "-"}
                </td>
                <td className="py-3 px-3 border-r border-slate-200 text-slate-700 text-center">
                  {item.jadwalKuliah?.length > 0
                    ? item.jadwalKuliah.map((jadwal: any, i: number) => (
                        <span key={i} className="block">
                          {jadwal.hari}, {jadwal.jamMulai?.slice(0, 5)}-{jadwal.jamSelesai?.slice(0, 5)}
                        </span>
                      ))
                    : "-"}
                </td>
                <td className="py-3 px-2 border-r border-slate-200 font-bold text-slate-800 text-center whitespace-nowrap">
                  {item.kapasitas}
                </td>
                <td className="py-3 px-2 border-r border-slate-200 font-bold text-slate-800 text-center whitespace-nowrap">
                  {item.peserta}
                </td>
                <td className="py-3 px-3 border-r border-slate-200 text-center">
                  <span className="inline-block border border-slate-200 bg-white text-slate-600 rounded px-2.5 py-1 text-[11px] font-medium shadow-2xs">
                    {item.statusPenilaian || "Belum Terisi"}
                  </span>
                </td>
                <td className="py-3 px-3 text-center">
                  <div className="flex justify-center items-center gap-1.5">
                    <button
                      type="button"
                      onClick={Link}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded border border-slate-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
                      title="Tautan Kelas"
                    >
                      <Link2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => Detail(item.id)}
                      className="p-1.5 bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-600 rounded border border-slate-200 shadow-2xs transition-colors active:scale-95 cursor-pointer"
                      title="Detail Kelas"
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={Remove}
                      className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded shadow-2xs transition-all active:scale-95 cursor-pointer"
                      title="Hapus Kelas"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={12} className="text-center py-8 text-slate-400">
                Data Tidak ada
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CollegeClass;
