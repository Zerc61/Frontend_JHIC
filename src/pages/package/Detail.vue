<template>
  <div class="min-h-screen bg-slate-50 pb-24">
    <div class="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button @click="$router.back()" class="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-950 transition"><ArrowLeft class="w-4 h-4" /> Kembali</button>
        <h1 class="text-base font-black text-blue-950">Detail Paket</h1>
        <div class="w-16"></div>
      </div>
    </div>

    <div v-if="isLoading" class="max-w-6xl mx-auto px-6 py-6 animate-pulse space-y-6">
      <div class="h-80 bg-slate-200 rounded-2xl"></div>
      <div class="h-8 bg-slate-200 rounded w-1/2"></div>
    </div>

    <div v-else-if="pkg" class="max-w-6xl mx-auto px-6 py-6 space-y-6">

      <!-- Gallery -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 rounded-2xl overflow-hidden">
        <div class="col-span-2 h-72 md:h-96 bg-slate-100 overflow-hidden">
          <img v-if="galleries[0]" :src="galleries[0].image" class="w-full h-full object-cover" />
        </div>
        <div v-for="g in galleries.slice(1, 5)" :key="g.id" class="h-36 md:h-48 bg-slate-100 overflow-hidden">
          <img :src="g.image" :alt="g.caption" class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- Main Info -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div class="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-950 text-white mb-2 inline-block">
              {{ pkg.duration_days }}H{{ pkg.duration_nights ? pkg.duration_nights + 'M' : '' }}
            </span>
            <h2 class="text-2xl font-black text-slate-800 mt-1">{{ pkg.name }}</h2>
          </div>
          <p class="text-2xl font-black text-blue-950">
            Rp {{ Number(pkg.price_per_person).toLocaleString('id-ID') }}
            <span class="text-xs font-medium text-slate-400">/orang</span>
          </p>
        </div>

        <p class="text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-6">{{ pkg.description }}</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Included -->
          <div>
            <h4 class="text-xs font-black text-emerald-600 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Check class="w-3.5 h-3.5" /> Termasuk</h4>
            <ul class="space-y-1.5">
              <li v-for="item in pkg.included_items" :key="item" class="text-sm text-slate-600 flex items-start gap-2">
                <span class="w-1 h-1 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>{{ item }}
              </li>
            </ul>
          </div>
          <!-- Excluded -->
          <div>
            <h4 class="text-xs font-black text-red-500 uppercase tracking-wider mb-3 flex items-center gap-1.5"><X class="w-3.5 h-3.5" /> Tidak Termasuk</h4>
            <ul class="space-y-1.5">
              <li v-for="item in pkg.excluded_items" :key="item" class="text-sm text-slate-400 flex items-start gap-2">
                <span class="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>{{ item }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Referensi -->
        <div v-if="pkg.hotel || pkg.transportation" class="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-if="pkg.hotel" class="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Hotel</p>
            <p class="text-sm font-bold text-slate-700">{{ pkg.hotel.name }}</p>
          </div>
          <div v-if="pkg.transportation" class="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Transportasi</p>
            <p class="text-sm font-bold text-slate-700">{{ pkg.transportation.name }} ({{ pkg.transportation.type }})</p>
          </div>
        </div>
      </div>

      <!-- Schedules + Booking -->
      <div class="bg-white rounded-2xl border-2 border-blue-950 p-6 shadow-sm">
        <div class="flex items-center gap-2.5 mb-6">
          <div class="w-8 h-8 bg-blue-950 rounded-lg flex items-center justify-center"><Calendar class="w-4 h-4 text-white" /></div>
          <h3 class="text-sm font-black text-slate-800">Pilih Jadwal & Pesan</h3>
        </div>

        <!-- Schedule Picker -->
        <div class="space-y-3 mb-6">
          <div
            v-for="s in pkg.schedules"
            :key="s.id"
            @click="selectSchedule(s)"
            class="flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all"
            :class="selectedSchedule?.id === s.id ? 'border-blue-950 bg-blue-50' : 'border-slate-200 hover:border-slate-300'"
            :style="!s.is_available ? 'opacity:0.5; pointer-events:none' : ''"
          >
            <div>
              <p class="text-sm font-bold text-slate-800">{{ formatDate(s.departure_date) }} — {{ formatDate(s.return_date) }}</p>
              <p class="text-[11px] text-slate-400 mt-0.5">Kapasitas {{ s.max_capacity }} orang</p>
            </div>
            <span
              class="text-xs font-bold px-3 py-1.5 rounded-lg"
              :class="s.is_available ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'"
            >
              {{ s.is_available ? `${s.remaining_slots} slot` : 'Penuh' }}
            </span>
          </div>
        </div>

        <!-- Traveler Form (muncul setelah pilih jadwal) -->
        <div v-if="selectedSchedule" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Jumlah Peserta</label>
            <input v-model.number="form.total_travelers" type="number" :min="1" :max="selectedSchedule.remaining_slots" class="w-full sm:w-48 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-950 focus:outline-none transition text-sm" @input="updateTravelerNames" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Nama Peserta</label>
            <div class="space-y-2">
              <input
                v-for="(name, i) in form.traveler_names"
                :key="i"
                v-model="form.traveler_names[i]"
                type="text"
                :placeholder="`Peserta ${i + 1}`"
                class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-950 focus:outline-none transition text-sm"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Contact Person</label>
              <input v-model="form.contact_person" type="text" placeholder="Nama" class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-950 focus:outline-none transition text-sm" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">No. Telepon</label>
              <input v-model="form.contact_phone" type="tel" placeholder="08xxxxxxxxxx" class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-950 focus:outline-none transition text-sm" />
            </div>
          </div>

          <!-- Price -->
          <div class="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <div class="flex justify-between text-sm text-slate-500 mb-1">
              <span>{{ pkg.price_per_person.toLocaleString('id-ID') }} × {{ form.total_travelers }} orang</span>
              <span>Rp {{ totalPrice.toLocaleString('id-ID') }}</span>
            </div>
            <div class="flex justify-between text-lg font-black text-slate-800 pt-2 border-t border-slate-200 mt-2">
              <span>Total</span>
              <span class="text-blue-950">Rp {{ totalPrice.toLocaleString('id-ID') }}</span>
            </div>
            <p class="text-xs text-slate-400 mt-2">≈ {{ coinAmount }} NusaCoin</p>
          </div>

          <button @click="submitBooking" :disabled="isBooking" class="w-full py-3.5 bg-blue-950 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            <Loader2 v-if="isBooking" class="w-4 h-4 animate-spin" />
            <CreditCard v-else class="w-4 h-4" />
            {{ isBooking ? 'Memproses...' : `Bayar ${coinAmount} Coin` }}
          </button>
        </div>
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
import { ArrowLeft, Check, X, Calendar, CreditCard, Loader2, Package } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()

const pkg = ref(null)
const galleries = ref([])
const isLoading = ref(true)
const isBooking = ref(false)
const selectedSchedule = ref(null)

const form = ref({
  total_travelers: 1,
  traveler_names: [''],
  contact_person: '',
  contact_phone: '',
})

const formatDate = (d) => dayjs(d).format('D MMM YYYY')

const totalPrice = computed(() => pkg.value ? pkg.value.price_per_person * form.value.total_travelers : 0)
const coinAmount = computed(() => (totalPrice.value / 2000).toFixed(1))

const selectSchedule = (s) => {
  selectedSchedule.value = s
  form.value.total_travelers = Math.min(form.value.total_travelers, s.remaining_slots)
  updateTravelerNames()
}

const updateTravelerNames = () => {
  const current = form.value.traveler_names.length
  const target = form.value.total_travelers
  if (target > current) {
    for (let i = current; i < target; i++) form.value.traveler_names.push('')
  } else if (target < current) {
    form.value.traveler_names = form.value.traveler_names.slice(0, target)
  }
}

const fetchPackage = async () => {
  isLoading.value = true
  try {
    const res = await api.get(`/api/travel-packages/${route.params.slug}`)
    pkg.value = res.data.data
    galleries.value = res.data.data.galleries || []
  } catch {
    toast.error('Paket tidak ditemukan')
    router.push({ name: 'packages' })
  } finally { isLoading.value = false }
}

const submitBooking = async () => {
  if (!authStore.isLoggedIn) {
    toast.error('Silakan login terlebih dahulu untuk melakukan booking')
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  const names = form.value.traveler_names.filter(n => n.trim())
  if (names.length < form.value.total_travelers) { toast.warning('Lengkapi semua nama peserta'); return }
  if (!form.value.contact_person.trim() || !form.value.contact_phone.trim()) { toast.warning('Lengkapi contact person'); return }

  isBooking.value = true
  try {
    const res = await api.post('/api/bookings', {
      booking_type: 'travel_package',
      travel_package_id: pkg.value.id,
      schedule_id: selectedSchedule.value.id,
      ...form.value,
    })
    toast.success('Booking paket berhasil!')
    router.push({ name: 'booking.detail', params: { bookingNumber: res.data.data.booking_number } })
  } catch (err) {
    const msg = err.response?.data?.message
    toast.error(msg && typeof msg === 'object' ? Object.values(msg)[0][0] : (msg || 'Gagal'))
  } finally { isBooking.value = false }
}

onMounted(fetchPackage)
</script>
