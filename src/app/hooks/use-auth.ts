"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  username?: string;
  email: string;
  isAdmin?: boolean;
  firstName?: string;
  lastName?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  forgotPassword: (
    email: string
  ) => Promise<{ success: boolean; message: string }>;
  resetPassword: (
    token: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    userData: RegisterData
  ) => Promise<{ success: boolean; message: string }>;
  verifyEmail: (
    token: string
  ) => Promise<{ success: boolean; message: string }>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

// Use environment variable for store ID
const storeId = process.env.NEXT_PUBLIC_STORE_ID || "fe268b7e-f2cc-459d-9619-957967ff23dc";

const useAuth = create(
  persist<AuthStore>(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Use external API URL for authentication
          const response = await fetch(`https://d1.fineyst.com/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, storeId }),
          });

          const data = await response.json();

          if (response.ok) {
            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
            });
            return { success: true, message: "Login successful" };
          } else {
            set({ isLoading: false });
            return {
              success: false,
              message: data.error || "Invalid email or password",
            };
          }
        } catch (error) {
          console.error("Login error:", error);
          set({ isLoading: false });
          return { success: false, message: "An error occurred during login" };
        }
      },

      logout: async () => {
        try {
          // Use external API URL for authentication
          await fetch(`https://d1.fineyst.com/api/auth/logout`, {
            method: "POST",
          });
        } catch (error) {
          console.error("Logout error:", error);
        }

        // Clear local state regardless of API success
        set({ user: null, token: null, isAuthenticated: false });
      },

      forgotPassword: async (email: string) => {
        try {
          // Call local API route where the logic is implemented
          const response = await fetch(`/api/auth/forgot-password`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, storeId }),
          });

          const data = await response.json();

          if (response.ok) {
            return { success: true, message: "Password reset email sent" };
          } else {
            return {
              success: false,
              message: data.error || "Failed to send reset email",
            };
          }
        } catch (error) {
          console.error("Forgot password error:", error);
          return { success: false, message: "An error occurred" };
        }
      },

      resetPassword: async (token: string, password: string) => {
        try {
          // Use external API URL for authentication
          const response = await fetch(`https://d1.fineyst.com/api/auth/reset-password`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, password, storeId }),
          });

          const data = await response.json();

          if (response.ok) {
            return { success: true, message: "Password reset successful" };
          } else {
            return {
              success: false,
              message: data.error || "Failed to reset password",
            };
          }
        } catch (error) {
          console.error("Reset password error:", error);
          return { success: false, message: "An error occurred" };
        }
      },

      register: async (userData: RegisterData) => {
        try {
          // Construct the full name from first and last name
          const name = `${userData.firstName || ""} ${
            userData.lastName || ""
          }`.trim();

          // Prepare the registration data
          const registrationData = {
            name,
            email: userData.email,
            password: userData.password,
            storeId,
            phone: userData.phone || "",
            address: userData.address || "",
            city: userData.city || "",
            state: userData.state || "",
            zipCode: userData.zipCode || "",
            country: userData.country || "",
          };

          // Use external API URL for authentication
          const response = await fetch(`https://d1.fineyst.com/api/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(registrationData),
          });

          const data = await response.json();

          if (response.ok) {
            toast.success(
              "Registration successful! Please check your email to verify your account."
            );
            return { success: true, message: "Registration successful" };
          } else {
            return {
              success: false,
              message: data.error || data.message || "Registration failed",
            };
          }
        } catch (error) {
          console.error("Registration error:", error);
          return {
            success: false,
            message: "An error occurred during registration",
          };
        }
      },

      verifyEmail: async (token: string) => {
        try {
          // Use external API URL for authentication
          const response = await fetch(`https://d1.fineyst.com/api/auth/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, storeId }),
          });

          const data = await response.json();

          if (response.ok) {
            return { success: true, message: "Email verification successful" };
          } else {
            return {
              success: false,
              message: data.error || "Email verification failed",
            };
          }
        } catch (error) {
          console.error("Email verification error:", error);
          return {
            success: false,
            message: "An error occurred during email verification",
          };
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuth;
