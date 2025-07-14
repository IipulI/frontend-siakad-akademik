import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../api/mahasiswa/dashboardService";
import { IInfoTagihan } from "../../types/mahasiswa.types";

/**
 * Custom hook to fetch student billing information.
 */
export const useInfoTagihan = () => {
    return useQuery<IInfoTagihan, Error>({
        queryKey: ["infoTagihan"],
        queryFn: async () => {
            const response = await dashboardService.getInfoTagihan();
            return response.data;
        },
    });
};