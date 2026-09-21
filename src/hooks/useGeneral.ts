import { useQuery } from "@tanstack/react-query";
import { Api } from "../api/Index";
import { generalService } from "../api/generalService";


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
      const response = await Api.get("/program-studi");
      return response.data.data;
    },
  });
}

export function getSistemKuliah() {
  return useQuery({
    queryKey: ["sistemKuliah"],
    queryFn: async () => {
      const response = await Api.get("/akademik/sistem-kuliah");
      return response.data.data;
    },
  });
}

export function getJalurPendaftaran() {
  return useQuery({
    queryKey: ["jalurPendaftaran"],
    queryFn: async () => {
      const response = await Api.get("/akademik/jalur-pendaftaran");
      return response.data.data;
    },
  });
}

export function getPendidikan() {
  return useQuery({
    queryKey: ["pendidikan"],
    queryFn: async () => {
      const response = await Api.get("/akademik/pendidikan");
      return response.data.data;
    },
  });
}

export function getAgama() {
  return useQuery({
    queryKey: ["agama"],
    queryFn: async () => {
      const response = await Api.get("/akademik/agama");
      return response.data.data;
    },
  });
}

export function getTransportasi() {
  return useQuery({
    queryKey: ["transportasi"],
    queryFn: async () => {
      const response = await Api.get("/akademik/transportasi");
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
      const response = await generalService.getActivePeriod();
      return response.data;
    },
  });
}


export function getLecturers() {
  return useQuery({
    queryKey: ["lecturers"],
    queryFn: async () => {
      const response = await Api.get("/public/dosen");
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
