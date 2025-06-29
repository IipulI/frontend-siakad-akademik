import React, { useState, useMemo, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import FilterDropdown from "../../../components/admin-academic/FilterDropdown";
import {
    IAcademicYear,
    IProgramStudi,
    IGradeComposition,
    IOption,
    IMataKuliah,
    ISingleAssignmentPayload,
    IMataKuliahCompositionDetailsResponse,
} from "../../../types/models";
import { useAcademicYears } from "../../../hooks/admin-akademik/useAcademicYears";
import { useProgramStudi } from "../../../hooks/admin-akademik/useProgramStudi";
import { useGradeCompositions } from "../../../hooks/admin-akademik/useGradeCompositions";
import { useMataKuliahByProdiAndTahun } from "../../../hooks/admin-akademik/useMataKuliahByProdiAndTahun";
import { useAssignSingleComposition } from "../../../hooks/admin-akademik/useAssignSingleComposition";
import { useMataKuliahCompositionDetails } from "../../../hooks/admin-akademik/useMataKuliahCompositionDetails";
import { Plus, X } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { mataKuliahCompositionDetailsService } from '../../../api/admin-academic/mataKuliahCompositionDetailsService';

const fixedComponentNames: ('Kehadiran' | 'Tugas' | 'UTS' | 'UAS')[] = ['Kehadiran', 'Tugas', 'UTS', 'UAS'];

const SetCompositionAdminAcademic: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [selectedTahunKurikulumId, setSelectedTahunKurikulumId] = useState<string>("");
    const [selectedProgramStudiId, setSelectedProgramStudiId] = useState<string>("");
    const [selectedCompositionId, setSelectedCompositionId] = useState<string>("");
    const [addedComponentsToPreview, setAddedComponentsToPreview] = useState<IGradeComposition[]>([]);
    const [isAssigningMany, setIsAssigningMany] = useState<boolean>(false);
    const [isInitialLoadingExistingComposition, setIsInitialLoadingExistingComposition] = useState(false);

    // --- API HOOKS & DATA FETCHING ---
    const { data: yearsApiResponse, isLoading: isLoadingYears, error: yearsError } =
        useAcademicYears({ page: 1, limit: 100, search: '' });
    const academicYears: IAcademicYear[] = yearsApiResponse?.data || [];

    const { data: programStudiList, isLoading: isLoadingProgramStudi, error: programStudiError } =
        useProgramStudi();
    const programStudis: IProgramStudi[] = programStudiList || [];

    const { data: gradeCompositions, isLoading: isLoadingCompositions, error: compositionsError } =
        useGradeCompositions({ tahunKurikulumId: selectedTahunKurikulumId });
    const gradeCompositionsList: IGradeComposition[] = gradeCompositions || [];

    const selectedProgramStudiName = programStudis.find(ps => ps.id === selectedProgramStudiId)?.namaProgramStudi || '';
    const selectedTahunKurikulumName = academicYears.find(year => year.id === selectedTahunKurikulumId)?.tahun || '';

    const { data: mataKuliahListResponse, isLoading: isLoadingMataKuliah, error: mataKuliahError } =
        useMataKuliahByProdiAndTahun({
            programStudiName: selectedProgramStudiName,
            tahunKurikulumName: selectedTahunKurikulumName,
            size: 100
        });
    const mataKuliahs: IMataKuliah[] = mataKuliahListResponse || [];

    const firstMataKuliahId = mataKuliahs.length > 0 ? mataKuliahs[0].id : undefined;

    const { data: existingCompositionDetails, isLoading: isLoadingExistingCompositionDetails, error: existingCompositionError } =
        useMataKuliahCompositionDetails({
            mataKuliahId: firstMataKuliahId,
            enabled: !!firstMataKuliahId && !isAssigningMany && !isLoadingMataKuliah,
        });

    const mataKuliahCompositionsQueries = useQueries({
        queries: mataKuliahs.map(mk => ({
            queryKey: ['mataKuliahIndividualComposition', mk.id],
            queryFn: () => mataKuliahCompositionDetailsService.getMataKuliahComposition(mk.id),
            enabled: !!mk.id && !isAssigningMany && !isLoadingMataKuliah,
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
        })),
    });

    const { assignSingleComposition, isAssigningSingle, assignSingleError } = useAssignSingleComposition();

    // --- LOADING & ERROR STATES ---
    const isLoadingIndividualMataKuliahCompositions = mataKuliahCompositionsQueries.some(q => q.isLoading);
    const individualMataKuliahCompositionsErrors = mataKuliahCompositionsQueries.some(q => q.isError);
    const isLoadingOverall = isLoadingYears || isLoadingProgramStudi || isLoadingCompositions || isLoadingMataKuliah || isLoadingExistingCompositionDetails || isAssigningMany;
    const anyError = yearsError || programStudiError || compositionsError || mataKuliahError || existingCompositionError || assignSingleError || (individualMataKuliahCompositionsErrors ? new Error("Gagal memuat beberapa komposisi mata kuliah.") : null);

    // --- MEMOIZED VALUES & DERIVED STATE ---
    const academicYearOptions: IOption[] = useMemo(() => academicYears.map(year => ({ value: year.id, label: year.tahun })), [academicYears]);
    const programStudiOptions: IOption[] = useMemo(() => programStudis.map(ps => ({ value: ps.id, label: ps.namaProgramStudi })), [programStudis]);
    const compositionTemplateOptions: IOption[] = useMemo(() => gradeCompositionsList
        .filter(comp => fixedComponentNames.includes(comp.nama as any))
        .map(comp => ({ value: comp.id, label: `${comp.nama} (${comp.persentase}%)` })), [gradeCompositionsList]);

    const selectedTemplateDetails = useMemo(() => {
        return selectedCompositionId
            ? gradeCompositionsList.find(comp => comp.id === selectedCompositionId)
            : null;
    }, [selectedCompositionId, gradeCompositionsList]);

    const totalPercentageInPreview = useMemo(() => {
        return addedComponentsToPreview.reduce((sum, comp) => sum + comp.persentase, 0);
    }, [addedComponentsToPreview]);

    const allFixedComponentsPresent = useMemo(() => {
        const namesInPreview = new Set(addedComponentsToPreview.map(comp => comp.nama));
        return fixedComponentNames.every(name => namesInPreview.has(name));
    }, [addedComponentsToPreview]);

    // This is now safe because all dependencies are declared above
    const isSubmitButtonEnabled =
        !isLoadingOverall &&
        !isAssigningMany &&
        !isInitialLoadingExistingComposition &&
        !isLoadingIndividualMataKuliahCompositions &&
        !!selectedTahunKurikulumId &&
        !!selectedProgramStudiId &&
        addedComponentsToPreview.length === fixedComponentNames.length &&
        allFixedComponentsPresent &&
        totalPercentageInPreview === 100 &&
        mataKuliahs.length > 0;

    // --- SIDE EFFECTS ---
    useEffect(() => {
        setAddedComponentsToPreview([]);
        setSelectedCompositionId("");
    }, [selectedTahunKurikulumId, selectedProgramStudiId]);

    useEffect(() => {
        if (!isLoadingExistingCompositionDetails && existingCompositionDetails) {
            if (existingCompositionDetails.length > 0) {
                const transformedCompositions: IGradeComposition[] = existingCompositionDetails.map(detail => ({
                    id: detail.siakKomposisiNilaiId,
                    nama: detail.nama,
                    persentase: detail.persentase,
                    siakTahunKurikulumId: selectedTahunKurikulumId
                }));

                const namesInExisting = new Set(transformedCompositions.map(c => c.nama));
                const totalExistingPercentage = transformedCompositions.reduce((sum, comp) => sum + comp.persentase, 0);

                if (transformedCompositions.length === fixedComponentNames.length && fixedComponentNames.every(name => namesInExisting.has(name)) && totalExistingPercentage === 100) {
                    // Only set if the preview is empty to avoid overwriting user's manual changes
                    if (addedComponentsToPreview.length === 0) {
                        setAddedComponentsToPreview(transformedCompositions);
                    }
                }
            }
            setIsInitialLoadingExistingComposition(false);
        } else if (isLoadingExistingCompositionDetails) {
            setIsInitialLoadingExistingComposition(true);
        }
    }, [isLoadingExistingCompositionDetails, existingCompositionDetails, selectedTahunKurikulumId, addedComponentsToPreview.length]);


    // --- EVENT HANDLERS ---
    const handleAddCompositionToPreview = () => {
        if (!selectedTemplateDetails) {
            alert("Silakan pilih template komposisi terlebih dahulu dari dropdown.");
            return;
        }
        if (addedComponentsToPreview.some(comp => comp.nama === selectedTemplateDetails.nama)) {
            alert(`Komponen '${selectedTemplateDetails.nama}' sudah ada di tabel preview.`);
            return;
        }
        if (addedComponentsToPreview.length >= fixedComponentNames.length) {
            alert(`Anda hanya dapat menambahkan ${fixedComponentNames.length} komponen (Kehadiran, Tugas, UTS, UAS).`);
            return;
        }
        setAddedComponentsToPreview(prev => [...prev, selectedTemplateDetails]);
        setSelectedCompositionId("");
    };

    const handleRemoveCompositionFromPreview = (id: string) => {
        setAddedComponentsToPreview(prev => prev.filter(comp => comp.id !== id));
    };

    const handleAssignComposition = async () => {
        // Validation checks are now mostly handled by `isSubmitButtonEnabled`, but double-checking is fine.
        if (!isSubmitButtonEnabled) {
            alert("Harap penuhi semua kriteria sebelum menerapkan komposisi.");
            return;
        }

        if (!window.confirm(`Anda yakin ingin menerapkan set komposisi ini ke ${mataKuliahs.length} mata kuliah di Program Studi (${selectedProgramStudiName}) untuk Tahun Kurikulum (${selectedTahunKurikulumName})?`)) {
            return;
        }

        setIsAssigningMany(true);
        const errorDetails: string[] = [];
        let successfulAssignments = 0;
        let failedAssignments = 0;

        try {
            // PENTING: Implementasikan logika DELETE yang sesungguhnya di sini.
            // Kode di bawah ini mengasumsikan Anda memiliki service untuk menghapus.
            // Contoh: await mataKuliahCompositionDetailsService.deleteComposition(mataKuliah.id, existingDetail.id)
            alert("Memeriksa dan membersihkan komposisi lama (jika ada)...");
            for (const [index, mataKuliah] of mataKuliahs.entries()) {
                const existingComps = mataKuliahCompositionsQueries[index]?.data || [];
                if (existingComps.length > 0) {
                    for (const comp of existingComps) {
                        try {
                            // console.log(`AKAN MENGHAPUS: Komponen ${comp.nama} (ID Detail: ${comp.id_detail_komposisi_nilai}) dari MK ${mataKuliah.kodeMataKuliah}`);
                            // await yourDeleteApiService(comp.id_detail_komposisi_nilai); // Ganti dengan fungsi delete Anda
                        } catch (err) {
                            console.error(`Gagal menghapus komposisi lama: ${comp.nama} dari MK ${mataKuliah.kodeMataKuliah}`, err);
                        }
                    }
                }
            }

            alert("Memulai penerapan komposisi nilai baru...");
            for (const mataKuliah of mataKuliahs) {
                for (const component of addedComponentsToPreview) {
                    const payload: ISingleAssignmentPayload = {
                        siakMataKuliahId: mataKuliah.id,
                        siakKomposisiNilaiId: component.id,
                    };
                    try {
                        await assignSingleComposition(payload);
                        successfulAssignments++;
                    } catch (err: any) {
                        const errorMessage = `Gagal: ${component.nama} ke MK ${mataKuliah.kodeMataKuliah}. Error: ${err.message || 'Unknown'}`;
                        console.error(errorMessage, err);
                        failedAssignments++;
                        errorDetails.push(errorMessage);
                    }
                }
            }

            if (failedAssignments > 0) {
                alert(`Penerapan selesai dengan ${failedAssignments} kesalahan.\nBerhasil: ${successfulAssignments} penugasan.\nDetail kesalahan dapat dilihat di konsol.`);
                if (errorDetails.length > 0) {
                    console.error("Rincian Kesalahan Penerapan Komposisi:\n", errorDetails.join('\n'));
                }
            } else {
                alert("Komposisi nilai berhasil diterapkan secara massal ke semua mata kuliah!");
            }

            // Reset form
            setSelectedTahunKurikulumId("");
            setSelectedProgramStudiId("");
            setSelectedCompositionId("");
            setAddedComponentsToPreview([]);

        } catch (overallError: any) {
            console.error("Kesalahan umum selama proses assignment:", overallError);
            alert(`Terjadi kesalahan umum selama proses: ${overallError.message || 'Silakan cek konsol untuk detail.'}`);
        } finally {
            setIsAssigningMany(false);
        }
    };


    return (
        <MainLayout
            titlePage={"Set Komposisi Nilai Mata Kuliah"}
            isGreeting={false}
        >
            <div className="max-w-4xl mx-auto mt-8 flex bg-white py-4 rounded-sm border-t-2 border-primary-yellow shadow-md p-6">
                <FilterDropdown
                    title="Tahun Kurikulum"
                    options={["", ...academicYearOptions.map(opt => opt.label)]}
                    value={academicYearOptions.find(opt => opt.value === selectedTahunKurikulumId)?.label || ""}
                    onSelect={(label) => {
                        const selectedId = academicYearOptions.find(opt => opt.label === label)?.value || "";
                        setSelectedTahunKurikulumId(selectedId);
                        setSelectedCompositionId("");
                        setAddedComponentsToPreview([]);
                    }}
                />

                <FilterDropdown
                    title="Program Studi"
                    options={["", ...programStudiOptions.map(opt => opt.label)]}
                    value={programStudiOptions.find(opt => opt.value === selectedProgramStudiId)?.label || ""}
                    onSelect={(label) => {
                        const selectedId = programStudiOptions.find(opt => opt.label === label)?.value || "";
                        setSelectedProgramStudiId(selectedId);
                    }}
                />
            </div>
            <div className="max-w-4xl mx-auto mt-8 bg-white py-4 rounded-sm border-t-2 border-primary-green shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Pilih Komposisi Nilai</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-end gap-2">
                        <div className="flex-grow">
                            <FilterDropdown
                                title="Komposisi Nilai"
                                id="templateKomposisiSelect"
                                options={["", ...compositionTemplateOptions.map(opt => opt.label)]}
                                value={compositionTemplateOptions.find(opt => opt.value === selectedCompositionId)?.label || ""}
                                onSelect={(label) => {
                                    const selectedId = compositionTemplateOptions.find(opt => opt.label === label)?.value || "";
                                    setSelectedCompositionId(selectedId);
                                }}
                                disabled={!selectedTahunKurikulumId || isLoadingCompositions || compositionTemplateOptions.length === 0 || addedComponentsToPreview.length >= fixedComponentNames.length}
                            />
                        </div>
                        <button
                            onClick={handleAddCompositionToPreview}
                            className="bg-primary-green cursor-pointer my-auto py-2 text-sm text-white px-4 rounded flex items-center justify-center disabled:cursor-not-allowed"
                            title="Tambah Komponen ke Preview"
                            disabled={!selectedCompositionId || !selectedTahunKurikulumId || addedComponentsToPreview.length >= fixedComponentNames.length || addedComponentsToPreview.some(comp => comp.nama === selectedTemplateDetails?.nama) || isInitialLoadingExistingComposition}
                        >
                            <Plus color="white" size={16} className="mr-2" />
                            Tambah
                        </button>
                    </div>
                </div>

                {/* Pesan Loading dan Error Global */}
                {isLoadingOverall ? (
                    <p className="text-center text-blue-500 my-4">Memuat data...</p>
                ) : anyError ? (
                    <p className="text-center text-red-500 my-4">Error: {anyError.message || "Terjadi kesalahan."}</p>
                ) : !selectedTahunKurikulumId || !selectedProgramStudiId ? (
                    <p className="text-center text-gray-500 my-4">Pilih Tahun Kurikulum dan Program Studi untuk mengassign komposisi.</p>
                ) : (
                    <>
                        {/* Bagian Preview Komposisi Terpilih */}
                        <div className="my-6 p-4 border rounded bg-gray-50">
                            <h3 className="text-md font-semibold text-gray-700 mb-3">Komponen yang Dipilih :</h3>
                            {isInitialLoadingExistingComposition ? (
                                <p className="text-center text-blue-500 my-4">Memuat komposisi yang sudah ada...</p>
                            ) : addedComponentsToPreview.length === 0 ? (
                                <p className="text-gray-600">Tambahkan komponen komposisi dari dropdown di atas.</p>
                            ) : (
                                <table className="min-w-full bg-white border border-gray-200 text-sm">
                                    <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-3 border-b text-left">Komponen</th>
                                        <th className="py-2 px-3 border-b text-left">Persentase (%)</th>
                                        <th className="py-2 px-3 border-b text-left">Aksi</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {addedComponentsToPreview.map((comp) => (
                                        <tr key={comp.id}>
                                            <td className="py-2 px-3 border-b">{comp.nama}</td>
                                            <td className="py-2 px-3 border-b">{comp.persentase}%</td>
                                            <td className="py-2 px-3 border-b">
                                                <button
                                                    onClick={() => handleRemoveCompositionFromPreview(comp.id)}
                                                    className="text-red-500 hover:text-red-700 p-1 rounded flex items-center gap-1 cursor-pointer"
                                                    title="Hapus Komponen"
                                                >
                                                    <X size={16} /> Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                    <tfoot>
                                    <tr className="bg-gray-100 font-bold">
                                        <td className="py-2 px-3 border-t text-right" colSpan={1}>Total Persentase:</td>
                                        <td className={`py-2 px-3 border-t ${totalPercentageInPreview === 100 ? 'text-primary-green' : 'text-red-500'}`}>
                                            {totalPercentageInPreview}%
                                        </td>
                                        <td className="py-2 px-3 border-t"></td>
                                    </tr>
                                    </tfoot>
                                </table>
                            )}
                        </div>

                        <p className="text-center text-gray-600 my-4">
                            Set Komposisi ini akan diterapkan ke semua mata kuliah dalam Program Studi&nbsp;
                            <span className="font-semibold text-gray-800">
                  {selectedProgramStudiName}
              </span>&nbsp;
                            untuk Tahun Kurikulum&nbsp;
                            <span className="font-semibold text-gray-800">
                  {selectedTahunKurikulumName}
              </span>.
                        </p>
                        {/* Tampilan daftar Mata Kuliah yang terpengaruh dengan komposisi masing-masing */}
                        {isLoadingMataKuliah || isLoadingIndividualMataKuliahCompositions ? (
                            <p className="text-center text-blue-500 my-2">Memuat daftar mata kuliah target dan komposisi...</p>
                        ) : mataKuliahs.length === 0 ? (
                            <p className="text-center text-red-500 my-2">Tidak ada mata kuliah ditemukan untuk kriteria ini.</p>
                        ) : (
                            <div className="my-2 p-4 border rounded bg-white">
                                <h4 className="text-md font-semibold text-gray-700 mb-2">Data Komposisi Nilai Mata Kuliah ({mataKuliahs.length} Mata Kuliah):</h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border border-gray-200 text-sm">
                                        <thead>
                                        <tr className="bg-gray-100">
                                            <th className="py-2 px-3 border-b text-left">Kode MK</th>
                                            <th className="py-2 px-3 border-b text-left">Nama MK</th>
                                            <th className="py-2 px-3 border-b text-left">Komposisi Saat Ini</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {mataKuliahs.map((mk, index) => {
                                            const compQuery = mataKuliahCompositionsQueries[index];
                                            const comps = compQuery?.data || [];
                                            const compsError = compQuery?.error;
                                            const compsLoading = compQuery?.isLoading;

                                            const totalExistingCompPercentage = comps.reduce((sum, c) => sum + c.persentase, 0);

                                            return (
                                                <tr key={mk.id}>
                                                    <td className="py-2 px-3 border-b">{mk.kodeMataKuliah}</td>
                                                    <td className="py-2 px-3 border-b">{mk.namaMataKuliah}</td>
                                                    <td className="py-2 px-3 border-b">
                                                        {compsLoading ? (
                                                            <span className="text-blue-500">Memuat...</span>
                                                        ) : compsError ? (
                                                            <span className="text-red-500">Error: {(compsError as Error).message || 'Gagal memuat komposisi'}</span>
                                                        ) : comps.length === 0 ? (
                                                            <span className="text-gray-500">Belum di-assign</span>
                                                        ) : (
                                                            <div>
                                                                {comps.map(c => (
                                                                    <div key={c.siakKomposisiNilaiId}>{c.nama}: {c.persentase}%</div>
                                                                ))}
                                                                <div className={`font-semibold ${totalExistingCompPercentage === 100 ? 'text-primary-green' : 'text-red-500'}`}>
                                                                    Total: {totalExistingCompPercentage}%
                                                                </div>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleAssignComposition}
                        className="bg-primary-green cursor-pointer py-3 px-8 text-white text-lg font-semibold rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!isSubmitButtonEnabled}
                    >
                        {isAssigningMany ? "Menerapkan..." : "Terapkan Komposisi Ini"}
                    </button>
                </div>
            </div>
        </MainLayout>
    );
};

export default SetCompositionAdminAcademic;