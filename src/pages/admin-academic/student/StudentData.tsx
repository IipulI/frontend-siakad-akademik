import MainLayout from "../../../components/layouts/MainLayout";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import TableStudent from "../../../components/admin-academic/student-data/TableStudent";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import {
  Plus,
  Printer,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  Eye,
  Link2,
} from "lucide-react";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { useEffect, useRef, useState } from "react";
import Status from "../../../components/admin-academic/student-data/Status";
import { useNavigate } from "react-router-dom";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useStudentData } from "../../../hooks/admin-akademik/useMahasiswa";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function StudentData() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // state untuk filter dan search
  const [filters, setFilters] = useState({
    keyword: "",
  });

  const [searchKeyword, setSearchKeyword] = useState("");

  const navigate = useNavigate();
  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useStudentData(currentPage, rowsPerPage, filters.keyword);

  const firstLoad = useRef(true);

  const categoryOptions = [{ value: "", label: "Semua Kategori" }];

  // Extract data dari response
  const studentData = apiResponse?.data || [];
  const pagination = apiResponse?.pagination;

  useEffect(() => {
    if (!isLoading) {
      firstLoad.current = false;
    }
  }, [isLoading]);

  console.log(studentData);

  if (isLoading && firstLoad.current) {
    return <LoadingSpinner title="Mahasiswa" />;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center py-4">
        Gagal memuat data tagihan komponen
      </div>
    );
  }

  // Handle Enter key pada search input
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      SearchSubmit();
    }
  };

  // function buat search
  function SearchSubmit() {
    setFilters((prev) => ({
      ...prev,
      keyword: searchKeyword,
    }));
    setCurrentPage(1); // Reset ke halaman 1 saat search
  }

  function Refres() {
    setFilters({
      keyword: "",
    });
    setSearchKeyword("");
    setCurrentPage(1);
  }

  // function buat tambah, hapus, cetak dan aksi
  function Create() {
    navigate(AdminAcademicRoute.student.createStudent);
  }
  function Delete() {
    alert("delete");
  }
  function Print() {
    alert("print");
  }
  function Setting() {
    alert("aksi");
  }

  function Link() {
    alert("link");
  }
  function Detail() {
    navigate(AdminAcademicRoute.student.detailStudent);
  }
  function Remove() {
    alert("link");
  }

  // Handler untuk perubahan halaman
  function handlePageChange(newPage: number) {
    setCurrentPage(newPage);
  }

  // Handler untuk perubahan rows per page
  function handleRowsPerPageChange(newRowsPerPage: number) {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  }

  return (
    <MainLayout titlePage="Mahasiswa" isGreeting={false}>
      {/* filter */}
      <div className="grid xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
        <InputFilter options={categoryOptions} label="Unit / Program Studi" />
        <InputFilter options={categoryOptions} label="Angkatan" />
        <InputFilter options={categoryOptions} label="Status Mahasiswa" />
        <InputFilter options={categoryOptions} label="Sistem Kuliah" />
        <InputFilter options={categoryOptions} label="Jenis Pendaftaran" />
        <InputFilter options={categoryOptions} label="Jalur Pendaftaran" />
        <InputFilter options={categoryOptions} label="Gelombang" />
        <InputFilter options={categoryOptions} label="Kurikulum" />
        <InputFilter options={categoryOptions} label="Kelas Perkuliahan" />
        <InputFilter options={categoryOptions} label="Range IPK" />
        <InputFilter options={categoryOptions} label="Jenis Kelamin" />
        <InputFilter options={categoryOptions} label="Periode Masuk" />
        <InputFilter options={categoryOptions} label="Periode Keluar" />
      </div>

      {/* tabel mahasiswa */}
      <div className="border-t-2 border-primary-green bg-white mt-5 p-1 rounded-sm shadow-sm pb-4">
        <div className="my-4 gap-2 lg:gap-0 flex flex-col lg:flex-row justify-between">
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-10">
            <select name="" id="" className="p-1 text-xs border-1 rounded w-30">
              <option value="semua">-- Semua --</option>
            </select>

            <div className="flex items-center">
              <input
                type="text"
                className="border-2 p-1 rounded text-xs w-50  "
                placeholder="Cari Kelas Kuliah"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <ButtonClick
                icon={<Search size={16} strokeWidth={3} />}
                color="bg-primary-yellow"
                onClick={SearchSubmit}
              />
              <ButtonClick
                icon={<RefreshCw size={16} strokeWidth={3} />}
                color="bg-blue-900"
                onClick={Refres}
              />
            </div>
          </div>

          <div className="flex space-x-3">
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
            <ButtonClick
              icon={<Printer size={15} strokeWidth={2.5} />}
              color="bg-primary-blueSoft"
              text="Cetak"
              onClick={Print}
            />
            <ButtonClick
              icon={<Settings size={15} strokeWidth={2.5} />}
              color="bg-primary-yellow"
              text="Aksi"
              onClick={Setting}
            />
          </div>
        </div>
        <TableStudent data={studentData} isLoading={isLoading}>
          <div className="flex justify-center space-x-2">
            {
              <ButtonClick
                icon={<Link2 size={15} />}
                color={"bg-primary-yellow"}
                onClick={Link}
              />
            }
            {
              <ButtonClick
                icon={<Eye size={15} />}
                color={"bg-primary-blueSoft"}
                onClick={Detail}
              />
            }
            {
              <ButtonClick
                icon={<Trash2 size={15} />}
                color={"bg-red-400"}
                onClick={Remove}
              />
            }
          </div>
        </TableStudent>

        {/* Pagination Section */}
        {pagination && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            rowsPerPage={pagination.perPage}
            totalRows={pagination.totalItems}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}
      </div>
      <Status />
      <div className="py-5"></div>
    </MainLayout>
  );
}
