import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import HorizontalLine from "../../../components/profile/HorizontalLine";
import { useAcademicGuidanceDetail, useAcceptKRS, useRejectKRS } from "../../../hooks/lecturer/useFetchGuidance";
import { Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LecturerRoute } from "../../../types/VarRoutes";

const StudyPlanCardHeader = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <div className="w-full">
      <h1 className="font-semibold text-sm sm:text-base text-gray-500">{title}</h1>
      <h1 className="font-bold text-sm sm:text-base text-gray-800 mt-1">{subtitle}</h1>
    </div>
  );
};

const DetailAdvisorLecturer = () => {
  const studentId = localStorage.getItem("id_mahasiswa");
  const krsId = localStorage.getItem("id_krs");
  const navigate = useNavigate();

  const { data, isPending } = useAcademicGuidanceDetail(studentId);

  const { mutate: accept, isPending: pendingAccept } = useAcceptKRS(
    (response: any) => {
      alert(response?.message || "KRS berhasil disetujui.");
      navigate(LecturerRoute.guidance.advisor);
    },
    (error: any) => {
      alert(error.response?.data?.message || error.message || "Gagal menyetujui KRS.");
    }
  );

  const { mutate: reject, isPending: pendingReject } = useRejectKRS(
    (response: any) => {
      alert(response?.message || "KRS berhasil ditolak.");
      navigate(LecturerRoute.guidance.advisor);
    },
    (error: any) => {
      alert(error.response?.data?.message || error.message || "Gagal menolak KRS.");
    }
  );

  const handleAccept = () => {
    const finalKrsId = krsId || data?.data?.id;
    if (!finalKrsId) {
      alert("ID KRS tidak ditemukan.");
      return;
    }
    if (window.confirm("Apakah Anda yakin ingin menyetujui KRS ini?")) {
      accept({ krsIds: [finalKrsId] });
    }
  };

  const handleReject = () => {
    const finalKrsId = krsId || data?.data?.id;
    if (!finalKrsId) {
      alert("ID KRS tidak ditemukan.");
      return;
    }
    if (window.confirm("Apakah Anda yakin ingin menolak KRS ini?")) {
      reject({ krsIds: [finalKrsId] });
    }
  };

  // Get student info from localStorage (populated from list page) or fall back to API response
  const semester = data?.data?.semester || localStorage.getItem("mahasiswa_semester") || "...";
  const batasSks = data?.data?.batasSks || localStorage.getItem("mahasiswa_batas_sks") || "...";
  const statusKrs = data?.data?.status || data?.data?.krsTerbaru?.status || localStorage.getItem("mahasiswa_status_krs") || "...";
  const pembimbing = data?.data?.pembimbingAkademik || localStorage.getItem("mahasiswa_pembimbing") || "...";
  const namaMahasiswa = data?.data?.mahasiswa?.nama || localStorage.getItem("mahasiswa_nama") || "...";
  const nimMahasiswa = data?.data?.mahasiswa?.nim || localStorage.getItem("mahasiswa_nim") || "...";
  const periodeAkademik = data?.data?.periodeAkademik || localStorage.getItem("nama_periode_akademik") || "...";

  // Helper to extract course array robustly
  const getCoursesArray = (coursesObj: any) => {
    if (!coursesObj) return [];
    if (Array.isArray(coursesObj)) return coursesObj;
    if (Array.isArray(coursesObj.rincianKrsMahasiswa)) return coursesObj.rincianKrsMahasiswa;
    if (Array.isArray(coursesObj.krs)) return coursesObj.krs;
    if (Array.isArray(coursesObj.data)) return coursesObj.data;
    return [];
  };

  const coursesList = getCoursesArray(data?.data);
  const totalSks = data?.data?.totalSks ?? data?.data?.sksDiambil ?? coursesList.reduce((sum: number, c: any) => {
    const s = c.sks !== undefined
      ? c.sks
      : (c.sksTatapMuka !== undefined
        ? (c.sksTatapMuka + (c.sksPraktikum || 0))
        : (c.mataKuliah?.totalSks || 0));
    return sum + s;
  }, 0);

  // Show action buttons if status is 'Diajukan'
  const showActionButtons = statusKrs?.toLowerCase() === "diajukan";

  return (
    <MainLayout isGreeting={false} titlePage="Detail Bimbingan Akademik">
      <HorizontalLine />

      {/* Student Profile Info */}
      <div className="bg-[#F5FFF9] border-l-4 border-primary-green p-4 rounded-r-md mt-4 shadow-sm">
        <h2 className="text-lg font-bold text-primary-green">{namaMahasiswa}</h2>
        <p className="text-sm text-slate-600 font-semibold mt-1">NIM: {nimMahasiswa}</p>
      </div>

      {/* 5-Column Grid Header matching StudyPlanCard */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 p-4 bg-[#F4F4F4] mx-auto mt-4 mb-6">
        <StudyPlanCardHeader
          title={"Semester Saat Ini"}
          subtitle={semester}
        />
        <StudyPlanCardHeader
          title={"Batas Total SKS"}
          subtitle={`${batasSks} SKS`}
        />
        <StudyPlanCardHeader
          title={"Periode Akademik"}
          subtitle={periodeAkademik}
        />
        <StudyPlanCardHeader
          title={"Status"}
          subtitle={statusKrs}
        />
        <StudyPlanCardHeader
          title={"Pembimbing Akademik"}
          subtitle={pembimbing}
        />
      </div>

      {/* Slanted Tab Title matching StudyPlanCard */}
      <div className="flex items-center mt-6 mb-4">
        <button className="font-semibold cursor-default py-2 px-5 pr-14 transform scale-y-[-1] w-fit text-white bg-primary-green border border-primary-green" style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)" }}>
          <p className="transform scale-y-[-1]">KRS Tersimpan</p>
        </button>
      </div>

      {/* Table matching StudyPlanCard style exactly */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="px-4 py-3 font-semibold border border-primary-green">Nama Matkul</th>
              <th className="px-4 py-3 font-semibold border border-primary-green">Jadwal</th>
              <th className="px-4 py-3 font-semibold border border-primary-green">SKS</th>
              <th className="px-4 py-3 font-semibold border border-primary-green">Dosen Pengajar</th>
            </tr>
          </thead>
          <tbody className="font-semibold text-sm">
            {isPending ? (
              <tr>
                <td colSpan={4} className="text-center py-4 border border-primary-green">
                  Memuat data KRS...
                </td>
              </tr>
            ) : coursesList.length > 0 ? (
              coursesList.map((course: any, index: number) => {
                const namaMatkul = course.mataKuliah?.nama || course.mataKuliah?.namaMataKuliah || course.nama || course.namaMataKuliah || "-";
                const jadwal = course.hari
                  ? (course.jam ? `${course.hari}, ${course.jam}` : `${course.hari}, ${course.jamMulai} - ${course.jamSelesai}`)
                  : (course.jadwalKuliah?.[0] ? `${course.jadwalKuliah[0].hari}, ${course.jadwalKuliah[0].jamMulai} - ${course.jadwalKuliah[0].jamSelesai}` : '-');
                const sks = course.sks !== undefined
                  ? course.sks
                  : (course.sksTatapMuka !== undefined
                    ? (course.sksTatapMuka + (course.sksPraktikum || 0))
                    : (course.mataKuliah?.totalSks || 0));
                const dosen = course.dosenPengajar || course.jadwalKuliah?.[0]?.dosen?.nama || "-";

                return (
                  <tr key={index} className="text-center hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border border-primary-green text-left">{namaMatkul}</td>
                    <td className="px-4 py-2 border border-primary-green text-left">{jadwal}</td>
                    <td className="px-4 py-2 border border-primary-green">{sks}</td>
                    <td className="px-4 py-2 border border-primary-green text-left">{dosen}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 border border-primary-green">
                  Belum ada KRS yang diajukan.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="text-sm font-bold bg-white border">
            <tr>
              <td colSpan={2} className="px-4 py-2 text-left font-bold">Total SKS Diajukan:</td>
              <td className="px-4 py-2 text-center font-bold">{totalSks} SKS</td>
              <td className="border border-primary-green"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Actions */}
      {showActionButtons && (
        <div className="flex gap-4 justify-start mt-6 mb-12">
          <button
            disabled={pendingReject || isPending}
            onClick={handleReject}
            className={`${pendingReject ? "bg-red-300 cursor-not-allowed animate-pulse" : "bg-red-500 cursor-pointer"} hover:bg-red-600 text-white px-6 py-2 rounded font-semibold flex items-center gap-2`}
          >
            <X size={18} /> Tolak KRS
          </button>
          <button
            disabled={pendingAccept || isPending}
            onClick={handleAccept}
            className={`${pendingAccept ? "bg-green-300 cursor-not-allowed animate-pulse" : "bg-green-500 cursor-pointer"} hover:bg-green-600 text-white px-6 py-2 rounded font-semibold flex items-center gap-2`}
          >
            <Check size={18} /> Setujui KRS
          </button>
        </div>
      )}
    </MainLayout>
  );
};

export default DetailAdvisorLecturer;
