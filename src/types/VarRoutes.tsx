type routeType = {
  [key: string]: string | string;
};

export const StudentRoute = {
  dashboard: "/dashboard",
  profile: {
    profile: "/data-mahasiswa",
    parent: "/data-mahasiswa/orang-tua",
    programStudy: "/data-mahasiswa/program-studi",
    educationHistory: "/data-mahasiswa/pendidikan-sebelumnya",
  } as routeType,
  schedule: {
    exam: "/jadwal/ujian",
    calendar: "/jadwal/kalendar-akademik",
    announcement: "/jadwal/pengumuman",
    thisWeek: "/jadwal/jadwal-minggu-ini",
  } as routeType,
  academic: {
    history: "/akademik/riwayat-KRS",
    retake: "/akademik/mengulang",
    studyPlan: "/akademik/pengisian-kartu-rencana-studi",
    studentGrade: "/akademik/nilai-mahasiswa",
  } as routeType,
  studyResult: {
    studyResult: "/hasil-studi/kartu-hasil-studi",
    transcript: "/hasil-studi/transkrip",
  } as routeType,
  payment: {
    payment: "/keuangan/tagihan-mahasiswa",
    paymentHistory: "/keuangan/riwayat-keuangan",
  } as routeType,
};

export const AdminAcademicRoute = {
  dashboardAdminAcademic: "/admin-akademik/dashboard",
  collegeClass: {
    class: "/admin-akademik/kelas-kuliah",
  } as routeType,
};

export const AdminFinanceRoute: routeType = {
  dashboardAdminFinance: "/admin-finance/dashboard",
};
