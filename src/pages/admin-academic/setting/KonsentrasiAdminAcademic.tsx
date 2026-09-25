import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import TableSetting from "../../../components/admin-academic/setting/TableSetting";
import { Plus } from "lucide-react";
import { getProdi } from "../../../hooks/academic/useProdi";
import { useKonsentrasi } from "../../../hooks/admin-akademik/useKonsentrasi";
import { ITableColumn, IKonsentrasi, IKonsentrasiPayload } from "../../../types/models";

const buildEmptyPayload = (siakProgramStudiId: string): IKonsentrasiPayload => ({
    siakProgramStudiId,
    kode: "",
    nama: "",
});

const columns: ITableColumn<IKonsentrasi>[] = [
    { key: "kode", header: "Kode", isEditable: true, inputType: "text" },
    { key: "nama", header: "Nama Konsentrasi", isEditable: true, inputType: "text" },
    { key: "actions", header: "Aksi" },
];

const KonsentrasiAdminAcademic: React.FC = () => {
    const [selectedProgramStudiId, setSelectedProgramStudiId] = useState("");
    const { data: prodiData = [] } = getProdi();

    const {
        data,
        isLoading,
        isError,
        error,
        create,
        isCreating,
        update,
        isUpdating,
        remove,
        isDeleting,
    } = useKonsentrasi(selectedProgramStudiId);

    const [isAddingNewRow, setIsAddingNewRow] = useState(false);
    const [editingRowId, setEditingRowId] = useState<string | null>(null);
    const [newRowData, setNewRowData] = useState<IKonsentrasiPayload>(buildEmptyPayload(""));
    const [editedRowData, setEditedRowData] = useState<IKonsentrasiPayload>(buildEmptyPayload(""));

    const isPayloadValid = (payload: IKonsentrasiPayload) =>
        payload.kode.trim() !== "" && payload.nama.trim() !== "";

    const handleProgramStudiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProgramStudiId(e.target.value);
        setIsAddingNewRow(false);
        setEditingRowId(null);
    };

    const handleNewRowInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewRowData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditedRowInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedRowData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddClick = () => {
        if (isAddingNewRow) {
            setIsAddingNewRow(false);
        } else {
            setNewRowData(buildEmptyPayload(selectedProgramStudiId));
            setIsAddingNewRow(true);
            setEditingRowId(null);
        }
    };

    const handleSaveNew = async () => {
        if (!isPayloadValid(newRowData)) {
            alert("Mohon lengkapi Kode dan Nama Konsentrasi!");
            return;
        }
        try {
            await create(newRowData);
            setIsAddingNewRow(false);
            alert("Konsentrasi berhasil ditambahkan!");
        } catch (err: any) {
            alert(`Gagal menambahkan Konsentrasi: ${err.response?.data?.message || err.message || "Terjadi kesalahan"}`);
        }
    };

    const handleCancelAdd = () => setIsAddingNewRow(false);

    const handleEditClick = (id: string) => {
        if (editingRowId === id) {
            setEditingRowId(null);
            return;
        }
        const row = data?.find((item) => item.id === id);
        if (row) {
            setEditedRowData({
                siakProgramStudiId: row.siakProgramStudiId,
                kode: row.kode,
                nama: row.nama,
            });
            setEditingRowId(id);
            setIsAddingNewRow(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!editingRowId || !isPayloadValid(editedRowData)) {
            alert("Mohon lengkapi Kode dan Nama Konsentrasi!");
            return;
        }
        try {
            await update({ id: editingRowId, payload: editedRowData });
            setEditingRowId(null);
            alert("Konsentrasi berhasil diperbarui!");
        } catch (err: any) {
            alert(`Gagal memperbarui Konsentrasi: ${err.response?.data?.message || err.message || "Terjadi kesalahan"}`);
        }
    };

    const handleCancelEdit = () => setEditingRowId(null);

    const handleDeleteClick = async (id: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus Konsentrasi ini?")) {
            try {
                await remove(id);
                alert("Konsentrasi berhasil dihapus!");
            } catch (err: any) {
                alert(`Gagal menghapus Konsentrasi: ${err.response?.data?.message || err.message || "Terjadi kesalahan"}`);
            }
        }
    };

    return (
        <MainLayout titlePage="Konsentrasi" isGreeting={false}>
            <div className="max-w-4xl mx-auto bg-white p-4 rounded-xl shadow-xs border border-slate-200/80 border-t-4 border-t-primary-yellow mb-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="text-xs md:text-sm font-semibold text-slate-800 shrink-0">
                        Pilih Program Studi:
                    </span>
                    <select
                        className="px-3 py-2 text-xs md:text-sm font-medium border border-slate-300 rounded-lg text-slate-700 bg-white shadow-2xs focus:ring-1 focus:ring-primary-green focus:border-primary-green max-w-md w-full transition-all"
                        value={selectedProgramStudiId}
                        onChange={handleProgramStudiChange}
                    >
                        <option value="">-- Pilih Program Studi --</option>
                        {prodiData.map((prodi) => (
                            <option key={prodi.id} value={prodi.id}>
                                {prodi.namaProgramStudi}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedProgramStudiId && (
                <div className="max-w-4xl mx-auto mt-4 bg-white p-4 rounded-xl shadow-xs border border-slate-200/80 border-t-4 border-t-primary-green">
                    <div className="flex justify-end mb-4 pb-2 border-b border-slate-100">
                        <button
                            onClick={handleAddClick}
                            className="bg-primary-green hover:bg-[#0d5950] text-white px-4 py-2 rounded-lg text-xs md:text-sm font-medium flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isAddingNewRow || editingRowId !== null || isLoading || isCreating || isUpdating || isDeleting}
                        >
                            <Plus color="white" size={16} strokeWidth={2.5} />
                            <span>Tambah Konsentrasi</span>
                        </button>
                    </div>

                    {isLoading ? (
                        <p className="text-center p-4">Memuat data konsentrasi...</p>
                    ) : isError ? (
                        <p className="text-center p-4 text-red-500">Error: {error?.message || "Gagal memuat data Konsentrasi."}</p>
                    ) : (
                        <TableSetting<IKonsentrasi>
                            columns={columns}
                            data={data || []}
                            error={data && data.length === 0 ? "Tidak ada data konsentrasi yang ditemukan." : null}
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
            )}
        </MainLayout>
    );
};

export default KonsentrasiAdminAcademic;
