// src/hooks/usePeriodeAkademik.ts

import { useQuery } from "@tanstack/react-query";
import { Api } from "../api/Index";
import { generalService } from "../api/generalService";
import { IAcademicPeriod, IAcademicActivePeriod } from "../types/common.types";


export default function getAcademicPeriods() {
  return useQuery({
    queryKey: ["academicPeriods"],
    queryFn: async () => {
      const response = await Api.get("/akademik/periode-akademik");
      return response.data.data;
    },
  });
}

/**
 * Hook to fetch a list of all available academic periods for dropdowns.
 */
export const useAcademicPeriods = () => {
  return useQuery<IAcademicPeriod[], Error>({
    queryKey: ["academicPeriodsList"],
    queryFn: generalService.getAcademicPeriods,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

/**
 * Hook to fetch the currently active academic period.
 */
export const useActivePeriod = () => {
  return useQuery<IAcademicActivePeriod, Error>({
    queryKey: ["activePeriod"],
    queryFn: async () => {
      const response = await generalService.getActivePeriod();
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
