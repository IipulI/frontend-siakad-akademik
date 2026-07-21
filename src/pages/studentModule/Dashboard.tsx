import React, { useEffect, useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import { CalendarDays, ChevronDown } from "lucide-react";
import { getPlainTextSummary } from "../../utils/textUtils";
import { usePengumumanMahasiswa } from "../../hooks/usePengumuman";

// --- Child Components ---
import DashboardSubjectCard from "../../components/dashboard/DashboardSubjectCard";
import DashboardBillCard from "../../components/dashboard/DashboardBillCard";
import DashboardCardAcademic from "../../components/dashboard/DashboardCardAcademic";
import DashboardAnnouncementCard from "../../components/dashboard/DashboardAnnouncementCard";
import IPSChart from "../../components/chart/IPSChart";

const Dashboard = () => {
  // --- LOCAL UI STATE ---
  const [activeView, setActiveView] = useState<'kuliah' | 'ujian'>('kuliah');
  const [currentDate, setCurrentDate] = useState<string | undefined>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // --- HOOK DATA ---
  const { data: pengumumanResponse, isLoading: isLoadingPengumuman, isError: isErrorPengumuman } = usePengumumanMahasiswa({
    page: 1,
    size: 5,
    sort: 'createdAt,desc'
  });

  // --- DUMMY DATA ---
  const dummyJadwalKuliah = [
    {
      jamMulai: "08:00",
      jamSelesai: "09:40",
      dosen: "Dr. Ir. Budi Raharjo",
      ruangan: "Lab Komputer 1",
      namaMataKuliah: "Pemrograman Berorientasi Objek",
      kelas: "TIF221 - Reguler A",
    },
    {
      jamMulai: "10:00",
      jamSelesai: "11:40",
      dosen: "Fety Fatimah, S.Kom., M.Kom.",
      ruangan: "Ruang A3",
      namaMataKuliah: "Jaringan Komputer + Praktikum",
      kelas: "TIF211 - Reguler A",
    }
  ];

  const dummyGrafikData = {
    ips: [3.20, 3.40, 3.10, 3.50, 3.70],
    ipk: "3.45",
    mataKuliahKumulatif: 24,
    sksKumulatif: 78,
  };

  const dummyTagihanData = {
    totalTagihan: 5600000,
    totalLunas: 3200000,
    sisaTagihan: 2400000,
    tanggalTenggat: "25 Juli 2026",
  };


  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    };
    const today = new Date().toLocaleDateString("id-ID", options);
    setCurrentDate(today);
  }, []);

  const viewOptions = {
    kuliah: 'Jadwal Kuliah',
    ujian: 'Jadwal Ujian',
  };

  const handleOptionClick = (view: 'kuliah' | 'ujian') => {
    setActiveView(view);
    setIsDropdownOpen(false);
  };

  return (
    <MainLayout isGreeting={true} titlePage={""} className={""}>
      <div className="w-full">
        <div className="w-full grid md:grid-cols-5 grid-cols-1 gap-8">
          {/* --- LEFT COLUMN (MAIN CONTENT) --- */}
          <div className="md:col-span-3 space-y-4">
            <h1 className="font-semibold md:text-start text-center md:text-base text-2xl">
              Jadwal
            </h1>
            <div className="md:p-8 p-12 bg-white shadow-xl rounded-xl">
              <div className="flex md:flex-row flex-col justify-between items-center p-2 mb-4">
                <div className="relative">
                  <div
                    className="flex space-x-2 items-center cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <h1 className="font-semibold text-primary-blue">
                      {viewOptions[activeView]}
                    </h1>
                    <ChevronDown color="#001b36" size={18} />
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute top-full mt-2 w-48 bg-white shadow-lg rounded-md border z-10">
                      <div
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleOptionClick('kuliah')}
                      >
                        Jadwal Kuliah
                      </div>
                      <div
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleOptionClick('ujian')}
                      >
                        Jadwal Ujian
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarDays color="#001b36" size={18} />
                  <h1 className="font-semibold text-primary-blue">{currentDate}</h1>
                </div>
              </div>
              <div className="space-y-4">
                {activeView === 'kuliah' && (
                  <>
                    {dummyJadwalKuliah.length > 0 ? (
                      dummyJadwalKuliah.map((item, index) => (
                        <DashboardSubjectCard
                          key={index}
                          time={`${item.jamMulai} - ${item.jamSelesai}`}
                          lecturer={item.dosen}
                          room={item.ruangan}
                          subject={item.namaMataKuliah}
                          classes={item.kelas}
                          meet={"-"}
                          absent={"-"}
                          sks={"-"}
                        />
                      ))
                    ) : (
                      <p>Tidak ada jadwal kuliah hari ini.</p>
                    )}
                  </>
                )}
                {activeView === 'ujian' && (
                  <div>
                    <p className="text-gray-500 italic">Jadwal ujian belum tersedia.</p>
                  </div>
                )}
              </div>
            </div>

            <h1 className="font-semibold md:p-0 p-2">Status Keuangan</h1>
            <div className="w-full flex flex-col sm:flex-row gap-4">
              <DashboardBillCard
                title={"Total Tagihan"}
                price={dummyTagihanData.totalTagihan}
                status="info"
              />
              <DashboardBillCard
                title={"Total Lunas"}
                price={dummyTagihanData.totalLunas}
                status="info"
              />
            </div>
            <div>
              {dummyTagihanData.sisaTagihan > 0 ? (
                <DashboardBillCard
                  title={"Sisa Tagihan"}
                  price={dummyTagihanData.sisaTagihan}
                  status="payable"
                  date={dummyTagihanData.tanggalTenggat}
                />
              ) : (
                <DashboardBillCard
                  title={"Status Tagihan"}
                  price={0}
                  status="paid"
                />
              )}
            </div>
          </div>

          {/* --- RIGHT COLUMN (SIDEBAR) --- */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h1 className="font-semibold md:p-0 p-2">Grafik Akademik</h1>
            </div>
            <IPSChart ipsData={dummyGrafikData.ips} />
            <div className="space-y-4">
              <h1 className="font-semibold md:p-0 p-2">Akademik</h1>
              <div className="grid grid-cols-2 gap-4">
                <DashboardCardAcademic title={"IPK"} number={dummyGrafikData.ipk} color={"text-red-700"} />
                <DashboardCardAcademic
                  title={"IPS"}
                  number={dummyGrafikData.ips[dummyGrafikData.ips.length - 1] || 0}
                  color=""
                />
                <DashboardCardAcademic title={"Jumlah MK Komulatif"} number={dummyGrafikData.mataKuliahKumulatif} color="" />
                <DashboardCardAcademic title={"Jumlah SKS Komulatif"} number={dummyGrafikData.sksKumulatif} color="" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="font-semibold md:p-0 p-2">Pengumuman</h1>
              <div className="p-8 bg-white shadow-md rounded-md space-y-6">
                {isLoadingPengumuman && <div className="text-gray-500">Memuat pengumuman...</div>}
                {isErrorPengumuman && <div className="text-red-500">Gagal memuat pengumuman.</div>}
                {!isLoadingPengumuman && !isErrorPengumuman && (
                  pengumumanResponse?.data && pengumumanResponse.data.length > 0 ? (
                    pengumumanResponse.data.map((item) => (
                      <DashboardAnnouncementCard
                        key={item.id}
                        title={item.judul}
                        description={getPlainTextSummary(item.isi, 100)}
                        date={""}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 italic">Tidak ada pengumuman.</p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;