import React from "react";
import { Trash2, Pencil, Save, X } from "lucide-react";

// Pastikan semua tipe yang diperlukan diimpor
import {
    ITableColumn,
    TableFormPayload,
    IOption,
    IGradeCompositionPayload,
    IGradeComposition
} from "../../../types/models";

// Update the interface to include the new fixedComponents and newCompositionsData props
interface TableSettingProps<T extends { id: string }> {
    columns: ITableColumn<T>[];
    data: T[];
    error: string | null;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    isAddingNewRow: boolean; // Renamed from isAddingNewSet for generic use
    editingRowId: string | null;
    newRowData: TableFormPayload;
    editedRowData: TableFormPayload;
    // Handler untuk input berubah pada baris baru (bisa untuk set komposisi atau baris biasa)
    onNewRowInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, componentName?: IGradeCompositionPayload['nama']) => void;
    // Handler untuk input berubah pada baris yang diedit
    onEditedRowInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSaveNew: () => void;
    onCancelAdd: () => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    isSavingOrUpdating: boolean;
    isDeleting: boolean;
    // Props khusus untuk CompositionAdminAcademic yang mengelola 4 komponen tetap
    fixedComponents?: IGradeComposition['nama'][];
    newCompositionsData?: IGradeCompositionPayload[];
}

function TableSetting<T extends { id: string }>({
                                                    columns,
                                                    data,
                                                    error,
                                                    onEdit,
                                                    onDelete,
                                                    isAddingNewRow,
                                                    editingRowId,
                                                    newRowData,
                                                    editedRowData,
                                                    onNewRowInputChange,
                                                    onEditedRowInputChange,
                                                    onSaveNew,
                                                    onCancelAdd,
                                                    onSaveEdit,
                                                    onCancelEdit,
                                                    isSavingOrUpdating,
                                                    isDeleting,
                                                    fixedComponents,
                                                    newCompositionsData,
                                                }: TableSettingProps<T>) {

    const renderInput = (
        column: ITableColumn<T>,
        // dataRow adalah objek data asli, formData adalah state form (new/edited)
        dataRow: T | TableFormPayload, // Data row ini digunakan untuk tampilan default
        formData: TableFormPayload, // Ini adalah data yang benar-benar mengisi form input
        isNewRowForm: boolean = false,
        isEditingMode: boolean = false,
        componentNameForNewSet?: IGradeCompositionPayload['nama']
    ) => {
        // Tentukan nilai input yang benar dari formData berdasarkan konteks
        let inputValue: string | number = '';
        const nameAttribute = column.key === 'tahunAjaran' ? 'tahunAjaran' :
            column.key === 'programStudi' ? 'programStudi' :
                column.key === 'jenjang' ? 'jenjang' :
                    column.key; // Nama atribut 'name' untuk input/select

        // Logic untuk mendapatkan nilai dari state form (newCompositionsData, newRowData, editedRowData)
        if (isNewRowForm && fixedComponents && newCompositionsData && componentNameForNewSet) {
            // Kasus khusus untuk form tambah Komposisi Nilai (4 komponen tetap)
            const comp = newCompositionsData.find(c => c.nama === componentNameForNewSet);
            inputValue = comp ? comp.persentase : 0; // Diasumsikan kolom ini adalah persentase
        } else if (isEditingMode || isNewRowForm) {
            // Kasus umum untuk form edit atau tambah baris biasa
            // Handle mapping khusus untuk ID terkait dropdown (siakTahunAjaranId, siakProgramStudiId, siakJenjangId)
            if (column.key === 'tahunAjaran' && 'siakTahunAjaranId' in formData) {
                inputValue = (formData as any).siakTahunAjaranId;
            } else if (column.key === 'programStudi' && 'siakProgramStudiId' in formData) {
                inputValue = (formData as any).siakProgramStudiId;
            } else if (column.key === 'jenjang' && 'siakJenjangId' in formData) {
                inputValue = (formData as any).siakJenjangId;
            } else if (column.key in formData) {
                // Untuk properti lain yang ada di payload (nama, persentase, ipsMin, dll.)
                inputValue = (formData as any)[column.key] || '';
            }
        } else {
            // Tampilan normal (bukan form input) untuk kolom editable yang tidak dalam mode edit
            inputValue = (dataRow as any)[column.key] || '';
        }

        // Pastikan nilai adalah string untuk prop 'value' HTML input/select
        const displayValue = String(inputValue);

        // Jika kolom tidak editable dan tidak dalam mode form, langsung tampilkan teks
        if (!column.isEditable && !isNewRowForm && !isEditingMode) {
            return <span className="px-2 py-1 lg:text-sm text-xs text-primary-brown">{String((dataRow as any)[column.key] || '')}</span>;
        }

        // Render input atau select berdasarkan tipe kolom
        switch (column.inputType) {
            case 'text':
            case 'number':
            case 'email':
            case 'date':
                return (
                    <input
                        type={column.inputType}
                        name={nameAttribute as string} // Gunakan nama atribut yang sudah ditentukan
                        value={displayValue}
                        onChange={(e) => {
                            if (isNewRowForm && fixedComponents && newCompositionsData && componentNameForNewSet) {
                                // Untuk kasus khusus Komposisi Nilai (persentase)
                                (onNewRowInputChange as (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, name: IGradeCompositionPayload['nama']) => void)(e, componentNameForNewSet);
                            } else if (isNewRowForm) {
                                // Untuk kasus tambah baris generik
                                (onNewRowInputChange as (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void)(e);
                            } else {
                                // Untuk kasus edit baris
                                onEditedRowInputChange(e);
                            }
                        }}
                        className="w-full p-1 border rounded text-xs text-primary-brown"
                        disabled={isSavingOrUpdating}
                    />
                );
            case 'select':
                return (
                    <select
                        name={nameAttribute as string} // Gunakan nama atribut yang sudah ditentukan
                        value={displayValue}
                        onChange={(e) => {
                            if (isNewRowForm && fixedComponents && newCompositionsData && componentNameForNewSet) {
                                // Cabang ini seharusnya tidak terpanggil untuk select di fixedComponents
                            } else if (isNewRowForm) {
                                (onNewRowInputChange as (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void)(e);
                            } else {
                                onEditedRowInputChange(e);
                            }
                        }}
                        className="w-full p-1 border rounded text-xs text-primary-brown"
                        disabled={isSavingOrUpdating}
                    >
                        <option value="">-- Pilih --</option>
                        {column.options?.map((option: IOption) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );
            default:
                // Tampilan default jika kolom tidak editable atau tipe tidak ditangani
                return <span className="px-2 py-1 lg:text-sm text-xs text-primary-brown">{String((dataRow as any)[column.key] || '')}</span>;
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full my-4 border-collapse">
                <thead>
                <tr>
                    {columns.map((column) => (
                        <th
                            key={column.key.toString()} // Pastikan key adalah string
                            className="p-4 bg-primary-green text-white border border-gray-600"
                        >
                            <p className="font-semibold text-center">{column.header}</p>
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {/* Mengumpulkan semua baris (<tr>) ke dalam sebuah array */}
                {(() => {
                    const rows: JSX.Element[] = [];

                    // 1. Baris Error/No Data Awal (jika ada error atau tidak ada data dan tidak dalam mode tambah)
                    // Error ini akan muncul jika ada masalah query atau data kosong
                    if (error && (!data || data.length === 0) && !isAddingNewRow) {
                        rows.push(
                            <tr key="initial-error-row">
                                <td colSpan={columns.length} className="text-center py-4 text-red-500 border border-gray-300">
                                    {error}
                                </td>
                            </tr>
                        );
                    }

                    // 2. Form Tambah Baris Baru (General - digunakan jika tidak ada fixedComponents)
                    if (isAddingNewRow && !fixedComponents) {
                        rows.push(
                            <tr key="new-general-row" className="text-center">
                                {columns.map((column) => (
                                    <td key={column.key.toString()} className="p-2 border lg:text-sm text-xs border-gray-300">
                                        {column.key !== 'actions' ? renderInput(column, newRowData, newRowData, true, false) : (
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={onSaveNew}
                                                    className="bg-primary-green cursor-pointer rounded-sm flex items-center justify-center w-8 h-7 disabled:opacity-50"
                                                    disabled={isSavingOrUpdating}
                                                >
                                                    <Save size={16} className="text-white" />
                                                </button>
                                                <button
                                                    onClick={onCancelAdd}
                                                    className="bg-red-500 cursor-pointer rounded-sm flex items-center justify-center w-8 h-7 disabled:opacity-50"
                                                    disabled={isSavingOrUpdating}
                                                >
                                                    <X size={16} className="text-white" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        );
                    }

                    // 3. Form Tambah Baris Baru (Spesifik untuk CompositionAdminAcademic dengan fixedComponents)
                    if (isAddingNewRow && fixedComponents && newCompositionsData) {
                        fixedComponents.forEach((componentName, index) => {
                            rows.push(
                                <tr key={`new-comp-${componentName}`} className="text-center">
                                    <td className="p-2 border lg:text-sm text-xs border-gray-300 text-primary-brown"> {/* Styling untuk nama komponen */}
                                        {componentName}
                                    </td>
                                    <td className="p-2 border lg:text-sm text-xs border-gray-300">
                                        {/* Diasumsikan kolom kedua (indeks 1) adalah persentase */}
                                        {renderInput(
                                            columns.find(col => col.key === 'persentase') as ITableColumn<T>,
                                            {} as T, // dataRow dummy, karena data utama dari newCompositionsData
                                            newCompositionsData[index], // formData: ambil objek payload spesifik untuk komponen ini
                                            true, // isNewRowForm
                                            false, // isEditingMode
                                            componentName // componentNameForNewSet
                                        )}
                                    </td>
                                    {/* Tombol Aksi hanya di baris terakhir Komponen */}
                                    {index === fixedComponents.length - 1 ? (
                                        <td className="p-2 border lg:text-sm text-xs border-gray-300">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={onSaveNew}
                                                    className="bg-primary-green cursor-pointer rounded-sm flex items-center justify-center w-8 h-7 disabled:opacity-50"
                                                    disabled={isSavingOrUpdating}
                                                    title="Simpan Set Baru"
                                                >
                                                    <Save size={16} className="text-white" />
                                                </button>
                                                <button
                                                    onClick={onCancelAdd}
                                                    className="bg-red-400 cursor-pointer rounded-sm flex items-center justify-center w-8 h-7 disabled:opacity-50"
                                                    disabled={isSavingOrUpdating}
                                                    title="Batal Tambah Set"
                                                >
                                                    <X size={16} className="text-white" />
                                                </button>
                                            </div>
                                        </td>
                                    ) : (
                                        <td className="p-2 border lg:text-sm text-xs border-gray-300"></td> // Sel kosong
                                    )}
                                </tr>
                            );
                        });
                    }

                    // 4. Baris Data Yang Sudah Ada
                    if (data && data.length > 0) {
                        data.forEach((row) => {
                            rows.push(
                                <tr key={row.id} className="text-center">
                                    {columns.map((column) => (
                                        <td
                                            key={`${row.id}-${column.key.toString()}`} // Pastikan key adalah string
                                            className="p-2 border lg:text-sm text-xs border-gray-300"
                                        >
                                            {/* Jika baris ini sedang diedit dan kolomnya editable */}
                                            {editingRowId === row.id && column.isEditable ? (
                                                renderInput(column, row, editedRowData, false, true) // isNewRowForm=false, isEditingMode=true
                                            ) : column.key !== 'actions' ? (
                                                // Tampilan teks biasa untuk kolom data
                                                <span className="px-2 py-1 lg:text-sm text-xs text-primary-brown">
                              {(row as any)[column.key]?.toString() || ''}
                          </span>
                                            ) : (
                                                // Kolom Tombol Aksi
                                                <div className="flex items-center justify-center space-x-2">
                                                    {editingRowId === row.id ? (
                                                        // Tombol Simpan/Batal saat mengedit
                                                        <>
                                                            <button
                                                                onClick={onSaveEdit}
                                                                className="bg-primary-green cursor-pointer rounded-sm flex items-center justify-center w-8 h-7 disabled:opacity-50"
                                                                disabled={isSavingOrUpdating}
                                                                title="Simpan Perubahan"
                                                            >
                                                                <Save size={16} className="text-white" />
                                                            </button>
                                                            <button
                                                                onClick={onCancelEdit}
                                                                className="bg-red-400 cursor-pointer rounded-sm flex items-center justify-center w-8 h-7 disabled:opacity-50"
                                                                disabled={isSavingOrUpdating}
                                                                title="Batal Edit"
                                                            >
                                                                <X size={16} className="text-white" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        // Tombol Edit/Hapus saat tidak mengedit
                                                        <>
                                                            <button
                                                                onClick={() => onEdit(row.id)}
                                                                className="bg-primary-yellow cursor-pointer rounded-sm flex items-center justify-center w-8 h-7 disabled:opacity-50"
                                                                disabled={isSavingOrUpdating || isDeleting}
                                                                title="Edit"
                                                            >
                                                                <Pencil size={16} className="text-white" />
                                                            </button>
                                                            <button
                                                                onClick={() => onDelete(row.id)} // Untuk Komposisi, ini menghapus seluruh set
                                                                className="bg-red-400 cursor-pointer rounded-sm flex items-center justify-center w-8 h-7 disabled:opacity-50"
                                                                disabled={isSavingOrUpdating || isDeleting}
                                                                title="Hapus Set Komposisi"
                                                            >
                                                                <Trash2 size={16} className="text-white" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        });
                    }

                    // 5. Baris "Tidak ada data." (Jika tidak ada data dan tidak dalam mode tambah)
                    if (data.length === 0 && !isAddingNewRow && (!error || error === "Tidak ada data.")) {
                        rows.push(
                            <tr key="no-data-row">
                                <td colSpan={columns.length} className="text-center p-2 border border-gray-300">
                                    {error || "Tidak ada data."}
                                </td>
                            </tr>
                        );
                    }

                    return rows;
                })()}
                </tbody>
            </table>
        </div>
    );
}

export default TableSetting;