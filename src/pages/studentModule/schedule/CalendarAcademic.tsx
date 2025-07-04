import React, { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { id } from "date-fns/locale";
import { useAcademicPeriods, useActivePeriod } from "../../../hooks/usePeriodeAkademik";
import { useJadwal } from "../../../hooks/mahasiswa/useJadwal";
import { IJadwalKuliah } from "../../../types/mahasiswa.types";

const CalendarAcademic = () => {
  // 1. STATE MANAGEMENT
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // 2. HOOK CALLS
  // Fetch the list of periods for the dropdown
  const { data: periods, isLoading: isLoadingPeriods } = useAcademicPeriods();
  // Fetch the single active period to set the default dropdown value
  const { data: activePeriod, isSuccess: isActivePeriodSuccess } = useActivePeriod();
  // Fetch the daily schedule based on the selected period and date
  const { data: dailySchedule, isLoading: isLoadingSchedule } = useJadwal({
    type: 'daily',
    namaPeriode: selectedPeriod,
    // Format the day name to Indonesian (e.g., "Senin", "Selasa")
    hari: format(selectedDate, 'EEEE', { locale: id }).toLowerCase(),
  });

  // 3. EFFECTS
  // Set the selected period once the active period is successfully fetched
  useEffect(() => {
    if (isActivePeriodSuccess && activePeriod) {
      setSelectedPeriod(activePeriod.namaPeriode);
    }
  }, [isActivePeriodSuccess, activePeriod]);

  // 4. DATE-FNS CALCULATIONS
  const monthYear = format(currentDate, "MMMM yyyy", { locale: id });
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
  const firstDayIndex = getDay(startDate);

  // 5. RENDER LOGIC
  const renderSchedule = (schedule: IJadwalKuliah[] | undefined) => {
    if (isLoadingSchedule) {
      return <p className="text-sm text-gray-500 p-2">Loading schedule...</p>;
    }
    if (!schedule || schedule.length === 0) {
      return <p className="text-sm text-gray-500 p-2">Tidak ada jadwal kuliah.</p>;
    }
    return schedule.map((item) => (
        <div key={item.kodeMataKuliah} className="text-gray-600 p-2 text-sm border-b">
          <p className="font-semibold">{item.namaMataKuliah}</p>
          <p>{item.jamMulai} - {item.jamSelesai} di {item.ruangan}</p>
          <p className="text-xs">{item.dosen}</p>
        </div>
    ));
  };

  return (
      <MainLayout isGreeting={false} titlePage={"Kalender Akademik"}>
        <div className="grid md:grid-cols-6 grid-flow-dense gap-8 border-t-2 border-primary-yellow rounded-t-sm pt-5">
          {/* === SIDEBAR === */}
          <div className="col-span-2">
            <div className="bg-white p-4 shadow-md rounded-md text-sm space-y-3.5">
              <h1 className="font-semibold">Periode Akademik</h1>
              <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  disabled={isLoadingPeriods}
                  className="rounded-md border-[#969696] border w-full text-gray-700 p-1"
              >
                {isLoadingPeriods ? (
                    <option>Loading periods...</option>
                ) : (
                    periods?.map((period) => (
                        <option key={period.id} value={period.namaPeriode}>
                          {period.namaPeriode}
                        </option>
                    ))
                )}
              </select>
              <h1 className="font-semibold">Kegiatan Akademik pada {format(selectedDate, 'd MMMM yyyy', { locale: id })}</h1>
              {renderSchedule(dailySchedule as IJadwalKuliah[] | undefined)}

              <h1 className="font-semibold">Informasi Lainnya</h1>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="w-4 h-4 rounded-full bg-primary-green" />
                  <span>Hari Terpilih</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <div className="w-4 h-4 rounded-full bg-red-400" />
                  <span>Hari Libur</span>
                </div>
              </div>
            </div>
          </div>

          {/* === CALENDAR === */}
          <div className="col-span-4">
            <div className="p-4 bg-white shadow-md rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                    className="px-2 py-1 bg-gray-200 rounded-md"
                >
                  {"<"}
                </button>
                <h2 className="text-gray-700 font-bold">{monthYear}</h2>
                <button
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    className="px-2 py-1 bg-gray-200 rounded-md"
                >
                  {">"}
                </button>
              </div>

              <div className="grid grid-cols-7 text-center font-semibold">
                {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                    <div key={day} className={day === "Min" ? "py-2 text-red-500" : "py-2 text-gray-800"}>
                      {day}
                    </div>
                ))}

                {Array.from({ length: firstDayIndex }).map((_, index) => (
                    <div key={`empty-${index}`}></div>
                ))}

                {daysInMonth.map((day) => {
                  const isSelected = isSameDay(day, selectedDate);
                  const isSunday = getDay(day) === 0;

                  return (
                      <div
                          key={day.toISOString()}
                          onClick={() => setSelectedDate(day)}
                          className={`border shadow py-6 rounded-md cursor-pointer transition-colors ${
                              isSelected
                                  ? "bg-primary-green text-white font-bold"
                                  : "bg-white hover:bg-gray-100"
                          }`}
                      >
                    <span className={`${isSunday && !isSelected ? "text-red-400" : ""}`}>
                      {format(day, "d")}
                    </span>
                      </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
  );
};

export default CalendarAcademic;