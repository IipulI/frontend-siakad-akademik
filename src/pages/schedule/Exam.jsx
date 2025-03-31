import React, { useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import ExamToggleButton from "../../components/ExamToggleButton";
import ExamScheduleCard from "../../components/ExamScheduleCard";
import DashboardCardAcademic from "../../components/DashboardCardAcademic";
import DashboardBillCard from "../../components/DashboardBillCard";

const Exam = () => {
  const [examType, setExamType] = useState("UTS"); // Default UTS
  return (
    <MainLayout isGreeting={true}>
      <div className="w-full">
        <div className="w-full grid grid-cols-5 gap-4">
          <div className="col-span-3 space-y-4">
            <h1 className="font-semibold">Jadwal</h1>
            <div className="p-8 shadow-md bg-white w-full rounded-xl space-y-4">
              <div className="flex justify-between items-center w-full">
                <h1 className="font-semibold p-2">Jadwal Ujian Semester</h1>
                <div className="rounded-full py-1 px-2 flex space-x-1 bg-[#EAE7F2] w-fit ">
                  <ExamToggleButton
                    examType={examType}
                    setExamType={setExamType}
                  />
                </div>
              </div>
              <ExamScheduleCard
                subject={"Metode Penelitian"}
                date={"Selasa , 1 April 2025"}
                type={
                  examType === "UTS"
                    ? "Ujian Tengah Semester"
                    : "Ujian Akhir Semester"
                }
                lecturer={"Safaruddin Hidayat Al Ikhsan"}
                time={"13:00 - 14:40 WIB"}
                room={"Ruang Kuliah Lantai 2 no 202"}
                status={"Ujian Luring"}
              />
              <ExamScheduleCard
                subject={"E-Commerce"}
                date={"Rabu , 2 April 2025"}
                type={
                  examType === "UTS"
                    ? "Ujian Tengah Semester"
                    : "Ujian Akhir Semester"
                }
                lecturer={"Ina Novianty"}
                time={"13:00 - 14:40 WIB"}
                room={"Ruang Kuliah Lantai 3 no 308"}
                status={"Ujian Luring"}
              />
              <ExamScheduleCard
                subject={"Kapita Selekta"}
                date={"Kamis , 3 April 2025"}
                type={
                  examType === "UTS"
                    ? "Ujian Tengah Semester"
                    : "Ujian Akhir Semester"
                }
                lecturer={"Dewi Primasari"}
                time={"09:40 - 10:40 WIB"}
                room={"Ruang Kuliah Lantai 2 no 206"}
                status={"Ujian Luring"}
              />
              <ExamScheduleCard
                subject={"Teknologi Multimedia"}
                date={"Kamis , 3 April 2025"}
                type={
                  examType === "UTS"
                    ? "Ujian Tengah Semester"
                    : "Ujian Akhir Semester"
                }
                lecturer={"Hersanto Fajri"}
                time={"09:40 - 10:40 WIB"}
                room={"Ruang Kuliah Lantai 2 no 206"}
                status={"Ujian Luring"}
              />
              <ExamScheduleCard
                subject={"Manajemen Proyek"}
                date={"Jumat , 4 April 2025"}
                type={
                  examType === "UTS"
                    ? "Ujian Tengah Semester"
                    : "Ujian Akhir Semester"
                }
                lecturer={"Fitrah Satrya Fajar Kusuma"}
                time={"09:40 - 10:40 WIB"}
                room={"Ruang Kuliah Lantai 3 no 302"}
                status={"Ujian Luring"}
              />
            </div>
          </div>
          <div className="col-span-2 space-y-4">
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
        </div>
      </div>
    </MainLayout>
  );
};

export default Exam;
