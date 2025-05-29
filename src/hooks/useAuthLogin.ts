// src/hooks/useAuthLogin.ts
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { Api } from '../api/Index'; // Adjust path as needed

interface LoginCredentials {
    username: string;
    password: string;
}

// Define this based on your actual API response structure for user data
export interface UserLoginData {
    token: string;
    user: {
        id: string; // Or number
        username: string;
        roles: string[];
        // Add other relevant user properties
    };
    // any other data returned on successful login
}

interface UseAuthLoginOptions {
    onSuccess?: (data: UserLoginData) => void;
    onError?: (error: Error) => void; // Use Error type or a more specific custom error type
}

// Define what the hook will return more explicitly
interface UseAuthLoginReturn {
    login: (credentials: LoginCredentials) => void;
    isLoggingIn: boolean;
    error: Error | null;
    // data: UserLoginData | undefined; // Optional, if the component needs direct access to the data
}

export function useAuthLogin({
                                 onSuccess,
                                 onError,
                             }: UseAuthLoginOptions): UseAuthLoginReturn {
    const loginMutation: UseMutationResult<UserLoginData, Error, LoginCredentials> = useMutation<
        UserLoginData,
        Error,
        LoginCredentials
    >({
        mutationFn: async (credentials: LoginCredentials) => {
            const res = await Api.post("/auth/login", credentials);
            if (res.data && res.data.data) { // Or however your API response is structured
                return res.data.data as UserLoginData;
            }
            throw new Error(res.data?.message || "Login failed due to an unknown error");
        },
        onSuccess: (data: UserLoginData) => {
            // Core success actions (like saving to localStorage) can happen here
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Then call the provided onSuccess callback for component-specific actions
            if (onSuccess) {
                onSuccess(data);
            }
        },
        onError: (error: Error) => {
            // Core error logging can happen here
            console.error("Login API error:", error);

            // Then call the provided onError callback for component-specific actions
            if (onError) {
                onError(error);
            }
        },
    });

    return {
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        error: loginMutation.error,
        // data: loginMutation.data,
    };
}