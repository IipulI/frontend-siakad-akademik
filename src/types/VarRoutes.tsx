type routeType = {
  [key: string]: string | routeType;
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
    history: "/akademik/rinwayat-KRS",
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
    paymentDetailHistory: "/keuangan/riwayat-keuangan/detail-transaksi",
  } as routeType,
};

export const AdminAcademicRoute = {
  dashboardAdminAcademic: "/admin-akademik/dashboard",
  collegeClass: {
    class: "/admin-akademik/kelas-kuliah",
    createClass: "/admin-akademik/tambah-kelas-kuliah",
    detailClass: "/admin-akademik/detail-kelas",
  } as routeType,
  student: {
    studentData: "  ",
    createStudent: "/portal/mahasiswa/data-mahasiswa",
    detailStudent: "/portal/mahasiswa/detail-mahasiswa",
    academicAdvisor: "/mahasiswa/pembimbing-akademik",
  },
  announcement: "/admin-akademik/pengumuman",
  curriculumYear: "/admin-akademik/tahun-kurikulum",
  courseManagement: {
    courseManagement: "/admin-akademik/mata-kuliah",
    addCourse: "/admin-akademik/mata-kuliah/tambah-mata-kuliah",
    editCourse: "/admin-akademik/mata-kuliah/edit-mata-kuliah",
    detailCourse: "/admin-akademik/mata-kuliah/detail-mata-kuliah",
    cplCpmkCourse: "/admin-akademik/mata-kuliah/cpl-cpmk",
    rpsCourse: "/admin-akademik/mata-kuliah/rps-mata-kuliah",
  },
  obeManagement: {
    obeManagement: "/admin-akademik/obe/manajemen-obe",
    graduateProfile: "/admin-akademik/obe/profil-lulusan",
    cpl: "/admin-akademik/obe/cpl",
    cpmk: "/admin-akademik/obe/cpmk",
    cpmkMataKuliah: "/admin-akademik/obe/cpmk-mata-kuliah",
  },
  prodiCurriculum: "/admin-akademik/kurikulum-prodi",
  rpsManagement: {
    rpsManagement: "/admin-akademik/rps",
    addRps: "/admin-akademik/rps/tambah-rps",
    editRps: "/admin-akademik/rps/edit-rps",
    detailRps: "/admin-akademik/rps/detail-rps",
  },
  setting: {
    year: "/admin-akademik/tahun-ajaran",
    period: "/admin-akademik/periode-akademik",
    scale: "/admin-akademik/skala-penilaian",
    level: "/admin-akademik/jenjang-pendidikan",
    limit: "/admin-akademik/batas-sks",
    composition: "/admin-akademik/komposisi-nilai",
    setComposition:
      "/admin-akademik/komposisi-nilai/set-komposisi-nilai-mata-kuliah",
  } as routeType,
};

export const AdminFinanceRoute: routeType = {
  dashboardAdminFinance: "/admin-keuangan/dashboard",
  editBill: "/admin-keuangan/dashboard/edit-tagihan",
  createBill: "/admin-keuangan/buat-tagihan",
  formCreateBill: "/admin-keuangan/buat-tagihan/form-buat-tagihan",
  studentBill: "/admin-keuangan/tagihan-mahasiswa",
  detailStudentBill:
    "/admin-keuangan/tagihan-mahasiswa/detail-tagihan-mahasiswa",
  componentBill: "/admin-keuangan/komponen-tagihan",
  createComponentBill:
    "/admin-keuangan/komponen-tagihan/tambah-komponen-tagihan",
  editComponentBill:
    "/admin-keuangan/komponen-tagihan/edit-komponen-tagihan/:id",
};

export const LecturerRoute = {
  dashboard: "/dosen/dashboard",
  guidance: {
    consultation: "/dosen/bimbingan/konsultasi",
    academic: "/dosen/bimbingan/akademik",
    proposal: "/dosen/bimbingan/proposal",
    finalProject: "/dosen/bimbingan/tugas-akhir",
    supporter: "/dosen/bimbingan/kegiatan-pendukung",
    advisor: "/dosen/bimbingan/pembimbing-akademik",
  } as routeType,
  announcement: {},
  schedule: {
    calendar: "/dosen/jadwal/kalender-akademik",
  },
  courses: {
    course: "/dosen/perkuliahan/mata-kuliah",
    class: "/dosen/perkuliahan/kelas-kuliah",
    stopStudy: "/dosen/perkuliahan/berhenti-studi",
  },
};
