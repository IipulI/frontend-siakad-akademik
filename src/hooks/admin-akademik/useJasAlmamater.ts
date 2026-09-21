import { useSimpleMasterData } from './useSimpleMasterData';
import { jasAlmamaterService } from '../../api/admin-academic/jasAlmamaterService';
import { IJasAlmamater, IJasAlmamaterPayload } from '../../types/models';

export const useJasAlmamater = () =>
    useSimpleMasterData<IJasAlmamater, IJasAlmamaterPayload>('jasAlmamater', jasAlmamaterService);
