import { defineStore } from "pinia";
import api from "@/services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("auth_token") || null,
    isLoading: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
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
        this.token = null;
        localStorage.removeItem("auth_token");
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
        this.token = res.data.token;
        localStorage.setItem("auth_token", res.data.token);
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
      } catch (error) {
        console.error("Logout error", error);
      } finally {
        this.user = null;
        this.token = null;
        localStorage.removeItem("auth_token");
        // Also clear any lingering session cookie (optional)
        document.cookie.split(";").forEach(cookie => {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
          document.cookie = name.trim() + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        });
      }
    },
  },
});
