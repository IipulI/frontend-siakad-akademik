import React, { useEffect, useState } from "react";
import DashboardSubjectCard from "../../components/dashboard/DashboardSubjectCard";
import MainLayout from "../../components/layouts/MainLayout";
import DashboardCardGuidance from "../../components/dashboard/DashboardCardGuidance";
import { useAcademicGuidanceListDashboard } from "../../hooks/lecturer/useFetchGuidance";
import { useNavigate } from "react-router-dom";
import { LecturerRoute } from "../../types/VarRoutes";
import { CalendarDays, ChevronDown } from "lucide-react";

const DashboardLecturer = () => {
  const navigate = useNavigate()

  const [currentDate, setCurrentDate] = useState<string | undefined>();
  // const [periodeAkademikId, setPeriodeAkademikId] = useState<string>("");

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const today = new Date().toLocaleDateString("id-ID", options);
    setCurrentDate(today);
  }, []);

  // const { data: periodeAkademikDropdown } = useAcademicPeriodDropdown()

  const { data: studentData, isPending, isError } = useAcademicGuidanceListDashboard("31152ad0-ae41-4feb-8767-98fec9a1cf6f", "Diajukan")

  console.log(studentData)

  // useEffect(() => {
  //   if (periodeAkademikDropdown?.data?.length > 0) {
  //     setPeriodeAkademikId(periodeAkademikDropdown?.data[0].id)
  //   }
  // }, [periodeAkademikDropdown]);

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
                  <div className="flex items-center space-x-2">
                    <CalendarDays color="#001b36" size={18} />
                    <h1 className="font-semibold text-primary-blue">
                      {currentDate}
                    </h1>
                  </div>
                </div>
                <div className="space-y-4">
                  <DashboardSubjectCard
                    time="09.40 - 11.20"
                    lecturer="Fitrah Satrya Fajar"
                    room="Ruang 206"
                    meet="Pertemuan ke 6"
                    absent="Belum hadiran"
                    sks="2 SKS"
                    subject={"Pemrograman Perangkat Bergerak"}
                    classes={"REG_B"}
                  />
                  <DashboardSubjectCard
                    time="09.30 - 11.10"
                    lecturer="Safarrudin Hidayat A. Ikhsan"
                    room="Ruang 209"
                    meet="Pertemuan ke 5"
                    absent="Belum hadiran"
                    sks="3 SKS"
                    subject={"Pemrograman Web"}
                    classes={"REG_A"}
                  />
                </div>
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-4">
                <h1 className="font-semibold md:p-0 p-2">Total Mahasiswa Bimbingan yang diajukan</h1>
                <div className="p-8 bg-white shadow-md rounded-md space-y-6">
                  {isPending || isError ? (
                    <div className="flex justify-between items-center animate-pulse">
                      <div className="flex flex-col">
                        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                        <div className="h-3 w-24 bg-gray-100 rounded" />
                      </div>
                      <div className="rounded bg-gray-200 p-2 w-28 h-7" />
                    </div>
                  ) : (
                    studentData && studentData.map((item: any, idx: number) => (
                      <DashboardCardGuidance
                        key={idx}
                        name={item.mahasiswa}
                        onClick={() => navigate(LecturerRoute.guidance.detailAdvisor) || localStorage.setItem("id_mahasiswa", item.id)}
                        desc={"Sudah mengajukan KRS"}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default DashboardLecturer;
