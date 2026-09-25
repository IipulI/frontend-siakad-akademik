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
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-xs">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-primary-green text-white text-xs font-bold tracking-wider select-none">
            <th className="py-3 px-3 text-center border-r border-white/20">Angkatan</th>
            <th className="py-3 px-3 text-center border-r border-white/20">Aktif</th>
            <th className="py-3 px-3 text-center border-r border-white/20">Cuti</th>
            <th className="py-3 px-3 text-center border-r border-white/20">Non Aktif</th>
            <th className="py-3 px-3 text-center border-r border-white/20">Menunggu Ukom</th>
            <th className="py-3 px-3 text-center border-r border-white/20">Tidak Memiliki AKM</th>
            <th className="py-3 px-3 text-center border-r border-white/20">AKM Tidak Sesuai</th>
            <th className="py-3 px-3 text-center">TOTAL</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {dataAngkatan.map((row, index) => (
            <tr key={index} className="border-b border-slate-200 hover:bg-slate-50/80 bg-white transition-colors">
              <td className="py-2.5 px-3 text-center font-bold text-slate-800 border-r border-slate-200">
                {row.angkatan}
              </td>
              <td className="py-2.5 px-3 text-center font-semibold text-emerald-700 border-r border-slate-200">
                {row.aktif}
              </td>
              <td className="py-2.5 px-3 text-center text-slate-600 border-r border-slate-200">
                {row.cuti}
              </td>
              <td className="py-2.5 px-3 text-center text-slate-600 border-r border-slate-200">
                {row.nonAktif}
              </td>
              <td className="py-2.5 px-3 text-center text-slate-600 border-r border-slate-200">
                {row.menungguUkom}
              </td>
              <td className="py-2.5 px-3 text-center text-slate-600 border-r border-slate-200">
                {row.tidakMemilikiAkm}
              </td>
              <td className="py-2.5 px-3 text-center text-slate-600 border-r border-slate-200">
                {row.akmTidakSesuai}
              </td>
              <td className="py-2.5 px-3 text-center font-bold text-slate-900">
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
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-xs">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-primary-green text-white text-xs font-bold tracking-wider select-none">
            <th
              rowSpan={2}
              className="py-3 px-4 text-left border-r border-white/20"
            >
              Program Studi
            </th>
            <th
              rowSpan={2}
              className="py-3 px-3 text-center border-r border-white/20"
            >
              Total
            </th>
            <th
              colSpan={6}
              className="py-2 px-3 text-center border-r border-white/20 border-b border-white/20"
            >
              Status Semester
            </th>
            <th
              colSpan={3}
              className="py-2 px-3 text-center border-b border-white/20"
            >
              Prestasi & SKS
            </th>
          </tr>
          <tr className="bg-primary-green text-white text-[11px] font-bold tracking-wider select-none">
            <th className="py-2 px-2 text-center border-r border-white/20">A</th>
            <th className="py-2 px-2 text-center border-r border-white/20">C</th>
            <th className="py-2 px-2 text-center border-r border-white/20">G</th>
            <th className="py-2 px-2 text-center border-r border-white/20">KM</th>
            <th className="py-2 px-2 text-center border-r border-white/20">N</th>
            <th className="py-2 px-2 text-center border-r border-white/20">U</th>
            <th className="py-2 px-2 text-center border-r border-white/20">SKS</th>
            <th className="py-2 px-2 text-center border-r border-white/20">IPS</th>
            <th className="py-2 px-2 text-center">IPK</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {dataAKMProdi.map((row, index) => (
            <tr key={index} className="border-b border-slate-200 hover:bg-slate-50/80 bg-white transition-colors">
              <td className="py-2.5 px-4 font-semibold text-slate-800 border-r border-slate-200">
                {row.program}
              </td>
              <td className="py-2.5 px-3 font-bold text-center text-slate-900 border-r border-slate-200">
                {row.total}
              </td>
              <td className="py-2.5 px-2 text-center border-r border-slate-200">{row.A}</td>
              <td className="py-2.5 px-2 text-center border-r border-slate-200">{row.C}</td>
              <td className="py-2.5 px-2 text-center border-r border-slate-200">{row.G}</td>
              <td className="py-2.5 px-2 text-center border-r border-slate-200">{row.KM}</td>
              <td className="py-2.5 px-2 text-center border-r border-slate-200">{row.N}</td>
              <td className="py-2.5 px-2 text-center border-r border-slate-200">{row.U}</td>
              <td className="py-2.5 px-2 font-semibold text-center border-r border-slate-200">{row.SKS}</td>
              <td className="py-2.5 px-2 font-mono text-center border-r border-slate-200">{row.IPS}</td>
              <td className="py-2.5 px-2 font-bold text-center text-slate-800">{row.IPK}</td>
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
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-xs">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-primary-green text-white text-xs font-bold tracking-wider select-none">
            <th
              rowSpan={2}
              className="py-3 px-3 text-center border-r border-white/20"
            >
              Jenjang
            </th>
            <th
              rowSpan={2}
              className="py-3 px-4 text-left border-r border-white/20"
            >
              Nama
            </th>
            <th
              rowSpan={2}
              className="py-3 px-3 text-center border-r border-white/20"
            >
              Jumlah
            </th>
            <th
              colSpan={2}
              className="py-2 px-3 text-center border-r border-white/20 border-b border-white/20"
            >
              Pendaftaran
            </th>
            <th
              colSpan={2}
              className="py-2 px-3 text-center border-b border-white/20"
            >
              Status Semester
            </th>
          </tr>
          <tr className="bg-primary-green text-white text-[11px] font-bold tracking-wider select-none">
            <th className="py-2 px-2 text-center border-r border-white/20">
              PDB
            </th>
            <th className="py-2 px-2 text-center border-r border-white/20">
              Lainnya
            </th>
            <th className="py-2 px-2 text-center border-r border-white/20">
              L
            </th>
            <th className="py-2 px-2 text-center">
              P
            </th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {data.map((row, index) => (
            <tr key={index} className="border-b border-slate-200 hover:bg-slate-50/80 bg-white transition-colors">
              <td className="py-2.5 px-3 font-semibold text-center text-slate-800 border-r border-slate-200">
                {row.jenjang}
              </td>
              <td className="py-2.5 px-4 font-semibold text-slate-800 border-r border-slate-200">
                {row.nama}
              </td>
              <td className="py-2.5 px-3 font-bold text-center text-slate-900 border-r border-slate-200">
                {row.jumlah}
              </td>
              <td className="py-2.5 px-2 text-center border-r border-slate-200">
                {row.pdb}
              </td>
              <td className="py-2.5 px-2 text-center border-r border-slate-200">
                {row.lainnya}
              </td>
              <td className="py-2.5 px-2 text-center border-r border-slate-200">
                {row.L}
              </td>
              <td className="py-2.5 px-2 text-center">
                {row.P}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
