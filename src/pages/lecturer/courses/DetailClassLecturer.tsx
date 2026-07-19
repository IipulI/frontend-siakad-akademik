import React, { useState } from "react";
import { ChevronLeft, Search, RefreshCw, List, Settings, Edit, Check, X, Eye } from "lucide-react";
import TableDetailClass from "../../../components/lecturer/TableDetailClass";
import ButtonGroupOption from "../../../components/lecturer/ButtonGroupOption";
import { Link } from "react-router-dom";
import { LecturerRoute } from "../../../types/VarRoutes";
import MainLayout from "../../../components/layouts/MainLayout";
import { Table } from "../../../components/Table";
import { useClassParticipants, useClassDetail, useClassGrading, useSubmitGrading } from "../../../hooks/lecturer/useFetchClass";

const selectOptions = [
  { value: "detail", text: "Detail Kelas" },
  { value: "peserta", text: "Peserta Kelas" },
  { value: "nilai", text: "Nilai Perkuliahan" },
];

const tableHead = {
  detail: ["No", "Hari", "Jam Mulai", "Jam selesai", "Jenis Pertemuan", "Metode Pembelajaran", "Ruang"],
  peserta: ["No", "Nim", "Nama Mahasiswa", "Program Studi", "Angkatan", "Status KRS"],
};

const DetailClassLecturer = () => {
  const id = localStorage.getItem("id_kelas_kuliah");

  const [option, setOption] = useState("detail");
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    kehadiran: "",
    tugas: "",
    uts: "",
    uas: ""
  });

  const { isPending: isLoadingDetail, data: detailData, error: errorDetail } = useClassDetail(id);
  const { isPending: isLoadingPeserta, data: pesertaData, error: errorPeserta } = useClassParticipants(id);
  const { isPending: isLoadingGrading, data: gradingData, error: errorGrading } = useClassGrading(id);

  const submitGradingMutation = useSubmitGrading(id);

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

  const dataDetail = detailData?.jadwalKuliah?.map((item: any, index: number) => {
    const jamMulai = item.jamMulai?.split(":").slice(0, 2).join(".") || "";
    const jamSelesai = item.jamSelesai?.split(":").slice(0, 2).join(".") || "";
    return {
      id: index,
      hari: item.hari || "-",
      jamMulai: jamMulai || "-",
      jamSelesai: jamSelesai || "-",
      jenisPertemuan: item.jenisPertemuan || "-",
      metodePembelajaran: item.metodePembelajaran || "-",
      ruang: item.ruangan?.nama || item.siakRuangan?.namaRuangan || "-",
    };
  }) || [];

  const dataPeserta = pesertaData?.map((item: any, index: number) => ({
    id: item.id,
    no: index + 1,
    nim: item.npm,
    namaMahasiswa: item.nama,
    programStudi: item.programStudiResDto?.namaProgramStudi || "-",
    angkatan: item.angkatan,
    status: item.status || "Belum disetujui",
  }));

  const handleEditClick = (item: any) => {
    setEditingStudentId(item.mahasiswaId);
    setEditForm({
      kehadiran: String(item.kehadiran ?? 0),
      tugas: String(item.tugas ?? 0),
      uts: String(item.uts ?? 0),
      uas: String(item.uas ?? 0)
    });
  };

  const handleCancelClick = () => {
    setEditingStudentId(null);
  };

  const handleSaveClick = async (mahasiswaId: string) => {
    try {
      await submitGradingMutation.mutateAsync({
        siakMahasiswaId: mahasiswaId,
        kehadiran: editForm.kehadiran,
        tugas: editForm.tugas,
        uts: editForm.uts,
        uas: editForm.uas
      });
      alert("Nilai berhasil disimpan!");
      setEditingStudentId(null);
    } catch (e: any) {
      alert(e.response?.data?.message || e.message || "Gagal menyimpan nilai!");
    }
  };

  const renderContent = () => {
    if (isLoadingDetail || isLoadingPeserta || isLoadingGrading) {
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
            {/* Grid Detail Kelas (2-column layout matching screenshot 1) */}
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              {/* Left side fields */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="w-1/3 font-bold text-gray-700">Periode Akademik</span>
                  <div className="w-2/3 bg-[#f5f7ff] text-gray-800 font-semibold px-4 py-2 rounded-md border border-gray-100">
                    {detailData.periodeAkademik || "-"}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-1/3 font-bold text-gray-700">Program Studi</span>
                  <div className="w-2/3 bg-[#f5f7ff] text-gray-800 font-semibold px-4 py-2 rounded-md border border-gray-100">
                    {detailData.programStudi?.jenjang?.jenjang ? `${detailData.programStudi.jenjang.jenjang} - ` : ""}
                    {detailData.programStudi?.namaProgramStudi || "-"}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-1/3 font-bold text-gray-700">Kurikulum</span>
                  <div className="w-2/3 bg-[#f5f7ff] text-gray-800 font-semibold px-4 py-2 rounded-md border border-gray-100">
                    {detailData.mataKuliah?.tahunKurikulum || "-"}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-1/3 font-bold text-gray-700">Mata Kuliah</span>
                  <div className="w-2/3 bg-[#f5f7ff] text-gray-800 font-semibold px-4 py-2 rounded-md border border-gray-100">
                    {detailData.mataKuliah?.namaMataKuliah || "-"}
                    {detailData.mataKuliah?.totalSks ? ` (${detailData.mataKuliah.totalSks} SKS` : ""}
                    {detailData.mataKuliah?.semester ? ` - SMT${detailData.mataKuliah.semester})` : ")"}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-1/3 font-bold text-gray-700">Nama Kelas</span>
                  <div className="w-2/3 bg-[#f5f7ff] text-gray-800 font-semibold px-4 py-2 rounded-md border border-gray-100">
                    {detailData.nama || "-"}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-1/3 font-bold text-gray-700">Sistem Kelas</span>
                  <div className="w-2/3 bg-[#f5f7ff] text-gray-800 font-semibold px-4 py-2 rounded-md border border-gray-100">
                    {detailData.sistemKuliah || "-"}
                  </div>
                </div>
              </div>

              {/* Right side fields */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="w-1/3 font-bold text-gray-700">Kapasitas</span>
                  <div className="w-2/3 bg-[#f5f7ff] text-gray-800 font-semibold px-4 py-2 rounded-md border border-gray-100">
                    {detailData.kapasitas || "0"}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-1/3 font-bold text-gray-700">Tanggal Mulai</span>
                  <div className="w-2/3 bg-[#f5f7ff] text-gray-800 font-semibold px-4 py-2 rounded-md border border-gray-100">
                    {formatDate(detailData.tanggalMulai)}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-1/3 font-bold text-gray-700">Tanggal Selesai</span>
                  <div className="w-2/3 bg-[#f5f7ff] text-gray-800 font-semibold px-4 py-2 rounded-md border border-gray-100">
                    {formatDate(detailData.tanggalSelesai)}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-1/3 font-bold text-gray-700">Jumlah Pertemuan</span>
                  <div className="w-2/3 bg-[#f5f7ff] text-gray-800 font-semibold px-4 py-2 rounded-md border border-gray-100">
                    {detailData.jumlahPertemuan || "16"}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-1/3"></span>
                  <div className="w-2/3 h-10"></div>
                </div>
              </div>
            </div>

            {/* Jadwal Mingguan Table directly below the detail card */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-6">
              <TableDetailClass tableHead={tableHead.detail} data={dataDetail || []} error="Jadwal belum tersedia" />
            </div>
          </div>
        );

      case "peserta":
        return (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-blue-900 flex items-center gap-2">
              👥 Peserta Kelas ({dataPeserta?.length || 0} Mahasiswa)
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <Table tableHead={tableHead.peserta} data={dataPeserta || []} error="Peserta tidak ditemukan" />
            </div>
          </div>
        );

      case "nilai":
        const komposisi = gradingData?.komposisiNilai || {};
        const headerTugas = `Tugas (${komposisi.tugas ? parseFloat(komposisi.tugas).toFixed(2).replace('.', ',') : "0,00"}%)`;
        const headerUts = `UTS (${komposisi.uts ? parseFloat(komposisi.uts).toFixed(2).replace('.', ',') : "0,00"}%)`;
        const headerUas = `UAS (${komposisi.uas ? parseFloat(komposisi.uas).toFixed(2).replace('.', ',') : "0,00"}%)`;
        const headerKehadiran = `Kehadiran (${komposisi.kehadiran ? parseFloat(komposisi.kehadiran).toFixed(2).replace('.', ',') : "0,00"}%)`;

        return (
          <div className="space-y-6">
            {/* Grid Detail Nilai (2-column layout matching screenshot 2) */}
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              {/* Left side fields */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="w-1/3 font-bold text-gray-700">Program Studi</span>
                  <div className="w-2/3 bg-[#f5f7ff] text-gray-800 font-semibold px-4 py-2 rounded-md border border-gray-100">
                    {detailData.programStudi?.jenjang?.jenjang ? `${detailData.programStudi.jenjang.jenjang} - ` : ""}
                    {detailData.programStudi?.namaProgramStudi || "-"}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-1/3 font-bold text-gray-700">Mata Kuliah</span>
                  <div className="w-2/3 bg-[#f5f7ff] text-gray-800 font-semibold px-4 py-2 rounded-md border border-gray-100">
                    {detailData.mataKuliah?.namaMataKuliah || "-"}
                    {detailData.mataKuliah?.totalSks ? ` (${detailData.mataKuliah.totalSks} SKS` : ""}
                    {detailData.mataKuliah?.semester ? ` - SMT${detailData.mataKuliah.semester})` : ")"}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-1/3 font-bold text-gray-700">Kurikulum</span>
                  <div className="w-2/3 bg-[#f5f7ff] text-gray-800 font-semibold px-4 py-2 rounded-md border border-gray-100">
                    {detailData.mataKuliah?.tahunKurikulum || "-"}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-1/3 font-bold text-gray-700">Kapasitas</span>
                  <div className="w-2/3 bg-[#f5f7ff] text-gray-800 font-semibold px-4 py-2 rounded-md border border-gray-100">
                    {detailData.kapasitas || "0"}
                  </div>
                </div>
              </div>

              {/* Right side fields */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="w-1/3 font-bold text-gray-700">Periode Akademik</span>
                  <div className="w-2/3 bg-[#f5f7ff] text-gray-800 font-semibold px-4 py-2 rounded-md border border-gray-100">
                    {detailData.periodeAkademik || "-"}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-1/3 font-bold text-gray-700">Nama Kelas</span>
                  <div className="w-2/3 bg-[#f5f7ff] text-gray-800 font-semibold px-4 py-2 rounded-md border border-gray-100">
                    {detailData.nama || "-"}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-1/3 font-bold text-gray-700">Sistem Kuliah</span>
                  <div className="w-2/3 bg-[#f5f7ff] text-gray-800 font-semibold px-4 py-2 rounded-md border border-gray-100">
                    {detailData.sistemKuliah || "-"}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="w-1/3 font-bold text-gray-700">Peserta</span>
                  <div className="w-2/3 bg-[#f5f7ff] text-gray-800 font-semibold px-4 py-2 rounded-md border border-gray-100">
                    {gradingData?.pesertaKelas?.length || "0"}
                  </div>
                </div>
              </div>
            </div>

            {/* Input Nilai Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm mt-6">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-primary-green text-white text-center font-bold">
                    <th className="p-3 border border-gray-300 w-16">NO</th>
                    <th className="p-3 border border-gray-300">NIM</th>
                    <th className="p-3 border border-gray-300">Nama</th>
                    <th className="p-3 border border-gray-300">{headerTugas}</th>
                    <th className="p-3 border border-gray-300">{headerUts}</th>
                    <th className="p-3 border border-gray-300">{headerUas}</th>
                    <th className="p-3 border border-gray-300">{headerKehadiran}</th>
                    <th className="p-3 border border-gray-300">Nilai</th>
                    <th className="p-3 border border-gray-300">Grade</th>
                    <th className="p-3 border border-gray-300">Lulus</th>
                    <th className="p-3 border border-gray-300">Keterangan</th>
                    <th className="p-3 border border-gray-300 w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-center text-gray-700">
                  {gradingData?.pesertaKelas?.map((item: any, index: number) => {
                    const isEditing = editingStudentId === item.mahasiswaId;
                    const isLulus = item.nilai >= 60;
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-3 border border-gray-300">{index + 1}</td>
                        <td className="p-3 border border-gray-300">{item.npm || "-"}</td>
                        <td className="p-3 border border-gray-300 text-left px-4">{item.nama || "-"}</td>

                        {/* Tugas */}
                        <td className="p-3 border border-gray-300 w-24">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editForm.tugas}
                              onChange={(e) => setEditForm({ ...editForm, tugas: e.target.value })}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-center font-semibold text-sm outline-none focus:border-primary-green"
                            />
                          ) : (
                            item.tugas ?? "-"
                          )}
                        </td>

                        {/* UTS */}
                        <td className="p-3 border border-gray-300 w-24">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editForm.uts}
                              onChange={(e) => setEditForm({ ...editForm, uts: e.target.value })}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-center font-semibold text-sm outline-none focus:border-primary-green"
                            />
                          ) : (
                            item.uts ?? "-"
                          )}
                        </td>

                        {/* UAS */}
                        <td className="p-3 border border-gray-300 w-24">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editForm.uas}
                              onChange={(e) => setEditForm({ ...editForm, uas: e.target.value })}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-center font-semibold text-sm outline-none focus:border-primary-green"
                            />
                          ) : (
                            item.uas ?? "-"
                          )}
                        </td>

                        {/* Kehadiran */}
                        <td className="p-3 border border-gray-300 w-24">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editForm.kehadiran}
                              onChange={(e) => setEditForm({ ...editForm, kehadiran: e.target.value })}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-center font-semibold text-sm outline-none focus:border-primary-green"
                            />
                          ) : (
                            item.kehadiran ?? "-"
                          )}
                        </td>

                        {/* Nilai Akhir */}
                        <td className="p-3 border border-gray-300">
                          {item.nilai != null ? parseFloat(item.nilai).toFixed(2) : "-"}
                        </td>

                        {/* Grade */}
                        <td className="p-3 border border-gray-300">{item.hurufMutu || "-"}</td>

                        {/* Lulus */}
                        <td className="p-3 border border-gray-300">
                          <div className="flex items-center justify-center">
                            {isLulus ? <Check className="text-green-600" size={18} /> : <X className="text-red-600" size={18} />}
                          </div>
                        </td>

                        {/* Keterangan */}
                        <td className="p-3 border border-gray-300">
                          <div className="flex items-center justify-center">
                            {isLulus ? <Check className="text-green-600" size={18} /> : <X className="text-red-600" size={18} />}
                          </div>
                        </td>

                        {/* Aksi */}
                        <td className="p-3 border border-gray-300">
                          <div className="flex items-center justify-center gap-1.5">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleSaveClick(item.mahasiswaId)}
                                  disabled={submitGradingMutation.isPending}
                                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded p-1.5 shadow-sm transition"
                                  title="Simpan"
                                >
                                  <Check size={14} className="stroke-[3]" />
                                </button>
                                <button
                                  onClick={handleCancelClick}
                                  className="bg-red-500 hover:bg-red-600 text-white rounded p-1.5 shadow-sm transition"
                                  title="Batal"
                                >
                                  <X size={14} className="stroke-[3]" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditClick(item)}
                                  className="bg-amber-500 hover:bg-amber-600 text-white rounded p-1.5 shadow-sm transition"
                                  title="Edit Nilai"
                                >
                                  <Edit size={14} className="stroke-[3]" />
                                </button>
                                <button
                                  className="bg-cyan-500 hover:bg-cyan-600 text-white rounded p-1.5 shadow-sm transition cursor-not-allowed"
                                  title="Detail"
                                >
                                  <Eye size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {(!gradingData?.pesertaKelas || gradingData.pesertaKelas.length === 0) && (
                    <tr>
                      <td colSpan={12} className="p-6 text-center text-gray-500">
                        Belum ada data peserta kelas atau nilai.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout
      titlePage="Kelas Kuliah"
      isGreeting={false}
    >
      {/* Subtitle directly below page header */}
      <div className="text-xs sm:text-sm text-slate-500 -mt-3 mb-4 font-semibold">
        {option === "nilai" ? "Nilai Kuliah Peserta Kelas" : "Detail Kelas dan Jadwal Perkuliahan"}
      </div>

      {/* Main White Bordered Container */}
      <div className="w-full bg-white py-4 rounded border-t-2 border-primary-green px-4 max-w-screen-xl mx-auto shadow-sm">

        {/* Search Input & Action Buttons Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center bg-[#F9FBF9] p-3 border border-slate-200/80 rounded-md gap-3 mb-6">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Dropdown -Semua- */}
            <select className="rounded border border-gray-300 px-3 py-1.5 text-sm bg-white text-gray-600 outline-none">
              <option value="">-Semua-</option>
            </select>

            {/* Search Input bar */}
            <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white shadow-sm focus-within:border-[#00c274] transition">
              <input
                type="text"
                placeholder="Cari Mata Kuliah"
                className="px-3 py-1.5 text-sm outline-none w-64 text-gray-700"
                disabled
              />
              <button className="bg-[#00c274] hover:bg-[#00a864] text-white p-2.5 flex items-center justify-center transition cursor-not-allowed">
                <Search size={16} />
              </button>
              <button className="bg-[#4b6bfb] hover:bg-[#3b5beb] text-white p-2.5 flex items-center justify-center border-l border-gray-200 transition cursor-not-allowed">
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {/* Action buttons on the right */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-end">
            <Link
              to={LecturerRoute.courses.class}
              onClick={() => localStorage.removeItem("id_kelas_kuliah")}
              className="bg-[#00c0ef] hover:bg-cyan-600 flex rounded px-4 py-1.5 items-center text-white text-xs sm:text-sm font-bold shadow-sm transition"
            >
              <ChevronLeft size={16} className="mr-1" />
              Kembali ke Daftar
            </Link>

            {/* Riwayat Nilai & Aksi buttons (displayed only when option === 'nilai') */}
            {option === "nilai" && (
              <>
                <button className="bg-[#4b6bfb] hover:bg-[#3b5beb] flex rounded px-4 py-1.5 items-center text-white text-xs sm:text-sm font-bold shadow-sm transition">
                  <List size={16} className="mr-1.5" />
                  Riwayat Nilai
                </button>
                <button className="bg-[#fda31b] hover:bg-[#e08f14] flex rounded px-4 py-1.5 items-center text-white text-xs sm:text-sm font-bold shadow-sm transition">
                  <Settings size={16} className="mr-1.5" />
                  Aksi <span className="ml-1 text-[10px]">▼</span>
                </button>
              </>
            )}
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
