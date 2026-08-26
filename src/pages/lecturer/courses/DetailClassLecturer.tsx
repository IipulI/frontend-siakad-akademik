import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Save,
  Settings,
  Trash2,
  Lock,
  Unlock,
  Grid3x3,
  Info,
  X,
  Printer,
  Pencil,
  Cpu,
  Check,
  History,
} from "lucide-react";
import BorderedGreenContainer from "../../../components/BorderedGreenContainer";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { LecturerRoute } from "../../../types/VarRoutes";
import { TabNavigationButtonStudent } from "../../../components/admin-academic/dashboard/TabNavigasiButton";
import { useClassParticipants, useClassDetail } from "../../../hooks/lecturer/useFetchClass";
import { getClassRPS, getStudentExams } from "../../../hooks/useKelasKuliah";
import {
  useNilaiKelas,
  useKunciNilaiKelas,
  useSimpanNilaiMahasiswa,
  useKomposisiNilai,
  fetchNilaiKelasPdfBlobUrl,
  useRincianNilaiMahasiswa,
} from "../../../hooks/useNilaiPerkuliahan";
import { useCapaianCpmk, useCapaianCpl, fetchCapaianExportBlobUrl } from "../../../hooks/useCapaianPembelajaran";
import { useSimpanNilaiKomponenCbt } from "../../../hooks/useCbtManual";
import LoadingSpinner from "../../../components/LoadingSpinner";
import DateFormatter from "../../../helpers/DateFormatter";

const DetailClassLecturer = () => {
  const navigate = useNavigate();
  const { id: idFromParams } = useParams<{ id: string }>();
  // FIX: sebelumnya cuma ngandelin localStorage buat tau kelas mana yang mau
  // dibuka -- kalau halaman ini dibuka langsung/refresh/lewat bookmark (bukan
  // klik dari daftar Kelas Kuliah dulu), localStorage-nya kosong dan langsung
  // gagal "data kelas tidak ditemukan" walau kelasnya beneran ada. Sekarang
  // utamain ID dari URL (/dosen/perkuliahan/kelas-kuliah/detail/:id), fallback
  // ke localStorage cuma buat jaga kompatibilitas link lama yang belum ke-update.
  const id = idFromParams || localStorage.getItem("id_kelas_kuliah");

  const { data: d, isLoading: isLoadingDetail, error: errorDetail } = useClassDetail(id);

  const [activeTab, setActiveTab] = useState("classDetails");
  const handleTabClick = (tab: string) => setActiveTab(tab);

  const back = () => {
    navigate(LecturerRoute.courses.class);
    localStorage.removeItem("id_kelas_kuliah");
  };

  if (isLoadingDetail) {
    return (
      <MainLayout titlePage="Kelas Kuliah" isGreeting={false}>
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  if (errorDetail || !d) {
    return (
      <MainLayout titlePage="Kelas Kuliah" isGreeting={false}>
        <div className="p-8 text-center text-red-500">Gagal memuat detail kelas atau data kelas tidak ditemukan.</div>
      </MainLayout>
    );
  }

  // Adapter -- samain bentuk data ke yang dipakai komponen hasil porting dari
  // halaman admin (ClassBio, RPS, Grading, CapaianPembelajaran, ExamSchedule),
  // biar komponennya bisa dipakai persis tanpa diubah-ubah lagi.
  const data = {
    id: d.id,
    nama: d.nama,
    kapasitas: d.kapasitas,
    jumlahPeminat: d.jumlahPeminat,
    sistemKuliah: d.sistemKuliah,
    siakPeriodeAkademikId: d.siakPeriodeAkademikId,
    periodeAkademik: { nama: d.periodeAkademik },
    programStudi: { nama: d.programStudi?.namaProgramStudi, jenjang: d.programStudi?.jenjang },
    mataKuliah: {
      id: d.mataKuliah?.id,
      kode: d.mataKuliah?.kodeMataKuliah,
      nama: d.mataKuliah?.namaMataKuliah,
      totalSks: d.mataKuliah?.totalSks,
      tahunKurikulum: { tahun: d.mataKuliah?.tahunKurikulum },
    },
  };

  return (
    <MainLayout titlePage="Kelas Kuliah" isGreeting={false}>
      <div className="space-y-4">
        <BorderedGreenContainer>
          <div className="flex flex-wrap justify-end items-center gap-2 sm:gap-4 mb-4">
            <ButtonClick icon={<ArrowLeft size={15} strokeWidth={3} />} color="bg-primary-yellow" text="Kembali Ke Daftar" onClick={back} />
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-6 gap-4 items-start">
            <div className="w-full lg:col-span-1">
              <div className="flex lg:flex-col gap-2 overflow-x-auto scrollbar-hide pb-2">
                <TabNavigationButtonStudent isActive={activeTab === "classDetails"} onClick={() => handleTabClick("classDetails")}>
                  Detail Kelas
                </TabNavigationButtonStudent>
                <TabNavigationButtonStudent isActive={activeTab === "classAttendant"} onClick={() => handleTabClick("classAttendant")}>
                  Peserta Kelas
                </TabNavigationButtonStudent>
                <TabNavigationButtonStudent isActive={activeTab === "rps"} onClick={() => handleTabClick("rps")}>
                  RPS
                </TabNavigationButtonStudent>
                <TabNavigationButtonStudent isActive={activeTab === "grading"} onClick={() => handleTabClick("grading")}>
                  Nilai Perkuliahan
                </TabNavigationButtonStudent>
                <TabNavigationButtonStudent isActive={activeTab === "capaian"} onClick={() => handleTabClick("capaian")}>
                  Capaian Pembelajaran
                </TabNavigationButtonStudent>
                <TabNavigationButtonStudent isActive={activeTab === "examSchedule"} onClick={() => handleTabClick("examSchedule")}>
                  Jadwal Ujian
                </TabNavigationButtonStudent>
              </div>
            </div>

            <div className="w-full lg:col-span-5">
              {activeTab === "classDetails" && <ClassDetailTab data={data} kelasId={id} />}
              {activeTab === "classAttendant" && <ClassAttendantTab kelasId={data.id} />}
              {activeTab === "rps" && <RPS data={data} />}
              {activeTab === "grading" && <Grading data={data} />}
              {activeTab === "capaian" && <CapaianPembelajaran data={data} />}
              {activeTab === "examSchedule" && <ExamSchedule data={data} />}
            </div>
          </div>
        </BorderedGreenContainer>
      </div>
    </MainLayout>
  );
};

const ClassBio = ({ data }: { data: any }) => (
  <div className="bg-[#F5FFF9] w-full px-4 py-4 mt-5 border-l-8 border-[#116E63] rounded-md">
    <h2 className="font-semibold text-base mb-4">Status</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm sm:text-base">
      <div className="flex flex-col space-y-2">
        <p><span className="font-medium">Program Studi: {data.programStudi?.nama ?? "-"}</span></p>
        <p><span className="font-medium">Mata Kuliah: {` ${data.mataKuliah?.kode ?? "-"} - ${data.mataKuliah?.nama ?? "-"} - ${data.mataKuliah?.totalSks ?? "-"} SKS`}</span></p>
        <p><span className="font-medium">Kurikulum: {data.mataKuliah?.tahunKurikulum?.tahun ?? "-"}</span></p>
        <p><span className="font-medium">Kapasitas: {data.kapasitas}</span></p>
      </div>
      <div className="flex flex-col space-y-2">
        <p><span className="font-medium">Periode: {data.periodeAkademik?.nama ?? "-"}</span></p>
        <p><span className="font-medium">Nama Kelas: {data.nama}</span></p>
        <p><span className="font-medium">Sistem Kuliah: {data.sistemKuliah}</span></p>
        <p><span className="font-medium">Peserta: {data.jumlahPeminat ?? 0}</span></p>
      </div>
    </div>
  </div>
);

const ClassDetailTab = ({ data, kelasId }: { data: any; kelasId: string | null }) => {
  const { data: d } = useClassDetail(kelasId);
  const jadwal: any[] = d?.jadwalKuliah || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Row label="Periode Akademik" value={data.periodeAkademik?.nama} />
        <Row label="Sistem Kuliah" value={data.sistemKuliah} />
        <Row label="Program Studi" value={data.programStudi?.nama} />
        <Row label="Kapasitas" value={data.kapasitas} />
        <Row label="Tahun Kurikulum" value={data.mataKuliah?.tahunKurikulum?.tahun} />
        <Row label="Mata Kuliah" value={`${data.mataKuliah?.kode || ""} - ${data.mataKuliah?.nama || ""}`} />
        <Row label="Nama Kelas" value={data.nama} />
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-lg sm:text-xl">Jadwal Mingguan</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-primary-green text-white text-center">
                <th className="p-3 border border-gray-300">No</th>
                <th className="p-3 border border-gray-300">Hari</th>
                <th className="p-3 border border-gray-300">Jam Mulai</th>
                <th className="p-3 border border-gray-300">Jam Selesai</th>
                <th className="p-3 border border-gray-300">Jenis Pertemuan</th>
                <th className="p-3 border border-gray-300">Metode Pembelajaran</th>
                <th className="p-3 border border-gray-300">Ruang</th>
              </tr>
            </thead>
            <tbody>
              {jadwal.length > 0 ? (
                jadwal.map((item: any, index: number) => (
                  <tr key={item.id || index} className="text-center hover:bg-gray-50">
                    <td className="p-3 border border-gray-300">{index + 1}</td>
                    <td className="p-2 border border-gray-300">{item.hari || "-"}</td>
                    <td className="p-2 border border-gray-300">{item.jamMulai?.split(":").slice(0, 2).join(":") || "-"}</td>
                    <td className="p-2 border border-gray-300">{item.jamSelesai?.split(":").slice(0, 2).join(":") || "-"}</td>
                    <td className="p-2 border border-gray-300">{item.jenisPertemuan || "-"}</td>
                    <td className="p-2 border border-gray-300">{item.metodePembelajaran || "-"}</td>
                    <td className="p-2 border border-gray-300">{item.ruangan?.nama || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">Jadwal belum tersedia.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: any }) => (
  <div className="flex items-center justify-between border-b border-gray-100 py-3">
    <span className="font-semibold text-[#666666]">{label}</span>
    <span className="text-gray-800 font-semibold">{value ?? "-"}</span>
  </div>
);

const ClassAttendantTab = ({ kelasId }: { kelasId: string }) => {
  const { data: pesertaData, isLoading } = useClassParticipants(kelasId);
  const dataPeserta = (pesertaData || []).map((item: any, index: number) => ({
    id: item.id,
    no: index + 1,
    nim: item.npm,
    namaMahasiswa: item.nama,
    programStudi: item.programStudiResDto?.namaProgramStudi || "-",
    angkatan: item.angkatan,
    status: item.status || "Belum disetujui",
  }));

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-blue-900 flex items-center gap-2">
        👥 Peserta Kelas ({dataPeserta.length} Mahasiswa)
      </h3>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-primary-green text-white text-center">
              <th className="p-3 border border-gray-300">No</th>
              <th className="p-3 border border-gray-300">Nim</th>
              <th className="p-3 border border-gray-300">Nama Mahasiswa</th>
              <th className="p-3 border border-gray-300">Program Studi</th>
              <th className="p-3 border border-gray-300">Angkatan</th>
              <th className="p-3 border border-gray-300">Status KRS</th>
            </tr>
          </thead>
          <tbody>
            {dataPeserta.length > 0 ? (
              dataPeserta.map((row) => (
                <tr key={row.id} className="text-center hover:bg-gray-50">
                  <td className="p-2 border border-gray-300">{row.no}</td>
                  <td className="p-2 border border-gray-300">{row.nim}</td>
                  <td className="p-2 border border-gray-300 text-left">{row.namaMahasiswa}</td>
                  <td className="p-2 border border-gray-300">{row.programStudi}</td>
                  <td className="p-2 border border-gray-300">{row.angkatan}</td>
                  <td className="p-2 border border-gray-300">{row.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">Peserta tidak ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RPS = ({ data }: { data: any }) => {
  const [periodeId, setPeriodeId] = useState("");
  const { data: result, isLoading } = getClassRPS(data.id, periodeId);
  const rps = result?.rps;

  React.useEffect(() => {
    if (rps?.daftarPeriode?.length && !periodeId) {
      const aktif = rps.daftarPeriode.find((p: any) => p.status === "Aktif");
      setPeriodeId((aktif || rps.daftarPeriode[0]).id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rps]);

  const InfoItem = ({ label, children }: { label: string; children: any }) => (
    <div className="mb-4">
      <h3 className="font-semibold text-gray-700 text-base md:text-lg">{label}</h3>
      <div className="mt-1 text-gray-800 text-sm md:text-base">{children}</div>
    </div>
  );

  if (isLoading || !rps) {
    return <LoadingSpinner />;
  }

  const rpsData = rps.rpsData;

  return (
    <div className="space-y-4 w-full px-4 md:px-0">
      <ClassBio data={data} />

      <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow">
        <label className="font-semibold text-gray-700 mr-2">Periode Akademik</label>
        <select value={periodeId} onChange={(e) => setPeriodeId(e.target.value)} className="border border-gray-300 rounded-md p-2 text-sm">
          {(rps.daftarPeriode || []).map((p: any) => (
            <option key={p.id} value={p.id}>
              {p.nama} {p.adaDataRps ? "" : "(belum ada RPS)"}
            </option>
          ))}
        </select>
      </div>

      {!rpsData ? (
        <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow text-center text-gray-500">
          📭 <span className="block mt-2">RPS belum tersedia untuk mata kuliah ini pada periode terpilih.</span>
        </div>
      ) : (
        <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow overflow-x-auto">
          <InfoItem label="Mata Kuliah">
            {rps.mataKuliah?.kode} - {rps.mataKuliah?.nama} ({rps.mataKuliah?.totalSks} SKS)
          </InfoItem>
          <InfoItem label="Unit Pengampu">{rps.mataKuliah?.unitPengampu}</InfoItem>
          <InfoItem label="Tanggal Penyusunan">{rpsData.tanggalPenyusunan ? DateFormatter(rpsData.tanggalPenyusunan) : "-"}</InfoItem>
          <InfoItem label="Deskripsi Mata Kuliah">{rpsData.deskripsiMataKuliah || "-"}</InfoItem>
          <InfoItem label="Tujuan Mata Kuliah">{rpsData.tujuanMataKuliah || "-"}</InfoItem>
          <InfoItem label="Materi Pembelajaran">{rpsData.materiPembelajaran || "-"}</InfoItem>
          <InfoItem label="Pustaka Utama">{rpsData.pustakaUtama || "-"}</InfoItem>
          <InfoItem label="Pustaka Pendukung">{rpsData.pustakaPendukung || "-"}</InfoItem>
          <InfoItem label="Media Perangkat Lunak">{rpsData.mediaPerangkatLunak || "-"}</InfoItem>
          <InfoItem label="Media Perangkat Keras">{rpsData.mediaPerangkatKeras || "-"}</InfoItem>
          <InfoItem label="Dokumen RPS">
            {rpsData.dokumenRpsUrl ? (
              <a href={rpsData.dokumenRpsUrl} target="_blank" rel="noreferrer" className="text-green-700 underline hover:text-green-900 break-words">
                {rpsData.dokumenRpsNamaFile || "Lihat Dokumen"}
              </a>
            ) : (
              "Belum ada dokumen"
            )}
          </InfoItem>
        </div>
      )}
    </div>
  );
};

const Grading = ({ data }: { data: any }) => {
  const { data: nilai, isLoading } = useNilaiKelas(data.id);
  const kunciMutation = useKunciNilaiKelas(data.id);
  const [showAksi, setShowAksi] = useState(false);
  const [showPanduan, setShowPanduan] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [inputNilaiRow, setInputNilaiRow] = useState<any>(null);
  const [inputCbtRow, setInputCbtRow] = useState<any>(null);
  const [rincianRow, setRincianRow] = useState<any>(null);

  const tabel = nilai?.tabel || [];
  const headerKolom = nilai?.headerKolom || [];
  const semuaTerkunci = tabel.length > 0 && tabel.every((r: any) => r.keterangan !== "Belum Terkunci");
  const adaTerkunci = tabel.some((r: any) => r.keterangan !== "Belum Terkunci");

  const handleToggleKunci = () => {
    const action = semuaTerkunci ? "buka" : "kunci";
    const konfirmasi = action === "kunci" ? "Kunci nilai seluruh mahasiswa di kelas ini?" : "Buka kunci nilai seluruh mahasiswa di kelas ini?";
    if (!window.confirm(konfirmasi)) return;
    kunciMutation.mutate(action, {
      onError: (err: any) => alert(err?.response?.data?.message || err?.message || "Gagal mengubah status kunci."),
    });
  };

  const handleUnduhPdfNilai = async () => {
    setShowAksi(false);
    setIsDownloadingPdf(true);
    try {
      const url = await fetchNilaiKelasPdfBlobUrl(data.id);
      window.open(url, "_blank");
    } catch (err: any) {
      alert(err?.message || "Gagal mengunduh PDF Nilai Perkuliahan.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-4 px-4 md:px-0">
      <ClassBio data={data} />

      {!isLoading && nilai && (
        <div className={`p-3 rounded-md border flex gap-3 text-sm ${semuaTerkunci ? "bg-orange-50 border-orange-200 text-orange-800" : "bg-blue-50 border-blue-200 text-blue-800"}`}>
          <span className="font-bold">i</span>
          {tabel.length === 0 ? (
            <p>Belum ada mahasiswa yang mengambil KRS di kelas ini.</p>
          ) : semuaTerkunci ? (
            <p>Nilai seluruh mahasiswa di kelas ini sudah dikunci.</p>
          ) : adaTerkunci ? (
            <p>Sebagian nilai mahasiswa di kelas ini sudah dikunci, sebagian masih terbuka untuk diubah.</p>
          ) : (
            <p>Nilai kelas ini masih terbuka, silakan isi/ubah nilai.</p>
          )}
        </div>
      )}

      <div className="flex flex-wrap justify-end items-center gap-2">
        <button
          onClick={handleToggleKunci}
          disabled={kunciMutation.isPending || tabel.length === 0}
          className="bg-primary-yellow text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
        >
          {semuaTerkunci ? <Unlock size={16} /> : <Lock size={16} />}
          {kunciMutation.isPending ? "Memproses..." : semuaTerkunci ? "Buka Kunci Nilai" : "Kunci Nilai"}
        </button>
        <button onClick={() => setShowPanduan(true)} className="bg-primary-blueDark text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
          <Info size={16} /> Panduan Penilaian
        </button>
        <div className="relative">
          <button onClick={() => setShowAksi((v) => !v)} className="bg-primary-yellow text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90">
            <Settings size={16} /> Aksi
          </button>
          {showAksi && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowAksi(false)} />
              <div className="absolute right-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-20 text-sm overflow-hidden">
                <button onClick={handleUnduhPdfNilai} disabled={isDownloadingPdf} className="w-full text-left px-4 py-2 hover:bg-gray-50 disabled:opacity-50">
                  {isDownloadingPdf ? "Menyiapkan PDF..." : "Unduh PDF Nilai Perkuliahan"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {isLoading || !nilai ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-sm">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-primary-green text-white">
                <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">No</th>
                <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">NIM</th>
                <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">Nama</th>
                <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">Hadir (%)</th>
                {headerKolom.map((h: any) => (
                  <th key={h.id} className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">{h.labelKolom}</th>
                ))}
                <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">Nilai</th>
                <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">Grade</th>
                <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">Lulus</th>
                <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">Keterangan</th>
                <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tabel.length > 0 ? (
                tabel.map((row: any) => (
                  <tr key={row.rincianKrsId} className="hover:bg-gray-50 text-center">
                    <td className="py-2 px-4 border border-gray-300 font-medium">{row.no}</td>
                    <td className="py-2 px-4 border border-gray-300">{row.nim}</td>
                    <td className="py-2 px-4 border border-gray-300 text-left">{row.nama}</td>
                    <td className="py-2 px-4 border border-gray-300">{row.hadir != null ? row.hadir.toFixed(2) : "-"}</td>
                    {headerKolom.map((h: any) => (
                      <td key={h.id} className="py-2 px-4 border border-gray-300">{row.nilaiPerKomponen?.[h.label] ?? "-"}</td>
                    ))}
                    <td className="py-2 px-4 border border-gray-300 font-semibold">{row.nilaiAkhir.toFixed(2)}</td>
                    <td className="py-2 px-4 border border-gray-300">{row.grade}</td>
                    <td className="py-2 px-4 border border-gray-300">{row.lulus ? <span className="text-green-600">✅</span> : ""}</td>
                    <td className="py-2 px-4 border border-gray-300 text-left text-xs">{row.keterangan}</td>
                    <td className="py-2 px-4 border border-gray-300">
                      <div className="flex justify-center gap-1.5">
                        <button
                          onClick={() => setInputNilaiRow(row)}
                          disabled={row.keterangan !== "Belum Terkunci"}
                          title={row.keterangan !== "Belum Terkunci" ? "Nilai sudah dikunci, tidak bisa diinput lagi" : "Input Nilai"}
                          className="bg-primary-blueSoft hover:opacity-90 text-white p-1.5 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setInputCbtRow(row)}
                          disabled={row.keterangan !== "Belum Terkunci"}
                          title={row.keterangan !== "Belum Terkunci" ? "Nilai sudah dikunci, tidak bisa diinput lagi" : "Input Nilai CBT Manual"}
                          className="bg-purple-600 hover:opacity-90 text-white p-1.5 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Cpu size={14} />
                        </button>
                        <button onClick={() => setRincianRow(row)} title="Lihat Rincian Nilai per Sub-CPMK" className="bg-primary-green hover:opacity-90 text-white p-1.5 rounded">
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9 + headerKolom.length} className="text-center py-4 text-gray-500 border">Tidak ada data peserta kelas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showPanduan && <PanduanPenilaianModal onClose={() => setShowPanduan(false)} />}

      {inputNilaiRow && (
        <InputNilaiManualModal kelasId={data.id} row={inputNilaiRow} headerKolom={headerKolom} onClose={() => setInputNilaiRow(null)} />
      )}

      {inputCbtRow && (
        <InputNilaiCbtModal
          kelasId={data.id}
          mataKuliahId={data.mataKuliah?.id}
          periodeId={data.siakPeriodeAkademikId}
          row={inputCbtRow}
          onClose={() => setInputCbtRow(null)}
        />
      )}

      {rincianRow && <RincianNilaiModal kelasId={data.id} row={rincianRow} onClose={() => setRincianRow(null)} />}
    </div>
  );
};

const RincianNilaiModal = ({ kelasId, row, onClose }: { kelasId: string; row: any; onClose: () => void }) => {
  const { data: komponenList = [], isLoading } = useRincianNilaiMahasiswa(kelasId, row.rincianKrsId);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-md shadow-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-primary-blueDark">Rincian Nilai per Sub-CPMK</h2>
            <p className="text-xs text-gray-500 mt-0.5">{row.nim} - {row.nama}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 overflow-auto">
          {isLoading ? (
            <LoadingSpinner />
          ) : komponenList.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">Belum ada nilai per Sub-CPMK yang tercatat untuk mahasiswa ini.</p>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-sm">
              <table className="min-w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th rowSpan={2} className="py-2 px-3 border border-gray-300 bg-primary-green text-white font-semibold whitespace-nowrap align-middle">NIM</th>
                    <th rowSpan={2} className="py-2 px-3 border border-gray-300 bg-primary-green text-white font-semibold whitespace-nowrap align-middle">Nama</th>
                    {komponenList.map((k: any) => (
                      <th key={k.rencanaEvaluasiId} colSpan={k.subCpmk.length} className="py-2 px-3 border border-gray-300 bg-primary-green text-white font-semibold whitespace-nowrap text-center">
                        {k.namaKomponen}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {komponenList.map((k: any) =>
                      k.subCpmk.map((s: any) => (
                        <th key={`${k.rencanaEvaluasiId}-${s.cpmkId}`} className="py-1.5 px-2 border border-gray-300 bg-primary-green/70 text-white font-medium text-xs whitespace-nowrap" title={s.kode}>
                          {s.kode.replace(/^Sub-CPMK|^CPMK/, "")}
                        </th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center hover:bg-gray-50">
                    <td className="py-2 px-3 border border-gray-300 font-medium">{row.nim}</td>
                    <td className="py-2 px-3 border border-gray-300 text-left">{row.nama}</td>
                    {komponenList.map((k: any) =>
                      k.subCpmk.map((s: any) => (
                        <td key={`${k.rencanaEvaluasiId}-${s.cpmkId}`} className="py-2 px-2 border border-gray-300">{s.nilaiPersen.toFixed(2)}</td>
                      ))
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {komponenList.some((k: any) => (k.unitMentah || []).length > 0) && (
            <div className="mt-6">
              <h3 className="text-sm font-bold text-primary-blueDark mb-2">Skor Mentah per Soal (Input Asli Dosen)</h3>
              <div className="space-y-4">
                {komponenList
                  .filter((k: any) => (k.unitMentah || []).length > 0)
                  .map((k: any) => (
                    <div key={k.rencanaEvaluasiId} className="border border-gray-200 rounded-sm overflow-hidden">
                      <div className="bg-primary-green/10 px-3 py-1.5 text-xs font-semibold text-primary-green">{k.namaKomponen}</div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border-collapse">
                          <thead>
                            <tr className="bg-primary-green text-white text-xs">
                              <th className="py-1.5 px-2 border border-gray-300 font-medium whitespace-nowrap">Soal</th>
                              <th className="py-1.5 px-2 border border-gray-300 font-medium whitespace-nowrap">Skor Diperoleh</th>
                              <th className="py-1.5 px-2 border border-gray-300 font-medium whitespace-nowrap">Skor Maksimal</th>
                              <th className="py-1.5 px-2 border border-gray-300 font-medium whitespace-nowrap">Sub-CPMK Diuji (Bobot Poin)</th>
                              <th className="py-1.5 px-2 border border-gray-300 font-medium whitespace-nowrap">Waktu Input</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(k.unitMentah || []).map((u: any) => (
                              <tr key={u.nomorUnit} className="text-center hover:bg-gray-50">
                                <td className="py-1.5 px-2 border border-gray-300">{u.nomorUnit}</td>
                                <td className="py-1.5 px-2 border border-gray-300 font-semibold">{u.skorDiperoleh}</td>
                                <td className="py-1.5 px-2 border border-gray-300">{u.skorMaksimal}</td>
                                <td className="py-1.5 px-2 border border-gray-300 text-left text-xs">
                                  {(u.pemetaanCpmk || []).map((p: any) => `${p.kode}=${p.bobotPoin}`).join(", ")}
                                </td>
                                <td className="py-1.5 px-2 border border-gray-300 text-xs whitespace-nowrap">
                                  {new Date(u.waktuInput).toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-300">Tutup</button>
        </div>
      </div>
    </div>
  );
};

const InputNilaiManualModal = ({ kelasId, row, headerKolom, onClose }: { kelasId: string; row: any; headerKolom: any[]; onClose: () => void }) => {
  const simpanMutation = useSimpanNilaiMahasiswa(kelasId);
  const [skorMap, setSkorMap] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    headerKolom.forEach((h: any) => {
      const v = row.nilaiPerKomponen?.[h.label];
      init[h.id] = v != null ? String(v) : "";
    });
    return init;
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleSimpan = () => {
    const nilai = headerKolom.map((h: any) => ({ komposisiId: h.id, skor: Number(skorMap[h.id]) || 0 }));
    const invalid = nilai.some((n) => n.skor < 0 || n.skor > 100);
    if (invalid) {
      setErrorMessage("Skor tiap komponen harus di antara 0 - 100.");
      return;
    }
    setErrorMessage("");
    simpanMutation.mutate(
      { rincianKrsId: row.rincianKrsId, nilai },
      {
        onSuccess: onClose,
        onError: (err: any) => setErrorMessage(err?.response?.data?.message || err?.message || "Gagal menyimpan nilai."),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h4 className="text-lg font-bold text-gray-800">Input Nilai</h4>
            <p className="text-xs text-gray-500">{row.nim} - {row.nama}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          {errorMessage && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{errorMessage}</div>}
          {headerKolom.map((h: any) => (
            <div key={h.id}>
              <label className="text-sm font-semibold text-gray-700 block mb-1">{h.labelKolom}</label>
              <input
                type="number"
                min={0}
                max={100}
                value={skorMap[h.id]}
                onChange={(e) => setSkorMap((prev) => ({ ...prev, [h.id]: e.target.value }))}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="0 - 100"
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-gray-400">Batalkan</button>
            <button onClick={handleSimpan} disabled={simpanMutation.isPending} className="bg-primary-green text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50">
              <Save size={16} /> {simpanMutation.isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

let unitUidCounter = 0;
const nextUnitUid = () => `unit-${Date.now()}-${unitUidCounter++}`;

interface CbtUnitRow {
  localId: string;
  cpmkIds: string[];
  skorDiperoleh: string;
  skorMaksimal: string;
}

const computeBobotPoinMap = (units: CbtUnitRow[], opsiCpmk: { cpmkId: string; bobotResmi: number }[]): Record<string, Record<string, number>> => {
  const resmiMap: Record<string, number> = {};
  opsiCpmk.forEach((c) => { resmiMap[c.cpmkId] = c.bobotResmi; });

  const groups: Record<string, string[]> = {};
  units.forEach((u) => {
    (u.cpmkIds || []).forEach((cpmkId) => {
      if (!groups[cpmkId]) groups[cpmkId] = [];
      groups[cpmkId].push(u.localId);
    });
  });

  const result: Record<string, Record<string, number>> = {};
  units.forEach((u) => { result[u.localId] = {}; });

  Object.entries(groups).forEach(([cpmkId, localIds]) => {
    const total = resmiMap[cpmkId] || 0;
    const count = localIds.length;
    const each = count > 0 ? parseFloat((total / count).toFixed(2)) : 0;
    localIds.forEach((id, idx) => {
      result[id][cpmkId] = idx === count - 1 ? parseFloat((total - each * (count - 1)).toFixed(2)) : each;
    });
  });
  return result;
};

const InputNilaiCbtModal = ({
  kelasId,
  mataKuliahId,
  periodeId,
  row,
  onClose,
}: {
  kelasId: string;
  mataKuliahId: string;
  periodeId: string;
  row: any;
  onClose: () => void;
}) => {
  const { data: komposisi, isLoading } = useKomposisiNilai(mataKuliahId, periodeId, !!mataKuliahId && !!periodeId);
  const simpanCbtMutation = useSimpanNilaiKomponenCbt(kelasId);
  const [rencanaEvaluasiId, setRencanaEvaluasiId] = useState("");
  const [units, setUnits] = useState<CbtUnitRow[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const KATA_KUNCI_NON_SOAL = ["kehadiran", "partisipasi", "presensi", "keaktifan", "absen"];
  const komponenSoal = (komposisi?.rencanaEvaluasi || []).filter((e: any) => {
    const teks = `${e.metodeEvaluasi || ""} ${e.jenisEvaluasi || ""}`.toLowerCase();
    return !KATA_KUNCI_NON_SOAL.some((kw) => teks.includes(kw));
  });

  const cpmkLabelMap: Record<string, string> = {};
  (komposisi?.masterCpmk || []).forEach((parent: any) => {
    cpmkLabelMap[parent.id] = parent.kode;
    (parent.subCpmk || []).forEach((s: any) => { cpmkLabelMap[s.id] = s.kode; });
  });

  const komponenTerpilih = komponenSoal.find((e: any) => e.id === rencanaEvaluasiId);
  const opsiCpmk = komponenTerpilih
    ? Object.entries(komponenTerpilih.mappingBobotCpmk || {}).map(([cpmkId, bobot]) => ({
        cpmkId,
        kode: cpmkLabelMap[cpmkId] || cpmkId,
        bobotResmi: bobot as number,
      }))
    : [];

  const bobotEvaluasi = komponenTerpilih?.bobotEvaluasi || 0;
  const bobotPoinMap = computeBobotPoinMap(units, opsiCpmk);
  const totalBobotPoin = Object.values(bobotPoinMap).reduce((sum, perCpmk) => sum + Object.values(perCpmk).reduce((s, v) => s + v, 0), 0);

  const handlePilihKomponen = (id: string) => {
    setRencanaEvaluasiId(id);
    setUnits([]);
    setErrorMessage("");
  };

  const handleTambahSoal = () => {
    if (opsiCpmk.length === 0) return;
    setUnits((prev) => [...prev, { localId: nextUnitUid(), cpmkIds: [opsiCpmk[0].cpmkId], skorDiperoleh: "", skorMaksimal: "100" }]);
  };

  const handleHapusSoal = (localId: string) => setUnits((prev) => prev.filter((u) => u.localId !== localId));
  const updateUnit = (localId: string, patch: Partial<CbtUnitRow>) => setUnits((prev) => prev.map((u) => (u.localId === localId ? { ...u, ...patch } : u)));

  const toggleUnitCpmk = (localId: string, cpmkId: string) => {
    setUnits((prev) =>
      prev.map((u) => {
        if (u.localId !== localId) return u;
        const sudahAda = u.cpmkIds.includes(cpmkId);
        const next = sudahAda ? u.cpmkIds.filter((id) => id !== cpmkId) : [...u.cpmkIds, cpmkId];
        return { ...u, cpmkIds: next };
      })
    );
  };

  const handleSimpan = () => {
    if (!rencanaEvaluasiId) {
      setErrorMessage("Pilih komponen evaluasi dulu.");
      return;
    }
    if (units.length === 0) {
      setErrorMessage("Tambahkan minimal 1 soal/unit penilaian dulu.");
      return;
    }
    const breakdown = units.map((u) => ({
      skorDiperoleh: Number(u.skorDiperoleh) || 0,
      skorMaksimal: Number(u.skorMaksimal) || 0,
      pemetaanCpmk: (u.cpmkIds || []).map((cpmkId) => ({ cpmkId, bobotPoin: bobotPoinMap[u.localId]?.[cpmkId] || 0 })),
    }));
    const adaSkorInvalid = breakdown.some((b) => b.skorMaksimal <= 0 || b.skorDiperoleh < 0 || b.skorDiperoleh > b.skorMaksimal);
    if (adaSkorInvalid) {
      setErrorMessage("Tiap soal: Skor Maksimal harus > 0, dan Skor Diperoleh harus 0 sampai Skor Maksimal.");
      return;
    }
    const adaCpmkKosong = breakdown.some((b) => b.pemetaanCpmk.length === 0);
    if (adaCpmkKosong) {
      setErrorMessage("Tiap soal wajib dipetakan ke minimal 1 Sub-CPMK/CPMK.");
      return;
    }
    const adaBobotInvalid = breakdown.some((b) => b.pemetaanCpmk.some((p) => p.bobotPoin <= 0));
    if (adaBobotInvalid) {
      setErrorMessage("Ada CPMK dengan bobot resmi 0 di rencana evaluasi, tidak bisa dikirim. Cek Komposisi Nilai mata kuliah ini.");
      return;
    }
    setErrorMessage("");
    simpanCbtMutation.mutate(
      { rencanaEvaluasiId, krsId: row.rincianKrsId, breakdown },
      {
        onSuccess: onClose,
        onError: (err: any) => setErrorMessage(err?.response?.data?.message || err?.message || "Gagal mengirim nilai CBT."),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <div>
            <h4 className="text-lg font-bold text-gray-800">Input Nilai CBT Manual</h4>
            <p className="text-xs text-gray-500">{row.nim} - {row.nama}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div className="p-3 bg-purple-50 border border-purple-200 text-purple-800 rounded text-xs">
            Dipakai sementara selagi integrasi CBT masih error buat ditest. Tambahkan sebanyak apapun soal/unit penilaian
            yang perlu -- Skor Diperoleh dan Skor Maksimal bebas ditentukan sendiri per soal. Bobot Poin otomatis diambil
            dari rencana evaluasi resmi CPMK terkait, dibagi rata kalau ada beberapa soal menunjuk ke CPMK yang sama.
          </div>
          {errorMessage && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{errorMessage}</div>}

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Komponen Evaluasi</label>
                <select value={rencanaEvaluasiId} onChange={(e) => handlePilihKomponen(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm">
                  <option value="">-- Pilih Komponen --</option>
                  {komponenSoal.map((e: any) => (
                    <option key={e.id} value={e.id}>{e.metodeEvaluasi} ({e.jenisEvaluasi}) - {e.bobotEvaluasi}%</option>
                  ))}
                </select>
                {komponenSoal.length === 0 && (
                  <p className="text-xs text-gray-400 italic mt-1">
                    Tidak ada komponen "soal" di rencana evaluasi mata kuliah ini (komponen Kehadiran/Partisipasi tidak dihitung lewat CBT, input manual lewat Jalur A).
                  </p>
                )}
              </div>

              {rencanaEvaluasiId && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-700">Daftar Soal/Unit Penilaian</p>
                    <span className={`text-xs font-semibold ${bobotEvaluasi > 0 && totalBobotPoin > bobotEvaluasi ? "text-red-600" : "text-gray-500"}`}>
                      Total Bobot Poin: {totalBobotPoin} / {bobotEvaluasi}
                    </span>
                  </div>

                  {opsiCpmk.length === 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-300 text-amber-800 rounded text-xs">
                      Komponen evaluasi ini belum punya bobot CPMK/Sub-CPMK di Rencana Evaluasi, jadi belum bisa ditambahkan soal/unit.
                      Isi dulu bobot CPMK-nya lewat menu Rencana Evaluasi mata kuliah ini.
                    </div>
                  )}

                  {units.map((u, idx) => (
                    <div key={u.localId} className="border border-gray-200 rounded-md p-2 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500">Soal #{idx + 1}</span>
                        <button onClick={() => handleHapusSoal(u.localId)} className="text-red-500 hover:text-red-700" title="Hapus soal ini">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-0.5" title="1 soal boleh dicentang lebih dari 1 Sub-CPMK/CPMK sekaligus">
                          Sub-CPMK/CPMK yang diuji soal ini
                        </label>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 border border-gray-300 rounded-md p-1.5 max-h-24 overflow-y-auto">
                          {opsiCpmk.map((c) => (
                            <label key={c.cpmkId} className="flex items-center gap-1 text-xs cursor-pointer">
                              <input type="checkbox" checked={u.cpmkIds.includes(c.cpmkId)} onChange={() => toggleUnitCpmk(u.localId, c.cpmkId)} className="w-3.5 h-3.5" />
                              {c.kode}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-gray-500 block mb-0.5">Skor Diperoleh</label>
                          <input type="number" min={0} step="0.01" value={u.skorDiperoleh} onChange={(e) => updateUnit(u.localId, { skorDiperoleh: e.target.value })} className="w-full border border-gray-300 rounded-md p-1.5 text-sm" placeholder="mis. 85" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-0.5">Skor Maksimal</label>
                          <input type="number" min={0.01} step="0.01" value={u.skorMaksimal} onChange={(e) => updateUnit(u.localId, { skorMaksimal: e.target.value })} className="w-full border border-gray-300 rounded-md p-1.5 text-sm" placeholder="mis. 100" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block mb-0.5" title="Otomatis dari bobot resmi tiap CPMK di rencana evaluasi">Bobot Poin (total)</label>
                          <div className="w-full border border-gray-200 bg-gray-50 rounded-md p-1.5 text-sm text-gray-700 font-medium">
                            {Object.values(bobotPoinMap[u.localId] || {}).reduce((s, v) => s + v, 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button onClick={handleTambahSoal} disabled={opsiCpmk.length === 0} className="w-full border border-dashed border-purple-300 text-purple-700 rounded-md py-2 text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-purple-50 disabled:opacity-50">
                    + Tambah Soal/Unit
                  </button>
                </div>
              )}
            </>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-gray-400">Batalkan</button>
            <button
              onClick={handleSimpan}
              disabled={simpanCbtMutation.isPending || !rencanaEvaluasiId || units.length === 0}
              className="bg-purple-600 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
            >
              <Cpu size={16} /> {simpanCbtMutation.isPending ? "Mengirim..." : `Kirim ${units.length || ""} Nilai Soal`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PanduanPenilaianModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h4 className="text-lg font-bold text-gray-800">Panduan Penilaian</h4>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      <div className="p-5 space-y-3 text-sm text-gray-700">
        <p>Nilai Akhir mahasiswa dihitung otomatis dari nilai per komponen evaluasi dikali bobotnya masing-masing.</p>
        <p>Huruf Mutu (Grade) ditentukan dari skala penilaian yang berlaku untuk jenjang dan tahun kurikulum program studi ini.</p>
        <p>Setelah nilai dikunci (Kunci Nilai), nilai mahasiswa di kelas ini tidak dapat diubah lagi kecuali dibuka kembali lewat tombol Buka Kunci Nilai.</p>
        <p>Mahasiswa dinyatakan Tidak Lulus mata kuliah jika Huruf Mutu akhirnya D atau E.</p>
      </div>
    </div>
  </div>
);

const CapaianPembelajaran = ({ data }: { data: any }) => {
  const [subTab, setSubTab] = useState<"cpmk" | "cpl">("cpmk");
  const { data: cpmkData, isLoading: isLoadingCpmk } = useCapaianCpmk(data.id, true);
  const { data: cplData, isLoading: isLoadingCpl } = useCapaianCpl(data.id, subTab === "cpl");
  const [isExporting, setIsExporting] = useState(false);

  const handleCetak = async () => {
    setIsExporting(true);
    try {
      const url = await fetchCapaianExportBlobUrl(data.id, subTab);
      window.open(url, "_blank");
    } catch (err: any) {
      alert(err?.message || "Gagal mengunduh PDF Capaian Pembelajaran.");
    } finally {
      setIsExporting(false);
    }
  };

  const isLoadingActive = subTab === "cpmk" ? isLoadingCpmk || !cpmkData : isLoadingCpl || !cplData;

  return (
    <div className="space-y-4 px-4 md:px-0">
      <ClassBio data={data} />

      {cpmkData?.pemetaanBerbeda && (
        <div className="p-3 rounded-md border bg-orange-50 border-orange-200 text-orange-800 flex gap-3 text-sm">
          <span className="font-bold">i</span>
          <p>Pemetaan capaian pada kelas ini berbeda dengan Mata Kuliah. Nilai CPMK yang sudah tersimpan masih memakai pemetaan lama.</p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1">
          <button onClick={() => setSubTab("cpmk")} className={`px-4 py-2 text-sm font-semibold rounded-t-md border border-b-0 ${subTab === "cpmk" ? "bg-primary-blueDark text-white border-primary-blueDark" : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"}`}>
            CPMK
          </button>
          <button onClick={() => setSubTab("cpl")} className={`px-4 py-2 text-sm font-semibold rounded-t-md border border-b-0 ${subTab === "cpl" ? "bg-primary-blueDark text-white border-primary-blueDark" : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"}`}>
            CPL
          </button>
        </div>
        <div className="flex gap-2">
          <button disabled title="Hitung ulang pemetaan capaian belum tersedia" className="bg-gray-300 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 cursor-not-allowed opacity-60">
            <History size={16} /> Hitung Ulang
          </button>
          <button onClick={handleCetak} disabled={isExporting} className="bg-primary-blueSoft text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50">
            <Printer size={16} /> {isExporting ? "Menyiapkan..." : "Cetak"}
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-b-sm rounded-tr-sm p-4">
        {isLoadingActive ? <LoadingSpinner /> : subTab === "cpmk" ? <CapaianCpmkTable data={cpmkData} /> : <CapaianCplTable data={cplData} />}
      </div>
    </div>
  );
};

const CapaianCpmkTable = ({ data }: { data: any }) => {
  const cols = data.cpmkInfo || [];
  if (cols.length === 0) {
    return <p className="text-center text-gray-400 italic py-8">{data.pesan || "CPMK belum disetup untuk mata kuliah ini."}</p>;
  }
  return (
    <div>
      <div className="bg-primary-green/10 p-4 mb-4">
        <p className="font-bold mb-2">CPMK Program Studi</p>
        <ul className="space-y-1 text-sm">
          {cols.map((c: any) => (
            <li key={c.id} className="flex gap-2">
              <span>&bull;</span>
              <span><span className="font-semibold">{c.kode}</span>&nbsp;&nbsp;{c.deskripsi}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="overflow-x-auto border border-gray-200 rounded-sm">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary-green text-white">
              <th className="p-2 border border-gray-400">No.</th>
              <th className="p-2 border border-gray-400">NIM</th>
              <th className="p-2 border border-gray-400 text-left">Nama Mahasiswa</th>
              <th className="p-2 border border-gray-400">Angkatan</th>
              {cols.map((c: any) => (
                <th key={c.id} className="p-2 border border-gray-400">{c.kode}</th>
              ))}
              <th className="p-2 border border-gray-400">Status Capaian</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-primary-green text-white font-semibold">
              <td className="p-2 border border-gray-400" colSpan={4}>Target CPMK</td>
              {cols.map((c: any) => (
                <td key={c.id} className="p-2 border border-gray-400 text-center">{(data.targetCpmk?.[c.kode] ?? 0).toFixed(2)}</td>
              ))}
              <td className="p-2 border border-gray-400"></td>
            </tr>
            {(data.tabel || []).length > 0 ? (
              data.tabel.map((row: any) => (
                <tr key={row.no} className="hover:bg-gray-50 text-center">
                  <td className="p-2 border border-gray-200">{row.no}</td>
                  <td className="p-2 border border-gray-200">{row.nim}</td>
                  <td className="p-2 border border-gray-200 text-left">{row.nama}</td>
                  <td className="p-2 border border-gray-200">{row.angkatan}</td>
                  {cols.map((c: any) => (
                    <td key={c.id} className="p-2 border border-gray-200">{row.nilaiCpmk?.[c.kode] != null ? row.nilaiCpmk[c.kode].toFixed(2) : "-"}</td>
                  ))}
                  <td className="p-2 border border-gray-200">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${row.statusCapaian === "Sudah Memenuhi" ? "bg-green-50 text-green-700 border-green-200" : row.statusCapaian === "Belum Memenuhi" ? "bg-red-50 text-red-700 border-red-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                      {row.statusCapaian}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5 + cols.length} className="p-6 text-center text-gray-400 italic">{data.pesan || "Belum ada peserta/nilai di kelas ini."}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CapaianCplTable = ({ data }: { data: any }) => {
  const cols = data.cplInfo || [];
  if (cols.length === 0) {
    return <p className="text-center text-gray-400 italic py-8">{data.pesan || "CPL belum dipetakan ke mata kuliah ini."}</p>;
  }
  return (
    <div>
      <div className="bg-primary-green/10 p-4 mb-4">
        <p className="font-bold mb-2">CPL Program Studi</p>
        <ul className="space-y-1 text-sm">
          {cols.map((c: any) => (
            <li key={c.id} className="flex gap-2">
              <span>&bull;</span>
              <span><span className="font-semibold">{c.kode}</span>&nbsp;&nbsp;{c.deskripsi}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="overflow-x-auto border border-gray-200 rounded-sm">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary-green text-white">
              <th className="p-2 border border-gray-400">No.</th>
              <th className="p-2 border border-gray-400">NIM</th>
              <th className="p-2 border border-gray-400 text-left">Nama Mahasiswa</th>
              <th className="p-2 border border-gray-400">Angkatan</th>
              {cols.map((c: any) => (
                <th key={c.id} className="p-2 border border-gray-400">{c.kode}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-primary-green text-white font-semibold">
              <td className="p-2 border border-gray-400" colSpan={4}>Target CPL</td>
              {cols.map((c: any) => (
                <td key={c.id} className="p-2 border border-gray-400 text-center">{(data.targetCpl?.[c.kode] ?? 0).toFixed(2)}</td>
              ))}
            </tr>
            {(data.tabel || []).length > 0 ? (
              data.tabel.map((row: any) => (
                <tr key={row.no} className="hover:bg-gray-50 text-center">
                  <td className="p-2 border border-gray-200">{row.no}</td>
                  <td className="p-2 border border-gray-200">{row.nim}</td>
                  <td className="p-2 border border-gray-200 text-left">{row.nama}</td>
                  <td className="p-2 border border-gray-200">{row.angkatan}</td>
                  {cols.map((c: any) => (
                    <td key={c.id} className="p-2 border border-gray-200">{row.nilaiCpl?.[c.kode] != null ? row.nilaiCpl[c.kode].toFixed(2) : "-"}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4 + cols.length} className="p-6 text-center text-gray-400 italic">{data.pesan || "Belum ada peserta/nilai di kelas ini."}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ExamSchedule = ({ data }: { data: any }) => {
  const { data: exams } = getStudentExams(data.id);

  return (
    <div className="space-y-4 px-4 md:px-0">
      <ClassBio data={data} />
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm md:text-base border-collapse">
          <thead>
            <tr className="bg-primary-green text-white">
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">No</th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">Jenis Ujian</th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">Tanggal</th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">Waktu</th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">Ruang</th>
              <th className="py-2 px-4 border border-gray-300 font-semibold whitespace-nowrap">Pengawas Ujian</th>
            </tr>
          </thead>
          <tbody>
            {(exams || []).length > 0 ? (
              exams.map((exam: any, index: number) => (
                <tr key={exam.id} className="hover:bg-gray-50 text-center">
                  <td className="py-2 px-4 border border-gray-300 font-medium">{index + 1}</td>
                  <td className="py-2 px-4 border border-gray-300">{exam.jenisUjian}</td>
                  <td className="py-2 px-4 border border-gray-300">{DateFormatter(exam.tanggal)}</td>
                  <td className="py-2 px-4 border border-gray-300">{exam.jamMulai}</td>
                  <td className="py-2 px-4 border border-gray-300">{exam.siakRuangan?.namaRuangan}</td>
                  <td className="py-2 px-4 border border-gray-300">{exam.siakDosen?.nama}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">Belum ada jadwal ujian.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailClassLecturer;