import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index.tsx";

interface CurriculumProdiData {
  siakProgramStudiId: string;
  siakTahunKurikulumId: string;
  semester: number;
  opsiMataKuliah: boolean;
  nilaiMin: string;
}

export function useAddCurriculumProdi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CurriculumProdiData }) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");
      }

      const payload = {
        siakProgramStudiId: data.siakProgramStudiId,
        siakTahunKurikulumId: data.siakTahunKurikulumId,
        semester: data.semester,
        opsiMataKuliah: data.opsiMataKuliah,
        nilaiMin: data.nilaiMin,
      };

      console.log("Final Payload:", payload);

      try {
        const response = await Api.put(`/akademik/kurikulum-prodi/add/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("✅ API Response:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("❌ API Error:", error);

        // Log detail error untuk debugging
        if (error.response) {
          console.error("Error Status:", error.response.status);
          console.error("Error Data:", error.response.data);
          console.error("Error Headers:", error.response.headers);
        } else if (error.request) {
          console.error("No Response Received:", error.request);
        } else {
          console.error("Error Message:", error.message);
        }

        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("✅ Mutation Success:", data);

      // Invalidate queries untuk refresh data
      queryClient.invalidateQueries({ queryKey: ["kurikulumProdi"] });
      queryClient.invalidateQueries({ queryKey: ["curriculumProdi"] });

      // Optional: Juga bisa invalidate queries lain yang terkait
      queryClient.invalidateQueries({ queryKey: ["kurikulumData"] });
    },
    onError: (error: any) => {
      console.error("❌ Mutation Error:", error);

      // Bisa tambahkan logic untuk handle error secara global
      // Misalnya redirect ke login jika token expired
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        // window.location.href = "/login"; // Uncomment jika perlu
      }
    },
  });
}

// Hook untuk update curriculum prodi (jika diperlukan)
export function useUpdateCurriculumProdi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CurriculumProdiData }) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");
      }

      console.log("=== DEBUG UPDATE CURRICULUM PRODI ===");
      console.log("Course ID:", id);
      console.log("Update Data:", data);

      const response = await Api.put(`/akademik/kurikulum-prodi/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Update Response:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("✅ Update Success:", data);
      queryClient.invalidateQueries({ queryKey: ["kurikulumProdi"] });
    },
    onError: (error: any) => {
      console.error("❌ Update Error:", error);
    },
  });
}

// Hook untuk delete curriculum prodi (jika diperlukan)
export function useDeleteCurriculumProdi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");
      }

      console.log("=== DEBUG DELETE CURRICULUM PRODI ===");
      console.log("Course ID:", id);

      const response = await Api.put(`/akademik/kurikulum-prodi/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Delete Response:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("✅ Delete Success:", data);
      queryClient.invalidateQueries({ queryKey: ["kurikulumProdi"] });
    },
    onError: (error: any) => {
      console.error("❌ Delete Error:", error);
    },
  });
}
