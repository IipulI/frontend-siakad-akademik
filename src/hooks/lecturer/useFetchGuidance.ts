import { useQuery, useMutation } from "@tanstack/react-query";
import { Api } from "../../api/Index";
import { KrsActionPayload } from "../../types/krsPayload";

export const useAcademicGuidanceList = (periodeAkademikId: string, programStudi: string, angkatan: string, statusKrs: string, keyword: string, statusMahasiswa: string, semester: string, page: number, size: number) =>
    useQuery({
        queryKey: [
          "dosen/pembimbing-akademik/all",
          periodeAkademikId,
          programStudi,
          angkatan,
          statusKrs,
          keyword,
          statusMahasiswa,
          semester,
          page,
          size
        ],
        queryFn: async () => {
            const res = await Api.get(`/dosen/pembimbing-akademik/all?periodeAkademikId=${periodeAkademikId}&programStudi=${programStudi}&angkatan=${angkatan}&statusKrs=${statusKrs}&keyword=${keyword}&statusMahasiswa=${statusMahasiswa}&semester=${semester}&size=${size}`)
            return res.data
        },
        enabled: !!periodeAkademikId
});

export const useAcademicGuidanceListDashboard = (periodeAkademikId: string | null, statusKrs: string) =>
    useQuery({
        queryKey: [
          "dashboard-dosen/pembimbing-akademik/all", periodeAkademikId, statusKrs],
        queryFn: async () => {
            const res = await Api.get(`/dosen/pembimbing-akademik/all?periodeAkademikId=${periodeAkademikId}statusKrs=${statusKrs}`)
            return res.data
        },
        enabled: !!periodeAkademikId
});

export const useAcademicGuidanceDetail = (id: string | null) =>
  useQuery({
      queryKey: ['dosen/pembimbing-akademik/detail-krs', id],
      queryFn: async () => {
        const res = await Api.get(`/dosen/pembimbing-akademik/detail-krs/${id}`)
        return res.data
      },
})

export const useAcceptKRS = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async ({ mahasiswaIds, periodeAkademikId }: KrsActionPayload) => {
      const body = {
        mahasiswaIds,
        periodeAkademikId,
      };
      const res = await Api.post("/dosen/pembimbing-akademik/setuju", body);
      return res.data;
    },
    onSuccess,
    onError
  });
};

export const useRejectKRS = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async ({ mahasiswaIds, periodeAkademikId }: KrsActionPayload) => {
      const body = {
        mahasiswaIds,
        periodeAkademikId,
      };
      const res = await Api.post("/dosen/pembimbing-akademik/tolak", body);
      return res.data;
    },
    onSuccess,
    onError
  });
};


