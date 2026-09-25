// src/components/admin-academic/setting/SimpleMasterDataPage.tsx
import React, { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import TableSetting from "./TableSetting";
import { Plus } from "lucide-react";
import { ITableColumn, IOption, TableFormPayload } from "../../../types/models";

export interface ISimpleFieldConfig<TPayload> {
    key: Extract<keyof TPayload, string>;
    header: string;
    inputType: 'text' | 'number' | 'time' | 'select';
    options?: IOption[];
    /** Field boolean yang direpresentasikan sebagai select "Ya"/"Tidak" di form. */
    boolean?: boolean;
}

interface SimpleMasterDataPageProps<T extends { id: string }, TPayload extends TableFormPayload> {
    titlePage: string;
    entityLabel: string;
    fields: ISimpleFieldConfig<TPayload>[];
    emptyPayload: TPayload;
    requiredKeys?: Extract<keyof TPayload, string>[];
    data: T[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null | undefined;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    onCreate: (payload: TPayload) => Promise<unknown>;
    onUpdate: (args: { id: string; payload: TPayload }) => Promise<unknown>;
    onDelete: (id: string) => Promise<unknown>;
}

const BOOLEAN_OPTIONS: IOption[] = [
    { value: 'true', label: 'Ya' },
    { value: 'false', label: 'Tidak' },
];

function SimpleMasterDataPage<T extends { id: string }, TPayload extends TableFormPayload>({
    titlePage,
    entityLabel,
    fields,
    emptyPayload,
    requiredKeys = [],
    data,
    isLoading,
    isError,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    onCreate,
    onUpdate,
    onDelete,
}: SimpleMasterDataPageProps<T, TPayload>) {
    const [isAddingNewRow, setIsAddingNewRow] = useState(false);
    const [editingRowId, setEditingRowId] = useState<string | null>(null);
    const [newRowData, setNewRowData] = useState<TPayload>(emptyPayload);
    const [editedRowData, setEditedRowData] = useState<TPayload>(emptyPayload);

    const findField = (key: string) => fields.find((f) => f.key === key);

    const columns: ITableColumn<T>[] = [
        ...fields.map((f) => ({
            key: f.key as unknown as keyof T,
            header: f.header,
            isEditable: true,
            inputType: f.inputType,
            options: f.boolean ? BOOLEAN_OPTIONS : f.options,
            isBoolean: f.boolean,
        })),
        { key: 'actions', header: 'Aksi' },
    ];

    const parseInputValue = (name: string, value: string): unknown => {
        const field = findField(name);
        if (field?.inputType === 'number') {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? 0 : parsed;
        }
        return value;
    };

    const handleNewRowInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewRowData((prev) => ({ ...prev, [name]: parseInputValue(name, value) }));
    };

    const handleEditedRowInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedRowData((prev) => ({ ...prev, [name]: parseInputValue(name, value) }));
    };

    const isPayloadValid = (payload: TPayload) =>
        requiredKeys.every((key) => {
            const value = (payload as any)[key];
            return value !== undefined && value !== null && String(value).trim() !== '';
        });

    /** Ubah field boolean (disimpan sbg string 'true'/'false' di form) kembali menjadi boolean asli. */
    const toSubmitPayload = (payload: TPayload): TPayload => {
        const result: any = { ...payload };
        fields.forEach((f) => {
            if (f.boolean) {
                result[f.key] = result[f.key] === true || result[f.key] === 'true';
            }
        });
        return result;
    };

    const buildFormDataFromRow = (row: T): TPayload => {
        const result: any = {};
        fields.forEach((f) => {
            const value = (row as any)[f.key];
            result[f.key] = f.boolean ? String(value) : value;
        });
        return result as TPayload;
    };

    const handleAddClick = () => {
        if (isAddingNewRow) {
            handleCancelAdd();
        } else {
            setIsAddingNewRow(true);
            setNewRowData(emptyPayload);
            setEditingRowId(null);
        }
    };

    const handleSaveNew = async () => {
        if (!isPayloadValid(newRowData)) {
            alert("Mohon lengkapi data yang wajib diisi!");
            return;
        }
        try {
            await onCreate(toSubmitPayload(newRowData));
            setIsAddingNewRow(false);
            alert(`${entityLabel} berhasil ditambahkan!`);
        } catch (err: any) {
            alert(`Gagal menambahkan ${entityLabel}: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
        }
    };

    const handleCancelAdd = () => {
        setIsAddingNewRow(false);
        setNewRowData(emptyPayload);
    };

    const handleEditClick = (id: string) => {
        if (editingRowId === id) {
            handleCancelEdit();
        } else {
            const rowToEdit = data?.find((row) => row.id === id);
            if (rowToEdit) {
                setEditingRowId(id);
                setEditedRowData(buildFormDataFromRow(rowToEdit));
                setIsAddingNewRow(false);
            }
        }
    };

    const handleSaveEdit = async () => {
        if (!editingRowId || !isPayloadValid(editedRowData)) {
            alert("Mohon lengkapi data yang wajib diisi!");
            return;
        }
        try {
            await onUpdate({ id: editingRowId, payload: toSubmitPayload(editedRowData) });
            setEditingRowId(null);
            alert(`${entityLabel} berhasil diperbarui!`);
        } catch (err: any) {
            alert(`Gagal memperbarui ${entityLabel}: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
        }
    };

    const handleCancelEdit = () => {
        setEditingRowId(null);
        setEditedRowData(emptyPayload);
    };

    const handleDeleteClick = async (id: string) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus ${entityLabel} ini?`)) {
            try {
                await onDelete(id);
                alert(`${entityLabel} berhasil dihapus!`);
            } catch (err: any) {
                alert(`Gagal menghapus ${entityLabel}: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
            }
        }
    };

    return (
        <MainLayout titlePage={titlePage} isGreeting={false}>
            <div className="max-w-4xl mx-auto mt-4 bg-white p-4 rounded-xl shadow-xs border border-slate-200/80 border-t-4 border-t-primary-green">
                <div className="flex justify-end mb-4 pb-2 border-b border-slate-100">
                    <button
                        onClick={handleAddClick}
                        className="bg-primary-green hover:bg-[#0d5950] text-white px-4 py-2 rounded-lg text-xs md:text-sm font-medium flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isAddingNewRow || editingRowId !== null || isLoading || isCreating || isUpdating || isDeleting}
                    >
                        <Plus color="white" size={16} strokeWidth={2.5} />
                        <span>Tambah {entityLabel}</span>
                    </button>
                </div>

                {isLoading ? (
                    <p className="text-center p-4">Memuat data {entityLabel.toLowerCase()}...</p>
                ) : isError ? (
                    <p className="text-center p-4 text-red-500">Error: {error?.message || `Gagal memuat data ${entityLabel}.`}</p>
                ) : (
                    <TableSetting<T>
                        columns={columns}
                        data={data || []}
                        error={data && data.length === 0 ? `Tidak ada data ${entityLabel.toLowerCase()} yang ditemukan.` : null}
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
}

export default SimpleMasterDataPage;
