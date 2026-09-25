import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import TableSetting from "../../../components/admin-academic/setting/TableSetting";
import { Plus, Search, RefreshCw } from "lucide-react";
import { Pagination } from "../../../components/admin-academic/Pagination";
import { useAcademicYears } from "../../../hooks/admin-akademik/useAcademicYears";
import { IAcademicYear, IAcademicYearPayload, ITableColumn } from "../../../types/models"; // Import ITableColumn

const YearAdminAcademic: React.FC = () => {
    // --- Pagination and Search States ---
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

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
            setNewRowData({ tahun: "", nama: "" });
        }
        if (editingRowId !== null) {
            setEditingRowId(null);
            setEditedRowData({ tahun: "", nama: "" });
        }
    }, [debouncedSearchTerm, currentPage, rowsPerPage]);

    // --- Inline Form States ---
    const [isAddingNewRow, setIsAddingNewRow] = useState(false);
    const [editingRowId, setEditingRowId] = useState<string | null>(null);
    const [newRowData, setNewRowData] = useState<IAcademicYearPayload>({ tahun: "", nama: "" });
    // IMPORTANT: editedRowData should be IAcademicYearPayload as it's the form data
    const [editedRowData, setEditedRowData] = useState<IAcademicYearPayload>({ tahun: "", nama: "" });

    // --- API Hook ---
    const {
        data: apiResponse,
        isLoading,
        isError,
        error,
        refetch,
        createAcademicYear,
        isCreating,
        updateAcademicYear,
        isUpdating,
        deleteAcademicYear,
        isDeleting,
    } = useAcademicYears({
        page: currentPage,
        limit: rowsPerPage,
        search: debouncedSearchTerm,
    });

    const academicYears: IAcademicYear[] = apiResponse?.data || [];
    const pagination = apiResponse?.pagination;

    // --- Define Columns for Academic Year Table ---
    const academicYearColumns: ITableColumn<IAcademicYear>[] = [
        { key: 'tahun', header: 'Tahun', isEditable: true, inputType: 'text' },
        { key: 'nama', header: 'Nama Tahun', isEditable: true, inputType: 'text' }, // Use 'nama' as key here
        { key: 'actions', header: 'Aksi' } // Special key 'actions' for action column
    ];


    // --- Handlers for New Row Form ---
    const handleAddClick = () => {
        if (isAddingNewRow) {
            handleCancelAdd();
        } else {
            setIsAddingNewRow(true);
            setNewRowData({ tahun: "", nama: "" });
            setEditingRowId(null);
        }
    };

    const handleNewRowInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewRowData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveNew = async () => {
        if (!newRowData.tahun || !newRowData.nama) {
            alert("Tahun and Nama Tahun cannot be empty!");
            return;
        }
        try {
            await createAcademicYear(newRowData);
            setIsAddingNewRow(false);
            alert("Tahun ajaran berhasil ditambahkan!");
        } catch (err: any) {
            console.error("Error saving new academic year:", err);
            alert(`Gagal menambahkan tahun ajaran: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
        }
    };

    const handleCancelAdd = () => {
        setIsAddingNewRow(false);
        setNewRowData({ tahun: "", nama: "" });
    };

    // --- Handlers for Edit Inline Form ---
    const handleEditClick = (id: string) => {
        if (editingRowId === id) {
            handleCancelEdit();
        } else {
            const yearToEdit = academicYears.find(year => year.id === id);
            if (yearToEdit) {
                setEditingRowId(id);
                // Populate editedRowData directly from the fetched IAcademicYear object
                setEditedRowData({
                    tahun: yearToEdit.tahun,
                    nama: yearToEdit.nama // Use 'nama' from API directly
                });
                setIsAddingNewRow(false);
            }
        }
    };

    const handleEditedRowInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // The 'name' attribute from input will directly match 'tahun' or 'nama'
        setEditedRowData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = async () => {
        if (!editingRowId || !editedRowData.tahun || !editedRowData.nama) {
            alert("All fields must be filled for editing.");
            return;
        }
        try {
            await updateAcademicYear({ id: editingRowId, payload: editedRowData });
            setEditingRowId(null);
            alert("Tahun ajaran berhasil diperbarui!");
        } catch (err: any) {
            console.error("Error saving edited academic year:", err);
            alert(`Gagal memperbarui tahun ajaran: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
        }
    };

    const handleCancelEdit = () => {
        setEditingRowId(null);
        setEditedRowData({ tahun: "", nama: "" });
    };

    // --- Handler for Delete Button ---
    const handleDeleteClick = async (id: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus tahun ajaran ini?")) {
            try {
                await deleteAcademicYear(id);
                alert("Tahun ajaran berhasil dihapus!");
            } catch (err: any) {
                console.error("Error deleting academic year:", err);
                alert(`Gagal menghapus tahun ajaran: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
            }
        }
    };

    return (
        <MainLayout titlePage={"Tahun Ajaran"} isGreeting={false}>
            <div className="max-w-4xl mx-auto mt-4 bg-white p-4 rounded-xl shadow-xs border border-slate-200/80 border-t-4 border-t-primary-green">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-2 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-3">
                        <select className="px-3 py-1.5 text-xs md:text-sm font-medium border border-slate-300 rounded-lg text-slate-700 bg-white shadow-2xs focus:ring-1 focus:ring-primary-green focus:border-primary-green transition-all">
                            <option value={"semua"}>-Semua-</option>
                        </select>
                        <div className="flex items-center">
                            <input
                                type="search"
                                placeholder="Cari Tahun Ajaran..."
                                className="px-3 py-1.5 lg:w-72 w-44 text-xs md:text-sm rounded-l-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-green focus:border-primary-green transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                className="bg-primary-yellow hover:bg-[#e89012] text-white px-3 py-1.5 h-[34px] flex items-center justify-center cursor-pointer disabled:cursor-not-allowed transition-all"
                                onClick={() => refetch()}
                                disabled={isLoading || isCreating || isUpdating || isDeleting}
                                title="Cari"
                            >
                                <Search color="white" size={16} strokeWidth={2.5} />
                            </button>
                            <button
                                className="bg-primary-blueDark hover:bg-[#2e42a8] text-white px-3 py-1.5 h-[34px] rounded-r-lg flex items-center justify-center cursor-pointer disabled:cursor-not-allowed transition-all"
                                onClick={() => {
                                    setSearchTerm("");
                                    setCurrentPage(1);
                                    setRowsPerPage(10);
                                    refetch();
                                }}
                                disabled={isLoading || isCreating || isUpdating || isDeleting}
                                title="Reset"
                            >
                                <RefreshCw color="white" size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleAddClick}
                        className="bg-primary-green hover:bg-[#0d5950] text-white px-4 py-2 rounded-lg text-xs md:text-sm font-medium flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isAddingNewRow || editingRowId !== null || isLoading || isCreating || isUpdating || isDeleting}
                    >
                        <Plus color="white" size={16} strokeWidth={2.5} />
                        <span>Tambah Tahun Ajaran</span>
                    </button>
                </div>

                {isLoading ? (
                    <p className="text-center p-4">Memuat data tahun ajaran...</p>
                ) : isError ? (
                    <p className="text-center p-4 text-red-500">Error: {error?.message || "Gagal memuat tahun ajaran."}</p>
                ) : (
                    <TableSetting<IAcademicYear> // Pass the generic type here
                        columns={academicYearColumns} // Pass the columns definition
                        data={academicYears} // Pass raw academicYears data directly
                        error={academicYears.length === 0 ? "Tidak ada data tahun ajaran yang ditemukan." : null}
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
                        totalPages={pagination.totalPage}
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

export default YearAdminAcademic;