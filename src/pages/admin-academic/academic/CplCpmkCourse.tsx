import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { AdminAcademicRoute } from "../../../types/VarRoutes";
import { useNavigate } from "react-router-dom";
import { TableCpl, TableCpmk } from "../../../components/Table";
import { Search, ArrowLeft, Save, Edit } from "lucide-react";

const CplCpmkCourse: React.FC = () => {
  const navigate = useNavigate();
  const [sksTatapMuka, setSksTatapMuka] = useState<number>(0);
  const [sksPraktikum, setSksPraktikum] = useState<number>(0);
  const [totalSks, setTotalSks] = useState<number>(0);
  const [semester, setSemester] = useState<number>(1);
  const [unitPengampu, setUnitPengampu] = useState<string>("Universitas Ibn Khaldun Bogor");

  useEffect(() => {
    // Update total SKS whenever sksTatapMuka or sksPraktikum changes
    setTotalSks(sksTatapMuka + sksPraktikum);
  }, [sksTatapMuka, sksPraktikum]);

  const handleBack = () => {
    navigate(AdminAcademicRoute.courseManagement.courseManagement);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Data for CPL and CPMK
  const cplData = [
    {
      kodeCpl: "CPL_001",
      deskripsiCpl:
        " 1. Bertakwa kepada Tuhan Yang Maha Esa  dan mampu menunjukkan sikap religius; 2. Berperan sebagai warga negara yang bangga dan cinta tanah air,  memiliki nasionalisme rasa tanggung jawab pada negara dan bangsa; 3. Taat hukum dan disiplin dalam kehidupan bermasyarakat dan bernegara; 4. Menjunjung tinggi norma, tata nilai, moral, agama, etika, dan  tanggung jawab profesional; 5. Menginternalisasi nilai, norma, dan etika akademik; 6. Memiliki kemampuan berkomunikasi secara efektif dengan para ahli di  bidang Pendidikan Agama Islam; 7. Memiliki kemampuan bekerja sama dalam suatu tim dan menyesuaikan diri dengan cepat di lingkungan kerja; 8. Memiliki sikap peduli (care) terhadap Pendidikan Agama Islam; 9. Memiliki sikap peduli (empaty) terhadap permasalahan dalam pendidikan Islam, menggali faktor penyebab dan menemukan alternatif solusi,  melakukan tindakan nyata menjadi bagian dalam memberikan solusi; 10. Memiliki etika, moral, dan kepribadian dalam menerapkan ilmu untuk  berkarya di bidang Pendidikan Agama Islam; 11. Memiliki sikap keterbukaan dan inovasi dalam menjalin kerjasama  dengan tenaga pendidik lainnya; 12. Menghargai keaslian ide, konsep dan penemuan lainnya, serta  mempunyai rasa ingin tahu (curiousity).",
      kategori: "Sikap",
    },
    {
      kodeCpl: "CPL002",
      deskripsiCpl: "Ahli dalam mengurai berbagai  permasalahan yang dihadapi oleh sekolah/madrasah dan dapat  menyelesaikannya dengan solusi-solusi yang sesuai dengan potensi yang  dimiliki oleh satuan pendidikannya.",
      kategori: "Keterampilan Umum",
    },
  ];

  const cpmkData = [
    { kodeCpmk: "CPMK-01", deskripsiCpmk: "Mahasiswa mampu menjelaskan dan membandingkan berbagai metode pengembangan perangkat lunak dan memahami konteks di mana pendekatan tersebut dapat digunakan" },
    { kodeCpmk: "CPMK002", deskripsiCpmk: "Deskripsi CPMK 2" },
  ];

  const tableHeadCpl = ["Kode CPL", "Deskripsi Capaian Pembelajaran Lulusan (CPL)", "Kategori"];
  const tableHeadCpmk = ["Kode CPMK", "Deskripsi"];

  return (
    <MainLayout isGreeting={false} titlePage="Data Mata Kuliah" className="">
      <div className="w-full bg-white my-4 py-4 rounded-sm border-t-2 border-primary-green px-5">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center ">
            <button onClick={handleBack} className="flex items-center bg-primary-blueDark text-white px-3 py-3 rounded-l-md">
              <ArrowLeft className="mr-2" size={16} />
            </button>
            <div className="flex items-center">
              <input type="search" placeholder="Cari Mata Kuliah" className="px-3 py-2 border border-black/50  w-64" />
              <button className="bg-primary-yellow px-3 py-3 rounded-r-md">
                <Search color="white" size={20} />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleBack} className="bg-primary-yellow text-white px-4 py-2 rounded flex items-center cursor-pointer">
              <ArrowLeft className="mr-2" size={16} />
              Kembali ke Daftar
            </button>
          </div>
        </div>

        <div className="flex ">
          {/* Sidebar Menu */}
          <div className="w-[20%] h-50 text-white p-3 space-y-2 mr-3">
            <div className="flex items-center bg-[#116E63]/30  mb-1 text-black cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.courseManagement)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>Data Mata Kuliah</p>
            </div>
            <div className="flex items-center bg-[#116E63]/60 mb-1 text-black cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.cplCpmkCourse)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p className="text-black font-semibold">CPL dan CPMK</p>
            </div>
            <div className="flex items-center bg-[#116E63]/30 mb-1 text-gray-600 cursor-pointer" onClick={() => handleNavigation(AdminAcademicRoute.courseManagement.rpsCourse)}>
              <div className="w-1.5 h-10 bg-primary-green mr-3 "></div>
              <p>RPS</p>
            </div>
          </div>
          {/* Detail Data Mata Kuliah */}
          <div className="w-[80%] p-3">
            <div className="flex bg-primary-green/10">
              {/* Sidebar Biru */}
              <div className="w-2 bg-primary-green"></div>

              {/* Konten */}
              <div className="flex-1 p-4 grid grid-cols-2 gap-x-6">
                {/* Kolom Kiri */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold w-40">Kode Mata Kuliah:</span>
                    <span className="flex-1 text-left">MK001</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold w-40">Tahun Kurikulum:</span>
                    <span className="flex-1 text-left">2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold w-40">Mata Kuliah:</span>
                    <span className="flex-1 text-left">Pemrograman Lanjut</span>
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold w-40">Semester:</span>
                    <span className="flex-1 text-left">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold w-40">Unit Pengampu:</span>
                    <span className="flex-1 text-left">Teknik Informatika</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold w-40">SKS:</span>
                    <span className="flex-1 text-left">3</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 ml-[-10px]">
              <h2 className="font-semibold">Capaian Pembelajaran Lulusan</h2>
              <TableCpl data={cplData} tableHead={tableHeadCpl} error="Data CPL tidak ditemukan." />
            </div>
            <div className="mt-4 ml-[-10px]">
              <h2 className="font-semibold">CapaianMata Kuliah</h2>
              <TableCpmk data={cpmkData} tableHead={tableHeadCpmk} error="Data CPMK tidak ditemukan." />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CplCpmkCourse;
