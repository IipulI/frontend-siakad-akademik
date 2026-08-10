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

  const handleChangeFilter = (fieldName, selectedValue) => {
    setFilter((prev) => ({
      ...prev,
      [fieldName]: selectedValue,
    }));
  };

  console.log("filter", filter);

  const location = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const refresh = () => alert("refresh");
  const searchSubmit = () => alert("Search");
  const Create = () => location(AdminAcademicRoute.collegeClass.createClass);
  const Delete = () => alert("Delete");

  const { data, isLoading, error } = getCollegeClass(filter);

  //   if (isLoading) {
  //     return <LoadingSpinner title="Kelas Kuliah" />;
  //   }

  if (error) {
    return <div>Terjadi Kesalahan Dalam Mengambil Data</div>;
  }

  console.log("programs", programs);
  console.log("curiculums", curiculums);

  return (
    <MainLayout isGreeting={false} titlePage="Kelas Kuliah">
      <div className="space-y-4">
        {/* FILTER SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-white border-t-2 border-primary-yellow p-3 rounded shadow-sm">
          <SelectInput
            getOptionLabel={(opt) => opt.nama}
            getOptionValue={(opt) => opt.kode}
            onChange={(val) =>
              handleChangeFilter("periodeAkademik", val.namaPeriode)
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
              currentPage={currentPage}
              totalPages={1000}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              totalRows={65}
              onRowsPerPageChange={setRowsPerPage}
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
    <div className="w-full overflow-x-auto">
      <table className="min-w-[1000px] w-full border-collapse">
        <thead>
          <tr className="bg-primary-green text-white text-sm">
            <th className="py-2 px-4 border font-semibold border-gray-300">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Thn. Kur.
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Kode
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Mata Kuliah
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Prodi Pengampu
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Nama Kelas
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Pengajar
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Jadwal Mingguan
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Kap
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Pst.
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Status Penilaian
            </th>
            <th className="p-2 border font-semibold border-gray-300 whitespace-nowrap">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data?.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 text-sm">
                <td className="py-2 px-4 text-center border border-gray-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={!!selectedItems[student.id]}
                    onChange={() => handleSelectOne(student.id)}
                  />
                </td>
                <td className="p-2 border border-gray-300 font-medium text-center whitespace-nowrap">
                  {student.periodeAkademik.nama}
                </td>
                <td className="p-2 border border-gray-300 font-medium text-center whitespace-nowrap">
                  {student.mataKuliah.kode}
                </td>
                <td className="p-2 border border-gray-300 font-medium text-left break-words">
                  {student.mataKuliah.nama}
                </td>
                <td className="p-2 border border-gray-300 font-medium text-left break-words">
                  {`${student.mataKuliah.programStudi.jenjang.jenjang} - ${student.mataKuliah.programStudi.nama}`}
                </td>
                <td className="p-2 border border-gray-300 font-medium text-center whitespace-nowrap">
                  {student.nama}
                </td>
                <td className="p-2 border border-gray-300 font-medium text-center break-words">
                  {/*{student.dosen.map((dosen, i) => (*/}
                  {/*  <span key={i} className="block">*/}
                  {/*    {dosen}*/}
                  {/*  </span>*/}
                  {/*))}*/}
                </td>
                <td className="p-2 border border-gray-300 font-medium text-center break-words">
                  {/*{student.jadwalMingguan.map((jadwal, i) => (*/}
                  {/*  <span key={i} className="block">*/}
                  {/*    {jadwal}*/}
                  {/*  </span>*/}
                  {/*))}*/}
                </td>
                <td className="p-2 border border-gray-300 font-medium text-center whitespace-nowrap">
                  {student.kapasitas}
                </td>
                <td className="p-2 border border-gray-300 font-medium text-center whitespace-nowrap">
                  {student.peserta}
                </td>
                <td className="p-2 border border-gray-300 font-medium text-center break-words">
                  {student.statusPenilaian}
                </td>
                <td className="p-2 border border-gray-300 font-medium">
                  <div className="flex justify-center flex-wrap gap-1">
                    <ButtonClick
                      icon={<Link2 size={15} />}
                      color="bg-primary-yellow"
                      onClick={Link}
                    />
                    <ButtonClick
                      icon={<Eye size={15} />}
                      color="bg-primary-blueSoft"
                      onClick={() => Detail(student.id)}
                    />
                    <ButtonClick
                      icon={<Trash2 size={15} />}
                      color="bg-red-400"
                      onClick={Remove}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>Data TIdak ada</tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CollegeClass;
