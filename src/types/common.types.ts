// src/types/common.types.ts

export interface IApiResponseSuccess {
    status: string;
    message: string;
}

export interface IApiResponseWithData<T> extends IApiResponseSuccess {
    data: T;
}

export interface IPagination {
    currentPage: number;
    perPage: number;
    totalPage: number;
    totalItems: number;
}

export interface IPaginatedResponse<T> extends IApiResponseSuccess {
    data: T[];
    pagination: IPagination;
}

export interface IAcademicPeriod {
    id: string;
    nama?: string;
    namaPeriode?: string;
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