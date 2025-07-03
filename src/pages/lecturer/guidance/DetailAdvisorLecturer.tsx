import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import HorizontalLine from "../../../components/profile/HorizontalLine";
import Biodata from "../../../components/biodata/Biodata";
import { useAcademicGuidanceDetail, useAcceptKRS, useRejectKRS } from "../../../hooks/lecturer/useFetchGuidance";
import StudyPlanCardTable from "../../../components/lecturer/StudyPlanCardTable";
import { Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LecturerRoute } from "../../../types/VarRoutes";

const DetailAdvisorLecturer = () => {
  const id = localStorage.getItem("id_mahasiswa");
  const periodeAkademikId = localStorage.getItem("id_periode_akademik");

  const navigate = useNavigate();

  const { data, isPending } = useAcademicGuidanceDetail(id);

  const { mutate: accept, isPending: pendingAccept } = useAcceptKRS(
    (data) => {
      alert(data.message);
      navigate(LecturerRoute.guidance.advisor);
    },
    (error) => {
      alert(error);
    }
  );

  const { mutate: reject, isPending: pendingReject } = useRejectKRS(
    (data) => {
      alert(data.message);
      navigate(LecturerRoute.guidance.advisor);
    },
    (error) => {
      alert(error);
    }
  );

  const handleAccept = () => {
    if (!id || !periodeAkademikId) {
      alert("Mahasiswa atau periode akademik tidak ditemukan.");
      return;
    }
    accept({ mahasiswaIds: [id], periodeAkademikId });
  };

  const handleReject = () => {
    if (!id || !periodeAkademikId) {
      alert("Mahasiswa atau periode akademik tidak ditemukan.");
      return;
    }
    reject({ mahasiswaIds: [id], periodeAkademikId });
  };

  return (
    <MainLayout isGreeting={false} titlePage="Detail Bimbingan Akademik">
      <HorizontalLine />
      <Biodata showLine={false} />
      <StudyPlanCardTable
        courses={
          isPending || !data?.data
            ? { krs: [], totalSks: 0 }
            : data.data
        }
      />
      <div className="flex gap-4 justify-start mt-6">
        <button
          disabled={pendingReject}
          onClick={handleReject}
          className={`${pendingReject ? "bg-red-300 cursor-not-allowed animate-pulse" : "bg-red-500 cursor-pointer"} hover:bg-red-300 text-white px-6 py-2 rounded font-semibold flex items-center gap-2`}
        >
          <X size={18} /> Batalkan KRS
        </button>
        <button
          disabled={pendingAccept}
          onClick={handleAccept}
          className={`${pendingAccept ? "bg-green-300 cursor-not-allowed animate-pulse" : "bg-green-500 cursor-pointer"} hover:bg-green-300 text-white px-6 py-2 rounded font-semibold flex items-center gap-2`}
        >
          <Check size={18} /> Setujui KRS
        </button>
      </div>
    </MainLayout>
  );
};

export default DetailAdvisorLecturer;
