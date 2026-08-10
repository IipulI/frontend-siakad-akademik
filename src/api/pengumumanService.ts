import { createPengumumanService } from "./pengumumanServiceFactory";

// Announcements for the student (mahasiswa) portal — GET /mahasiswa/pengumuman
export const pengumumanService = createPengumumanService("/mahasiswa/pengumuman");
