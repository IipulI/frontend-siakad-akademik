import { useQuery } from '@tanstack/react-query';
import { fakultasService, IFakultasOption } from '../../api/admin-academic/fakultasService';
import { IOption } from '../../types/models';

export const useFakultasOptions = () => {
    const query = useQuery<IFakultasOption[], Error>({
        queryKey: ['fakultasOptions'],
        queryFn: fakultasService.getAll,
    });

    const options: IOption[] = (query.data || []).map((f) => ({ value: f.id, label: f.nama }));

    return { ...query, options };
};
