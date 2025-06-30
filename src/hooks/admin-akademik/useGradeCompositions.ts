// src/hooks/admin-akademik/useGradeCompositions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gradeCompositionService } from '../../api/admin-academic/gradeCompositionService';
import { IGradeComposition, IGradeCompositionPayload, IApiResponseSuccess } from '../../types/models';

interface UseGradeCompositionsParams {
    tahunKurikulumId?: string;
}

export const useGradeCompositions = (params: UseGradeCompositionsParams) => {
    const queryClient = useQueryClient();

    const gradeCompositionsQuery = useQuery<IGradeComposition[], Error>({ // v5 syntax
        queryKey: ['gradeCompositions', params.tahunKurikulumId],
        queryFn: () => gradeCompositionService.getGradeCompositions(params),
        staleTime: Infinity,
        cacheTime: Infinity,
        enabled: !!params.tahunKurikulumId,
    });

    const createGradeCompositionMutation = useMutation<IApiResponseSuccess, Error, IGradeCompositionPayload>({ // v5 syntax
        mutationFn: gradeCompositionService.createGradeComposition,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gradeCompositions'] });
        },
    });

    const updateGradeCompositionMutation = useMutation<IApiResponseSuccess, Error, { id: string; payload: IGradeCompositionPayload }>({ // v5 syntax
        mutationFn: ({ id, payload }) => gradeCompositionService.updateGradeComposition(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gradeCompositions'] });
        },
    });

    const deleteGradeCompositionMutation = useMutation<IApiResponseSuccess, Error, string>({ // v5 syntax
        mutationFn: gradeCompositionService.deleteGradeComposition,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gradeCompositions'] });
        },
    });

    return {
        ...gradeCompositionsQuery,
        createGradeComposition: createGradeCompositionMutation.mutate,
        isCreating: createGradeCompositionMutation.isPending,
        createError: createGradeCompositionMutation.error,
        updateGradeComposition: updateGradeCompositionMutation.mutate,
        isUpdating: updateGradeCompositionMutation.isPending,
        updateError: updateGradeCompositionMutation.error,
        deleteGradeComposition: deleteGradeCompositionMutation.mutate,
        isDeleting: deleteGradeCompositionMutation.isPending,
        deleteError: deleteGradeCompositionMutation.error,
    };
};