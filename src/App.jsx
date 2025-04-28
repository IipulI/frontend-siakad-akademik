import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Exam from "./pages/schedule/Exam";
import CalendarAcademic from "./pages/schedule/CalendarAcademic";
import StudentInformation from "./pages/profile/StudentInformation";
import ThisWeek from "./pages/schedule/ThisWeek";
import Semester from "./pages/schedule/Semester";
import History from "./pages/academic/History";
import Retake from "./pages/academic/Retake";
import Announcement from "./pages/schedule/Announcement";
import ParentInformation from "./pages/profile/ParentInformation";
import StudentPayment from "./pages/payment/StudentPayment";
import Consultation from "./pages/final-level/Consultation";
import CreateConsultation from "./pages/final-level/CreateConsultation";
import SupportingActivities from "./pages/final-level/SupportingActivities";
import SupportingActivitiesReport from "./pages/final-level/SupportingActivitiesReport";
import ProposalList from "./pages/final-level/ProposalList";
import FinalProjectList from "./pages/final-level/FinalProjectList";
import GraduationApplication from "./pages/final-level/GraduationApplication";
import GraduationRegistration from "./pages/final-level/GraduationRegistration";
import ProgramStudy from "./pages/profile/ProgramStudy";
import EducationHistory from "./pages/profile/EducationHistory";
import StudyPlanCard from "./pages/academic/StudyPlanCard";
import StudentGrade from "./pages/academic/StudentGrade";
import StudyResultCard from "./pages/study-result/StudyResultCard";
import TranscriptGrade from "./pages/study-result/TranscriptGrade";
import StudentPaymentHistory from "./pages/payment/StudentPaymentHistory";

export default function App() {
  return (
    <Routes>
      {/* Index Route */}
      <Route path="/" element={<LoginPage />} />

      {/* Route Dashboard*/}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Route Jadwal */}
      <Route path="/schedule/exams" element={<Exam />} />
      <Route path="/schedule/calendar" element={<CalendarAcademic />} />
      <Route path="/schedule/announcement" element={<Announcement />} />
      <Route path="/schedule/this-week" element={<ThisWeek />} />
      <Route path="/schedule/semester" element={<Semester />} />

      {/* Route Profile */}
      <Route path="/profile" element={<StudentInformation />} />
      <Route path="/profile/parent" element={<ParentInformation />} />
      <Route path="/profile/program-study" element={<ProgramStudy />} />
      <Route path="/profile/education-history" element={<EducationHistory />} />

      {/* route payment */}
      <Route path="/payment" element={<StudentPayment />} />
      <Route
        path="/payment/payment-history"
        element={<StudentPaymentHistory />}
      />

      {/* Route Akademik */}
      <Route path="/academic/history" element={<History />} />
      <Route path="/academic/retake" element={<Retake />} />
      <Route path="/academic/study-plan" element={<StudyPlanCard />} />

      {/* Route Tingkat akhir */}
      <Route path="/final-level/consultation" element={<Consultation />} />
      <Route
        path="/final-level/consultation/detail-consultation"
        element={<CreateConsultation />}
      />
      <Route
        path="/final-level/supporting-activities"
        element={<SupportingActivities />}
      />
      <Route
        path="/final-level/supporting-activities/supporting-activities-report"
        element={<SupportingActivitiesReport />}
      />
      <Route path="/final-level/proposal-list" element={<ProposalList />} />
      <Route
        path="/final-level/final-project-list"
        element={<FinalProjectList />}
      />
      <Route
        path="/final-level/graduation-application"
        element={<GraduationApplication />}
      />
      <Route
        path="/final-level/graduation-registration"
        element={<GraduationRegistration />}
      />
      <Route path="/academic/student-grade" element={<StudentGrade />} />

      {/* Route Hasil Studi */}
      <Route
        path="/study-result/study-result-card"
        element={<StudyResultCard />}
      />
      <Route path="/study-result/transcript" element={<TranscriptGrade />} />
    </Routes>
  );
}
