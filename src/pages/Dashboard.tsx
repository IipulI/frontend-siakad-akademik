import React, { useEffect, useState } from "react";
import DashboardSubjectCard from "../components/DashboardSubjectCard";
import DashboardBillCard from "../components/DashboardBillCard";
import DashboardCardAcademic from "../components/DashboardCardAcademic";
import DashboardAnnouncementCard from "../components/DashboardAnnouncementCard";
import MainLayout from "../components/layouts/MainLayout";
import IPSChart from "../components/chart/IPSChart";
import { CalendarDays, ChevronDown, TriangleAlert } from "lucide-react";

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState<string | undefined>();
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
              <h1 className="font-semibold md:p-0 p-2">Status Keuangan</h1>
              <div className="w-full flex gap-4">
                <DashboardBillCard title={"Total Tagihan"} price={46750000} />
                <DashboardBillCard title={"Total Lunas"} price={45450000} />
              </div>
              <div>
                <DashboardBillCard
                  pay={true}
                  title={"Total Tagihan"}
                  price={3300000}
                />
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              <div>
                <h1 className="font-semibold md:p-0 p-2">Grafik Akademik</h1>
              </div>
              <IPSChart />
              <div className="space-y-4">
                <h1 className="font-semibold md:p-0 p-2">Akademik</h1>
                <div className="grid grid-cols-2 gap-4">
                  <DashboardCardAcademic
                    title={"Jumlah IPS"}
                    number={3.74}
                    color={"text-red-700"}
                  />
                  <DashboardCardAcademic
                    title={"Jumlah IPK"}
                    number={3.78}
                    color={""}
                  />
                  <DashboardCardAcademic
                    title={"Jumlah Jumlah MK Kumulatif"}
                    number={40}
                    color=""
                  />
                  <DashboardCardAcademic
                    title={"Jumlah SKS Kumulatif"}
                    number={103}
                    color=""
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="font-semibold md:p-0 p-2">Pengumuman</h1>
                <div className="p-8 bg-white shadow-md rounded-md space-y-6">
                  <DashboardAnnouncementCard
                    title={"Cara Bayar Kuliah Melalui Shopee"}
                    date={"Kamis , 06-03-2025"}
                    description={"lorem ipsum dolor sit amet..."}
                  />
                  <DashboardAnnouncementCard
                    title={"Cara Bayar Kuliah Melalui Tokopedia"}
                    date={"Selasa , 19-11-2025"}
                    description={"lorem ipsum dolor sit amet..."}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Dashboard;
