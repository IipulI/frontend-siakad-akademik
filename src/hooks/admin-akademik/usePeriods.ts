// src/hooks/admin-academic/usePeriods.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { periodService } from '../../api/admin-academic/periodService'; // Import the new service
import { IPeriod, IPeriodPayload, IPaginatedResponse, IApiResponseSuccess } from '../../types/models'; // Import new types

interface UsePeriodsParams {
    page: number;
    limit: number;
    search: string;
    // You might add a 'status' filter here if your API supports it in the GET endpoint
    // status?: string;
}

export const usePeriods = (params: UsePeriodsParams) => {
    const queryClient = useQueryClient();

    // 1. Query for fetching academic periods
    const periodsQuery = useQuery<IPaginatedResponse<IPeriod>, Error>({
        queryKey: ['periods', params.page, params.limit, params.search],
        queryFn: () =>
            periodService.getPeriods({
                page: params.page,
                size: params.limit,
                keyword: params.search,
                // status: params.status, // Pass status if implemented
            }),
        keepPreviousData: true,
    });

    // 2. Mutation for creating a new academic period
    const createPeriodMutation = useMutation<IApiResponseSuccess, Error, IPeriodPayload>({
        mutationFn: periodService.createPeriod,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['periods'] });
        },
        onError: (error) => {
            console.error("Failed to create period:", error);
        }
    });

    // 3. Mutation for updating an academic period
    const updatePeriodMutation = useMutation<IApiResponseSuccess, Error, { id: string; payload: IPeriodPayload }>({
        mutationFn: ({ id, payload }) => periodService.updatePeriod(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['periods'] });
        },
        onError: (error) => {
            console.error("Failed to update period:", error);
        }
    });

    // 4. Mutation for deleting an academic period
    const deletePeriodMutation = useMutation<IApiResponseSuccess, Error, string>({
        mutationFn: periodService.deletePeriod,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['periods'] });
        },
        onError: (error) => {
            console.error("Failed to delete period:", error);
        }
    });

    return {
        ...periodsQuery, // Spread all properties from the query result
        createPeriod: createPeriodMutation.mutate,
        isCreating: createPeriodMutation.isPending,
        createError: createPeriodMutation.error,
        updatePeriod: updatePeriodMutation.mutate,
        isUpdating: updatePeriodMutation.isPending,
        updateError: updatePeriodMutation.error,
        deletePeriod: deletePeriodMutation.mutate,
        isDeleting: deletePeriodMutation.isPending,
        deleteError: deletePeriodMutation.error,
    };
};