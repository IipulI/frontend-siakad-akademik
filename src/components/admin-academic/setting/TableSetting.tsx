import React from "react";
import { Trash2, Pencil, Save, X } from "lucide-react";
import {
    ITableColumn,
    TableFormPayload,
    IOption,
    IGradeCompositionPayload,
    IGradeComposition
} from "../../../types/models";

interface TableSettingProps<T extends { id: string }> {
    columns: ITableColumn<T>[];
    data: T[];
    error: string | null;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    isAddingNewRow: boolean;
    editingRowId: string | null;
    newRowData: TableFormPayload;
    editedRowData: TableFormPayload;
    onNewRowInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, componentName?: IGradeCompositionPayload['nama']) => void;
    onEditedRowInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSaveNew: () => void;
    onCancelAdd: () => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
    isSavingOrUpdating: boolean;
    isDeleting: boolean;
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
        dataRow: T | TableFormPayload,
        formData: TableFormPayload,
        isNewRowForm: boolean = false,
        isEditingMode: boolean = false,
        componentNameForNewSet?: IGradeCompositionPayload['nama']
    ) => {
        let inputValue: string | number = '';
        const nameAttribute = column.key as string;

        if (isNewRowForm && fixedComponents && newCompositionsData && componentNameForNewSet) {
            const comp = newCompositionsData.find(c => c.nama === componentNameForNewSet);
            inputValue = comp ? comp.persentase : 0;
        } else if (isEditingMode || isNewRowForm) {
            // Logic to map display key to payload ID key
            if (column.key === 'tahun' && 'siakTahunAjaranId' in formData) {
                inputValue = (formData as any).siakTahunAjaranId;
            } else if (column.key === 'tahunAjaran' && 'siakTahunAjaranId' in formData) {
                inputValue = (formData as any).siakTahunAjaranId;
            } else if (column.key === 'programStudi' && 'siakProgramStudiId' in formData) {
                inputValue = (formData as any).siakProgramStudiId;
            } else if (column.key === 'jenjang' && 'siakJenjangId' in formData) {
                inputValue = (formData as any).siakJenjangId;
            } else if (column.key in formData) {
                inputValue = (formData as any)[column.key] || '';
            }
        } else {
            inputValue = (dataRow as any)[column.key] || '';
        }

        const displayValue = String(inputValue);

        if (!column.isEditable && !isNewRowForm && !isEditingMode) {
            return <span className="px-2 py-1 lg:text-sm text-xs text-primary-brown">{String((dataRow as any)[column.key] || '')}</span>;
        }

        switch (column.inputType) {
            case 'text':
            case 'number':
            case 'email':
            case 'date':
                return (
                    <input
                        type={column.inputType}
                        name={nameAttribute}
                        value={displayValue}
                        onChange={(e) => {
                            if (isNewRowForm && fixedComponents && newCompositionsData && componentNameForNewSet) {
                                (onNewRowInputChange as (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, name: IGradeCompositionPayload['nama']) => void)(e, componentNameForNewSet);
                            } else if (isNewRowForm) {
                                (onNewRowInputChange as (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void)(e);
                            } else {
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
                        name={nameAttribute}
                        value={displayValue}
                        onChange={(e) => {
                            if (isNewRowForm) {
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
                            key={column.key.toString()}
                            className="p-4 bg-primary-green text-white border border-gray-600"
                        >
                            <p className="font-semibold text-center">{column.header}</p>
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {(() => {
                    const rows: JSX.Element[] = [];
                    if (error && (!data || data.length === 0) && !isAddingNewRow) {
                        rows.push(
                            <tr key="initial-error-row">
                                <td colSpan={columns.length} className="text-center py-4 text-red-500 border border-gray-300">
                                    {error}
                                </td>
                            </tr>
                        );
                    }
                    if (isAddingNewRow && !fixedComponents) {
                        rows.push(
                            <tr key="new-general-row" className="text-center">
                                {columns.map((column) => (
                                    <td key={column.key.toString()} className="p-2 border lg:text-sm text-xs border-gray-300">
                                        {column.key !== 'actions' ? renderInput(column, newRowData, newRowData, true, false) : (
                                            <div className="flex items-center justify-center space-x-2">
                                                <button onClick={onSaveNew} className="bg-primary-green cursor-pointer rounded-sm flex items-center justify-center w-8 h-7 disabled:opacity-50" disabled={isSavingOrUpdating}>
                                                    <Save size={16} className="text-white" />
                                                </button>
                                                <button onClick={onCancelAdd} className="bg-red-500 cursor-pointer rounded-sm flex items-center justify-center w-8 h-7 disabled:opacity-50" disabled={isSavingOrUpdating}>
                                                    <X size={16} className="text-white" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        );
                    }
                    if (data && data.length > 0) {
                        data.forEach((row) => {
                            rows.push(
                                <tr key={row.id} className="text-center">
                                    {columns.map((column) => (
                                        <td key={`${row.id}-${column.key.toString()}`} className="p-2 border lg:text-sm text-xs border-gray-300">
                                            {editingRowId === row.id && column.isEditable ? (
                                                renderInput(column, row, editedRowData, false, true)
                                            ) : column.key !== 'actions' ? (
                                                <span className="px-2 py-1 lg:text-sm text-xs text-primary-brown">{(row as any)[column.key]?.toString() || ''}</span>
                                            ) : (
                                                <div className="flex items-center justify-center space-x-2">
                                                    {editingRowId === row.id ? (
                                                        <>
                                                            <button onClick={onSaveEdit} className="bg-primary-green cursor-pointer rounded-sm flex items-center justify-center w-8 h-7 disabled:opacity-50" disabled={isSavingOrUpdating} title="Simpan Perubahan">
                                                                <Save size={16} className="text-white" />
                                                            </button>
                                                            <button onClick={onCancelEdit} className="bg-red-400 cursor-pointer rounded-sm flex items-center justify-center w-8 h-7 disabled:opacity-50" disabled={isSavingOrUpdating} title="Batal Edit">
                                                                <X size={16} className="text-white" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button onClick={() => onEdit(row.id)} className="bg-primary-yellow cursor-pointer rounded-sm flex items-center justify-center w-8 h-7 disabled:opacity-50" disabled={isSavingOrUpdating || isDeleting} title="Edit">
                                                                <Pencil size={16} className="text-white" />
                                                            </button>
                                                            <button onClick={() => onDelete(row.id)} className="bg-red-400 cursor-pointer rounded-sm flex items-center justify-center w-8 h-7 disabled:opacity-50" disabled={isSavingOrUpdating || isDeleting} title="Hapus">
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
                    if (data.length === 0 && !isAddingNewRow && !error) {
                        rows.push(
                            <tr key="no-data-row">
                                <td colSpan={columns.length} className="text-center p-2 border border-gray-300">Tidak ada data.</td>
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