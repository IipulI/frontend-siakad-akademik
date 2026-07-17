// src/pages/studentModule/academic/History.tsx

import React from "react";
import Biodata from "../../../components/biodata/Biodata";
import MainLayout from "../../../components/layouts/MainLayout";
import { TableHistory } from "../../../components/Table";
import { LayoutGrid, Settings } from "lucide-react";
import { useKrsHistoryData } from "../../../hooks/mahasiswa/useKrsHistoryData";
import { useStudentRetakeData } from "../../../hooks/mahasiswa/useStudentRetakeData"; // Untuk biodata

export default function History() {
  const tableHead = ["No", "Kode MK", "Nama Mata Kuliah", "Kelas", "SKS", "Hari", "Jam", "Ruangan", "Dosen Pengajar"];

  // Menggunakan hook untuk data riwayat KRS
  const {
    periods,
    krsHistoryData,
    selectedPeriod,
    setSelectedPeriod,
    isLoading,
    isError
  } = useKrsHistoryData();

  // Menggunakan hook lain untuk data biodata
  const { biodata, isLoading: isLoadingBiodata } = useStudentRetakeData();

  console.log("krsHistoryData", krsHistoryData);

  // Menyiapkan data untuk tabel dari hasil hook
  const tableData = krsHistoryData?.krs.map((item, index) => ({
    no: index + 1,
    kodeMk: item?.kelasKuliah?.mataKuliah?.kode,
    mataKuliah: item?.kelasKuliah?.mataKuliah?.nama,
    kelas: item?.kelasKuliah?.nama,
    sks: item?.kelasKuliah?.mataKuliah?.totalSks,
    hari: item?.kelasKuliah?.jadwalUtama?.hari,
    jam: item?.kelasKuliah?.jadwalUtama?.jamMulai + " - " + item?.kelasKuliah?.jadwalUtama?.jamSelesai,
    ruangan: item?.kelasKuliah?.jadwalUtama?.ruangan?.nama,
    dosen: item?.kelasKuliah?.jadwalUtama?.dosen?.nama,
  })) || [];

  return (
      <MainLayout isGreeting={false} titlePage={"Riwayat KRS"} className="">
        <div className="w-full bg-white min-h-screen py-2 rounded-sm border-t-4 border-primary-yellow">
          <Biodata biodata={biodata} isLoading={isLoadingBiodata} showLine={false} />

          <div className="flex gap-4 my-4 p-3 border-2 items-center">
            <label htmlFor="periode" className="font-semibold">
              Periode Akademik
            </label>
            <select
                id="periode"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                disabled={isLoading}
                className="p-1 text-sm rounded-sm text-gray-500 w-70 border-2"
            >
              {periods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.nama || period.namaPeriode}
                  </option>
              ))}
            </select>
          </div>

          {/* Banner validasi. Untuk saat ini statis sesuai UI. Bisa dibuat dinamis jika API memberikan status validasi. */}
          <div className="w-full bg-[#D9F7DE] p-4">
            <h1 className="text-black">
              KRS ini <span className="font-semibold">Telah Divalidasi</span> dan
              tidak bisa diubah. Untuk membatalkan validasi KRS silakan
              menghubungi Pembimbing Akademik terkait.
            </h1>
          </div>

          <div className="overflow-auto">
            {isLoading ? (
                <p className="text-center p-4">Memuat riwayat KRS...</p>
            ) : isError ? (
                <p className="text-center p-4 text-red-500">Gagal memuat data.</p>
            ) : (
                <TableHistory
                    tableHead={tableHead}
                    data={tableData}
                    error=""
                    totalSks={krsHistoryData?.totalSks ?? 0}
                    batasSks={krsHistoryData?.batasSks ?? 0}
                />
            )}
          </div>
        </div>
      </MainLayout>
  );
}