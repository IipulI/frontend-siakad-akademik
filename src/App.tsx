import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/studentModule/Dashboard";
import Exam from "./pages/studentModule/schedule/Exam";
import CalendarAcademic from "./pages/studentModule/schedule/CalendarAcademic";
import StudentInformation from "./pages/studentModule/profile/StudentInformation";
import ThisWeek from "./pages/studentModule/schedule/ThisWeek";
import History from "./pages/studentModule/academic/History";
import Retake from "./pages/studentModule/academic/Retake";
import Announcement from "./pages/studentModule/schedule/Announcement";
import AnnouncementDetailPage from "./pages/studentModule/schedule/AnnouncmentDetailPage";
import ParentInformation from "./pages/studentModule/profile/ParentInformation";
import StudentPayment from "./pages/studentModule/payment/StudentPayment";
import ProgramStudy from "./pages/studentModule/profile/ProgramStudy";
import EducationHistory from "./pages/studentModule/profile/EducationHistory";
import StudyPlanCard from "./pages/studentModule/academic/StudyPlanCard";
import StudentGrade from "./pages/studentModule/academic/StudentGrade";
import StudyResultCard from "./pages/studentModule/study-result/StudyResultCard";
import TranscriptGrade from "./pages/studentModule/study-result/TranscriptGrade";
import StudentPaymentHistory from "./pages/studentModule/payment/StudentPaymentHistory";
import CollegeClass from "./pages/admin-academic/class/CollegeClass";
import {
  AdminFinanceRoute,
  StudentRoute,
  AdminAcademicRoute,
  LecturerRoute,
} from "./types/VarRoutes";
import DashboardAdminFinance from "./pages/admin-finance/DashboardAdminFinance";
import DashboardAdminAcademic from "./pages/admin-academic/DashboardAdminAcademic";
import StudentData from "./pages/admin-academic/student/StudentData";
import CreateStudent from "./pages/admin-academic/student/CreateStudent";
import DetailStudent from "./pages/admin-academic/student/DetailStudent";
import AcademikAdvisor from "./pages/admin-academic/student/AcademicAdvisor";
import AnnouncementAdminAcademic from "./pages/admin-academic/announcement/AnnouncementAdminAcademic";
import RencanaEvaluasi from "./pages/admin-academic/academic/ObeRencanaEvaluasi";
import ObeManajemenCapaian from "./pages/admin-academic/academic/ObeManajemenCapaian";
import ObeTemplateEvaluasi from "./pages/admin-academic/academic/ObeTemplateEvaluasi";
import ObeKurikulumProdi from "./pages/admin-academic/academic/ObeKurikulumProdi";
import ObeSetGrupMk from "./pages/admin-academic/academic/ObeSetGrupMk";
import ObeTahunKurikulum from "./pages/admin-academic/academic/ObeTahunKurikulum";
import YearAdminAcademic from "./pages/admin-academic/setting/YearAdminAcademic";
import PeriodAdminAcademic from "./pages/admin-academic/setting/PeriodAdminAcademy";
import ScaleAdminAcademic from "./pages/admin-academic/setting/ScaleAdminAcademic";
import LimitSKSAdminAcademic from "./pages/admin-academic/setting/LimitSKSAdminAcademic";
import LevelAdminAcademic from "./pages/admin-academic/setting/LevelAdminAcademic";
import CompositionAdminAcademic from "./pages/admin-academic/setting/CompositionAdminAcademic";
import SetCompositionAdminAcademic from "./pages/admin-academic/setting/SetCompositionAdminAcademic";
import CurriculumYear from "./pages/admin-academic/academic/CurriculumYear";
import CourseManagement from "./pages/admin-academic/academic/CourseManagement";
import AddCourse from "./pages/admin-academic/academic/AddCourse";
import EditCourse from "./pages/admin-academic/academic/EditCourse";
import DetailCourse from "./pages/admin-academic/academic/DetailCourse";
import CplCpmkCourse from "./pages/admin-academic/academic/CplCpmkCourse";
import RpsCourse from "./pages/admin-academic/academic/RpsCourse";
import {OBEManagement} from "./pages/admin-academic/academic/OBEManagement";
import GraduateProfile from "./pages/admin-academic/academic/GraduateProfile";
import ObeCpl from "./pages/admin-academic/academic/ObeCpl";
import ObePlCplMapping from "./pages/admin-academic/academic/ObePlCplMapping";
import ObeInputNilaiKelas from "./pages/admin-academic/academic/ObeInputNilaiKelas";
import ObeSoalKomponen from "./pages/admin-academic/academic/ObeSoalKomponen";
import ObeInputNilaiSoal from "./pages/admin-academic/academic/ObeInputNilaiSoal";
import ObeIntegrasiCbt from "./pages/admin-academic/academic/ObeIntegrasiCbt";
import ObeMonitoring from "./pages/admin-academic/academic/ObeMonitoring";
import ObeCekSoal from "./pages/admin-academic/academic/ObeCekSoal";
import ObeResetNilai from "./pages/admin-academic/academic/ObeResetNilai";
import ObeCpmk from "./pages/admin-academic/academic/ObeCpmk";
import ObeCpmkMatkul from "./pages/admin-academic/academic/ObeCpmkMatkul";
import ObePemetaanCpl from "./pages/admin-academic/academic/ObePemetaanCpl";
import ObeDataMataKuliah from "./pages/admin-academic/academic/ObeDataMataKuliah";
import ObeDetailRps from "./pages/admin-academic/academic/ObeDetailRps";
import ObeRencanaPembelajaran from "./pages/admin-academic/academic/ObeRencanaPembelajaran";
import CurriculumProdi from "./pages/admin-academic/academic/CurriculumProdi";
import RpsManagement from "./pages/admin-academic/academic/RpsManagement";
import AddRps from "./pages/admin-academic/academic/AddRps";
import EditRps from "./pages/admin-academic/academic/EditRps";
import DetailRps from "./pages/admin-academic/academic/DetailRps";
import CreateCollegeClass from "./pages/admin-academic/class/CreateCollegeClass";
import DetailCollegeClass from "./pages/admin-academic/class/DetailCollegeClass";
import DashboardLecturer from "./pages/lecturer/DashboardLecturer";
import CourseLecturer from "./pages/lecturer/courses/CourseLecturer";
import AdvisorLecturer from "./pages/lecturer/guidance/AdvisorLecturer";
import ConsultationLecturer from "./pages/lecturer/guidance/ConsultationLecturer";
import FormConsultationLecturer from "./pages/lecturer/guidance/FormConsultationLecturer";
import ProposalLecturer from "./pages/lecturer/guidance/ProposalLecturer";
import FinalProjectLecturer from "./pages/lecturer/guidance/FinalProjectLecturer";
import SupporterLecturer from "./pages/lecturer/guidance/SupporterLecturer";
import ClassLecturer from "./pages/lecturer/courses/ClassLecturer";
import EditBill from "./pages/admin-finance/EditBill";
import CreateBill from "./pages/admin-finance/create-bill/CreateBill";
import FormCreateBill from "./pages/admin-finance/create-bill/FormCreateBill";
import StudentBill from "./pages/admin-finance/student-bill/StudentBill";
import DetailStudentBill from "./pages/admin-finance/student-bill/DetailStudentBill";
import ComponentBill from "./pages/admin-finance/component-bill/ComponentBill";
import CreateComponentBill from "./pages/admin-finance/component-bill/CreateComponentBill";
import EditComponentBill from "./pages/admin-finance/component-bill/EditComponentBill";
import PaymentDetailTransaction from "./pages/studentModule/payment/PaymentDetailTransaction";
import DetailClassLecturer from "./pages/lecturer/courses/DetailClassLecturer";
import DetailAdvisorLecturer from "./pages/lecturer/guidance/DetailAdvisorLecturer";
import DetailCourseLecturer from "./pages/lecturer/courses/DetailCourseLecturer";
import ScheduleLecturer from "./pages/lecturer/schedule/ScheduleLecturer";
import DetailAnnouncement from "./components/schedule/DetailAnnouncement";
import AddAnnouncementAdminAcademic from "./pages/admin-academic/announcement/AddAnnouncementAdminAcademic";
import NotFound from "./pages/NotFound";
import DetailOBE from "./pages/admin-academic/academic/DetailOBE";
import Forbidden from "./pages/ForbiddenPage";
import ComingSoon from "./pages/ComingSoon";

export default function App() {
  return (
    <Routes>
      {/* Index Route */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<LoginPage />} />

      {/* Route Dashboard*/}
      <Route path={String(StudentRoute.dashboard)} element={<Dashboard />} />

      {/* Route Jadwal */}
      <Route path={String(StudentRoute.schedule.exam)} element={<Exam />} />
      <Route
        path={String(StudentRoute.schedule.calendar)}
        element={<CalendarAcademic />}
      />
      <Route
        path={String(StudentRoute.schedule.announcement)}
        element={<Announcement />}
      />
      <Route
        path={String(StudentRoute.schedule.announcementDetail)}
        element={<AnnouncementDetailPage />}
      />
      <Route
        path={String(StudentRoute.schedule.thisWeek)}
        element={<ThisWeek />}
      />

      {/* Route Profile */}
      <Route
        path={String(StudentRoute.profile.profile)}
        element={<StudentInformation />}
      />
      <Route
        path={String(StudentRoute.profile.parent)}
        element={<ParentInformation />}
      />
      <Route
        path={String(StudentRoute.profile.programStudy)}
        element={<ProgramStudy />}
      />
      <Route
        path={String(StudentRoute.profile.educationHistory)}
        element={<EducationHistory />}
      />

      {/* Route Akademik */}
      <Route
        path={String(StudentRoute.academic.history)}
        element={<History />}
      />
      <Route path={String(StudentRoute.academic.retake)} element={<Retake />} />
      <Route
        path={String(StudentRoute.academic.studyPlan)}
        element={<StudyPlanCard />}
      />
      <Route
        path={String(StudentRoute.academic.studentGrade)}
        element={<StudentGrade />}
      />

      {/* Route Hasil Studi */}
      <Route
        path={String(StudentRoute.studyResult.studyResult)}
        element={<StudyResultCard />}
      />
      <Route
        path={String(StudentRoute.studyResult.transcript)}
        element={<TranscriptGrade />}
      />

      {/* route payment */}
      <Route
        path={String(StudentRoute.payment.payment)}
        element={<StudentPayment />}
      />
      <Route
        path={String(StudentRoute.payment.paymentHistory)}
        element={<StudentPaymentHistory />}
      />
      <Route
        path={String(StudentRoute.payment.paymentDetailHistory)}
        element={<PaymentDetailTransaction />}
      />

      {/* Route Untuk Admin Akademik */}
      <Route
        path={String(AdminAcademicRoute.dashboardAdminAcademic)}
        element={<DashboardAdminAcademic />}
      />
      <Route
        path={String(AdminAcademicRoute.collegeClass.class)}
        element={<CollegeClass />}
      />
      <Route
        path={String(AdminAcademicRoute.collegeClass.class)}
        element={<CollegeClass />}
      />
      <Route
        path={String(AdminAcademicRoute.collegeClass.createClass)}
        element={<CreateCollegeClass />}
      />
      <Route
        path={String(`${AdminAcademicRoute.collegeClass.detailClass}/:id`)}
        element={<DetailCollegeClass />}
      />
      <Route
        path={String(AdminAcademicRoute.student.studentData)}
        element={<StudentData />}
      />
      <Route
        path={String(AdminAcademicRoute.student.createStudent)}
        element={<CreateStudent />}
      />
      <Route
        path={String(AdminAcademicRoute.student.detailStudent)}
        element={<DetailStudent />}
      />
      <Route
        path={String(AdminAcademicRoute.student.academicAdvisor)}
        element={<AcademikAdvisor />}
      />

      {/* Route untuk admin akademik - pengumuman */}
      <Route
        path={String(AdminAcademicRoute.announcement)}
        element={<AnnouncementAdminAcademic />}
      />
      <Route
        path={String(AdminAcademicRoute.detailAnnouncement)}
        element={<DetailAnnouncement />}
      />


      <Route
        path={String(AdminAcademicRoute.addAnnouncement)}
        element={<AddAnnouncementAdminAcademic />}
      />
      {/* Route untuk admin akademik - pengaturan */}
      <Route
        path={String(AdminAcademicRoute.setting.year)}
        element={<YearAdminAcademic />}
      />
      <Route
        path={String(AdminAcademicRoute.setting.period)}
        element={<PeriodAdminAcademic />}
      />
      <Route
        path={String(AdminAcademicRoute.setting.scale)}
        element={<ScaleAdminAcademic />}
      />
      <Route
        path={String(AdminAcademicRoute.setting.level)}
        element={<LevelAdminAcademic />}
      />
      <Route
        path={String(AdminAcademicRoute.setting.limit)}
        element={<LimitSKSAdminAcademic />}
      />
      <Route
        path={String(AdminAcademicRoute.setting.composition)}
        element={<CompositionAdminAcademic />}
      />
      <Route
        path={String(AdminAcademicRoute.setting.setComposition)}
        element={<SetCompositionAdminAcademic />}
      />

      {/* Route untuk admin akademik - Tahun Kurikulum */}
      <Route
        path={String(AdminAcademicRoute.curriculumYear)}
        element={<CurriculumYear />}
      />

      {/* Route untuk admin akademik - Manajemen Mata Kuliah*/}
      <Route
        path={String(AdminAcademicRoute.courseManagement.courseManagement)}
        element={<CourseManagement />}
      />

      <Route
        path={String(AdminAcademicRoute.courseManagement.addCourse)}
        element={<AddCourse />}
      />

      <Route
        path={`${AdminAcademicRoute.courseManagement.editCourse}/:id`}
        element={<EditCourse />}
      />

      <Route
        path={`${AdminAcademicRoute.courseManagement.detailCourse}/:id`}
        element={<DetailCourse />}
      />

      <Route
        path={`${AdminAcademicRoute.courseManagement.cplCpmkCourse}/:id`}
        element={<CplCpmkCourse />}
      />

      <Route
        path={`${AdminAcademicRoute.courseManagement.rpsCourse}/:id`}
        element={<RpsCourse />}
      />

      {/* Route untuk admin akademik - OBE Management */}
      <Route
        path={String(AdminAcademicRoute.obeManagement.obeManagement)}
        element={<OBEManagement />}
      />

      <Route
        path={`${AdminAcademicRoute.obeManagement.graduateProfile}/:id`}
        element={<GraduateProfile />}
      />

      <Route
        path={`${AdminAcademicRoute.obeManagement.detailOBE}/:id`}
        element={<DetailOBE />}
      />

      <Route
        path={`${AdminAcademicRoute.obeManagement.cpl}/:id`}
        element={<ObeCpl />}
      />

      <Route
        path={`${AdminAcademicRoute.obeManagement.plToCpl}/:id`}
        element={<ObePlCplMapping />}
      />

      <Route
        path={`${AdminAcademicRoute.obeManagement.cpmk}/:id`}
        element={<ObeCpmk />}
      />

      <Route
        path={`${AdminAcademicRoute.obeManagement.cpmkMataKuliah}/:obeId/:mataKuliahId`}
        element={<ObeCpmkMatkul />}
      />

      <Route
        path={`${AdminAcademicRoute.obeManagement.cplMataKuliah}/:obeId/:mataKuliahId`}
        element={<ObePemetaanCpl />}
      />

      <Route
        path={`${AdminAcademicRoute.obeManagement.detailObeCourse}/:obeId/:mataKuliahId`}
        element={<ObeDataMataKuliah />}
      />

      <Route
        path={`${AdminAcademicRoute.obeManagement.detailRps}/:obeId/:mataKuliahId`}
        element={<ObeDetailRps />}
      />

      <Route
        path={`${AdminAcademicRoute.obeManagement.rencanaPembelajaran}/:obeId/:mataKuliahId`}
        element={<ObeRencanaPembelajaran />}
      />

      <Route
        path={`${AdminAcademicRoute.obeManagement.rencanaEvaluasi}/:obeId/:mataKuliahId`}
        element={<RencanaEvaluasi />}
      />

      {/* Route untuk admin akademik - OBE Management (Sub-Dropdown) */}
      <Route
        path={String(AdminAcademicRoute.obeManagement.manajemenCapaian)}
        element={<ObeManajemenCapaian />}
      />
      <Route
        path={String(AdminAcademicRoute.obeManagement.templateEvaluasi)}
        element={<ObeTemplateEvaluasi />}
      />
      <Route
        path={String(AdminAcademicRoute.obeManagement.kurikulumProdi)}
        element={<ObeKurikulumProdi />}
      />
      <Route
        path={String(AdminAcademicRoute.obeManagement.setGrupMk)}
        element={<ObeSetGrupMk />}
      />
      <Route
        path={String(AdminAcademicRoute.obeManagement.tahunKurikulum)}
        element={<ObeTahunKurikulum />}
      />

      {/* Route untuk admin akademik - Penilaian & Monitoring OBE */}
      <Route
        path={String(AdminAcademicRoute.obeManagement.nilaiKelas)}
        element={<ObeInputNilaiKelas />}
      />
      <Route
        path={String(AdminAcademicRoute.obeManagement.soalKomponen)}
        element={<ObeSoalKomponen />}
      />
      <Route
        path={String(AdminAcademicRoute.obeManagement.nilaiSoal)}
        element={<ObeInputNilaiSoal />}
      />
      <Route
        path={String(AdminAcademicRoute.obeManagement.integrasiCbt)}
        element={<ObeIntegrasiCbt />}
      />
      <Route
        path={String(AdminAcademicRoute.obeManagement.monitoring)}
        element={<ObeMonitoring />}
      />
      <Route
        path={String(AdminAcademicRoute.obeManagement.cekSoal)}
        element={<ObeCekSoal />}
      />
      <Route
        path={String(AdminAcademicRoute.obeManagement.resetNilai)}
        element={<ObeResetNilai />}
      />

      {/* Route untuk admin akademik - Kurikulum Prodi */}
      <Route
        path={String(AdminAcademicRoute.prodiCurriculum)}
        element={<CurriculumProdi />}
      />

      {/* Route untuk admin akademik - Manajemen RPS */}
      <Route
        path={String(AdminAcademicRoute.rpsManagement.rpsManagement)}
        element={<RpsManagement />}
      />

      <Route
        path={String(AdminAcademicRoute.rpsManagement.addRps)}
        element={<AddRps />}
      />

      <Route
        path={`${AdminAcademicRoute.rpsManagement.editRps}/:id`}
        element={<EditRps />}
      />

      <Route
        path={`${AdminAcademicRoute.rpsManagement.detailRps}/:id`}
        element={<DetailRps />}
      />

      {/* Route untuk admin akademik - menu baru yang halamannya belum dibuat (placeholder) */}
      <Route
        path={String(AdminAcademicRoute.portal.dosen)}
        element={<ComingSoon title="Dosen" />}
      />
      <Route
        path={String(AdminAcademicRoute.classData.monitoringRoom)}
        element={<ComingSoon title="Monitoring Ruang" />}
      />
      <Route
        path={String(AdminAcademicRoute.administration.semesterStatus)}
        element={<ComingSoon title="Status Semester" />}
      />
      <Route
        path={String(AdminAcademicRoute.administration.studentEvaluation)}
        element={<ComingSoon title="Evaluasi Mahasiswa" />}
      />
      <Route
        path={String(AdminAcademicRoute.administration.studentTransfer)}
        element={<ComingSoon title="Transfer Mahasiswa" />}
      />
      <Route
        path={String(AdminAcademicRoute.administration.studentDropout)}
        element={<ComingSoon title="Mahasiswa Keluar" />}
      />
      <Route
        path={String(AdminAcademicRoute.institution.studySystem)}
        element={<ComingSoon title="Sistem Kuliah" />}
      />
      <Route
        path={String(AdminAcademicRoute.institution.classroom)}
        element={<ComingSoon title="Ruang Kuliah" />}
      />
      <Route
        path={String(AdminAcademicRoute.lectureSetting.courseType)}
        element={<ComingSoon title="Jenis Mata Kuliah" />}
      />
      <Route
        path={String(AdminAcademicRoute.lectureSetting.timeSlot)}
        element={<ComingSoon title="Slot Waktu" />}
      />
      <Route
        path={String(AdminAcademicRoute.lectureSetting.meetingType)}
        element={<ComingSoon title="Jenis Pertemuan" />}
      />
      <Route
        path={String(AdminAcademicRoute.biodataSetting.religion)}
        element={<ComingSoon title="Agama" />}
      />
      <Route
        path={String(AdminAcademicRoute.biodataSetting.ethnicity)}
        element={<ComingSoon title="Suku" />}
      />
      <Route
        path={String(AdminAcademicRoute.biodataSetting.income)}
        element={<ComingSoon title="Penghasilan" />}
      />
      <Route
        path={String(AdminAcademicRoute.biodataSetting.occupation)}
        element={<ComingSoon title="Pekerjaan" />}
      />
      <Route
        path={String(AdminAcademicRoute.biodataSetting.almamaterJacket)}
        element={<ComingSoon title="Jas Almamater" />}
      />
      <Route
        path={String(AdminAcademicRoute.studentSetting.studentStatus)}
        element={<ComingSoon title="Status Mahasiswa" />}
      />
      <Route
        path={String(AdminAcademicRoute.studentSetting.residenceType)}
        element={<ComingSoon title="Jenis Tinggal" />}
      />
      <Route
        path={String(AdminAcademicRoute.studentSetting.transportation)}
        element={<ComingSoon title="Transportasi" />}
      />
      <Route
        path={String(AdminAcademicRoute.studentSetting.specialNeeds)}
        element={<ComingSoon title="Kebutuhan Khusus" />}
      />

      {/* Route Untuk Admin Keuangan */}
      <Route
        path={String(AdminFinanceRoute.dashboardAdminFinance)}
        element={<DashboardAdminFinance />}
      />
      <Route path={String(AdminFinanceRoute.editBill)} element={<EditBill />} />
      <Route
        path={String(AdminFinanceRoute.createBill)}
        element={<CreateBill />}
      />
      <Route
        path={String(AdminFinanceRoute.formCreateBill)}
        element={<FormCreateBill />}
      />
      <Route
        path={String(AdminFinanceRoute.studentBill)}
        element={<StudentBill />}
      />
      <Route
        path={String(AdminFinanceRoute.detailStudentBill)}
        element={<DetailStudentBill />}
      />
      <Route
        path={String(AdminFinanceRoute.componentBill)}
        element={<ComponentBill />}
      />
      <Route
        path={String(AdminFinanceRoute.createComponentBill)}
        element={<CreateComponentBill />}
      />
      <Route
        path={String(AdminFinanceRoute.editComponentBill)}
        element={<EditComponentBill />}
      />

      {/* Route untuk dosen */}
      <Route
        path={String(LecturerRoute.dashboard)}
        element={<DashboardLecturer />}
      />
      <Route
        path={String(LecturerRoute.guidance.consultation)}
        element={<ConsultationLecturer />}
      />
      <Route
        path={String(LecturerRoute.guidance.addConsultation)}
        element={<FormConsultationLecturer />}
      />
      <Route
        path={String(LecturerRoute.guidance.proposal)}
        element={<ProposalLecturer />}
      />
      <Route
        path={String(LecturerRoute.guidance.finalProject)}
        element={<FinalProjectLecturer />}
      />
      <Route
        path={String(LecturerRoute.guidance.supporter)}
        element={<SupporterLecturer />}
      />
      {/* <Route
        path={String(LecturerRoute.schedule.calendar)}
        element={<CalendarLecturer />}
      />
      <Route
        path={String(LecturerRoute.guidance.finalProject)}
        element={<FinalProjectLecturer />}
      />
      <Route
        path={String(LecturerRoute.guidance.supporter)}
        element={<SupporterLecturer />}
      /> */}
      <Route
        path={String(LecturerRoute.guidance.advisor)}
        element={<AdvisorLecturer />}
      />
      <Route
        path={String(LecturerRoute.schedule)}
        element={<ScheduleLecturer />}
      />
      <Route
        path={String(LecturerRoute.courses.course)}
        element={<CourseLecturer />}
      />
      <Route
        path={String(LecturerRoute.courses.detailCourse)}
        element={<DetailCourseLecturer />}
      />
      {/* <Route
        path={String(LecturerRoute.courses.stopStudy)}
        element={<StopStudyLecturer />}
      /> */}
      <Route
        path={String(LecturerRoute.courses.class)}
        element={<ClassLecturer />}
      />
      <Route
        path={String(LecturerRoute.courses.detailClass)}
        element={<DetailClassLecturer />}
      />
      <Route
        path="/dosen/perkuliahan/kelas kuliah/detail"
        element={<DetailClassLecturer />}
      />
      <Route
        path={String(LecturerRoute.guidance.detailAdvisor)}
        element={<DetailAdvisorLecturer />}
      />

      <Route path="*" element={<NotFound />} />
      <Route path="/403" element={<Forbidden />} />
      <Route path="/callback" element={<LoginPage />} />
    </Routes>
  );
}
