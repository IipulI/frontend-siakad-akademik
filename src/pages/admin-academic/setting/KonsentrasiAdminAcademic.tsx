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
            <div className="w-full bg-white py-4 rounded-sm border-t-2 border-primary-yellow px-5 mb-6">
                <div className="flex items-center gap-2 w-full md:w-96">
                    <span className="whitespace-nowrap w-28 text-primary-yellow font-semibold">
                        Program Studi
                    </span>
                    <select
                        className="rounded px-3 py-2 border border-primary-brown flex-1"
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
                <div className="w-full bg-white py-2 rounded-sm border-t-2 border-primary-green">
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
