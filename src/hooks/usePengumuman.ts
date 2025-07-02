import { useQuery } from "@tanstack/react-query";
import { pengumumanService } from "../api/pengumumanService";

// Interface for the hook's parameters, matching the service
interface PengumumanParams {
    page?: number;
    size?: number;
    sort?: string;
}

/**
 * Custom hook to fetch announcements with pagination using React Query.
 * @param params - Parameters for pagination and sorting.
 */
export const usePengumumanMahasiswa = (params: PengumumanParams) => {
    return useQuery({
        // The query key uniquely identifies this data.
        // Including params ensures the query re-fetches if the page or size changes.
        queryKey: ["pengumuman", params],

        // The function that will be called to fetch the data.
        queryFn: () => pengumumanService.getPengumuman(params),

        // You can add more React Query options here if needed, like:
        // staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    });
};