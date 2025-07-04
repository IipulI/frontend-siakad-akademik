import { useQuery } from "@tanstack/react-query";
import { transcriptService } from "../../api/mahasiswa/transcriptService";

export const useTranscript = () => {
    const {
        data,
        isLoading,
        isError,
        error
    } = useQuery({
        // A unique key for this query
        queryKey: ["transcriptData"],
        queryFn: transcriptService.getTranscript,
    });

    return {
        transcriptData: data,
        isLoading,
        isError,
        error,
    };
};