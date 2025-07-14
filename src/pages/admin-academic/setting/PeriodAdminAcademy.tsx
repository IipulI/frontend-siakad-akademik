// src/pages/admin-academic/PeriodAdminAcademic.tsx
import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import TableSetting from "../../../components/admin-academic/setting/TableSetting";
import { Plus, Search, RefreshCw } from "lucide-react";
import { Pagination } from "../../../components/admin-academic/Pagination";
// Import all necessary types
import { IPeriod, IPeriodPayload, ITableColumn, IAcademicYear } from "../../../types/models";
// Import both hooks
import { usePeriods } from "../../../hooks/admin-akademik/usePeriods";
import { useAcademicYears } from "../../../hooks/admin-akademik/useAcademicYears";

const PeriodAdminAcademic: React.FC = () => {
    // --- Pagination and Search States ---
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    // --- Inline Form States ---
    const [isAddingNewRow, setIsAddingNewRow] = useState(false);
    const [editingRowId, setEditingRowId] = useState<string | null>(null);
    const [newRowData, setNewRowData] = useState<IPeriodPayload>({
        siakTahunAjaranId: "", // This will be the ID selected from the dropdown
        namaPeriode: "",
        kodePeriode: "",
        tanggalMulai: "",
        tanggalSelesai: "",
    });
    const [editedRowData, setEditedRowData] = useState<IPeriodPayload>({
        siakTahunAjaranId: "", // This will be the ID selected from the dropdown
        namaPeriode: "",
        kodePeriode: "",
        tanggalMulai: "",
        tanggalSelesai: "",
    });

    // --- Effects for search debounce and form reset ---
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1); // Reset to first page on new search
        }, 500);
        return () => { clearTimeout(timerId); };
    }, [searchTerm]);

    useEffect(() => {
        if (isAddingNewRow) {
            setIsAddingNewRow(false);
            setNewRowData({ siakTahunAjaranId: "", namaPeriode: "", kodePeriode: "", tanggalMulai: "", tanggalSelesai: "" });
        }
        if (editingRowId !== null) {
            setEditingRowId(null);
            setEditedRowData({ siakTahunAjaranId: "", namaPeriode: "", kodePeriode: "", tanggalMulai: "", tanggalSelesai: "" });
        }
    }, [debouncedSearchTerm, currentPage, rowsPerPage]);

    // --- API Hooks ---
    // 1. Fetch Periods data for the table
    const {
        data: periodsApiResponse,
        isLoading,
        isError,
        error,
        refetch, // Function to re-fetch periods
        createPeriod,
        isCreating,
        updatePeriod,
        isUpdating,
        deletePeriod,
        isDeleting,
    } = usePeriods({
        page: currentPage,
        limit: rowsPerPage,
        search: debouncedSearchTerm,
    });

    // 2. Fetch Academic Years data to populate the 'Tahun' dropdown
    const {
        data: yearsApiResponse,
        isLoading: isLoadingYears, // Separate loading state for years
        error: yearsError // Separate error state for years
    } = useAcademicYears({
        page: 1, // Fetch all years from the first page
        limit: 100, // Assuming you want all academic years for the dropdown
        search: '' // No search keyword for the year list
    });

    // Extract data from API responses
    const periods: IPeriod[] = periodsApiResponse?.data || [];
    const pagination = periodsApiResponse?.pagination;
    const academicYears: IAcademicYear[] = yearsApiResponse?.data || [];

    // Prepare options for the 'Tahun' dropdown (format: { value: ID, label: Name })
    const academicYearOptions = academicYears.map(year => ({
        value: year.id,    // The actual ID to send to the API
        label: year.nama   // The name to display in the dropdown
    }));

    // --- Define Columns for Period Academic Table ---
    // This array tells TableSetting exactly how to render each column.
    const periodColumns: ITableColumn<IPeriod>[] = [
        {
            key: 'tahun', // This key is used to display the academic year NAME from IPeriod
            header: 'Tahun',
            isEditable: true,
            inputType: 'select',
            options: academicYearOptions // Pass the prepared options here!
        },
        { key: 'kodePeriode', header: 'Kode Periode', isEditable: true, inputType: 'text' },
        { key: 'namaPeriode', header: 'Nama Periode', isEditable: true, inputType: 'text' },
        { key: 'tanggalMulai', header: 'Tanggal Mulai', isEditable: true, inputType: 'date' },
        { key: 'tanggalSelesai', header: 'Tanggal Selesai', isEditable: true, inputType: 'date' },
        { key: 'status', header: 'Status' }, // You might want this to be a select with options 'Aktif', 'Nonaktif' later
        { key: 'actions', header: 'Aksi' } // Special 'actions' key for the buttons
    ];

    // --- Handlers for "Tambah" (Add New Row) Button ---
    const handleAddClick = () => {
        // If already adding, cancel it. Otherwise, start adding.
        if (isAddingNewRow) {
            handleCancelAdd();
        } else {
            setIsAddingNewRow(true);
            setNewRowData({
                siakTahunAjaranId: "", // Reset to empty string
                namaPeriode: "",
                kodePeriode: "",
                tanggalMulai: "",
                tanggalSelesai: "",
            });
            setEditingRowId(null); // Ensure no row is in edit mode
        }
    };

    // This handler needs to correctly update newRowData for all input types
    const handleNewRowInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Special handling for the 'Tahun' column: its display name is 'tahun', but the payload key is 'siakTahunAjaranId'
        const fieldName = name === 'siakTahunAjaranId' ? 'siakTahunAjaranId' : name; // Ensure name matches the payload field
        setNewRowData(prev => ({ ...prev, [fieldName as keyof IPeriodPayload]: value }));
    };


    const handleSaveNew = async () => {
        // Basic validation for required fields
        if (!newRowData.siakTahunAjaranId || !newRowData.namaPeriode || !newRowData.kodePeriode || !newRowData.tanggalMulai || !newRowData.tanggalSelesai) {
            alert("Semua field harus diisi!");
            return;
        }
        try {
            await createPeriod(newRowData);
            setIsAddingNewRow(false); // Hide the form row
            alert("Periode berhasil ditambahkan!");
            // React Query's invalidateQueries in hook will refetch the list
        } catch (err: any) {
            console.error("Error saving new period:", err);
            alert(`Gagal menambahkan periode: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
        }
    };

    const handleCancelAdd = () => {
        setIsAddingNewRow(false);
        setNewRowData({ siakTahunAjaranId: "", namaPeriode: "", kodePeriode: "", tanggalMulai: "", tanggalSelesai: "" });
    };

    // --- Handlers for Edit Inline Form ---
    const handleEditClick = (id: string) => {
        // If already editing this row, cancel. Otherwise, start editing.
        if (editingRowId === id) {
            handleCancelEdit();
        } else {
            const periodToEdit = periods.find(period => period.id === id);
            if (periodToEdit) {
                setEditingRowId(id);
                // When editing, we need the 'siakTahunAjaranId' for the 'Tahun' dropdown.
                // The API gives us 'periodToEdit.tahun' (the name), so we find the corresponding ID.
                const selectedYearId = academicYears.find(year => year.nama === periodToEdit.tahun)?.id || "";

                setEditedRowData({
                    siakTahunAjaranId: selectedYearId, // Set the ID for the dropdown
                    namaPeriode: periodToEdit.namaPeriode,
                    kodePeriode: periodToEdit.kodePeriode,
                    tanggalMulai: periodToEdit.tanggalMulai,
                    tanggalSelesai: periodToEdit.tanggalSelesai,
                });
                setIsAddingNewRow(false); // Hide add row if it was visible
            }
        }
    };

    // This handler needs to correctly update editedRowData for all input types
    const handleEditedRowInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Special handling for the 'Tahun' column: its display name is 'tahun', but the payload key is 'siakTahunAjaranId'
        const fieldName = name === 'siakTahunAjaranId' ? 'siakTahunAjaranId' : name; // Ensure name matches the payload field
        setEditedRowData(prev => ({ ...prev, [fieldName as keyof IPeriodPayload]: value }));
    };


    const handleSaveEdit = async () => {
        if (!editingRowId || !editedRowData.siakTahunAjaranId || !editedRowData.namaPeriode || !editedRowData.kodePeriode || !editedRowData.tanggalMulai || !editedRowData.tanggalSelesai) {
            alert("Semua field harus diisi untuk mengedit.");
            return;
        }
        try {
            await updatePeriod({ id: editingRowId, payload: editedRowData });
            setEditingRowId(null); // Exit edit mode
            alert("Periode berhasil diperbarui!");
            // React Query's invalidateQueries in hook will refetch the list
        } catch (err: any) {
            console.error("Error saving edited period:", err);
            alert(`Gagal memperbarui periode: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
        }
    };

    const handleCancelEdit = () => {
        setEditingRowId(null);
        setEditedRowData({ siakTahunAjaranId: "", namaPeriode: "", kodePeriode: "", tanggalMulai: "", tanggalSelesai: "" });
    };

    // --- Handler for Delete Button ---
    const handleDeleteClick = async (id: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus periode ini?")) {
            try {
                await deletePeriod(id);
                alert("Periode berhasil dihapus!");
            } catch (err: any) {
                console.error("Error deleting period:", err);
                alert(`Gagal menghapus periode: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
            }
        }
    };

    return (
        <MainLayout titlePage={"Periode Akademik"} isGreeting={false}>
            <div className="w-full mx-auto mt-2 bg-white py-2 rounded-sm border-t-2 border-primary-green">
                <div className="flex justify-between">
                    <div className="flex gap-4 p-2">
                        {/* Status Filter (you can extend this to connect to API) */}
                        <select className="rounded px-1 lg:px-3 lg:text-base appearance-none text-primary-brown text-xs border-slate-300 border p-1">
                            <option value={"semua"}>-Semua-</option>
                            <option value={"ACTIVE"}>Aktif</option>
                            <option value={"INACTIVE"}>Nonaktif</option>
                        </select>
                        <div className="flex">
                            <input
                                type="search"
                                placeholder="Cari Periode"
                                className="px-2 py-1 lg:w-70 w-40 text-xs lg:text-base rounded border border-slate-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                className="bg-primary-yellow mx-1 w-8 rounded flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                                onClick={() => refetch()}
                                disabled={isLoading || isCreating || isUpdating || isDeleting || isLoadingYears} // Disable if periods or years are loading
                            >
                                <Search color="white" size={18} />
                            </button>
                            <button
                                className="bg-primary-blueDark w-8 rounded flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                                onClick={() => {
                                    setSearchTerm("");
                                    setCurrentPage(1);
                                    setRowsPerPage(10);
                                    refetch();
                                }}
                                disabled={isLoading || isCreating || isUpdating || isDeleting || isLoadingYears}
                            >
                                <RefreshCw color="white" size={20} />
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleAddClick}
                        className="bg-primary-green cursor-pointer my-2 mr-4 text-sm text-white px-4 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isAddingNewRow || editingRowId !== null || isLoading || isCreating || isUpdating || isDeleting || isLoadingYears}
                    >
                        <Plus color="white" size={16} className="mr-2" />
                        Tambah
                    </button>
                </div>

                {/* Conditional rendering based on loading, error, and data presence */}
                {isLoading || isLoadingYears ? ( // Show loading if periods OR academic years are loading
                    <p className="text-center p-4">Memuat data periode akademik...</p>
                ) : isError ? (
                    <p className="text-center p-4 text-red-500">Error: {error?.message || "Gagal memuat periode akademik."}</p>
                ) : yearsError ? ( // Show error if fetching academic years failed
                    <p className="text-center p-4 text-red-500">Error: {yearsError?.message || "Gagal memuat tahun ajaran untuk dropdown."}</p>
                ) : (
                    <TableSetting<IPeriod> // Pass the generic type IPeriod
                        columns={periodColumns} // Pass the columns definition
                        data={periods} // Pass the fetched periods data
                        error={periods.length === 0 ? "Tidak ada data periode akademik yang ditemukan." : null}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        isAddingNewRow={isAddingNewRow}
                        editingRowId={editingRowId}
                        newRowData={newRowData}
                        editedRowData={editedRowData}
                        onNewRowInputChange={handleNewRowInputChange}
                        onEditedRowInputChange={handleEditedRowInputChange}
                        onSaveNew={handleSaveNew}
                        onCancelAdd={handleCancelAdd}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                        isSavingOrUpdating={isCreating || isUpdating}
                        isDeleting={isDeleting}
                    />
                )}

                {pagination && (
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={(page) => {
                            setCurrentPage(page);
                        }}
                        rowsPerPage={pagination.perPage}
                        totalRows={pagination.totalItems}
                        onRowsPerPageChange={(rows) => {
                            setRowsPerPage(rows);
                            setCurrentPage(1);
                        }}
                    />
                )}
            </div>
        </MainLayout>
    );
};

export default PeriodAdminAcademic;