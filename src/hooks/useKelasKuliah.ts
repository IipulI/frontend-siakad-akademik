import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "../api/Index";
import { useMemo } from "react";
import { useDebounce } from "use-debounce";

export interface CollegeClass {
    id: string;
    dosen: string[];
    jadwalMingguan: string[];
    jumlahPertemuan: number;
    kapasitas: number;
    mataKuliah: {
        id: string;
        kodeMataKuliah: string;
        namaMataKuliah: string;
        tahunKurikulum: string;
    };
    nama: string;
    periodeAkademik: string;
    peserta: number;
    programStudi: {
        id: string;
        jenjang: {
            id: string;
            jenjang: string;
            nama: string;
        };
        namaProgramStudi: string;
    };
    sistemKuliah: string;
    statusPenilaian: string;
    tanggalMulai: string;
    tanggalSelesai: string;
}

export interface CreateCollegeClassPayload {
    periode_akademik_id: string;
    sistem_kuliah: string;
    program_studi_id: string;
    tahun_kurikulum_id: string;
    kapasitas: number;
    tanggal_mulai: string;
    tanggal_selesai: string;
    mata_kuliah: string;
    nama_kelas: string;
    jumlah_pertemuan: number;
    jadwal_mingguan: {
        hari: string;
        jam_mulai: string;
        jam_selesai: string;
        jenis_pertemuan: string;
        metode_pembelajaran: string;
        ruang: string;
    }[];
}

export function getCollegeClass(
    filter: {
        periodeAkademik?: string;
        programStudi?: string;
        tahunKuriKulum?: string;
        sistemKuliah?: string;
    },
    page: number = 1,
    size: number = 10
) {
    // Debounce selama 500ms (hanya untuk filter, bukan page/size agar navigasi halaman langsung responsif)
    const [debouncedFilter] = useDebounce(filter, 500);

    // Optional: gunakan useMemo agar queryKey lebih stabil
    const queryKey = useMemo(
        () => ["classes", debouncedFilter, page, size],
        [debouncedFilter, page, size]
    );

    return useQuery({
        queryKey,
        queryFn: async () => {
            const response = await Api.get("/akademik/kelas-kuliah", {
                params: {
                    // Nama filter di state UI berbeda dengan nama query param yang dibaca backend
                    siakPeriodeAkademikId: debouncedFilter.periodeAkademik || undefined,
                    siakProgramStudiId: debouncedFilter.programStudi || undefined,
                    siakTahunKurikulumId: debouncedFilter.tahunKuriKulum || undefined,
                    sistemKuliah: debouncedFilter.sistemKuliah || undefined,
                    page,
                    size,
                },
            });
            return response.data;
        },
    });
}

export function addCollegeClass() {
    return useMutation({
        mutationKey: ["addCollegeClass"],
        mutationFn: async (newClassData: CollegeClass) => {
            const response = await Api.post("/akademik/kelas-kuliah", newClassData);
            return response.data.data;
        },
    });
}

export function addStudentToClass(id) {
    return useMutation({
        mutationFn: async (data) => {
            const response = await Api.post(
                `/akademik/kelas-kuliah/${ id }/peserta-kelas`,
                data
            ); // Ubah jadi PUT
            return response.data.data;
        },
    });
}

export function getDetailCollegeClass(id: string) {
    return useQuery({
        queryKey: ["collegeClassDetail", id],
        queryFn: async () => {
            const response = await Api.get(`/akademik/kelas-kuliah/${ id }`);
            return response.data.data;
        },
    });
}

export function getClassSchedule(id: string) {
    return useQuery({
        queryKey: ["classSchedule", id],
        queryFn: async () => {
            const response = await Api.get(`/akademik/kelas-kuliah/${ id }/schedule`);
            return response.data.data;
        },
        enabled: !!id,
    });
}

export interface AddClassSchedulePayload {
    jadwalKuliah: {
        hari: string;
        siakRuanganId: string;
        siakDosenId?: string | null;
        jamMulai: string;
        jamSelesai: string;
        jenisPertemuan: string;
        metodePembelajaran: string;
    }[];
}

export function addClassSchedule(id: string) {
    return useMutation({
        mutationFn: async (data: AddClassSchedulePayload) => {
            const response = await Api.post(`/akademik/kelas-kuliah/${ id }/schedule`, data);
            return response.data.data;
        },
    });
}

export function deleteClassSchedule(id: string) {
    return useMutation({
        mutationFn: async (jadwalId: string) => {
            const response = await Api.delete(`/akademik/kelas-kuliah/${ id }/schedule/${ jadwalId }`);
            return response.data;
        },
    });
}

export function getClassAttendants(id: string) {
    return useQuery({
        queryKey: ["classAttendants", id],
        queryFn: async () => {
            const response = await Api.get(
                `/akademik/kelas-kuliah/${ id }/participant`
            );
            return response.data.data;
        },
    });
}

export function getClassRPS(mataKuliahId: string, periodeAkademikId?: string) {
    return useQuery({
        queryKey: ["classRPS", mataKuliahId, periodeAkademikId],
        queryFn: async () => {
            const response = await Api.get(
                `/akademik/rps/mata-kuliah/${ mataKuliahId }/detail`,
                { params: { periodeId: periodeAkademikId || undefined } }
            );
            return response.data.data;
        },
        enabled: !!mataKuliahId,
    });
}

export function getYearCuriculum() {
    return useQuery({
        queryKey: ["curiculumYear"],
        queryFn: async () => {
            const response = await Api.get("/akademik/tahun-kurikulum");
            return response.data.data;
        },
    });
}

export function getSubjects(filter?: {
    programStudiId?: string;
    tahunKurikulumId?: string;
}) {
    const hasFilter = filter !== undefined;
    const programStudiId = filter?.programStudiId;
    const tahunKurikulumId = filter?.tahunKurikulumId;

    return useQuery({
        queryKey: ["subjects", programStudiId ?? null, tahunKurikulumId ?? null],
        queryFn: async () => {
            const response = await Api.get("/akademik/mata-kuliah", {
                params: hasFilter ? { programStudiId, tahunKurikulumId } : undefined,
            });
            return response.data.data;
        },
        // Tanpa filter (dipakai halaman lain): selalu jalan seperti semula.
        // Dengan filter (Tambah Kelas): baru jalan setelah keduanya terisi.
        enabled: hasFilter ? !!programStudiId && !!tahunKurikulumId : true,
    });
}

export function getRooms() {
    return useQuery({
        queryKey: ["rooms"],
        queryFn: async () => {
            const response = await Api.get("/akademik/ruangan");
            return response.data.data;
        },
    });
}

export function getSlotWaktu() {
    return useQuery({
        queryKey: ["slotWaktu"],
        queryFn: async () => {
            const response = await Api.get("/akademik/slot-waktu");
            return response.data.data;
        },
    });
}

export function getLecturers() {
    return useQuery({
        queryKey: ["lecturers"],
        queryFn: async () => {
            const response = await Api.get("/akademik/dosen");
            return response.data.data;
        },
    });
}

const LECTURER_SEARCH_MIN_LENGTH = 3;

export function searchLecturers(query: string) {
    const trimmed = query.trim();
    const [debouncedQuery] = useDebounce(trimmed, 400);

    return useQuery({
        queryKey: ["lecturersSearch", debouncedQuery],
        queryFn: async () => {
            const response = await Api.get("/akademik/dosen", {
                params: { search: debouncedQuery, page: 1, size: 20 },
            });
            return response.data.data;
        },
        enabled: debouncedQuery.length >= LECTURER_SEARCH_MIN_LENGTH,
    });
}

export function getStudents() {
    return useQuery({
        queryKey: ["students"],
        queryFn: async () => {
            const response = await Api.get("/akademik/mahasiswa");
            return response.data.data;
        },
    });
}

export function getAllDetailStudentAttendant(id) {
    return useQuery({
        queryKey: ["allDetailStudent", id],
        queryFn: async () => {
            const response = await Api.get(
                `/akademik/kelas-kuliah/${ id }/participant`
            );
            return response.data.data;
        },
    });
}

export const deleteStudentsFromClass = (kelasId: string) => {
    return useMutation({
        mutationFn: async ({ mahasiswaIds }: { mahasiswaIds: string[] }) => {
            const response = await Api.delete(
                `/akademik/kelas-kuliah/${ kelasId }/peserta-kelas`,
                {
                    data: { mahasiswaIds }, // axios needs `data` key for DELETE body
                }
            );
            return response.data;
        },
    });
};

export const getStudentExams = (id) => {
    return useQuery({
        queryKey: ["exams"],
        queryFn: async () => {
            const response = await Api.get(
                `/akademik/kelas-kuliah/${ id }/jadwal-ujian`
            );
            return response.data.data;
        },
    });
};
