// src/hooks/admin-akademik/useAssignSingleComposition.ts
import { useMutation } from "@tanstack/react-query";
import { mataKuliahCompositionService } from "../../api/admin-academic/mataKuliahCompositionService";
import { ISingleAssignmentPayload, IApiResponseSuccess } from "../../types/models";

export const useAssignSingleComposition = () => {
    const { mutateAsync, isPending, error, isSuccess } = useMutation< // isPending is v5 equivalent of isLoading
        IApiResponseSuccess,
        Error,
        ISingleAssignmentPayload
    >({ // v5 syntax
        mutationFn: (payload) => mataKuliahCompositionService.assignMataKuliahComposition(payload),
    });

    return {
        assignSingleComposition: mutateAsync,
        isAssigningSingle: isPending,
        assignSingleError: error,
        assignSingleSuccess: isSuccess,
    };
};