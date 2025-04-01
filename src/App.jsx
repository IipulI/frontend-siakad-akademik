import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Exam from "./pages/schedule/Exam";
import CalendarAcademic from "./pages/schedule/CalendarAcademic";
import "./App.css";
import StudentInformation from "./pages/profile/StudentInformation";

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

      {/* Route Profile */}
      <Route path="/profile" element={<StudentInformation />} />
    </Routes>
  );
}
