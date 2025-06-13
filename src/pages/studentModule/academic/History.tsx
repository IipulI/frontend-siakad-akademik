import React from "react";
import Biodata from "../../../components/biodata/Biodata";
import MainLayout from "../../../components/layouts/MainLayout";
import { TableHistory } from "../../../components/Table";
import { LayoutGrid, Settings } from "lucide-react";

export default function History() {
  const tableHead = [
    "No",
    "Kode MK",
    "Nama Mata Kuliah",
    "Kelas",
    "SKS",
    "Hari",
    "Jam",
    "Ruangan",
    "Dosen Pengajar",
  ];
  const data = [
    {
      no: 1,
      kodeMk: "TIF302",
      mataKuliah: "Metode Penelitian",
      kelas: "REG_B",
      sks: 2,
      hari: "Kamis",
      jam: "09.00-11.00",
      ruangan: "206",
      dosen: "Safaruddin Hidayat S.Kom M.Kom",
    },
    {
      no: 2,
      kodeMk: "TIF304",
      mataKuliah: "Kapita Selekta",
      kelas: "REG_B",
      sks: 2,
      hari: "Jumat",
      jam: "13.00-15.00",
      ruangan: "203",
      dosen: "Dewi Primatasari S.Si",
    },
    {
      no: 3,
      kodeMk: "TIF306",
      mataKuliah: "Pemrograman Web",
      kelas: "REG_B",
      sks: 3,
      hari: "Senin",
      jam: "10.00-12.00",
      ruangan: "204",
      dosen: "Safaruddin Hidayat S.Kom M.Kom",
    },
    {
      no: 4,
      kodeMk: "TIF308",
      mataKuliah: "Jaringan Komputer",
      kelas: "REG_B",
      sks: 3,
      hari: "Selasa",
      jam: "08.00-10.00",
      ruangan: "301",
      dosen: "Safaruddin Hidayat S.Kom M.Kom",
    },
    {
      no: 5,
      kodeMk: "TIF310",
      mataKuliah: "Basis Data",
      kelas: "REG_B",
      sks: 3,
      hari: "Rabu",
      jam: "10.00-12.00",
      ruangan: "303",
      dosen: "Safaruddin Hidayat S.Kom M.Kom",
    },
    {
      no: 6,
      kodeMk: "TIF312",
      mataKuliah: "Keamanan Informasi",
      kelas: "REG_B",
      sks: 2,
      hari: "Kamis",
      jam: "13.00-15.00",
      ruangan: "207",
      dosen: "Safaruddin Hidayat S.Kom M.Kom",
    },
    {
      no: 7,
      kodeMk: "TIF314",
      mataKuliah: "Machine Learning",
      kelas: "REG_B",
      sks: 3,
      hari: "Jumat",
      jam: "08.00-10.00",
      ruangan: "208",
      dosen: "Safaruddin Hidayat S.Kom M.Kom",
    },
    {
      no: 8,
      kodeMk: "TIF316",
      mataKuliah: "RPL Lanjut",
      kelas: "REG_B",
      sks: 3,
      hari: "Senin",
      jam: "13.00-15.00",
      ruangan: "209",
      dosen: "Fitrah Satrya Fajar Kusumah S.Kom M.Kom",
    },
    {
      no: 9,
      kodeMk: "TIF318",
      mataKuliah: "Kecerdasan Buatan",
      kelas: "REG_B",
      sks: 3,
      hari: "Selasa",
      jam: "10.00-12.00",
      ruangan: "302",
      dosen: "Safaruddin Hidayat S.Kom M.Kom",
    },
    {
      no: 10,
      kodeMk: "TIF320",
      mataKuliah: "Cloud Computing",
      kelas: "REG_B",
      sks: 2,
      hari: "Rabu",
      jam: "08.00-10.00",
      ruangan: "206",
      dosen: "Safaruddin Hidayat S.Kom M.Kom",
    },
  ];

  return (
    <MainLayout isGreeting={false} titlePage={"Riwayat KRS"} className="">
      <div className="w-full bg-white min-h-screen py-2 rounded-sm border-t-2 border-primary-yellow">
        <div className="flex justify-end gap-2 mb-4 border-2 p-2">
          <button
            type="button"
            className="bg-primary-green w-30 h-8 text-sm font-semibold rounded flex items-center text-white justify-center gap-2"
          >
            <LayoutGrid color="white" size={20} />
            <p>Pilih Kelas</p>
          </button>
          <button className="bg-orange-400 w-24 h-8 rounded text-white flex items-center justify-center gap-1 text-sm font-semibold">
            <Settings size={20} />
            <select name="" id="">
              <option value="">Aksi</option>
            </select>
          </button>
        </div>

        <Biodata showLine={false} />

        <div className="flex gap-4 my-4 p-3 border-2">
          <label htmlFor="" className="font-semibold">
            Periode Akademik
          </label>
          <select
            name=""
            id=""
            className="p-1 text-sm rounded-sm text-gray-500 w-70 border-2"
          >
            <option value="">2024 Genap</option>
          </select>
        </div>

        <div className="w-full bg-[#D9F7DE] p-4">
          <h1 className="text-black">
            KRS ini<span className="font-semibold">Telah Divalidasi</span> dan
            tidak bisa diubah. Untuk membatalkan validasi KRS silakan
            menghubungi Pembimbing Akademik terkait
          </h1>
        </div>
        <div className="overflow-auto">
          <TableHistory tableHead={tableHead} data={data} error="" />
        </div>
      </div>
    </MainLayout>
  );
}
