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
            case 'time':
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
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-primary-green focus:border-primary-green bg-white shadow-2xs"
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
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-primary-green focus:border-primary-green bg-white shadow-2xs"
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
                return <span className="px-2 py-1 lg:text-sm text-xs text-slate-700">{String((dataRow as any)[column.key] || '')}</span>;
        }
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200 my-2">
            <table className="w-full border-collapse text-left">
                <thead>
                <tr>
                    {columns.map((column) => (
                        <th
                            key={column.key.toString()}
                            className="py-3 px-4 bg-primary-green text-white text-xs md:text-sm font-semibold tracking-wider text-center"
                        >
                            {column.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {(() => {
                    const rows: JSX.Element[] = [];
                    if (error && (!data || data.length === 0) && !isAddingNewRow) {
                        rows.push(
                            <tr key="initial-error-row">
                                <td colSpan={columns.length} className="text-center py-8 text-slate-400 text-xs md:text-sm">
                                    {error}
                                </td>
                            </tr>
                        );
                    }
                    if (isAddingNewRow && !fixedComponents) {
                        rows.push(
                            <tr key="new-general-row" className="text-center bg-emerald-50/30">
                                {columns.map((column) => (
                                    <td key={column.key.toString()} className="py-2.5 px-3 lg:text-sm text-xs">
                                        {column.key !== 'actions' ? renderInput(column, newRowData, newRowData, true, false) : (
                                            <div className="flex items-center justify-center space-x-1.5">
                                                <button onClick={onSaveNew} className="bg-primary-green hover:bg-[#0d5950] text-white cursor-pointer rounded-lg flex items-center justify-center w-8 h-8 shadow-xs transition-transform active:scale-95 disabled:opacity-50" disabled={isSavingOrUpdating} title="Simpan">
                                                    <Save size={15} />
                                                </button>
                                                <button onClick={onCancelAdd} className="bg-slate-400 hover:bg-slate-500 text-white cursor-pointer rounded-lg flex items-center justify-center w-8 h-8 shadow-xs transition-transform active:scale-95 disabled:opacity-50" disabled={isSavingOrUpdating} title="Batal">
                                                    <X size={15} />
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
                                <tr key={row.id} className="text-center hover:bg-emerald-50/20 transition-colors">
                                    {columns.map((column) => (
                                        <td key={`${row.id}-${column.key.toString()}`} className="py-2.5 px-3 lg:text-sm text-xs text-slate-700 font-medium">
                                            {editingRowId === row.id && column.isEditable ? (
                                                renderInput(column, row, editedRowData, false, true)
                                            ) : column.key !== 'actions' ? (
                                                column.isBoolean ? (
                                                    <input
                                                        type="checkbox"
                                                        checked={(row as any)[column.key] === true || (row as any)[column.key] === 'true'}
                                                        disabled
                                                        readOnly
                                                        className="w-4 h-4 accent-primary-green align-middle"
                                                    />
                                                ) : (
                                                    <span className="px-2 py-1 text-slate-700">{(row as any)[column.key]?.toString() || ''}</span>
                                                )
                                            ) : (
                                                <div className="flex items-center justify-center space-x-1.5">
                                                    {editingRowId === row.id ? (
                                                        <>
                                                            <button onClick={onSaveEdit} className="bg-primary-green hover:bg-[#0d5950] text-white cursor-pointer rounded-lg flex items-center justify-center w-8 h-8 shadow-xs transition-transform active:scale-95 disabled:opacity-50" disabled={isSavingOrUpdating} title="Simpan Perubahan">
                                                                <Save size={15} />
                                                            </button>
                                                            <button onClick={onCancelEdit} className="bg-slate-400 hover:bg-slate-500 text-white cursor-pointer rounded-lg flex items-center justify-center w-8 h-8 shadow-xs transition-transform active:scale-95 disabled:opacity-50" disabled={isSavingOrUpdating} title="Batal Edit">
                                                                <X size={15} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button onClick={() => onEdit(row.id)} className="bg-primary-yellow hover:bg-[#e89012] text-white cursor-pointer rounded-lg flex items-center justify-center w-8 h-8 shadow-xs transition-transform active:scale-95 disabled:opacity-50" disabled={isSavingOrUpdating || isDeleting} title="Edit">
                                                                <Pencil size={15} />
                                                            </button>
                                                            <button onClick={() => onDelete(row.id)} className="bg-red-500 hover:bg-red-600 text-white cursor-pointer rounded-lg flex items-center justify-center w-8 h-8 shadow-xs transition-transform active:scale-95 disabled:opacity-50" disabled={isSavingOrUpdating || isDeleting} title="Hapus">
                                                                <Trash2 size={15} />
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
                                <td colSpan={columns.length} className="text-center py-8 text-slate-400 text-xs md:text-sm">Tidak ada data.</td>
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