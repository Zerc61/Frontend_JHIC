<template>
  <div class="min-h-screen bg-slate-50">
    <!-- ===== TOP BAR ===== -->
    <div class="bg-white border-b border-slate-100 sticky top-0 z-30">
      <div class="max-w-6xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-between">
        <button
          @click="router.back()"
          class="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-700 transition cursor-pointer"
        >
          <ArrowLeft class="w-4 h-4" />
          <span class="hidden sm:inline">Kembali ke Pencarian</span>
          <span class="sm:hidden">Kembali</span>
        </button>
        <div class="flex items-center gap-2">
          <ShieldCheck class="w-4 h-4 text-emerald-500" />
          <span class="text-xs font-bold text-slate-400">Pembayaran Aman</span>
        </div>
      </div>
    </div>

    <!-- ===== LOADING STATE ===== -->
    <div v-if="isLoadingTicket" class="max-w-6xl mx-auto px-6 sm:px-10 py-10">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div class="lg:col-span-3 space-y-4">
          <div v-for="n in passengerCount + 1" :key="n" class="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
            <div class="flex items-center gap-3 mb-5">
              <div class="w-9 h-9 bg-slate-100 rounded-xl"></div>
              <div class="h-4 bg-slate-100 rounded w-32"></div>
            </div>
            <div class="space-y-3">
              <div class="h-12 bg-slate-100 rounded-xl"></div>
              <div class="grid grid-cols-2 gap-3">
                <div class="h-12 bg-slate-100 rounded-xl"></div>
                <div class="h-12 bg-slate-100 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse h-96"></div>
        </div>
      </div>
    </div>

    <!-- ===== MAIN CONTENT ===== -->
    <template v-else-if="ticket">
      <div class="max-w-6xl mx-auto px-6 sm:px-10 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">

          <!-- ========== LEFT: FORMS ========== -->
          <div class="lg:col-span-3 space-y-6">

            <!-- Ticket Summary Card -->
            <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <!-- Dark Header: Provider -->
              <div class="bg-gradient-to-r from-[#0a0f1e] to-[#111832] px-5 sm:px-6 py-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                    {{ ticket.transport_icon }}
                  </div>
                  <div>
                    <p class="text-sm font-extrabold text-white">{{ ticket.provider }}</p>
                    <p class="text-[11px] text-white/40">{{ ticket.flight_number || '-' }} - {{ ticket.class_type }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                  <span class="w-2 h-2 rounded-full" :class="ticket.is_transit ? 'bg-amber-400' : 'bg-emerald-400'"></span>
                  <span class="text-[11px] font-bold" :class="ticket.is_transit ? 'text-amber-400' : 'text-emerald-400'">
                    {{ ticket.is_transit ? 'Transit' : 'Langsung' }}
                  </span>
                </div>
              </div>

              <!-- ===== WHITE BODY: ROUTE & TIME ===== -->
              <div class="px-5 sm:px-6 py-6">
                <!-- Date Header -->
                <div class="flex items-center gap-2 mb-6">
                  <CalendarDays class="w-4 h-4 text-blue-500" />
                  <p class="text-sm font-bold text-slate-700">{{ formatFullDate(ticket.departure_date) }}</p>
                  <span class="text-xs text-slate-400">({{ ticket.duration }})</span>
                </div>

                <!-- Time Grid: 3 columns -->
                <div class="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                  
                  <!-- DEPARTURE -->
                  <div class="text-left">
                    <p class="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight leading-none">
                      {{ ticket.departure_time }}
                    </p>
                    <div class="mt-2 space-y-0.5">
                      <p class="text-base font-extrabold text-slate-700">{{ ticket.origin_code }}</p>
                      <p class="text-xs text-slate-400 leading-snug">{{ formatCityName(ticket.origin_name) }}</p>
                    </div>
                  </div>

                  <!-- CENTER: Timeline + Plane -->
                  <div class="flex flex-col items-center px-2 sm:px-6 w-[120px] sm:w-[160px]">
                    <!-- Plane Icon -->
                    <div class="mb-2 text-blue-500 text-lg">
                      {{ ticket.transport_mode === 'pesawat' ? ticket.transport_icon : (ticket.transport_mode === 'kereta' ? '🚆' : (ticket.transport_mode === 'bus' ? '🚌' : '🚢')) }}
                    </div>
                    <!-- Line with dots -->
                    <div class="w-full flex items-center gap-0">
                      <div class="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-100 shrink-0"></div>
                      <div class="flex-1 relative h-0.5">
                        <div class="absolute inset-0 bg-slate-200 rounded-full"></div>
                        <div v-if="!ticket.is_transit" class="absolute inset-0 bg-blue-500 rounded-full"></div>
                      </div>
                      <div class="w-3 h-3 rounded-full border-[3px] shrink-0" :class="ticket.is_transit ? 'border-amber-400 bg-white' : 'border-blue-500 bg-white'"></div>
                    </div>
                  </div>

                  <!-- ARRIVAL -->
                  <div class="text-right">
                    <p class="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight leading-none">
                      {{ ticket.arrival_time }}
                    </p>
                    <div class="mt-2 space-y-0.5">
                      <p class="text-base font-extrabold text-slate-700">{{ ticket.destination_code }}</p>
                      <p class="text-xs text-slate-400 leading-snug">{{ formatCityName(ticket.destination_name) }}</p>
                    </div>
                  </div>

                </div>

                <!-- Arrival Date (if different day) -->
                <div v-if="ticket.departure_date !== ticket.arrival_date" class="mt-4 text-right">
                  <span class="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                    +1 Hari - Tiba {{ formatShortDate(ticket.arrival_date) }}
                  </span>
                </div>

                <!-- Transit Warning -->
                <div v-if="ticket.is_transit && ticket.transit_info" class="mt-5">
                  <div class="flex items-center gap-2.5 text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                    <AlertTriangle class="w-4 h-4 shrink-0 text-amber-500" />
                    <p class="text-xs font-semibold">{{ ticket.transit_info }}</p>
                  </div>
                </div>
              </div>

              <!-- Seat Info Bar -->
              <div class="px-5 sm:px-6 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Users class="w-3.5 h-3.5 text-slate-400" />
                  <span class="text-xs font-bold text-slate-500">{{ passengerCount }} penumpang</span>
                </div>
                <span class="text-xs font-bold" :class="ticket.available_seats <= 10 ? 'text-amber-600' : 'text-slate-400'">
                  {{ ticket.available_seats }} kursi tersisa
                </span>
              </div>
            </div>

            <!-- Passenger Forms -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-base font-extrabold text-slate-800">Data Penumpang</h2>
                <span class="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{{ passengerCount }} orang</span>
              </div>

              <div class="space-y-4">
                <div
                  v-for="(pax, index) in passengers"
                  :key="index"
                  class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all"
                  :class="{ 'ring-2 ring-red-200 border-red-100': paxError[index] }"
                >
                  <!-- Passenger Header -->
                  <div class="flex items-center justify-between px-5 sm:px-6 py-3.5 bg-slate-50/60 border-b border-slate-100">
                    <div class="flex items-center gap-3">
                      <div class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black" :class="paxError[index] ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'">
                        {{ index + 1 }}
                      </div>
                      <p class="text-sm font-bold text-slate-700">Penumpang {{ index + 1 }}</p>
                    </div>
                    <div v-if="paxError[index]" class="flex items-center gap-1 text-red-500">
                      <AlertCircle class="w-3.5 h-3.5" />
                      <span class="text-[11px] font-bold">{{ paxError[index] }}</span>
                    </div>
                  </div>

                  <!-- Passenger Fields -->
                  <div class="p-5 sm:p-6 space-y-4">
                    <div>
                      <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Nama Lengkap <span class="text-red-400">*</span>
                      </label>
                      <div class="relative">
                        <User class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                          v-model="pax.name"
                          type="text"
                          placeholder="Sesuai KTP / Passport"
                          class="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition"
                          :class="paxError[index] ? 'border-red-200 focus:ring-red-200 focus:border-red-400' : 'border-slate-200 focus:ring-blue-500/30 focus:border-blue-500'"
                        />
                      </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Tipe Identitas <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                          <CreditCard class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <select
                            v-model="pax.id_type"
                            class="w-full border rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 transition appearance-none"
                            :class="paxError[index] ? 'border-red-200 focus:ring-red-200 focus:border-red-400' : 'border-slate-200 focus:ring-blue-500/30 focus:border-blue-500'"
                          >
                            <option value="KTP">KTP</option>
                            <option value="Passport">Passport</option>
                            <option value="SIM">SIM</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Nomor Identitas <span class="text-red-400">*</span>
                        </label>
                        <div class="relative">
                          <Hash class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input
                            v-model="pax.id_number"
                            type="text"
                            placeholder="317xxxxxxxxxxxxxx"
                            class="w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition"
                            :class="paxError[index] ? 'border-red-200 focus:ring-red-200 focus:border-red-400' : 'border-slate-200 focus:ring-blue-500/30 focus:border-blue-500'"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ========== RIGHT: STICKY SUMMARY ========== -->
          <div class="lg:col-span-2">
            <div class="lg:sticky lg:top-[73px] space-y-4">

              <!-- Price Card -->
              <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div class="px-5 sm:px-6 py-4 border-b border-slate-100">
                  <h3 class="text-sm font-extrabold text-slate-800">Rincian Pembayaran</h3>
                </div>

                <div class="px-5 sm:px-6 py-5 space-y-4">
                  <div class="flex items-start justify-between gap-4">
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-slate-700 truncate">
                        {{ ticket.origin_code }} - {{ ticket.destination_code }}
                      </p>
                      <p class="text-xs text-slate-400 mt-0.5">
                        {{ ticket.transport_label }} - {{ ticket.class_type }}
                      </p>
                    </div>
                    <p class="text-sm font-bold text-slate-700 shrink-0">
                      {{ formatRupiah(ticket.price_per_ticket) }}
                    </p>
                  </div>

                  <div class="flex items-center justify-between">
                    <p class="text-sm text-slate-500">x {{ passengerCount }} penumpang</p>
                    <p class="text-sm font-bold text-slate-700">
                      {{ formatRupiah(totalPrice) }}
                    </p>
                  </div>

                  <div class="border-t border-dashed border-slate-200"></div>

                  <div class="flex items-center justify-between">
                    <p class="text-sm font-extrabold text-slate-800">Total</p>
                    <p class="text-lg font-black text-slate-800">{{ formatRupiah(totalPrice) }}</p>
                  </div>

                  <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 space-y-2">
                    <div class="flex items-center gap-2">
                      <Coins class="w-4 h-4 text-blue-600" />
                      <p class="text-xs font-bold text-blue-700">Konversi NusaCoin</p>
                    </div>
                    <div class="flex items-baseline justify-between">
                      <p class="text-xs text-blue-500">Rate: Rp {{ COIN_RATE.toLocaleString('id-ID') }} / Coin</p>
                      <p class="text-xl font-black text-blue-600">{{ coinAmount.toFixed(1) }}</p>
                    </div>
                    <p class="text-[10px] text-blue-400 font-medium">NusaCoin akan didebit dari saldo kamu</p>
                  </div>
                </div>
              </div>

              <!-- Pay Button -->
              <button
                @click="submitBooking"
                :disabled="isSubmitting"
                class="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-bold uppercase tracking-wider py-4 rounded-2xl hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-blue-600/25 hover:shadow-blue-500/30 active:scale-[0.98]"
              >
                <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
                  <Loader2 class="w-4 h-4 animate-spin" />
                  Memproses...
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  <Coins class="w-4 h-4" />
                  Bayar {{ coinAmount.toFixed(1) }} NusaCoin
                </span>
              </button>

              <!-- Trust Badges -->
              <div class="flex items-center justify-center gap-6 py-2">
                <div class="flex items-center gap-1.5">
                  <ShieldCheck class="w-3.5 h-3.5 text-emerald-500" />
                  <span class="text-[10px] font-bold text-slate-400">Aman</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <Lock class="w-3.5 h-3.5 text-emerald-500" />
                  <span class="text-[10px] font-bold text-slate-400">Terenkripsi</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <RotateCcw class="w-3.5 h-3.5 text-emerald-500" />
                  <span class="text-[10px] font-bold text-slate-400">Refundable</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </template>

    <!-- ===== ERROR STATE ===== -->
    <div v-else-if="!isLoadingTicket" class="max-w-6xl mx-auto px-6 sm:px-10 py-20">
      <div class="max-w-sm mx-auto text-center">
        <div class="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle class="w-10 h-10 text-slate-300" />
        </div>
        <p class="text-lg font-extrabold text-slate-700 mb-2">Tiket Tidak Ditemukan</p>
        <p class="text-sm text-slate-400 mb-6">
          Tiket yang kamu cari tidak tersedia atau sudah kadaluarsa.
        </p>
        <button
          @click="router.push({ name: 'transport-tickets' })"
          class="inline-flex items-center gap-2 bg-slate-800 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-slate-700 transition cursor-pointer"
        >
          <ArrowLeft class="w-4 h-4" />
          Cari Tiket Lain
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  AlertCircle,
  User,
  CreditCard,
  Hash,
  Users,
  Coins,
  ShieldCheck,
  Lock,
  RotateCcw,
  CalendarDays
} from "lucide-vue-next";
import dayjs from "dayjs";
import api from "@/services/api";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const isLoadingTicket = ref(true);
const isSubmitting = ref(false);
const ticket = ref(null);
const passengerCount = ref(1);
const COIN_RATE = 2000;

const passengers = reactive([]);
const paxError = reactive({});

function initPassengers(count) {
  passengers.length = 0;
  Object.keys(paxError).forEach(key => delete paxError[key]);

  for (let i = 0; i < count; i++) {
    passengers.push({
      name: "",
      id_type: "KTP",
      id_number: "",
    });
  }
}

const totalPrice = computed(() => {
  if (!ticket.value) return 0;
  return ticket.value.price_per_ticket * passengerCount.value;
});

const coinAmount = computed(() => {
  return totalPrice.value / COIN_RATE;
});

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatFullDate(dateStr) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const d = dayjs(dateStr);
  return `${days[d.day()]}, ${d.date()} ${months[d.month()]} ${d.year()}`;
}

function formatShortDate(dateStr) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const d = dayjs(dateStr);
  return `${d.date()} ${months[d.month()]} ${d.year()}`;
}

function formatCityName(name) {
  if (!name) return "";
  return name
    .replace(/^Stasiun\s+/i, "")
    .replace(/^Terminal\s+/i, "")
    .replace(/^Pelabuhan\s+/i, "")
    .replace(/,\s*Bali$/i, "")
    .replace(/,\s*Surabaya$/i, "")
    .replace(/,\s*Jakarta$/i, "")
    .replace(/\s+(International|Soekarno-Hatta|Sultan\s+.+)$/i, "")
    .trim();
}

onMounted(async () => {
  const ticketId = route.query.ticket_id;
  const count = parseInt(route.query.passengers) || 1;

  if (!ticketId) {
    isLoadingTicket.value = false;
    return;
  }

  passengerCount.value = count;
  initPassengers(count);

  try {
    const res = await api.get(`/api/transport-tickets/${ticketId}`);
    ticket.value = res.data.data;
  } catch {
    toast.error("Gagal memuat data tiket");
    ticket.value = null;
  } finally {
    isLoadingTicket.value = false;
  }
});

async function submitBooking() {
  Object.keys(paxError).forEach(key => delete paxError[key]);

  let hasError = false;

  for (let i = 0; i < passengers.length; i++) {
    const errors = [];

    if (!passengers[i].name.trim()) {
      errors.push("Nama wajib diisi");
    } else if (passengers[i].name.trim().length < 3) {
      errors.push("Nama terlalu pendek");
    }

    if (!passengers[i].id_number.trim()) {
      errors.push("No. identitas wajib diisi");
    } else {
      const idNum = passengers[i].id_number.trim();
      if (passengers[i].id_type === "KTP" && !/^\d{16}$/.test(idNum)) {
        errors.push("KTP harus 16 digit");
      } else if (passengers[i].id_type === "SIM" && idNum.length < 8) {
        errors.push("SIM tidak valid");
      } else if (passengers[i].id_type === "Passport" && idNum.length < 6) {
        errors.push("Passport tidak valid");
      }
    }

    if (errors.length > 0) {
      paxError[i] = errors[0];
      hasError = true;
    }
  }

  if (hasError) {
    toast.error("Lengkapi data penumpang yang belum benar");
    const firstErrorIndex = Object.keys(paxError)[0];
    if (firstErrorIndex !== undefined) {
      const cards = document.querySelectorAll('[class*="ring-red"]');
      if (cards[0]) {
        cards[0].scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    return;
  }

  isSubmitting.value = true;

  try {
    const res = await api.post("/api/bookings", {
      booking_type: "transport_ticket",
      transport_ticket_id: ticket.value.id,
      passengers: passengers.map((p) => ({
        name: p.name.trim(),
        id_type: p.id_type,
        id_number: p.id_number.trim(),
      })),
    });

    const bookingNumber = res.data.data.booking_number;
    toast.success("Booking tiket berhasil!");
    router.push({ name: "booking.detail", params: { bookingNumber } });
  } catch (err) {
    const msg = err.response?.data?.message || "Gagal melakukan booking. Coba lagi.";
    toast.error(msg);
  } finally {
    isSubmitting.value = false;
  }
}
</script>