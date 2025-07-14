import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../api/mahasiswa/dashboardService";
import { IGrafikAkademik } from "../../types/mahasiswa.types";

/**
 * Custom hook to fetch academic graph and summary data.
 */
export const useGrafikAkademik = () => {
    return useQuery<IGrafikAkademik, Error>({
        queryKey: ["grafikAkademik"],
        queryFn: async () => {
            const response = await dashboardService.getGrafikAkademik();
            return response.data;
        },
    });
};