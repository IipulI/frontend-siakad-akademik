import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface UserResponse {
  status: number;
  message: string;
  data: any;
}

export function useAuthenticateEportal(
  token: string,
  role_id: string,
  appModule_id: string,
  unit_id: string,
) {
  return useQuery<UserResponse>({
    queryKey: ["userData", token, role_id, appModule_id, unit_id],
    queryFn: async () => {
      // ← panggil BE SIAKAD sendiri, bukan E-Portal langsung
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/sso/callback`,
        {
          params: { token, role_id, appModule_id, unit_id },
        },
      );
      return response.data;
    },
    enabled: !!token && !!role_id && !!appModule_id,
    retry: false,
  });
}
