// src/pages/admin-academic/LimitSKSAdminAcademic.tsx
import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import TableSetting from "../../../components/admin-academic/setting/TableSetting";
import { Plus } from "lucide-react";
import { ILimitSKS, ILimitSKSPayload, ITableColumn, ILevel } from "../../../types/models";
import { useLimitSKS } from "../../../hooks/admin-akademik/useLimitSKS";
import { useLevels } from "../../../hooks/admin-akademik/useLevels";

const LimitSKSAdminAcademic: React.FC = () => {
    // --- Inline Form States ---
    const [isAddingNewRow, setIsAddingNewRow] = useState(false);
    const [editingRowId, setEditingRowId] = useState<string | null>(null);
    const [newRowData, setNewRowData] = useState<ILimitSKSPayload>({
        siakJenjangId: "",
        ipsMin: 0,
        ipsMax: 0,
        batasSks: 0,
    });
    const [editedRowData, setEditedRowData] = useState<ILimitSKSPayload>({
        siakJenjangId: "",
        ipsMin: 0,
        ipsMax: 0,
        batasSks: 0,
    });

    // --- API Hooks ---
    const {
        data: limitSKSList,
        isLoading,
        isError,
        error,
        createLimitSKS,
        isCreating,
        updateLimitSKS,
        isUpdating,
        deleteLimitSKS,
        isDeleting,
    } = useLimitSKS();

    const {
        data: levelsData,
        isLoading: isLoadingLevels,
        error: levelsError
    } = useLevels();

    const levels: ILevel[] = levelsData || [];

    // --- Prepare options for the 'Jenjang' dropdown ---
    const allJenjangOptions = levels.map(level => ({ // All available jenjangs
        value: level.id,
        label: level.nama
    }));

    // --- LOGIC TO FILTER DROPDOWN OPTIONS ---
    // 1. Identify Jenjang IDs that are currently used in existing SKS Limit rules
    const usedJenjangIds = new Set<string>();
    limitSKSList?.forEach(limitSKSItem => {
        // Find the ID of the jenjang based on its name from the levels list
        const jenjangLevel = levels.find(level => level.nama === limitSKSItem.jenjang);
        if (jenjangLevel) {
            usedJenjangIds.add(jenjangLevel.id);
        }
    });

    // 2. Filter options based on add/edit mode
    let jenjangDropdownOptions: { value: string; label: string; }[] = allJenjangOptions;

    if (isAddingNewRow) {
        // When adding a new row, only show jenjangs that are NOT yet used
        jenjangDropdownOptions = allJenjangOptions.filter(option => !usedJenjangIds.has(option.value));
    } else if (editingRowId !== null) {
        // When editing, show unused jenjangs AND the jenjang of the CURRENTLY edited row
        const currentEditingLimitSKS = limitSKSList?.find(item => item.id === editingRowId);
        const currentEditingJenjangId = currentEditingLimitSKS
            ? levels.find(level => level.nama === currentEditingLimitSKS.jenjang)?.id
            : null;

        jenjangDropdownOptions = allJenjangOptions.filter(option =>
            !usedJenjangIds.has(option.value) || // Include if not used by any other rule
            option.value === currentEditingJenjangId // OR if it's the jenjang of the rule currently being edited
        );
    }
    // If not in add/edit mode, `jenjangDropdownOptions` remains `allJenjangOptions` (its initial value)

    // --- Define Columns for Limit SKS Table ---
    const limitSKSColumns: ITableColumn<ILimitSKS>[] = [
        {
            key: 'jenjang',
            header: 'Jenjang',
            isEditable: true,
            inputType: 'select',
            options: jenjangDropdownOptions // <--- Pass the filtered options here!
        },
        { key: 'ipsMin', header: 'IPS Min', isEditable: true, inputType: 'number' },
        { key: 'ipsMax', header: 'IPS Max', isEditable: true, inputType: 'number' },
        { key: 'batasSks', header: 'Batas SKS', isEditable: true, inputType: 'number' },
        { key: 'actions', header: 'Aksi' }
    ];
    // --- END LOGIC TO FILTER DROPDOWN OPTIONS ---

    // --- Rest of your handlers (no changes needed here) ---
    const handleAddClick = () => {
        if (isAddingNewRow) { handleCancelAdd(); }
        else {
            setIsAddingNewRow(true);
            setNewRowData({ siakJenjangId: "", ipsMin: 0, ipsMax: 0, batasSks: 0 });
            setEditingRowId(null);
        }
    };

    const handleNewRowInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let parsedValue: string | number = value;
        if (name === 'ipsMin' || name === 'ipsMax' || name === 'batasSks') { parsedValue = parseFloat(value); if (isNaN(parsedValue)) parsedValue = 0; }
        const fieldName = name === 'jenjang' ? 'siakJenjangId' : name;
        setNewRowData(prev => ({ ...prev, [fieldName as keyof ILimitSKSPayload]: parsedValue }));
    };

    const handleSaveNew = async () => {
        if (!newRowData.siakJenjangId || newRowData.ipsMin === null || newRowData.ipsMax === null || newRowData.batasSks === null) {
            alert("Semua field harus diisi dengan benar!"); return;
        }
        try {
            await createLimitSKS(newRowData); setIsAddingNewRow(false); alert("Batas SKS berhasil ditambahkan!");
        } catch (err: any) {
            console.error("Error saving new SKS Limit:", err); alert(`Gagal menambahkan Batas SKS: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
        }
    };

    const handleCancelAdd = () => {
        setIsAddingNewRow(false); setNewRowData({ siakJenjangId: "", ipsMin: 0, ipsMax: 0, batasSks: 0 });
    };

    const handleEditClick = (id: string) => {
        if (editingRowId === id) { handleCancelEdit(); }
        else {
            const limitSKSItemToEdit = limitSKSList?.find(item => item.id === id);
            if (limitSKSItemToEdit) {
                setEditingRowId(id);
                const selectedJenjangId = levels.find(level => level.nama === limitSKSItemToEdit.jenjang)?.id || "";
                setEditedRowData({
                    siakJenjangId: selectedJenjangId, ipsMin: limitSKSItemToEdit.ipsMin,
                    ipsMax: limitSKSItemToEdit.ipsMax, batasSks: limitSKSItemToEdit.batasSks,
                });
                setIsAddingNewRow(false);
            }
        }
    };

    const handleEditedRowInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let parsedValue: string | number = value;
        if (name === 'ipsMin' || name === 'ipsMax' || name === 'batasSks') { parsedValue = parseFloat(value); if (isNaN(parsedValue)) parsedValue = 0; }
        const fieldName = name === 'jenjang' ? 'siakJenjangId' : name;
        setEditedRowData(prev => ({ ...prev, [fieldName as keyof ILimitSKSPayload]: parsedValue }));
    };

    const handleSaveEdit = async () => {
        if (!editingRowId || editedRowData.ipsMin === null || editedRowData.ipsMax === null || editedRowData.batasSks === null || !editedRowData.siakJenjangId) {
            alert("Semua field harus diisi dengan benar untuk mengedit."); return;
        }
        try {
            await updateLimitSKS({ id: editingRowId, payload: editedRowData }); setEditingRowId(null); alert("Batas SKS berhasil diperbarui!");
        } catch (err: any) {
            console.error("Error saving edited SKS Limit:", err); alert(`Gagal memperbarui Batas SKS: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
        }
    };

    const handleCancelEdit = () => {
        setEditingRowId(null); setNewRowData({ siakJenjangId: "", ipsMin: 0, ipsMax: 0, batasSks: 0 });
    };

    const handleDeleteClick = async (id: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus Batas SKS ini?")) {
            try {
                await deleteLimitSKS(id); alert("Batas SKS berhasil dihapus!");
            } catch (err: any) {
                console.error("Error deleting SKS Limit:", err); alert(`Gagal menghapus Batas SKS: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
            }
        }
    };


    return (
        <MainLayout titlePage={"Batas SKS"} isGreeting={false}>
            <div className="max-w-2xl mx-auto mt-2 bg-white py-2 rounded-sm border-t-2 border-primary-green">
                <div className="flex justify-end">
                    <button
                        onClick={handleAddClick}
                        className="bg-primary-green cursor-pointer py-2 mr-4 text-sm text-white px-4 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isAddingNewRow || editingRowId !== null || isLoading || isCreating || isUpdating || isDeleting || isLoadingLevels}
                    >
                        <Plus color="white" size={16} className="mr-2" />
                        Tambah
                    </button>
                </div>

                {/* Loading/Error/Data Display */}
                {isLoading || isLoadingLevels ? (
                    <p className="text-center p-4">Memuat data batas SKS...</p>
                ) : isError ? (
                    <p className="text-center p-4 text-red-500">Error: {error?.message || "Gagal memuat batas SKS."}</p>
                ) : levelsError ? (
                    <p className="text-center p-4 text-red-500">Error: {levelsError?.message || "Gagal memuat jenjang pendidikan untuk dropdown."}</p>
                ) : (
                    <TableSetting<ILimitSKS>
                        columns={limitSKSColumns}
                        data={limitSKSList || []}
                        error={limitSKSList && limitSKSList.length === 0 ? "Tidak ada data batas SKS yang ditemukan." : null}
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
            </div>
        </MainLayout>
    );
};

export default LimitSKSAdminAcademic;