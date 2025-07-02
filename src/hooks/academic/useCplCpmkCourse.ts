import { useQuery } from "@tanstack/react-query";
import { Api } from "../../api/Index.tsx";

export interface ProfilLulusan {
  id: string;
  programStudi: string;
  tahunKurikulum: string;
  profil: string;
  profesi: string;
  kodePl: string;
  deskripsiPl: string;
}

export interface CapaianPembelajaranLulusan {
  id: string;
  programStudi: string;
  tahunKurikulum: string;
  kodeCpl: string;
  deskripsiCpl: string;
  kategoriCpl: string;
  profilLulusanMapped: ProfilLulusan[];
}

export interface CapaianMataKuliah {
  id: string;
  mataKuliah: string;
  kodeCpmk: string;
  deskripsiCpmk: string;
  capaianPembelajaranMapped: CapaianPembelajaranLulusan[];
}

export interface CplCpmkCourseResponse {
  capaianMataKuliah: CapaianMataKuliah[];
  capaianPembelajaranLulusan: CapaianPembelajaranLulusan[];
  profilLulusan: ProfilLulusan[];
}

export function getCplCpmkCourse(id: string) {
  return useQuery({
    queryKey: ["cplCpmkCourse", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      const response = await Api.get(`/akademik/cpl-cpmk/${id}`, { headers: { Authorization: `Bearer ${token}` } });

      console.log("🔍 Raw CPL/CPMK Course API data:", response.data.data);

      return response.data.data;
    },
  });
}
