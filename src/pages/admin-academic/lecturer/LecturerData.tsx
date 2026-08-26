import MainLayout from "../../../components/layouts/MainLayout";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { RefreshCw, Search, Eye, CloudDownload } from "lucide-react";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  useLecturerData,
  useSyncSimpeg,
} from "../../../hooks/admin-akademik/useLecturer";
import { LecturerData as LecturerRow } from "../../../api/admin-academic/lecturerService";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import {
  showToast,
  ToastNotif,
} from "../../../components/admin-finance/Toastify";

export default function LecturerData() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filters, setFilters] = useState({
    homeBase: "",
    jenisPegawai: "",
    jenisKelamin: "",
    status: "",
  });

  const [searchKeyword, setSearchKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");

  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useLecturerData({
    page: currentPage,
    size: rowsPerPage,
    keyword: appliedKeyword,
    homeBase: filters.homeBase,
    jenisPegawai: filters.jenisPegawai,
    jenisKelamin: filters.jenisKelamin,
    status: filters.status,
  });

  const firstLoad = useRef(true);

  const { mutate: syncSimpeg, isPending: isSyncing } = useSyncSimpeg();

  function handleSyncSimpeg() {
    syncSimpeg(undefined, {
      onSuccess: (result) => {
        showToast.success(
          `Sinkronisasi Simpeg selesai: ${result.inserted} data baru, ${result.updated} data diperbarui.`
        );
      },
      onError: () => {
        showToast.error("Gagal melakukan sinkronisasi data dosen dari Simpeg.");
      },
    });
  }

  const lecturerData = apiResponse?.data || [];
  const pagination = apiResponse?.pagination;

  useEffect(() => {
    if (!isLoading) {
      firstLoad.current = false;
    }
  }, [isLoading]);

  const homeBaseOptions = [
    { value: "", label: "-- Pilih Home Base --" },
    { value: "Teknik Informatika", label: "Teknik Informatika" },
    { value: "Sistem Informasi", label: "Sistem Informasi" },
  ];

  const jenisPegawaiOptions = [
    { value: "", label: "-- Pilih Jenis Pegawai --" },
    { value: "Dosen Tetap", label: "Dosen Tetap" },
    { value: "Dosen Tidak Tetap", label: "Dosen Tidak Tetap" },
  ];

  const jenisKelaminOptions = [
    { value: "", label: "-- Pilih Jenis Kelamin --" },
    { value: "L", label: "Laki-Laki" },
    { value: "P", label: "Perempuan" },
  ];

  const statusOptions = [
    { value: "", label: "-- Pilih Status --" },
    { value: "Aktif", label: "Aktif" },
    { value: "Cuti", label: "Cuti" },
    { value: "Non-Aktif", label: "Non-Aktif" },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  function SearchSubmit() {
    setAppliedKeyword(searchKeyword);
    setCurrentPage(1);
  }

  function handleSearchKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      SearchSubmit();
    }
  }

  function Refresh() {
    setFilters({
      homeBase: "",
      jenisPegawai: "",
      jenisKelamin: "",
      status: "",
    });
    setSearchKeyword("");
    setAppliedKeyword("");
    setCurrentPage(1);
  }

  function Detail(item: LecturerRow) {
    navigate(AdminAcademicRoute.portal.detailDosen, { state: item });
  }

  function handlePageChange(newPage: number) {
    setCurrentPage(newPage);
  }

  function handleRowsPerPageChange(newRowsPerPage: number) {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  }

  if (isLoading && firstLoad.current) {
    return <LoadingSpinner title="Dosen" />;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center py-4">
        Gagal memuat data Dosen
      </div>
    );
  }

  return (
    <MainLayout titlePage="Dosen" isGreeting={false}>
      {/* filter */}
      <div className="grid xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 bg-white border-t-2 border-primary-yellow p-2 rounded-sm shadow-sm gap-2">
        <InputFilter
          options={homeBaseOptions}
          label="Home Base"
          value={filters.homeBase}
          onChange={(value) => handleFilterChange("homeBase", value)}
        />
        <InputFilter
          options={jenisPegawaiOptions}
          label="Jenis Pegawai"
          value={filters.jenisPegawai}
          onChange={(value) => handleFilterChange("jenisPegawai", value)}
        />
        <InputFilter
          options={jenisKelaminOptions}
          label="Jenis Kelamin"
          value={filters.jenisKelamin}
          onChange={(value) => handleFilterChange("jenisKelamin", value)}
        />
        <InputFilter
          options={statusOptions}
          label="Status"
          value={filters.status}
          onChange={(value) => handleFilterChange("status", value)}
        />
      </div>

      {/* tabel dosen */}
      <div className="border-t-2 border-primary-green bg-white mt-5 p-1 rounded-sm shadow-sm pb-4">
        <div className="my-4 gap-2 lg:gap-0 flex flex-col lg:flex-row justify-between">
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-10">
            <div className="flex items-center">
              <input
                type="text"
                className="border-2 p-1 rounded text-xs w-50"
                placeholder="Cari Data Dosen"
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
                onClick={Refresh}
              />
            </div>
          </div>
          <div className="flex items-center">
            <ButtonClick
              text={isSyncing ? "Menyinkronkan..." : "Sync Simpeg"}
              icon={<CloudDownload size={16} strokeWidth={3} />}
              color="bg-primary-green"
              spacing="2"
              disabled={isSyncing}
              onClick={handleSyncSimpeg}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary-green text-white">
                <th className="p-2 border font-semibold border-gray-300">
                  NIP
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Nama
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  L/P
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  NIDN
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  NUPTK
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  No. Telp
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Email
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Status
                </th>
                <th className="p-2 border font-semibold border-gray-300">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : lecturerData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    Tidak ada data yang ditemukan
                  </td>
                </tr>
              ) : (
                lecturerData.map((lecturer) => (
                  <tr key={lecturer.id} className="hover:bg-gray-50">
                    <td className="p-2 border border-gray-300 font-semibold text-center">
                      {lecturer.nip}
                    </td>
                    <td className="p-2 border border-gray-300 font-semibold">
                      {lecturer.nama}
                    </td>
                    <td className="p-2 border border-gray-300 font-semibold text-center">
                      {lecturer.jenisKelamin?.toUpperCase().startsWith("P") ? "P" : "L"}
                    </td>
                    <td className="p-2 border border-gray-300 font-semibold text-center">
                      {lecturer.nidn || "-"}
                    </td>
                    <td className="p-2 border border-gray-300 font-semibold text-center">
                      {lecturer.nuptk || "-"}
                    </td>
                    <td className="p-2 border border-gray-300 font-semibold text-center">
                      {lecturer.noTelp || "-"}
                    </td>
                    <td className="p-2 border border-gray-300 font-semibold">
                      {lecturer.emailPegawai || "-"}
                    </td>
                    <td className="p-2 border border-gray-300 font-semibold text-center">
                      {lecturer.statusAktif}
                    </td>
                    <td className="p-2 border border-gray-300 font-semibold">
                      <div className="flex justify-center space-x-2">
                        <ButtonClick
                          icon={<Eye size={15} />}
                          color={"bg-primary-blueSoft"}
                          onClick={() => Detail(lecturer)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPage}
            onPageChange={handlePageChange}
            rowsPerPage={pagination.perPage}
            totalRows={pagination.totalItems}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}
      </div>
      <div className="py-5"></div>
      <ToastNotif />
    </MainLayout>
  );
}
