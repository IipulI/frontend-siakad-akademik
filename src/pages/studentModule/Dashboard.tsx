import React, { useEffect, useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import { CalendarDays, ChevronDown, TriangleAlert } from "lucide-react";

// --- Child Components ---
import DashboardSubjectCard from "../../components/dashboard/DashboardSubjectCard";
import DashboardBillCard from "../../components/dashboard/DashboardBillCard";
import DashboardCardAcademic from "../../components/dashboard/DashboardCardAcademic";
import DashboardAnnouncementCard from "../../components/dashboard/DashboardAnnouncementCard";
import IPSChart from "../../components/chart/IPSChart";
import ExamToggleButton from "../../components/ExamToggleButton";
import ExamScheduleCard from "../../components/ExamScheduleCard";

// --- Custom Hooks for Data Fetching ---
import { useJadwal } from "../../hooks/mahasiswa/useJadwal";
import { useGrafikAkademik } from "../../hooks/mahasiswa/useGrafikAkademik";
import { useInfoTagihan } from "../../hooks/mahasiswa/useInfoTagihan";
import { usePengumumanMahasiswa } from "../../hooks/usePengumuman";

const Dashboard = () => {
  // --- LOCAL UI STATE ---
  const [activeView, setActiveView] = useState<'kuliah' | 'ujian'>('kuliah');
  const [examType, setExamType] = useState<'UTS' | 'UAS'>('UTS');
  const [currentDate, setCurrentDate] = useState<string | undefined>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // --- DATA FETCHING HOOKS ---
  const {
    data: jadwalKuliah,
    isLoading: isLoadingJadwal,
    isError: isErrorJadwal,
  } = useJadwal({
    type: 'daily',
    namaPeriode: "2024 Genap", // This should be dynamic in a real app
    hari: new Date().toLocaleDateString("id-ID", { weekday: 'long' }).toLowerCase()
  });

  const {
    data: grafikData,
    isLoading: isLoadingGrafik,
    isError: isErrorGrafik,
  } = useGrafikAkademik();

  const {
    data: tagihanData,
    isLoading: isLoadingTagihan,
    isError: isErrorTagihan,
  } = useInfoTagihan();

  const { data: pengumumanResponse, isLoading: isLoadingPengumuman, isError: isErrorPengumuman } = usePengumumanMahasiswa({
    page: 1,
    size: 5,
    sort: 'createdAt,desc'
  });

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
              <div className="md:p-8 p-12 bg-white shadow-xl rounded-xl ">
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
                        {isLoadingJadwal && <p>Loading schedule...</p>}
                        {isErrorJadwal && <p style={{ color: 'red' }}>Gagal memuat jadwal kuliah.</p>}
                        {!isLoadingJadwal && !isErrorJadwal && (
                            jadwalKuliah && jadwalKuliah.length > 0 ? (
                                jadwalKuliah.map((item, index) => (
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
                            )
                        )}
                      </>
                  )}
                  {activeView === 'ujian' && (
                      <div>
                        {/* The exam schedule components remain static for now */}
                        <p>Exam schedule will be integrated next.</p>
                      </div>
                  )}
                </div>
              </div>

              <h1 className="font-semibold md:p-0 p-2">Status Keuangan</h1>
              {isLoadingTagihan && <div>Loading financial status...</div>}
              {isErrorTagihan && <div style={{ color: 'red' }}>Failed to load financial status.</div>}
              {tagihanData && (
                  <>
                    <div className="w-full flex gap-4">
                      <DashboardBillCard title={"Total Tagihan"} price={tagihanData.totalTagihan} />
                      <DashboardBillCard title={"Total Lunas"} price={tagihanData.totalLunas} />
                    </div>
                    <div>
                      <DashboardBillCard
                          pay={true}
                          title={"Sisa Tagihan"}
                          price={tagihanData.sisaTagihan}
                          date={tagihanData.tanggalTenggat}
                      />
                    </div>
                  </>
              )}
            </div>

            {/* --- RIGHT COLUMN (SIDEBAR) --- */}
            <div className="md:col-span-2 space-y-4">
              {isLoadingGrafik && <div>Loading academic data...</div>}
              {isErrorGrafik && <div style={{ color: 'red' }}>Failed to load academic data.</div>}
              {grafikData && (
                  <>
                    <div>
                      <h1 className="font-semibold md:p-0 p-2">Grafik Akademik</h1>
                    </div>
                    <IPSChart ipsData={grafikData.ips} />
                    <div className="space-y-4">
                      <h1 className="font-semibold md:p-0 p-2">Akademik</h1>
                      <div className="grid grid-cols-2 gap-4">
                        <DashboardCardAcademic title={"IPK"} number={grafikData.ipk} color={"text-red-700"} />
                        <DashboardCardAcademic
                            title={"IPS"}
                            number={grafikData.ips[grafikData.ips.length - 1] || 0}
                            color=""
                        />
                        <DashboardCardAcademic title={"Jumlah MK Komulatif"} number={grafikData.mataKuliahKumulatif} color="" />
                        <DashboardCardAcademic title={"Jumlah SKS Komulatif"} number={grafikData.sksKumulatif} color="" />
                      </div>
                    </div>
                  </>
              )}

              <div className="space-y-4">
                <h1 className="font-semibold md:p-0 p-2">Pengumuman</h1>
                <div className="p-8 bg-white shadow-md rounded-md space-y-6">
                  {/* 3. Add loading and error handling */}
                  {isLoadingPengumuman && <div>Loading announcements...</div>}
                  {isErrorPengumuman && <div style={{ color: 'red' }}>Failed to load announcements.</div>}

                  {/* 4. Map over the fetched data */}
                  {pengumumanResponse?.data.map((item) => (
                      <DashboardAnnouncementCard
                          key={item.id}
                          title={item.judul}
                          description={item.isi}
                          // Note: The API does not provide a date for each announcement.
                          // You may need to adjust the DashboardAnnouncementCard component
                          // or request this field from the backend.
                          date={""}
                      />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
  );
};

export default Dashboard;