import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import Biodata from "../../../components/biodata/Biodata";
import { useTranscript } from "../../../hooks/mahasiswa/useTranscript";
import { ITranscriptCourse } from "../../../types/mahasiswa.types";

const TranscriptGrade = () => {
  const { transcriptData, isLoading, isError } = useTranscript();

  if (isLoading) {
    return (
      <MainLayout isGreeting={false} titlePage={"Transkrip"}>
        <p className="text-center p-4">Loading transcript...</p>
      </MainLayout>
    );
  }

  if (isError) {
    return (
      <MainLayout isGreeting={false} titlePage={"Transkrip"}>
        <p className="text-center p-4 text-red-500">
          Failed to load transcript data.
        </p>
      </MainLayout>
    );
  }

  return (
    <MainLayout isGreeting={false} titlePage={"Transkrip"}>
      <div className="w-full bg-white min-h-screen py-4 rounded-sm border-t-2 border-primary-yellow space-y-4">
        <Biodata showLine={false} />
        <InfoAlert />
        {transcriptData && (
          <TranscriptGradeTable
            courses={transcriptData.rincianKrsDto}
            totalSks={transcriptData.totalSks}
            ipk={transcriptData.ipk}
          />
        )}
      </div>
    </MainLayout>
  );
};

const TranscriptGradeTable = ({
  courses,
  totalSks,
  ipk,
}: {
  courses: ITranscriptCourse[];
  totalSks: number;
  ipk: number;
}) => {
  const totalBobot = courses.reduce(
    (sum, item) => sum + item.jumlahAngkaMutu,
    0
  );

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-gray-500">
        <thead className="bg-primary-green text-white">
          <tr>
            <th className="border border-gray-500 p-5 font-semibold">No</th>
            <th className="border border-gray-500 p-5 font-semibold">Kode MK</th>
            <th className="border border-gray-500 p-5 font-semibold">Nama Mata Kuliah</th>
            {/* --- Column Added Back --- */}
            <th className="border border-gray-500 p-5 font-semibold">Semester</th>
            <th className="border border-gray-500 p-5 font-semibold">SKS</th>
            <th className="border border-gray-500 p-5 font-semibold">Grade</th>
            <th className="border border-gray-500 p-5 font-semibold">Nilai Mutu</th>
            <th className="border border-gray-500 p-5 font-semibold">Bobot</th>
          </tr>
        </thead>
        <tbody className="border-b-4 border-gray-700">
          {courses.map((item, index) => (
            <tr key={item.kodeMataKuliah} className="text-center bg-gray-50">
              <td className="border border-gray-500 font-semibold px-4 py-2">
                {index + 1}
              </td>
              <td className="border border-gray-500 font-semibold px-4 py-2">
                {item.kodeMataKuliah}
              </td>
              <td className="border text-left border-gray-500 font-semibold px-4 py-2">
                {item.namaMataKuliah}
              </td>
              <td className="border border-gray-500 font-semibold px-4 py-2">
                {item.semester}
              </td>
              <td className="border border-gray-500 font-semibold px-4 py-2">
                {item.sks}
              </td>
              <td className="border border-gray-500 font-semibold px-4 py-2">
                {item.hurufMutu}
              </td>
              <td className="border border-gray-500 font-semibold px-4 py-2">
                {item.angkaMutu.toFixed(2)}
              </td>
              <td className="border border-gray-500 font-semibold px-4 py-2">
                {item.jumlahAngkaMutu.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-bold bg-gray-100">
            <td colSpan={4} className="border border-gray-500 px-4 py-2 text-start">
              Total
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center">
              {totalSks}
            </td>
            <td className="border border-gray-500 px-4 py-2"></td>
            <td className="border border-gray-500 px-4 py-2"></td>
            <td className="border border-gray-500 px-4 py-2 text-center">
              {totalBobot.toFixed(2)}
            </td>
          </tr>
          <tr className="font-bold bg-gray-100">
            <td colSpan={7} className="border border-gray-500 px-4 py-2 text-start">
              Indeks Prestasi Kumulatif
            </td>
            <td className="border border-gray-500 px-4 py-2 text-center">
              {ipk.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

const InfoAlert = () => {
  return (
    <div className="bg-green-100 text-green-700 p-4 mx-4 rounded-sm text-sm">
      Ini adalah transkrip nilai final Anda yang telah divalidasi.
    </div>
  );
};

export default TranscriptGrade;