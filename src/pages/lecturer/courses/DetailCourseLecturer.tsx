import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import DataStudent from "../../../components/lecturer/DataStudent";
import { Link } from "react-router-dom";
import { LecturerRoute } from "../../../types/VarRoutes";
import { ChevronLeft } from "lucide-react";
import ButtonGroupOption from "../../../components/lecturer/ButtonGroupOption";
import { useCourseDetail, useCourseRPS } from "../../../hooks/lecturer/useFetchCourse";

export default function DetailCourseLecturer() {
    const id = localStorage.getItem("id_mata_kuliah")

    const selectOptions = [
        { value: "detail", text: "Detail Mata Kuliah" },
        { value: "rps", text: "RPS" }
      ];

    const [option, setOption] = useState("detail");

    const { isPending, data: detail, error } = useCourseDetail(id)
      
    const { data: rps } = useCourseRPS(id)

      return (
        <MainLayout
          titlePage={"Detail Mata Kuliah"}
          isGreeting={false}
        >
          <div className="w-full bg-white py-2 rounded-sm border-t-2 border-primary-green px-4 max-w-screen-xl mx-auto">
            <div className="flex gap-4 justify-end">
              <Link
                to={LecturerRoute.courses.course}
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
                {option === "detail" ? (
                  isPending ? (
                    <div>Loading...</div>
                  ) : error ? (
                    <div>Error loading data</div>
                  ) : detail.data ? (
                    <DataStudent
                      data={[
                        { label: 'Tahun Kurikulum', value: detail.data.tahunKurikulum },
                        { label: 'Program Studi', value: detail.data.programStudi || detail.data.unitPengampu },
                        { label: 'Kode Mata Kuliah', value: detail.data.kodeMataKuliah },
                        { label: 'Semester', value: detail.data.semester || '-' },
                        { label: 'Nama Mata Kuliah', value: detail.data.namaMataKuliah || detail.data.namaMataKuliahInd },
                        { label: 'Prasyarat 1', value: detail.data.prasyaratMataKuliah1?.namaMataKuliah || '-' },
                        { label: 'SKS Tatap Muka', value: detail.data.sksTatapMuka },
                        { label: 'Prasyarat 2', value: detail.data.prasyaratMataKuliah2?.namaMataKuliah || '-' },
                        { label: 'SKS Praktikum', value: detail.data.sksPraktikum },
                        { label: 'Prasyarat 3', value: detail.data.prasyaratMataKuliah3?.namaMataKuliah || '-' },
                        { label: 'Total SKS', value: (Number(detail.data.sksTatapMuka) + Number(detail.data.sksPraktikum)), bold: true },
                        { label: 'Jenis Mata Kuliah', value: detail.data.jenisMataKuliah },
                      ]}
                    />
                  ) : (
                    <div>Data tidak ditemukan</div>
                  )
                ) : (
                  rps?.data ? (
                    <DataStudent
                      data={[
                        { label: 'Periode Akademik', value: rps.data.rpsData?.periode?.nama || rps.data.periodeAkademik?.namaPeriode || '-' },
                        { label: 'Jenjang / Unit Pengampu', value: rps.data.mataKuliah?.unitPengampu || rps.data.programStudi?.jenjang?.jenjang || '-' },
                        { label: 'Dosen Penyusun', value: rps.data.rpsData?.pustakaPendukung || rps.data.pustakaPendukung || '-' },
                        { label: 'Tanggal Penyusun', value: rps.data.rpsData?.tanggalPenyusunan || rps.data.tanggalPenyusun || '-' },
                        { label: 'Tujuan Mata Kuliah', value: rps.data.rpsData?.tujuanMataKuliah || rps.data.tujuanMataKuliah || '-' },
                        { label: 'Deskripsi Mata Kuliah', value: rps.data.rpsData?.deskripsiMataKuliah || rps.data.deskripsiMataKuliah || '-' },
                      ]}
                    />
                  ) : (
                    <div>Data tidak ditemukan</div>
                  )
                )}
              </div>
            </div>
          </div>
        </MainLayout>
        );
}