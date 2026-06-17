import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import Biodata from "../../../components/biodata/Biodata";
import { useJadwal } from "../../../hooks/mahasiswa/useJadwal";
import { useActivePeriod } from "../../../hooks/usePeriodeAkademik";

const JadwalKuliah = ({ mulai, selesai, jenis, kuliah, ruang, pengajar }) => (
    <tr className="border border-gray-400">
      <td className="p-2 border border-gray-300">{mulai}</td>
      <td className="p-2 border border-gray-300">{selesai}</td>
      <td className="p-2 border border-gray-300">{jenis}</td>
      <td className="p-2 border border-gray-300">{kuliah}</td>
      <td className="p-2 border border-gray-300">{ruang}</td>
      <td className="p-2 border border-gray-300">{pengajar}</td>
    </tr>
);

const JadwalHari = ({ tanggal, dataKuliah }) => (
    <div className="my-6 rounded-lg">
      <div className="border-t-3 border-primary-yellow py-2 font-semibold">
        {tanggal}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-400">
          <thead className="bg-green-50">
          <tr>
            <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">Mulai</th>
            <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">Selesai</th>
            <th className="p-4 bg-primary-green text-white font-semibold border border-ray-300">Jenis</th>
            <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">Kuliah</th>
            <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">Ruang</th>
            <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">Pengajar</th>
          </tr>
          </thead>
          <tbody className="text-black font-semibold">
          {dataKuliah.length > 0 ? (
              dataKuliah.map((item, index) => <JadwalKuliah key={index} {...item} />)
          ) : (
              <tr>
                <td colSpan={6} className="text-center p-4 border-gray-300">
                  Tidak ada jadwal kuliah pada hari ini
                </td>
              </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
);


const ThisWeek = () => {
  // Fetch the active academic period first
  const { data: activePeriod, isLoading: isLoadingPeriod } = useActivePeriod();

  // Fetch the schedule, but only *after* we have the active period's name.
  // The hook will only run when `activePeriod?.namaPeriode` has a value.
  const {
    data: jadwalData,
    isLoading: isLoadingJadwal,
    isError,
    error,
  } = useJadwal({
    type: 'weekly',
    namaPeriode: activePeriod?.namaPeriode,
    hari: null,
  });

  // Helper function to transform API data to match the component's expected structure
  const transformJadwalData = (data: any) => {
    if (!data) return [];

    // The new response wraps the day arrays inside a `schedule` object
    const schedule = data.schedule || data;

    // Ordered list of days with their display names and potential keys in the response
    const daysMap = [
      { key: "Senin", display: "Senin" },
      { key: "Selasa", display: "Selasa" },
      { key: "Rabu", display: "Rabu" },
      { key: "Kamis", display: "Kamis" },
      { key: "Jumat", display: "Jumat" },
      { key: "Sabtu", display: "Sabtu" },
      { key: "Minggu", display: "Minggu" }
    ];

    return daysMap.map(day => {
      // Safely access either capitalized key or lowercase key
      const dayKey = schedule[day.key] ? day.key : day.key.toLowerCase();
      const list = schedule[dayKey] || [];

      return {
        tanggal: day.display,
        dataKuliah: list.map((kuliah: any) => {
          const kode = kuliah.kode || kuliah.kodeMataKuliah || "";
          const nama = kuliah.mataKuliah || kuliah.namaMataKuliah || "";
          const kelas = kuliah.kelas || "";

          return {
            mulai: kuliah.jamMulai || "",
            selesai: kuliah.jamSelesai || "",
            jenis: "Kuliah",
            kuliah: `${kode} - ${nama} (${kelas})`,
            ruang: kuliah.ruangan || "",
            pengajar: kuliah.dosen || "",
          };
        })
      };
    });
  };

  const renderContent = () => {
    // Show a loading indicator if either query is running
    if (isLoadingPeriod || isLoadingJadwal) {
      return <div className="text-center p-8">Loading...</div>;
    }

    if (isError) {
      return <div className="text-center p-8 text-red-500">Error: {error.message}</div>;
    }

    const jadwalMingguan = transformJadwalData(jadwalData);

    return (
        <div className="mt-4">
          {jadwalMingguan.map((hari, idx) => (
              <JadwalHari key={idx} {...hari} />
          ))}
        </div>
    );
  };

  return (
      <MainLayout isGreeting={false} titlePage={"Jadwal Minggu Ini"} className="">
        <Biodata showLine={false} />
        {renderContent()}
      </MainLayout>
  );
};

export default ThisWeek;