import React, { useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
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
          <div className="bg-white p-4 shadow-md rounded-md text-sm space-y-6">
            <h1 className="font-semibold">Periode Akademik</h1>
            <select className="rounded-md border-primary-brown border w-full p-1">
              <option value="">2024 Genap</option>
            </select>
            <h1 className="font-semibold">Kegiatan Akademik</h1>
            <span className="text-primary-brown">Tidak ada kegiatan</span>
            <h1 className="font-semibold">Informasi Lainnya</h1>
            <div className="space-y-2">
              <div className="flex-items-center space-x-2 text-primary-brown">
                <input
                  className="rounded-xl border border-primary-brown w-1/4 shadow-md"
                  type="text"
                />
                <span>Hari Kuliah</span>
              </div>
              <div className="flex-items-center space-x-2 text-primary-brown">
                <input
                  className="rounded-xl border border-primary-brown bg-red-400 w-1/4 shadow-md"
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
              <h2 className="text-lg font-bold">{monthYear}</h2>
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

            <div className="grid grid-cols-7 gap-1 text-center font-semibold">
              {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                <div
                  key={day}
                  className={
                    day === "Min"
                      ? "py-2 bg-gray-100 text-red-400 rounded-md"
                      : "py-2 bg-gray-100 rounded-md"
                  }
                >
                  {day}
                </div>
              ))}

              {Array.from({ length: firstDayIndex }).map((_, index) => (
                <div key={`empty-${index}`} className="text-gray-400"></div>
              ))}

              {daysInMonth.map((day) => (
                <div
                  key={day}
                  className="border shadow py-6 rounded-md hover:bg-blue-200 cursor-pointer"
                >
                  {format(day, "d")}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CalendarAcademic;
