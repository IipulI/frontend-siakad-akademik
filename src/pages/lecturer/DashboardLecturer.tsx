import React, { useEffect, useState } from "react";
import DashboardSubjectCard from "../../components/dashboard/DashboardSubjectCard";
import DashboardBillCard from "../../components/dashboard/DashboardBillCard";
import DashboardCardAcademic from "../../components/dashboard/DashboardCardAcademic";
import DashboardAnnouncementCard from "../../components/dashboard/DashboardAnnouncementCard";
import MainLayout from "../../components/layouts/MainLayout";
import IPSChart from "../../components/chart/IPSChart";
import { CalendarDays, ChevronDown, TriangleAlert } from "lucide-react";
import axios from "axios";
import DashboardCardGuidance from "../../components/dashboard/DashboardCardGuidance";
import TotalSKS from "../../components/chart/TotalSKS";

const DashboardLecturer = () => {
  const [currentDate, setCurrentDate] = useState<string | undefined>();
  const [subject, setSubject] = useState<String>();
  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbmFrYWRlbWlrdW5pdiIsInJvbGVzIjpbIlJPTEVfQUtBREVNSUtfVU5JViJdLCJpYXQiOjE3NDY1NDgzNTcsImV4cCI6MTc0NzE1MzE1N30.2pi9mNO4_7raPL-CQGVdNqMtK9ypKgDM5TSDMnGafi3nlKfIjhqzThtPgvH3csjhRFjvPtoyKU0lD1Mh53LQTQ";
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const today = new Date().toLocaleDateString("id-ID", options);
    setCurrentDate(today);

    const getSubject = async () => {
      try {
        const response = await axios.get(
          "https://backend-simakad.azurewebsites.net/api/v1/akademik/mata-kuliah",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { data } = response.data;
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    getSubject();
  }, []);

  const data = [
    {
      id: 1,
      name: "Ridho Fatan",
      desc: "lorem ipsum dolor sit amet"
    },
    {
      id: 2,
      name: "Ido Atan",
      desc: "lorem ipsum hehe"
    }
  ]
  return (
    <>
      <MainLayout isGreeting={true} titlePage={""} className={""}>
        <div className="w-full">
          <div className="w-full grid md:grid-cols-5 grid-cols-1 gap-8">
            <div className="md:col-span-3 space-y-4">
              <h1 className="font-semibold md:text-start text-center md:text-base text-2xl">
                Jadwal
              </h1>
              <div className="md:p-8 p-12 bg-white shadow-xl rounded-xl ">
                <div className="flex md:flex-row flex-col justify-between items-center p-2">
                  <div className="flex space-x-2 items-center">
                    <h1 className="font-semibold text-primary-blue">
                      Jadwal Kuliah
                    </h1>
                    <ChevronDown color="#001b36" size={18} />
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
              <div>
                <h1 className="font-semibold md:p-0 p-2">Grafik Akademik</h1>
              </div>
              <TotalSKS currentSKS={8} totalSKS={16} />
              <div className="space-y-4">
                <h1 className="font-semibold md:p-0 p-2">Total Mahasiswa Bimbingan</h1>
                <div className="p-8 bg-white shadow-md rounded-md space-y-6">
                  {data.map(item => (
                    <DashboardCardGuidance
                      name={item.name}
                      desc={item.desc}
                    />
                  ))}
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
