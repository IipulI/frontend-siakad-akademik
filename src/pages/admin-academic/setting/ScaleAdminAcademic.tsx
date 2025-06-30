import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import TableSetting from "../../../components/admin-academic/setting/TableSetting";
import { Plus, Search, RefreshCw } from "lucide-react";
import { Pagination } from "../../../components/admin-academic/Pagination";
import FilterDropdown from "../../../components/admin-academic/FilterDropdown";

// Import all necessary types
import {
    IAcademicYear,
    IProgramStudi,
    IGradingScale,
    IGradingScalePayload,
    ITableColumn,
} from "../../../types/models";

// Import all necessary hooks
import { useAcademicYears } from "../../../hooks/admin-akademik/useAcademicYears";
import { useProgramStudi } from "../../../hooks/admin-akademik/useProgramStudi";
import { useGradingScales } from "../../../hooks/admin-akademik/useGradingScales";

const ScaleAdminAcademic: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [selectedTahunAjaranId, setSelectedTahunAjaranId] = useState<string>("");
    const [selectedProgramStudiId, setSelectedProgramStudiId] = useState<string>("");

    const [isAddingNewRow, setIsAddingNewRow] = useState(false);
    const [editingRowId, setEditingRowId] = useState<string | null>(null);
    const [newRowData, setNewRowData] = useState<IGradingScalePayload>({
        siakTahunAjaranId: "",
        siakProgramStudiId: "",
        hurufMutu: "",
        angkaMutu: 0,
        nilaiMin: 0,
        nilaiMax: 0,
    });
    const [editedRowData, setEditedRowData] = useState<IGradingScalePayload>({
        siakTahunAjaranId: "",
        siakProgramStudiId: "",
        hurufMutu: "",
        angkaMutu: 0,
        nilaiMin: 0,
        nilaiMax: 0,
    });

    useEffect(() => {
        if (isAddingNewRow) {
            setIsAddingNewRow(false);
            setNewRowData({ siakTahunAjaranId: "", siakProgramStudiId: "", hurufMutu: "", angkaMutu: 0, nilaiMin: 0, nilaiMax: 0 });
        }
        if (editingRowId !== null) {
            setEditingRowId(null);
            setEditedRowData({ siakTahunAjaranId: "", siakProgramStudiId: "", hurufMutu: "", angkaMutu: 0, nilaiMin: 0, nilaiMax: 0 });
        }
    }, [selectedTahunAjaranId, selectedProgramStudiId, currentPage, rowsPerPage]);


    const {
        data: yearsApiResponse,
        isLoading: isLoadingYears,
        error: yearsError
    } = useAcademicYears({ page: 1, limit: 100, search: '' });

    const {
        data: programStudiList,
        isLoading: isLoadingProgramStudi,
        error: programStudiError
    } = useProgramStudi();

    const academicYears: IAcademicYear[] = yearsApiResponse?.data || [];
    const programStudis: IProgramStudi[] = programStudiList || [];

    const academicYearOptions = academicYears.map(year => ({
        value: year.id,
        label: year.tahun
    }));

    const programStudiOptions = programStudis.map(ps => ({
        value: ps.id,
        label: ps.namaProgramStudi
    }));

    // Derived filter names for useGradingScales hook
    const tahunAjaranFilterName = academicYears.find(year => year.id === selectedTahunAjaranId)?.tahun || '';
    const programStudiFilterName = programStudis.find(ps => ps.id === selectedProgramStudiId)?.namaProgramStudi || '';

    const {
        data: gradingScalesApiResponse,
        isLoading,
        isError,
        error,
        refetch,
        createGradingScale,
        isCreating,
        updateGradingScale,
        isUpdating,
        deleteGradingScale,
        isDeleting,
    } = useGradingScales({
        page: currentPage,
        limit: rowsPerPage,
        tahunAjaranName: tahunAjaranFilterName,
        programStudiName: programStudiFilterName,
    });

    const gradingScales: IGradingScale[] = gradingScalesApiResponse?.data || [];
    const pagination = gradingScalesApiResponse?.pagination;

    const gradingScaleColumns: ITableColumn<IGradingScale>[] = [
        {
            key: 'programStudi',
            header: 'Prodi',
            isEditable: true,
            inputType: 'select',
            options: programStudiOptions
        },
        { key: 'hurufMutu', header: 'Grade', isEditable: true, inputType: 'text' },
        { key: 'angkaMutu', header: 'Bobot', isEditable: true, inputType: 'number' },
        { key: 'nilaiMin', header: 'Nilai Bawah', isEditable: true, inputType: 'number' },
        { key: 'nilaiMax', header: 'Nilai Atas', isEditable: true, inputType: 'number' },
        { key: 'actions', header: 'Aksi' }
    ];

    const handleAddClick = () => {
        if (isAddingNewRow) { handleCancelAdd(); }
        else {
            setIsAddingNewRow(true);
            setNewRowData({ siakTahunAjaranId: "", siakProgramStudiId: "", hurufMutu: "", angkaMutu: 0, nilaiMin: 0, nilaiMax: 0 });
            setEditingRowId(null);
        }
    };

    const handleNewRowInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let parsedValue: string | number = value;

        if (['angkaMutu', 'nilaiMin', 'nilaiMax'].includes(name)) {
            parsedValue = parseFloat(value);
            if (isNaN(parsedValue)) parsedValue = 0;
        }

        const fieldName =
            name === 'tahunAjaran' ? 'siakTahunAjaranId' :
                name === 'programStudi' ? 'siakProgramStudiId' :
                    name;

        setNewRowData(prev => ({ ...prev, [fieldName as keyof IGradingScalePayload]: parsedValue }));
    };

    const handleSaveNew = async () => {
        if (!newRowData.siakTahunAjaranId || !newRowData.siakProgramStudiId || !newRowData.hurufMutu || newRowData.angkaMutu === null || newRowData.nilaiMin === null || newRowData.nilaiMax === null) {
            alert("Semua field harus diisi dengan benar!");
            return;
        }
        try {
            await createGradingScale(newRowData);
            setIsAddingNewRow(false);
            alert("Skala Penilaian berhasil ditambahkan!");
        } catch (err: any) {
            console.error("Error saving new Grading Scale:", err);
            alert(`Gagal menambahkan Skala Penilaian: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
        }
    };

    const handleCancelAdd = () => {
        setIsAddingNewRow(false);
        setNewRowData({ siakTahunAjaranId: "", siakProgramStudiId: "", hurufMutu: "", angkaMutu: 0, nilaiMin: 0, nilaiMax: 0 });
    };

    const handleEditClick = (id: string) => {
        if (editingRowId === id) { handleCancelEdit(); }
        else {
            const scaleToEdit = gradingScales.find(scale => scale.id === id);
            if (scaleToEdit) {
                setEditingRowId(id);
                const selectedYearId = academicYears.find(year => year.tahun === scaleToEdit.tahunAjaran)?.id || "";
                const selectedProgramStudiId = programStudis.find(ps => ps.namaProgramStudi === scaleToEdit.programStudi)?.id || "";

                setEditedRowData({
                    siakTahunAjaranId: selectedYearId,
                    siakProgramStudiId: selectedProgramStudiId,
                    hurufMutu: scaleToEdit.hurufMutu,
                    angkaMutu: scaleToEdit.angkaMutu,
                    nilaiMin: scaleToEdit.nilaiMin,
                    nilaiMax: scaleToEdit.nilaiMax,
                });
                setIsAddingNewRow(false);
            }
        }
    };

    const handleEditedRowInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let parsedValue: string | number = value;

        if (['angkaMutu', 'nilaiMin', 'nilaiMax'].includes(name)) {
            parsedValue = parseFloat(value);
            if (isNaN(parsedValue)) parsedValue = 0;
        }

        const fieldName =
            name === 'tahunAjaran' ? 'siakTahunAjaranId' :
                name === 'programStudi' ? 'siakProgramStudiId' :
                    name;

        setEditedRowData(prev => ({ ...prev, [fieldName as keyof IGradingScalePayload]: parsedValue }));
    };

    const handleSaveEdit = async () => {
        if (!editingRowId || !editedRowData.siakTahunAjaranId || !editedRowData.siakProgramStudiId || !editedRowData.hurufMutu || editedRowData.angkaMutu === null || editedRowData.nilaiMin === null || editedRowData.nilaiMax === null) {
            alert("Semua field harus diisi dengan benar untuk mengedit.");
            return;
        }
        try {
            await updateGradingScale({ id: editingRowId, payload: editedRowData });
            setEditingRowId(null);
            alert("Skala Penilaian berhasil diperbarui!");
        } catch (err: any) {
            console.error("Error saving edited Grading Scale:", err);
            alert(`Gagal memperbarui Skala Penilaian: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
        }
    };

    const handleCancelEdit = () => {
        setEditingRowId(null);
        setEditedRowData({ siakTahunAjaranId: "", siakProgramStudiId: "", hurufMutu: "", angkaMutu: 0, nilaiMin: 0, nilaiMax: 0 });
    };

    const handleDeleteClick = async (id: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus Skala Penilaian ini?")) {
            try {
                await deleteGradingScale(id);
                alert("Skala Penilaian berhasil dihapus!");
            } catch (err: any) {
                console.error("Error deleting Grading Scale:", err);
                alert(`Gagal menghapus Skala Penilaian: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
            }
        }
    };

    return (
        <MainLayout titlePage={"Skala Penilaian"} isGreeting={false}>
            <div className="flex max-w-2xl mx-auto mt-8 rounded-sm bg-white border-t-2 border-primary-yellow">
                <FilterDropdown
                    title="Tahun Kurikulum"
                    // CRITICAL FIX: Pass the selected filter's label as the 'value' prop
                    value={academicYearOptions.find(opt => opt.value === selectedTahunAjaranId)?.label || "-- Semua --"}
                    // Ensure "-- Semua --" is the first option in the actual options list
                    options={["-- Semua --", ...academicYearOptions.map(opt => opt.label)]}
                    onSelect={(label) => {
                        const selectedId = academicYearOptions.find(opt => opt.label === label)?.value || "";
                        setSelectedTahunAjaranId(selectedId);
                        setCurrentPage(1); // Reset to first page when filter changes
                    }}
                />
                <FilterDropdown
                    title="Prodi Pengampu"
                    // CRITICAL FIX: Pass the selected filter's label as the 'value' prop
                    value={programStudiOptions.find(opt => opt.value === selectedProgramStudiId)?.label || "-- Semua --"}
                    // Ensure "-- Semua --" is the first option in the actual options list
                    options={["-- Semua --", ...programStudiOptions.map(opt => opt.label)]}
                    onSelect={(label) => {
                        const selectedId = programStudiOptions.find(opt => opt.label === label)?.value || "";
                        setSelectedProgramStudiId(selectedId);
                        setCurrentPage(1); // Reset to first page when filter changes
                    }}
                />
            </div>


            <div className="max-w-2xl mx-auto mt-8 bg-white py-2 rounded-sm border-t-2 border-primary-green">
                <div className="flex justify-end">
                    <button
                        onClick={handleAddClick}
                        className="bg-primary-green cursor-pointer py-2 mr-4 text-sm text-white px-4 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isAddingNewRow || editingRowId !== null || isLoading || isCreating || isUpdating || isDeleting || isLoadingYears || isLoadingProgramStudi}
                    >
                        <Plus color="white" size={16} className="mr-2" />
                        Tambah
                    </button>
                </div>

                {isLoading || isLoadingYears || isLoadingProgramStudi ? (
                    <p className="text-center p-4">Memuat data skala penilaian...</p>
                ) : isError ? (
                    <p className="text-center p-4 text-red-500">Error: {error?.message || "Gagal memuat skala penilaian."}</p>
                ) : yearsError ? (
                    <p className="text-center p-4 text-red-500">Error: {yearsError?.message || "Gagal memuat tahun ajaran untuk dropdown."}</p>
                ) : programStudiError ? (
                    <p className="text-center p-4 text-red-500">Error: {programStudiError?.message || "Gagal memuat program studi untuk dropdown."}</p>
                ) : (
                    <TableSetting<IGradingScale>
                        columns={gradingScaleColumns}
                        data={gradingScales || []}
                        error={gradingScales && gradingScales.length === 0 ? "Tidak ada data skala penilaian yang ditemukan." : null}
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

export default ScaleAdminAcademic;