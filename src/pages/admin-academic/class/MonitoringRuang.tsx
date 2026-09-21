import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Search } from "lucide-react";
import MainLayout from "../../../components/layouts/MainLayout";
import ButtonClick from "../../../components/admin-academic/student-data/ButtonClick";
import RoomScheduleGrid from "../../../components/admin-academic/monitoring/RoomScheduleGrid";
import SearchableSelect from "../../../components/admin-academic/monitoring/SearchableSelect";
import { useMonitoringRuangan } from "../../../hooks/admin-akademik/useMonitoringRuangan";
import { useFakultasOptions } from "../../../hooks/admin-akademik/useFakultasOptions";
import { useProgramStudiOptions } from "../../../hooks/admin-akademik/useProgramStudiOptions";
import { IOption } from "../../../types/models";

const STATUS_RUANG_OPTIONS: IOption[] = [
  { value: "", label: "Semua" },
  { value: "kosong", label: "Kosong" },
  { value: "terpakai", label: "Terpakai" },
];

// Bekerja langsung dengan string "YYYY-MM-DD" (bukan objek Date) supaya tidak
// tergeser sehari akibat parsing timezone di browser pengguna.
function todayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDaysToDateString(dateStr: string, delta: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d));
  utc.setUTCDate(utc.getUTCDate() + delta);
  const ny = utc.getUTCFullYear();
  const nm = String(utc.getUTCMonth() + 1).padStart(2, "0");
  const nd = String(utc.getUTCDate()).padStart(2, "0");
  return `${ny}-${nm}-${nd}`;
}

function formatDateStringDisplay(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${d}-${m}-${y}`;
}

const JENIS_KEGIATAN_LEGEND = [
  { key: "perkuliahan", label: "Perkuliahan", color: "bg-blue-600", enabled: true },
  { key: "ujianKelas", label: "Ujian Kelas", color: "bg-orange-500", enabled: false },
  { key: "ujianTa", label: "Ujian TA", color: "bg-green-600", enabled: false },
  { key: "ujianProposalTa", label: "Ujian Proposal TA", color: "bg-red-800", enabled: false },
] as const;

export default function MonitoringRuang() {
  const [selectedDate, setSelectedDate] = useState(todayDateString());
  const [fakultasId, setFakultasId] = useState("");
  const [programStudiId, setProgramStudiId] = useState("");
  const [statusRuang, setStatusRuang] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [showPerkuliahan, setShowPerkuliahan] = useState(true);

  const { options: fakultasOptions } = useFakultasOptions();
  const { options: programStudiOptions } = useProgramStudiOptions(
    fakultasId || undefined
  );

  const { data, isLoading, isError } = useMonitoringRuangan({
    tanggal: selectedDate,
    fakultasId: fakultasId || undefined,
    programStudiId: programStudiId || undefined,
    search: search || undefined,
    size: 100,
  });

  const rooms = useMemo(() => {
    let list = data?.ruangan ?? [];
    if (statusRuang) {
      list = list.filter((r) => r.status === statusRuang);
    }
    if (!showPerkuliahan) {
      list = list.map((r) => ({
        ...r,
        jadwal: r.jadwal.filter((j) => j.jenisKegiatan !== "perkuliahan"),
      }));
    }
    return list;
  }, [data, statusRuang, showPerkuliahan]);

  function handleFakultasChange(value: string) {
    setFakultasId(value);
    setProgramStudiId(""); // reset prodi saat fakultas berubah
  }

  function handlePrevDay() {
    setSelectedDate((prev) => addDaysToDateString(prev, -1));
  }

  function handleNextDay() {
    setSelectedDate((prev) => addDaysToDateString(prev, 1));
  }

  function handleSearchSubmit() {
    setSearch(searchKeyword);
  }

  function handleReset() {
    setFakultasId("");
    setProgramStudiId("");
    setStatusRuang("");
    setSearchKeyword("");
    setSearch("");
  }

  return (
    <MainLayout titlePage="Monitoring Ruang" isGreeting={false}>
      <p className="text-sm text-gray-400 -mt-3 mb-4">Data Penggunaan Ruangan</p>

      {/* Filter */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-white border-t-2 border-primary-yellow p-3 rounded-sm shadow-sm">
        <SearchableSelect
          label="Fakultas"
          value={fakultasId}
          onChange={handleFakultasChange}
          options={fakultasOptions}
          placeholder="Cari & pilih Fakultas..."
        />
        <SearchableSelect
          label="Program Studi"
          value={programStudiId}
          onChange={setProgramStudiId}
          options={programStudiOptions}
          placeholder="Cari & pilih Program Studi..."
        />
        <SearchableSelect
          label="Status Ruang"
          value={statusRuang}
          onChange={setStatusRuang}
          options={STATUS_RUANG_OPTIONS}
          placeholder="Cari & pilih Status..."
        />
      </div>

      {/* Toolbar: navigasi tanggal, pencarian, jenis kegiatan */}
      <div className="mt-4 flex flex-col xl:flex-row xl:items-center justify-between gap-3 bg-white border-t-2 border-primary-green p-3 rounded-sm shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded overflow-hidden border border-primary-blueDark">
            <button
              onClick={handlePrevDay}
              className="bg-primary-blueDark text-white p-1.5 hover:opacity-90"
              aria-label="Hari sebelumnya"
            >
              <ChevronLeft size={16} />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs sm:text-sm font-semibold px-2 py-1 outline-none"
            />
            <button
              onClick={handleNextDay}
              className="bg-primary-blueDark text-white p-1.5 hover:opacity-90"
              aria-label="Hari berikutnya"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex items-center">
            <input
              type="text"
              className="border-2 p-1 rounded text-xs w-40 sm:w-56"
              placeholder="Cari Nama Ruang..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            />
            <ButtonClick
              icon={<Search size={16} strokeWidth={3} />}
              color="bg-primary-green"
              onClick={handleSearchSubmit}
            />
            <ButtonClick
              icon={<RefreshCw size={16} strokeWidth={3} />}
              color="bg-blue-900"
              onClick={handleReset}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className="text-xs font-semibold text-primary-yellow">
            Jenis Kegiatan
          </span>
          {JENIS_KEGIATAN_LEGEND.map((item) => (
            <label
              key={item.key}
              className={`flex items-center gap-1.5 text-xs sm:text-sm ${
                item.enabled ? "text-gray-700" : "text-gray-300 cursor-not-allowed"
              }`}
              title={item.enabled ? undefined : "Segera hadir — data belum tersedia"}
            >
              <input
                type="checkbox"
                checked={item.key === "perkuliahan" ? showPerkuliahan : false}
                disabled={!item.enabled}
                onChange={(e) =>
                  item.key === "perkuliahan" && setShowPerkuliahan(e.target.checked)
                }
                className="w-3.5 h-3.5"
              />
              <span className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
              {item.label}
            </label>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-4">
        {isError ? (
          <div className="text-red-500 text-center py-8 bg-white rounded-sm shadow-sm">
            Gagal memuat data monitoring ruang.
          </div>
        ) : (
          <>
            {data?.meta && (
              <div className="text-xs text-gray-400 mb-2">
                {data.hari}, {formatDateStringDisplay(selectedDate)} &middot;{" "}
                {rooms.length} ruang ditampilkan &middot; {data.meta.ruanganTerpakai}{" "}
                terpakai, {data.meta.ruanganKosong} kosong
              </div>
            )}
            <RoomScheduleGrid
              rooms={rooms}
              selectedDate={selectedDate}
              isLoading={isLoading}
            />
          </>
        )}
      </div>

      <div className="py-5" />
    </MainLayout>
  );
}
