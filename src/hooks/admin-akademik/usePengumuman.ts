import { useQuery } from "@tanstack/react-query";
import { pengumumanService } from "../../api/admin-academic/pengumumanService";
import { IApiResponseWithData, IPengumuman } from "../../types/common.types";

// Interface for the hook's parameters, matching the service
interface PengumumanParams {
    page?: number;
    size?: number;
    sort?: string;
    keyword?: string;
}

/**
 * Custom hook to fetch announcements with pagination using React Query.
 * @param params - Parameters for pagination and sorting.
 */
export const usePengumumanAkademik = (params: PengumumanParams) => {
    return useQuery({
        // The query key uniquely identifies this data.
        // Including params ensures the query re-fetches if the page or size changes.
        queryKey: ["pengumuman-akademik", params],

        // The function that will be called to fetch the data.
        queryFn: () => pengumumanService.getPengumuman(params),

        // You can add more React Query options here if needed, like:
        // staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    });
};

/**
 * Custom hook to fetch the details of a single announcement by its ID.
 * @param announcementId - The ID of the announcement to fetch.
 */
export const usePengumumanDetail = (announcementId: string | undefined | null) => {
    return useQuery<IApiResponseWithData<IPengumuman>, Error>({
        // The query key uniquely identifies this specific fetch request.
        // If announcementId changes, React Query will fetch new data.
        queryKey: ["pengumuman-akademik", announcementId],

        // The function that performs the data fetching.
        queryFn: () => {
            // Throw an error if the ID is missing, which React Query will catch.
            if (!announcementId) {
                return Promise.reject(new Error("Announcement ID is required."));
            }
            return pengumumanService.getPengumumanById(announcementId);
        },

        // This option prevents the query from running if announcementId is not yet available.
        enabled: !!announcementId,

        // Optional: You can set how long the data is considered "fresh".
        // staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Custom hook to fetch the banner image for a single announcement.
 * @param announcementId - The ID of the announcement.
 */
export const usePengumumanBanner = (announcementId: string | undefined | null) => {
    return useQuery<Blob, Error>({
        queryKey: ["pengumumanBanner-akademik", announcementId],
        queryFn: () => {
            if (!announcementId) {
                return Promise.reject(new Error("Announcement ID is required."));
            }
            return pengumumanService.getPengumumanBanner(announcementId);
        },
        enabled: !!announcementId,
        staleTime: 1000 * 60 * 60, // Cache images for 1 hour
    });
};