import MainLayout from "../../../components/layouts/MainLayout";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { Check, ChevronDown, Eye, Pen, Search, Settings, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pagination } from "../../../components/admin-academic/Pagination";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useGetAllPeriode, useGetActivePeriode, useApproveKrs, useCancelKrs, useAssignAdvisor, useGetAcademicAdvisor } from "../../../hooks/admin-akademik/usePembimbingAkademik";
import ConfirmationModal from "../../../components/ConfirmationModal";
import AssignAdvisorModal from "../../../components/AsignAdvisorModal";

// --- Tipe data untuk props & state ---
const statusPembimbing = [
  { value: "", label: "Semua" },
  { value: "true", label: "Sudah Ada" },
  { value: "false", label: "Belum Ada" },
];
const statusKRS = [
  { value: "", label: "Semua" },
  { value: "submitted", label: "Diajukan" },
  { value: "approved", label: "Disetujui" },
];

interface AdvisorDetails {
  lecturerId: string;
  noSk: string;
  tanggalSk: string;
}

export default function AcademikAdvisor() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: async () => {},
  });
  const [filters, setFilters] = useState({
    periodeAkademik: "", // State ini akan menyimpan ID periode
    namaMahasiswa: "",
    angkatan: "",
    statusKrs: "",
    hasPembimbing: undefined as boolean | undefined,
    statusMahasiswa: "",
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Ambil semua data periode terlebih dahulu
  const { data: allPeriode, isLoading: isLoadingAllPeriode } = useGetAllPeriode();
  const { activePeriode, isLoadingPeriode } = useGetActivePeriode();

  // 2. Hitung/Cari NAMA periode berdasarkan ID yang ada di state filter
  const selectedPeriodName = useMemo(() => {
    if (!filters.periodeAkademik || !allPeriode) return "";
    return allPeriode.find((p) => p.id === filters.periodeAkademik)?.namaPeriode || "";
  }, [filters.periodeAkademik, allPeriode]);

  // 3. Panggil data tabel dengan NAMA periode dan filter lainnya
  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAcademicAdvisor({
    ...filters,
    page: currentPage,
    size: rowsPerPage,
    periodeAkademik: selectedPeriodName, // Kirim NAMA ke API untuk GET request
  });

  const approveKrsMutation = useApproveKrs();
  const cancelKrsMutation = useCancelKrs();
  const assignAdvisorMutation = useAssignAdvisor();

  // Atur filter ke ID periode aktif saat komponen pertama kali dimuat
  useEffect(() => {
    if (activePeriode) {
      setFilters((prev) => ({ ...prev, periodeAkademik: activePeriode.id }));
    }
  }, [activePeriode]);

  // Efek untuk menutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsActionOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Opsi dropdown harus menggunakan ID sebagai 'value' agar konsisten dengan state
  const periodeOptions = useMemo(() => {
    if (!allPeriode) return [];
    return allPeriode.map((p) => ({ value: p.id, label: p.namaPeriode }));
  }, [allPeriode]);

  // Sisa dari komponen (return JSX, etc.) tetap sama...

  if (isError) return <div className="text-red-500 text-center py-4">Gagal memuat data. Silakan coba lagi.</div>;
  const isDataLoading = isLoading || isLoadingPeriode || isLoadingAllPeriode;
  const isMutationLoading = approveKrsMutation.isPending || cancelKrsMutation.isPending || assignAdvisorMutation.isPending;
  const studentRecords = apiResponse?.data || [];

  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleSearchSubmit = () => handleFilterChange("namaMahasiswa", searchKeyword.trim());
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearchSubmit();
  };
  const clearSearch = () => {
    setSearchKeyword("");
    handleFilterChange("namaMahasiswa", "");
  };

  const handleRowCheckboxChange = (rowId: string) => {
    setSelectedRows((prev) => (prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]));
  };

  const handleSelectAllRows = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allRowIds = (apiResponse?.data || []).map((record) => record.id);
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows([]);
    }
  };

  const closeModal = () => setModalState((prev) => ({ ...prev, isOpen: false }));

  const openConfirmationModal = (type: "approve" | "cancel") => {
    if (selectedRows.length === 0) {
      alert("Pilih setidaknya satu mahasiswa.");
      return;
    }
    const selectedPeriodeId = filters.periodeAkademik;
    if (!selectedPeriodeId) {
      alert("Gagal mendapatkan ID Periode Akademik. Silakan pilih periode.");
      return;
    }

    let title = "";
    let message = "";
    let onConfirm: () => Promise<void>;

    if (type === "approve") {
      title = "Konfirmasi Persetujuan KRS";
      message = `Anda yakin akan menyetujui KRS untuk ${selectedRows.length} mahasiswa yang dipilih?`;
      onConfirm = async () => {
        await approveKrsMutation.mutateAsync({
          mahasiswaIds: selectedRows,
          periodeAkademikId: selectedPeriodeId,
        });
      };
    } else {
      title = "Konfirmasi Pembatalan KRS";
      message = `Anda yakin akan membatalkan KRS untuk ${selectedRows.length} mahasiswa yang dipilih?`;
      onConfirm = async () => {
        await cancelKrsMutation.mutateAsync({
          mahasiswaIds: selectedRows,
          periodeAkademikId: selectedPeriodeId,
        });
      };
    }

    setModalState({
      isOpen: true,
      title,
      message,
      onConfirm: async () => {
        try {
          await onConfirm();
          setSelectedRows([]);
          setTimeout(() => refetch(), 500);
        } finally {
          closeModal();
        }
      },
    });
    setIsActionOpen(false);
  };

  const handleOpenAssignModal = () => {
    if (selectedRows.length === 0) {
      alert("Pilih setidaknya satu mahasiswa untuk ditetapkan pembimbingnya.");
      return;
    }
    setIsAssignModalOpen(true);
    setIsActionOpen(false);
  };

  const handleSaveAdvisor = async (details: AdvisorDetails) => {
    const selectedPeriodeId = filters.periodeAkademik;
    if (!selectedPeriodeId) {
      alert("Periode akademik tidak ditemukan. Silakan segarkan halaman.");
      return;
    }
    const payload = {
      periodeAkademikId: selectedPeriodeId,
      mahasiswaIds: selectedRows,
      dosenId: details.lecturerId,
      noSk: details.noSk,
      tanggalSk: details.tanggalSk,
    };

    try {
      await assignAdvisorMutation.mutateAsync(payload);
      setSelectedRows([]);
      setIsAssignModalOpen(false);
      setTimeout(() => refetch(), 500);
    } catch (error) {
      console.error("Failed to assign advisor:", error);
    }
  };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleRowsPerPageChange = (size: number) => {
    setRowsPerPage(size);
    setCurrentPage(1);
  };

  const handleEdit = (id: string) => alert(`Fungsi Edit untuk ID: ${id} belum diimplementasikan.`);
  const handleDetail = (id: string) => alert(`Fungsi Detail untuk ID: ${id} belum diimplementasikan.`);

  return (
    <MainLayout isGreeting={false} titlePage="Pembimbing Akademik">
      {isMutationLoading && <LoadingSpinner title="Menyimpan perubahan..." />}
      <div className="grid xl:grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 bg-white border-t-2 border-yellow-400 p-3 rounded-md shadow-sm gap-4">
        <InputFilter options={periodeOptions} label="Periode Akademik" value={filters.periodeAkademik} onChange={(value) => handleFilterChange("periodeAkademik", value)} />
        <InputFilter
          options={statusPembimbing}
          label="Status Pembimbing"
          value={filters.hasPembimbing === undefined ? "" : String(filters.hasPembimbing)}
          onChange={(value) => handleFilterChange("hasPembimbing", value === "" ? undefined : value === "true")}
        />
        <InputFilter options={[]} label="Semester" />
        <InputFilter options={[]} label="Unit kerja" />
        <InputFilter options={statusKRS} label="Status KRS" value={filters.statusKrs} onChange={(value) => handleFilterChange("statusKrs", value)} />
        <InputFilter options={[]} label="Status Mahasiswa" value={filters.statusMahasiswa} onChange={(value) => handleFilterChange("statusMahasiswa", value)} />
        <InputFilter options={[]} label="Angkatan" value={filters.angkatan} onChange={(value) => handleFilterChange("angkatan", value)} />
      </div>

      <div className="border-t-2 border-primary-green bg-white mt-5 p-2 py-4 rounded-sm shadow-sm pb-4">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <div className="relative">
              <input type="text" className="border-2 p-1 rounded text-xs w-60" placeholder="Cari nama mahasiswa" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} onKeyDown={handleSearchKeyDown} />
              {searchKeyword && (
                <button onClick={clearSearch} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>
            <ButtonClick icon={<Search size={16} strokeWidth={3} />} color="bg-primary-yellow" onClick={handleSearchSubmit} />
            {filters.namaMahasiswa && (
              <div className="flex items-center bg-blue-100 px-2 py-1 rounded text-xs">
                <span className="mr-1">Pencarian: "{filters.namaMahasiswa}"</span>
                <button onClick={clearSearch} className="text-blue-600 hover:text-blue-800">
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsActionOpen(!isActionOpen)} className="flex bg-yellow-500 hover:bg-yellow-600 items-center rounded p-1 px-2 text-white font-semibold text-sm transition-colors">
              <Settings color="white" size={17} className="mr-1" />
              <span className="mr-1">Aksi</span>
              <ChevronDown size={16} className={`transform transition-transform ${isActionOpen ? "rotate-180" : ""}`} />
            </button>
            {isActionOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[180px]">
                <button onClick={() => openConfirmationModal("approve")} className="w-full text-left px-3 py-2 text-black text-sm hover:bg-gray-100 rounded-t flex items-center">
                  Setujui KRS
                </button>
                <button onClick={() => openConfirmationModal("cancel")} className="w-full text-left px-3 py-2 text-black text-sm hover:bg-gray-100 flex items-center">
                  Batalkan KRS
                </button>
                <button onClick={handleOpenAssignModal} className="w-full text-left px-3 py-2 text-black text-sm hover:bg-gray-100 rounded-b flex items-center">
                  Pembimbing Akademik
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm mt-8">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="border border-gray-500 p-2 text-center w-6">
                  <input type="checkbox" className="w-4 h-4" onChange={handleSelectAllRows} checked={studentRecords.length > 0 && selectedRows.length === studentRecords.length} />
                </th>
                <th className="border p-2">Nama Mahasiswa</th>
                <th className="border p-2">Angkatan</th>
                <th className="border p-2">Status Smt</th>
                <th className="border p-2">Smt</th>
                <th className="border p-2">SKS</th>
                <th className="border p-2">Batas SKS</th>
                <th className="border p-2">IPS</th>
                <th className="border p-2">IPK</th>
                <th className="border p-2">KRS Diajukan</th>
                <th className="border p-2">KRS Disahkan</th>
                <th className="border p-2">Pembimbing Akademik</th>
                <th className="border p-2">No SK</th>
                <th className="border p-2">Tgl SK</th>
                <th className="border p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isDataLoading ? (
                <tr>
                  <td colSpan={15} className="text-center py-4">
                    Memuat data...
                  </td>
                </tr>
              ) : !filters.periodeAkademik ? (
                <tr>
                  <td colSpan={15} className="text-center py-4 bg-yellow-50">
                    Silakan pilih Periode Akademik
                  </td>
                </tr>
              ) : studentRecords.length === 0 ? (
                <tr>
                  <td colSpan={15} className="text-center py-4">
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              ) : (
                studentRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-100">
                    <td className="text-center">
                      <input type="checkbox" className="w-4 h-4" checked={selectedRows.includes(record.id)} onChange={() => handleRowCheckboxChange(record.id)} />
                    </td>
                    <td className="p-2">{record.mahasiswa}</td>
                    <td className="text-center">{record.angkatan}</td>
                    <td className="text-center">{record.statusMahasiswa}</td>
                    <td className="text-center">{record.semester}</td>
                    <td className="text-center">{record.totalSks}</td>
                    <td className="text-center">{record.batasSks}</td>
                    <td className="text-center">{record.ips}</td>
                    <td className="text-center">{record.ipk}</td>
                    <td className="text-center">{record.statusDiajukan ? <Check color="green" size={20} /> : <X color="red" size={20} />}</td>
                    <td className="text-center">{record.statusDisetujui ? <Check color="green" size={20} /> : <X color="red" size={20} />}</td>
                    <td className="text-sm">{record.pembimbingAkademik || "-"}</td>
                    <td className="text-sm">-</td>
                    <td className="text-sm text-center">-</td>
                    <td className="text-center">
                      <div className="flex justify-center space-x-2">
                        <ButtonClick icon={<Eye size={16} />} color="bg-primary-blueSoft" onClick={() => handleDetail(record.id)} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {apiResponse?.pagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={apiResponse.pagination.totalPages}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            totalRows={apiResponse.pagination.totalElements}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}
      </div>

      <ConfirmationModal {...modalState} onClose={closeModal} />
      <AssignAdvisorModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} onSave={handleSaveAdvisor} selectedStudentCount={selectedRows.length} />
    </MainLayout>
  );
}
