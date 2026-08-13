import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Helper ambil cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// CSRF handling
let isFetchingCsrf = false;
let csrfPromise = null;

async function getCsrfCookie() {
  if (!isFetchingCsrf) {
    isFetchingCsrf = true;
    csrfPromise = api.get("/sanctum/csrf-cookie").finally(() => {
      isFetchingCsrf = false;
    });
  }
  return csrfPromise;
}

// Request interceptor
api.interceptors.request.use(async (config) => {
  // Ambil token dari localStorage (jika ada)
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // CSRF protection untuk request non-GET
  if (["post", "put", "patch", "delete"].includes(config.method)) {
    await getCsrfCookie();
    const token = getCookie("XSRF-TOKEN");
    if (token) {
      config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
    }
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized, silakan login lagi.");
      // Bersihkan token karena kemungkinan expired/revoked
      localStorage.removeItem("auth_token");
    }
    return Promise.reject(error);
  },
);

export default api;
