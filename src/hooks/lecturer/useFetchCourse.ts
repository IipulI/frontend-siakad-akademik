// hooks/useLecturerClass.ts
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export const useCourseList = (
    page: number,
    keyword: string,
    size: number,
    prodiId?: string,
    tahunKurikulumId?: string,
    searchBy?: string
) =>
    useQuery({
        queryKey: ['dosen/mata-kuliah', page, keyword, size, prodiId, tahunKurikulumId, searchBy],
        queryFn: async () => {
          // Backend menggunakan konvensi "search" (lihat /akademik/mata-kuliah di useCourseManagement.ts),
          // "keyword" tetap dikirim untuk jaga-jaga jika endpoint ini masih memakai nama lama.
          // prodiId/tahunKurikulumId WAJIB dikirim ke server (bukan difilter di FE) supaya
          // pagination ("Hal x/y", total data) tetap akurat -- sebelumnya filter cuma nyaring
          // 1 halaman data yang sudah ke-fetch, jadi kelihatan datanya "ilang" padahal cuma
          // gak ke-filter di server (lihat CourseLecturer.tsx).
          const params = new URLSearchParams({
            page: String(page),
            size: String(size),
            search: keyword,
            keyword,
          });
          if (prodiId) params.set('prodiId', prodiId);
          if (tahunKurikulumId) params.set('tahunKurikulumId', tahunKurikulumId);
          if (searchBy) params.set('searchBy', searchBy);
          const res = await Api.get(`/akademik/dosen/mata-kuliah?${params.toString()}`)
          return res.data
        },
    })

export const useCourseDetail = (id: string | null) =>
    useQuery({
        queryKey: ['dosen/mata-kuliah/detail', id],
        queryFn: async () => {
          const res = await Api.get(`/akademik/dosen/mata-kuliah/${id}`)
          return res.data
        },
    })

export const useCourseRPS = (id: string | null) =>
    useQuery({
        queryKey: ['dosen/mata-kuliah/detail/rps', id],
        queryFn: async () => {
          const res = await Api.get(`/akademik/dosen/mata-kuliah/${id}/detail-rps`)
          return res.data
        },
    })

