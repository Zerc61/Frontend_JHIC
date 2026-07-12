<template>
  <div class="min-h-screen flex">
    <!-- ===== KIRI: FOTO + ILUSTRASI + TEKS ===== -->
 <div class="hidden lg:flex lg:w-[55%] relative overflow-hidden">
  <!-- Background -->
  <img
    src="https://plus.unsplash.com/premium_photo-1725408013619-e490825f0d97?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    alt="Travel"
    class="w-full h-full object-cover"
  />

  <!-- Overlay -->
  <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

  <!-- Konten -->
  <div class="absolute inset-0 flex items-center">
    <div class="px-20 flex items-center justify-between w-full">

      <!-- Teks -->
      <div class="max-w-md">
        <p class="text-amber-400 text-sm font-bold tracking-[0.35em] mb-4">
          NUSATRIP
        </p>

        <h2 class="text-white text-6xl font-black leading-tight mb-6">
          Selamat <br />
          Datang <br />
          Kembali
        </h2>

        <p class="text-white/70 text-lg leading-relaxed">
          Masuk dan lanjutkan petualanganmu di Nusantara.
        </p>
      </div>

      <!-- Ilustrasi -->
      <div class="flex-shrink-0">
        <img
          :src="travelIllustration"
          alt="Traveler"
          class="w-[420px] h-auto drop-shadow-2xl"
        />
      </div>

    </div>
  </div>
</div>

    <!-- ===== KANAN: FORM ===== -->
    <div class="w-full lg:w-[45%] bg-slate-900 flex items-center justify-center p-8">
      <div class="w-full max-w-sm">
        
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-10">
          <span class="text-2xl font-black text-white tracking-wider">NusaTrip</span>
        </div>

        <!-- Header -->
        <div class="mb-10">
          <h1 class="text-2xl font-black text-white">Masuk</h1>
          <p class="text-slate-400 text-sm mt-1">Gunakan akun yang terdaftar</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          
          <div>
            <input
              v-model="form.email"
              type="email"
              placeholder="Email"
              required
              class="w-full px-5 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
              :class="{ '!border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="text-red-400 text-xs mt-1.5">{{ errors.email }}</p>
          </div>

          <div>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                required
                class="w-full px-5 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition pr-12"
                :class="{ '!border-red-500': errors.password }"
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
              >
                <EyeOff v-if="showPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
            <p v-if="errors.password" class="text-red-400 text-xs mt-1.5">{{ errors.password }}</p>
          </div>

          <div v-if="errors.general" class="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl">
            {{ errors.general }}
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
            {{ isLoading ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>

        <p class="text-center text-sm text-slate-500 mt-8">
          Belum punya akun? 
          <router-link to="/register" class="text-blue-400 font-bold hover:text-blue-300 no-underline">Daftar</router-link>
        </p>

        <div class="text-center mt-4">
          <router-link to="/" class="text-xs text-slate-600 hover:text-slate-400 transition no-underline">← Kembali</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { Eye, EyeOff, Loader2 } from 'lucide-vue-next'
import travelIllustration from '@/assets/images/travell.png'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const isLoading = ref(false)
const showPassword = ref(false)

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '', general: '' })

const validate = () => {
  let valid = true
  errors.email = ''
  errors.password = ''
  errors.general = ''
  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = 'Email tidak valid'; valid = false }
  if (!form.password || form.password.length < 8) { errors.password = 'Password minimal 8 karakter'; valid = false }
  return valid
}

const handleLogin = async () => {
  if (!validate()) return
  isLoading.value = true
  try {
    await authStore.login({ email: form.email, password: form.password })
    toast.success('Login berhasil!')
    router.push(route.query.redirect || '/')
  } catch (error) {
    errors.general = error.response?.data?.message || 'Login gagal'
    toast.error(errors.general)
  } finally {
    isLoading.value = false
  }
}
</script>