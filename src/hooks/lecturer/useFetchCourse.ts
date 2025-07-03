// hooks/useLecturerClass.ts
import { useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export const useCourseList = (page: number, keyword: string, size: number) =>
    useQuery({
        queryKey: ['dosen/mata-kuliah', page, keyword, size],
        queryFn: async () => {
          const res = await Api.get(`/dosen/mata-kuliah?page=${page}&keyword=${keyword}&size=${size}`)
          return res.data
        },
})

export const useCourseDetail = (id: string | null) =>
    useQuery({
        queryKey: ['dosen/mata-kuliah/detail', id],
        queryFn: async () => {
          const res = await Api.get(`/dosen/mata-kuliah/${id}`)
          return res.data
        },
})

export const useCourseRPS = (id: string | null) =>
    useQuery({
        queryKey: ['dosen/mata-kuliah/detail/rps', id],
        queryFn: async () => {
          const res = await Api.get(`/dosen/mata-kuliah/${id}/rps`)
          return res.data
        },
})
