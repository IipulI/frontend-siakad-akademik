import MainLayout from "../../../components/layouts/MainLayout";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { RefreshCw, Search, Eye, CloudDownload, Filter } from "lucide-react";
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
    <MainLayout titlePage="Dosen" subTitle="Daftar Tenaga Pendidik" isGreeting={false}>
      <ToastNotif />

      {/* Filter Card */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 border-t-4 border-t-primary-yellow p-4 mb-5">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 text-slate-800 font-semibold text-xs md:text-sm">
          <Filter size={16} className="text-primary-yellow shrink-0" />
          <span>Filter Data Dosen</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
      </div>

      {/* Tabel Dosen Card */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 border-t-4 border-t-primary-green p-4">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center">
            <input
              type="text"
              className="border border-slate-300 px-3 py-1.5 rounded-l-lg text-xs w-48 sm:w-64 focus:outline-none focus:ring-1 focus:ring-primary-green h-[34px]"
              placeholder="Cari Dosen (Nama, NIP, NIDN)..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <button
              type="button"
              onClick={SearchSubmit}
              title="Cari"
              className="bg-primary-yellow hover:bg-[#e89012] text-white px-3.5 h-[34px] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            >
              <Search size={16} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={Refresh}
              title="Reset"
              className="bg-primary-blueDark hover:bg-[#2e42a8] text-white px-3.5 h-[34px] rounded-r-lg flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw size={16} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSyncing}
              onClick={handleSyncSimpeg}
              className="bg-primary-green hover:bg-[#0d5950] disabled:opacity-60 text-white px-3.5 py-1.5 h-[34px] rounded-lg font-semibold text-xs flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
            >
              <CloudDownload size={16} strokeWidth={2.5} />
              <span>{isSyncing ? "Menyinkronkan..." : "Sync Simpeg"}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-primary-green text-white text-xs font-bold tracking-wider select-none">
                <th className="py-3.5 px-3 text-center border-r border-white/20">NIP</th>
                <th className="py-3.5 px-4 text-left border-r border-white/20">NAMA LENGKAP</th>
                <th className="py-3.5 px-2 text-center border-r border-white/20">L/P</th>
                <th className="py-3.5 px-3 text-center border-r border-white/20">NIDN</th>
                <th className="py-3.5 px-3 text-center border-r border-white/20">NUPTK</th>
                <th className="py-3.5 px-3 text-left border-r border-white/20">NO. TELP</th>
                <th className="py-3.5 px-3 text-left border-r border-white/20">EMAIL PEGAWAI</th>
                <th className="py-3.5 px-3 text-center border-r border-white/20">STATUS</th>
                <th className="py-3.5 px-3 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400">
                    Memuat data dosen...
                  </td>
                </tr>
              ) : lecturerData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400">
                    Tidak ada data dosen yang ditemukan
                  </td>
                </tr>
              ) : (
                lecturerData.map((lecturer) => (
                  <tr key={lecturer.id} className="border-b border-slate-200 hover:bg-slate-50/80 bg-white transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800 text-center font-mono text-[11px] border-r border-slate-200">
                      {lecturer.nip}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 border-r border-slate-200">
                      {lecturer.nama}
                    </td>
                    <td className="py-3 px-2 font-bold text-center border-r border-slate-200">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[11px] ${
                        lecturer.jenisKelamin?.toUpperCase().startsWith("P")
                          ? "bg-pink-100 text-pink-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {lecturer.jenisKelamin?.toUpperCase().startsWith("P") ? "P" : "L"}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 text-center border-r border-slate-200">
                      {lecturer.nidn || "-"}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 text-center border-r border-slate-200">
                      {lecturer.nuptk || "-"}
                    </td>
                    <td className="py-3 px-3 text-slate-600 border-r border-slate-200">
                      {lecturer.noTelp || "-"}
                    </td>
                    <td className="py-3 px-3 text-slate-600 border-r border-slate-200">
                      {lecturer.emailPegawai || "-"}
                    </td>
                    <td className="py-3 px-3 text-center border-r border-slate-200">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        lecturer.statusAktif === "Aktif" || lecturer.statusAktif === "aktif"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}>
                        {lecturer.statusAktif || "Aktif"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex justify-center items-center">
                        <button
                          type="button"
                          onClick={() => Detail(lecturer)}
                          title="Detail Dosen"
                          className="p-1.5 bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-600 rounded border border-slate-200 shadow-2xs transition-colors active:scale-95 cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>
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
    </MainLayout>
  );
}
