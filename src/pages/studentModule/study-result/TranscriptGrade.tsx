import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import Biodata from "../../../components/biodata/Biodata";

const TranscriptGrade = () => {
  const data = [
    {
      kodeMK: "TIF101",
      namaMK: "Dasar Pemrograman",
      sks: 3,
      nilai: "A",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF102",
      namaMK: "Matematika Diskrit",
      sks: 2,
      nilai: "B",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF103",
      namaMK: "Struktur Data",
      sks: 3,
      nilai: "AB",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF104",
      namaMK: "Sistem Operasi",
      sks: 3,
      nilai: "BC",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF105",
      namaMK: "Basis Data",
      sks: 3,
      nilai: "A",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF106",
      namaMK: "Jaringan Komputer",
      sks: 3,
      nilai: "B",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF107",
      namaMK: "Pemrograman Web",
      sks: 2,
      nilai: "AB",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF108",
      namaMK: "Analisis Algoritma",
      sks: 3,
      nilai: "A",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF109",
      namaMK: "Metode Numerik",
      sks: 2,
      nilai: "BC",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF110",
      namaMK: "Statistika",
      sks: 2,
      nilai: "B",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF201",
      namaMK: "Kecerdasan Buatan",
      sks: 3,
      nilai: "AB",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF202",
      namaMK: "Sistem Informasi",
      sks: 3,
      nilai: "A",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF203",
      namaMK: "Pemrograman Mobile",
      sks: 3,
      nilai: "A",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF204",
      namaMK: "Etika Profesi TI",
      sks: 2,
      nilai: "A",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF205",
      namaMK: "Rekayasa Perangkat Lunak",
      sks: 3,
      nilai: "B",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF206",
      namaMK: "Manajemen Proyek TI",
      sks: 3,
      nilai: "AB",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF207",
      namaMK: "User Interface & Experience",
      sks: 2,
      nilai: "A",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF208",
      namaMK: "Keamanan Informasi",
      sks: 3,
      nilai: "A",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF209",
      namaMK: "Pengolahan Citra",
      sks: 2,
      nilai: "BC",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF210",
      namaMK: "Cloud Computing",
      sks: 3,
      nilai: "B",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF301",
      namaMK: "Big Data",
      sks: 3,
      nilai: "A",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF302",
      namaMK: "Machine Learning",
      sks: 3,
      nilai: "AB",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF303",
      namaMK: "DevOps",
      sks: 3,
      nilai: "B",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF304",
      namaMK: "IoT (Internet of Things)",
      sks: 3,
      nilai: "BC",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF305",
      namaMK: "Manajemen Data",
      sks: 2,
      nilai: "C",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
    {
      kodeMK: "TIF306",
      namaMK: "Blockchain Technology",
      sks: 2,
      nilai: "A",
      keterangan: "Dosen",
      transkrip: true,
      semester: "1",
    },
  ];

  const convertNilai = (nilai) => {
    switch (nilai) {
      case "A":
        return 4.0;
      case "AB":
        return 3.5;
      case "B":
        return 3.0;
      case "BC":
        return 2.5;
      case "C":
        return 2.0;
      case "D":
        return 1.0;
      case "E":
        return 0.0;
      default:
        return null;
    }
  };

  const enrichedData = data.map((item) => {
    const nilaiMutu = convertNilai(item.nilai);
    const bobot = nilaiMutu !== null ? nilaiMutu * item.sks : null;
    return {
      ...item,
      nilaiMutu,
      bobot,
    };
  });

  return (
    <MainLayout isGreeting={false} titlePage={"Transkrip"} className="">
      <div className="w-full bg-white min-h-screen py-4 rounded-sm border-t-2 border-primary-yellow space-y-4">
        <Biodata showLine={false} />
        <InfoAlert />
        <TranscriptGradeTable data={enrichedData} periode={"2023 Genap"} />
      </div>
    </MainLayout>
  );
};

const TranscriptGradeTable = ({ data, periode }) => {
  const totalSKS = data.reduce((sum, item) => sum + (item.sks || 0), 0);
  const totalBobot = data.reduce((sum, item) => sum + (item.bobot || 0), 0);
  const ipk = totalSKS ? (totalBobot / totalSKS).toFixed(2) : "-";

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-500">
        <thead className="bg-primary-green text-white">
          <tr>
            <th className="border border-gray-500 p-5 font-semibold">No</th>
            <th className="border border-gray-500 p-5 font-semibold">
              Kode MK
            </th>
            <th className="border border-gray-500 p-5 font-semibold">
              Nama Mata Kuliah
            </th>
            <th className="border border-gray-500 p-5 font-semibold">
              Semester
            </th>
            <th className="border border-gray-500 p-5 font-semibold">SKS</th>
            <th className="border border-gray-500 p-5 font-semibold">Grade</th>
            <th className="border border-gray-500 p-5 font-semibold">
              Nilai Mutu
            </th>
            <th className="border border-gray-500 p-5 font-semibold">Bobot</th>
          </tr>
        </thead>
        <tbody className="border-b-4 border-gray-700">
          {data.map((item, index) => (
            <tr key={index} className="text-center bg-gray-50">
              <td className="border border-gray-500 font-semibold px-4 py-2">
                {index + 1}
              </td>
              <td className="border border-gray-500 font-semibold px-4 py-2">
                {item.kodeMK}
              </td>
              <td className="border text-left border-gray-500 font-semibold px-4 py-2">
                {item.namaMK}
              </td>
              <td className="border border-gray-500 font-semibold px-4 py-2">
                {item.semester}
              </td>
              <td className="border border-gray-500 font-semibold px-4 py-2">
                {item.sks}
              </td>
              <td className="border border-gray-500 font-semibold px-4 py-2">
                {item.nilai}
              </td>
              <td className="border border-gray-500 font-semibold px-4 py-2">
                {item.nilaiMutu ?? "-"}
              </td>
              <td className="border border-gray-500 font-semibold px-4 py-2">
                {item.bobot ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-bold bg-gray-100">
            <td
              colSpan={4}
              className="border border-gray-500 px-4 py-2 text-start"
            >
              Total
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center">
              {totalSKS}
            </td>
            <td className="border border-gray-500 px-4 py-2"></td>
            <td className="border border-gray-500 px-4 py-2"></td>
            <td className="border border-gray-500 px-4 py-2 text-center">
              {totalBobot.toFixed(2)}
            </td>
          </tr>
          <tr className="font-bold bg-gray-100">
            <td
              colSpan={7}
              className="border border-gray-500 px-4 py-2 text-start"
            >
              Indeks Prestasi
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center">
              {ipk}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

const InfoAlert = () => {
  return (
    <div className="bg-green-100 text-green-700 p-4 px-6 rounded-sm text-sm">
      KRS ini <strong>Telah Divalidasi</strong> dan tidak bisa diubah. Untuk
      membatalkan validasi KRS silakan menghubungi Pembimbing Akademik terkait
    </div>
  );
};

export default TranscriptGrade;
