import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
}