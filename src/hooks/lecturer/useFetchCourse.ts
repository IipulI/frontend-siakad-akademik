// hooks/useLecturerClass.ts
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export const useCourseList = (page: number, keyword: string, size: number) =>
    useQuery({
        queryKey: ['dosen/mata-kuliah', page, keyword, size],
        queryFn: async () => {
          // Backend menggunakan konvensi "search" (lihat /akademik/mata-kuliah di useCourseManagement.ts),
          // "keyword" tetap dikirim untuk jaga-jaga jika endpoint ini masih memakai nama lama.
          const params = new URLSearchParams({
            page: String(page),
            size: String(size),
            search: keyword,
            keyword,
          });
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

