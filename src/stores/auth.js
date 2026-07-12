import { defineStore } from "pinia";
import api from "@/services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isLoading: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    isTourist: (state) => state.user?.role === "tourist",
    isUmkm: (state) => state.user?.role === "umkm",
    isManager: (state) => state.user?.role === "manager",
    isAdmin: (state) => state.user?.role === "admin",
  },

  actions: {
    async fetchUser() {
      this.isLoading = true;
      try {
        const res = await api.get("/api/auth/me");
        this.user = res.data.user;
      } catch {
        this.user = null;
      } finally {
        this.isLoading = false;
      }
    },

    async login(credentials) {
      this.isLoading = true;
      try {
        await api.get("/sanctum/csrf-cookie");
        const res = await api.post("/api/auth/login", credentials);
        this.user = res.data.user;
        return res;
      } finally {
        this.isLoading = false;
      }
    },

    async register(data) {
      this.isLoading = true;
      try {
        const res = await api.post("/api/auth/register", data);
        return res;
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      try {
        await api.post("/api/auth/logout");
        this.user = null;
      } catch (error) {
        console.error("Logout error", error);
      }
    },
  },
});
