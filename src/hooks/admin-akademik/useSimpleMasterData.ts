// src/hooks/admin-akademik/useSimpleMasterData.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ISimpleMasterDataService } from '../../api/admin-academic/simpleMasterDataService';
import { IApiResponseSuccess } from '../../types/common.types';

/**
 * Hook generik untuk entitas "Data Pelengkap" yang berbentuk lookup CRUD sederhana
 * (list tanpa paginasi + create/update/delete), mengikuti pola useLevels.
 */
export function useSimpleMasterData<T, TPayload>(
    queryKey: string,
    service: ISimpleMasterDataService<T, TPayload>
) {
    const queryClient = useQueryClient();

    const query = useQuery<T[], Error>({
        queryKey: [queryKey],
        queryFn: service.getAll,
    });

    const createMutation = useMutation<IApiResponseSuccess, Error, TPayload>({
        mutationFn: service.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
        },
    });

    const updateMutation = useMutation<IApiResponseSuccess, Error, { id: string; payload: TPayload }>({
        mutationFn: ({ id, payload }) => service.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
        },
    });

    const deleteMutation = useMutation<IApiResponseSuccess, Error, string>({
        mutationFn: service.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
        },
    });

    return {
        ...query,
        create: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        update: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        remove: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
    };
}
