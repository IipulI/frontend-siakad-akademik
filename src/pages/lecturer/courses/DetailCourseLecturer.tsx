import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { LecturerRoute } from "../../../types/VarRoutes";
import { ArrowLeft } from "lucide-react";
import SidebarCourseLecturer from "../../../components/lecturer/SidebarCourseLecturer";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useCourseDetail } from "../../../hooks/lecturer/useFetchCourse";

export default function DetailCourseLecturer() {
  const navigate = useNavigate();
  const id = localStorage.getItem("id_mata_kuliah");

  const { isPending, data: detail, error } = useCourseDetail(id);
  const d = detail?.data;

  return (
    <MainLayout titlePage={"Detail Mata Kuliah"} isGreeting={false}>
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px] flex items-center justify-between">
          <p className="text-gray-500 text-sm">Dosen &gt; Perkuliahan &gt; Mata Kuliah &gt; Detail</p>
          <button
            onClick={() => navigate(LecturerRoute.courses.course)}
            className="bg-primary-blueSoft text-white px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90"
          >
            <ArrowLeft size={15} /> Kembali ke Daftar
          </button>
        </div>

        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <SidebarCourseLecturer mataKuliahId={id || ""} activeTab="data" />

            <div className="w-full md:w-[80%]">
              {isPending ? (
                <div className="flex justify-center p-12">
                  <LoadingSpinner />
                </div>
              ) : error || !d ? (
                <div className="p-8 text-center text-red-500">Gagal memuat data mata kuliah.</div>
              ) : (
                <>
                  <div className="bg-[#eef5f9] border-l-4 border-[#00c0ef] p-4 mb-6 text-sm text-gray-700">
                    Data inti mata kuliah (kode, nama, SKS, dst) hanya bisa diubah oleh Admin Akademik.
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 text-sm">
                    <div>
                      <Row label="Tahun Kurikulum" value={d.tahunKurikulum} />
                      <Row label="Kode Mata Kuliah" value={d.kodeMataKuliah} />
                      <Row label="Nama Mata Kuliah (IND)" value={d.namaMataKuliahInd} />
                      <Row label="Nama Mata Kuliah (EN)" value={d.namaMataKuliahEn} />
                      <Row label="Jenis Mata Kuliah" value={d.jenisMataKuliah} />
                      <Row label="SKS Tatap Muka" value={d.sksTatapMuka} />
                      <Row label="SKS Praktikum" value={d.sksPraktikum} />
                      <Row label="Total SKS" value={d.totalSks} bold />
                    </div>
                    <div>
                      <Row label="Unit Pengampu" value={d.unitPengampu} />
                      <Row label="Kelompok Mata Kuliah" value={d.kelompokMataKuliah} />
                      <Row label="Koordinator Mata Kuliah" value={d.koordinatorMataKuliah?.label} />
                      <Row label="Pengembang RPS" value={(d.pengembangRps || []).map((p: any) => p.label).join(", ") || "-"} />
                    </div>
                  </div>
                  {d.isKoordinator && (
                    <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                      Anda adalah Koordinator mata kuliah ini -- bisa mengubah Pemetaan CPL, Pemetaan CPMK, Detail RPS, Rencana Pembelajaran, dan Rencana Evaluasi lewat menu di samping.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function Row({ label, value, bold }: { label: string; value: any; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3">
      <span className="font-semibold text-[#666666]">{label}</span>
      <span className={`text-gray-800 ${bold ? "font-bold" : ""}`}>{value ?? "-"}</span>
    </div>
  );
}