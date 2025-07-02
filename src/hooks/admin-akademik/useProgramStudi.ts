// src/hooks/admin-akademik/useProgramStudi.ts
import { useQuery } from '@tanstack/react-query';
import { programStudiService } from '../../api/admin-academic/programStudiService';
import { IProgramStudi } from '../../types/models';

export const useProgramStudi = () => {
    const programStudiQuery = useQuery<IProgramStudi[], Error>({ // v5 syntax
        queryKey: ['programStudi'],
        queryFn: programStudiService.getProgramStudi,
        staleTime: Infinity,
        cacheTime: Infinity,
    });

    return {
        ...programStudiQuery,
    };
};