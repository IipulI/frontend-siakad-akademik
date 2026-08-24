import { useSimpleMasterData } from './useSimpleMasterData';
import { jenisTinggalService } from '../../api/admin-academic/jenisTinggalService';
import { IJenisTinggal, IJenisTinggalPayload } from '../../types/models';

export const useJenisTinggal = () =>
    useSimpleMasterData<IJenisTinggal, IJenisTinggalPayload>('jenisTinggal', jenisTinggalService);
