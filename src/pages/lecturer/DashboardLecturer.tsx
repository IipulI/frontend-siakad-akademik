import React, { useEffect, useState } from "react";
import DashboardSubjectCard from "../../components/dashboard/DashboardSubjectCard";
import MainLayout from "../../components/layouts/MainLayout";
import DashboardCardGuidance from "../../components/dashboard/DashboardCardGuidance";
import { useAcademicGuidanceListDashboard } from "../../hooks/lecturer/useFetchGuidance";
import { useNavigate } from "react-router-dom";
import { LecturerRoute } from "../../types/VarRoutes";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useActiveStatus } from "../../hooks/lecturer/useFetchDropdown";
import { useScheduleList } from "../../hooks/lecturer/useFetchSchedule";

const DashboardLecturer = () => {
  const navigate = useNavigate()

  const [currentDate, setCurrentDate] = useState<string | undefined>();
  const [day, setDay] = useState<string | undefined>();
  const [weekDays, setWeekDays] = useState<{ date: Date; label: string }[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    };

    const today = new Date();
    const day = today.getDay(); // 0 = Sunday, 1 = Monday...
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return { date: d, label: d.toLocaleDateString("id-ID", options) };
    });

    const todayIndex = days.findIndex(
        (d) => d.date.toDateString() === today.toDateString()
    );

    setWeekDays(days);
    setSelectedDayIndex(todayIndex >= 0 ? todayIndex : 0);
    setCurrentDate(days[todayIndex >= 0 ? todayIndex : 0].label);
  }, []);
  

  const { data: statusAktif } = useActiveStatus()
  
  const { data: studentData, isPending, isError } = useAcademicGuidanceListDashboard(statusAktif?.data.id, "Diajukan")
  const { data: courseSchedule } = useScheduleList(statusAktif?.data.id)

  const todaySchedule = courseSchedule?.data && day ? courseSchedule.data[day] : [];

  return (
    <>
      <MainLayout isGreeting={true} titlePage={""} className={""}>
        <div className="w-full">
          <div className="w-full grid md:grid-cols-5 grid-cols-1 gap-8">
            <div className="md:col-span-3 space-y-4">
              <h1 className="font-semibold md:text-start text-center md:text-base text-2xl">
                Jadwal hari ini
              </h1>
              <div className="md:p-8 p-12 bg-white shadow-xl rounded-xl">
              <div className="flex md:flex-row flex-col justify-between items-center p-2">
                  <div className="flex space-x-2 items-center">
                    <h1 className="font-semibold text-primary-blue">
                      Jadwal Kuliah
                    </h1>
                    {/* <ChevronDown color="#001b36" size={18} /> */}
                  </div>
                <div className="relative">
                  <div
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                  >
                    <CalendarDays color="#001b36" size={18} />
                    <h1 className="font-semibold text-primary-blue">{currentDate}</h1>
                    <ChevronDown
                        color="#001b36"
                        size={16}
                        className={`transition-transform ${isDateDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                  {isDateDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-lg rounded-md border z-10">
                        {weekDays.map((day, index) => (
                            <div
                                key={index}
                                className={`p-2 hover:bg-gray-100 cursor-pointer ${
                                    index === selectedDayIndex ? "text-primary-blue font-semibold" : ""
                                }`}
                                onClick={() => {
                                  setSelectedDayIndex(index);
                                  setCurrentDate(day.label);
                                  setIsDateDropdownOpen(false);
                                }}
                            >
                              {day.label}
                            </div>
                        ))}
                      </div>
                  )}
                </div>
                </div>
                <div className="space-y-4">
                  {todaySchedule.map((item, index) => (
                    <DashboardSubjectCard
                      key={index}
                      time={`${item.jamMulai} - ${item.jamSelesai}`}
                      lecturer={item.dosen}
                      room={item.ruangan}
                      subject={item.namaMataKuliah}
                      classes={item.kelas}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-4">
                  {isPending || isError ? (
                  <>
                    <h1 className="font-semibold md:p-0 p-2">Total Mahasiswa Bimbingan yang diajukan</h1>
                    <div className="p-8 bg-white shadow-md rounded-md space-y-6">
                      <div className="flex justify-between items-center animate-pulse">
                        <div className="flex flex-col">
                          <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                          <div className="h-3 w-24 bg-gray-100 rounded" />
                        </div>
                        <div className="rounded bg-gray-200 p-2 w-28 h-7" />
                      </div>
                    </div>
                  </>
                  ) : (
                    studentData && studentData.data.length > 0 ? studentData.data.map((item: any, idx: number) => (
                     <>
                       <h1 className="font-semibold md:p-0 p-2">Total Mahasiswa Bimbingan yang diajukan</h1>
                        <div className="p-8 bg-white shadow-md rounded-md space-y-6">
                          <DashboardCardGuidance
                            key={idx}
                            name={item.mahasiswa}
                            onClick={() => navigate(LecturerRoute.guidance.detailAdvisor) || localStorage.setItem("id_mahasiswa", item.id)}
                            desc={"Sudah mengajukan KRS"}
                          />
                        </div>
                     </>
                    ))
                    :
                    (
                      <>
                        <h1 className="font-semibold md:p-0 p-2">Total Mahasiswa Bimbingan yang diajukan</h1>
                        <div className="p-8 bg-white shadow-md rounded-md space-y-6">
                          <div className="flex justify-between items-center">
                            <h1>Belum ada mahasiswa yang diajukan</h1>
                          </div>
                        </div>
                      </>
                    )
                  )}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default DashboardLecturer;
