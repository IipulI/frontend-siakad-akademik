// src/hooks/useAuthLogin.ts
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { Api } from "../api/Index"; // Sesuaikan path jika perlu

// 1. Ubah kredensial agar sesuai dengan form (username/email dan password)
export interface LoginCredentials {
  username?: string;
  email?: string;
  password: string;
}

// 2. Interface data dari backend saat login sukses
export interface UserLoginData {
  token: string;
  user: {
    id: string; 
    username: string;
    email?: string;
    // Tambahkan properti user lainnya jika ada
  };
  account_info: {
    id: string;
    nama: string;
    // Tambahkan properti spesifik role (seperti NIM/NIDN) jika ada
  };
}

interface UseAuthLoginOptions {
  onSuccess?: (data: UserLoginData) => void;
  onError?: (error: Error) => void; 
}

interface UseAuthLoginReturn {
  login: (credentials: LoginCredentials) => void;
  isLoggingIn: boolean;
  error: Error | null;
}

export function useAuthLogin({
  onSuccess,
  onError,
}: UseAuthLoginOptions): UseAuthLoginReturn {
  const loginMutation: UseMutationResult<
    UserLoginData,
    Error,
    LoginCredentials
  > = useMutation<UserLoginData, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      // 3. Ubah menjadi POST dan arahkan ke endpoint yang benar
      const res = await Api.post("/auth/login", credentials);
      
      // Backend ResponseBuilder mengembalikan struktur: { status, message, data, ... }
      if (res.data && res.data.data) {
        return res.data.data as UserLoginData;
      }
      
      throw new Error(
        res.data?.message || "Login gagal karena kesalahan sistem"
      );
    },
    onSuccess: (data: UserLoginData) => {
      // 4. Menyimpan data ke localStorage sesuai arsitektur frontend
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Pastikan account_info ada sebelum di-stringify (untuk berjaga-jaga jika admin tidak punya account_info)
      if (data.account_info) {
        localStorage.setItem("account_info", JSON.stringify(data.account_info));
      }

      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error: Error) => {
      console.error("Login API error:", error);

      if (onError) {
        onError(error);
      }
    },
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    error: loginMutation.error,
  };
}