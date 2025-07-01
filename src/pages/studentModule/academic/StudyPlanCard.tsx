import React, { useState, useMemo, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import HorizontalLine from "../../../components/profile/HorizontalLine";
import { useStudyPlanData } from "../../../hooks/mahasiswa/useStudyPlanData"; // <-- IMPORT THE HOOK
import { IAvailableCourse, ISavedKrsResponse, IAddKrsPayload } from "../../../types/mahasiswa.types";
import {
    Check,
    RefreshCw,
    Search,
    SlidersHorizontal,
    Trash,
} from "lucide-react";


//================================================================================
// Main Page Component
// Now it's much cleaner, just calling the hook to get its data.
//================================================================================
const StudyPlanCard = () => {
    // Call the hook to get all data and state management functions.
    const {
        krsInfo,
        availableCoursesData,
        savedKrsData,
        isLoading,
        isError,
        error,
        page,
        setPage,
        searchTerm,
        setSearchTerm,
        addCourses,
        isAddingCourses,
    } = useStudyPlanData();

    const krsValidated =
        krsInfo?.statusKrs === "Disetujui" || krsInfo?.statusKrs === "Diajukan";

    if (isLoading && !krsInfo) {
        return (
            <MainLayout isGreeting={false} titlePage={"Pengisian Kartu Rencana Studi"}>
                <div className="p-4 text-center">Memuat data KRS...</div>
            </MainLayout>
        );
    }

    if (isError) {
        return (
            <MainLayout isGreeting={false} titlePage={"Pengisian Kartu Rencana Studi"}>
                <div className="p-4 text-center text-red-500">
                    Gagal memuat data: {error instanceof Error ? error.message : "Terjadi kesalahan"}
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout
            isGreeting={false}
            titlePage={"Pengisian Kartu Rencana Studi"}
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
            <StudyPlanCardTable
                courses={availableCoursesData?.data ?? []}
                pagination={availableCoursesData?.pagination}
                savedCoursesData={savedKrsData}
                krsValidated={krsValidated}
                addCourses={addCourses}
                isAddingCourses={isAddingCourses}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                page={page}
                setPage={setPage}
            />
        </MainLayout>
    );
};


//================================================================================
// Sub-component: StudyPlanCardHeader (No changes needed)
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
// Sub-component: InfoAlert (No changes needed)
//================================================================================
const InfoAlert = () => {
    return (
        <div className="bg-green-100 text-green-700 p-4 px-6 rounded-md mt-4 mb-6 text-sm">
            Periode pengisian dan pengubahan <strong>KRS Teknik Informatika</strong>{" "}
            belum dibuka/sudah ditutup
        </div>
    );
};


//================================================================================
// Sub-component: StudyPlanCardTable
// This component now receives all data and functions as props.
//================================================================================
interface StudyPlanCardTableProps {
    courses: IAvailableCourse[];
    pagination: any;
    savedCoursesData?: ISavedKrsResponse;
    krsValidated: boolean;
    addCourses: (payload: IAddKrsPayload) => void;
    isAddingCourses: boolean;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    page: number;
    setPage: (page: number) => void;
}

const StudyPlanCardTable = ({
                                courses,
                                pagination,
                                savedCoursesData,
                                krsValidated,
                                addCourses,
                                isAddingCourses,
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
            prev.includes(courseId) ? prev.filter((c) => c !== code) : [...prev, courseId]
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

    if (!krsValidated && !courses && activeButton === 'pilihKelas') {
        return (
            <div className="bg-yellow-100 text-yellow-700 p-4 px-6 rounded-md mt-4 mb-6 text-sm">
                Belum ada Kelas Yang Ditawarkan untuk periode ini.
            </div>
        );
    }

    const notValidatedKRS = () => {
        return (
            <div className="mb-20">
                <div>
                    <div className="flex items-center">
                        <button onClick={() => setActiveButton("pilihKelas")} className={`font-semibold cursor-pointer py-2 px-5 pr-14 transform scale-y-[-1] w-fit ${activeButton === "pilihKelas" ? "bg-primary-green text-white" : "bg-white text-black"}`}>
                            <p className="transform scale-y-[-1]">Pilih Kelas</p>
                        </button>
                        <button onClick={() => setActiveButton("krsTersimpan")} className={`font-semibold cursor-pointer py-2 px-5 pr-14 transform scale-y-[-1] w-fit border border-primary-green ${activeButton === "krsTersimpan" ? "bg-primary-green text-white" : "bg-white text-black"}`} style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)" }}>
                            <p className="transform scale-y-[-1]">KRS Tersimpan</p>
                        </button>
                    </div>

                    <div className="flex my-4">
                        <input type="search" placeholder="Cari Kelas" className="px-4 py-2 w-60 text-sm rounded-l border border-slate-300" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <button className="bg-primary-green w-8 cursor-pointer flex items-center justify-center"><Search color="white" size={18} /></button>
                        <button className="bg-primary-blueDark w-8 cursor-pointer rounded-r flex items-center justify-center"><RefreshCw color="white" size={20} /></button>
                    </div>

                    {activeButton === "pilihKelas" && (
                        <>
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-100 text-sm">
                                <tr>
                                    <th className="px-3 py-2 border border-primary-green"><input type="checkbox" onChange={toggleSelectAll} checked={isAllSelected} /></th>
                                    <th className="px-4 py-3 font-semibold border border-primary-green">Nama Matkul</th>
                                    <th className="px-4 py-3 font-semibold border border-primary-green">Jadwal</th>
                                    <th className="px-4 py-3 font-semibold border border-primary-green">SKS</th>
                                    <th className="px-4 py-3 font-semibold border border-primary-green">Semester</th>
                                    <th className="px-4 py-3 font-semibold border border-primary-green">Dosen Pengajar</th>
                                    <th className="px-4 py-3 font-semibold border border-primary-green">Riwayat Nilai</th>
                                </tr>
                                </thead>
                                <tbody className="font-semibold text-sm">
                                {courses.map((course) => {
                                    const isAlreadySaved = savedCourseIds.has(course.mataKuliah.id);
                                    return(
                                        <tr key={course.id} className={`transition ${isAlreadySaved ? 'bg-gray-200 text-gray-500' : 'text-center hover:bg-gray-50'}`}>
                                            <td className="px-3 py-2 border border-primary-green"><input type="checkbox" checked={selectedCourses.includes(course.id)} onChange={() => handleCheckboxChange(course.id)} disabled={isAlreadySaved} /></td>
                                            <td className="px-4 py-2 border border-primary-green text-left">{course.mataKuliah.kodeMataKuliah} - {course.mataKuliah.namaMataKuliah} ({course.namaKelas})</td>
                                            <td className="px-4 py-2 border border-primary-green text-left">{course.hari ? `${course.hari}, ${course.jamMulai} - ${course.jamSelesai}` : '-'}</td>
                                            <td className="px-4 py-2 border border-primary-green text-center">{course.mataKuliah.sksTatapMuka + course.mataKuliah.sksPraktikum}</td>
                                            <td className="px-4 py-2 border border-primary-green text-center">{course.mataKuliah.semester}</td>
                                            <td className="px-4 py-2 border border-primary-green text-left">{course.dosenPengajar}</td>
                                            <td className="px-4 py-2 border border-primary-green text-center">{course.riwayatMatakuliah || "-"}</td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                            <div className="flex justify-between items-center mt-4">
                                <button onClick={handleSaveKrs} disabled={isAddingCourses || selectedCourses.length === 0} className="flex items-center gap-2 bg-primary-yellow hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                                    <Check className="w-5 h-5" />{isAddingCourses ? 'Menyimpan...' : 'Simpan KRS'}
                                </button>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                                    <span>Page {pagination?.currentPage} of {pagination?.totalPages}</span>
                                    <button onClick={() => setPage(page + 1)} disabled={page >= pagination?.totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
                                </div>
                            </div>
                        </>
                    )}

                    {activeButton === "krsTersimpan" && (
                        <table className="min-w-full bg-white mt-4">
                            <thead className="bg-gray-100 text-sm">
                            <tr>
                                <th className="px-4 py-3 font-semibold border border-primary-green">Nama Matkul</th>
                                <th className="px-4 py-3 font-semibold border border-primary-green">Jadwal</th>
                                <th className="px-4 py-3 font-semibold border border-primary-green">SKS</th>
                                <th className="px-4 py-3 font-semibold border border-primary-green">Dosen</th>
                                <th className="px-4 py-3 font-semibold border border-primary-green">Aksi</th>
                            </tr>
                            </thead>
                            <tbody className="font-semibold text-sm">
                            {savedCoursesData?.krs && savedCoursesData.krs.length > 0 ? (
                                savedCoursesData.krs.map((course) => (
                                    <tr key={course.id} className="text-center hover:bg-gray-50 transition">
                                        <td className="px-4 py-2 border border-primary-green text-left">{course.mataKuliah.kodeMataKuliah} - {course.mataKuliah.namaMataKuliah} ({course.namaKelas})</td>
                                        <td className="px-4 py-2 border border-primary-green text-left">{course.hari ? `${course.hari}, ${course.jamMulai} - ${course.jamSelesai}` : '-'}</td>
                                        <td className="px-4 py-2 border border-primary-green">{course.mataKuliah.sksTatapMuka + course.mataKuliah.sksPraktikum}</td>
                                        <td className="px-4 py-2 border border-primary-green text-left">{course.dosenPengajar}</td>
                                        <td className="px-4 py-2 border border-primary-green flex justify-center">
                                            <button className="flex items-center gap-2 bg-red-400 text-white font-semibold p-2 rounded-md shadow-md"><Trash className="w-5 h-5" /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : ( <tr><td colSpan={6} className="text-center p-4">Belum ada KRS yang disimpan.</td></tr> )}
                            </tbody>
                            <tfoot className="text-sm font-bold bg-white border">
                            <tr>
                                <td colSpan={3} className="px-4 py-2 text-left font-bold">Total SKS Tersimpan:</td>
                                <td className="px-4 py-2 text-center font-bold">{savedCoursesData?.totalSks ?? 0}</td>
                                <td colSpan={2} className="px-4 py-2 text-right">
                                    <button className="flex items-center gap-2 bg-primary-green hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md shadow-md ml-auto"><Check className="w-5 h-5" /> Ajukan KRS</button>
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    )}
                </div>
            </div>
        );
    };

    const validatedKRS = () => {
        return (
            <div className="mb-20">
                <div className="flex items-center mb-4">
                    <button className="font-semibold cursor-default py-2 px-5 pr-14 transform scale-y-[-1] w-fit text-white bg-primary-green border border-primary-green" style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)" }}>
                        <p className="transform scale-y-[-1]">KRS Disetujui/Diajukan</p>
                    </button>
                </div>
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100 text-sm">
                    <tr>
                        <th className="px-4 py-3 font-semibold border border-primary-green">Nama Matkul</th>
                        <th className="px-4 py-3 font-semibold border border-primary-green">Jadwal</th>
                        <th className="px-4 py-3 font-semibold border border-primary-green">SKS</th>
                        <th className="px-4 py-3 font-semibold border border-primary-green">Dosen Pengajar</th>
                    </tr>
                    </thead>
                    <tbody className="font-semibold text-sm">
                    {savedCoursesData?.krs && savedCoursesData.krs.length > 0 ? (
                        savedCoursesData.krs.map((course) => (
                            <tr key={course.id} className="text-center hover:bg-gray-50 transition">
                                <td className="px-4 py-2 border border-primary-green text-left">{course.mataKuliah.namaMataKuliah} ({course.namaKelas})</td>
                                <td className="px-4 py-2 border border-primary-green text-left">{course.hari ? `${course.hari}, ${course.jamMulai} - ${course.jamSelesai}` : '-'}</td>
                                <td className="px-4 py-2 border border-primary-green">{course.mataKuliah.sksTatapMuka + course.mataKuliah.sksPraktikum}</td>
                                <td className="px-4 py-2 border border-primary-green text-left">{course.dosenPengajar}</td>
                            </tr>
                        ))
                    ) : ( <tr><td colSpan={4} className="text-center p-4">Tidak ada data KRS yang tersimpan.</td></tr> )}
                    </tbody>
                    <tfoot className="text-sm font-bold bg-white border">
                    <tr>
                        <td colSpan={2} className="px-4 py-2 text-left font-bold">Total SKS Diajukan:</td>
                        <td className="px-4 py-2 text-center font-bold">{savedCoursesData?.totalSks ?? 0}</td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        );
    };

    return krsValidated ? validatedKRS() : notValidatedKRS();
};

export default StudyPlanCard;