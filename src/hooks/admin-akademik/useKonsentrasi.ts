import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { konsentrasiService } from '../../api/admin-academic/konsentrasiService';
import { IKonsentrasi, IKonsentrasiPayload } from '../../types/models';
import { IApiResponseSuccess } from '../../types/common.types';

/**
 * Data Konsentrasi selalu dilingkupi (scoped) oleh Program Studi yang dipilih,
 * sehingga query hanya aktif setelah programStudiId terisi.
 */
export function useKonsentrasi(programStudiId: string) {
    const queryClient = useQueryClient();
    const queryKey = ['konsentrasi', programStudiId];

    const query = useQuery<IKonsentrasi[], Error>({
        queryKey,
        queryFn: () => konsentrasiService.getAll(programStudiId),
        enabled: !!programStudiId,
    });

    const createMutation = useMutation<IApiResponseSuccess, Error, IKonsentrasiPayload>({
        mutationFn: konsentrasiService.create,
        onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    });

    const updateMutation = useMutation<IApiResponseSuccess, Error, { id: string; payload: IKonsentrasiPayload }>({
        mutationFn: ({ id, payload }) => konsentrasiService.update(id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    });

    const deleteMutation = useMutation<IApiResponseSuccess, Error, string>({
        mutationFn: konsentrasiService.remove,
        onSuccess: () => queryClient.invalidateQueries({ queryKey }),
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
