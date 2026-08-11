import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index.tsx";

export interface AddRpsPayload {
  siakProgramStudiId: string;
  siakPeriodeAkademikId: string;
  siakTahunKurikulumId: string;
  siakMataKuliahId: string;
  dosenIds: string[];
  tanggalPenyusun: string;
  deskripsiMataKuliah: string;
  tujuanMataKuliah: string;
  materiPembelajaran: string;
  pustakaUtama: string;
  pustakaPendukung: string;
}

export function getRps() {
  return useQuery({
    queryKey: ["rps"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const response = await Api.get("/akademik/rps", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("🔍 Raw RPS API data:", response.data.data);
      return response.data.data;
    },
  });
}

export function getRpsMatkulById(id: string) {
  return useQuery({
    queryKey: ["rps", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const response = await Api.get(`/akademik/mata-kuliah/${id}/rps`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("🔍 Raw RPS API data:", response.data.data);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function getRpsDocumentById(id: string) {
  return useQuery({
    queryKey: ["rpsDocument", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const response = await Api.get(`/akademik/rps/${id}/dokumen-rps`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("🔍 Raw dokumen API data:", response.data);
      return response.data;
    },
    enabled: !!id,
  });
}

export function getKelas() {
  return useQuery({
    queryKey: ["kelas"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      const response = await Api.get("/akademik/kelas-kuliah", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("🔍 Raw kelas API data:", response.data.data);
      return response.data.data;
    },
  });
}

// --- mutation for add rps ---
export function useAddRps() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      // Enhanced logging untuk debugging
      console.log("📦 Mengirim FormData dengan field terpisah ke API:");

      // Log FormData contents dengan lebih detail
      const formDataEntries: Record<string, any> = {};
      for (const pair of formData.entries()) {
        const key = pair[0];
        const value = pair[1];

        if (value instanceof File) {
          formDataEntries[key] = {
            type: "File",
            name: value.name,
            size: value.size,
            type_file: value.type,
          };
          console.log(`${key}: File - ${value.name} (${value.size} bytes, ${value.type})`);
        } else {
          formDataEntries[key] = value;
          console.log(`${key}: ${value}`);
        }
      }

      // Parse dan validate request JSON
      const requestString = formData.get("request") as string;
      if (requestString) {
        try {
          const requestData = JSON.parse(requestString);
          console.log("📋 Parsed request data:", requestData);

          // Validate required fields
          const requiredFields = ["siakProgramStudiId", "siakPeriodeAkademikId", "siakTahunKurikulumId", "siakMataKuliahId", "tanggalPenyusun", "dosenIds"];

          const missingFields = requiredFields.filter((field) => !requestData[field]);
          if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
          }

          // Validate dosenIds array
          if (!Array.isArray(requestData.dosenIds) || requestData.dosenIds.length === 0) {
            throw new Error("dosenIds must be a non-empty array");
          }
        } catch (parseError) {
          console.error("❌ Error parsing request JSON:", parseError);
          throw new Error(`Invalid request format: ${parseError instanceof Error ? parseError.message : "Unknown error"}`);
        }
      }

      try {
        const response = await Api.post("/akademik/rps", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type, let browser set it with boundary for multipart/form-data
          },
          timeout: 30000, // 30 second timeout
        });

        console.log("✅ RPS berhasil dibuat:", response.data);
        return response.data;
      } catch (apiError: any) {
        console.error("❌ API Error details:", {
          message: apiError.message,
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
          config: {
            url: apiError.config?.url,
            method: apiError.config?.method,
            headers: apiError.config?.headers,
          },
        });

        // Re-throw with more specific error message
        if (apiError.response?.status === 500) {
          throw new Error(`Server error: ${apiError.response?.data?.message || "Internal server error occurred"}`);
        } else if (apiError.response?.status === 400) {
          throw new Error(`Bad request: ${apiError.response?.data?.message || "Invalid data provided"}`);
        } else if (apiError.response?.status === 401) {
          throw new Error("Authentication failed. Please login again.");
        } else if (apiError.response?.status === 403) {
          throw new Error("Permission denied. You are not authorized to perform this action.");
        } else {
          throw new Error(`Request failed: ${apiError.message}`);
        }
      }
    },

    onSuccess: (data) => {
      console.log("🔄 Invalidating RPS queries...");
      queryClient.invalidateQueries({ queryKey: ["rps"] });

      // Optionally invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["rpsDetail"] });
    },

    onError: (error: any) => {
      console.error("❌ Mutation failed:", error);
    },
  });
}

export function useMapKelasToRps() {
  const queryClient = useQueryClient();

  return useMutation({
    // Payloadnya sekarang sederhana dan sesuai dokumentasi
    mutationFn: async (payload: { rpsId: string; kelasIds: string[] }) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan.");

      console.log("MENGIRIM POST ke endpoint yang BENAR: /akademik/rps/kelas-rps", payload);

      const response = await Api.post("/akademik/rps/kelas-rps", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    },
    onSuccess: () => {
      console.log("✅ Pemetaan kelas berhasil disimpan!");
      // toast.success("Pemetaan kelas berhasil disimpan!");
      queryClient.invalidateQueries({ queryKey: ["rps"] });
    },
    onError: (error: any) => {
      console.error("❌ Gagal menyimpan pemetaan kelas:", error);
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan pada server.";
      // toast.error(`Gagal menyimpan: ${errorMessage}`);
    },
  });
}

export function useDeleteRps() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan. Silakan login terlebih dahulu.");

      await Api.delete(`/akademik/rps/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rps"] });
    },
  });
}
