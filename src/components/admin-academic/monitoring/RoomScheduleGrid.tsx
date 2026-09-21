import { IRuanganMonitoring } from "../../../types/monitoringRuang.types";

interface RoomScheduleGridProps {
  rooms: IRuanganMonitoring[];
  selectedDate: string; // "YYYY-MM-DD"
  isLoading?: boolean;
}

const START_HOUR = 7;
const END_HOUR = 21;
const HOUR_WIDTH = 110; // px per hour column
const ROOM_COLUMN_WIDTH = 190; // px for the sticky "Ruang / Jam" column
const ROW_HEIGHT = 64; // px per room row

const HOURS = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, i) => START_HOUR + i
);
const GRID_WIDTH = (HOURS.length - 1) * HOUR_WIDTH;

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function isSameDay(a: string, b: Date): boolean {
  const [y, m, d] = a.split("-").map(Number);
  return y === b.getFullYear() && m === b.getMonth() + 1 && d === b.getDate();
}

const JENIS_KEGIATAN_STYLE: Record<string, string> = {
  perkuliahan: "bg-blue-600 border-blue-700",
};

export default function RoomScheduleGrid({
  rooms,
  selectedDate,
  isLoading,
}: RoomScheduleGridProps) {
  const now = new Date();
  const showNowLine = isSameDay(selectedDate, now);
  const nowOffset =
    ((now.getHours() * 60 + now.getMinutes() - START_HOUR * 60) / 60) *
    HOUR_WIDTH;

  return (
    <div className="border rounded-sm bg-white overflow-hidden">
      <div className="overflow-auto" style={{ maxHeight: "65vh" }}>
        <table className="border-collapse" style={{ width: "max-content" }}>
          <thead>
            <tr>
              <th
                className="sticky top-0 left-0 z-30 bg-primary-blueDark text-white text-xs font-semibold p-2 border border-blue-900"
                style={{ width: ROOM_COLUMN_WIDTH, minWidth: ROOM_COLUMN_WIDTH }}
              >
                Ruang / Jam
              </th>
              {HOURS.map((h) => (
                <th
                  key={h}
                  className="sticky top-0 z-20 bg-primary-blueDark text-white text-xs font-semibold p-2 border border-blue-900"
                  style={{ width: HOUR_WIDTH, minWidth: HOUR_WIDTH }}
                >
                  {String(h).padStart(2, "0")}:00
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={HOURS.length + 1}
                  className="text-center py-8 text-gray-400 text-sm"
                >
                  Memuat data ruangan...
                </td>
              </tr>
            ) : rooms.length === 0 ? (
              <tr>
                <td
                  colSpan={HOURS.length + 1}
                  className="text-center py-8 text-gray-400 text-sm"
                >
                  Tidak ada ruangan yang cocok dengan filter.
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.id}>
                  <td
                    className="sticky left-0 z-10 bg-white p-2 border border-gray-200 align-top"
                    style={{ width: ROOM_COLUMN_WIDTH, minWidth: ROOM_COLUMN_WIDTH }}
                  >
                    <div className="text-xs font-semibold text-gray-text">
                      {room.kode} - {room.nama}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Kapasitas : {room.kapasitas}
                    </div>
                  </td>
                  <td
                    className="relative p-0 border border-gray-200"
                    colSpan={HOURS.length}
                  >
                    <div
                      className="relative"
                      style={{
                        width: GRID_WIDTH,
                        height: ROW_HEIGHT,
                        backgroundImage: `repeating-linear-gradient(to right, #e5e7eb 0, #e5e7eb 1px, transparent 1px, transparent ${HOUR_WIDTH}px)`,
                      }}
                    >
                      {showNowLine &&
                        nowOffset >= 0 &&
                        nowOffset <= GRID_WIDTH && (
                          <div
                            className="absolute top-0 bottom-0 border-l border-dashed border-red-400 z-10"
                            style={{ left: nowOffset }}
                          />
                        )}
                      {room.jadwal.map((jadwal) => {
                        const startMin = timeToMinutes(jadwal.jamMulai);
                        const endMin = timeToMinutes(jadwal.jamSelesai);
                        const left =
                          ((startMin - START_HOUR * 60) / 60) * HOUR_WIDTH;
                        const width = ((endMin - startMin) / 60) * HOUR_WIDTH;
                        const colorClass =
                          JENIS_KEGIATAN_STYLE[jadwal.jenisKegiatan] ||
                          "bg-gray-500 border-gray-600";

                        const title = [
                          jadwal.kelas.mataKuliah.nama,
                          `Kelas ${jadwal.kelas.nama}`,
                          jadwal.dosen ? jadwal.dosen.nama : null,
                          `${jadwal.jamMulai.slice(0, 5)} - ${jadwal.jamSelesai.slice(0, 5)}`,
                        ]
                          .filter(Boolean)
                          .join(" • ");

                        return (
                          <div
                            key={jadwal.id}
                            title={title}
                            className={`absolute top-1 bottom-1 rounded text-white text-[10px] leading-tight px-1.5 py-1 overflow-hidden border ${colorClass}`}
                            style={{
                              left: Math.max(left, 0),
                              width: Math.max(width - 2, 4),
                            }}
                          >
                            <div className="font-semibold truncate">
                              {jadwal.kelas.mataKuliah.nama}
                            </div>
                            <div className="truncate opacity-90">
                              {jadwal.kelas.nama}
                              {jadwal.dosen ? ` • ${jadwal.dosen.nama}` : ""}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
