import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "../api/Index";

export interface CollegeClass {
  id: string;
  dosen: string[];
  jadwalMingguan: string[];
  jumlahPertemuan: number;
  kapasitas: number;
  mataKuliah: {
    id: string;
    kodeMataKuliah: string;
    namaMataKuliah: string;
    tahunKurikulum: string;
  };
  nama: string;
  periodeAkademik: string;
  peserta: number;
  programStudi: {
    id: string;
    jenjang: {
      id: string;
      jenjang: string;
      nama: string;
    };
    namaProgramStudi: string;
  };
  sistemKuliah: string;
  statusPenilaian: string;
  tanggalMulai: string;
  tanggalSelesai: string;
}

export function getCollegeClasses() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const response = await Api.get("/akademik/kelas-kuliah");
      return response.data.data;
    },
  });
}

export function addCollegeClass() {
  return useMutation({
    mutationKey: ["addCollegeClass"],
    mutationFn: async (newClassData: CollegeClass) => {
      const response = await Api.post("/akademik/kelas-kuliah", newClassData);
      return response.data.data;
    },
  });
}
