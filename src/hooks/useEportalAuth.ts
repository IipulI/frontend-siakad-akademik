import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface UserResponse {
  status: number;
  message: string;
  data: any; // kamu bisa bikin type detailnya kalau sudah fix
}
export function useAuthenticateEportal(
  token: string,
  role_id: string,
  appModule_id: string,
  unit_id: string
) {
  return useQuery<UserResponse>({
    queryKey: ["userData", token, role_id, appModule_id, unit_id],
    queryFn: async () => {
      const response = await axios.get(
        "https://eportal.uika-bogor.ac.id/api/call_user",
        {
          params: { token, role_id, appModule_id, unit_id },
        }
      );
      return response.data;
    },
    enabled: !!token && !!role_id && !!appModule_id && !!unit_id,
    retry: false, // 🚀 matiin retry dulu biar jelas errornya
  });
}
