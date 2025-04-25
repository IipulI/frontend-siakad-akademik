import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Exam from "./pages/schedule/Exam";
import CalendarAcademic from "./pages/schedule/CalendarAcademic";
import "./App.css";
import StudentInformation from "./pages/profile/StudentInformation";
import ThisWeek from "./pages/schedule/ThisWeek";
import Semester from "./pages/schedule/Semester";
import History from "./pages/academic/History";
import Retake from "./pages/academic/Retake";
import Announcement from "./pages/schedule/Announcement";
import ParentInformation from "./pages/profile/ParentInformation";
import StudentPayment from "./pages/payment/StudentPayment";
import Consultation from "./pages/final level/Consultation";

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

      {/* route payment */}
      <Route path="/payment" element={<StudentPayment />} />

      {/* Route Akademik */}
      <Route path="/academic/history" element={<History />} />
      <Route path="/academic/retake" element={<Retake />} />

      {/* {Route Tingkat akhir} */}
      <Route path="/final level/consultation" element={<Consultation />} />

    </Routes>
  );
}
