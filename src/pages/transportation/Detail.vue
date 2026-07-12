<template>
  <div class="min-h-screen bg-slate-50 pb-24">
    <div class="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button @click="$router.back()" class="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-950 transition"><ArrowLeft class="w-4 h-4" /> Kembali</button>
        <h1 class="text-base font-black text-blue-950">Detail Transportasi</h1>
        <div class="w-16"></div>
      </div>
    </div>

    <div v-if="isLoading" class="max-w-6xl mx-auto px-6 py-6 animate-pulse space-y-6">
      <div class="h-72 bg-slate-200 rounded-2xl"></div>
      <div class="h-8 bg-slate-200 rounded w-1/2"></div>
    </div>

    <div v-else-if="transport" class="max-w-6xl mx-auto px-6 py-6 space-y-6">
      <!-- Gallery -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden">
        <div class="md:col-span-2 h-72 md:h-96 bg-slate-100 overflow-hidden">
          <img v-if="galleries[0]" :src="galleries[0].image" class="w-full h-full object-cover" />
          <Car v-else class="w-20 h-20 text-slate-300 mx-auto mt-36" />
        </div>
        <div v-for="g in galleries.slice(1, 4)" :key="g.id" class="hidden md:block h-48 bg-slate-100 overflow-hidden">
          <img :src="g.image" :alt="g.caption" class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- Info -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div class="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-950 text-white mb-2 inline-block">{{ transport.type }}</span>
            <h2 class="text-2xl font-black text-slate-800 mt-1">{{ transport.name }}</h2>
          </div>
          <p class="text-2xl font-black text-blue-950">
            Rp {{ Number(transport.price_per_day).toLocaleString('id-ID') }}
            <span class="text-xs font-medium text-slate-400">/hari</span>
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="flex items-center gap-2 text-sm text-slate-500">
            <Users class="w-4 h-4 text-slate-400" />
            <span>{{ transport.capacity }} orang</span>
          </div>
          <div class="flex items-center gap-2 text-sm" :class="transport.includes_driver ? 'text-emerald-600' : 'text-slate-400'">
            <Check v-if="transport.includes_driver" class="w-4 h-4" />
            <X v-else class="w-4 h-4" />
            <span>Supir</span>
          </div>
          <div class="flex items-center gap-2 text-sm" :class="transport.includes_fuel ? 'text-emerald-600' : 'text-slate-400'">
            <Check v-if="transport.includes_fuel" class="w-4 h-4" />
            <X v-else class="w-4 h-4" />
            <span>Bahan Bakar</span>
          </div>
          <div v-if="transport.phone" class="flex items-center gap-2 text-sm text-slate-500">
            <Phone class="w-4 h-4 text-slate-400" />
            <span>{{ transport.phone }}</span>
          </div>
        </div>

        <p class="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{{ transport.description }}</p>
      </div>

      <!-- Booking Form -->
      <div class="bg-white rounded-2xl border-2 border-blue-950 p-6 shadow-sm">
        <div class="flex items-center gap-2.5 mb-6">
          <div class="w-8 h-8 bg-blue-950 rounded-lg flex items-center justify-center"><Calendar class="w-4 h-4 text-white" /></div>
          <h3 class="text-sm font-black text-slate-800">Sewa Kendaraan</h3>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Tanggal Mulai</label>
            <input v-model="form.start_date" type="date" :min="minDate" class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-950 focus:outline-none transition text-sm" @change="calcPrice" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Tanggal Selesai</label>
            <input v-model="form.end_date" type="date" :min="form.start_date || minDate" class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-950 focus:outline-none transition text-sm" @change="calcPrice" />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Lokasi Penjemputan (opsional)</label>
            <input v-model="form.pickup_location" type="text" placeholder="Contoh: Bandara Lombok, Terminal" class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-950 focus:outline-none transition text-sm" />
          </div>
        </div>

        <div v-if="days > 0" class="bg-slate-50 rounded-xl p-5 border border-slate-100 mb-5">
          <div class="flex justify-between text-sm text-slate-500 mb-1">
            <span>{{ transport.name }} × {{ days }} hari</span>
            <span>Rp {{ Number(transport.price_per_day * days).toLocaleString('id-ID') }}</span>
          </div>
          <div class="flex justify-between text-lg font-black text-slate-800 pt-2 border-t border-slate-200 mt-2">
            <span>Total</span>
            <span class="text-blue-950">Rp {{ totalPrice.toLocaleString('id-ID') }}</span>
          </div>
          <p class="text-xs text-slate-400 mt-2">≈ {{ coinAmount }} NusaCoin</p>
        </div>

        <button @click="submitBooking" :disabled="isBooking || days === 0" class="w-full py-3.5 bg-blue-950 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          <Loader2 v-if="isBooking" class="w-4 h-4 animate-spin" />
          <CreditCard v-else class="w-4 h-4" />
          {{ isBooking ? 'Memproses...' : `Bayar ${coinAmount} Coin` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import dayjs from 'dayjs'
import { ArrowLeft, Car, Users, Check, X, Phone, Calendar, CreditCard, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()

const transport = ref(null)
const galleries = ref([])
const isLoading = ref(true)
const isBooking = ref(false)

const minDate = dayjs().add(1, 'day').format('YYYY-MM-DD')
const form = ref({ start_date: '', end_date: '', pickup_location: '' })

const days = computed(() => {
  if (!form.value.start_date || !form.value.end_date) return 0
  return Math.max(1, dayjs(form.value.end_date).diff(dayjs(form.value.start_date), 'day'))
})

const totalPrice = computed(() => transport.value ? transport.value.price_per_day * days.value : 0)
const coinAmount = computed(() => (totalPrice.value / 2000).toFixed(1))

const calcPrice = () => {
  if (form.value.start_date && !form.value.end_date) {
    form.value.end_date = dayjs(form.value.start_date).add(1, 'day').format('YYYY-MM-DD')
  }
}

const fetchTransport = async () => {
  isLoading.value = true
  try {
    const res = await api.get(`/api/transportations/${route.params.slug}`)
    transport.value = res.data.data
    galleries.value = res.data.data.galleries || []
  } catch {
    toast.error('Transportasi tidak ditemukan')
    router.push({ name: 'transportations' })
  } finally { isLoading.value = false }
}

const submitBooking = async () => {
  if (!authStore.isLoggedIn) {
    toast.error('Silakan login terlebih dahulu untuk melakukan booking')
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  if (days.value === 0) { toast.warning('Pilih tanggal sewa'); return }
  isBooking.value = true
  try {
    const res = await api.post('/api/bookings', {
      booking_type: 'transportation',
      transportation_id: transport.value.id,
      ...form.value,
    })
    toast.success('Booking berhasil!')
    router.push({ name: 'booking.detail', params: { bookingNumber: res.data.data.booking_number } })
  } catch (err) {
    const msg = err.response?.data?.message
    toast.error(msg && typeof msg === 'object' ? Object.values(msg)[0][0] : (msg || 'Gagal'))
  } finally { isBooking.value = false }
}

onMounted(fetchTransport)
</script>
