// src/api/admin-akademik/bulkAssignmentService.ts
import { Api } from '../Index';
import { IBulkAssignmentPayload } from '../../types/models';
import { IApiResponseSuccess } from '../../types/common.types';

export const bulkAssignmentService = {
    assignCompositionToCourses: async (payload: IBulkAssignmentPayload): Promise<IApiResponseSuccess> => {
        try {
            const response = await Api.post<IApiResponseSuccess>(
                '/akademik/set-komposisi-mata-kuliah-massal', // Placeholder URL
                payload
            );
            return response.data;
        } catch (error) {
            console.error('Error assigning composition to courses:', error);
            throw error;
        }
    },
};