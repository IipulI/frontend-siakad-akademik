// src/hooks/admin-akademik/useMataKuliahByProdiAndTahun.ts
import { useQuery } from "@tanstack/react-query";
import { IMataKuliah, IPaginatedResponse } from "../../types/models";
import { mataKuliahService } from "../../api/admin-academic/mataKuliahService";

interface UseMataKuliahParams {
    programStudiName: string;
    tahunKurikulumName: string;
    page?: number;
    size?: number;
    sort?: string;
}

export const useMataKuliahByProdiAndTahun = ({
                                                 programStudiName,
                                                 tahunKurikulumName,
                                                 page = 1,
                                                 size = 1000,
                                                 sort = 'createdAt,desc'
                                             }: UseMataKuliahParams) => {
    const queryKey = ['mataKuliahByProdiAndTahun', programStudiName, tahunKurikulumName, page, size, sort];

    const { data, isLoading, error, refetch } = useQuery<IPaginatedResponse<IMataKuliah>, Error>({ // v5 syntax
        queryKey: queryKey,
        queryFn: async () => {
            if (!programStudiName || !tahunKurikulumName) {
                return { status: 'success', message: 'No program studi or tahun kurikulum selected', data: [], pagination: { currentPage: 0, perPage: 0, totalPages: 0, totalItems: 0 } };
            }
            return mataKuliahService.getMataKuliah({
                programStudi: programStudiName,
                tahunKurikulum: tahunKurikulumName,
                page,
                size,
                sort
            });
        },
        enabled: !!programStudiName && !!tahunKurikulumName,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    return {
        data: data?.data, // Extract data array from paginated response
        isLoading,
        error,
        refetch,
        pagination: data?.pagination,
    };
};