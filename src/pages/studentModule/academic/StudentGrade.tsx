import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import Biodata from "../../../components/Biodata";

const StudentGrade = () => {
  //   const tableHead = [
  //     "No",
  //     "Kode MK",
  //     "Nama Mata Kuliah",
  //     "Kelas",
  //     "SKS",
  //     "Hari",
  //     "Jam",
  //     "Ruangan",
  //     "Dosen Pengajar",
  //   ];
  //   const data = [
  //     {
  //       no: 1,
  //       kodeMk: "TIF302",
  //       mataKuliah: "Metode Penelitian",
  //       kelas: "REG_B",
  //       sks: 2,
  //       hari: "Kamis",
  //       jam: "09.00-11.00",
  //       ruangan: "206",
  //       dosen: "Safaruddin Hidayat S.Kom M.Kom",
  //     },
  //     {
  //       no: 2,
  //       kodeMk: "TIF304",
  //       mataKuliah: "Kapita Selekta",
  //       kelas: "REG_B",
  //       sks: 2,
  //       hari: "Jumat",
  //       jam: "13.00-15.00",
  //       ruangan: "203",
  //       dosen: "Dewi Primatasari S.Si",
  //     },
  //     {
  //       no: 3,
  //       kodeMk: "TIF306",
  //       mataKuliah: "Pemrograman Web",
  //       kelas: "REG_B",
  //       sks: 3,
  //       hari: "Senin",
  //       jam: "10.00-12.00",
  //       ruangan: "204",
  //       dosen: "Safaruddin Hidayat S.Kom M.Kom",
  //     },
  //     {
  //       no: 4,
  //       kodeMk: "TIF308",
  //       mataKuliah: "Jaringan Komputer",
  //       kelas: "REG_B",
  //       sks: 3,
  //       hari: "Selasa",
  //       jam: "08.00-10.00",
  //       ruangan: "301",
  //       dosen: "Safaruddin Hidayat S.Kom M.Kom",
  //     },
  //     {
  //       no: 5,
  //       kodeMk: "TIF310",
  //       mataKuliah: "Basis Data",
  //       kelas: "REG_B",
  //       sks: 3,
  //       hari: "Rabu",
  //       jam: "10.00-12.00",
  //       ruangan: "303",
  //       dosen: "Safaruddin Hidayat S.Kom M.Kom",
  //     },
  //     {
  //       no: 6,
  //       kodeMk: "TIF312",
  //       mataKuliah: "Keamanan Informasi",
  //       kelas: "REG_B",
  //       sks: 2,
  //       hari: "Kamis",
  //       jam: "13.00-15.00",
  //       ruangan: "207",
  //       dosen: "Safaruddin Hidayat S.Kom M.Kom",
  //     },
  //     {
  //       no: 7,
  //       kodeMk: "TIF314",
  //       mataKuliah: "Machine Learning",
  //       kelas: "REG_B",
  //       sks: 3,
  //       hari: "Jumat",
  //       jam: "08.00-10.00",
  //       ruangan: "208",
  //       dosen: "Safaruddin Hidayat S.Kom M.Kom",
  //     },
  //     {
  //       no: 8,
  //       kodeMk: "TIF316",
  //       mataKuliah: "RPL Lanjut",
  //       kelas: "REG_B",
  //       sks: 3,
  //       hari: "Senin",
  //       jam: "13.00-15.00",
  //       ruangan: "209",
  //       dosen: "Fitrah Satrya Fajar Kusumah S.Kom M.Kom",
  //     },
  //     {
  //       no: 9,
  //       kodeMk: "TIF318",
  //       mataKuliah: "Kecerdasan Buatan",
  //       kelas: "REG_B",
  //       sks: 3,
  //       hari: "Selasa",
  //       jam: "10.00-12.00",
  //       ruangan: "302",
  //       dosen: "Safaruddin Hidayat S.Kom M.Kom",
  //     },
  //     {
  //       no: 10,
  //       kodeMk: "TIF320",
  //       mataKuliah: "Cloud Computing",
  //       kelas: "REG_B",
  //       sks: 2,
  //       hari: "Rabu",
  //       jam: "08.00-10.00",
  //       ruangan: "206",
  //       dosen: "Safaruddin Hidayat S.Kom M.Kom",
  //     },
  //   ];
  const data = [
    {
      kodeMK: "TIF341",
      namaMK: "Sistem Pakar dan Penunjang Keputusan",
      nilai: 83.5,
    },
    {
      kodeMK: "TIF321",
      namaMK: "Pemrograman Perangkat Bergerak + Praktikum",
      nilai: 77.45,
    },
    { kodeMK: "TIF391", namaMK: "Komputer dan Masyarakat", nilai: 80.75 },
    { kodeMK: "TIF343", namaMK: "User Interface and Experience", nilai: 86.55 },
    {
      kodeMK: "TIF311",
      namaMK: "Keamanan Informasi + Praktikum",
      nilai: 76.75,
    },
    {
      kodeMK: "TIF361",
      namaMK: "Rekayasa Perangkat Lunak Lanjut + Praktikum",
      nilai: 88.0,
    },
    {
      kodeMK: "TIF363",
      namaMK: "Verifikasi dan Validasi Perangkat Lunak",
      nilai: 78.05,
    },
    {
      kodeMK: "TIF192",
      namaMK: "Bahasa Inggris Teknik + Praktikum",
      nilai: 79.2,
    },
  ];
  return (
    <MainLayout isGreeting={false} titlePage={"Nilai Mahasiswa"} className="">
      <div className="w-full bg-white min-h-screen py-4 rounded-sm border-t-2 border-primary-yellow space-y-4">
        <Biodata showLine={false}/>
        <div className="flex justify-start space-x-2 border p-3 items-center">
          <button className="bg-white border-2 p-1 px-1.5 text-center rounded font-semibold text-primary-green">
            Periode
          </button>
          <select className="bg-white px-2 text-gray-500 p-1 rounded border-2 text-center cursor-pointer">
            <option value="">2024 Ganjil </option>
          </select>
        </div>

        {/* <Table tableHead={tableHead} data={data} /> */}

        {/* Tabelnya di modified, soalnya fieldnya ga sesuai. btw komponen ini ada di bawah :) */}
        <StudentGradeTable data={data} />
      </div>
    </MainLayout>
  );
};

const StudentGradeTable = ({ data }) => {
  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-primary-green border border-black/50 text-white">
          <tr>
            <th rowSpan={2} className="border border-gray-300 font-semibold px-4 py-2">
              Kurikulum
            </th>
            <th rowSpan={2} className="border border-gray-300 font-semibold px-4 py-2">
              Kode MK
            </th>
            <th rowSpan={2} className="border border-gray-300 font-semibold px-4 py-2">
              Nama Mata Kuliah
            </th>
            <th rowSpan={2} className="border border-gray-300 font-semibold px-4 py-2">
              Nama Kelas
            </th>
            <th colSpan={3} className="border border-gray-300 font-semibold px-4 py-2">
              SKS
            </th>
            <th rowSpan={2} className="border border-gray-300 font-semibold px-4 py-2">
              Nilai
            </th>
          </tr>
          <tr>
            <th className="border border-gray-300 font-semibold px-4 py-2">Komponen</th>
            <th className="border border-gray-300 font-semibold px-4 py-2">%</th>
            <th className="border border-gray-300 font-semibold px-4 py-2">Nilai</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="text-center bg-gray-50">
              <td className="border border-gray-300 font-semibold px-4 py-2">2021</td>
              <td className="border border-gray-300 font-semibold px-4 py-2">
                {item.kodeMK}
              </td>
              <td className="border border-gray-300 font-semibold px-4 py-2">
                {item.namaMK}
              </td>
              <td className="border border-gray-300 font-semibold px-4 py-2">REG_B</td>
              <td className="border border-gray-300 font-semibold px-4 py-2"></td>
              <td className="border border-gray-300 font-semibold px-4 py-2"></td>
              <td className="border border-gray-300 font-semibold px-4 py-2"></td>
              <td className="border border-gray-300 font-semibold px-4 py-2">{item.nilai}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentGrade;
