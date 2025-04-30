import React from "react";
import MainLayout from "../../components/layouts/MainLayout";
import Biodata from "../../components/Biodata";

const ThisWeek = () => {
  const jadwalMingguan = [
    {
      tanggal: "Senin, 07 April 2025",
      dataKuliah: [],
    },
    {
      tanggal: "Selasa, 08 April 2025",
      dataKuliah: [
        {
          mulai: "13:00",
          selesai: "14:40",
          jenis: "Kuliah",
          kuliah: "TIF306 - Metode Penelitian (REG_B)",
          materi: "Topik-topik penelitian terkini bidang engineering",
          ruang: "Ruang Kuliah Lantai 2 No 202",
          pengajar: "SAFARUDDIN HIDAYAT AL IKHSAN, S.Kom., M.Kom",
        },
      ],
    },
    {
      tanggal: "Rabu, 09 April 2025",
      dataKuliah: [
        {
          mulai: "13:00",
          selesai: "14:40",
          jenis: "Kuliah",
          kuliah: "TIF362 - E-Commerce (web) (REG_B)",
          materi: "",
          ruang: "Ruang Kuliah Lantai 3 No 308",
          pengajar: "Ina Novianti, S.ST., M.M.S.I",
        },
      ],
    },
    {
      tanggal: "Kamis, 10 April 2025",
      dataKuliah: [
        {
          mulai: "09:40",
          selesai: "10:40",
          jenis: "Kuliah",
          kuliah: "TIF302 - Kapita Selekta (REG_B)",
          materi: "",
          ruang: "Ruang Kuliah Lantai 2 No 206",
          pengajar: "DEWI PRIMASARI, S.Si., M.M",
        },
        {
          mulai: "13:00",
          selesai: "14:40",
          jenis: "Kuliah",
          kuliah: "TIF322 - Teknologi Multimedia + Praktikum (REG_B)",
          materi: "",
          ruang: "Ruang Kuliah Lantai 2 No 206",
          pengajar: "HERSANTO FAJRI, S.Ds.,M.M.D.",
        },
      ],
    },
    {
      tanggal: "Jumat, 11 April 2025",
      dataKuliah: [
        {
          mulai: "08:00",
          selesai: "09:40",
          jenis: "Kuliah",
          kuliah: "TIF304 - Manajemen Proyek (REG_B)",
          materi: "",
          ruang: "Ruang Kuliah Lantai 3 No 302",
          pengajar: "FITRAH SATRYA FAJAR KUSUMAH",
        },
        {
          mulai: "13:00",
          selesai: "17:40",
          jenis: "Kuliah",
          kuliah: "TIF394 - Proyek Perangkat Lunak Bidang Keilmuan (REG_B)",
          materi: "",
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
      <td className="p-2 border border-gray-300">{materi || "-"}</td>
      <td className="p-2 border border-gray-300">{ruang}</td>
      <td className="p-2 border border-gray-300">{pengajar}</td>
      <td className="p-2 border border-gray-300 text-center">
        <button className="text-blue-500 hover:underline">❔</button>
      </td>
    </tr>
  );

  const JadwalHari = ({ tanggal, dataKuliah }) => (
    <div className="my-6 border rounded-lg shadow">
      <div className="bg-white border-t-4 border-teal-600 px-4 py-2 font-semibold">
        {tanggal}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-400">
          <thead className="bg-green-50">
            <tr>
              <th className="p-2 border border-gray-300">Mulai</th>
              <th className="p-2 border border-gray-300">Selesai</th>
              <th className="p-2 border border-gray-300">Jenis</th>
              <th className="p-2 border border-gray-300">Kuliah</th>
              <th className="p-2 border border-gray-300">Materi</th>
              <th className="p-2 border border-gray-300">Ruang</th>
              <th className="p-2 border border-gray-300">Pengajar</th>
              <th className="p-2 border border-gray-300">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataKuliah.length > 0 ? (
              dataKuliah.map((item, index) => (
                <JadwalKuliah key={index} {...item} />
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center p-4 text-gray-500 border border-gray-300"
                >
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
    <MainLayout isGreeting={false} titlePage={""} className="">
      <Biodata />
      <div className="mt-4">
        {jadwalMingguan.map((hari, idx) => (
          <JadwalHari key={idx} {...hari} />
        ))}
      </div>
    </MainLayout>
  );
};

export default ThisWeek;
