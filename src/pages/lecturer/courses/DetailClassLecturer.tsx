import React, { useState } from "react"
import MainLayout from "../../../components/layouts/MainLayout"
import { ChevronLeft, RefreshCw, Search } from "lucide-react"
import TableDetailClass from "../../../components/lecturer/TableDetailClass"
import DataStudent from "../../../components/lecturer/DataStudent"
import TableLecturer from "../../../components/lecturer/TableLecturer"

const DetailClassLecturer = ({setId}) => {
    const [option, setOption] = useState<string>("detail")

    const selectOptions = [
        {
            value: "detail",
            text: "Detail Kelas"
        },
        {
            value: "peserta",
            text: "Peserta Kelas"
        },
        {
            value: "nilai",
            text: "Nilai Perkuliahan"
        }
    ]

    const tableHeadDetail = ["No", "Hari", "Jam mulai", "Jam selesai", "Jenis pertemuan", "Metode pembelajaran", "Ruang"]
    const tableHeadPeserta = ["No", "Nim", "Nama Mahasiswa", "Program Studi", "Angkatan", "Status KRS", "Aksi"]
    const tableHeadNilai = ["No", "Nim", "Nama", "Hadir", "Tugas", "UTS", "UAS", "Kehadiran", "Nilai", "Grade", "Lulus", "Keterangan", "Aksi"]

    const dataDetail = [
        {
            id: 1,
            hari: "Jumat",
            jamMulai: "21.10",
            jamSelesai: "22.50",
            jenisPertemuan: "Kuliah",
            metodePembelajaran: "Offline",
            ruang: "@LAB02"
        }
    ]

    const dataPeserta = [
        {
            id: 1,
            no: 1,
            nim: "22110602345",
            namaMahasiswa: "ido atan",
            programStudi: "Teknik Informatika",
            angkatan: "2022",
            status: "disetujui",
            aksi: ""
        }
    ]

    const dataNilai = [
        {
            id: 1,
            no: 1,
            nim: "22110602345",
            nama: "ido atan",
            hadir: 100,
            tugas: 100,
            uts: 80,
            uas: 75,
            kehadiran: 100,
            nilai: 89,
            grade: "A",
            lulus: "X",
            keterangan: "X",
            aksi: ""
        }
    ]

    const dataStudent = [
        { label: "Periode Akademik", value: "2024 Genap" },
        { label: "Kapasitas", value: "35" },
        { label: "Program Studi", value: "S1 - Teknik Informatika" },
        { label: "Tanggal Mulai", value: "10 Februari 2025" },
        { label: "Kurikulum", value: "2018" },
        { label: "Tanggal Selesai", value: "14 Juni 2025" },
        { label: "Mata Kuliah", value: "Basis Data dan Praktikum (3 SKS - SMT3)" },
        { label: "Jumlah Pertemuan", value: "16" },
        { label: "Nama Kelas", value: "KAR_A" },
        { label: "Sistem Kelas", value: "Karyawan" },
      ];

    return (
            <>
                <div className="w-full bg-white py-2 rounded-sm border-t-2 border-primary-green">
                    <div className="flex px-4 justify-between">
                        <div className="flex gap-4">
                            <select className="rounded px-3 text-primary-brown border-primary-brown border p-1">
                                <option value={"semua"}>-Semua-</option>
                            </select>
                            <div className="flex">
                                <input
                                type="search"
                                placeholder="Cari Pengumuman"
                                className="px-2 py-1 w-70 rounded shadow-md border border-black/50"
                                />
                                <button className="-ml-2 bg-[#00A65A] w-10 flex items-center justify-center">
                                    <Search color="white" size={20} />
                                </button>
                                <button className="bg-primary-blueDark rounded-r-md w-10 flex items-center justify-center">
                                    <RefreshCw color="white" size={20} />
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => {setId(null)}}
                            className="bg-primary-blueSoft flex rounded-sm pl-2 cursor-pointer pr-4 py-1 items-center ml-auto text-white"
                        >
                            <ChevronLeft size={16} className="mr-4" />
                            Kembali ke daftar
                        </button>
                    </div>
                    <div className="w-full flex gap-8">
                        <div className="w-1/6 h-fit mt-4 rounded shadow shadow-gray-400">
                            {
                                selectOptions.map(item => 
                                    <button onClick={() => setOption(item.value) } className={`px-1 w-full ${option === item.value ? "bg-primary-green/15 border-l border-primary-green" : ""} hover:bg-primary-green/15 cursor-pointer text-primary-green py-2`}>{item.text}</button>
                                ) 
                            }
                        </div>
                        <div className="w-full mt-4">
                            <DataStudent data={dataStudent} />
                            {option === "detail" ? 
                                <TableDetailClass
                                    tableHead={tableHeadDetail}
                                    data={dataDetail}
                                    error={"Data kosong"}
                                />
                            : option === "peserta" ? 
                                <TableLecturer
                                    tableHead={tableHeadPeserta}
                                    data={dataPeserta}
                                    error={"Data kosong"}
                                />
                                : 
                                <TableLecturer
                                    tableHead={tableHeadNilai}
                                    data={dataNilai}
                                    error={"Data kosong"}
                                />
                            }
                        </div>
                    </div>
                </div>
            </>
    )
}

export default DetailClassLecturer