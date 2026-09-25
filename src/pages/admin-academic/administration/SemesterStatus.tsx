import { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { InputFilter } from "../../../components/admin-academic/student-data/Input";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import { Play, Printer, RefreshCw } from "lucide-react";
import {
  IStatusSemesterStat,
  IStatusSemesterSummaryRow,
} from "../../../types/administrasi.types";

const dummyStats: IStatusSemesterStat[] = [
  {
    label: "Mahasiswa Aktif",
    value: 211,
    percentage: "236.02%",
    description: "Terdapat kenaikan jumlah mahasiswa aktif pada periode ini",
  },
  {
    label: "Mahasiswa Non Aktif",
    value: 8564,
    percentage: "4.4%",
    description: "Terdapat penurunan jumlah mahasiswa non aktif pada periode ini",
  },
  {
    label: "Mahasiswa Skripsi",
    value: 15,
    percentage: "100.00%",
    description: "Terdapat kenaikan jumlah mahasiswa skripsi pada periode ini",
  },
  {
    label: "Mahasiswa Lulus",
    value: 19,
    percentage: "375.00%",
    description: "Terdapat kenaikan jumlah mahasiswa lulus pada periode ini",
  },
];

const dummySummary: IStatusSemesterSummaryRow[] = [
  {
    id: "univ",
    namaUnit: "Universitas Ibn Khaldun",
    level: 0,
    statusSemester: { aktif: 29, nonAktif: 8564, cuti: 6, doubleDegree: 2, kampusMerdeka: 3, ukom: 1 },
    statusKrs: { belumDiajukan: 12, belumDisetujui: 5, sedangDiajukan: 3, dropOut: 2 },
    statusKelulusan: { keluar: 4, lulus: 19 },
    akmTidakSesuai: { aktif: 2, lainnya: 21 },
    melebihiBatasStudi: { adaAkm: 5028, tidakAdaAkm: 180 },
  },
  {
    id: "fe",
    namaUnit: "Fakultas Ekonomi & Bisnis",
    level: 1,
    statusSemester: { aktif: 15, nonAktif: 4210, cuti: 3, doubleDegree: 1, kampusMerdeka: 2, ukom: 0 },
    statusKrs: { belumDiajukan: 6, belumDisetujui: 2, sedangDiajukan: 2, dropOut: 1 },
    statusKelulusan: { keluar: 2, lulus: 10 },
    akmTidakSesuai: { aktif: 1, lainnya: 9 },
    melebihiBatasStudi: { adaAkm: 2400, tidakAdaAkm: 90 },
  },
  {
    id: "manajemen",
    namaUnit: "S1 - Manajemen",
    level: 2,
    statusSemester: { aktif: 9, nonAktif: 2100, cuti: 2, doubleDegree: 1, kampusMerdeka: 1, ukom: 0 },
    statusKrs: { belumDiajukan: 4, belumDisetujui: 1, sedangDiajukan: 1, dropOut: 1 },
    statusKelulusan: { keluar: 1, lulus: 6 },
    akmTidakSesuai: { aktif: 1, lainnya: 5 },
    melebihiBatasStudi: { adaAkm: 1300, tidakAdaAkm: 45 },
  },
  {
    id: "akuntansi",
    namaUnit: "S1 - Akuntansi",
    level: 2,
    statusSemester: { aktif: 6, nonAktif: 2110, cuti: 1, doubleDegree: 0, kampusMerdeka: 1, ukom: 0 },
    statusKrs: { belumDiajukan: 2, belumDisetujui: 1, sedangDiajukan: 1, dropOut: 0 },
    statusKelulusan: { keluar: 1, lulus: 4 },
    akmTidakSesuai: { aktif: 0, lainnya: 4 },
    melebihiBatasStudi: { adaAkm: 1100, tidakAdaAkm: 45 },
  },
  {
    id: "ft",
    namaUnit: "Fakultas Teknik",
    level: 1,
    statusSemester: { aktif: 14, nonAktif: 4354, cuti: 3, doubleDegree: 1, kampusMerdeka: 1, ukom: 1 },
    statusKrs: { belumDiajukan: 6, belumDisetujui: 3, sedangDiajukan: 1, dropOut: 1 },
    statusKelulusan: { keluar: 2, lulus: 9 },
    akmTidakSesuai: { aktif: 1, lainnya: 12 },
    melebihiBatasStudi: { adaAkm: 2628, tidakAdaAkm: 90 },
  },
  {
    id: "si",
    namaUnit: "S1 - Sistem Informasi",
    level: 2,
    statusSemester: { aktif: 8, nonAktif: 2154, cuti: 2, doubleDegree: 1, kampusMerdeka: 1, ukom: 1 },
    statusKrs: { belumDiajukan: 3, belumDisetujui: 2, sedangDiajukan: 1, dropOut: 1 },
    statusKelulusan: { keluar: 1, lulus: 5 },
    akmTidakSesuai: { aktif: 1, lainnya: 7 },
    melebihiBatasStudi: { adaAkm: 1428, tidakAdaAkm: 50 },
  },
  {
    id: "ti",
    namaUnit: "S1 - Teknik Informatika",
    level: 2,
    statusSemester: { aktif: 6, nonAktif: 2200, cuti: 1, doubleDegree: 0, kampusMerdeka: 0, ukom: 0 },
    statusKrs: { belumDiajukan: 3, belumDisetujui: 1, sedangDiajukan: 0, dropOut: 0 },
    statusKelulusan: { keluar: 1, lulus: 4 },
    akmTidakSesuai: { aktif: 0, lainnya: 5 },
    melebihiBatasStudi: { adaAkm: 1200, tidakAdaAkm: 40 },
  },
];

const levelStyle: Record<number, string> = {
  0: "font-bold bg-gray-50",
  1: "font-semibold pl-4",
  2: "pl-8",
};

const groupTh = "bg-primary-green text-white border border-gray-300 font-semibold p-2 text-center";
const subTh = "bg-primary-green/90 text-white border border-gray-300 font-semibold p-2 text-center text-xs";
const td = "border border-gray-300 p-2 text-center text-sm";

export default function SemesterStatus() {
  const [filters, setFilters] = useState({
    periodeAkademik: "2025 Ganjil",
    periodeMasuk: "",
    unitProgramStudi: "",
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isConfirmChecked, setIsConfirmChecked] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const periodeAkademik = [
    { value: "2025 Ganjil", label: "2025 Ganjil" },
    { value: "2024 Genap", label: "2024 Genap" },
    { value: "2024 Ganjil", label: "2024 Ganjil" },
  ];

  const periodeMasuk = [
    { value: "", label: "-- Semua Periode Masuk --" },
    { value: "2024 Ganjil", label: "2024 Ganjil" },
    { value: "2023 Ganjil", label: "2023 Ganjil" },
  ];

  const unitProgramStudi = [
    { value: "", label: "Universitas Ibn Khaldun" },
    { value: "Fakultas Ekonomi & Bisnis", label: "Fakultas Ekonomi & Bisnis" },
    { value: "Fakultas Teknik", label: "Fakultas Teknik" },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  function ResetFilter() {
    setFilters({
      periodeAkademik: "2025 Ganjil",
      periodeMasuk: "",
      unitProgramStudi: "",
    });
    setResultMessage(null);
  }

  function Cetak() {
    alert("Cetak rekap status semester (dummy)");
  }

  function bukaKonfirmasi() {
    setIsConfirmChecked(false);
    setShowConfirmModal(true);
  }

  function batalkanGenerate() {
    setShowConfirmModal(false);
  }

  function jalankanGenerate() {
    setShowConfirmModal(false);
    setIsGenerating(true);
    setResultMessage(null);

    // Simulasi proses generate (dummy) - nanti diganti pemanggilan API sungguhan
    setTimeout(() => {
      setIsGenerating(false);
      setResultMessage(
        `Pembuatan status semester mahasiswa untuk periode ${filters.periodeAkademik} berhasil dengan detail: 7 mahasiswa dikecualikan karena melebihi batas studi.`
      );
    }, 1500);
  }

  function lihatDetail(unit: string, kolom: string, jumlah: number) {
    alert(`Detail "${kolom}" pada ${unit}: ${jumlah} mahasiswa (dummy, arahkan ke Pembimbing Akademik)`);
  }

  return (
    <MainLayout titlePage="Status Semester" subTitle="Rekapitulasi & Pelaporan" isGreeting={false}>
      {/* Filter Card */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 border-t-4 border-t-primary-yellow p-4 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <InputFilter
            options={periodeAkademik}
            label="Periode Akademik"
            value={filters.periodeAkademik}
            onChange={(value) => handleFilterChange("periodeAkademik", value)}
          />
          <InputFilter
            options={periodeMasuk}
            label="Periode Masuk"
            value={filters.periodeMasuk}
            onChange={(value) => handleFilterChange("periodeMasuk", value)}
          />
          <InputFilter
            options={unitProgramStudi}
            label="Unit / Program Studi"
            value={filters.unitProgramStudi}
            onChange={(value) => handleFilterChange("unitProgramStudi", value)}
          />
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 border-t-4 border-t-primary-green p-4">
        {resultMessage && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-lg p-3 mb-4 font-medium">
            {resultMessage}
          </div>
        )}

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
          {dummyStats.map((stat) => (
            <div
              key={stat.label}
              className="border border-slate-200/80 rounded-xl p-3.5 bg-slate-50/60 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-600">
                  {stat.label}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-2xl font-bold text-slate-800">
                  {stat.value.toLocaleString("id-ID")}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {stat.percentage}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{stat.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-end gap-2 mb-4">
          <button
            type="button"
            onClick={bukaKonfirmasi}
            className="bg-primary-yellow hover:bg-[#e89012] text-white px-3.5 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <Play size={14} strokeWidth={2.5} />
            <span>Generate Status Semester</span>
          </button>
          <button
            type="button"
            onClick={() => alert("Hitung ulang rekap status semester (dummy)")}
            className="bg-primary-blueDark hover:bg-[#2e42a8] text-white px-3.5 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <RefreshCw size={14} strokeWidth={2.5} />
            <span>Hitung Ulang</span>
          </button>
          <button
            type="button"
            onClick={Cetak}
            className="bg-primary-green hover:bg-[#0d5950] text-white px-3.5 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <Printer size={14} strokeWidth={2.5} />
            <span>Cetak</span>
          </button>
        </div>

        <p className="text-xs text-gray-400 mb-2">
          Untuk melihat detail, silakan klik angka pada tabel.
        </p>

        <div className="overflow-x-auto">
          <table className="border-collapse w-full min-w-[1100px]">
            <thead>
              <tr>
                <th rowSpan={2} className={`${groupTh} text-left`}>
                  Program Studi
                </th>
                <th colSpan={6} className={groupTh}>
                  Status Semester
                </th>
                <th colSpan={4} className={groupTh}>
                  Status KRS
                </th>
                <th colSpan={2} className={groupTh}>
                  Status Kelulusan
                </th>
                <th colSpan={2} className={groupTh}>
                  Data AKM Tidak Sesuai
                </th>
                <th colSpan={2} className={groupTh}>
                  Melebihi Batas Studi
                </th>
              </tr>
              <tr>
                <th className={subTh}>Aktif</th>
                <th className={subTh}>Non Aktif</th>
                <th className={subTh}>Cuti</th>
                <th className={subTh}>Double Degree</th>
                <th className={subTh}>Kampus Merdeka</th>
                <th className={subTh}>UKOM</th>
                <th className={subTh}>Belum Diajukan</th>
                <th className={subTh}>Belum Disetujui</th>
                <th className={subTh}>Sedang Diajukan</th>
                <th className={subTh}>Drop Out</th>
                <th className={subTh}>Keluar</th>
                <th className={subTh}>Lulus</th>
                <th className={subTh}>Aktif</th>
                <th className={subTh}>Lainnya</th>
                <th className={subTh}>Ada AKM</th>
                <th className={subTh}>Tidak Ada AKM</th>
              </tr>
            </thead>
            <tbody>
              {dummySummary.map((row) => (
                <tr key={row.id} className="hover:bg-gray-100">
                  <td className={`border border-gray-300 p-2 text-sm ${levelStyle[row.level]}`}>
                    {row.namaUnit}
                  </td>
                  <td className={td}>{row.statusSemester.aktif}</td>
                  <td className={td}>{row.statusSemester.nonAktif.toLocaleString("id-ID")}</td>
                  <td className={td}>{row.statusSemester.cuti}</td>
                  <td className={td}>{row.statusSemester.doubleDegree}</td>
                  <td className={td}>{row.statusSemester.kampusMerdeka}</td>
                  <td className={td}>{row.statusSemester.ukom}</td>
                  <td className={td}>{row.statusKrs.belumDiajukan}</td>
                  <td className={td}>{row.statusKrs.belumDisetujui}</td>
                  <td className={td}>{row.statusKrs.sedangDiajukan}</td>
                  <td className={td}>{row.statusKrs.dropOut}</td>
                  <td className={td}>{row.statusKelulusan.keluar}</td>
                  <td className={td}>{row.statusKelulusan.lulus}</td>
                  <td className={`${td} text-blue-700 font-semibold cursor-pointer hover:underline`}
                    onClick={() => lihatDetail(row.namaUnit, "AKM Tidak Sesuai - Aktif", row.akmTidakSesuai.aktif)}
                  >
                    {row.akmTidakSesuai.aktif}
                  </td>
                  <td className={`${td} text-blue-700 font-semibold cursor-pointer hover:underline`}
                    onClick={() => lihatDetail(row.namaUnit, "AKM Tidak Sesuai - Lainnya", row.akmTidakSesuai.lainnya)}
                  >
                    {row.akmTidakSesuai.lainnya}
                  </td>
                  <td className={`${td} text-red-600 font-semibold cursor-pointer hover:underline`}
                    onClick={() => lihatDetail(row.namaUnit, "Melebihi Batas Studi - Ada AKM", row.melebihiBatasStudi.adaAkm)}
                  >
                    {row.melebihiBatasStudi.adaAkm.toLocaleString("id-ID")}
                  </td>
                  <td className={`${td} text-red-600 font-semibold cursor-pointer hover:underline`}
                    onClick={() => lihatDetail(row.namaUnit, "Melebihi Batas Studi - Tidak Ada AKM", row.melebihiBatasStudi.tidakAdaAkm)}
                  >
                    {row.melebihiBatasStudi.tidakAdaAkm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal konfirmasi generate status semester */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <span className="text-yellow-500">&#9888;</span>
              Konfirmasi Generate Status Semester
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              Anda akan melakukan generate status mahasiswa untuk{" "}
              <b>Periode Akademik {filters.periodeAkademik}</b>.
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Proses ini akan <b>memengaruhi masa studi mahasiswa</b> dan
              menghasilkan status semester berdasarkan ketentuan berikut:
            </p>
            <ul className="text-sm text-gray-600 list-disc pl-5 mb-4 space-y-1">
              <li>
                <b>Prodi Aktif:</b> Mahasiswa yang masuk pada atau sebelum
                periode akademik terpilih. Jika prodi memiliki periode
                berdiri, maka generate hanya berlaku untuk periode akademik
                yang sama atau setelah periode tersebut.
              </li>
              <li>
                <b>Prodi Nonaktif:</b> Mahasiswa yang masuk pada atau sebelum
                periode akhir prodi.
              </li>
            </ul>
            <label className="flex items-center gap-2 text-sm mb-4">
              <input
                type="checkbox"
                checked={isConfirmChecked}
                onChange={(e) => setIsConfirmChecked(e.target.checked)}
                className="w-4 h-4"
              />
              Saya yakin ingin melanjutkan proses generate status semester
              untuk periode {filters.periodeAkademik}.
            </label>
            <div className="flex justify-end gap-2">
              <button
                onClick={batalkanGenerate}
                className="px-4 py-1.5 rounded border text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={jalankanGenerate}
                disabled={!isConfirmChecked}
                className="px-4 py-1.5 rounded bg-blue-900 text-white text-sm font-semibold disabled:opacity-40"
              >
                Ya, Saya Yakin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal progress generate (dummy) */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
            <p className="font-semibold mb-3">
              Generate status semester sedang berlangsung...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div className="bg-blue-600 h-2.5 rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        </div>
      )}

      <div className="py-10"></div>
    </MainLayout>
  );
}
