<template>
  <div class="min-h-screen bg-slate-50 pb-24">
    <!-- Header -->
    <div class="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <button @click="$router.push({ name: 'bookings' })" class="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-950 transition"><ArrowLeft class="w-4 h-4" /> Kembali</button>
        <h1 class="text-base font-black text-blue-950">Detail Booking</h1>
        <div class="w-16"></div>
      </div>
    </div>

    <div v-if="isLoading" class="max-w-4xl mx-auto px-6 py-6 animate-pulse space-y-6">
      <div class="h-36 bg-slate-200 rounded-2xl"></div>
      <div class="h-64 bg-slate-200 rounded-2xl"></div>
      <div class="h-72 bg-slate-200 rounded-2xl"></div>
    </div>

    <div v-else-if="booking" class="max-w-4xl mx-auto px-6 py-6 space-y-6">

      <!-- ==================== STATUS CARD ==================== -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div class="flex items-start justify-between flex-wrap gap-4 mb-5">
          <div>
            <p class="text-xs text-slate-400 font-mono mb-1">{{ booking.booking_number }}</p>
            <h2 class="text-xl font-black text-slate-800 leading-tight">{{ bookingTitle }}</h2>
            <p class="text-xs text-slate-400 mt-1">{{ formatDateTime(booking.created_at) }}</p>
          </div>
          <span class="text-[11px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg" :class="statusClass(booking.status)">
            {{ statusLabel(booking.status) }}
          </span>
        </div>
        <div class="grid grid-cols-3 gap-4 pt-5 border-t border-slate-100">
          <div class="text-center">
            <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Harga</p>
            <p class="text-lg font-black text-slate-800">Rp {{ Number(booking.rupiah_equivalent).toLocaleString('id-ID') }}</p>
          </div>
          <div class="text-center border-x border-slate-100">
            <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">NusaCoin</p>
            <p class="text-lg font-black text-blue-950">{{ booking.coin_amount }}</p>
          </div>
          <div class="text-center">
            <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Dibayar</p>
            <p class="text-sm font-bold text-slate-600">{{ booking.paid_at ? formatDateTime(booking.paid_at) : '-' }}</p>
          </div>
        </div>
      </div>

      <!-- ==================== TIMELINE (HANYA PAKET) ==================== -->
      <template v-if="booking.booking_type === 'travel_package' && timelineSteps.length">
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div class="flex items-center gap-2.5 mb-6">
            <div class="w-8 h-8 bg-blue-950 rounded-lg flex items-center justify-center">
              <Route class="w-4 h-4 text-white" />
            </div>
            <h3 class="text-sm font-black text-slate-800">Rencana Perjalanan</h3>
          </div>

          <!-- Day badges -->
          <div v-if="totalDays > 1" class="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
            <button
              v-for="d in totalDays" :key="d"
              @click="activeDay = d"
              class="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition"
              :class="activeDay === d ? 'bg-blue-950 text-white border-blue-950' : 'bg-white text-slate-500 border-slate-200 hover:border-blue-950'"
            >
              Hari {{ d }}
            </button>
          </div>

          <!-- Timeline -->
          <div class="relative pl-8">
            <!-- Vertical line -->
            <div class="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

            <div v-for="(step, i) in filteredTimeline" :key="i" class="relative pb-7 last:pb-0">
              <!-- Dot -->
              <div class="absolute -left-8 top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center"
                :class="i === 0 ? 'border-blue-950 bg-blue-950' : 'border-slate-300 bg-white'">
                <Check v-if="i === 0" class="w-3 h-3 text-white" />
              </div>
              <!-- Content -->
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-14 text-right">
                  <p class="text-sm font-black text-slate-800">{{ step.time }}</p>
                  <p v-if="totalDays > 1" class="text-[10px] text-slate-400">Hari {{ step.day }}</p>
                </div>
                <div class="flex-1 pt-0.5">
                  <p class="text-sm font-bold text-slate-700">{{ step.label }}</p>
                  <p v-if="step.sub" class="text-xs text-slate-400 mt-0.5">{{ step.sub }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- ==================== HOTEL INFO (BUKAN PAKET) ==================== -->
      <template v-if="booking.booking_type === 'hotel' && booking.hotel_detail">
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div class="flex items-center gap-2.5 mb-5">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 class="w-4 h-4 text-white" />
            </div>
            <h3 class="text-sm font-black text-slate-800">Detail Reservasi</h3>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Check-in</p>
              <p class="text-sm font-black text-slate-800">{{ formatDate(booking.hotel_detail.check_in_date) }}</p>
              <p class="text-xs text-slate-400 mt-0.5">Mulai 14:00</p>
            </div>
            <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Check-out</p>
              <p class="text-sm font-black text-slate-800">{{ formatDate(booking.hotel_detail.check_out_date) }}</p>
              <p class="text-xs text-slate-400 mt-0.5">Sebelum 12:00</p>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4 mt-4">
            <div><p class="text-[10px] text-slate-400">Tipe Kamar</p><p class="text-sm font-bold text-slate-700">{{ booking.hotel_detail.room_name }}</p></div>
            <div><p class="text-[10px] text-slate-400">Jumlah Kamar</p><p class="text-sm font-bold text-slate-700">{{ booking.hotel_detail.number_of_rooms }}</p></div>
            <div><p class="text-[10px] text-slate-400">Tamu</p><p class="text-sm font-bold text-slate-700">{{ booking.hotel_detail.number_of_guests }} orang</p></div>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
            <div><p class="text-[10px] text-slate-400">Nama Tamu</p><p class="text-sm font-bold text-slate-700">{{ booking.hotel_detail.guest_name }}</p></div>
            <div><p class="text-[10px] text-slate-400">Telepon</p><p class="text-sm font-bold text-slate-700">{{ booking.hotel_detail.guest_phone }}</p></div>
          </div>
        </div>
      </template>

      <!-- ==================== TRANSPORT INFO (BUKAN PAKET) ==================== -->
      <template v-if="booking.booking_type === 'transportation' && booking.transport_detail">
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div class="flex items-center gap-2.5 mb-5">
            <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Bus class="w-4 h-4 text-white" />
            </div>
            <h3 class="text-sm font-black text-slate-800">Detail Sewa</h3>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Mulai</p>
              <p class="text-sm font-black text-slate-800">{{ formatDate(booking.transport_detail.start_date) }}</p>
            </div>
            <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Selesai</p>
              <p class="text-sm font-black text-slate-800">{{ formatDate(booking.transport_detail.end_date) }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div><p class="text-[10px] text-slate-400">Kendaraan</p><p class="text-sm font-bold text-slate-700">{{ booking.transport_detail.transport_name }}</p></div>
            <div><p class="text-[10px] text-slate-400">Tipe</p><p class="text-sm font-bold text-slate-700 capitalize">{{ booking.transport_detail.transport_type }}</p></div>
            <div><p class="text-[10px] text-slate-400">Durasi</p><p class="text-sm font-bold text-slate-700">{{ booking.transport_detail.number_of_days }} hari</p></div>
            <div v-if="booking.transport_detail.pickup_location"><p class="text-[10px] text-slate-400">Penjemputan</p><p class="text-sm font-bold text-slate-700">{{ booking.transport_detail.pickup_location }}</p></div>
          </div>
        </div>
      </template>

      <!-- ==================== TIKET / QR SECTION ==================== -->
      <template v-if="ticketItems.length">

        <!-- Section Header -->
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 bg-blue-950 rounded-lg flex items-center justify-center">
            <Ticket class="w-4 h-4 text-white" />
          </div>
          <h3 class="text-sm font-black text-slate-800">Tiket Anda</h3>
        </div>

        <!-- Tab Pills (lebih dari 1 tiket) -->
        <div v-if="ticketItems.length > 1" class="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            v-for="(item, i) in ticketItems" :key="item.id"
            @click="activeTicket = i"
            class="flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold border transition flex items-center gap-2"
            :class="activeTicket === i ? 'bg-blue-950 text-white border-blue-950' : 'bg-white text-slate-500 border-slate-200 hover:border-blue-950'"
          >
            <span>{{ item.icon }}</span>
            {{ item.shortTitle }}
          </button>
        </div>

        <!-- Tiket Card -->
        <div v-if="currentTicket" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <!-- Gradient Header -->
          <div :class="ticketGradient" class="px-6 py-5 text-white">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <component :is="ticketIcon" class="w-5 h-5" />
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-wider text-white/60">{{ ticketTypeLabel }}</p>
                <h4 class="text-base font-black">{{ currentTicket.title }}</h4>
              </div>
            </div>
          </div>

          <!-- Detail Body -->
          <div class="p-6 space-y-4">
            <p class="text-sm text-slate-600 leading-relaxed">{{ currentTicket.description }}</p>

            <!-- Detail Grid -->
            <div class="grid grid-cols-2 gap-3">
              <div v-for="d in ticketDetails" :key="d.label" class="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <p class="text-[10px] font-bold text-slate-400 uppercase">{{ d.label }}</p>
                <p class="text-sm font-bold text-slate-700 mt-0.5">{{ d.value }}</p>
              </div>
            </div>
          </div>

          <!-- Perforated Tear Line -->
          <div class="relative px-6">
            <div class="border-t-2 border-dashed border-slate-200"></div>
            <div class="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-50"></div>
            <div class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-50"></div>
          </div>

          <!-- QR Code Section -->
        <!-- QR Code Section -->
<div v-if="currentTicket.qr_code" class="px-6 py-8 text-center">
  <div class="inline-block p-5 bg-white border-2 border-slate-200 rounded-2xl shadow-sm">
    <img
      :src="currentTicket.qr_code"
      alt="QR Code"
      class="w-52 h-52"
    />
  </div>
  <p class="text-[10px] text-slate-400 mt-4">Scan QR code ini untuk verifikasi</p>
</div>

          <!-- Instruction -->
          <div class="px-6 pb-6">
            <div class="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p class="text-xs font-bold text-blue-800 flex items-start gap-2">
                <Info class="w-4 h-4 flex-shrink-0 mt-0.5" />
                {{ ticketInstruction }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <!-- ==================== CANCEL ==================== -->
      <button
        v-if="booking.status === 'paid' || booking.status === 'confirmed'"
        @click="cancelBooking"
        :disabled="isCancelling"
        class="w-full py-4 bg-white border-2 border-red-200 text-red-600 font-bold text-sm rounded-xl hover:bg-red-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Loader2 v-if="isCancelling" class="w-4 h-4 animate-spin" />
        <XCircle v-else class="w-4 h-4" />
        {{ isCancelling ? 'Membatalkan...' : 'Batalkan Booking' }}
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import dayjs from 'dayjs'
import { 
  ArrowLeft, Route, Check, Building2, Bus, MapPin, Clock, Ticket, 
  Info, Loader2, XCircle, Plane, Star, UtensilsCrossed 
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const booking = ref(null)
const isLoading = ref(true)
const isCancelling = ref(false)
const activeTicket = ref(0)
const activeDay = ref(1)

// ============================================================
// FORMAT HELPERS
// ============================================================
const formatDateTime = (d) => dayjs(d).format('D MMM YYYY · HH:mm')
const formatDate = (d) => dayjs(d).format('D MMM YYYY')

const statusClass = (s) => ({
  paid: 'bg-blue-50 text-blue-600', confirmed: 'bg-emerald-50 text-emerald-600',
  completed: 'bg-slate-100 text-slate-500', cancelled: 'bg-red-50 text-red-500',
  refunded: 'bg-amber-50 text-amber-600',
}[s] || 'bg-slate-100 text-slate-500')

const statusLabel = (s) => ({
  pending: 'Menunggu', paid: 'Dibayar', confirmed: 'Terkonfirmasi',
  completed: 'Selesai', cancelled: 'Dibatalkan', refunded: 'Dikembalikan',
}[s] || s)

// ============================================================
// BOOKING TITLE
// ============================================================
const bookingTitle = computed(() => {
  const b = booking.value
  if (!b) return ''
  if (b.booking_type === 'hotel' && b.hotel_detail) return b.hotel_detail.hotel_name
  if (b.booking_type === 'transport_ticket' && b.ticket_detail) {
    return `${b.ticket_detail.provider} (${b.ticket_detail.origin_code} - ${b.ticket_detail.destination_code})`
  }
  if (b.booking_type === 'travel_package' && b.package_detail) return b.package_detail.package_name
  return b.booking_type
})

// ============================================================
// TIMELINE (PAKET) - DIUPDATE: TRANSPORTASI LAMA DIHAPUS
// ============================================================
const timelineSteps = computed(() => {
  const b = booking.value
  if (b?.booking_type !== 'travel_package' || !b.package_detail) return []

  const d = b.package_detail
  const items = d.items || []
  const depDate = dayjs(d.departure_date)
  const retDate = dayjs(d.return_date)
  const days = retDate.diff(depDate, 'day') || 1
  const steps = []

  // Mulai Perjalanan
  steps.push({
    time: '08:00', label: 'Perjalanan dimulai', sub: `Tanggal keberangkatan: ${d.departure_date}`,
    icon: 'MapPin', day: 1,
  })

  // Destinasi
  const destTickets = items.filter(i => i.type === 'destination_ticket')
  destTickets.forEach((dest, i) => {
    const dName = dest.title.replace('Tiket: ', '')
    const dayNum = days > 1 ? Math.min(i + 1, days) : 1
    steps.push({ time: '09:00', label: `Kunjungan ${dName}`, sub: 'Tunjukkan tiket wisata', icon: 'MapPin', day: dayNum })
  })

  // Makan
  const mealItems = items.filter(i => i.type === 'meal')
  mealItems.forEach((meal, i) => {
    const mLabel = meal.title.replace('🍽️ ', '')
    steps.push({ time: i === 0 ? '12:00' : '19:00', label: mLabel, sub: meal.description, icon: 'Clock', day: 1 })
  })

  // Hotel Check-in
  const hotelItem = items.find(i => i.type === 'hotel')
  if (hotelItem) {
    const hName = hotelItem.title.replace('Hotel: ', '')
    steps.push({ time: '14:00', label: `Check-in ${hName}`, sub: 'Tunjukkan QR hotel di resepsionis', icon: 'Building2', day: 1 })
  }

  // Hari Terakhir
  if (hotelItem && days > 1) {
    steps.push({ time: '10:00', label: 'Check-out hotel', sub: 'Kembalikan kunci kamar', icon: 'Building2', day: days })
  }

  steps.push({ time: '17:00', label: 'Perjalanan selesai', sub: 'Terima kasih telah memilih NusaTrip', icon: 'MapPin', day: days })

  return steps
})

const totalDays = computed(() => {
  if (!booking.value?.package_detail) return 1
  return dayjs(booking.value.package_detail.return_date).diff(dayjs(booking.value.package_detail.departure_date), 'day') || 1
})

const filteredTimeline = computed(() => {
  return timelineSteps.value.filter(s => s.day === activeDay.value)
})

// ============================================================
// TICKET ITEMS - DIUPDATE: MENANGANI TRANSPORT_TICKET, MEAL, BENEFIT
// ============================================================
const ticketItems = computed(() => {
  const b = booking.value
  if (!b) return []

  // ===== HOTEL =====
  if (b.booking_type === 'hotel' && b.hotel_detail) {
    const h = b.hotel_detail
    return [{
      id: 'hotel', type: 'hotel', title: h.hotel_name, shortTitle: 'Hotel', icon: '🏨',
      description: `Reservasi kamar ${h.room_name} untuk ${h.number_of_guests} tamu.`,
      qr_code: h.qr_code,
      meta: {
        'Check-in': formatDate(h.check_in_date), 'Check-out': formatDate(h.check_out_date),
        'Kamar': h.number_of_rooms, 'Tamu': h.number_of_guests + ' orang',
        'Nama Tamu': h.guest_name, 'Telepon': h.guest_phone,
      }
    }]
  }

  // ===== TRANSPORT TICKET (BARU) =====
  if (b.booking_type === 'transport_ticket' && b.ticket_detail) {
    const td = b.ticket_detail
    return td.passengers.map((pax, i) => ({
      id: `pax-${i}`, type: 'transport_ticket',
      title: `Boarding Pass - ${pax.name}`, shortTitle: pax.name.split(' ').pop(),
      icon: td.transport_mode === 'pesawat' ? '✈️' : td.transport_mode === 'kereta' ? '🚆' : td.transport_mode === 'bus' ? '🚌' : '🚢',
      description: `${td.provider} ${td.flight_number || ''} - ${td.class_type}`,
      qr_code: pax.qr_code,
      meta: {
        'Penumpang': pax.name, 'ID Type': pax.id_type,
        'Rute': `${td.origin_code} -> ${td.destination_code}`,
        'Tanggal': dayjs(td.departure_time).format('DD MMM YYYY'),
        'Berangkat': dayjs(td.departure_time).format('HH:mm'),
        'Tiba': dayjs(td.arrival_time).format('HH:mm'),
        'Kelas': td.class_type,
        'Kursi': pax.seat_number || 'Di loket',
        'Nomor Tiket': pax.ticket_number || '-',
        'Kode Booking': td.provider_booking_code || '-',
      }
    }))
  }

  // ===== PAKET WISATA =====
  if (b.booking_type === 'travel_package' && b.package_detail?.items) {
    const pd = b.package_detail

    return b.package_detail.items.map((item, i) => {
      let meta = null

      if (item.type === 'hotel') {
        meta = { 'Hotel': item.title.replace('Hotel: ', ''), 'Check-in': pd.departure_date, 'Check-out': pd.return_date, 'Tamu': pd.total_travelers + ' orang', 'CP': pd.contact_person, 'Telepon CP': pd.contact_phone }
      } else if (item.type === 'destination_ticket') {
        meta = { 'Destinasi': item.title.replace('Tiket: ', ''), 'Valid': pd.departure_date, 'Pengunjung': pd.total_travelers + ' orang', 'CP': pd.contact_person, 'Telepon CP': pd.contact_phone }
      }
      // meal dan benefit meta dibiarkan null

      return {
        id: item.id, type: item.type, title: item.title,
        shortTitle: item.type === 'hotel' ? 'Hotel' : item.type === 'destination_ticket' ? `Tiket ${i + 1}` : item.type === 'meal' ? 'Makan' : item.type === 'benefit' ? 'Benefit' : 'Lainnya',
        icon: item.type === 'hotel' ? '🏨' : item.type === 'destination_ticket' ? '🎫' : item.type === 'meal' ? '🍽️' : item.type === 'benefit' ? '⭐' : '📄',
        description: item.description, qr_code: item.qr_code, meta: meta,
      }
    })
  }

  return []
})

const currentTicket = computed(() => ticketItems.value[activeTicket.value] || null)

// ============================================================
// TICKET STYLING (PER TYPE) - DIUPDATE
// ============================================================
const ticketGradient = computed(() => {
  const t = currentTicket.value?.type
  if (t === 'hotel') return 'bg-gradient-to-r from-blue-600 to-indigo-600'
  if (t === 'destination_ticket') return 'bg-gradient-to-r from-emerald-500 to-teal-600'
  if (t === 'transport_ticket') return 'bg-gradient-to-r from-sky-500 to-blue-600'
  if (t === 'meal') return 'bg-gradient-to-r from-orange-400 to-amber-500'
  if (t === 'benefit') return 'bg-gradient-to-r from-purple-500 to-pink-500'
  return 'bg-gradient-to-r from-slate-600 to-slate-700'
})

const ticketIcon = computed(() => {
  const t = currentTicket.value?.type
  if (t === 'hotel') return Building2
  if (t === 'destination_ticket') return MapPin
  if (t === 'transport_ticket') return Plane
  if (t === 'meal') return UtensilsCrossed
  if (t === 'benefit') return Star
  return Ticket
})

const ticketTypeLabel = computed(() => {
  const t = currentTicket.value?.type
  if (t === 'hotel') return 'Tiket Hotel'
  if (t === 'destination_ticket') return 'Tiket Wisata'
  if (t === 'transport_ticket') return 'Boarding Pass'
  if (t === 'meal') return 'Fasilitas Makan'
  if (t === 'benefit') return 'Benefit Eksklusif'
  return 'Tiket'
})

const ticketDetails = computed(() => {
  const t = currentTicket.value
  if (!t?.meta) return []
  return Object.entries(t.meta).map(([label, value]) => ({ label, value }))
})

const ticketInstruction = computed(() => {
  const t = currentTicket.value?.type
  if (t === 'hotel') return 'Tunjukkan QR code ini di resepsionis hotel saat check-in. Pastikan tanggal dan nama tamu sesuai dengan identitas Anda.'
  if (t === 'destination_ticket') return 'Tunjukkan QR code ini di gerbang masuk destinasi. Satu QR berlaku untuk semua peserta yang tertera dalam booking.'
  if (t === 'transport_ticket') return 'Tunjukkan boarding pass ini di gate keberangkatan. Pastikan nama dan nomor kursi sesuai dengan tiket Anda.'
  if (t === 'meal') return 'Fasilitas makan yang sudah termasuk dalam paket perjalanan Anda.'
  if (t === 'benefit') return 'Benefit khusus yang Anda dapatkan dari paket perjalanan ini.'
  return 'Tunjukkan QR code ini saat dibutuhkan.'
})

// ============================================================
// API
// ============================================================
const fetchBooking = async () => {
  isLoading.value = true
  try {
    const res = await api.get(`/api/bookings/${route.params.bookingNumber}`)
    booking.value = res.data.data
  } catch {
    toast.error('Booking tidak ditemukan')
    router.push({ name: 'bookings' })
  } finally { isLoading.value = false }
}

const cancelBooking = async () => {
  if (!confirm('Yakin ingin membatalkan booking? NusaCoin akan dikembalikan.')) return
  isCancelling.value = true
  try {
    await api.post(`/api/bookings/${route.params.bookingNumber}/cancel`)
    toast.success('Booking dibatalkan. NusaCoin dikembalikan.')
    fetchBooking()
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal membatalkan')
  } finally { isCancelling.value = false }
}

onMounted(fetchBooking)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>