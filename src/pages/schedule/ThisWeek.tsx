import React from "react";
import MainLayout from "../../components/layouts/MainLayout";
import Biodata from "../../components/Biodata";

const ThisWeek = () => {
  const jadwalMingguan = [
    {
      tanggal: "Senin",
      dataKuliah: [],
    },
    {
      tanggal: "Selasa",
      dataKuliah: [
        {
          mulai: "13:00",
          selesai: "14:40",
          jenis: "Kuliah",
          kuliah: "TIF306 - Metode Penelitian (REG_B)",
          ruang: "Ruang Kuliah Lantai 2 No 202",
          pengajar: "SAFARUDDIN HIDAYAT AL IKHSAN, S.Kom., M.Kom",
        },
      ],
    },
    {
      tanggal: "Rabu",
      dataKuliah: [
        {
          mulai: "13:00",
          selesai: "14:40",
          jenis: "Kuliah",
          kuliah: "TIF362 - E-Commerce (web) (REG_B)",
          ruang: "Ruang Kuliah Lantai 3 No 308",
          pengajar: "Ina Novianti, S.ST., M.M.S.I",
        },
      ],
    },
    {
      tanggal: "Kamis",
      dataKuliah: [
        {
          mulai: "09:40",
          selesai: "10:40",
          jenis: "Kuliah",
          kuliah: "TIF302 - Kapita Selekta (REG_B)",
          ruang: "Ruang Kuliah Lantai 2 No 206",
          pengajar: "DEWI PRIMASARI, S.Si., M.M",
        },
        {
          mulai: "13:00",
          selesai: "14:40",
          jenis: "Kuliah",
          kuliah: "TIF322 - Teknologi Multimedia + Praktikum (REG_B)",
          ruang: "Ruang Kuliah Lantai 2 No 206",
          pengajar: "HERSANTO FAJRI, S.Ds.,M.M.D.",
        },
      ],
    },
    {
      tanggal: "Jumat",
      dataKuliah: [
        {
          mulai: "08:00",
          selesai: "09:40",
          jenis: "Kuliah",
          kuliah: "TIF304 - Manajemen Proyek (REG_B)",
          ruang: "Ruang Kuliah Lantai 3 No 302",
          pengajar: "FITRAH SATRYA FAJAR KUSUMAH",
        },
        {
          mulai: "13:00",
          selesai: "17:40",
          jenis: "Kuliah",
          kuliah: "TIF394 - Proyek Perangkat Lunak Bidang Keilmuan (REG_B)",
          ruang: "Ruang Kuliah Lantai 3 No 302",
          pengajar: "FITRAH SATRYA FAJAR KUSUMAH",
        },
      ],
    },
  ];

  const JadwalKuliah = ({
    mulai,
    selesai,
    jenis,
    kuliah,
    materi,
    ruang,
    pengajar,
  }) => (
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
              <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">
                Mulai
              </th>
              <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">
                Selesai
              </th>
              <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">
                Jenis
              </th>
              <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">
                Kuliah
              </th>

              <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">
                Ruang
              </th>
              <th className="p-4 bg-primary-green text-white font-semibold border border-gray-300">
                Pengajar
              </th>
            </tr>
          </thead>
          <tbody className="text-black font-semibold">
            {dataKuliah.length > 0 ? (
              dataKuliah.map((item, index) => (
                <JadwalKuliah key={index} {...item} />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center p-4 border-gray-300">
                  Tidak ada jadwal kuliah pada hari ini
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <MainLayout isGreeting={false} titlePage={"Jadwal Minggu Ini"} className="">
      <Biodata showLine={false} />
      <div className="mt-4">
        {jadwalMingguan.map((hari, idx) => (
          <JadwalHari key={idx} {...hari} />
        ))}
      </div>
    </MainLayout>
  );
};

export default ThisWeek;
