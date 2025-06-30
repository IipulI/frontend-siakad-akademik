// src/hooks/admin-academic/useBulkAssignment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkAssignmentService } from '../../api/admin-academic/bulkAssignmentService';
import { IBulkAssignmentPayload, IApiResponseSuccess } from '../../types/models';

export const useBulkAssignment = () => {
    const queryClient = useQueryClient(); // Digunakan untuk invalidasi cache jika perlu

    const bulkAssignmentMutation = useMutation<IApiResponseSuccess, Error, IBulkAssignmentPayload>({
        mutationFn: bulkAssignmentService.assignCompositionToCourses,
        onSuccess: (response) => {
            // Opsional: invalidasi cache data yang terpengaruh jika ada
            // Contoh: queryClient.invalidateQueries(['mataKuliah']);
            // queryClient.invalidateQueries(['laporanNilaiKomposisi']);
            console.log('Bulk assignment successful:', response.message);
        },
        onError: (error) => {
            console.error('Bulk assignment failed:', error);
        }
    });

    return {
        assignComposition: bulkAssignmentMutation.mutate,
        isAssigning: bulkAssignmentMutation.isPending,
        assignError: bulkAssignmentMutation.error,
    };
};