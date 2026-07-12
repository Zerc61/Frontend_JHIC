<template>
  <div class="min-h-screen bg-slate-50 pb-24">
    <!-- Header -->
    <div class="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button @click="$router.back()" class="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-950 transition">
          <ArrowLeft class="w-4 h-4" /> Kembali
        </button>
        <h1 class="text-base font-black text-blue-950">Detail Hotel</h1>
        <div class="w-16"></div>
      </div>
    </div>

    <div v-if="isLoading" class="max-w-6xl mx-auto px-6 py-6 animate-pulse space-y-6">
      <div class="h-80 bg-slate-200 rounded-2xl"></div>
      <div class="h-8 bg-slate-200 rounded w-1/2"></div>
      <div class="h-4 bg-slate-200 rounded w-1/3"></div>
    </div>

    <div v-else-if="hotel" class="max-w-6xl mx-auto px-6 py-6 space-y-6">

      <!-- Gallery -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-2xl overflow-hidden">
        <div class="md:col-span-2 h-72 md:h-96 bg-slate-100 overflow-hidden">
          <img v-if="galleries[0]" :src="galleries[0].image" class="w-full h-full object-cover" />
          <Building2 v-else class="w-20 h-20 text-slate-300 mx-auto mt-40" />
        </div>
        <div v-for="g in galleries.slice(1, 5)" :key="g.id" class="hidden md:block h-48 bg-slate-100 overflow-hidden">
          <img :src="g.image" :alt="g.caption" class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- Info -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div class="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <div class="flex items-center gap-1 mb-2">
              <Star v-for="n in (hotel.star_rating || 0)" :key="n" class="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <h2 class="text-2xl font-black text-slate-800">{{ hotel.name }}</h2>
          </div>
          <div v-if="hotel.destination" class="text-right">
            <router-link
              :to="{ name: 'destination.detail', params: { slug: hotel.destination.slug } }"
              class="text-xs font-bold text-blue-950 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition no-underline"
            >
              {{ hotel.destination.name }}
            </router-link>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="flex items-center gap-2 text-sm text-slate-500">
            <MapPin class="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span class="truncate">{{ hotel.address }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-500">
            <Clock class="w-4 h-4 text-slate-400" />
            <span>Check-in {{ hotel.check_in_time }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-500">
            <Clock class="w-4 h-4 text-slate-400" />
            <span>Check-out {{ hotel.check_out_time }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-500">
            <Phone class="w-4 h-4 text-slate-400" />
            <span>{{ hotel.phone }}</span>
          </div>
        </div>

        <p class="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{{ hotel.description }}</p>
      </div>

      <!-- Rooms -->
      <div>
        <div class="flex items-center gap-3 mb-4">
          <div class="w-1.5 h-6 bg-blue-950 rounded-full"></div>
          <h2 class="text-xs font-black text-blue-950 uppercase tracking-widest">Tipe Kamar</h2>
        </div>

        <div class="space-y-4">
          <div
            v-for="room in hotel.rooms"
            :key="room.id"
            @click="selectRoom(room)"
            class="bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all hover:shadow-md"
            :class="selectedRoom?.id === room.id ? 'border-blue-950 shadow-md' : 'border-slate-200'"
          >
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="w-full sm:w-40 h-32 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                <img v-if="room.amenities?.length" src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=60" class="w-full h-full object-cover" />
                <Bed v-else class="w-10 h-10 text-slate-300 mx-auto mt-11" />
              </div>
              <div class="flex-1">
                <h3 class="text-sm font-black text-slate-800 mb-1">{{ room.name }}</h3>
                <p class="text-xs text-slate-400 mb-2">Kapasitas {{ room.capacity }} orang · {{ room.total_rooms }} kamar tersedia</p>
                <div class="flex flex-wrap gap-1.5 mb-3">
                  <span v-for="a in room.amenities" :key="a" class="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{{ a }}</span>
                </div>
                <p class="text-lg font-black text-blue-950">
                  Rp {{ Number(room.price_per_night).toLocaleString('id-ID') }}
                  <span class="text-xs font-medium text-slate-400">/malam</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Booking Form -->
      <div v-if="selectedRoom" class="bg-white rounded-2xl border-2 border-blue-950 p-6 shadow-sm">
        <div class="flex items-center gap-2.5 mb-6">
          <div class="w-8 h-8 bg-blue-950 rounded-lg flex items-center justify-center">
            <Calendar class="w-4 h-4 text-white" />
          </div>
          <h3 class="text-sm font-black text-slate-800">Pesan {{ selectedRoom.name }}</h3>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Check-in</label>
            <input v-model="form.check_in_date" type="date" :min="minDate" class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-950 focus:outline-none transition text-sm" @change="calcPrice" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Check-out</label>
            <input v-model="form.check_out_date" type="date" :min="form.check_in_date || minDate" class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-950 focus:outline-none transition text-sm" @change="calcPrice" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Jumlah Kamar</label>
            <input v-model.number="form.number_of_rooms" type="number" min="1" :max="selectedRoom.total_rooms" class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-950 focus:outline-none transition text-sm" @input="calcPrice" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Jumlah Tamu</label>
            <input v-model.number="form.number_of_guests" type="number" min="1" :max="selectedRoom.capacity * form.number_of_rooms" class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-950 focus:outline-none transition text-sm" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Nama Tamu</label>
            <input v-model="form.guest_name" type="text" placeholder="Nama lengkap" class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-950 focus:outline-none transition text-sm" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">No. Telepon</label>
            <input v-model="form.guest_phone" type="tel" placeholder="08xxxxxxxxxx" class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-950 focus:outline-none transition text-sm" />
          </div>
        </div>

        <!-- Price Summary -->
        <div v-if="nights > 0" class="bg-slate-50 rounded-xl p-5 border border-slate-100 mb-5">
          <div class="flex justify-between text-sm text-slate-500 mb-1">
            <span>{{ selectedRoom.name }} × {{ nights }} malam × {{ form.number_of_rooms }} kamar</span>
            <span>Rp {{ Number(selectedRoom.price_per_night * nights * form.number_of_rooms).toLocaleString('id-ID') }}</span>
          </div>
          <div class="flex justify-between text-lg font-black text-slate-800 pt-2 border-t border-slate-200 mt-2">
            <span>Total</span>
            <span class="text-blue-950">Rp {{ totalPrice.toLocaleString('id-ID') }}</span>
          </div>
          <p class="text-xs text-slate-400 mt-2">≈ {{ coinAmount }} NusaCoin</p>
        </div>

        <button
          @click="submitBooking"
          :disabled="isBooking || nights === 0"
          class="w-full py-3.5 bg-blue-950 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
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
import { ArrowLeft, Star, MapPin, Clock, Phone, Building2, Bed, Calendar, CreditCard, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()

const hotel = ref(null)
const galleries = ref([])
const isLoading = ref(true)
const isBooking = ref(false)
const selectedRoom = ref(null)

const minDate = dayjs().add(1, 'day').format('YYYY-MM-DD')

const form = ref({
  check_in_date: '',
  check_out_date: '',
  number_of_rooms: 1,
  number_of_guests: 1,
  guest_name: '',
  guest_phone: '',
})

const nights = computed(() => {
  if (!form.value.check_in_date || !form.value.check_out_date) return 0
  return Math.max(1, dayjs(form.value.check_out_date).diff(dayjs(form.value.check_in_date), 'day'))
})

const totalPrice = computed(() => {
  if (!selectedRoom.value || nights.value === 0) return 0
  return selectedRoom.value.price_per_night * nights.value * form.value.number_of_rooms
})

const coinAmount = computed(() => (totalPrice.value / 2000).toFixed(1))

const selectRoom = (room) => { selectedRoom.value = room }

const calcPrice = () => {
  if (form.value.check_in_date && !form.value.check_out_date) {
    form.value.check_out_date = dayjs(form.value.check_in_date).add(1, 'day').format('YYYY-MM-DD')
  }
  if (selectedRoom.value) {
    form.value.number_of_guests = Math.min(form.value.number_of_guests, selectedRoom.value.capacity * form.value.number_of_rooms)
  }
}

const fetchHotel = async () => {
  isLoading.value = true
  try {
    const res = await api.get(`/api/hotels/${route.params.slug}`)
    hotel.value = res.data.data
    galleries.value = res.data.data.galleries || []
  } catch {
    toast.error('Hotel tidak ditemukan')
    router.push({ name: 'hotels' })
  } finally {
    isLoading.value = false
  }
}

const submitBooking = async () => {
  if (!authStore.isLoggedIn) {
    toast.error('Silakan login terlebih dahulu untuk melakukan booking')
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  if (!form.value.guest_name.trim() || !form.value.guest_phone.trim()) {
    toast.warning('Lengkapi nama dan nomor telepon tamu')
    return
  }
  if (nights.value === 0) {
    toast.warning('Pilih tanggal check-in dan check-out')
    return
  }

  isBooking.value = true
  try {
    const res = await api.post('/api/bookings', {
      booking_type: 'hotel',
      hotel_id: hotel.value.id,
      hotel_room_id: selectedRoom.value.id,
      ...form.value,
    })
    toast.success('Booking berhasil!')
    router.push({ name: 'booking.detail', params: { bookingNumber: res.data.data.booking_number } })
  } catch (err) {
    const msg = err.response?.data?.message
    if (msg && typeof msg === 'object') {
      const first = Object.values(msg)[0]
      toast.error(Array.isArray(first) ? first[0] : first)
    } else {
      toast.error(msg || 'Gagal melakukan booking')
    }
  } finally {
    isBooking.value = false
  }
}

onMounted(fetchHotel)
</script>
