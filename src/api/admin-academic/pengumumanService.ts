import { createPengumumanService } from "../pengumumanServiceFactory";

// Announcements for the admin akademik portal — GET /akademik/pengumuman
export const pengumumanService = createPengumumanService("/akademik/pengumuman");
