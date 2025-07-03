// hooks/useLecturerClass.ts
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export const useClassList = (keyword: string, periodeAkademikId: string, programStudi: string, sistemKuliah: string, page: number, size: number) =>
  useQuery({
    queryKey: ['dosen/kelas-kuliah',
      keyword, 
      periodeAkademikId, 
      programStudi, 
      sistemKuliah,
      page,
      size
    ],
    queryFn: async () => {
      const res = await Api.get(`/dosen/kelas-kuliah?keyword=${keyword}&periodeAkademikId=${periodeAkademikId}&programStudi=${programStudi}&sistemKuliah=${sistemKuliah}&page=${page}&size=${size}`);
      return res.data;
    },
});

export const useClassDetail = (id: string | null) =>
  useQuery({
    queryKey: ['dosen/kelas-kuliah/detail'],
    queryFn: async () => {
      const res = await Api.get(`/dosen/kelas-kuliah/${id}`);
      return res.data.data
    },
});

export const useClassParticipants = (id: string | null) =>
  useQuery({
    queryKey: ['dosen/kelas-kuliah/detail/peserta-kelas'],
    queryFn: async () => {
      const res = await Api.get(`/dosen/kelas-kuliah/${id}/peserta-kelas`);
      return res.data.data
    },
});

export const useClassSchedule = (id: string | null) =>
  useQuery({
    queryKey: ['dosen/kelas-kuliah/detail/jadwal-kelas'],
    queryFn: async () => {
      const res = await Api.get(`/dosen/kelas-kuliah/${id}/jadwal-kelas`);
      return res.data.data
    },
});
