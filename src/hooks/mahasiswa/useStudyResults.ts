import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
// Import from the new shared service
import { generalService } from "../../api/generalService";
import { studyResultService } from "../../api/mahasiswa/studyResultService";
// Import the shared type
import { IAcademicPeriod } from "../../types/common.types";

export const useStudyResults = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<string>("");

    // Query 1: Fetches periods from the general service
    const { data: periods, isLoading: isLoadingPeriods } = useQuery<IAcademicPeriod[]>({
        queryKey: ["academicPeriods"], // This can be a general key now
        queryFn: generalService.getAcademicPeriods, // <-- The important change
    });

    // (The rest of the hook remains exactly the same)
    useEffect(() => {
        if (periods && periods.length > 0 && !selectedPeriod) {
            setSelectedPeriod(periods[0].id);
        }
    }, [periods, selectedPeriod]);

    const {
        data: khsData,
        isLoading: isLoadingResults,
        isError,
        error,
    } = useQuery({
        queryKey: ["studyResults", selectedPeriod],
        queryFn: () => studyResultService.getStudyResultsByPeriod(selectedPeriod),
        enabled: !!selectedPeriod,
    });

    return {
        periods,
        selectedPeriod,
        setSelectedPeriod,
        khsData,
        isLoading: isLoadingPeriods || isLoadingResults,
        isError,
        error,
    };
};