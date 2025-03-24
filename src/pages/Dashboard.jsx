import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import DashboardSubjectCard from "../components/DashboardSubjectCard";
import DashboardBillCard from "../components/DashboardBillCard";
import DashboardCardAcademic from "../components/DashboardCardAcademic";

const Dashboard = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    let message = "";

    if (hour >= 6 && hour <= 11) {
      message = "Selamat Pagi";
    } else if (hour >= 12 && hour <= 14) {
      message = "Selamat Siang";
    } else if (hour >= 15 && hour <= 17) {
      message = "Selamat Sore";
    } else {
      message = "Selamat Malam";
    }

    setGreeting(message);
  }, []); // Akan dijalankan sekali saat komponen dimuat

  return (
    <div className="bg-primary-white min-h-screen">
      <Navbar />
      <div className="container mx-auto max-w-6xl">
        <div className="space-y-4 w-full">
          {/* Greeting berdasarkan waktu */}
          <div className="text-2xl flex">
            <h1>{greeting},&nbsp;</h1>
            <h1 className="text-gray-text font-semibold">Maulana Ikhsan</h1>
          </div>

          <div className="w-full flex space-x-4">
            <div className="w-3/5 space-y-4">
              <h1 className="font-semibold">Jadwal</h1>
              <div className="p-8 bg-white shadow-xl rounded-xl">
                <div className="flex justify-between space-y-4">
                  <h1 className="font-semibold text-primary-blue">
                    Jadwal Kuliah
                  </h1>
                  <h1 className="font-semibold text-primary-blue">
                    Jumat, 21 Maret 2025
                  </h1>
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
              <h1 className="font-semibold">Status Keuangan</h1>
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
            <div className="w-2/5 space-y-4">
              <div>
                <h1 className="font-semibold">Grafik Akademik</h1>
              </div>
              <DashboardBillCard title={"Total Lunas"} price={45450000} />
              <DashboardBillCard title={"Total Lunas"} price={45450000} />
              <div className="space-y-4">
                <h1 className="font-semibold">Akademik</h1>
                <div className="grid grid-cols-2 gap-4">
                  <DashboardCardAcademic
                    title={"Jumlah IPS"}
                    number={3.74}
                    color={"text-red-700"}
                  />
                  <DashboardCardAcademic title={"Jumlah IPK"} number={3.78} />
                  <DashboardCardAcademic
                    title={"Jumlah Jumlah MK Kumulatif"}
                    number={40}
                  />
                  <DashboardCardAcademic
                    title={"Jumlah SKS Kumulatif"}
                    number={103}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
