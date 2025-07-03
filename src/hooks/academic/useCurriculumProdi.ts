import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "../../api/Index.tsx";
import { showToast } from "../../components/admin-finance/Toastify.tsx";

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

      try {
        const response = await Api.put(`/akademik/kurikulum-prodi/add/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

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

      const response = await Api.put(`/akademik/kurikulum-prodi/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    },
    onSuccess: (data) => {
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

      const response = await Api.put(`/akademik/kurikulum-prodi/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    },
    onMutate: async (idToDelete) => {
      const toastId = showToast.loading("Menghapus data kurikulum prodi...");
      return toastId;
    },
    onSuccess: (data, variables, context) => {
      const toastId = context as string;

      queryClient.invalidateQueries({ queryKey: ["kurikulumProdi"] });
      showToast.update(toastId, {
        render: "Data kurikulum prodi berhasil dihapus.",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    },
    onError: (error: any, variables, context) => {
      const toastId = context as string;

      console.error("❌ Delete Error:", error);
      let errorMessage = "Gagal menghapus data kurikulum prodi.";

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        switch (status) {
          case 400:
            errorMessage = `Gagal menghapus: ${data.message || "Data tidak valid."}`;
            break;
          case 401:
            errorMessage = "Sesi berakhir. Silakan login kembali.";
            break;
          case 403:
            errorMessage = "Tidak memiliki akses untuk menghapus data ini.";
            break;
          case 404:
            errorMessage = "Data tidak ditemukan.";
            break;
          case 500:
            errorMessage = "Terjadi kesalahan server saat menghapus.";
            break;
          default:
            errorMessage = `Error ${status}: ${data.message || "Terjadi kesalahan tidak diketahui."}`;
        }
      } else if (error.message) {
        errorMessage = `Terjadi kesalahan: ${error.message}`;
      }

      showToast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });
}
