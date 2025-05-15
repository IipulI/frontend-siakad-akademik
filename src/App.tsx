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

export default function App() {
  return (
    <Routes>
      {/* Index Route */}
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

      {/* Route Untuk Admin Akademik */}
      <Route
        path={String(AdminAcademicRoute.dashboardAdminAcademic)}
        element={<DashboardAdminAcademic />}
      />
      <Route
        path={String(AdminAcademicRoute.collegeClass.class)}
        element={<CollegeClass />}
      />
      {/* Route Untuk Admin Keuangan */}
      <Route
        path={String(AdminFinanceRoute.dashboardAdminFinance)}
        element={<DashboardAdminFinance />}
      />
    </Routes>
  );
}
