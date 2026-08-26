import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import { LecturerRoute } from "../../../types/VarRoutes";
import { ArrowLeft, Search, Check, X } from "lucide-react";
import SidebarCourseLecturer from "../../../components/lecturer/SidebarCourseLecturer";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useCourseDetail } from "../../../hooks/lecturer/useFetchCourse";

export default function DetailCourseLecturer() {
  const navigate = useNavigate();
  const id = localStorage.getItem("id_mata_kuliah");

  const { isPending, data: detail, error } = useCourseDetail(id);
  const d = detail?.data;

  const handleBack = () => navigate(LecturerRoute.courses.course);

  return (
    <MainLayout titlePage={"Detail Mata Kuliah"} isGreeting={false}>
      <div className="p-0 min-h-screen">
        <div className="mb-6 mt-[-10px]">
          <p className="text-gray-500 text-sm">Dosen &gt; Perkuliahan &gt; Mata Kuliah &gt; Data Mata Kuliah</p>
        </div>

        {/* Action Header */}
        <div className="bg-white p-5 rounded-sm border-t-2 border-primary-green shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center w-full md:w-auto">
              <button onClick={handleBack} className="bg-primary-yellow text-white p-2.5 rounded-l-md flex items-center justify-center hover:bg-opacity-90 cursor-pointer">
                <ArrowLeft size={16} />
              </button>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Cari Mata Kuliah"
                  className="p-2 pl-3 border border-gray-300 rounded-none text-sm outline-none focus:ring-1 focus:ring-primary-green bg-white w-64 text-gray-700"
                  defaultValue={d?.namaMataKuliahInd || ""}
                  readOnly
                />
                <button className="bg-indigo-600 text-white p-2.5 rounded-r-md flex items-center justify-center hover:bg-opacity-90 cursor-pointer" disabled>
                  <Search size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
              <button onClick={handleBack} className="bg-[#00c0ef] text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1 hover:bg-opacity-90 cursor-pointer">
                <ArrowLeft size={16} /> Kembali ke Daftar
              </button>
            </div>
          </div>
        </div>

        {/* Content Box */}
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
                  {/* Alert Banner */}
                  <div className="bg-[#eef5f9] border-l-4 border-[#00c0ef] p-4 mb-6 flex items-start gap-3">
                    <div className="text-[#00c0ef] mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#00c0ef] mb-1">Informasi</p>
                      <p className="text-sm text-gray-700">Data inti mata kuliah (kode, nama, SKS, dst) hanya bisa diubah oleh Admin Akademik.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 text-sm">
                    {/* Column 1 */}
                    <div>
                      <Row label="Tahun Kurikulum" value={d.tahunKurikulum} />
                      <Row label="Kode Mata Kuliah" value={d.kodeMataKuliah} />
                      <Row label="Nama Mata Kuliah (IND)" value={d.namaMataKuliahInd} />
                      <Row label="Nama Mata Kuliah (EN)" value={d.namaMataKuliahEn && d.namaMataKuliahEn !== "-" ? d.namaMataKuliahEn : "-"} />
                      <Row label="Jenis Mata Kuliah" value={d.jenisMataKuliah} />
                      <Row label="SKS Tatap Muka" value={d.sksTatapMuka ?? 0} />
                      <Row label="SKS Praktikum" value={d.sksPraktikum ?? 0} />
                      <Row label="SKS Praktik Lapangan" value={d.sksPraktikLapangan ?? 0} />
                      <Row label="SKS Simulasi" value={d.sksSimulasi ?? 0} />
                      <Row label="Total SKS" value={d.totalSks ?? 0} bold />
                    </div>
                    {/* Column 2 */}
                    <div>
                      <Row label="Unit Pengampu" value={d.unitPengampu} />
                      <Row label="Kelompok Mata Kuliah" value={d.kelompokMataKuliah && d.kelompokMataKuliah !== "-" ? d.kelompokMataKuliah : "-"} />
                      <CheckRow label="Merupakan MKU" checked={!!d.atribut?.merupakanMku} />
                      <CheckRow label="Ada SAP" checked={!!d.atribut?.adaSap} />
                      <CheckRow label="Ada Silabus" checked={!!d.atribut?.adaSilabus} />
                      <CheckRow label="Ada Bahan Ajar" checked={!!d.atribut?.adaBahanAjar} />
                      <CheckRow label="Ada Diktat" checked={!!d.atribut?.adaDiktat} />
                    </div>
                  </div>

                  {/* Dosen Penanggung Jawab */}
                  <div className="mt-8">
                    <h3 className="font-bold text-lg text-primary-green border-b-2 border-primary-green pb-2 mb-4">
                      Dosen Penanggung Jawab
                    </h3>
                    <div className="text-sm">
                      <div className="flex flex-col md:flex-row border-b border-gray-100 py-3 gap-2 md:gap-0">
                        <div className="w-full md:w-1/3 font-semibold text-[#666666]">Koordinator Mata Kuliah</div>
                        <div className="w-full md:w-2/3 text-gray-800">{d.koordinatorMataKuliah?.label || "-"}</div>
                      </div>
                      <div className="flex flex-col md:flex-row border-b border-gray-100 py-3 gap-2 md:gap-0">
                        <div className="w-full md:w-1/3 font-semibold text-[#666666]">Pengembang RPS</div>
                        <div className="w-full md:w-2/3 text-gray-800">{(d.pengembangRps || []).map((p: any) => p.label).join(", ") || "-"}</div>
                      </div>
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

function CheckRow({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3">
      <span className="font-semibold text-[#666666]">{label}</span>
      <span className={checked ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
        {checked ? <Check size={16} /> : <X size={16} />}
      </span>
    </div>
  );
}