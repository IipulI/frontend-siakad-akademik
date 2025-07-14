// src/hooks/admin-academic/useGradingScales.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gradingScaleService } from '../../api/admin-academic/gradingScaleService'; // Import the service
import { IGradingScale, IGradingScalePayload, IPaginatedResponse, IApiResponseSuccess } from '../../types/models';

/**
 * Interface for parameters passed to the useGradingScales hook.
 * These parameters will be used as filters for the GET request.
 */
interface UseGradingScalesParams {
    tahunAjaranName?: string;   // Academic Year Name for filtering (e.g., from dropdown selection)
    programStudiName?: string;  // Program Studi Name for filtering (e.g., from dropdown selection)
    page: number;               // Current page number for pagination
    limit: number;              // Items per page for pagination
    // search?: string; // Add this if the API supports a 'keyword' search for grading scales
}

export const useGradingScales = (params: UseGradingScalesParams) => {
    const queryClient = useQueryClient();

    // 1. Query for fetching Grading Scales (main data for the table)
    const gradingScalesQuery = useQuery<IPaginatedResponse<IGradingScale>, Error>({
        // The query key should uniquely identify the data.
        // It must include all parameters that affect the data being fetched.
        queryKey: [
            'gradingScales',
            params.page,
            params.limit,
            params.tahunAjaranName,
            params.programStudiName,
            // params.search,
        ],
        queryFn: () =>
            gradingScaleService.getGradingScales({
                page: params.page,
                size: params.limit,
                tahunAjaran: params.tahunAjaranName,
                programStudi: params.programStudiName,
                // keyword: params.search,
            }),
        keepPreviousData: true, // Keeps previous data visible while new data is loading for smoother UX
    });

    // 2. Mutation for creating a new Grading Scale
    const createGradingScaleMutation = useMutation<IApiResponseSuccess, Error, IGradingScalePayload>({
        mutationFn: gradingScaleService.createGradingScale,
        onSuccess: () => {
            // Invalidate the 'gradingScales' query to refetch the list and show the new item
            queryClient.invalidateQueries({ queryKey: ['gradingScales'] });
        },
        onError: (error) => {
            console.error("Failed to create Grading Scale:", error);
            // You can add more sophisticated error handling here (e.g., show a toast notification)
        }
    });

    // 3. Mutation for updating an existing Grading Scale
    const updateGradingScaleMutation = useMutation<IApiResponseSuccess, Error, { id: string; payload: IGradingScalePayload }>({
        mutationFn: ({ id, payload }) => gradingScaleService.updateGradingScale(id, payload),
        onSuccess: () => {
            // Invalidate the 'gradingScales' query to refetch the updated list
            queryClient.invalidateQueries({ queryKey: ['gradingScales'] });
        },
        onError: (error) => {
            console.error("Failed to update Grading Scale:", error);
        }
    });

    // 4. Mutation for deleting a Grading Scale
    const deleteGradingScaleMutation = useMutation<IApiResponseSuccess, Error, string>({
        mutationFn: gradingScaleService.deleteGradingScale,
        onSuccess: () => {
            // Invalidate the 'gradingScales' query to refetch the list after deletion
            queryClient.invalidateQueries({ queryKey: ['gradingScales'] });
        },
        onError: (error) => {
            console.error("Failed to delete Grading Scale:", error);
        }
    });

    return {
        // Expose query results (data, isLoading, isError, error, refetch)
        ...gradingScalesQuery,
        // Expose mutation functions and their loading/error states
        createGradingScale: createGradingScaleMutation.mutate,
        isCreating: createGradingScaleMutation.isPending,
        createError: createGradingScaleMutation.error,
        updateGradingScale: updateGradingScaleMutation.mutate,
        isUpdating: updateGradingScaleMutation.isPending,
        updateError: updateGradingScaleMutation.error,
        deleteGradingScale: deleteGradingScaleMutation.mutate,
        isDeleting: deleteGradingScaleMutation.isPending,
        deleteError: deleteGradingScaleMutation.error,
    };
};