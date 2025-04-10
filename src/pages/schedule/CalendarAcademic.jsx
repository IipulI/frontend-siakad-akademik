import React, { useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
} from "date-fns";
import { id } from "date-fns/locale";

const CalendarAcademic = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthYear = format(currentDate, "MMMM yyyy", { locale: id });
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
  const firstDayIndex = getDay(startDate);

  return (
    <MainLayout isGreeting={false} titlePage={"Kalender Akademik"}>
      <div className="grid md:grid-cols-6 grid-flow-dense gap-8">
        <div className="col-span-2">
          <div className="bg-white p-4 shadow-md rounded-md text-sm space-y-3.5">
            <h1 className="font-semibold">Periode Akademik</h1>
            <select className="rounded-md border-[#969696] border w-full text-[#969696] p-1">
              <option value="">2024 Genap</option>
            </select>
            <h1 className="font-semibold">Kegiatan Akademik</h1>
            <h1 className="text-[#969696] p-2">Tidak ada kegiatan</h1>
            <h1 className="font-semibold">Informasi Lainnya</h1>
            <div className="space-y-2">
              <div className="flex-items-center space-x-2 text-[#969696]">
                <input
                  className="rounded-xl border border-[#969696] w-1/4 shadow-md"
                  type="text"
                />
                <span>Hari Kuliah</span>
              </div>
              <div className="flex-items-center space-x-2 text-[#969696]">
                <input
                  className="rounded-xl border border-[#969696] bg-red-400 w-1/4 shadow-md"
                  type="text"
                />
                <span>Hari Libur</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-4">
          <div className="p-4 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setMonth(currentDate.getMonth() - 1))
                  )
                }
                className="px-2 py-1 bg-gray-200 rounded-md"
              >
                {"<"}
              </button>
              <h2 className="text-[#9c9c9c] font-bold">{monthYear}</h2>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.setMonth(currentDate.getMonth() + 1))
                  )
                }
                className="px-2 py-1 bg-gray-200 rounded-md"
              >
                {">"}
              </button>
            </div>

            <div className="grid grid-cols-7 text-center font-semibold">
              {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                <div
                  key={day}
                  className={
                    day === "Min"
                      ? "py-2  text-[#db2d2f] rounded-md"
                      : "py-2 text-[#212121] rounded-md"
                  }
                >
                  {day}
                </div>
              ))}

              {Array.from({ length: firstDayIndex }).map((_, index) => (
                <div key={`empty-${index}`} className="text-gray-400"></div>
              ))}

              {daysInMonth.map((day) => {
                const isToday = isSameDay(day, new Date());
                const isSunday = getDay(day) === 0;

                return (
                  <div
                    key={day}
                    className={`border shadow py-6 rounded-md cursor-pointer
        ${isToday ? "bg-primary-green text-white font-bold" : ""}`}
                  >
                    <span
                      className={`${
                        isSunday && !isToday ? "text-[#ed9697]" : ""
                      }`}
                    >
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
