import React, { useState, useMemo, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import HorizontalLine from "../../../components/profile/HorizontalLine";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentKrsService } from "../../../api/mahasiswa/studentKrsService";
import { IAvailableCourse, ISavedKrsResponse, IAddKrsPayload, IKrsInfo } from "../../../types/mahasiswa.types";
import {
    Check,
    RefreshCw,
    Search,
    SlidersHorizontal,
    Trash,
} from "lucide-react";

// A utility hook for debouncing input to prevent excessive API calls
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};


//================================================================================
// Main Page Component
// Contains all data fetching and state management logic.
//================================================================================
const StudyPlanCard = () => {
    const queryClient = useQueryClient();

    // State for UI interactions
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // --- DATA FETCHING QUERIES ---
    const { data: krsInfo, isLoading: isLoadingInfo } = useQuery({
        queryKey: ['krsInfo'],
        queryFn: studentKrsService.getKrsInfo,
    });

    const { data: availableCoursesData, isLoading: isLoadingCourses } = useQuery({
        queryKey: ['availableCourses', debouncedSearchTerm, page, pageSize],
        queryFn: () => studentKrsService.getAvailableCourses({
            keyword: debouncedSearchTerm, page, size: pageSize,
        }),
        keepPreviousData: true,
    });

    const { data: savedKrsData, isLoading: isLoadingSaved } = useQuery({
        queryKey: ['savedKrs'],
        queryFn: studentKrsService.getSavedCourses,
    });

    // --- MUTATIONS ---
    const { mutate: addCourses, isLoading: isAddingCourses } = useMutation({
        mutationFn: (payload: IAddKrsPayload) => studentKrsService.addCoursesToKrs(payload),
        onSuccess: (data) => {
            alert(data.message || "KRS berhasil disimpan!");
            queryClient.invalidateQueries({ queryKey: ['krsInfo'] });
            queryClient.invalidateQueries({ queryKey: ['savedKrs'] });
        },
        onError: (error) => {
            console.error("Gagal menyimpan KRS:", error);
            alert("Gagal menyimpan KRS. Silakan coba lagi.");
        }
    });

    const { mutate: submitKrs, isLoading: isSubmittingKrs } = useMutation({
        mutationFn: studentKrsService.submitKrsForApproval,
        onSuccess: (data) => {
            alert(data.message || "KRS telah berhasil diajukan.");
            queryClient.invalidateQueries({ queryKey: ['krsInfo'] });
            queryClient.invalidateQueries({ queryKey: ['savedKrs'] });
        },
        onError: (error) => {
            console.error("Gagal mengajukan KRS:", error);
            alert("Gagal mengajukan KRS. Silakan coba lagi.");
        },
    });

    const { mutate: updateKrsCourses, isLoading: isUpdatingKrsCourses } = useMutation({
        mutationFn: (payload: IAddKrsPayload) => studentKrsService.updateKrsCourses(payload),
        onSuccess: (data) => {
            alert(data.message || "KRS berhasil disimpan");
            queryClient.invalidateQueries({ queryKey: ['krsInfo'] });
            queryClient.invalidateQueries({ queryKey: ['savedKrs'] })
        },
        onError: (error) => {
            console.error('Gagal menyimpan KRS:', error);
            alert("Gagal menyimpan KRS. Silahkan coba lagi")
        }
    })

    // Determine UI state from fetched data
    const isLoading = isLoadingInfo || isLoadingCourses || isLoadingSaved;
    const krsValidated = krsInfo?.statusKrs === "Disetujui" || krsInfo?.statusKrs === "Diajukan";

    if (isLoading && !krsInfo) {
        return (
            <MainLayout isGreeting={false} titlePage={"Pengisian Kartu Rencana Studi"}>
                <div className="p-4 text-center">Memuat data KRS...</div>
            </MainLayout>
        );
    }

    return (
        <MainLayout
            isGreeting={false}
            titlePage={"Pengisian Kartu Rencana Studi"}
            className=""
        >
            <HorizontalLine />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 p-4 bg-[#F4F4F4] mx-auto">
                <StudyPlanCardHeader
                    title={"Semester Saat Ini"}
                    subtitle={krsInfo?.semester ?? '...'}
                />
                <StudyPlanCardHeader
                    title={"Batas Total SKS"}
                    subtitle={krsInfo?.batasSks ?? '...'}
                />
                <StudyPlanCardHeader
                    title={"Periode Akademik"}
                    subtitle={krsInfo?.periodeAkademik ?? '...'}
                />
                <StudyPlanCardHeader
                    title={"Status"}
                    subtitle={krsInfo?.statusKrs ?? '...'}
                />
                <StudyPlanCardHeader
                    title={"Pembimbing Akademik"}
                    subtitle={krsInfo?.pembimbingAkademik ?? '...'}
                />
            </div>
            <InfoAlert />

            {isLoading ? (
                <div className="text-center p-4">Memuat data kelas...</div>
            ) : !krsInfo ? (
                <div className="text-center p-4 text-red-500">Data KRS tidak ditemukan.</div>
            ) : (
                <StudyPlanCardTable
                    krsInfo={krsInfo}
                    courses={availableCoursesData?.data ?? []}
                    pagination={availableCoursesData?.pagination}
                    savedCoursesData={savedKrsData}
                    krsValidated={krsValidated}
                    addCourses={addCourses}
                    isAddingCourses={isAddingCourses}
                    updateCourse={updateKrsCourses}
                    isUpdatingCourses={isUpdatingKrsCourses}
                    submitKrs={submitKrs}
                    isSubmittingKrs={isSubmittingKrs}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    page={page}
                    setPage={setPage}
                />
            )}
        </MainLayout>
    );
};

//================================================================================
// Sub-component: StudyPlanCardHeader
//================================================================================
const StudyPlanCardHeader = ({ title, subtitle }) => {
    return (
        <div className="w-full">
            <h1 className="font-semibold text-sm sm:text-base">{title}</h1>
            <h1 className="text-xs sm:text-sm">{subtitle}</h1>
        </div>
    );
};

//================================================================================
// Sub-component: InfoAlert
//================================================================================
const InfoAlert = () => {
    return (
        <div className="bg-green-100 text-green-700 p-4 px-6 rounded-md mt-4 mb-6 text-sm">
            Periode pengisian dan pengubahan <strong>KRS Teknik Informatika</strong>{" "}
            belum dibuka/sudah ditutup.
        </div>
    );
};

//================================================================================
// Sub-component: StudyPlanCardTable
//================================================================================
interface StudyPlanCardTableProps {
    krsInfo: IKrsInfo;
    courses: IAvailableCourse[];
    pagination: any;
    savedCoursesData?: ISavedKrsResponse;
    krsValidated: boolean;
    addCourses: (payload: IAddKrsPayload) => void;
    isAddingCourses: boolean;
    updateCourse: (payload: IAddKrsPayload) => void;
    isUpdatingCourses: boolean;
    submitKrs: () => void;
    isSubmittingKrs: boolean;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    page: number;
    setPage: (page: number) => void;
}

const StudyPlanCardTable = ({
    krsInfo,
    courses,
    pagination,
    savedCoursesData,
    krsValidated,
    addCourses,
    isAddingCourses,
    updateCourse,
    isUpdatingCourses,
    submitKrs,
    isSubmittingKrs,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
}: StudyPlanCardTableProps) => {
    const [activeButton, setActiveButton] = useState("pilihKelas");
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

    const savedCourseIds = useMemo(() => {
        if (!savedCoursesData?.krs) return new Set();
        return new Set(savedCoursesData.krs.map(course => course.mataKuliah.id));
    }, [savedCoursesData]);

    const availableToSelectCourses = courses.filter(c => !savedCourseIds.has(c.mataKuliah.id));
    const isAllSelected = availableToSelectCourses.length > 0 && selectedCourses.length === availableToSelectCourses.length;

    const handleCheckboxChange = (courseId: string) => {
        setSelectedCourses((prev) =>
            prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
        );
    };

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedCourses([]);
        } else {
            setSelectedCourses(availableToSelectCourses.map((c) => c.id));
        }
    };

    const handleSaveKrs = () => {
        if (selectedCourses.length === 0) {
            alert("Silakan pilih minimal satu kelas untuk disimpan.");
            return;
        }
        addCourses({ kelasIds: selectedCourses });
        setSelectedCourses([]);
    };

    const handleSubmitKrs = () => {
        if (window.confirm("Apakah Anda yakin ingin mengajukan KRS ini? Anda tidak akan bisa mengubahnya lagi setelah diajukan.")) {
            submitKrs();
        }
    };

    const handleUpdateKrs = () => {
        if (selectedCourses.length === 0) {
            alert("Silakan pilih minimal satu kelas...");
            return;
        }
        updateCourse({ kelasIds: selectedCourses });
        setSelectedCourses([]);
    }

    const notValidatedKRS = () => {
        return (
            <div className="mb-20">
                <div className="flex flex-col gap-3 mb-4">
                    <div className="flex items-center gap-4 flex-wrap">
                        {/* Tabs */}
                        <div className="flex">
                            <button
                                onClick={() => setActiveButton("pilihKelas")}
                                className={`font-semibold py-2 px-6 text-sm ${activeButton === "pilihKelas" ? "bg-primary-green text-white" : "bg-white text-gray-700 border border-gray-300"}`}
                            >
                                Pilih Kelas
                            </button>
                            <button
                                onClick={() => setActiveButton("krsTersimpan")}
                                className={`font-semibold py-2 px-6 text-sm ${activeButton === "krsTersimpan" ? "bg-primary-green text-white" : "bg-white text-gray-700 border border-gray-300 border-l-0"}`}
                            >
                                KRS Tersimpan
                            </button>
                        </div>

                        {/* Search and Icons */}
                        <div className="flex">
                            <input
                                type="search"
                                placeholder="Cari Kelas"
                                className="px-4 py-2 w-64 text-sm border border-gray-300 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="bg-[#00c274] hover:bg-[#00a864] w-10 flex items-center justify-center transition">
                                <Search color="white" size={18} />
                            </button>
                            <button className="bg-[#4b6bfb] hover:bg-[#3b5beb] w-10 flex items-center justify-center transition">
                                <RefreshCw color="white" size={18} />
                            </button>
                        </div>

                        {/* Filter Button */}
                        <button className="bg-[#ff9f1c] hover:bg-[#f0921a] text-white flex items-center gap-2 px-4 py-2 font-semibold text-sm transition">
                            <SlidersHorizontal size={16} /> Filter dan Urutkan
                        </button>
                    </div>

                    {/* Secondary Filters */}
                    <div className="flex items-center gap-2">
                        <button className="border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 transition">Tepat Semester</button>
                        <button className="border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 transition">Semester Lalu</button>
                        <button className="border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 transition">Tidak Lulus</button>
                    </div>
                </div>

                {activeButton === "pilihKelas" && (
                    <>
                        <div className="overflow-x-auto border border-gray-300">
                            <table className="min-w-full bg-white">
                                <thead className="bg-white text-sm border-b border-gray-300">
                                    <tr>
                                        <th className="px-3 py-3 border-r border-gray-300 text-center w-12">
                                            <input type="checkbox" onChange={toggleSelectAll} checked={isAllSelected} className="w-4 h-4 cursor-pointer" />
                                        </th>
                                        <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center">Nama Matkul</th>
                                        <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center w-48">Jadwal</th>
                                        <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center w-24">Kurikulum</th>
                                        <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center w-20">SKS</th>
                                        <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center w-24">Semester</th>
                                        <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center">Dosen Pengajar</th>
                                        <th className="px-4 py-3 font-semibold text-center w-28">Huruf Mutu</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {courses.map((course, index) => {
                                        const isAlreadySaved = savedCourseIds.has(course.mataKuliah.id);
                                        const isSelected = selectedCourses.includes(course.id);

                                        const showError = false;

                                        return (
                                            <React.Fragment key={course.id}>
                                                <tr className={`transition border-b border-gray-300 ${isAlreadySaved ? 'bg-gray-50 text-gray-500' : 'hover:bg-gray-50'}`}>
                                                    <td className="px-3 py-4 border-r border-gray-300 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected || isAlreadySaved}
                                                            onChange={() => handleCheckboxChange(course.id)}
                                                            disabled={isAlreadySaved}
                                                            className={`w-4 h-4 cursor-pointer ${isSelected || isAlreadySaved ? 'accent-primary-green' : ''}`}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-4 border-r border-gray-300 text-left font-medium">
                                                        {course.mataKuliah.kode ? `${course.mataKuliah.kode} - ` : ''}{course.mataKuliah.nama} ({course.nama})
                                                    </td>
                                                    <td className="px-4 py-4 border-r border-gray-300 text-center">
                                                        {course.jadwalKuliah && course.jadwalKuliah[0] ? `${course.jadwalKuliah[0].hari}, ${course.jadwalKuliah[0].jamMulai} - ${course.jadwalKuliah[0].jamSelesai}` : '-'}
                                                    </td>
                                                    <td className="px-4 py-4 border-r border-gray-300 text-center">
                                                        {course.mataKuliah.tahunKurikulum || '2021'}
                                                    </td>
                                                    <td className="px-4 py-4 border-r border-gray-300 text-center font-semibold">
                                                        {course.mataKuliah.totalSks} SKS
                                                    </td>
                                                    <td className="px-4 py-4 border-r border-gray-300 text-center">
                                                        {course.mataKuliah.semester || '-'}
                                                    </td>
                                                    <td className="px-4 py-4 border-r border-gray-300 text-left">
                                                        {course.jadwalKuliah && course.jadwalKuliah[0] ? course.jadwalKuliah[0].dosen.nama : '-'}
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                    </td>
                                                </tr>
                                                {showError && (
                                                    <tr className="bg-[#f2a2a2] border-b border-gray-300">
                                                        <td colSpan={8} className="px-4 py-2 text-sm text-[#8c1c1c] font-medium relative">
                                                            Persyaratan : kamu harus mengambil matakuliah Kalkulus 1 untuk mengambil matakuliah ini
                                                            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8c1c1c] font-bold">X</button>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                    {courses.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="text-center py-8 text-gray-500">
                                                Tidak ada kelas yang tersedia.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-end items-center mt-4 mb-2">
                            <div className="flex items-center gap-2 text-sm">
                                <button onClick={() => setPage(page - 1)} disabled={!pagination?.links?.prev} className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50">Prev</button>
                                <span className="text-gray-600">Page {pagination?.currentPage || 1} of {pagination?.totalPages || 1}</span>
                                <button onClick={() => setPage(page + 1)} disabled={!pagination?.links?.next} className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50">Next</button>
                            </div>
                        </div>

                        {/* Bottom Action Bar */}
                        <div className="bg-[#f8f9fa] border border-gray-300 p-4 flex items-center justify-between mt-4">
                            {(krsInfo.statusKrs === "Belum Mengisi" || krsInfo.statusKrs === "Belum Diajukan" || krsInfo.statusKrs === "Draft") ? (
                                <button
                                    onClick={krsInfo.statusKrs === "Belum Mengisi" ? handleSaveKrs : handleUpdateKrs}
                                    disabled={selectedCourses.length === 0 || isAddingCourses || isUpdatingCourses}
                                    className="flex items-center gap-2 bg-[#ff9f1c] hover:bg-[#f0921a] text-white font-bold px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <Check className="w-5 h-5 font-bold" />
                                    {isAddingCourses || isUpdatingCourses ? 'Menyimpan...' : 'Simpan KRS'}
                                </button>
                            ) : (
                                <div></div>
                            )}
                            <div className="font-bold text-sm text-gray-800 hidden">
                                TOTAL SKS: {selectedCourses.reduce((acc, currId) => {
                                    const course = courses.find(c => c.id === currId);
                                    return acc + (course?.mataKuliah.totalSks || 0);
                                }, 0)} SKS
                            </div>
                        </div>
                    </>
                )}

                {activeButton === "krsTersimpan" && (
                    <div className="overflow-x-auto border border-gray-300">
                        <table className="min-w-full bg-white">
                            <thead className="bg-white text-sm border-b border-gray-300">
                                <tr>
                                    <th className="px-3 py-3 border-r border-gray-300 text-center w-12"><input type="checkbox" disabled /></th>
                                    <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center">Nama Matkul</th>
                                    <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center w-48">Jadwal</th>
                                    <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center w-24">Kurikulum</th>
                                    <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center w-20">SKS</th>
                                    <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center w-24">Semester</th>
                                    <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center">Dosen Pengajar</th>
                                    <th className="px-4 py-3 font-semibold text-center w-20">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {savedCoursesData?.rincianKrsMahasiswa && savedCoursesData.rincianKrsMahasiswa.length > 0 ? (
                                    savedCoursesData.rincianKrsMahasiswa.map((course) => (
                                        <tr key={course.id} className="transition border-b border-gray-300 hover:bg-gray-50">
                                            <td className="px-3 py-4 border-r border-gray-300 text-center">
                                                <input type="checkbox" className="w-4 h-4 cursor-not-allowed accent-primary-green" checked disabled />
                                            </td>
                                            <td className="px-4 py-4 border-r border-gray-300 text-left font-medium">
                                                {course.mataKuliah.kode ? `${course.mataKuliah.kode} - ` : ''}{course.mataKuliah.nama} ({course.nama})
                                            </td>
                                            <td className="px-4 py-4 border-r border-gray-300 text-center">
                                                {course.jadwalKuliah && course.jadwalKuliah[0] ? `${course.jadwalKuliah[0].hari}, ${course.jadwalKuliah[0].jamMulai} - ${course.jadwalKuliah[0].jamSelesai}` : '-'}
                                            </td>
                                            <td className="px-4 py-4 border-r border-gray-300 text-center">
                                                {course.mataKuliah.tahunKurikulum || '2021'}
                                            </td>
                                            <td className="px-4 py-4 border-r border-gray-300 text-center font-semibold">
                                                {course.mataKuliah.totalSks} SKS
                                            </td>
                                            <td className="px-4 py-4 border-r border-gray-300 text-center">
                                                {course.mataKuliah.semester || '-'}
                                            </td>
                                            <td className="px-4 py-4 border-r border-gray-300 text-left">
                                                {course.jadwalKuliah && course.jadwalKuliah[0] ? course.jadwalKuliah[0].dosen.nama : '-'}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <button className="text-[#e74c3c] hover:text-[#c0392b] transition">
                                                    <Trash className="w-5 h-5 mx-auto" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={8} className="text-center py-8 text-gray-500">Belum ada KRS yang disimpan.</td></tr>
                                )}
                            </tbody>
                            <tfoot className="text-sm font-bold bg-[#f8f9fa] border-t border-gray-300">
                                <tr>
                                    <td colSpan={4} className="px-4 py-4 text-right font-bold border-r border-gray-300">Total SKS Tersimpan:</td>
                                    <td className="px-4 py-4 text-center font-bold border-r border-gray-300 text-primary-green">{savedCoursesData?.totalSks ?? 0} SKS</td>
                                    <td colSpan={3} className="px-4 py-3 text-right">
                                        <button
                                            onClick={handleSubmitKrs}
                                            disabled={isSubmittingKrs || !savedCoursesData?.rincianKrsMahasiswa?.length}
                                            className="flex items-center gap-2 bg-primary-green hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow-sm ml-auto disabled:opacity-50 transition"
                                        >
                                            <Check className="w-5 h-5" />{isSubmittingKrs ? 'Mengajukan...' : 'Ajukan KRS'}
                                        </button>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    const validatedKRS = () => {
        return (
            <div className="mb-20">
                <div className="flex items-center mb-4">
                    <button className="font-semibold cursor-default py-2 px-6 text-sm bg-primary-green text-white border border-primary-green">
                        KRS Disetujui/Diajukan
                    </button>
                </div>
                <div className="overflow-x-auto border border-gray-300">
                    <table className="min-w-full bg-white">
                        <thead className="bg-white text-sm border-b border-gray-300">
                            <tr>
                                <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center">Nama Matkul</th>
                                <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center w-48">Jadwal</th>
                                <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center w-24">Kurikulum</th>
                                <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center w-20">SKS</th>
                                <th className="px-4 py-3 font-semibold border-r border-gray-300 text-center w-24">Semester</th>
                                <th className="px-4 py-3 font-semibold text-center">Dosen Pengajar</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {savedCoursesData?.rincianKrsMahasiswa && savedCoursesData.rincianKrsMahasiswa.length > 0 ? (
                                savedCoursesData.rincianKrsMahasiswa.map((course) => (
                                    <tr key={course.id} className="transition border-b border-gray-300 hover:bg-gray-50">
                                        <td className="px-4 py-4 border-r border-gray-300 text-left font-medium">
                                            {course.mataKuliah.kode ? `${course.mataKuliah.kode} - ` : ''}{course.mataKuliah.nama} ({course.nama})
                                        </td>
                                        <td className="px-4 py-4 border-r border-gray-300 text-center">
                                            {course.jadwalKuliah && course.jadwalKuliah[0] ? `${course.jadwalKuliah[0].hari}, ${course.jadwalKuliah[0].jamMulai} - ${course.jadwalKuliah[0].jamSelesai}` : '-'}
                                        </td>
                                        <td className="px-4 py-4 border-r border-gray-300 text-center">
                                            {course.mataKuliah.tahunKurikulum || '2021'}
                                        </td>
                                        <td className="px-4 py-4 border-r border-gray-300 text-center font-semibold">
                                            {course.mataKuliah.totalSks} SKS
                                        </td>
                                        <td className="px-4 py-4 border-r border-gray-300 text-center">
                                            {course.mataKuliah.semester || '-'}
                                        </td>
                                        <td className="px-4 py-4 text-left">
                                            {course.jadwalKuliah && course.jadwalKuliah[0] ? course.jadwalKuliah[0].dosen.nama : '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (<tr><td colSpan={6} className="text-center py-8 text-gray-500">Belum ada KRS yang disimpan.</td></tr>)}
                        </tbody>
                        <tfoot className="text-sm font-bold bg-[#f8f9fa] border-t border-gray-300">
                            <tr>
                                <td colSpan={3} className="px-4 py-4 text-right font-bold border-r border-gray-300">Total SKS Diajukan:</td>
                                <td className="px-4 py-4 text-center font-bold border-r border-gray-300 text-primary-green">{savedCoursesData?.totalSks ?? 0} SKS</td>
                                <td colSpan={2}></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    };

    return krsValidated ? validatedKRS() : notValidatedKRS();
};

// Make sure the default export is at the end of the file.
export default StudyPlanCard;