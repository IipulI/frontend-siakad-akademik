import React, { useState } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../../api/Index";
import DataStudent from "../../../components/lecturer/DataStudent";
import { Link } from "react-router-dom";
import { LecturerRoute } from "../../../types/VarRoutes";
import { ChevronLeft } from "lucide-react";
import ButtonGroupOption from "../../../components/lecturer/ButtonGroupOption";

export default function DetailCourseLecturer() {
    const id = localStorage.getItem("id_mata_kuliah")

    const selectOptions = [
        { value: "detail", text: "Detail Kelas" },
        { value: "rps", text: "RPS" }
      ];

    const [option, setOption] = useState("detail");

    const { isPending, data: detail, error } = useQuery({
        queryKey: ['dosen/mata-kuliah/detail', id],
        queryFn: async () => {
          return await Api.get(`/dosen/mata-kuliah/${id}`)
        },
      })
      
    const { data: rps } = useQuery({
        queryKey: ['dosen/mata-kuliah/detail/rps', id],
        queryFn: async () => {
          return await Api.get(`/dosen/mata-kuliah/${id}/rps`)
        },
      })

      console.log(rps)

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
                  ) : detail.data.data ? (
                    <DataStudent
                      data={[
                        { label: 'Tahun Kurikulum', value: detail.data.data.tahunKurikulum },
                        { label: 'Program Studi', value: detail.data.data.programStudi },
                        { label: 'Kode Mata Kuliah', value: detail.data.data.kodeMataKuliah },
                        { label: 'Semester', value: detail.data.data.semester },
                        { label: 'Nama Mata Kuliah', value: detail.data.data.namaMataKuliah },
                        { label: 'Prasyarat 1', value: detail.data.data.prasyaratMataKuliah1?.namaMataKuliah },
                        { label: 'SKS Tatap Muka', value: detail.data.data.sksTatapMuka },
                        { label: 'Prasyarat 2', value: detail.data.data.prasyaratMataKuliah2?.namaMataKuliah },
                        { label: 'SKS Praktikum', value: detail.data.data.sksPraktikum },
                        { label: 'Prasyarat 3', value: detail.data.data.prasyaratMataKuliah3?.namaMataKuliah },
                        { label: 'Total SKS', value: (Number(detail.data.data.sksTatapMuka) + Number(detail.data.data.sksPraktikum)), bold: true },
                        { label: 'Jenis Mata Kuliah', value: detail.data.data.jenisMataKuliah },
                      ]}
                    />
                  ) : (
                    <div>Data tidak ditemukan</div>
                  )
                ) : (
                  rps?.data.data ? (
                    <DataStudent
                      data={[
                        { label: 'Periode Akademik', value: rps.data.data.periodeAkademik.namaPeriode},
                        { label: 'Jenjang', value: rps.data.data.programStudi.jenjang.jenjang},
                        { label: 'Dosen Penyusun', value: rps.data.data.pustakaPendukung},
                        { label: 'Tanggal Penyusun', value: rps.data.data.tanggalPenyusun},
                        { label: 'Tujuan Mata Kuliah', value: rps.data.data.tujuanMataKuliah},
                        { label: 'Deskripsi Mata Kuliah', value: rps.data.data.deskripsiMataKuliah},
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