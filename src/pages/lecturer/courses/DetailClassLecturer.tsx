import React, { useState } from "react";
import { ChevronLeft, FileText, Check, X, Search, Plus, Edit2, Trash2 } from "lucide-react";
import TableDetailClass from "../../../components/lecturer/TableDetailClass";
import ButtonGroupOption from "../../../components/lecturer/ButtonGroupOption";
import { Link } from "react-router-dom";
import { LecturerRoute } from "../../../types/VarRoutes";
import MainLayout from "../../../components/layouts/MainLayout";
import { Table } from "../../../components/Table";
import { useClassParticipants, useClassDetail, useClassSchedule } from "../../../hooks/lecturer/useFetchClass";

const selectOptions = [
  { value: "detail", text: "Detail Kelas" },
  { value: "dosen", text: "Dosen Pengajar" },
  { value: "peserta", text: "Peserta Kelas" },
  { value: "kontrak", text: "Kontrak Kuliah" },
  { value: "jadwal", text: "Jadwal Perkuliahan" },
  { value: "presensi", text: "Presensi Kelas" },
  { value: "kesan", text: "Kesan Perkuliahan" },
  { value: "ujian", text: "Jadwal Ujian" },
  { value: "nilai", text: "Nilai Perkuliahan" },
  { value: "kuesioner", text: "Rekap Kuesioner" },
  { value: "rps", text: "RPS" },
  { value: "tugas", text: "Tugas Kuliah" },
];

const tableHead = {
  detail: ["No", "Hari", "Jam mulai", "Jam selesai", "Jenis pertemuan", "Metode pembelajaran", "Ruang"],
  peserta: ["No", "Nim", "Nama Mahasiswa", "Program Studi", "Angkatan", "Status KRS"],
  nilai: ["No", "Nim", "Nama", "Hadir", "Tugas", "UTS", "UAS", "Kehadiran", "Nilai", "Grade", "Lulus", "Keterangan"]
};

const subTabs = [
  { value: "jadwal", text: "Jadwal dan Dosen Pengajar" },
  { value: "prodi", text: "Sebaran Program Studi" },
  { value: "sistem", text: "Sebaran Sistem Kuliah" },
  { value: "kelas", text: "Sebaran Kelas Mahasiswa" },
];

const DetailClassLecturer = () => {
  const id = localStorage.getItem("id_kelas_kuliah");

  const [option, setOption] = useState("detail");
  const [subOption, setSubOption] = useState("jadwal");
  
  const { isPending: isLoadingDetail, data: detailData, error: errorDetail } = useClassDetail(id);
  const { isPending: isLoadingPeserta, data: pesertaData, error: errorPeserta } = useClassParticipants(id);
  const { isPending: isLoadingJadwal, data: jadwalData, error: errorJadwal } = useClassSchedule(id);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const dataDetail = jadwalData?.map((item: any, index: number) => ({
    id: index,
    hari: item.hari,
    jamMulai: item.jamMulai?.split(":").slice(0, 2).join(":") || "",
    jamSelesai: item.jamSelesai?.split(":").slice(0, 2).join(":") || "",
    jenisPertemuan: item.jenisPertemuan,
    metodePembelajaran: item.metodePembelajaran,
    ruang: item.siakRuangan?.namaRuangan || "-",
  }));

  const dataPeserta = pesertaData?.map((item: any, index: number) => ({
    id: item.id,
    no: index + 1,
    nim: item.npm,
    namaMahasiswa: item.nama,
    programStudi: item.programStudiResDto?.namaProgramStudi || "-",
    angkatan: item.angkatan,
    status: item.status || "Belum disetujui",
  }));

  const dataNilai = pesertaData?.map((item: any, index: number) => {
    const nilaiAkhir = item.nilaiAkhir ?? 0;
    return {
      id: item.id,
      no: index + 1,
      nim: item.npm,
      nama: item.nama,
      hadir: item.kehadiran ?? "-",
      tugas: item.tugas ?? "-",
      uts: item.uts ?? "-",
      uas: item.uas ?? "-",
      kehadiran: item.kehadiran ?? "-",
      nilai: nilaiAkhir,
      grade: item.hurufMutu || "-",
      lulus: nilaiAkhir >= 60 ? "Lulus" : "Tidak Lulus",
      keterangan: nilaiAkhir >= 60 ? "Memenuhi" : "Tidak memenuhi",
    };
  });

  const lecturers = React.useMemo(() => {
    if (!jadwalData || jadwalData.length === 0) return ["FETY FATIMAH, S.Kom., M.Kom"];
    const names = Array.from(
      new Set(
        jadwalData
          .map((item: any) => item.dosen?.nama || item.dosenDetail?.nama || item.siakDosen?.nama)
          .filter(Boolean)
      )
    );
    return names.length > 0 ? names : ["FETY FATIMAH, S.Kom., M.Kom"];
  }, [jadwalData]);

  const renderContent = () => {
    if (isLoadingDetail || isLoadingPeserta || isLoadingJadwal) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-green"></div>
          <span className="ml-3 font-semibold text-gray-600">Memuat data...</span>
        </div>
      );
    }

    if (errorDetail || !detailData) {
      return (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded border border-dashed border-gray-300">
          ⚠️ Gagal memuat detail kelas atau data kelas tidak ditemukan.
        </div>
      );
    }

    switch (option) {
      case "detail":
        return (
          <div className="space-y-6">
            {/* Grid Detail Kelas (4-column style) */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="w-full border-collapse text-sm text-left">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 bg-gray-50/70 font-bold text-blue-900 w-1/4 border-r border-gray-200">Periode Akademik</td>
                    <td className="p-3 w-1/4 border-r border-gray-200 font-semibold text-gray-700">{detailData.periodeAkademik || "-"}</td>
                    <td className="p-3 bg-gray-50/70 font-bold text-blue-900 w-1/4 border-r border-gray-200">Tgl. Mulai</td>
                    <td className="p-3 w-1/4 font-semibold text-gray-700">{formatDate(detailData.tanggalMulai)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 bg-gray-50/70 font-bold text-blue-900 w-1/4 border-r border-gray-200">Program Studi</td>
                    <td className="p-3 w-1/4 border-r border-gray-200 font-semibold text-gray-700">
                      {detailData.programStudi?.jenjang?.jenjang} - {detailData.programStudi?.namaProgramStudi || "-"}
                    </td>
                    <td className="p-3 bg-gray-50/70 font-bold text-blue-900 w-1/4 border-r border-gray-200">Tgl. Selesai</td>
                    <td className="p-3 w-1/4 font-semibold text-gray-700">{formatDate(detailData.tanggalSelesai)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 bg-gray-50/70 font-bold text-blue-900 w-1/4 border-r border-gray-200">Tahun Kurikulum</td>
                    <td className="p-3 w-1/4 border-r border-gray-200 font-semibold text-gray-700">{detailData.mataKuliah?.tahunKurikulum || "-"}</td>
                    <td className="p-3 bg-gray-50/70 font-bold text-blue-900 w-1/4 border-r border-gray-200">Jumlah Pertemuan</td>
                    <td className="p-3 w-1/4 font-semibold text-gray-700">{detailData.jumlahPertemuan || "16"}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 bg-gray-50/70 font-bold text-blue-900 w-1/4 border-r border-gray-200">Mata Kuliah</td>
                    <td className="p-3 w-1/4 border-r border-gray-200 font-semibold text-gray-700">
                      {detailData.mataKuliah?.kodeMataKuliah} - {detailData.mataKuliah?.namaMataKuliah || "-"}
                    </td>
                    <td className="p-3 bg-gray-50/70 font-bold text-blue-900 w-1/4 border-r border-gray-200">MBKM?</td>
                    <td className="p-3 w-1/4 font-semibold text-gray-700 flex items-center gap-1">
                      <span className="text-red-500">❌</span> Kampus Merdeka
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 bg-gray-50/70 font-bold text-blue-900 w-1/4 border-r border-gray-200">Nama Kelas</td>
                    <td className="p-3 w-1/4 border-r border-gray-200 font-semibold text-gray-700">{detailData.nama || "-"}</td>
                    <td className="p-3 bg-gray-50/70 font-bold text-blue-900 w-1/4 border-r border-gray-200">Jenis Kelas</td>
                    <td className="p-3 w-1/4 font-semibold text-gray-700">-</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 bg-gray-50/70 font-bold text-blue-900 w-1/4 border-r border-gray-200">Sistem Kuliah</td>
                    <td className="p-3 w-1/4 border-r border-gray-200 font-semibold text-gray-700">{detailData.sistemKuliah || "-"}</td>
                    <td className="p-3 bg-gray-50/70 font-bold text-blue-900 w-1/4 border-r border-gray-200">Kelas Mahasiswa</td>
                    <td className="p-3 w-1/4 font-semibold text-gray-700">-</td>
                  </tr>
                  <tr>
                    <td className="p-3 bg-gray-50/70 font-bold text-blue-900 w-1/4 border-r border-gray-200">Kapasitas</td>
                    <td className="p-3 w-1/4 border-r border-gray-200 font-semibold text-gray-700">{detailData.kapasitas || "0"}</td>
                    <td className="p-3 bg-gray-50/70 font-bold text-blue-900 w-1/4 border-r border-gray-200"></td>
                    <td className="p-3 w-1/4"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Sub-tabs under Detail Kelas */}
            <div>
              <div className="flex flex-wrap gap-1 border-b border-gray-200">
                {subTabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setSubOption(tab.value)}
                    className={`px-5 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
                      subOption === tab.value
                        ? "text-white bg-blue-900 rounded-t-md shadow-sm"
                        : "text-gray-600 bg-gray-100/70 hover:bg-gray-200 hover:text-gray-900 rounded-t-md"
                    }`}
                  >
                    {tab.text}
                  </button>
                ))}
              </div>

              <div className="p-4 bg-white border border-t-0 border-gray-200 rounded-b-md shadow-sm">
                {subOption === "jadwal" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-emerald-800 border-b border-emerald-800/30 pb-1.5 mb-3">
                        Dosen Pengajar
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm p-4 bg-emerald-50/30 border border-emerald-100 rounded-lg">
                        <div>
                          <span className="font-semibold text-gray-500">Metode Pengajaran</span>
                          <p className="font-bold text-gray-800 mt-1">Dosen Tunggal</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-500">Dosen Pengajar</span>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <p className="font-bold text-gray-800">
                              {lecturers.join(", ")}
                            </p>
                            <button className="bg-cyan-500 text-white text-xs px-2.5 py-1 rounded flex items-center gap-1 font-semibold hover:bg-cyan-600 shadow-sm transition">
                              🔍 Lihat Pengajaran
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-emerald-800 border-b border-emerald-800/30 pb-1.5 mb-3">
                        Jadwal Mingguan
                      </h3>
                      <p className="text-xs text-red-500 flex items-center gap-1 font-bold mb-3">
                        ⚠️ Jadwal bisa di-generate setiap dua minggu sekali
                      </p>
                      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <TableDetailClass tableHead={tableHead.detail} data={dataDetail || []} error="Jadwal belum tersedia" />
                      </div>
                    </div>
                  </div>
                )}

                {subOption === "prodi" && (
                  <div className="py-6 text-center text-gray-500 text-sm font-medium">
                    📊 Sebaran Program Studi: 100% {detailData.programStudi?.namaProgramStudi || "-"}
                  </div>
                )}

                {subOption === "sistem" && (
                  <div className="py-6 text-center text-gray-500 text-sm font-medium">
                    ⚙️ Sebaran Sistem Kuliah: 100% {detailData.sistemKuliah || "-"}
                  </div>
                )}

                {subOption === "kelas" && (
                  <div className="py-6 text-center text-gray-500 text-sm font-medium">
                    🏫 Sebaran Kelas Mahasiswa: 100% {detailData.nama || "-"}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "dosen":
        return (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-blue-900 border-b border-gray-200 pb-2 flex items-center gap-2">
              👤 Dosen Pengajar Kelas
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-primary-green text-white text-center font-bold">
                    <th className="p-3 border border-gray-300 w-16">No</th>
                    <th className="p-3 border border-gray-300">Nama Dosen</th>
                    <th className="p-3 border border-gray-300">Status</th>
                    <th className="p-3 border border-gray-300">Metode Pengajaran</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-center text-gray-700">
                  {lecturers.map((name, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 border border-gray-300">{index + 1}</td>
                      <td className="p-3 border border-gray-300 text-left px-6">{name}</td>
                      <td className="p-3 border border-gray-300 text-green-600">Aktif</td>
                      <td className="p-3 border border-gray-300">Dosen Utama / Tunggal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "peserta":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="text-base font-bold text-blue-900 flex items-center gap-2">
                👥 Peserta Kelas ({dataPeserta?.length || 0} Mahasiswa)
              </h3>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <Table tableHead={tableHead.peserta} data={dataPeserta || []} error="Peserta tidak ditemukan" />
            </div>
          </div>
        );

      case "kontrak":
        return (
          <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-6">
            <FileText className="mx-auto text-slate-400 mb-3" size={40} />
            <h4 className="text-sm font-bold text-slate-700 mb-1">Kontrak Kuliah Belum Diunggah</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Kontrak kuliah belum tersedia untuk kelas ini. Hubungi admin prodi untuk mengunggah dokumen kontrak kuliah.
            </p>
          </div>
        );

      case "jadwal":
        return (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-blue-900 border-b border-gray-200 pb-2">
              📅 Jadwal Perkuliahan Mingguan
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <TableDetailClass tableHead={tableHead.detail} data={dataDetail || []} error="Jadwal belum tersedia" />
            </div>
          </div>
        );

      case "presensi":
        return (
          <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-6">
            <Check className="mx-auto text-emerald-500 mb-3" size={40} />
            <h4 className="text-sm font-bold text-slate-700 mb-1">Presensi Kelas Belum Dimulai</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Data absensi/presensi perkuliahan dapat diisi saat jadwal perkuliahan hari ini aktif.
            </p>
          </div>
        );

      case "kesan":
        return (
          <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-6">
            <FileText className="mx-auto text-slate-400 mb-3" size={40} />
            <h4 className="text-sm font-bold text-slate-700 mb-1">Belum Ada Kesan Perkuliahan</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Mahasiswa belum memberikan evaluasi kesan perkuliahan untuk kelas ini pada semester aktif.
            </p>
          </div>
        );

      case "ujian":
        return (
          <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-6">
            <FileText className="mx-auto text-slate-400 mb-3" size={40} />
            <h4 className="text-sm font-bold text-slate-700 mb-1">Jadwal Ujian Belum Ditetapkan</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Jadwal UTS (Ujian Tengah Semester) dan UAS (Ujian Akhir Semester) untuk kelas kuliah ini belum didefinisikan oleh admin.
            </p>
          </div>
        );

      case "nilai":
        return (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-blue-900 flex items-center gap-2">
              🏆 Nilai Perkuliahan Mahasiswa
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <Table tableHead={tableHead.nilai} data={dataNilai || []} error="Data nilai kosong" />
            </div>
          </div>
        );

      case "kuesioner":
        return (
          <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-6">
            <FileText className="mx-auto text-slate-400 mb-3" size={40} />
            <h4 className="text-sm font-bold text-slate-700 mb-1">Rekap Kuesioner Dosen Belum Tersedia</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Hasil survei evaluasi dosen dari kelas ini belum diproses oleh penjaminan mutu fakultas/universitas.
            </p>
          </div>
        );

      case "rps":
        return (
          <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-6">
            <FileText className="mx-auto text-slate-400 mb-3" size={40} />
            <h4 className="text-sm font-bold text-slate-700 mb-1">Rencana Pembelajaran Semester (RPS)</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-3">
              RPS untuk Mata Kuliah ini belum terhubung secara otomatis dengan kelas kuliah.
            </p>
            {detailData?.mataKuliah?.id && (
              <Link
                to={`${LecturerRoute.courses.detailCourse}`}
                onClick={() => localStorage.setItem("id_mata_kuliah", detailData.mataKuliah.id)}
                className="inline-flex bg-primary-green text-white text-xs px-3.5 py-1.5 rounded font-bold hover:bg-green-700 transition"
              >
                Lihat RPS di Detail Mata Kuliah
              </Link>
            )}
          </div>
        );

      case "tugas":
        return (
          <div className="text-center py-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-6">
            <FileText className="mx-auto text-slate-400 mb-3" size={40} />
            <h4 className="text-sm font-bold text-slate-700 mb-1">Tugas Kuliah Belum Dibuat</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Belum ada tugas kuliah yang diunggah atau ditugaskan untuk kelas kuliah ini.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout
      titlePage="Data Kelas"
      isGreeting={false}
    >
      {/* Subtitle directly below page header */}
      <div className="text-xs sm:text-sm text-slate-500 -mt-3 mb-4 font-semibold">
        Detail Kelas dan Jadwal Perkuliahan
      </div>

      {/* Main White Bordered Container */}
      <div className="w-full bg-white py-4 rounded border-t-2 border-primary-green px-4 max-w-screen-xl mx-auto shadow-sm">
        
        {/* Search Input & Action Buttons Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center bg-[#F9FBF9] p-3 border border-slate-200/80 rounded-md gap-3 mb-6">
          {/* Search bar on the left */}
          <div className="flex items-center w-full lg:w-72 border border-slate-300 rounded bg-white overflow-hidden shadow-sm focus-within:border-primary-green transition">
            <span className="pl-3 text-slate-400">
              <Search size={15} />
            </span>
            <input
              type="text"
              placeholder="Cari Data Kelas"
              className="px-2.5 py-1.5 text-xs sm:text-sm outline-none w-full text-slate-700 font-medium"
              disabled
            />
            <button className="bg-primary-green text-white px-3 py-2 text-xs sm:text-sm font-semibold flex items-center justify-center hover:bg-green-700 transition">
              Cari
            </button>
          </div>

          {/* Action buttons on the right */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-end">
            <Link
              to={LecturerRoute.courses.class}
              onClick={() => localStorage.removeItem("id_kelas_kuliah")}
              className="bg-primary-blueSoft hover:bg-blue-600 flex rounded px-4 py-1.5 items-center text-white text-xs sm:text-sm font-bold shadow-sm transition"
            >
              <ChevronLeft size={16} className="mr-1" />
              Kembali ke Daftar
            </Link>
            <button className="bg-emerald-500 opacity-50 cursor-not-allowed flex rounded px-4 py-1.5 items-center text-white text-xs sm:text-sm font-bold shadow-sm">
              <Plus size={15} className="mr-1" /> Tambah Baru
            </button>
            <button className="bg-amber-500 opacity-50 cursor-not-allowed flex rounded px-4 py-1.5 items-center text-white text-xs sm:text-sm font-bold shadow-sm">
              <Edit2 size={13} className="mr-1" /> Edit
            </button>
            <button className="bg-red-500 opacity-50 cursor-not-allowed flex rounded px-4 py-1.5 items-center text-white text-xs sm:text-sm font-bold shadow-sm">
              <Trash2 size={14} className="mr-1" /> Hapus
            </button>
          </div>
        </div>

        {/* Sidebar Nav and Content Tab Grid */}
        <div className="w-full flex flex-col lg:flex-row gap-5">
          {/* Left Sidebar Menu */}
          <div className="lg:w-1/5 w-full flex lg:flex-col max-h-fit gap-0.5 rounded border border-slate-200 shadow-sm bg-white overflow-hidden">
            <ButtonGroupOption options={selectOptions} selected={option} onChange={setOption} />
          </div>
          
          {/* Right Content View */}
          <div className="w-full lg:w-4/5 overflow-x-auto min-h-[400px]">
            {renderContent()}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DetailClassLecturer;
