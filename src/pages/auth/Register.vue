<template>
  <div class="min-h-screen flex">
    <!-- ================= FORM ================= -->
    <div
      class="w-full lg:w-[45%] bg-slate-900 flex items-center justify-center p-8 overflow-y-auto"
    >
      <div class="w-full max-w-sm py-8">
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-10">
          <span class="text-2xl font-black text-white tracking-wider">
            NusaTrip
          </span>
        </div>

        <!-- Header -->
        <div class="mb-10">
          <p class="text-emerald-400 font-bold tracking-[0.25em] text-xs mb-2">
            NUSATRIP
          </p>

          <h1 class="text-3xl font-black text-white">Buat Akun</h1>

          <p class="text-slate-400 mt-2">
            Daftar dan mulai jelajahi keindahan Nusantara.
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Nama -->
          <div>
            <input
              v-model="form.name"
              type="text"
              placeholder="Nama Lengkap"
              required
              class="w-full px-5 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
              :class="{ '!border-red-500': errors.name }"
            />

            <p v-if="errors.name" class="text-red-400 text-xs mt-1">
              {{ errors.name }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <input
              v-model="form.email"
              type="email"
              placeholder="Email"
              required
              class="w-full px-5 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
              :class="{ '!border-red-500': errors.email }"
            />

            <p v-if="errors.email" class="text-red-400 text-xs mt-1">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password -->
          <div>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                required
                class="w-full px-5 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition pr-12"
                :class="{ '!border-red-500': errors.password }"
              />

              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <EyeOff v-if="showPassword" class="w-4 h-4" />

                <Eye v-else class="w-4 h-4" />
              </button>
            </div>

            <!-- Strength -->

            <div v-if="form.password" class="flex gap-1 mt-2">
              <div
                v-for="n in 4"
                :key="n"
                class="flex-1 h-1 rounded-full"
                :class="n <= passwordStrength ? strengthColor : 'bg-slate-700'"
              ></div>
            </div>

            <p v-if="errors.password" class="text-red-400 text-xs mt-1">
              {{ errors.password }}
            </p>
          </div>

          <!-- Confirm Password -->

          <div>
            <div class="relative">
              <input
                v-model="form.password_confirmation"
                :type="showConfirm ? 'text' : 'password'"
                placeholder="Konfirmasi Password"
                required
                class="w-full px-5 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition pr-12"
                :class="{ '!border-red-500': errors.password_confirmation }"
              />

              <button
                type="button"
                @click="showConfirm = !showConfirm"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <EyeOff v-if="showConfirm" class="w-4 h-4" />

                <Eye v-else class="w-4 h-4" />
              </button>
            </div>

            <p
              v-if="errors.password_confirmation"
              class="text-red-400 text-xs mt-1"
            >
              {{ errors.password_confirmation }}
            </p>
          </div>

          <!-- Error -->

          <div
            v-if="errors.general"
            class="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm"
          >
            {{ errors.general }}
          </div>

          <!-- Button -->

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />

            {{ isLoading ? "Memproses..." : "Daftar" }}
          </button>
        </form>

        <!-- Footer -->

        <p class="text-center text-slate-500 mt-8 text-sm">
          Sudah punya akun?

          <router-link
            to="/login"
            class="text-emerald-400 font-semibold hover:text-emerald-300 no-underline"
          >
            Masuk
          </router-link>
        </p>

        <div class="text-center mt-4">
          <router-link
            to="/"
            class="text-xs text-slate-600 hover:text-slate-400 no-underline"
          >
            ← Kembali
          </router-link>
        </div>
      </div>
    </div>

    <!-- ================= HERO ================= -->

    <div class="hidden lg:flex lg:w-[55%] relative overflow-hidden">
      <!-- Background -->

      <img
        src="https://plus.unsplash.com/premium_photo-1676496046182-356a6a0ed002?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <!-- Overlay -->

      <div
        class="absolute inset-0 bg-gradient-to-l from-black/80 via-black/50 to-black/20"
      ></div>

      <!-- Blur Decoration -->

      <div
        class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl"
      ></div>

      <div
        class="absolute inset-0 flex flex-col items-center justify-center px-16 pb-28"
      >
        <!-- Ganti src ini dengan gambar milikmu -->

        <img
  :src="registerIllustration"
  alt="Register Illustration"
  class="w-[450px] h-auto mb-8 drop-shadow-2xl"
/>

       <p class="text-emerald-400 tracking-[0.35em] text-sm font-bold mb-4 text-center">
  NUSATRIP
</p>

<h2 class="text-white text-5xl font-black leading-tight text-center mb-5">
  Mulai <br />
  Petualanganmu
</h2>

<p class="text-slate-300 text-lg leading-relaxed max-w-lg mx-auto text-center">
  Buat akun sekarang dan nikmati pengalaman menjelajahi destinasi wisata,
  menemukan UMKM lokal, serta berbagai layanan menarik di seluruh Nusantara.
</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";
import { Eye, EyeOff, Loader2 } from "lucide-vue-next";
import registerIllustration from "@/assets/images/regis.png";

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const isLoading = ref(false);
const showPassword = ref(false);
const showConfirm = ref(false);

const form = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const errors = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  general: "",
});

const passwordStrength = computed(() => {
  const p = form.password;
  if (!p) return 0;
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
});

const strengthColor = computed(() => {
  const c = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500"];
  return c[passwordStrength.value - 1] || "bg-slate-700";
});

const validate = () => {
  let valid = true;
  Object.keys(errors).forEach((k) => (errors[k] = ""));

  if (!form.name) {
    errors.name = "Nama wajib diisi";
    valid = false;
  }
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Email tidak valid";
    valid = false;
  }
  if (!form.password || form.password.length < 8) {
    errors.password = "Password minimal 8 karakter";
    valid = false;
  }
  if (form.password !== form.password_confirmation) {
    errors.password_confirmation = "Password tidak cocok";
    valid = false;
  }

  return valid;
};

const handleRegister = async () => {
  if (!validate()) return;

  isLoading.value = true;
  try {
    await authStore.register(form);
    toast.success("Registrasi berhasil!");
    router.push("/login");
  } catch (error) {
    const data = error.response?.data;
    if (data?.errors) {
      if (data.errors.email) errors.email = data.errors.email[0];
      if (data.errors.password) errors.password = data.errors.password[0];
      if (data.errors.name) errors.name = data.errors.name[0];
    }
    errors.general = data?.message || "Registrasi gagal";
    toast.error(errors.general);
  } finally {
    isLoading.value = false;
  }
};
</script>
