import { useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index";

export const useAcademicPeriodDropdown = () =>
    useQuery({
        queryKey: ["/periode-akademik/dropdown"],
        queryFn: async () => {
            const res = await Api.get(`/periode-akademik/dropdown`)
            return res.data
        }
});

export const useStudyProgramDropdown = () =>
    useQuery({
        queryKey: ["/dosen/program-studi"],
        queryFn: async () => {
            const res = await Api.get(`/dosen/program-studi`)
            return res.data
        }
});
