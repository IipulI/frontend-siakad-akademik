import { profile } from "console";

type StudentRoute = {
  [key: string]: string | StudentRoute;
};

export const StudentRoute = {
  profile: {
    profile: "/data-mahasiswa",
    parent: "/data-mahasiswa/orang-tua",
    programStudy: "/data-mahasiswa/program-studi",
    educationHistory: "/data-mahasiswa/pendidikan-sebelumnya",
  } as StudentRoute,
  dashboard: "/dashboard",
  schedule: {
    exam: "/jadwal/ujian",
    calendar: "/jadwal/kalendar-akademik",
    announcement: "/jadwal/pengumuman",
    thisWeek: "/jadwal/jadwal-minggu-ini",
  } as StudentRoute,
  academic: {
    history: "/akademik/riwayat-KRS",
    retake: "/akademik/mengulang",
    studyPlan: "/akademik/pengisian-kartu-rencana-studi",
    studentGrade: "/akademik/nilai-mahasiswa",
  } as StudentRoute,
  studyResult: {
    studyResult: "/hasil-studi/kartu-hasil-studi",
    transcript: "/hasil-studi/transkrip",
  } as StudentRoute,
  payment: {
    payment: "/keuangan/tagihan-mahasiswa",
    paymentHistory: "/keuangan/riwayat-keuangan",
  } as StudentRoute,
};
