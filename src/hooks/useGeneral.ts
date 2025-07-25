import { useQuery } from "@tanstack/react-query";
import { Api } from "../api/Index";

export function getYearCuriculum() {
  return useQuery({
    queryKey: ["curiculumYear"],
    queryFn: async () => {
      const response = await Api.get("/akademik/tahun-kurikulum");
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

export function getAcademicPeriodeDropdown() {
  return useQuery({
    queryKey: ["academicPeriodsDropdown"],
    queryFn: async () => {
      const response = await Api.get("/periode-akademik/dropdown");
      return response.data.data;
    },
  });
}

export function getAcademicPeriods() {
  return useQuery({
    queryKey: ["academicPeriods"],
    queryFn: async () => {
      const response = await Api.get("/akademik/periode-akademik?size=100");
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

export function getLecturers() {
  return useQuery({
    queryKey: ["lecturers"],
    queryFn: async () => {
      const response = await Api.get("/akademik/dosen");
      return response.data.data;
    },
  });
}

export function getSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const response = await Api.get("/akademik/mata-kuliah/all");
      return response.data.data;
    },
  });
}
