import React from "react";
import MainLayout from "../../components/layouts/MainLayout";
import Biodata from "../../components/Biodata";

const StudyResultCard = () => {
  // Data dummy (nantinya ini akan fetch dari API)
  const data = [
    {
      kodeMK: "TIF341",
      namaMK: "Sistem Pakar dan Penunjang Keputusan",
      sks: 3,
      nilai: "A",
      keterangan: "Dosen",
      transkrip: true,
    },
    {
      kodeMK: "TIF321",
      namaMK: "Pemrograman Perangkat Bergerak + Praktikum",
      sks: 3,
      nilai: "A",
      keterangan: "Dosen",
      transkrip: true,
    },
    {
      kodeMK: "TIF391",
      namaMK: "Komputer dan Masyarakat",
      sks: 2,
      nilai: "A",
      keterangan: "Dosen",
      transkrip: true,
    },
    {
      kodeMK: "TIF343",
      namaMK: "User Interface and Experience",
      sks: 2,
      nilai: "A",
      keterangan: "Dosen",
      transkrip: true,
    },
    {
      kodeMK: "TIF311",
      namaMK: "Keamanan Informasi + Praktikum",
      sks: 3,
      nilai: "A",
      keterangan: "Dosen",
      transkrip: true,
    },
    {
      kodeMK: "TIF361",
      namaMK: "Rekayasa Perangkat Lunak Lanjut + Praktikum",
      sks: 3,
      nilai: "A",
      keterangan: "Dosen",
      transkrip: true,
    },
    {
      kodeMK: "TIF363",
      namaMK: "Verifikasi dan Validasi Perangkat Lunak",
      sks: 2,
      nilai: "A",
      keterangan: "Dosen",
      transkrip: true,
    },
    {
      kodeMK: "TIF192",
      namaMK: "Bahasa Inggris Teknik + Praktikum",
      sks: 3,
      nilai: "A",
      keterangan: "Dosen",
      transkrip: true,
    },
  ];

  // Fungsi konversi nilai ke angka mutu
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
        return null; // Jika belum ada nilai
    }
  };

  // Enrich data dengan nilaiMutu dan bobot
  const enrichedData = data.map((item) => {
    const nilaiMutu = convertNilai(item.nilai);
    const bobot = nilaiMutu !== null ? nilaiMutu * item.sks : null;
    return {
      ...item,
      nilaiMutu,
      bobot,
    };
  });

  const totalSKS = enrichedData.reduce((sum, item) => sum + (item.sks || 0), 0);

  return (
    <MainLayout isGreeting={false} titlePage={"Kartu Hasil Studi"} className="">
      <div className="w-full bg-white min-h-screen py-2 rounded-2xl border-t-2 border-primary-yellow space-y-4">
        <Biodata />
        <div className="flex justify-start space-x-2 border p-4 items-center">
          <button className="bg-white border-2 w-[100px] text-center rounded text-lg font-semibold text-primary-green">
            Periode
          </button>
          <select className="bg-white w-[150px] py-1 rounded border-2 text-center text-primary-brown cursor-pointer">
            <option value="">2023 Genap</option>
          </select>
        </div>

        <StudyResultCardTable
          data={enrichedData}
          totalSKS={totalSKS}
          periode={"2023 Genap"}
        />
      </div>
    </MainLayout>
  );
};

const StudyResultCardTable = ({ data, totalSKS, periode }) => {
  const totalBobot = data.reduce((acc, item) => acc + (item.bobot ?? 0), 0);
  const ips = totalSKS ? (totalBobot / totalSKS).toFixed(2) : "-";

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-primary-green text-white">
          <tr>
            <th colSpan={9} className="text-center text-lg font-bold p-2">
              Periode {periode}
            </th>
          </tr>
          <tr>
            <th className="border border-gray-300 px-4 py-2">No</th>
            <th className="border border-gray-300 px-4 py-2">Kode MK</th>
            <th className="border border-gray-300 px-4 py-2">
              Nama Mata Kuliah
            </th>
            <th className="border border-gray-300 px-4 py-2">SKS</th>
            <th className="border border-gray-300 px-4 py-2">Nilai Mutu</th>
            <th className="border border-gray-300 px-4 py-2">Bobot</th>
            <th className="border border-gray-300 px-4 py-2">Nilai</th>
            <th className="border border-gray-300 px-4 py-2">Keterangan</th>
            <th className="border border-gray-300 px-4 py-2">Transkrip</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="text-center bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">
                {item.kodeMK}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.namaMK}
              </td>
              <td className="border border-gray-300 px-4 py-2">{item.sks}</td>
              <td className="border border-gray-300 px-4 py-2">
                {item.nilaiMutu ?? "-"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.bobot ?? "-"}
              </td>
              <td className="border border-gray-300 px-4 py-2">{item.nilai}</td>
              <td className="border border-gray-300 px-4 py-2 text-green-600">
                {item.keterangan}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.transkrip ? "✔️" : "-"}
              </td>
            </tr>
          ))}
          <tr className="font-bold bg-gray-100">
            <td
              colSpan={3}
              className="border border-gray-300 px-4 py-2 text-right"
            >
              Total SKS
            </td>
            <td className="border border-gray-300 px-4 py-2">{totalSKS}</td>
            <td colSpan={5} className="border border-gray-300 px-4 py-2"></td>
          </tr>
          <tr className="font-bold bg-gray-100">
            <td
              colSpan={3}
              className="border border-gray-300 px-4 py-2 text-right"
            >
              Indeks Prestasi Semester
            </td>
            <td colSpan={6} className="border border-gray-300 px-4 py-2">
              {ips}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StudyResultCard;
