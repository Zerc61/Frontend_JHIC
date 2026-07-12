<template>
  <div class="min-h-screen bg-slate-50 pb-24">
    <div class="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <button @click="$router.back()" class="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-950 transition"><ArrowLeft class="w-4 h-4" /> Kembali</button>
        <h1 class="text-base font-black text-blue-950">Booking Saya</h1>
        <div class="w-16"></div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-6 py-6">
      <!-- Tabs -->
      <div class="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        <button
          v-for="t in tabs"
          :key="t.value"
          @click="activeTab = t.value; fetchBookings()"
          class="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition whitespace-nowrap"
          :class="activeTab === t.value ? 'bg-blue-950 text-white border-blue-950' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-950'"
        >{{ t.label }}</button>
      </div>

      <div v-if="isLoading" class="space-y-4">
        <div v-for="n in 3" :key="n" class="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
          <div class="h-5 bg-slate-200 rounded w-1/3 mb-3"></div>
          <div class="h-4 bg-slate-200 rounded w-2/3"></div>
        </div>
      </div>

      <div v-else-if="bookings.length" class="space-y-4">
        <router-link
          v-for="b in bookings"
          :key="b.id"
          :to="{ name: 'booking.detail', params: { bookingNumber: b.booking_number } }"
          class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all no-underline block"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-bold text-slate-400 font-mono">{{ b.booking_number }}</span>
            <span
              class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
              :class="statusClass(b.status)"
            >{{ statusLabel(b.status) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-black text-slate-800 mb-0.5">
                {{ bookingTitle(b) }}
              </p>
              <p class="text-xs text-slate-400">{{ formatDateTime(b.created_at) }}</p>
            </div>
            <p class="text-base font-black text-blue-950">
              {{ b.coin_amount }} <span class="text-xs font-medium text-slate-400">Coin</span>
            </p>
          </div>
        </router-link>
      </div>

      <div v-else class="text-center py-20">
        <Ticket class="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <p class="text-sm text-slate-400 font-medium">Belum ada booking</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import dayjs from 'dayjs'
import { ArrowLeft, Ticket } from 'lucide-vue-next'

const bookings = ref([])
const isLoading = ref(true)
const activeTab = ref(null)

const tabs = [
  { value: null, label: 'Semua' },
  { value: 'hotel', label: '🏨 Hotel' },
  { value: 'transportation', label: '🚗 Transportasi' },
  { value: 'travel_package', label: '📦 Paket Wisata' },
]

const statusClass = (s) => ({
  paid: 'bg-blue-50 text-blue-600',
  confirmed: 'bg-emerald-50 text-emerald-600',
  completed: 'bg-slate-100 text-slate-500',
  cancelled: 'bg-red-50 text-red-500',
  refunded: 'bg-amber-50 text-amber-600',
}[s] || 'bg-slate-100 text-slate-500')

const statusLabel = (s) => ({
  pending: 'Pending', paid: 'Dibayar', confirmed: 'Dikonfirmasi',
  completed: 'Selesai', cancelled: 'Dibatalkan', refunded: 'Refund',
}[s] || s)

const bookingTitle = (b) => {
  if (b.booking_type === 'hotel' && b.hotel_detail) return b.hotel_detail.hotel_name
  if (b.booking_type === 'transportation' && b.transport_detail) return b.transport_detail.transport_name
  if (b.booking_type === 'travel_package' && b.package_detail) return b.package_detail.package_name
  return b.booking_type
}

const formatDateTime = (d) => dayjs(d).format('D MMM YYYY · HH:mm')

const fetchBookings = async () => {
  isLoading.value = true
  try {
    const params = { per_page: 20 }
    if (activeTab.value) params.type = activeTab.value
    const res = await api.get('/api/bookings', { params })
    bookings.value = res.data.data
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

onMounted(fetchBookings)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>