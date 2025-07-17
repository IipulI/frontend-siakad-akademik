import { useQuery } from "@tanstack/react-query";
import { Api } from "../api/Index";

export function getAcademicPeriodeDropdown() {
  return useQuery({
    queryKey: ["academicPeriodsDropdown"],
    queryFn: async () => {
      const response = await Api.get("/periode-akademik/dropdown");
      return response.data.data;
    },
  });
}

export function getPeriodeAcademicActive() {
  return useQuery({
    queryKey: ["academicPeriodsActive"],
    queryFn: async () => {
      const response = await Api.get("/periode-akademik/active-status");
      return response.data.data;
    },
  });
}

export function getProgramStudi() {
  return useQuery({
    queryKey: ["programStudi"],
    queryFn: async () => {
      const response = await Api.get("/akademik/program-studi");
      return response.data.data;
    },
  });
}

export function getYearCuriculum() {
  return useQuery({
    queryKey: ["curiculumYear"],
    queryFn: async () => {
      const response = await Api.get("/akademik/tahun-kurikulum");
      return response.data.data;
    },
  });
}
