// src/hooks/admin-akademik/useAcademicYears.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academicYearService } from '../../api/admin-academic/academicYearService';
import { IAcademicYear, IPaginatedResponse, IAcademicYearPayload, IApiResponseSuccess } from '../../types/models';

interface UseAcademicYearsParams {
    keyword?: string;
    page?: number;
    limit?: number;
    sort?: string;
}

export const useAcademicYears = (params: UseAcademicYearsParams) => {
    const queryClient = useQueryClient();

    const academicYearsQuery = useQuery<IPaginatedResponse<IAcademicYear>, Error>({ // v5 syntax
        queryKey: ['academicYears', params.page, params.limit, params.search],
        queryFn: () => academicYearService.getAcademicYears({ page: params.page, size: params.limit, keyword: params.search }),
        keepPreviousData: true,
    });

    const createAcademicYearMutation = useMutation<IApiResponseSuccess, Error, IAcademicYearPayload>({ // v5 syntax
        mutationFn: academicYearService.createAcademicYear,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['academicYears'] });
        },
    });

    const updateAcademicYearMutation = useMutation<IApiResponseSuccess, Error, { id: string; payload: IAcademicYearPayload }>({ // v5 syntax
        mutationFn: ({ id, payload }) => academicYearService.updateAcademicYear(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['academicYears'] });
        },
    });

    const deleteAcademicYearMutation = useMutation<IApiResponseSuccess, Error, string>({ // v5 syntax
        mutationFn: academicYearService.deleteAcademicYear,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['academicYears'] });
        },
    });

    return {
        ...academicYearsQuery,
        createAcademicYear: createAcademicYearMutation.mutate,
        isCreating: createAcademicYearMutation.isPending,
        createError: createAcademicYearMutation.error,
        updateAcademicYear: updateAcademicYearMutation.mutate,
        isUpdating: updateAcademicYearMutation.isPending,
        updateError: updateAcademicYearMutation.error,
        deleteAcademicYear: deleteAcademicYearMutation.mutate,
        isDeleting: deleteAcademicYearMutation.isPending,
        deleteError: deleteAcademicYearMutation.error,
    };
};