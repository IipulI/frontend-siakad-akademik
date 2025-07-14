// src/hooks/admin-academic/useMataKuliah.ts
import { useQuery } from '@tanstack/react-query';
import { mataKuliahService } from '../../api/admin-academic/mataKuliahService';
import { IMataKuliah } from '../../types/models';

/**
 * Interface untuk parameter hook useMataKuliah.
 * Mengandung parameter filter untuk mengambil mata kuliah.
 */
interface UseMataKuliahParams {
    tahunKurikulumId?: string;
    programStudiId?: string;
    // ... jika paginated, tambahkan page, limit, search
    enabled?: boolean; // Agar query bisa dinonaktifkan jika filter belum lengkap
}

export const useMataKuliah = (params: UseMataKuliahParams) => {
    // Query akan aktif hanya jika tahunKurikulumId dan programStudiId tersedia
    const queryEnabled = !!params.tahunKurikulumId && !!params.programStudiId && (params.enabled !== false);

    return useQuery<IMataKuliah[], Error>({
        queryKey: ['mataKuliah', params.tahunKurikulumId, params.programStudiId],
        queryFn: () => mataKuliahService.getMataKuliah(params),
        enabled: queryEnabled, // Query hanya akan berjalan jika queryEnabled true
        staleTime: 5 * 60 * 1000, // Data dianggap fresh selama 5 menit
        cacheTime: 10 * 60 * 1000, // Data tetap di cache selama 10 menit
    });
};