import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import TableDetailClass from "../../../components/lecturer/TableDetailClass";
import DataStudent from "../../../components/lecturer/DataStudent";
import ButtonGroupOption from "../../../components/lecturer/ButtonGroupOption";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../../api/Index";
import { Link } from "react-router-dom";
import { LecturerRoute } from "../../../types/VarRoutes";
import MainLayout from "../../../components/layouts/MainLayout";
import { Table } from "../../../components/Table";

const selectOptions = [
  { value: "detail", text: "Detail Kelas" },
  { value: "peserta", text: "Peserta Kelas" },
  { value: "nilai", text: "Nilai Perkuliahan" },
];

const tableHead = {
  detail: ["No", "Hari", "Jam mulai", "Jam selesai", "Jenis pertemuan", "Metode pembelajaran", "Ruang"],
  peserta: ["No", "Nim", "Nama Mahasiswa", "Program Studi", "Angkatan", "Status KRS"],
  nilai: ["No", "Nim", "Nama", "Hadir", "Tugas", "UTS", "UAS", "Kehadiran", "Nilai", "Grade", "Lulus", "Keterangan"]
};

const DetailClassLecturer = () => {
  const id = localStorage.getItem("id_kelas_kuliah")

  
  const [option, setOption] = useState("detail");
  
  const { data: detailData } = useQuery({
    queryKey: ['kelas-detail'],
    queryFn: async () => (await Api.get(`/dosen/kelas-kuliah/${id}`)).data.data,
  });
  
  const { data: pesertaData, isLoading } = useQuery({
    queryKey: ['peserta-kelas'],
    queryFn: async () => (await Api.get(`/dosen/kelas-kuliah/${id}/peserta-kelas`)).data.data,
  });
  
  const { data: jadwalData } = useQuery({
    queryKey: ['jadwal-kelas'],
    queryFn: async () => (await Api.get(`/dosen/kelas-kuliah/${id}/jadwal-kelas`)).data.data,
  });
  
  const getDataStudent = () => {
    if (!detailData) return [];
    return [
      { label: "Periode Akademik", value: detailData.periodeAkademik },
      { label: "Kapasitas", value: detailData.kapasitas },
      {
        label: "Program Studi",
        value: `${detailData.programStudi?.jenjang?.jenjang} - ${detailData.programStudi?.namaProgramStudi}`,
      },
      {
        label: "Tanggal Mulai",
        value: new Date(detailData.tanggalMulai).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      },
      { label: "Kurikulum", value: detailData.mataKuliah?.tahunKurikulum },
      {
        label: "Tanggal Selesai",
        value: new Date(detailData.tanggalSelesai).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      },
      {
        label: "Mata Kuliah",
        value: `${detailData.mataKuliah?.namaMataKuliah} (${detailData.mataKuliah?.kodeMataKuliah})`,
      },
      { label: "Jumlah Pertemuan", value: detailData.jumlahPertemuan },
      { label: "Nama Kelas", value: detailData.nama },
      { label: "Sistem Kelas", value: detailData.sistemKuliah },
    ];
  };

  const dataDetail = jadwalData?.map((item, index) => ({
    id: index,
    hari: item.hari,
    jamMulai: item.jamMulai,
    jamSelesai: item.jamSelesai,
    jenisPertemuan: item.jenisPertemuan,
    metodePembelajaran: item.metodePembelajaran,
    ruang: item.siakRuangan?.namaRuangan,
  }));

  const dataPeserta = pesertaData?.map((item, index) => ({
    id: item.id,
    no: index + 1,
    nim: item.npm,
    namaMahasiswa: item.nama,
    programStudi: item.programStudiResDto?.namaProgramStudi,
    angkatan: item.angkatan,
    status: item.status,
  }));

  const dataNilai = pesertaData?.map((item, index) => ({
    id: item.id,
    no: index + 1,
    nim: item.npm,
    nama: item.nama,
    hadir: item.kehadiran,
    tugas: item.tugas,
    uts: item.uts,
    uas: item.uas,
    kehadiran: item.kehadiran,
    nilai: item.nilai,
    grade: item.hurufMutu,
    lulus: item.nilaiAkhir >= 60 ? "Lulus" : "Tidak",
    keterangan: item.nilaiAkhir >= 60 ? "Memenuhi" : "Tidak memenuhi",
  }));

  const renderTable = () => {
    switch (option) {
      case "detail":
        return <TableDetailClass tableHead={tableHead.detail} data={dataDetail} error="Data kosong" />;
      case "peserta":
        return <Table tableHead={tableHead.peserta} data={dataPeserta} error="Data kosong" />;
      case "nilai":
        return <Table tableHead={tableHead.nilai} data={dataNilai} error="Data kosong" />;
      default:
        return null;
    }
  };

  return (
  <MainLayout
    titlePage={"Detail Kelas Kuliah"}
    isGreeting={false}
  >
    <div className="w-full bg-white py-2 rounded-sm border-t-2 border-primary-green px-4 max-w-screen-xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          <select className="rounded px-2 py-1 text-sm border border-primary-brown text-primary-brown">
            <option value={"semua"}>-Semua-</option>
          </select>
        </div>
        <Link
          to={LecturerRoute.courses.class}
          onClick={() => localStorage.removeItem("id_kelas_kuliah")}
          className="bg-primary-blueSoft flex rounded pl-2 pr-4 py-1 items-center text-white w-fit self-start md:self-auto"
        >
          <ChevronLeft size={16} className="mr-2" />
          Kembali ke daftar
        </Link>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-4 mt-4">
        <div className="lg:w-1/6 w-full flex lg:flex-col max-h-fit gap-2 rounded shadow shadow-gray-400 overflow-x-auto">
          <ButtonGroupOption options={selectOptions} selected={option} onChange={setOption} />
        </div>
        
        <div className="w-full overflow-x-auto">
            <DataStudent data={getDataStudent()} />
          <div className="w-full overflow-x-auto">
            {renderTable()}
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
  );
};

export default DetailClassLecturer;
