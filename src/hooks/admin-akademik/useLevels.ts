// src/hooks/admin-academic/useLevels.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { levelService } from '../../api/admin-academic/levelService'; // Import the new service
import { ILevel, ILevelPayload, IApiResponseSuccess } from '../../types/models'; // Import new types

export const useLevels = () => {
    const queryClient = useQueryClient();

    // 1. Query for fetching educational levels (no pagination/search params needed)
    const levelsQuery = useQuery<ILevel[], Error>({
        queryKey: ['levels'], // Simple query key as no parameters
        queryFn: levelService.getLevels,
        // Keep this true if you want previous data to display during refetches
        // For non-paginated lists, it might not be as critical but doesn't hurt.
        keepPreviousData: false,
    });

    // 2. Mutation for creating a new level
    const createLevelMutation = useMutation<IApiResponseSuccess, Error, ILevelPayload>({
        mutationFn: levelService.createLevel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['levels'] }); // Refetch the list after creation
        },
        onError: (error) => {
            console.error("Failed to create level:", error);
        }
    });

    // 3. Mutation for updating an educational level
    const updateLevelMutation = useMutation<IApiResponseSuccess, Error, { id: string; payload: ILevelPayload }>({
        mutationFn: ({ id, payload }) => levelService.updateLevel(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['levels'] }); // Refetch the list after update
        },
        onError: (error) => {
            console.error("Failed to update level:", error);
        }
    });

    // 4. Mutation for deleting an educational level
    const deleteLevelMutation = useMutation<IApiResponseSuccess, Error, string>({
        mutationFn: levelService.deleteLevel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['levels'] }); // Refetch the list after deletion
        },
        onError: (error) => {
            console.error("Failed to delete level:", error);
        }
    });

    return {
        ...levelsQuery, // Spread all properties from the query result (data, isLoading, isError, error)
        createLevel: createLevelMutation.mutate,
        isCreating: createLevelMutation.isPending,
        createError: createLevelMutation.error,
        updateLevel: updateLevelMutation.mutate,
        isUpdating: updateLevelMutation.isPending,
        updateError: updateLevelMutation.error,
        deleteLevel: deleteLevelMutation.mutate,
        isDeleting: deleteLevelMutation.isPending,
        deleteError: deleteLevelMutation.error,
    };
};