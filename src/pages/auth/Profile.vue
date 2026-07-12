<template>
  <div class="min-h-screen bg-slate-50 pb-24">
    <!-- Header -->
    <div class="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button @click="$router.back()" class="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-950 transition">
          <ArrowLeft class="w-4 h-4" /> Kembali
        </button>
        <h1 class="text-base font-black text-blue-950">Profil Saya</h1>
        <div class="w-16"></div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-6 py-8">

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-pulse">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center gap-4">
            <div class="w-28 h-28 bg-slate-200 rounded-full"></div>
            <div class="space-y-3 w-full">
              <div class="h-6 bg-slate-200 rounded w-1/2 mx-auto"></div>
              <div class="h-4 bg-slate-200 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
          <div class="h-36 bg-slate-200 rounded-2xl"></div>
          <div class="grid grid-cols-3 gap-4">
            <div class="h-28 bg-slate-200 rounded-2xl"></div>
            <div class="h-28 bg-slate-200 rounded-2xl"></div>
            <div class="h-28 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
        <div class="lg:col-span-3 space-y-6">
          <div class="h-80 bg-slate-200 rounded-2xl"></div>
          <div class="h-16 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>

      <!-- Content: 2 Kolom -->
      <div v-else-if="user" class="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        <!-- ============ KOLOM KIRI: PROFIL ============ -->
        <div class="lg:col-span-2 space-y-6">

          <div class="flex items-center gap-3">
            <div class="w-1.5 h-6 bg-blue-950 rounded-full"></div>
            <h2 class="text-xs font-black text-blue-950 uppercase tracking-widest">Profil</h2>
          </div>

          <!-- Identity Card -->
          <div class="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div class="flex flex-col items-center gap-5">

              <!-- Avatar -->
              <div class="relative flex-shrink-0">
                <input
                  ref="avatarInput"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                  class="hidden"
                  @change="handleAvatarSelect"
                />

                <div
                  @click="triggerAvatarUpload"
                  class="w-28 h-28 bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200 flex items-center justify-center cursor-pointer group relative"
                >
                  <img
                    v-if="avatarPreview"
                    :src="avatarPreview"
                    alt="Preview"
                    class="w-full h-full object-cover"
                  />
                  <img
                    v-else-if="getAvatarUrl(user.avatar)"
                    :src="getAvatarUrl(user.avatar)"
                    :alt="user.name"
                    class="w-full h-full object-cover"
                    @error="onAvatarError"
                  />
                  <UserCircle v-else class="w-16 h-16 text-slate-300" />

                  <div class="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-1">
                    <Loader2 v-if="isUploadingAvatar" class="w-6 h-6 text-white animate-spin" />
                    <template v-else>
                      <Camera class="w-6 h-6 text-white" />
                      <span class="text-[9px] text-white/80 font-bold">Ubah Foto</span>
                    </template>
                  </div>
                </div>

                <div v-if="isUploadingAvatar" class="absolute -bottom-2 left-0 right-0 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-950 rounded-full animate-pulse w-full"></div>
                </div>
              </div>

              <!-- User Info -->
              <div class="text-center">
                <h2 class="text-2xl font-black text-slate-800 mb-1">{{ user.name }}</h2>
                <p class="text-sm text-slate-500 mb-3">{{ user.email }}</p>

                <div class="flex flex-wrap gap-2 justify-center">
                  <span class="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-blue-950 text-white">
                    {{ formatRole(user.role) }}
                  </span>
                  <span
                    class="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border"
                    :class="user.status === 'active'
                      ? 'border-emerald-200 text-emerald-600 bg-emerald-50'
                      : user.status === 'pending'
                        ? 'border-amber-200 text-amber-600 bg-amber-50'
                        : 'border-slate-200 text-slate-500'
                    "
                  >
                    {{ formatStatus(user.status) }}
                  </span>
                </div>

                <p class="text-xs text-slate-400 mt-3">
                  Bergabung sejak {{ formatDate(user.created_at) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Wallet Card -->
          <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-950 rounded-xl flex items-center justify-center">
                  <Wallet class="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 class="text-sm font-black text-slate-800">NusaCoin Saya</h3>
                  <p class="text-[10px] text-slate-400 font-medium">Dompet digital</p>
                </div>
              </div>
              <router-link
                to="/wallet"
                class="text-xs font-bold text-blue-950 bg-blue-50 px-3.5 py-2.5 rounded-lg hover:bg-blue-100 transition no-underline flex items-center gap-1.5"
              >
                Top Up <ArrowRight class="w-3.5 h-3.5" />
              </router-link>
            </div>

            <div class="bg-slate-50 rounded-xl p-5 flex items-center justify-between border border-slate-100">
              <div>
                <p class="text-xs text-slate-400 mb-0.5">Saldo Tersedia</p>
                <h4 class="text-3xl font-black text-blue-950">{{ formatCoin(user.wallet?.balance) }}</h4>
              </div>
              <p class="text-sm text-slate-500 font-medium text-right">
                ≈ {{ formatRupiah((user.wallet?.balance || 0) * 2000) }}
              </p>
            </div>
          </div>

          <!-- Quick Stats Grid -->
          <div class="grid grid-cols-3 gap-4">
            <router-link
              to="/wishlist"
              class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all text-center no-underline group"
            >
              <div class="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-red-100 transition">
                <Heart class="w-6 h-6 text-red-500" />
              </div>
              <p class="text-2xl font-black text-slate-800 mb-0.5">{{ stats.wishlists }}</p>
              <p class="text-[10px] text-slate-400 font-bold uppercase">Wishlist</p>
            </router-link>

            <router-link
              to="/orders"
              class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all text-center no-underline group"
            >
              <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-100 transition">
                <ShoppingBag class="w-6 h-6 text-emerald-600" />
              </div>
              <p class="text-2xl font-black text-slate-800 mb-0.5">{{ stats.orders }}</p>
              <p class="text-[10px] text-slate-400 font-bold uppercase">Pesanan</p>
            </router-link>

            <router-link
              to="/my-trips"
              class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all text-center no-underline group"
            >
              <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition">
                <Map class="w-6 h-6 text-blue-600" />
              </div>
              <p class="text-2xl font-black text-slate-800 mb-0.5">{{ stats.trips }}</p>
              <p class="text-[10px] text-slate-400 font-bold uppercase">Trip Plan</p>
            </router-link>
          </div>
        </div>

        <!-- ============ KOLOM KANAN: DETAIL AKUN ============ -->
        <div class="lg:col-span-3 space-y-6">

          <div class="flex items-center gap-3">
            <div class="w-1.5 h-6 bg-blue-950 rounded-full"></div>
            <h2 class="text-xs font-black text-blue-950 uppercase tracking-widest">Detail Akun</h2>
          </div>

          <!-- Account Form -->
          <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div class="flex items-center gap-2.5 mb-6">
              <div class="w-8 h-8 bg-blue-950 rounded-lg flex items-center justify-center">
                <Settings class="w-4 h-4 text-white" />
              </div>
              <h3 class="text-sm font-black text-slate-800">Informasi Pribadi</h3>
            </div>

            <form @submit.prevent="updateProfile" class="space-y-5">
              <div>
                <label class="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Nama Lengkap</label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-950 focus:outline-none transition text-sm font-medium placeholder:text-slate-300"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Email</label>
                <input
                  :value="user.email"
                  type="email"
                  disabled
                  class="w-full px-4 py-3 border-2 border-slate-100 rounded-xl bg-slate-50 text-sm text-slate-400 cursor-not-allowed"
                />
                <p class="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <Lock class="w-3 h-3" /> Email tidak dapat diubah
                </p>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Nomor Telepon</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">+62</span>
                  <input
                    v-model="form.phone"
                    type="tel"
                    placeholder="8xxxxxxxxxx"
                    class="w-full pl-14 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-950 focus:outline-none transition text-sm font-medium placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div class="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ImageIcon class="w-4 h-4 text-blue-700" />
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-700 mb-0.5">Foto Profil</p>
                  <p class="text-[11px] text-slate-400 leading-relaxed">
                    Klik foto di sebelah kiri untuk mengubah. Maksimal 2MB, format JPG/PNG/GIF.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                :disabled="isSaving"
                class="w-full py-3.5 bg-blue-950 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
                <Save v-else class="w-4 h-4" />
                {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
            </form>
          </div>

          <button
            @click="handleLogout"
            :disabled="isLoggingOut"
            class="w-full py-4 bg-white border-2 border-red-200 text-red-600 font-bold text-sm rounded-xl hover:bg-red-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Loader2 v-if="isLoggingOut" class="w-4 h-4 animate-spin" />
            <LogOut v-else class="w-4 h-4" />
            {{ isLoggingOut ? 'Keluar...' : 'Keluar dari Akun' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import dayjs from 'dayjs'
import {
  ArrowLeft, UserCircle, Camera, Wallet, Heart, ShoppingBag, Map,
  Settings, Save, Loader2, LogOut, ArrowRight, Lock, Image as ImageIcon
} from 'lucide-vue-next'

const router = useRouter()
const toast = useToast()

const isLoading = ref(true)
const isSaving = ref(false)
const isLoggingOut = ref(false)
const isUploadingAvatar = ref(false)
const avatarPreview = ref(null)
const avatarInput = ref(null)

const user = ref(null)

const form = reactive({
  name: '',
  phone: '',
})

const stats = reactive({
  wishlists: 0,
  orders: 0,
  trips: 0
})

const getAvatarUrl = (avatar) => {
  if (!avatar) return null
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar
  }
  const apiBase = import.meta.env.VITE_API_URL || ''
  return `${apiBase}/storage/${avatar}`
}

const onAvatarError = (e) => {
  e.target.style.display = 'none'
}

const formatCoin = (val) => {
  if (!val) return '0 Coin'
  return `${Number(val).toFixed(1).replace(/\.?0+$/, '')} Coin`
}

const formatRupiah = (val) => 'Rp ' + Number(val).toLocaleString('id-ID')

const formatRole = (role) => {
  const roles = { tourist: 'Tourist', umkm: 'Pelaku UMKM', manager: 'Manager', admin: 'Admin' }
  return roles[role] || role
}

const formatStatus = (status) => {
  const statuses = { active: 'Aktif', inactive: 'Nonaktif', pending: 'Pending', rejected: 'Ditolak' }
  return statuses[status] || status
}

const formatDate = (date) => dayjs(date).format('DD MMMM YYYY')

const triggerAvatarUpload = () => {
  if (isUploadingAvatar.value) return
  avatarInput.value?.click()
}

const handleAvatarSelect = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    toast.error('Format file tidak didukung. Gunakan JPG, PNG, atau GIF.')
    resetFileInput()
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    toast.error('Ukuran foto terlalu besar. Maksimal 2MB.')
    resetFileInput()
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target.result
  }
  reader.readAsDataURL(file)

  uploadAvatar(file)
}

const uploadAvatar = async (file) => {
  isUploadingAvatar.value = true

  try {
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('avatar', file)

    const res = await api.post('/api/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    })

    user.value = res.data.user
    avatarPreview.value = null
    toast.success('Foto profil berhasil diperbarui')
  } catch (err) {
    avatarPreview.value = null
    const msg = err.response?.data?.message
    if (msg && typeof msg === 'object') {
      const firstError = Object.values(msg)[0]
      toast.error(Array.isArray(firstError) ? firstError[0] : firstError)
    } else {
      toast.error(msg || 'Gagal mengupload foto profil')
    }
  } finally {
    isUploadingAvatar.value = false
    resetFileInput()
  }
}

const resetFileInput = () => {
  if (avatarInput.value) {
    avatarInput.value.value = ''
  }
}

const fetchProfile = async () => {
  try {
    const res = await api.get('/api/auth/me')
    user.value = res.data.user
    form.name = user.value.name
    form.phone = user.value.phone || ''
  } catch (err) {
    toast.error('Gagal memuat profil')
    router.push('/login')
  } finally {
    isLoading.value = false
  }
}

const fetchStats = async () => {
  try {
    const [resWish, resOrders, resTrips] = await Promise.allSettled([
      api.get('/api/wishlists'),
      api.get('/api/orders', { params: { per_page: 1 } }),
      api.get('/api/trip-plans'),
    ])

    if (resWish.status === 'fulfilled') {
      stats.wishlists = resWish.value.data.data?.length || 0
    }
    if (resOrders.status === 'fulfilled') {
      stats.orders = resOrders.value.data.meta?.total || 0
    }
    if (resTrips.status === 'fulfilled') {
      stats.trips = resTrips.value.data.data?.length || 0
    }
  } catch (err) {
    console.error('Gagal fetch stats:', err)
  }
}

const updateProfile = async () => {
  if (!form.name.trim()) {
    toast.warning('Nama tidak boleh kosong')
    return
  }

  isSaving.value = true
  try {
    const res = await api.put('/api/auth/profile', {
      name: form.name,
      phone: form.phone || null,
    })

    user.value = res.data.user
    toast.success('Profil berhasil diperbarui')
  } catch (err) {
    const msg = err.response?.data?.message
    if (msg && typeof msg === 'object') {
      const firstError = Object.values(msg)[0]
      toast.error(Array.isArray(firstError) ? firstError[0] : firstError)
    } else {
      toast.error(msg || 'Gagal memperbarui profil')
    }
  } finally {
    isSaving.value = false
  }
}

const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    await api.post('/api/auth/logout')
  } catch (err) {
    // Tetap lanjutkan
  }
  localStorage.removeItem('cart_items')
  window.location.href = '/login'
}

onMounted(() => {
  fetchProfile()
  fetchStats()
})
</script>