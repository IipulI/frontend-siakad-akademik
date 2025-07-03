// src/hooks/admin-academic/useLimitSKS.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { limitSksService } from '../../api/admin-academic/limitSksService';
import { ILimitSKS, ILimitSKSPayload, IApiResponseSuccess } from '../../types/models'; // IPaginatedResponse is no longer needed here

// Remove UseLimitSKSParams as it's no longer paginated
// interface UseLimitSKSParams { ... }

export const useLimitSKS = () => { // No params needed for this hook
    const queryClient = useQueryClient();

    // 1. Query for fetching SKS Limits (no params)
    const limitSKSQuery = useQuery<ILimitSKS[], Error>({ // Returns ILimitSKS[] directly
        queryKey: ['limitSKS'], // Simple query key
        queryFn: limitSksService.getLimitSKS, // No params passed to queryFn
        keepPreviousData: false, // Not needed for non-paginated data
    });

    // 2. Mutation for creating a new SKS Limit rule
    const createLimitSKSMutation = useMutation<IApiResponseSuccess, Error, ILimitSKSPayload>({
        mutationFn: limitSksService.createLimitSKS,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['limitSKS'] });
        },
        onError: (error) => {
            console.error("Failed to create SKS Limit:", error);
        }
    });

    // 3. Mutation for updating an SKS Limit rule
    const updateLimitSKSMutation = useMutation<IApiResponseSuccess, Error, { id: string; payload: ILimitSKSPayload }>({
        mutationFn: ({ id, payload }) => limitSksService.updateLimitSKS(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['limitSKS'] });
        },
        onError: (error) => {
            console.error("Failed to update SKS Limit:", error);
        }
    });

    // 4. Mutation for deleting an SKS Limit rule
    const deleteLimitSKSMutation = useMutation<IApiResponseSuccess, Error, string>({
        mutationFn: limitSksService.deleteLimitSKS,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['limitSKS'] });
        },
        onError: (error) => {
            console.error("Failed to delete SKS Limit:", error);
        }
    });

    return {
        ...limitSKSQuery, // Spread all properties from the query result
        createLimitSKS: createLimitSKSMutation.mutate,
        isCreating: createLimitSKSMutation.isPending,
        createError: createLimitSKSMutation.error,
        updateLimitSKS: updateLimitSKSMutation.mutate,
        isUpdating: updateLimitSKSMutation.isPending,
        updateError: updateLimitSKSMutation.error,
        deleteLimitSKS: deleteLimitSKSMutation.mutate,
        isDeleting: deleteLimitSKSMutation.isPending,
        deleteError: deleteLimitSKSMutation.error,
    };
};