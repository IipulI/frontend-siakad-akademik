// src/types/common.types.ts

export interface IApiResponseSuccess {
    status: string;
    message: string;
}

export interface IApiResponseWithData<T> extends IApiResponseSuccess {
    data: T;
}

export interface IPaginatedResponse<T> {
    data: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}

export interface IAcademicPeriod {
    id: string;
    nama: string;
}

export interface IAcademicActivePeriod {
    id: string;
    tahun: string;
    namaPeriode: string;
    kodePeriode: string;
    status: "ACTIVE" | "INACTIVE";
    tanggalMulai: string;
    tanggalSelesai: string;
}

export interface IPengumuman {
    id: string;
    siakPegawaiId: string;
    judul: string;
    isi: string;
    isActive: boolean;
    isPriority: boolean;
    banner: string;
}