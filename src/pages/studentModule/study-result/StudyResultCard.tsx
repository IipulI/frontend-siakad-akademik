import React from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import Biodata from "../../../components/biodata/Biodata";
import { useStudyResults } from "../../../hooks/mahasiswa/useStudyResults";
import { IKhsCourse } from "../../../types/mahasiswa.types";

const StudyResultCard = () => {
  const {
    periods,
    selectedPeriod,
    setSelectedPeriod,
    khsData,
    isLoading,
    isError, // This will now only be true for non-404 errors
  } = useStudyResults();

  return (
      <MainLayout isGreeting={false} titlePage={"Kartu Hasil Studi"}>
        <div className="w-full bg-white min-h-screen py-4 rounded-sm border-t-2 border-primary-yellow space-y-4">
          <Biodata showLine={false} />

          <div className="flex justify-start space-x-2 border p-3 items-center">
            <p className="bg-white border-2 p-1 px-1.5 text-center rounded font-semibold text-primary-green">
              Periode
            </p>
            <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white px-2 text-gray-500 p-1 rounded border-2 text-center cursor-pointer"
            >
              <option value="" disabled>
                -- Pilih Periode --
              </option>
              {periods?.map((period) => (
                  <option key={period.id} value={period.namaPeriode}>
                    {period.namaPeriode}
                  </option>
              ))}
            </select>
          </div>

          {/* Loading state */}
          {isLoading && selectedPeriod && (
              <p className="text-center p-4">Loading study results...</p>
          )}

          {/* Critical error state (will not trigger on 404) */}
          {isError && (
              <p className="text-center p-4 text-red-500">
                An unexpected error occurred. Please try again later.
              </p>
          )}

          {/* Render the table if a period is selected and it's not a critical error */}
          {selectedPeriod && !isError && (
              <StudyResultCardTable
                  // If khsData is null (from a 404), pass an empty array
                  data={khsData?.rincianKrsDto || []}
                  ips={khsData?.ips}
                  periode={selectedPeriod}
              />
          )}
        </div>
      </MainLayout>
  );
};

const StudyResultCardTable = ({
                                data,
                                ips,
                                periode,
                              }: {
  data: IKhsCourse[];
  ips?: number;
  periode: string;
}) => {
  const totalSKS = data.reduce((sum, item) => sum + (item.sks || 0), 0);

  return (
      <div className="overflow-x-auto p-4">
        <table className="min-w-full border border-gray-500">
          <thead className="bg-primary-green text-white">
          <tr>
            <th colSpan={9} className="text-center text-lg font-semibold p-2">
              Periode {periode}
            </th>
          </tr>
          <tr>
            <th className="border border-gray-500 font-semibold px-4 py-2">No</th>
            <th className="border border-gray-500 font-semibold px-4 py-2">Kode MK</th>
            <th className="border border-gray-500 font-semibold px-4 py-2">Nama Mata Kuliah</th>
            <th className="border border-gray-500 font-semibold px-4 py-2">SKS</th>
            <th className="border border-gray-500 font-semibold px-4 py-2">Nilai Mutu</th>
            <th className="border border-gray-500 font-semibold px-4 py-2">Bobot</th>
            <th className="border border-gray-500 font-semibold px-4 py-2">Nilai</th>
            <th className="border border-gray-500 font-semibold px-4 py-2">Keterangan</th>
            <th className="border border-gray-500 font-semibold px-4 py-2">Transkrip</th>
          </tr>
          </thead>
          <tbody>
          {data.length > 0 ? (
              data.map((item, index) => (
                  <tr key={item.kodeMataKuliah} className="text-center bg-gray-50">
                    <td className="border border-gray-500 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-500 px-4 py-2">{item.kodeMataKuliah}</td>
                    <td className="border border-gray-500 px-4 py-2 text-left">{item.namaMataKuliah}</td>
                    <td className="border border-gray-500 px-4 py-2">{item.sks}</td>
                    <td className="border border-gray-500 px-4 py-2">{item.angkaMutu}</td>
                    <td className="border border-gray-500 px-4 py-2">{item.jumlahAngkaMutu}</td>
                    <td className="border border-gray-500 px-4 py-2">{item.hurufMutu}</td>
                    <td className="border border-gray-500 px-4 py-2">-</td>
                    <td className="border border-gray-500 px-4 py-2">-</td>
                  </tr>
              ))
          ) : (
              // This message now correctly displays for 404 "Not Found" errors
              <tr>
                <td colSpan={9} className="text-center p-4 border">
                  Hasil studi tidak ditemukan untuk periode ini.
                </td>
              </tr>
          )}
          </tbody>
          <tfoot>
          <tr className="font-bold bg-gray-100">
            <td colSpan={3} className="border border-gray-500 font-semibold px-4 py-2 text-left">
              Total SKS
            </td>
            <td className="border border-gray-500 font-semibold px-4 py-2 text-center">
              {totalSKS}
            </td>
            <td colSpan={5} className="border border-gray-500"></td>
          </tr>
          <tr className="font-bold bg-gray-100">
            <td colSpan={3} className="border border-gray-500 font-semibold px-4 py-2 text-left">
              Indeks Prestasi Semester
            </td>
            <td className="border border-gray-500 font-semibold px-4 py-2 text-center">
              {ips?.toFixed(2) ?? "-"}
            </td>
            <td colSpan={5} className="border border-gray-500"></td>
          </tr>
          </tfoot>
        </table>
      </div>
  );
};

export default StudyResultCard;