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
            <div className="max-w-2xl mx-auto mt-2 bg-white py-2 rounded-sm border-t-2 border-primary-green">
                <div className="flex justify-between">
                    <div className="flex gap-4 p-2">
                        <select className="rounded px-1 lg:px-3 lg:text-base appearance-none text-primary-brown text-xs border-slate-300 border p-1">
                            <option value={"semua"}>-Semua-</option>
                        </select>
                        <div className="flex">
                            <input
                                type="search"
                                placeholder="Cari Tahun Ajaran"
                                className="px-2 py-1 lg:w-70 w-40 text-xs lg:text-base rounded border border-slate-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                className="bg-primary-yellow mx-1 w-8 rounded flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                                onClick={() => refetch()}
                                disabled={isLoading || isCreating || isUpdating || isDeleting}
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
                                disabled={isLoading || isCreating || isUpdating || isDeleting}
                            >
                                <RefreshCw color="white" size={20} />
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleAddClick}
                        className="bg-primary-green cursor-pointer my-2 mr-4 text-sm text-white px-4 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isAddingNewRow || editingRowId !== null || isLoading || isCreating || isUpdating || isDeleting}
                    >
                        <Plus color="white" size={16} className="mr-2" />
                        Tambah
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

export default YearAdminAcademic;