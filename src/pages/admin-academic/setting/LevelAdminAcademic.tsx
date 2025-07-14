// src/pages/admin-academic/LevelAdminAcademic.tsx
import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import TableSetting from "../../../components/admin-academic/setting/TableSetting";
import { Plus } from "lucide-react"; // Only Plus is needed here
import { ILevel, ILevelPayload, ITableColumn } from "../../../types/models"; // Import ILevel and ILevelPayload
import { useLevels } from "../../../hooks/admin-akademik/useLevels"; // Import the new hook

const LevelAdminAcademic: React.FC = () => {
    // --- Inline Form States ---
    const [isAddingNewRow, setIsAddingNewRow] = useState(false);
    const [editingRowId, setEditingRowId] = useState<string | null>(null);
    const [newRowData, setNewRowData] = useState<ILevelPayload>({ nama: "", jenjang: "" });
    const [editedRowData, setEditedRowData] = useState<ILevelPayload>({ nama: "", jenjang: "" });

    // --- API Hook ---
    const {
        data: levels, // This directly receives ILevel[] as the GET endpoint is not paginated
        isLoading,
        isError,
        error,
        refetch, // Function to re-fetch levels
        createLevel,
        isCreating,
        updateLevel,
        isUpdating,
        deleteLevel,
        isDeleting,
    } = useLevels(); // No parameters for this hook

    // --- Define Columns for Level Academic Table ---
    const levelColumns: ITableColumn<ILevel>[] = [
        { key: 'nama', header: 'Nama', isEditable: true, inputType: 'text' },
        { key: 'jenjang', header: 'Singkatan', isEditable: true, inputType: 'text' },
        { key: 'actions', header: 'Aksi' }
    ];

    // --- Handlers for "Tambah" (Add New Row) Button ---
    const handleAddClick = () => {
        if (isAddingNewRow) {
            handleCancelAdd();
        } else {
            setIsAddingNewRow(true);
            setNewRowData({ nama: "", jenjang: "" }); // Reset form
            setEditingRowId(null); // Ensure no row is in edit mode
        }
    };

    // This handler needs to correctly update newRowData for all input types
    const handleNewRowInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewRowData(prev => ({ ...prev, [name as keyof ILevelPayload]: value }));
    };

    const handleSaveNew = async () => {
        if (!newRowData.nama || !newRowData.jenjang) {
            alert("Nama and Singkatan cannot be empty!");
            return;
        }
        try {
            await createLevel(newRowData);
            setIsAddingNewRow(false); // Hide the form row
            alert("Jenjang Pendidikan berhasil ditambahkan!");
        } catch (err: any) {
            console.error("Error saving new level:", err);
            alert(`Gagal menambahkan Jenjang Pendidikan: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
        }
    };

    const handleCancelAdd = () => {
        setIsAddingNewRow(false);
        setNewRowData({ nama: "", jenjang: "" });
    };

    // --- Handlers for Edit Inline Form ---
    const handleEditClick = (id: string) => {
        if (editingRowId === id) {
            handleCancelEdit();
        } else {
            const levelToEdit = levels?.find(level => level.id === id); // Use 'levels' data from hook
            if (levelToEdit) {
                setEditingRowId(id);
                setEditedRowData({
                    nama: levelToEdit.nama,
                    jenjang: levelToEdit.jenjang,
                });
                setIsAddingNewRow(false); // Hide add row if it was visible
            }
        }
    };

    // This handler needs to correctly update editedRowData for all input types
    const handleEditedRowInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedRowData(prev => ({ ...prev, [name as keyof ILevelPayload]: value }));
    };

    const handleSaveEdit = async () => {
        if (!editingRowId || !editedRowData.nama || !editedRowData.jenjang) {
            alert("Nama and Singkatan cannot be empty for editing.");
            return;
        }
        try {
            await updateLevel({ id: editingRowId, payload: editedRowData });
            setEditingRowId(null); // Exit edit mode
            alert("Jenjang Pendidikan berhasil diperbarui!");
        } catch (err: any) {
            console.error("Error saving edited level:", err);
            alert(`Gagal memperbarui Jenjang Pendidikan: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
        }
    };

    const handleCancelEdit = () => {
        setEditingRowId(null);
        setEditedRowData({ nama: "", jenjang: "" });
    };

    // --- Handler for Delete Button ---
    const handleDeleteClick = async (id: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus Jenjang Pendidikan ini?")) {
            try {
                await deleteLevel(id);
                alert("Jenjang Pendidikan berhasil dihapus!");
            } catch (err: any) {
                console.error("Error deleting level:", err);
                alert(`Gagal menghapus Jenjang Pendidikan: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
            }
        }
    };

    return (
        <MainLayout titlePage={"Jenjang Pendidikan"} isGreeting={false}>
            <div className="max-w-2xl mx-auto mt-2 bg-white py-2 rounded-sm border-t-2 border-primary-green">
                <div className="flex justify-end">
                    <button
                        onClick={handleAddClick}
                        className="bg-primary-green cursor-pointer py-2 mr-4 text-sm text-white px-4 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isAddingNewRow || editingRowId !== null || isLoading || isCreating || isUpdating || isDeleting}
                    >
                        <Plus color="white" size={16} className="mr-2" />
                        Tambah
                    </button>
                </div>

                {isLoading ? (
                    <p className="text-center p-4">Memuat data jenjang pendidikan...</p>
                ) : isError ? (
                    <p className="text-center p-4 text-red-500">Error: {error?.message || "Gagal memuat jenjang pendidikan."}</p>
                ) : (
                    <TableSetting<ILevel> // Pass the generic type ILevel
                        columns={levelColumns} // Pass the columns definition
                        data={levels || []} // Pass the fetched levels data (ensure it's an array)
                        error={levels && levels.length === 0 ? "Tidak ada data jenjang pendidikan yang ditemukan." : null}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        isAddingNewRow={isAddingNewRow}
                        editingRowId={editingRowId}
                        newRowData={newRowData} // Correctly typed now
                        editedRowData={editedRowData} // Correctly typed now
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
            </div>
        </MainLayout>
    );
};

export default LevelAdminAcademic;