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
} from "./types/VarRoutes";
import DashboardAdminFinance from "./pages/admin-finance/DashboardAdminFinance";
import DashboardAdminAcademic from "./pages/admin-academic/DashboardAdminAcademic";
import StudentData from "./pages/admin-academic/student/StudentData";
import CreateStudent from "./pages/admin-academic/student/CreateStudent";
import DetailStudent from "./pages/admin-academic/student/DetailStudent";
import AcademikAdvisor from "./pages/admin-academic/student/AcademicAdvisor";
import AnnouncementAdminAcademic from "./pages/admin-academic/announcement/AnnouncementAdminAcademic";
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
import OBEManagement from "./pages/admin-academic/academic/OBEManagement";
import GraduateProfile from "./pages/admin-academic/academic/GraduateProfile";
import ObeCpl from "./pages/admin-academic/academic/ObeCpl";
import ObeCpmk from "./pages/admin-academic/academic/ObeCpmk";
import ObeCpmkMatkul from "./pages/admin-academic/academic/ObeCpmkMatkul";
import CurriculumProdi from "./pages/admin-academic/academic/CurriculumProdi";
import RpsManagement from "./pages/admin-academic/academic/RpsManagement";
import AddRps from "./pages/admin-academic/academic/AddRps";
import DetailRps from "./pages/admin-academic/academic/DetailRps";
import CreateCollegeClass from "./pages/admin-academic/class/CreateCollegeClass";
import DetailCollegeClass from "./pages/admin-academic/class/DetailCollegeClass";
import EditBill from "./pages/admin-finance/EditBill";
import CreateBill from "./pages/admin-finance/create-bill/CreateBill";
import FormCreateBill from "./pages/admin-finance/create-bill/FormCreateBill";
import StudentBill from "./pages/admin-finance/student-bill/StudentBill";
import DetailStudentBill from "./pages/admin-finance/student-bill/DetailStudentBill";
import ComponentBill from "./pages/admin-finance/component-bill/ComponentBill";
import CreateComponentBill from "./pages/admin-finance/component-bill/CreateComponentBill";
export default function App() {
  return (
    <Routes>
      {/* Index Route */}
      <Route path="/" element={<LoginPage />} />

      {/* Route Dashboard*/}
      <Route path={String(StudentRoute.dashboard)} element={<Dashboard />} />

      {/* Route Jadwal */}
      <Route path={String(StudentRoute.schedule.exam)} element={<Exam />} />
      <Route path={String(StudentRoute.schedule.calendar)} element={<CalendarAcademic />} />
      <Route path={String(StudentRoute.schedule.announcement)} element={<Announcement />} />
      <Route path={String(StudentRoute.schedule.thisWeek)} element={<ThisWeek />} />

      {/* Route Profile */}
      <Route path={String(StudentRoute.profile.profile)} element={<StudentInformation />} />
      <Route path={String(StudentRoute.profile.parent)} element={<ParentInformation />} />
      <Route path={String(StudentRoute.profile.programStudy)} element={<ProgramStudy />} />
      <Route path={String(StudentRoute.profile.educationHistory)} element={<EducationHistory />} />

      {/* Route Akademik */}
      <Route path={String(StudentRoute.academic.history)} element={<History />} />
      <Route path={String(StudentRoute.academic.retake)} element={<Retake />} />
      <Route path={String(StudentRoute.academic.studyPlan)} element={<StudyPlanCard />} />
      <Route path={String(StudentRoute.academic.studentGrade)} element={<StudentGrade />} />

      {/* Route Hasil Studi */}
      <Route path={String(StudentRoute.studyResult.studyResult)} element={<StudyResultCard />} />
      <Route path={String(StudentRoute.studyResult.transcript)} element={<TranscriptGrade />} />

      {/* route payment */}
      <Route path={String(StudentRoute.payment.payment)} element={<StudentPayment />} />
      <Route path={String(StudentRoute.payment.paymentHistory)} element={<StudentPaymentHistory />} />

      {/* Route Untuk Admin Akademik */}
      <Route path={String(AdminAcademicRoute.dashboardAdminAcademic)} element={<DashboardAdminAcademic />} />
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
        path={String(AdminAcademicRoute.collegeClass.detailClass)}
        element={<DetailCollegeClass />}
      />
      <Route path={String(AdminAcademicRoute.student.studentData)} element={<StudentData />} />
      <Route path={String(AdminAcademicRoute.student.createStudent)} element={<CreateStudent />} />
      <Route path={String(AdminAcademicRoute.student.detailStudent)} element={<DetailStudent />} />
      <Route path={String(AdminAcademicRoute.student.academicAdvisor)} element={<AcademikAdvisor />} />

      {/* Route untuk admin akademik - pengumuman */}
      <Route path={String(AdminAcademicRoute.announcement)} element={<AnnouncementAdminAcademic />} />
      {/* Route untuk admin akademik - pengaturan */}
      <Route path={String(AdminAcademicRoute.setting.year)} element={<YearAdminAcademic />} />
      <Route path={String(AdminAcademicRoute.setting.period)} element={<PeriodAdminAcademic />} />
      <Route path={String(AdminAcademicRoute.setting.scale)} element={<ScaleAdminAcademic />} />
      <Route path={String(AdminAcademicRoute.setting.level)} element={<LevelAdminAcademic />} />
      <Route path={String(AdminAcademicRoute.setting.limit)} element={<LimitSKSAdminAcademic />} />
      <Route path={String(AdminAcademicRoute.setting.composition)} element={<CompositionAdminAcademic />} />
      <Route path={String(AdminAcademicRoute.setting.setComposition)} element={<SetCompositionAdminAcademic />} />

      {/* Route untuk admin akademik - Tahun Kurikulum */}
      <Route path={String(AdminAcademicRoute.curriculumYear.curriculumYear)} element={<CurriculumYear />} />

      {/* Route untuk admin akademik - Manajemen Mata Kuliah*/}
      <Route path={String(AdminAcademicRoute.courseManagement.courseManagement)} element={<CourseManagement />} />

      <Route path={String(AdminAcademicRoute.courseManagement.addCourse)} element={<AddCourse />} />

      <Route path={String(AdminAcademicRoute.courseManagement.editCourse)} element={<EditCourse />} />

      <Route path={String(AdminAcademicRoute.courseManagement.detailCourse)} element={<DetailCourse />} />

      <Route path={String(AdminAcademicRoute.courseManagement.cplCpmkCourse)} element={<CplCpmkCourse />} />

      <Route path={String(AdminAcademicRoute.courseManagement.rpsCourse)} element={<RpsCourse />} />

      {/* Route untuk admin akademik - OBE Management */}
      <Route path={String(AdminAcademicRoute.obeManagement.obeManagement)} element={<OBEManagement />} />

      <Route path={String(AdminAcademicRoute.obeManagement.graduateProfile)} element={<GraduateProfile />} />

      <Route path={String(AdminAcademicRoute.obeManagement.cpl)} element={<ObeCpl />} />

      <Route path={String(AdminAcademicRoute.obeManagement.cpmk)} element={<ObeCpmk />} />

      <Route path={String(AdminAcademicRoute.obeManagement.cpmkMataKuliah)} element={<ObeCpmkMatkul />} />

      {/* Route untuk admin akademik - Kurikulum Prodi */}
      <Route path={String(AdminAcademicRoute.prodiCurriculum.curriculum)} element={<CurriculumProdi />} />

      {/* Route untuk admin akademik - Manajemen RPS */}
      <Route path={String(AdminAcademicRoute.rpsManagement.rpsManagement)} element={<RpsManagement />} />

      <Route path={String(AdminAcademicRoute.rpsManagement.detailRps)} element={<DetailRps />} />

      <Route path={String(AdminAcademicRoute.rpsManagement.addRps)} element={<AddRps />} />

      {/* Route Untuk Admin Keuangan */}
      <Route path={String(AdminFinanceRoute.dashboardAdminFinance)} element={<DashboardAdminFinance />} />
      <Route path={String(AdminFinanceRoute.editBill)} element={<EditBill />} />
      <Route path={String(AdminFinanceRoute.createBill)} element={<CreateBill />} />
      <Route path={String(AdminFinanceRoute.formCreateBill)} element={<FormCreateBill />} />
      <Route path={String(AdminFinanceRoute.studentBill)} element={<StudentBill />} />
      <Route path={String(AdminFinanceRoute.detailStudentBill)} element={<DetailStudentBill />} />
      <Route path={String(AdminFinanceRoute.componentBill)} element={<ComponentBill />} />
      <Route path={String(AdminFinanceRoute.createComponentBill)} element={<CreateComponentBill />} />
    </Routes>
  );
}
