import MainLayout from "../../../components/layouts/MainLayout";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { ChevronLeft, Eye, Pencil, Printer, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactNode, useState } from "react";
import { TabNavigationButton, TabNavigationButtonStudent } from "../../../components/admin-academic/dashboard/TabNavigasiButton";
import { AdminAcademicRoute } from "../../../types/VarRoutes";

// Data dummy tambahan untuk field yang belum ada di baris tabel daftar dosen
const DUMMY_DETAIL = {
  nidk: "-",
  nupn: "-",
  nbm: "-",
  gelarDepan: "Dr.",
  gelarBelakang: "M.Kom.",
  tempatLahir: "BOGOR",
  tanggalLahir: "11 Mei 1989",
  agama: "Islam",
  noTelepon: "0251 8315935",
  noHpUtama: "0821-0176-196",
  kepemilikanNoHp: "Pribadi",
  emailKampus: "-",
  emailPribadi: "fitrah.satry@gmail.com",
  alamatRumah: "Cimanggu Permai 1, Jl. Borobudur Blok M2 No.16",
  jabatanFungsional: "Lektor",
  jabatanStruktural: "-",
  // Belum ada kolomnya di tabel pegawai SIMPEG saat ini, tampilkan strip dulu
  kuotaPembimbingAkademik: "-",
  kuotaPembimbingTugasAkhir: "-",
  pendidikanTerakhir: "S2 - Strata 2",
  universitasAsal: "-",
  programStudiAsal: "-",
  bidangIlmu: "-",
};

const DUMMY_JADWAL_MENGAJAR = [
  {
    kode: "TIF394",
    mataKuliah: "Proyek Perangkat Lunak Bidang Keilmuan",
    sks: "6,00",
    smt: 6,
    kelas: "Reg_B",
    programStudi: "Teknik Informatika",
    hari: "Senin",
    waktu: "13:00 - 15:30",
    ruang: "LABSE01",
  },
  {
    kode: "PBD356",
    mataKuliah: "Blockchain Technology",
    sks: "3,00",
    smt: 6,
    kelas: "REG_A",
    programStudi: "Bisnis Digital",
    hari: "Selasa",
    waktu: "10:30 - 12:30",
    ruang: "R. 401",
  },
  {
    kode: "PBD356",
    mataKuliah: "Blockchain Technology",
    sks: "3,00",
    smt: 6,
    kelas: "REG_B",
    programStudi: "Bisnis Digital",
    hari: "Selasa",
    waktu: "13:00 - 15:00",
    ruang: "R. 403",
  },
  {
    kode: "TIF394",
    mataKuliah: "Proyek Perangkat Lunak Bidang Keilmuan",
    sks: "6,00",
    smt: 6,
    kelas: "KARY",
    programStudi: "Teknik Informatika",
    hari: "Jumat",
    waktu: "18:30 - 21:00",
    ruang: "LABSE01",
  },
];

function InfoField({ label, value, note }: { label: string; value?: ReactNode; note?: string }) {
  return (
    <div className="grid grid-cols-2 border-b border-gray-200 py-2 px-3">
      <div>
        <span className="text-blue-700 font-semibold text-sm">{label}</span>
        {note && <div className="text-xs text-gray-400">{note}</div>}
      </div>
      <span className="text-sm text-gray-800">{value || "-"}</span>
    </div>
  );
}

function getInitials(nama: string) {
  const words = nama.replace(/^(Dr\.|Prof\.)\s*/i, "").split(" ").filter(Boolean);
  return ((words[0]?.[0] || "") + (words[1]?.[0] || "")).toUpperCase();
}

export default function DetailLecturer() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [sideTab, setSideTab] = useState<"detail" | "jadwal">("detail");
  const [infoTab, setInfoTab] = useState<"kontak" | "kepegawaian" | "pembimbing" | "lain">("kontak");
  const [periode, setPeriode] = useState("2025 Genap");

  const lecturer = {
    nip: state?.nip || "197801012005011001",
    nama: state?.nama || "Dr. Ahmad Fauzi, M.Kom.",
    nidn: state?.nidn || "0312078501",
    nuptk: state?.nuptk || "3033758659200013",
    jenisKelamin: state?.jenisKelamin?.toUpperCase().startsWith("P")
      ? "Perempuan"
      : "Laki-Laki",
    gelarDepan: state?.gelarDepan || DUMMY_DETAIL.gelarDepan,
    gelarBelakang: state?.gelarBelakang || DUMMY_DETAIL.gelarBelakang,
    jabatanFungsional: state?.jabatanFungsional || DUMMY_DETAIL.jabatanFungsional,
    homeBase: state?.homeBase || "Teknik Informatika",
    jenisPegawai: state?.jenisPegawai || "Dosen Tetap",
    status: state?.statusAktif || "Aktif",
    email: state?.emailPegawai || DUMMY_DETAIL.emailPribadi,
    noTelp: state?.noTelp || "-",
  };

  function Back() {
    navigate(AdminAcademicRoute.portal.dosen);
  }

  function Edit() {
    alert("Fitur edit belum tersedia");
  }

  function CetakBiodata() {
    alert("Fitur cetak biodata belum tersedia");
  }

  function LihatJadwal(kode: string) {
    alert(`Lihat jadwal: ${kode}`);
  }

  return (
    <MainLayout titlePage="Dosen" isGreeting={false}>
      {/* toolbar atas */}
      <div className="border-t-2 border-primary-green rounded-t-sm py-3 px-3 bg-white flex flex-col sm:flex-row sm:justify-between gap-2">
        <div className="flex items-center">
          <input
            type="text"
            className="border-2 p-1 rounded text-xs w-50"
            placeholder="Cari Data Pegawai"
          />
          <ButtonClick
            icon={<Search size={16} strokeWidth={3} />}
            color="bg-primary-yellow"
            onClick={() => {}}
          />
        </div>
        <div className="flex space-x-3">
          <ButtonClick
            icon={<ChevronLeft size={16} strokeWidth={3} />}
            text="Kembali ke Daftar"
            color="bg-primary-blueSoft"
            onClick={Back}
            spacing="2"
          />
          <ButtonClick
            icon={<Pencil size={15} strokeWidth={3} />}
            text="Edit"
            color="bg-primary-yellow"
            onClick={Edit}
            spacing="2"
          />
          <ButtonClick
            icon={<Printer size={15} strokeWidth={3} />}
            text="Cetak Biodata"
            color="bg-primary-blueSoft"
            onClick={CetakBiodata}
            spacing="2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 lg:gap-3 bg-white pb-4">
        {/* panel kiri: foto + menu */}
        <div className="rounded overflow-hidden mb-5">
          <div className="relative text-7xl font-bold text-white bg-[#3f4a2e] flex justify-center items-center h-40">
            {getInitials(lecturer.nama)}
            <span className="absolute top-2 right-2 bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded">
              Ganti Foto
            </span>
          </div>
          <TabNavigationButtonStudent
            isActive={sideTab === "detail"}
            onClick={() => setSideTab("detail")}
          >
            Detail Pegawai
          </TabNavigationButtonStudent>
          <TabNavigationButtonStudent
            isActive={sideTab === "jadwal"}
            onClick={() => setSideTab("jadwal")}
          >
            Jadwal Mengajar
          </TabNavigationButtonStudent>
        </div>

        {/* panel kanan */}
        <div className="lg:col-span-6">
          {sideTab === "detail" ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 border border-gray-200 rounded-sm overflow-hidden mb-4">
                <div>
                  <InfoField label="NIP" value={lecturer.nip} />
                  <InfoField label="NIDN" value={lecturer.nidn} />
                  <InfoField label="NUPTK" value={lecturer.nuptk} />
                  <InfoField label="NIDK" value={DUMMY_DETAIL.nidk} />
                  <InfoField label="NUPN" value={DUMMY_DETAIL.nupn} />
                  <InfoField label="NBM" value={DUMMY_DETAIL.nbm} />
                  <InfoField label="Nama Pegawai" value={lecturer.nama} />
                </div>
                <div>
                  <InfoField label="Gelar Depan" value={lecturer.gelarDepan} />
                  <InfoField label="Gelar Belakang" value={lecturer.gelarBelakang} />
                  <InfoField label="Jenis Kelamin" value={lecturer.jenisKelamin} />
                  <InfoField label="Tempat Lahir" value={DUMMY_DETAIL.tempatLahir} />
                  <InfoField label="Tanggal Lahir" value={DUMMY_DETAIL.tanggalLahir} />
                  <InfoField label="Agama" value={DUMMY_DETAIL.agama} />
                </div>
              </div>

              {/* sub tab */}
              <div className="flex">
                <TabNavigationButton
                  isActive={infoTab === "kontak"}
                  onClick={() => setInfoTab("kontak")}
                  colorTab="bg-blue-900"
                  padding="py-2"
                >
                  Kontak
                </TabNavigationButton>
                <TabNavigationButton
                  isActive={infoTab === "kepegawaian"}
                  onClick={() => setInfoTab("kepegawaian")}
                  colorTab="bg-blue-900"
                  padding="py-2"
                >
                  Kepegawaian
                </TabNavigationButton>
                <TabNavigationButton
                  isActive={infoTab === "pembimbing"}
                  onClick={() => setInfoTab("pembimbing")}
                  colorTab="bg-blue-900"
                  padding="py-2"
                >
                  Pembimbing
                </TabNavigationButton>
                <TabNavigationButton
                  isActive={infoTab === "lain"}
                  onClick={() => setInfoTab("lain")}
                  colorTab="bg-blue-900"
                  padding="py-2"
                >
                  Lain-lain
                </TabNavigationButton>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 border border-gray-200 border-t-0 rounded-b-sm overflow-hidden">
                {infoTab === "kontak" && (
                  <>
                    <div>
                      <InfoField label="No. Telepon" value={DUMMY_DETAIL.noTelepon} />
                      <InfoField label="No. HP Utama" value={DUMMY_DETAIL.noHpUtama} />
                      <InfoField label="Kepemilikan No HP Utama" value={DUMMY_DETAIL.kepemilikanNoHp} />
                    </div>
                    <div>
                      <InfoField label="Email Kampus" value={lecturer.email} />
                      <InfoField label="Email Pribadi" value={DUMMY_DETAIL.emailPribadi} />
                      <InfoField label="Alamat Rumah" value={DUMMY_DETAIL.alamatRumah} />
                    </div>
                  </>
                )}
                {infoTab === "kepegawaian" && (
                  <>
                    <div>
                      <InfoField label="Home Base" value={lecturer.homeBase} />
                      <InfoField label="Status Aktif" value={lecturer.status} />
                      <InfoField label="Jenis Pegawai" value={lecturer.jenisPegawai} />
                    </div>
                    <div>
                      <InfoField label="Jabatan Fungsional" value={lecturer.jabatanFungsional} />
                      <InfoField label="Jabatan Struktural" value={DUMMY_DETAIL.jabatanStruktural} />
                    </div>
                  </>
                )}
                {infoTab === "pembimbing" && (
                  <>
                    <div>
                      <InfoField label="Kuota Pembimbing Akademik" value={DUMMY_DETAIL.kuotaPembimbingAkademik} />
                    </div>
                    <div>
                      <InfoField
                        label="Kuota Pembimbing"
                        note="Untuk Proposal dan Tugas Akhir"
                        value={DUMMY_DETAIL.kuotaPembimbingTugasAkhir}
                      />
                    </div>
                  </>
                )}
                {infoTab === "lain" && (
                  <>
                    <div>
                      <InfoField label="Pendidikan Terakhir" value={DUMMY_DETAIL.pendidikanTerakhir} />
                      <InfoField label="Universitas Asal" value={DUMMY_DETAIL.universitasAsal} />
                    </div>
                    <div>
                      <InfoField label="Program Studi Asal" value={DUMMY_DETAIL.programStudiAsal} />
                      <InfoField label="Bidang Ilmu" value={DUMMY_DETAIL.bidangIlmu} />
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 bg-blue-50 border border-blue-100 rounded-sm p-3 mb-4 text-sm">
                <div>
                  <span className="text-blue-700 font-semibold">NIP</span>
                  <div>{lecturer.nip}</div>
                </div>
                <div>
                  <span className="text-blue-700 font-semibold">Jenis Pegawai</span>
                  <div>{lecturer.jenisPegawai}</div>
                </div>
                <div>
                  <span className="text-blue-700 font-semibold">Nama Pegawai</span>
                  <div>{lecturer.nama}</div>
                </div>
                <div>
                  <span className="text-blue-700 font-semibold">Email</span>
                  <div>{lecturer.email}</div>
                </div>
              </div>

              <div className="mb-3">
                <label className="text-blue-700 font-semibold text-sm block mb-1">
                  Periode Akademik
                </label>
                <select
                  className="border border-gray-300 rounded p-1 text-sm w-60"
                  value={periode}
                  onChange={(e) => setPeriode(e.target.value)}
                >
                  <option>2025 Genap</option>
                  <option>2025 Ganjil</option>
                  <option>2024 Genap</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-blue-900 text-white">
                      <th className="p-2 border border-gray-300 font-semibold">No</th>
                      <th className="p-2 border border-gray-300 font-semibold">Kode</th>
                      <th className="p-2 border border-gray-300 font-semibold">Mata Kuliah</th>
                      <th className="p-2 border border-gray-300 font-semibold">SKS</th>
                      <th className="p-2 border border-gray-300 font-semibold">Smt</th>
                      <th className="p-2 border border-gray-300 font-semibold">Kelas</th>
                      <th className="p-2 border border-gray-300 font-semibold">Program Studi</th>
                      <th className="p-2 border border-gray-300 font-semibold">Hari</th>
                      <th className="p-2 border border-gray-300 font-semibold">Waktu</th>
                      <th className="p-2 border border-gray-300 font-semibold">Ruang</th>
                      <th className="p-2 border border-gray-300 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DUMMY_JADWAL_MENGAJAR.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 text-center">
                        <td className="p-2 border border-gray-300">{index + 1}</td>
                        <td className="p-2 border border-gray-300 text-blue-700 font-semibold">
                          {item.kode}
                        </td>
                        <td className="p-2 border border-gray-300 text-left font-semibold">
                          {item.mataKuliah}
                        </td>
                        <td className="p-2 border border-gray-300">{item.sks}</td>
                        <td className="p-2 border border-gray-300">{item.smt}</td>
                        <td className="p-2 border border-gray-300">{item.kelas}</td>
                        <td className="p-2 border border-gray-300">{item.programStudi}</td>
                        <td className="p-2 border border-gray-300">{item.hari}</td>
                        <td className="p-2 border border-gray-300">{item.waktu}</td>
                        <td className="p-2 border border-gray-300">{item.ruang}</td>
                        <td className="p-2 border border-gray-300">
                          <div className="flex justify-center">
                            <ButtonClick
                              icon={<Eye size={15} />}
                              color="bg-primary-blueSoft"
                              onClick={() => LihatJadwal(item.kode)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="py-5"></div>
    </MainLayout>
  );
}
