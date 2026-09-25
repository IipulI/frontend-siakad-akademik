  import MainLayout from "../../../components/layouts/MainLayout";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import {
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Printer,
  FileSpreadsheet,
} from "lucide-react";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { useEffect, useRef, useState } from "react";
import Status from "../../../components/admin-academic/student-data/Status";
import { useNavigate } from "react-router-dom";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import {
  useDeleteStudent,
  useStudentData,
} from "../../../hooks/admin-akademik/useMahasiswa";
import LoadingSpinner from "../../../components/LoadingSpinner";
import {
  showToast,
  ToastNotif,
} from "../../../components/admin-finance/Toastify";
import ConfirmModal from "../../../components/admin-finance/ConfirmModal";
import { getProgramStudi } from "../../../hooks/useGeneral";

export default function StudentData() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [searchScope, setSearchScope] = useState("semua");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
  const [isPrintDropdownOpen, setIsPrintDropdownOpen] = useState(false);

  // state untuk filter dan search
  const [filters, setFilters] = useState({
    keyword: "",
    programStudi: "",
    jenisPendaftaran: "",
    kelasPerkuliahan: "",
    angkatan: "",
    jalurPendaftaran: "",
    statusMahasiswa: "",
    gelombang: "",
    jenisKelamin: "",
    sistemKuliah: "",
    kurikulum: "",
    periodeMasuk: "",
    periodeKeluar: "",
  });

  const [searchKeyword, setSearchKeyword] = useState("");

  const navigate = useNavigate();
  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useStudentData(
    currentPage,
    rowsPerPage,
    filters.keyword,
    filters.programStudi,
    filters.jenisPendaftaran,
    filters.kelasPerkuliahan,
    filters.angkatan,
    filters.jalurPendaftaran,
    filters.statusMahasiswa,
    filters.gelombang,
    filters.jenisKelamin,
    filters.sistemKuliah,
    filters.kurikulum,
    filters.periodeMasuk,
    filters.periodeKeluar
  );
  // state untuk modal konfirmasi delete
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const deleteStudent = useDeleteStudent();
  const { data: programStudiData } = getProgramStudi();

  const firstLoad = useRef(true);

  // Extract data dari response
  const studentData = apiResponse?.data || [];
  const pagination = apiResponse?.pagination;

  useEffect(() => {
    if (!isLoading) {
      firstLoad.current = false;
    }
  }, [isLoading]);

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
      programStudi: "",
      jenisPendaftaran: "",
      kelasPerkuliahan: "",
      angkatan: "",
      jalurPendaftaran: "",
      statusMahasiswa: "",
      gelombang: "",
      jenisKelamin: "",
      sistemKuliah: "",
      kurikulum: "",
      periodeMasuk: "",
      periodeKeluar: "",
    });
    setSearchKeyword("");
    setSelectedIds([]);
    setCurrentPage(1);
  }

  // function buat tambah, hapus, cetak dan aksi
  function Create() {
    navigate(AdminAcademicRoute.student.createStudent);
  }

  function handleSelectAll(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setSelectedIds(studentData.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  }

  function handleSelectOne(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function handleBulkDelete() {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data mahasiswa terpilih?`)) {
      Promise.all(selectedIds.map((id) => deleteStudent.mutateAsync(id)))
        .then(() => {
          showToast.success(`${selectedIds.length} data mahasiswa berhasil dihapus!`);
          setSelectedIds([]);
          Refres();
        })
        .catch(() => {
          showToast.error("Gagal menghapus beberapa data.");
        });
    }
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

  function openDeleteModal(id: string) {
    setSelectedId(id);
    setIsModalOpen(true);
  }

  function Link() {
    showToast.info("Membuka tautan akademik / KRS mahasiswa...");
  }

  function Detail(item: any) {
    navigate(AdminAcademicRoute.student.detailStudent, {
      state: item,
    });
  }

  // Fungsi untuk menghapus mahasiswa dengan hook
  async function confirmDelete() {
    if (!selectedId || deleteStudent.isPending) return;

    try {
      await deleteStudent.mutateAsync(selectedId);
      if (studentData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      showToast.success("Data berhasil dihapus!");
      Refres();
    } catch (err) {
      showToast.error("Gagal menghapus data.");
    } finally {
      setIsModalOpen(false);
      setSelectedId(null);
    }
  }

  const programStudi = [
    { value: "", label: "-- Pilih Program Studi --" },
    ...(programStudiData?.map((item) => ({
      value: item.namaProgramStudi,
      label: item.namaProgramStudi,
    })) || []),
  ];

  const jenisPendaftaran = [
    { value: "", label: "-- Pilih Jenis Pendaftaran --" },
    { value: "Baru", label: "Baru" },
    { value: "Pindahan", label: "Pindahan" },
  ];

  const kelasPerkuliahan = [
    { value: "", label: "-- Pilih Kelas Perkuliahan --" },
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
  ];

  const periodeKeluar = [{ value: "", label: "-- Pilih Periode Keluar --" }];

  const angkatan = [
    { value: "", label: "-- Pilih Angkatan --" },
    { value: "2021", label: "2021" },
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
  ];

  const jalurPendaftaran = [
    { value: "", label: "-- Pilih Jalur Pendaftaran --" },
    { value: "Mandiri", label: "Mandiri" },
    { value: "Prestasi", label: "Prestasi" },
    { value: "Beasiswa", label: "Beasiswa" },
  ];

  const rangeIPK = [{ value: "", label: "-- Pilih Range IPK --" }];

  const statusMahasiswa = [
    { value: "", label: "-- Pilih Status Mahasiswa --" },
    { value: "aktif", label: "Aktif" },
    { value: "cuti", label: "Cuti" },
    { value: "tidak aktif", label: "Tidak Aktif" },
  ];

  const gelombang = [
    { value: "", label: "-- Pilih Gelombang --" },
    { value: "1", label: "Gelombang 1" },
    { value: "2", label: "Gelombang 2" },
    { value: "3", label: "Gelombang 3" },
  ];

  const jenisKelamin = [
    { value: "", label: "-- Pilih Jenis Kelamin --" },
    { value: "Laki-Laki", label: "Laki-Laki" },
    { value: "Perempuan", label: "Perempuan" },
  ];

  const sistemKuliah = [
    { value: "", label: "-- Pilih Sistem Kuliah --" },
    { value: "Reguler", label: "Reguler" },
    { value: "Karyawan", label: "Karyawan" },
  ];

  const kurikulum = [{ value: "", label: "-- Pilih Kurikulum --" }];

  const periodeMasuk = [
    { value: "", label: "-- Pilih Periode Masuk --" },
    { value: "20241", label: "20241" },
    { value: "20251", label: "20251" },
    { value: "20261", label: "20261" },
  ];

  // Handle filter change
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setCurrentPage(1); // Reset ke halaman 1 saat filter berubah
  };

  if (isLoading && firstLoad.current) {
    return <LoadingSpinner title="Mahasiswa" />;
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center py-4">
        Gagal memuat data Mahasiswa
      </div>
    );
  }

  return (
    <MainLayout titlePage="Mahasiswa" subTitle="Daftar Mahasiswa" isGreeting={false}>
      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
      <ToastNotif />

      {/* 2-Column Academic Workspace: Collapsible Filter Sidebar + Data Table */}
      <div className="flex flex-col lg:flex-row items-start gap-4">
        {/* Left Filter Sidebar */}
        {isFilterOpen && (
          <aside className="w-full lg:w-72 xl:w-80 shrink-0">
            <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
              {/* Sidebar Header */}
              <div className="bg-slate-50/90 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs tracking-wider uppercase">
                  <Filter size={15} className="text-primary-green shrink-0" />
                  <span>FILTER DATA</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  title="Sembunyikan Filter"
                  className="bg-primary-yellow hover:bg-[#e89012] text-white p-1 rounded-md transition-all cursor-pointer shadow-2xs flex items-center gap-1 text-[11px] font-semibold px-2"
                >
                  <ChevronLeft size={14} />
                  <span>Sembunyikan</span>
                </button>
              </div>

              {/* Filter List - Flow naturally stacked downwards without inner scrollbar */}
              <div className="p-3.5 space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                    Unit / Program Studi
                  </label>
                  <InputFilter
                    options={programStudi}
                    label=""
                    value={filters.programStudi}
                    onChange={(value) => handleFilterChange("programStudi", value)}
                  />
                  {filters.programStudi && (
                    <span className="inline-block text-[11px] font-semibold text-primary-green bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded mt-1">
                      {filters.programStudi}
                    </span>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-2.5 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                    Angkatan
                  </label>
                  <InputFilter
                    options={angkatan}
                    label=""
                    value={filters.angkatan}
                    onChange={(value) => handleFilterChange("angkatan", value)}
                  />
                </div>

                <div className="border-t border-slate-100 pt-2.5 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                    Status Mahasiswa
                  </label>
                  <InputFilter
                    options={statusMahasiswa}
                    label=""
                    value={filters.statusMahasiswa}
                    onChange={(value) => handleFilterChange("statusMahasiswa", value)}
                  />
                </div>

                <div className="border-t border-slate-100 pt-2.5 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                    Sistem Kuliah
                  </label>
                  <InputFilter
                    options={sistemKuliah}
                    label=""
                    value={filters.sistemKuliah}
                    onChange={(value) => handleFilterChange("sistemKuliah", value)}
                  />
                </div>

                <div className="border-t border-slate-100 pt-2.5 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                    Jenis Pendaftaran
                  </label>
                  <InputFilter
                    options={jenisPendaftaran}
                    label=""
                    value={filters.jenisPendaftaran}
                    onChange={(value) => handleFilterChange("jenisPendaftaran", value)}
                  />
                </div>

                <div className="border-t border-slate-100 pt-2.5 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                    Jalur Pendaftaran
                  </label>
                  <InputFilter
                    options={jalurPendaftaran}
                    label=""
                    value={filters.jalurPendaftaran}
                    onChange={(value) => handleFilterChange("jalurPendaftaran", value)}
                  />
                </div>

                <div className="border-t border-slate-100 pt-2.5 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                    Gelombang
                  </label>
                  <InputFilter
                    options={gelombang}
                    label=""
                    value={filters.gelombang}
                    onChange={(value) => handleFilterChange("gelombang", value)}
                  />
                </div>

                <div className="border-t border-slate-100 pt-2.5 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                    Kurikulum
                  </label>
                  <InputFilter
                    options={kurikulum}
                    label=""
                    value={filters.kurikulum}
                    onChange={(value) => handleFilterChange("kurikulum", value)}
                  />
                </div>

                <div className="border-t border-slate-100 pt-2.5 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                    Kelas Perkuliahan
                  </label>
                  <InputFilter
                    options={kelasPerkuliahan}
                    label=""
                    value={filters.kelasPerkuliahan}
                    onChange={(value) => handleFilterChange("kelasPerkuliahan", value)}
                  />
                </div>

                <div className="border-t border-slate-100 pt-2.5 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                    Range IPK
                  </label>
                  <InputFilter
                    options={rangeIPK}
                    label=""
                    value=""
                    onChange={() => {}}
                  />
                </div>

                <div className="border-t border-slate-100 pt-2.5 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                    Jenis Kelamin
                  </label>
                  <InputFilter
                    options={jenisKelamin}
                    label=""
                    value={filters.jenisKelamin}
                    onChange={(value) => handleFilterChange("jenisKelamin", value)}
                  />
                </div>

                <div className="border-t border-slate-100 pt-2.5 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                    Periode Masuk
                  </label>
                  <InputFilter
                    options={periodeMasuk}
                    label=""
                    value={filters.periodeMasuk}
                    onChange={(value) => handleFilterChange("periodeMasuk", value)}
                  />
                </div>

                <div className="border-t border-slate-100 pt-2.5 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                    Periode Keluar
                  </label>
                  <InputFilter
                    options={periodeKeluar}
                    label=""
                    value={filters.periodeKeluar}
                    onChange={(value) => handleFilterChange("periodeKeluar", value)}
                  />
                </div>
              </div>

              {/* Reset Filter Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-200">
                <button
                  type="button"
                  onClick={Refres}
                  className="w-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-semibold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>Reset Filter</span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Right Content Area: Table + Actions + Legend */}
        <div className="flex-1 min-w-0 w-full space-y-5">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4">
            {/* Top Toolbar */}
            <div className="mb-4 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
              {/* Left Search and Scope */}
              <div className="flex flex-wrap items-center gap-2">
                {!isFilterOpen && (
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-1.5 bg-primary-yellow hover:bg-[#e89012] text-white px-3 py-1.5 h-[34px] rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                  >
                    <Filter size={14} />
                    <span>Tampilkan Filter</span>
                  </button>
                )}

                <div className="flex items-center">
                  <select
                    value={searchScope}
                    onChange={(e) => setSearchScope(e.target.value)}
                    className="border border-slate-300 border-r-0 px-2.5 py-1.5 text-xs font-medium rounded-l-lg text-slate-700 bg-slate-50/60 focus:outline-none focus:ring-1 focus:ring-primary-green h-[34px]"
                  >
                    <option value="semua">-- Semua --</option>
                    <option value="npm">NPM / NIM</option>
                    <option value="nama">Nama</option>
                  </select>

                  <input
                    type="text"
                    className="border border-slate-300 px-3 py-1.5 text-xs w-44 sm:w-60 focus:outline-none focus:ring-1 focus:ring-primary-green transition-all h-[34px]"
                    placeholder="Cari Mahasiswa..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                  />
                  <button
                    type="button"
                    onClick={SearchSubmit}
                    title="Cari Data"
                    className="bg-primary-yellow hover:bg-[#e89012] text-white px-3.5 h-[34px] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  >
                    <Search size={16} strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={Refres}
                    title="Reset Pencarian"
                    className="bg-primary-blueDark hover:bg-[#2e42a8] text-white px-3.5 h-[34px] rounded-r-lg flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  >
                    <RefreshCw size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={Create}
                  className="bg-primary-green hover:bg-[#0d5950] text-white px-3.5 py-1.5 h-[34px] rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span>Tambah</span>
                </button>

                <button
                  type="button"
                  onClick={handleBulkDelete}
                  disabled={selectedIds.length === 0}
                  className="bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:hover:bg-red-500 text-white px-3.5 py-1.5 h-[34px] rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  <Trash2 size={15} strokeWidth={2.5} />
                  <span>Hapus</span>
                  {selectedIds.length > 0 && (
                    <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {selectedIds.length}
                    </span>
                  )}
                </button>

                {/* Dropdown Aksi */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsActionDropdownOpen(!isActionDropdownOpen);
                      setIsPrintDropdownOpen(false);
                    }}
                    className="bg-primary-yellow hover:bg-[#e89012] text-white px-3.5 py-1.5 h-[34px] rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  >
                    <span>Aksi</span>
                    <ChevronDown size={14} className={isActionDropdownOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                  </button>

                  {isActionDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setIsActionDropdownOpen(false);
                          showToast.success("Mengekspor data mahasiswa ke Excel...");
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                      >
                        <FileSpreadsheet size={15} className="text-emerald-600" />
                        <span>Ekspor Excel</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsActionDropdownOpen(false);
                          showToast.info("Pilih mahasiswa untuk perbarui status massal");
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                      >
                        <RefreshCw size={15} className="text-primary-blueDark" />
                        <span>Update Status Massal</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Dropdown Cetak */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPrintDropdownOpen(!isPrintDropdownOpen);
                      setIsActionDropdownOpen(false);
                    }}
                    className="bg-primary-blueSoft hover:bg-[#00a6ce] text-white px-3.5 py-1.5 h-[34px] rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  >
                    <Printer size={15} />
                    <span>Cetak</span>
                    <ChevronDown size={14} className={isPrintDropdownOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                  </button>

                  {isPrintDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setIsPrintDropdownOpen(false);
                          window.print();
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                      >
                        <Printer size={15} className="text-slate-600" />
                        <span>Cetak Daftar Mahasiswa</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsPrintDropdownOpen(false);
                          showToast.info("Mencetak Kartu Ujian...");
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                      >
                        <Printer size={15} className="text-slate-600" />
                        <span>Cetak Kartu Ujian</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table Area - Styled like exact reference in Image 1 & 2 with vertical borders */}
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-primary-green text-white text-xs font-bold tracking-wider select-none">
                    <th className="py-3.5 px-3 text-center w-12 border-r border-white/20">
                      <input
                        type="checkbox"
                        checked={studentData.length > 0 && selectedIds.length === studentData.length}
                        onChange={handleSelectAll}
                        className="rounded border-slate-300 text-primary-green focus:ring-primary-green cursor-pointer h-4 w-4"
                      />
                    </th>
                    <th className="py-3.5 px-3 text-center border-r border-white/20">NPM</th>
                    <th className="py-3.5 px-4 text-left border-r border-white/20">NAMA MAHASISWA</th>
                    <th className="py-3.5 px-3 text-center border-r border-white/20">JENJANG</th>
                    <th className="py-3.5 px-4 text-left border-r border-white/20">PROGRAM STUDI</th>
                    <th className="py-3.5 px-3 text-center border-r border-white/20">MASUK</th>
                    <th className="py-3.5 px-3 text-center border-r border-white/20">STATUS</th>
                    <th className="py-3.5 px-3 text-center border-r border-white/20">SMT</th>
                    <th className="py-3.5 px-3 text-center border-r border-white/20">SKS</th>
                    <th className="py-3.5 px-3 text-center border-r border-white/20">IPK</th>
                    <th className="py-3.5 px-3 text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {isLoading ? (
                    <tr>
                      <td colSpan={11} className="text-center py-10 text-slate-400">
                        Memuat data mahasiswa...
                      </td>
                    </tr>
                  ) : studentData.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="text-center py-10 text-slate-400">
                        Tidak ada data yang ditemukan
                      </td>
                    </tr>
                  ) : (
                    studentData.map((student) => {
                      const isSelected = selectedIds.includes(student.id);
                      return (
                        <tr
                          key={student.id}
                          className={`border-b border-slate-200 transition-colors ${
                            isSelected ? "bg-emerald-50/50" : "hover:bg-slate-50/80 bg-white"
                          }`}
                        >
                          <td className="py-3 px-3 text-center border-r border-slate-200">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectOne(student.id)}
                              className="rounded border-slate-300 text-primary-green focus:ring-primary-green cursor-pointer h-4 w-4"
                            />
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-800 text-center font-mono text-[11px] border-r border-slate-200">
                            {student.npm}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800 uppercase tracking-tight border-r border-slate-200">
                            {student.nama}
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-600 text-center border-r border-slate-200">
                            {student?.programStudi?.jenjang?.jenjang || "S1"}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-700 border-r border-slate-200">
                            {student?.programStudi?.nama || "-"}
                          </td>
                          <td className="py-3 px-3 text-slate-600 text-center font-mono border-r border-slate-200">
                            {student.periodeMasuk || "-"}
                          </td>
                          <td className="py-3 px-3 text-center border-r border-slate-200">
                            <span
                              className={`inline-flex items-center justify-center font-bold text-[11px] px-2 py-0.5 rounded ${
                                student.statusMahasiswa?.nama === "Aktif" || student.statusMahasiswa?.nama === "aktif"
                                  ? "bg-amber-100 text-amber-900 border border-amber-200"
                                  : "bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                              title={student.statusMahasiswa?.nama || "Aktif"}
                            >
                              {student.statusMahasiswa?.nama ? student.statusMahasiswa.nama.charAt(0).toUpperCase() : "A"}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-700 text-center border-r border-slate-200">
                            {student.semester ?? "-"}
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-700 text-center border-r border-slate-200">
                            {student.sks ?? 0}
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-800 text-center border-r border-slate-200">
                            {student?.hasilStudi?.ipk !== undefined && student?.hasilStudi?.ipk !== null
                              ? Number(student.hasilStudi.ipk).toFixed(2)
                              : "0.00"}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex justify-center items-center gap-1.5">
                              {/* KRS / Link Button */}
                              <button
                                type="button"
                                onClick={() => Link()}
                                title="KRS / Tautan Mahasiswa"
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded border border-slate-200 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                              >
                                <ExternalLink size={14} />
                              </button>
                              {/* Detail / Profile Button */}
                              <button
                                type="button"
                                onClick={() => Detail(student.id)}
                                title="Detail Mahasiswa"
                                className="p-1.5 bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-600 rounded border border-slate-200 shadow-2xs transition-colors active:scale-95 cursor-pointer"
                              >
                                <Eye size={14} />
                              </button>
                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => openDeleteModal(student.id)}
                                title="Hapus Mahasiswa"
                                className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded shadow-2xs transition-transform active:scale-95 cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Section */}
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

          {/* Status Explanation Legend */}
          <Status />
        </div>
      </div>
      <div className="py-4"></div>
    </MainLayout>
  );
}
