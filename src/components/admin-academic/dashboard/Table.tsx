import React from "react";

const dataAngkatan = [
  {
    angkatan: "2024",
    aktif: 1660,
    cuti: 0,
    nonAktif: 577,
    menungguUkom: 0,
    tidakMemilikiAkm: 0,
    akmTidakSesuai: 0,
    total: 2237,
  },
  {
    angkatan: "2023",
    aktif: 1492,
    cuti: 0,
    nonAktif: 288,
    menungguUkom: 0,
    tidakMemilikiAkm: 2,
    akmTidakSesuai: 0,
    total: 1786,
  },
  {
    angkatan: "2022",
    aktif: 1198,
    cuti: 0,
    nonAktif: 308,
    menungguUkom: 0,
    tidakMemilikiAkm: 0,
    akmTidakSesuai: 0,
    total: 1507,
  },
  {
    angkatan: "2021",
    aktif: 755,
    cuti: 1,
    nonAktif: 384,
    menungguUkom: 0,
    tidakMemilikiAkm: 0,
    akmTidakSesuai: 0,
    total: 1141,
  },
  {
    angkatan: "2020",
    aktif: 91,
    cuti: 0,
    nonAktif: 363,
    menungguUkom: 0,
    tidakMemilikiAkm: 0,
    akmTidakSesuai: 0,
    total: 454,
  },
  {
    angkatan: "2019",
    aktif: 53,
    cuti: 51,
    nonAktif: 474,
    menungguUkom: 0,
    tidakMemilikiAkm: 0,
    akmTidakSesuai: 0,
    total: 314,
  },
];


// TABEL AKM ANGKATAN
export function TabelAKMAngkatan() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-teal-700 text-white px-4 py-3 text-center border-2 border-gray-500/70 font-semibold">
              Angkatan
            </th>
            <th className="bg-teal-700 text-white px-4 py-3 text-center border-2 border-gray-500/70 font-semibold">
              Aktif
            </th>
            <th className="bg-teal-700 text-white px-4 py-3 text-center border-2 border-gray-500/70 font-semibold">
              Cuti
            </th>
            <th className="bg-teal-700 text-white px-4 py-3 text-center border-2 border-gray-500/70 font-semibold">
              Non Aktif
            </th>
            <th className="bg-teal-700 text-white px-4 py-3 text-center border-2 border-gray-500/70 font-semibold">
              Menunggu Ukom
            </th>
            <th className="bg-teal-700 text-white px-4 py-3 text-center border-2 border-gray-500/70 font-semibold">
              Tidak Memiliki AKM
            </th>
            <th className="bg-teal-700 text-white px-4 py-3 text-center border-2 border-gray-500/70 font-semibold">
              AKM Tidak Sesuai
            </th>
            <th className="bg-teal-700 text-white px-4 py-3 text-center border-2 border-gray-500/70 font-semibold">
              TOTAL
            </th>
          </tr>
        </thead>
        <tbody>
          {dataAngkatan.map((row, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border-2 border-gray-500/70 font-semibold px-4 py-2 text-center">
                {row.angkatan}
              </td>
              <td className="border-2 border-gray-500/70 font-semibold px-4 py-2 text-center">
                {row.aktif}
              </td>
              <td className="border-2 border-gray-500/70 font-semibold px-4 py-2 text-center">
                {row.cuti}
              </td>
              <td className="border-2 border-gray-500/70 font-semibold px-4 py-2 text-center">
                {row.nonAktif}
              </td>
              <td className="border-2 border-gray-500/70 font-semibold px-4 py-2 text-center">
                {row.menungguUkom}
              </td>
              <td className="border-2 border-gray-500/70 font-semibold px-4 py-2 text-center">
                {row.tidakMemilikiAkm}
              </td>
              <td className="border-2 border-gray-500/70 font-semibold px-4 py-2 text-center">
                {row.akmTidakSesuai}
              </td>
              <td className="border-2 border-gray-500/70 font-semibold px-4 py-2 text-center">
                {row.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const dataAKMProdi = [
  {
    program: "S1 - Akuntansi",
    total: 356,
    A: 38,
    C: 0,
    G: 0,
    KM: 0,
    N: 316,
    U: 0,
    SKS: 20,
    IPS: "0.00",
    IPK: "4.00",
  },
  {
    program: "S1 - Bisnis Digital",
    total: 356,
    A: 38,
    C: 0,
    G: 0,
    KM: 0,
    N: 316,
    U: 0,
    SKS: 20,
    IPS: "0.00",
    IPK: "4.00",
  },
  {
    program: "S1 - Gizi",
    total: 356,
    A: 38,
    C: 0,
    G: 0,
    KM: 0,
    N: 316,
    U: 0,
    SKS: 20,
    IPS: "0.00",
    IPK: "4.00",
  },
  {
    program: "S1 - Ilmu Lingkungan",
    total: 356,
    A: 38,
    C: 0,
    G: 0,
    KM: 0,
    N: 316,
    U: 0,
    SKS: 20,
    IPS: "0.00",
    IPK: "4.00",
  },
  {
    program: "S1 - Teknik Informatika",
    total: 356,
    A: 38,
    C: 0,
    G: 0,
    KM: 0,
    N: 316,
    U: 0,
    SKS: 20,
    IPS: "0.00",
    IPK: "4.00",
  },
  {
    program: "S1 - Manajemen",
    total: 356,
    A: 38,
    C: 0,
    G: 0,
    KM: 0,
    N: 316,
    U: 0,
    SKS: 20,
    IPS: "0.00",
    IPK: "4.00",
  },
];

// TABEL AKM PRODI
export function TabelAKMProdi() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th
              rowSpan={2}
              className="bg-teal-700 text-white px-4 py-3 text-center border-2 border-gray-500/70 font-semibold"
            >
              Program Studi
            </th>
            <th
              rowSpan={2}
              className="bg-teal-700 text-white px-4 py-3 text-center border-2 border-gray-500/70 font-semibold"
            >
              Total
            </th>
            <th
              colSpan={5}
              className="bg-teal-700 text-white px-4 py-3 text-center border-2 border-gray-500/70 font-semibold"
            >
              Status Semester
            </th>
            <th
              colSpan={4}
              className="bg-teal-700 text-white px-4 py-3 text-center border-2 border-gray-500/70 font-semibold"
            >
              Status Semester
            </th>
          </tr>
          <tr>
            <th className="bg-teal-700 text-white px-2 py-2 text-center border-2 border-gray-500/70 font-semibold">
              A
            </th>
            <th className="bg-teal-700 text-white px-2 py-2 text-center border-2 border-gray-500/70 font-semibold">
              C
            </th>
            <th className="bg-teal-700 text-white px-2 py-2 text-center border-2 border-gray-500/70 font-semibold">
              G
            </th>
            <th className="bg-teal-700 text-white px-2 py-2 text-center border-2 border-gray-500/70 font-semibold">
              KM
            </th>
            <th className="bg-teal-700 text-white px-2 py-2 text-center border-2 border-gray-500/70 font-semibold">
              N
            </th>
            <th className="bg-teal-700 text-white px-2 py-2 text-center border-2 border-gray-500/70 font-semibold">
              U
            </th>
            <th className="bg-teal-700 text-white px-2 py-2 text-center border-2 border-gray-500/70 font-semibold">
              SKS
            </th>
            <th className="bg-teal-700 text-white px-2 py-2 text-center border-2 border-gray-500/70 font-semibold">
              IPS
            </th>
            <th className="bg-teal-700 text-white px-2 py-2 text-center border-2 border-gray-500/70 font-semibold">
              IPK
            </th>
          </tr>
        </thead>
        <tbody>
          {dataAKMProdi.map((row, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border-2 border-gray-500/70 text-black font-semibold px-4 py-2">
                {row.program}
              </td>
              <td className="border-2 border-gray-500/70 text-black font-semibold px-4 py-2 text-center">
                {row.total}
              </td>
              <td className="border-2 border-gray-500/70 text-black font-semibold px-2 py-2 text-center">
                {row.A}
              </td>
              <td className="border-2 border-gray-500/70 text-black font-semibold px-2 py-2 text-center">
                {row.C}
              </td>
              <td className="border-2 border-gray-500/70 text-black font-semibold px-2 py-2 text-center">
                {row.G}
              </td>
              <td className="border-2 border-gray-500/70 text-black font-semibold px-2 py-2 text-center">
                {row.KM}
              </td>
              <td className="border-2 border-gray-500/70 text-black font-semibold px-2 py-2 text-center">
                {row.N}
              </td>
              <td className="border-2 border-gray-500/70 text-black font-semibold px-2 py-2 text-center">
                {row.U}
              </td>
              <td className="border-2 border-gray-500/70 text-black font-semibold px-2 py-2 text-center">
                {row.SKS}
              </td>
              <td className="border-2 border-gray-500/70 text-black font-semibold px-2 py-2 text-center">
                {row.IPS}
              </td>
              <td className="border-2 border-gray-500/70 text-black font-semibold px-2 py-2 text-center">
                {row.IPK}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// TABEL MAHASISWA BARU
export function TableNewStudent() {
  const data = [
    {
      jenjang: "S1",
      nama: "Akuntansi",
      jumlah: 1,
      pdb: 0,
      lainnya: 0,
      L: 0,
      P: 1,
    },
    {
      jenjang: "S1",
      nama: "Bisnis Digital",
      jumlah: 1,
      pdb: 0,
      lainnya: 0,
      L: 0,
      P: 1,
    },
    { jenjang: "S1", nama: "Gizi", jumlah: 1, pdb: 0, lainnya: 0, L: 0, P: 1 },
    {
      jenjang: "S1",
      nama: "Ilmu Lingkungan",
      jumlah: 1,
      pdb: 0,
      lainnya: 0,
      L: 0,
      P: 1,
    },
    {
      jenjang: "S1",
      nama: "Teknik Informatika",
      jumlah: 1,
      pdb: 0,
      lainnya: 0,
      L: 0,
      P: 1,
    },
    {
      jenjang: "S1",
      nama: "Manajemen",
      jumlah: 1,
      pdb: 0,
      lainnya: 0,
      L: 0,
      P: 1,
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th
              rowSpan={2}
              className="bg-teal-700 text-white px-4 py-3 text-center border-2 border-gray-500/70 font-semibold"
            >
              Jenjang
            </th>
            <th
              rowSpan={2}
              className="bg-teal-700 text-white px-4 py-3 text-center border-2 border-gray-500/70 font-semibold"
            >
              Nama
            </th>
            <th
              rowSpan={2}
              className="bg-teal-700 text-white px-4 py-3 text-center border-2 border-gray-500/70 font-semibold"
            >
              Jumlah
            </th>
            <th
              colSpan={2}
              className="bg-teal-700 text-white px-4 py-3 text-center border-2 border-gray-500/70 font-semibold"
            >
              Pendaftaran
            </th>
            <th
              colSpan={2}
              className="bg-teal-700 text-white px-4 py-3 text-center border-2 border-gray-500/70 font-semibold"
            >
              Status Semester
            </th>
          </tr>
          <tr>
            <th className="bg-teal-700 text-white px-2 py-2 text-center border-2 border-gray-500/70 font-semibold">
              PDB
            </th>
            <th className="bg-teal-700 text-white px-2 py-2 text-center border-2 border-gray-500/70 font-semibold">
              Lainnya
            </th>
            <th className="bg-teal-700 text-white px-2 py-2 text-center border-2 border-gray-500/70 font-semibold">
              L
            </th>
            <th className="bg-teal-700 text-white px-2 py-2 text-center border-2 border-gray-500/70 font-semibold">
              P
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border-2 border-gray-500/70 text-black font-semibold px-4 py-2 text-center">
                {row.jenjang}
              </td>
              <td className="border-2 border-gray-500/70 text-black font-semibold px-4 py-2 text-center">
                {row.nama}
              </td>
              <td className="border-2 border-gray-500/70 text-black font-semibold px-4 py-2 text-center">
                {row.jumlah}
              </td>
              <td className="border-2 border-gray-500/70 text-black font-semibold px-2 py-2 text-center">
                {row.pdb}
              </td>
              <td className="border-2 border-gray-500/70 text-black font-semibold px-2 py-2 text-center">
                {row.lainnya}
              </td>
              <td className="border-2 border-gray-500/70 text-black font-semibold px-2 py-2 text-center">
                {row.L}
              </td>
              <td className="border-2 border-gray-500/70 text-black font-semibold px-2 py-2 text-center">
                {row.P}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
