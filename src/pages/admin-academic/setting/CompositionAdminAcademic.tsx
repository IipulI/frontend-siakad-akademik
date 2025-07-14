import React, { useState, useEffect, useMemo } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import TableSetting from "../../../components/admin-academic/setting/TableSetting";
import { Plus } from "lucide-react";
import FilterDropdown from "../../../components/admin-academic/FilterDropdown";
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate

// Import all necessary types
import {
    IAcademicYear,
    IGradeComposition,
    IGradeCompositionPayload,
    ITableColumn,
} from "../../../types/models";

// Import all necessary hooks
import { useAcademicYears } from "../../../hooks/admin-akademik/useAcademicYears";
import { useGradeCompositions } from "../../../hooks/admin-akademik/useGradeCompositions";

const CompositionAdminAcademic: React.FC = () => {
    const navigate = useNavigate(); // <-- Initialize useNavigate hook

    // --- Filter State ---
    const [selectedTahunKurikulumId, setSelectedTahunKurikulumId] = useState<string>("");

    // --- Inline Form States ---
    const [isAddingNewSet, setIsAddingNewSet] = useState(false);
    const [editingRowId, setEditingRowId] = useState<string | null>(null);

    const [newCompositionsData, setNewCompositionsData] = useState<IGradeCompositionPayload[]>([]);

    const [editedCompositionData, setEditedCompositionData] = useState<IGradeCompositionPayload>({
        siakTahunKurikulumId: "",
        nama: "Kehadiran",
        persentase: 0,
    });

    const fixedComponents: ('Kehadiran' | 'Tugas' | 'UTS' | 'UAS')[] = ['Kehadiran', 'Tugas', 'UTS', 'UAS'];

    // --- Effects for form reset on filter change ---
    useEffect(() => {
        if (isAddingNewSet) {
            setIsAddingNewSet(false);
            setNewCompositionsData([]);
        }
        if (editingRowId !== null) {
            setEditingRowId(null);
            setEditedCompositionData({ siakTahunKurikulumId: "", nama: "Kehadiran", persentase: 0 });
        }
    }, [selectedTahunKurikulumId]);


    // --- API Hooks - Fetching Lookup Data (Academic Years) ---
    const {
        data: yearsApiResponse,
        isLoading: isLoadingYears,
        error: yearsError
    } = useAcademicYears({ page: 1, limit: 100, search: '' });

    const academicYears: IAcademicYear[] = yearsApiResponse?.data || [];

    const academicYearOptions = academicYears.map(year => ({
        value: year.id,
        label: year.tahun
    }));

    // --- Main Data Query (Grade Compositions) ---
    const {
        data: gradeCompositions,
        isLoading: isLoadingCompositions,
        isError: isErrorCompositions,
        error: compositionsError,
        refetch,
        createGradeComposition,
        isCreating,
        updateGradeComposition,
        isUpdating,
        deleteGradeComposition,
        isDeleting,
    } = useGradeCompositions({
        tahunKurikulumId: selectedTahunKurikulumId,
    });

    const compositionsExistForSelectedYear = useMemo(() => {
        return gradeCompositions && gradeCompositions.length === fixedComponents.length;
    }, [gradeCompositions]);


    // --- Define Columns for Grade Composition Table ---
    const gradeCompositionColumns: ITableColumn<IGradeComposition>[] = [
        { key: 'nama', header: 'Komponen', isEditable: false, inputType: 'text' },
        { key: 'persentase', header: 'Persentase (%)', isEditable: true, inputType: 'number' },
        { key: 'actions', header: 'Aksi' }
    ];

    const tableData = useMemo(() => {
        if (!selectedTahunKurikulumId || isLoadingCompositions || isErrorCompositions || !gradeCompositions) {
            return [];
        }
        const dataMap = new Map<string, IGradeComposition>();
        gradeCompositions.forEach(comp => dataMap.set(comp.nama, comp));

        return fixedComponents.map(name => {
            const existing = dataMap.get(name);
            return existing || {
                id: `placeholder-${name}-${selectedTahunKurikulumId}`,
                nama: name,
                persentase: 0,
                siakTahunKurikulumId: selectedTahunKurikulumId,
            };
        });
    }, [gradeCompositions, selectedTahunKurikulumId, isLoadingCompositions, isErrorCompositions]);


    // --- Handlers for "Tambah Komposisi" (Add New Set) ---
    const handleAddClick = () => {
        if (!selectedTahunKurikulumId) {
            alert("Silakan pilih Tahun Kurikulum terlebih dahulu untuk menambahkan komposisi.");
            return;
        }
        if (compositionsExistForSelectedYear) {
            alert("Komposisi nilai untuk tahun ini sudah ada. Silakan gunakan tombol 'Edit' di samping persentase untuk mengubahnya.");
            return;
        }

        setIsAddingNewSet(true);
        setEditingRowId(null);

        setNewCompositionsData(fixedComponents.map(name => ({
            siakTahunKurikulumId: selectedTahunKurikulumId,
            nama: name,
            persentase: 0,
        })));
    };

    const handleNewSetInputChange = (e: React.ChangeEvent<HTMLInputElement>, componentName: IGradeCompositionPayload['nama']) => {
        const { value } = e.target;
        let parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) parsedValue = 0;
        if (parsedValue < 0) parsedValue = 0;

        setNewCompositionsData(prev =>
            prev.map(comp =>
                comp.nama === componentName ? { ...comp, persentase: parsedValue } : comp
            )
        );
    };

    const handleSaveNewSet = async () => {
        const totalPercentage = newCompositionsData.reduce((sum, comp) => sum + comp.persentase, 0);
        if (totalPercentage !== 100) {
            alert(`Total persentase harus 100%. Saat ini: ${totalPercentage}%`);
            return;
        }
        if (newCompositionsData.some(comp => comp.persentase === null || comp.persentase === undefined)) {
            alert("Semua persentase harus diisi.");
            return;
        }

        try {
            for (const comp of newCompositionsData) {
                await createGradeComposition(comp);
            }
            setIsAddingNewSet(false);
            alert("Komposisi nilai berhasil ditambahkan!");
            refetch();
        } catch (err: any) {
            console.error("Error saving new Grade Compositions set:", err);
            alert(`Gagal menambahkan Komposisi Nilai: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
        }
    };

    const handleCancelAddSet = () => {
        setIsAddingNewSet(false);
        setNewCompositionsData([]);
    };

    // --- Handlers for Edit Inline Form ---
    const handleEditClick = (id: string) => {
        if (editingRowId === id) {
            handleCancelEdit();
            return;
        }

        const compositionToEdit = gradeCompositions?.find(comp => comp.id === id);
        if (compositionToEdit) {
            setEditingRowId(id);
            setEditedCompositionData({
                siakTahunKurikulumId: selectedTahunKurikulumId,
                nama: compositionToEdit.nama,
                persentase: compositionToEdit.persentase,
            });
            setIsAddingNewSet(false);
        }
    };

    const handleEditedInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        let parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) parsedValue = 0;
        if (parsedValue < 0) parsedValue = 0;

        setEditedCompositionData(prev => ({ ...prev, persentase: parsedValue }));
    };

    const handleSaveEdit = async () => {
        if (!editingRowId || editedCompositionData.persentase === null || editedCompositionData.persentase === undefined) {
            alert("Persentase harus diisi dengan benar.");
            return;
        }

        const currentCompositions = gradeCompositions || [];
        const otherCompositionsTotal = currentCompositions
            .filter(comp => comp.id !== editingRowId)
            .reduce((sum, comp) => sum + comp.persentase, 0);

        const newTotalPercentage = otherCompositionsTotal + editedCompositionData.persentase;

        if (newTotalPercentage !== 100) {
            alert(`Total persentase harus 100%. Saat ini: ${newTotalPercentage}%`);
            return;
        }

        try {
            await updateGradeComposition({ id: editingRowId, payload: editedCompositionData });
            setEditingRowId(null);
            alert("Komposisi nilai berhasil diperbarui!");
            refetch();
        } catch (err: any) {
            console.error("Error saving edited Grade Composition:", err);
            alert(`Gagal memperbarui Komposisi Nilai: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
        }
    };

    const handleCancelEdit = () => {
        setEditingRowId(null);
        setEditedCompositionData({ siakTahunKurikulumId: "", nama: "Kehadiran", persentase: 0 });
    };

    // --- Handler for Delete Button (Deletes entire set of 4 components for the selected year) ---
    const handleDeleteClick = async (idOfAnyComponentInSet: string) => {
        if (!selectedTahunKurikulumId) {
            alert("Tidak dapat menghapus. Tahun Kurikulum belum dipilih.");
            return;
        }
        if (window.confirm("Apakah Anda yakin ingin menghapus SELURUH SET Komposisi Nilai untuk Tahun Kurikulum ini? Ini tidak bisa dibatalkan.")) {
            try {
                if (gradeCompositions) {
                    for (const comp of gradeCompositions) {
                        await deleteGradeComposition(comp.id);
                    }
                }
                alert("Seluruh set Komposisi Nilai berhasil dihapus!");
                refetch();
                setIsAddingNewSet(false);
            } catch (err: any) {
                console.error("Error deleting Grade Compositions set:", err);
                alert(`Gagal menghapus set Komposisi Nilai: ${err.response?.data?.message || err.message || 'Terjadi kesalahan'}`);
            }
        }
    };

    return (
        <MainLayout titlePage={"Komposisi Nilai"} isGreeting={false}>
            <div className="max-w-2xl mx-auto rounded-sm border-t-2 border-primary-yellow">
                <FilterDropdown
                    title="Tahun Kurikulum"
                    value={academicYearOptions.find(opt => opt.value === selectedTahunKurikulumId)?.label || "-- Pilih Tahun --"}
                    options={["-- Pilih Tahun --", ...academicYearOptions.map(opt => opt.label)]}
                    onSelect={(label) => {
                        const selectedId = academicYearOptions.find(opt => opt.label === label)?.value || "";
                        setSelectedTahunKurikulumId(selectedId);
                    }}
                />
            </div>

            <div className="max-w-2xl mx-auto mt-8 bg-white py-2 rounded-sm border-t-2 border-primary-green">
                <div className="flex justify-end pr-4">
                    {/* Show "Tambah Komposisi" button only if no compositions exist for the selected year */}
                    {!compositionsExistForSelectedYear && (
                        <button
                            onClick={handleAddClick}
                            className="bg-primary-green cursor-pointer py-2 text-sm text-white px-4 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isAddingNewSet || editingRowId !== null || isLoadingCompositions || isCreating || isUpdating || isDeleting || isLoadingYears || !selectedTahunKurikulumId}
                        >
                            <Plus color="white" size={16} className="mr-2" />
                            Tambah Komposisi
                        </button>
                    )}
                    {/* Show "Set Komposisi Mata Kuliah" button if compositions exist for the selected year */}
                    {compositionsExistForSelectedYear && (
                        <button
                            onClick={() => {
                                if (selectedTahunKurikulumId) {
                                    // Implement actual navigation using react-router-dom
                                    navigate("/admin-akademik/komposisi-nilai/set-komposisi-nilai-mata-kuliah", {
                                        state: { tahunKurikulumId: selectedTahunKurikulumId } // Pass context to next page
                                    });
                                } else {
                                    alert("Silakan pilih Tahun Kurikulum terlebih dahulu.");
                                }
                            }}
                            className="bg-primary-yellow cursor-pointer py-2 text-sm text-white  px-4 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!selectedTahunKurikulumId || isLoadingCompositions || isCreating || isUpdating || isDeleting || isLoadingYears}
                        >
                            Set Komposisi Mata Kuliah
                        </button>
                    )}
                </div>

                {/* Conditional rendering for loading/error/data */}
                {isLoadingYears || isLoadingCompositions ? (
                    <p className="text-center p-4">Memuat data komposisi nilai...</p>
                ) : yearsError ? (
                    <p className="text-center p-4 text-red-500">Error: {yearsError?.message || "Gagal memuat tahun kurikulum untuk dropdown."}</p>
                ) : isErrorCompositions && selectedTahunKurikulumId ? (
                    <p className="text-center p-4 text-red-500">Error: {compositionsError?.message || "Gagal memuat komposisi nilai."}</p>
                ) : !selectedTahunKurikulumId ? (
                    <p className="text-center p-4 text-gray-500">Silakan pilih Tahun Kurikulum untuk melihat atau menambahkan komposisi nilai.</p>
                ) : (
                    <>
                        <TableSetting<IGradeComposition>
                            columns={gradeCompositionColumns}
                            data={tableData}
                            error={tableData.length === 0 && !isAddingNewSet ? "Belum ada komposisi nilai untuk tahun ini. Silakan tambahkan." : null}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                            isAddingNewRow={isAddingNewSet} // This controls the special 4-row add form
                            editingRowId={editingRowId}
                            newRowData={{} as IGradeCompositionPayload} // Dummy, actual data in newCompositionsData
                            editedRowData={editedCompositionData} // For single component edit
                            onNewRowInputChange={handleNewSetInputChange} // Custom handler for new set
                            onEditedRowInputChange={handleEditedInputChange} // Generic handler for single edit
                            onSaveNew={handleSaveNewSet} // Custom handler for saving new set
                            onCancelAdd={handleCancelAddSet}
                            onSaveEdit={handleSaveEdit}
                            onCancelEdit={handleCancelEdit}
                            isSavingOrUpdating={isCreating || isUpdating}
                            isDeleting={isDeleting}
                            // Pass custom props for CompositionAdminAcademic's fixed component rendering
                            fixedComponents={fixedComponents}
                            newCompositionsData={newCompositionsData}
                        />
                        {/* Display total percentage validation dynamically below the table */}
                        {isAddingNewSet && (
                            <div className="text-right pr-4 pt-2 text-sm">
                                Total Persentase: <span className={newCompositionsData.reduce((sum, comp) => sum + comp.persentase, 0) === 100 ? "text-primary-green" : "text-red-500"}>
                  {newCompositionsData.reduce((sum, comp) => sum + comp.persentase, 0)}%
                </span>
                            </div>
                        )}
                        {editingRowId && (
                            <div className="text-right pr-4 pt-2 text-sm">
                                Total Persentase: <span className={(gradeCompositions || []).filter(comp => comp.id !== editingRowId).reduce((sum, comp) => sum + comp.persentase, 0) + editedCompositionData.persentase === 100 ? "text-primary-green" : "text-red-500"}>
                  {(gradeCompositions || []).filter(comp => comp.id !== editingRowId).reduce((sum, comp) => sum + comp.persentase, 0) + editedCompositionData.persentase}%
                </span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </MainLayout>
    );
};

export default CompositionAdminAcademic;