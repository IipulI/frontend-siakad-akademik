// src/hooks/admin-akademik/useMataKuliahCompositionDetails.ts
import { useQuery } from '@tanstack/react-query';
import { mataKuliahCompositionDetailsService } from '../../api/admin-academic/mataKuliahCompositionDetailsService';
import { IMataKuliahCompositionDetailsResponse } from '../../types/models';

interface UseMataKuliahCompositionDetailsParams {
    mataKuliahId?: string;
    enabled?: boolean;
}

export const useMataKuliahCompositionDetails = (params: UseMataKuliahCompositionDetailsParams) => {
    const queryEnabled = !!params.mataKuliahId && (params.enabled !== false);

    const queryResult = useQuery<IMataKuliahCompositionDetailsResponse[], Error>({ // v5 syntax
        queryKey: ['mataKuliahCompositionDetails', params.mataKuliahId],
        queryFn: () => mataKuliahCompositionDetailsService.getMataKuliahComposition(params.mataKuliahId!),
        enabled: queryEnabled,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    return {
        data: queryResult.data,
        isLoading: queryResult.isLoading,
        error: queryResult.error,
        refetch: queryResult.refetch,
    };
};