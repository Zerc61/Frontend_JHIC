<template>
  <div class="min-h-screen bg-slate-50">
    <!-- ===== HERO HEADER ===== -->
    <section class="bg-gradient-to-br from-[#0a0f1e] via-[#111832] to-[#0d1530] relative overflow-hidden">
      <!-- Background decoration -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div class="max-w-7xl mx-auto px-6 sm:px-10 py-12 relative z-10">
        <div class="max-w-2xl mb-8">
          <h1 class="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
            Jelajahi <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Transportasi</span> Nusantara
          </h1>
          <p class="text-white/50 text-base">
            Temukan tiket pesawat, kereta, bus, dan kapal dengan harga terbaik.
          </p>
        </div>

        <!-- ===== SEARCH BAR ===== -->
        <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">

            <!-- Dari -->
            <div class="lg:col-span-3 relative">
              <label class="block text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Dari</label>
              <div class="relative">
                <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  v-model="originQuery"
                  @focus="originOpen = true"
                  @blur="closeOrigin"
                  @input="filterOrigin"
                  type="text"
                  placeholder="Ketik kota asal..."
                  class="w-full bg-white/10 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                />
                <!-- Dropdown -->
                <div
                  v-if="originOpen && filteredOrigin.length > 0"
                  class="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto"
                >
                  <button
                    v-for="city in filteredOrigin"
                    :key="city.code"
                    @mousedown.prevent="selectOrigin(city)"
                    class="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 transition flex items-center justify-between"
                    :class="filters.origin === city.code ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'"
                  >
                    <span>{{ city.name }}</span>
                    <span class="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{{ city.code }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Swap Button -->
            <div class="lg:col-span-1 flex items-end justify-center">
              <button
                @click="swapRoute"
                class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition cursor-pointer mb-0.5"
                title="Tukar Dari/Ke"
              >
                <ArrowLeftRight class="w-4 h-4" />
              </button>
            </div>

            <!-- Ke -->
            <div class="lg:col-span-3 relative">
              <label class="block text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Ke</label>
              <div class="relative">
                <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  v-model="destQuery"
                  @focus="destOpen = true"
                  @blur="closeDest"
                  @input="filterDest"
                  type="text"
                  placeholder="Ketik kota tujuan..."
                  class="w-full bg-white/10 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
                />
                <!-- Dropdown -->
                <div
                  v-if="destOpen && filteredDest.length > 0"
                  class="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto"
                >
                  <button
                    v-for="city in filteredDest"
                    :key="city.code"
                    @mousedown.prevent="selectDest(city)"
                    class="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 transition flex items-center justify-between"
                    :class="filters.destination === city.code ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'"
                  >
                    <span>{{ city.name }}</span>
                    <span class="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{{ city.code }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Tanggal -->
            <div class="lg:col-span-2">
              <label class="block text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Tanggal</label>
              <div class="relative">
                <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  v-model="filters.date"
                  @change="fetchTickets"
                  type="date"
                  :min="minDate"
                  placeholder="Semua tanggal"
                  class="w-full bg-white/10 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition [color-scheme:dark]"
                />
              </div>
            </div>

            <!-- Penumpang -->
            <div class="lg:col-span-1">
              <label class="block text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Penumpang</label>
              <select
                v-model.number="filters.passengers"
                @change="fetchTickets"
                class="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition appearance-none"
              >
                <option value="" class="text-slate-800">-</option>
                <option v-for="n in 9" :key="n" :value="n" class="text-slate-800">{{ n }}</option>
              </select>
            </div>

            <!-- Sort -->
            <div class="lg:col-span-1">
              <label class="block text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1.5">Urutkan</label>
              <select
                v-model="filters.sort"
                @change="fetchTickets"
                class="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition appearance-none"
              >
                <option value="" class="text-slate-800">Acak</option>
                <option value="price_asc" class="text-slate-800">Termurah</option>
                <option value="price_desc" class="text-slate-800">Termahal</option>
                <option value="departure_asc" class="text-slate-800">Terdekat</option>
                <option value="departure_desc" class="text-slate-800">Terjauh</option>
              </select>
            </div>

            <!-- Reset -->
            <div class="lg:col-span-1">
              <label class="block text-[10px] font-bold text-transparent uppercase tracking-wider mb-1.5 select-none">-</label>
              <button
                @click="resetFilters"
                class="w-full bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:text-white transition cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          <!-- Quick Routes -->
          <div class="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
            <span class="text-[10px] font-bold text-white/30 uppercase tracking-wider self-center mr-1">Populer:</span>
            <button
              v-for="route in quickRoutes"
              :key="route.label"
              @click="applyQuickRoute(route)"
              class="text-[11px] font-bold text-white/40 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 px-3 py-1 rounded-full transition cursor-pointer"
            >
              {{ route.label }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CONTENT AREA ===== -->
    <section class="max-w-7xl mx-auto px-6 sm:px-10 -mt-6 relative z-20">

      <!-- ===== MODE TABS + FILTERS ===== -->
      <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <!-- Mode Tabs -->
        <div class="flex items-center border-b border-slate-100 px-2 overflow-x-auto">
          <button
            v-for="tab in modeTabs"
            :key="tab.value"
            @click="setMode(tab.value)"
            class="flex items-center gap-2 px-5 py-4 text-sm font-bold transition border-b-2 -mb-px cursor-pointer whitespace-nowrap"
            :class="filters.mode === tab.value
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300'"
          >
            <span class="text-lg">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
            <span
              v-if="stats[tab.value] > 0"
              class="text-[11px] font-bold px-2 py-0.5 rounded-full"
              :class="filters.mode === tab.value ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'"
            >
              {{ stats[tab.value] }}
            </span>
          </button>
        </div>

        <!-- Secondary Filters -->
        <div class="flex flex-wrap items-center gap-4 px-5 py-3 border-b border-slate-50">
          <!-- Active filter tags -->
          <div v-if="hasActiveFilters" class="flex items-center gap-2 flex-wrap">
            <span
              v-if="filters.origin"
              class="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full"
            >
              Dari: {{ getCityName(filters.origin) }}
              <X @click="clearFilter('origin')" class="w-3 h-3 cursor-pointer hover:text-blue-800" />
            </span>
            <span
              v-if="filters.destination"
              class="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full"
            >
              Ke: {{ getCityName(filters.destination) }}
              <X @click="clearFilter('destination')" class="w-3 h-3 cursor-pointer hover:text-blue-800" />
            </span>
            <span
              v-if="filters.date"
              class="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full"
            >
              {{ dayjs(filters.date).format('DD MMM YYYY') }}
              <X @click="clearFilter('date')" class="w-3 h-3 cursor-pointer hover:text-blue-800" />
            </span>
            <span
              v-if="filters.passengers"
              class="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full"
            >
              {{ filters.passengers }} penumpang
              <X @click="clearFilter('passengers')" class="w-3 h-3 cursor-pointer hover:text-blue-800" />
            </span>
          </div>

          <!-- Direct Only Toggle -->
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <div
              @click="filters.direct_only = !filters.direct_only; fetchTickets()"
              class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition"
              :class="filters.direct_only ? 'bg-blue-600 border-blue-600' : 'border-slate-300 hover:border-slate-400'"
            >
              <Check v-if="filters.direct_only" class="w-3 h-3 text-white" />
            </div>
            <span class="text-xs font-bold text-slate-500">Langsung saja</span>
          </label>

          <!-- Price Range -->
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-bold text-slate-400 uppercase">Harga:</span>
            <input
              v-model.number="filters.min_price"
              @change="debouncedFetch"
              type="number"
              placeholder="Min"
              class="w-24 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
            <span class="text-slate-300">-</span>
            <input
              v-model.number="filters.max_price"
              @change="debouncedFetch"
              type="number"
              placeholder="Max"
              class="w-24 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          <!-- Count -->
          <div class="ml-auto">
            <span class="text-[11px] font-bold text-slate-400">
              {{ meta.total }} tiket
            </span>
          </div>
        </div>

        <!-- ===== TICKET LIST ===== -->
        <div class="divide-y divide-slate-50">
          <!-- Loading -->
          <div v-if="isLoading && tickets.length === 0" class="p-8">
            <div class="space-y-4">
              <div v-for="n in 5" :key="n" class="flex items-center gap-4 animate-pulse">
                <div class="w-12 h-12 bg-slate-100 rounded-xl"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-slate-100 rounded w-48"></div>
                  <div class="h-3 bg-slate-100 rounded w-32"></div>
                </div>
                <div class="h-10 w-20 bg-slate-100 rounded-xl"></div>
              </div>
            </div>
          </div>

          <!-- Ticket Cards -->
          <div
            v-for="ticket in tickets"
            :key="ticket.id"
            class="group hover:bg-slate-50/50 transition-colors"
          >
            <div class="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
              <!-- Left: Date Badge + Provider -->
              <div class="flex items-center gap-3 sm:w-44 shrink-0">
                <div class="w-12 h-12 rounded-xl bg-slate-50 flex flex-col items-center justify-center shrink-0">
                  <span class="text-[10px] font-bold text-slate-400 uppercase leading-none">{{ formatDateShort(ticket.departure_date) }}</span>
                  <span class="text-lg font-black text-slate-700 leading-none mt-0.5">{{ formatDay(ticket.departure_date) }}</span>
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-extrabold text-slate-800 truncate">{{ ticket.provider }}</p>
                  <p class="text-[11px] text-slate-400 truncate">
                    {{ ticket.flight_number || ticket.transport_label }}
                  </p>
                </div>
              </div>

              <!-- Center: Route Timeline -->
              <div class="flex-1 flex items-center gap-3">
                <!-- Departure -->
                <div class="text-center w-20 shrink-0">
                  <p class="text-xl font-black text-slate-800">{{ ticket.departure_time }}</p>
                  <p class="text-xs font-bold text-slate-500">{{ ticket.origin_code }}</p>
                  <p class="text-[10px] text-slate-400 truncate max-w-[80px]">{{ formatCityName(ticket.origin_name) }}</p>
                </div>

                <!-- Timeline -->
                <div class="flex-1 flex flex-col items-center px-2 min-w-[80px]">
                  <p class="text-[10px] font-bold text-slate-400 mb-1.5">{{ ticket.duration }}</p>
                  <div class="w-full flex items-center gap-1">
                    <div class="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                    <div class="flex-1 h-px relative">
                      <div class="absolute inset-0 bg-slate-200"></div>
                      <div v-if="!ticket.is_transit" class="absolute inset-0 bg-blue-500"></div>
                      <div v-if="ticket.transport_mode === 'pesawat' && !ticket.is_transit" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 text-xs">
                        {{ ticket.transport_icon }}
                      </div>
                    </div>
                    <div class="w-2 h-2 rounded-full border-2 shrink-0" :class="ticket.is_transit ? 'border-amber-400 bg-white' : 'border-blue-500 bg-white'"></div>
                  </div>
                  <p class="text-[10px] font-bold mt-1.5" :class="ticket.is_transit ? 'text-amber-500' : 'text-emerald-500'">
                    {{ ticket.is_transit ? 'Transit' : 'Direct' }}
                  </p>
                </div>

                <!-- Arrival -->
                <div class="text-center w-20 shrink-0">
                  <p class="text-xl font-black text-slate-800">{{ ticket.arrival_time }}</p>
                  <p class="text-xs font-bold text-slate-500">{{ ticket.destination_code }}</p>
                  <p class="text-[10px] text-slate-400 truncate max-w-[80px]">{{ formatCityName(ticket.destination_name) }}</p>
                </div>
              </div>

              <!-- Right: Price + Action -->
              <div class="sm:w-44 shrink-0 flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 sm:border-l border-slate-100 sm:pl-5 pt-3 sm:pt-0">
                <div class="text-center sm:text-right">
                  <p class="text-[10px] font-bold text-slate-400 uppercase">/orang</p>
                  <p class="text-lg font-black text-slate-800">{{ ticket.price_formatted }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <div class="text-right">
                    <p class="text-[11px] font-bold" :class="ticket.available_seats <= 5 ? 'text-red-500' : 'text-slate-400'">
                      {{ ticket.available_seats }} kursi
                    </p>
                    <p class="text-[10px] text-slate-400">{{ ticket.class_type }}</p>
                  </div>
                  <button
                    @click="goToBook(ticket)"
                    class="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-5 rounded-xl transition cursor-pointer whitespace-nowrap"
                  >
                    Pilih
                  </button>
                </div>
              </div>
            </div>

            <!-- Transit Warning -->
            <div v-if="ticket.is_transit && ticket.transit_info" class="px-5 pb-4">
              <div class="flex items-center gap-2 text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                <AlertTriangle class="w-4 h-4 shrink-0" />
                <p class="text-xs font-medium">{{ ticket.transit_info }}</p>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="!isLoading && tickets.length === 0" class="py-16 text-center">
            <SearchX class="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p class="text-base font-bold text-slate-400">Tiket tidak ditemukan</p>
            <p class="text-sm text-slate-300 mt-1">Coba ubah filter atau reset pencarian</p>
            <button
              @click="resetFilters"
              class="mt-4 text-sm font-bold text-blue-600 hover:text-blue-700 transition cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="meta.last_page > 1" class="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/50">
          <p class="text-xs font-bold text-slate-400">
            Halaman {{ meta.current_page }} dari {{ meta.last_page }}
          </p>
          <div class="flex items-center gap-2">
            <button
              @click="prevPage"
              :disabled="meta.current_page <= 1 || isLoading"
              class="px-4 py-2 text-xs font-bold border border-slate-200 rounded-lg hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Sebelumnya
            </button>
            <button
              @click="nextPage"
              :disabled="meta.current_page >= meta.last_page || isLoading"
              class="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      <div class="h-10"></div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";
import { MapPin, Calendar, Check, AlertTriangle, SearchX, ArrowLeftRight, X } from "lucide-vue-next";
import dayjs from "dayjs";
import api from "@/services/api";

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

// ===== STATE =====
const isLoading = ref(false);
const tickets = ref([]);
const meta = ref({
  current_page: 1,
  last_page: 1,
  per_page: 12,
  total: 0,
  filters: {},
});

const stats = ref({
  total: 0,
  pesawat: 0,
  kereta: 0,
  bus: 0,
  kapal: 0,
});

const minDate = dayjs().format('YYYY-MM-DD');

const filters = reactive({
  origin: "",
  destination: "",
  date: "",
  passengers: "",
  mode: "",
  sort: "",
  min_price: "",
  max_price: "",
  direct_only: false,
});

// ===== AUTOCOMPLETE STATE =====
const originQuery = ref("");
const destQuery = ref("");
const originOpen = ref(false);
const destOpen = ref(false);
const filteredOrigin = ref([]);
const filteredDest = ref([]);

const cities = [
  { name: "Jakarta", code: "CGK" },
  { name: "Surabaya", code: "SUB" },
  { name: "Bali / Denpasar", code: "DPS" },
  { name: "Lombok", code: "LOP" },
  { name: "Makassar", code: "UPG" },
  { name: "Balikpapan", code: "BPN" },
  { name: "Medan", code: "KNO" },
  { name: "Padang", code: "PDG" },
  { name: "Bandung", code: "BD" },
  { name: "Yogyakarta", code: "YK" },
  { name: "Semarang", code: "SM" },
  { name: "Malang", code: "ML" },
  { name: "Lombok (Terminal)", code: "MBL" },
  { name: "Batam", code: "BAT" },
  { name: "Singapura", code: "SIN" },
  { name: "Ambon", code: "AMB" },
  { name: "Jakarta (Gambir)", code: "GMR" },
  { name: "Jakarta (Priok)", code: "JKT" },
  { name: "Tanjung Luar", code: "TJL" },
  { name: "Makassar (Pelabuhan)", code: "MKS" },
];

const quickRoutes = [
  { label: "Jakarta - Lombok", origin: "CGK", destination: "LOP" },
  { label: "Jakarta - Bali", origin: "CGK", destination: "DPS" },
  { label: "Bali - Lombok", origin: "DPS", destination: "LOP" },
  { label: "Jakarta - Surabaya", origin: "CGK", destination: "SUB" },
  { label: "Surabaya - Lombok", origin: "SUB", destination: "MBL" },
  { label: "Jakarta - Yogyakarta", origin: "GMR", destination: "YK" },
];

const modeTabs = [
  { value: "", label: "Semua", icon: "🌐" },
  { value: "pesawat", label: "Pesawat", icon: "✈️" },
  { value: "kereta", label: "Kereta", icon: "🚆" },
  { value: "bus", label: "Bus", icon: "🚌" },
  { value: "kapal", label: "Kapal", icon: "🚢" },
];

// ===== COMPUTED =====
const hasActiveFilters = computed(() => {
  return filters.origin || filters.destination || filters.date || filters.passengers;
});

// ===== DEBOUNCE =====
let debounceTimer = null;
function debouncedFetch() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    meta.value.current_page = 1;
    fetchTickets();
  }, 400);
}

// ===== AUTOCOMPLETE =====
function filterOrigin() {
  const q = originQuery.value.toLowerCase();
  filteredOrigin.value = q.length === 0
    ? cities
    : cities.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));

  // Jika user menghapus text, clear filter
  if (q.length === 0 && filters.origin) {
    filters.origin = "";
    meta.value.current_page = 1;
    fetchTickets();
  }
}

function filterDest() {
  const q = destQuery.value.toLowerCase();
  filteredDest.value = q.length === 0
    ? cities
    : cities.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));

  if (q.length === 0 && filters.destination) {
    filters.destination = "";
    meta.value.current_page = 1;
    fetchTickets();
  }
}

function selectOrigin(city) {
  originQuery.value = city.name;
  filters.origin = city.code;
  originOpen.value = false;
  meta.value.current_page = 1;
  fetchTickets();
}

function selectDest(city) {
  destQuery.value = city.name;
  filters.destination = city.code;
  destOpen.value = false;
  meta.value.current_page = 1;
  fetchTickets();
}

function closeOrigin() {
  setTimeout(() => { originOpen.value = false; }, 200);
}

function closeDest() {
  setTimeout(() => { destOpen.value = false; }, 200);
}

function swapRoute() {
  const tmpOrigin = filters.origin;
  const tmpOriginQuery = originQuery.value;
  filters.origin = filters.destination;
  originQuery.value = destQuery.value;
  filters.destination = tmpOrigin;
  destQuery.value = tmpOriginQuery;
  meta.value.current_page = 1;
  fetchTickets();
}

function applyQuickRoute(route) {
  const originCity = cities.find(c => c.code === route.origin);
  const destCity = cities.find(c => c.code === route.destination);
  originQuery.value = originCity ? originCity.name : route.origin;
  destQuery.value = destCity ? destCity.name : route.destination;
  filters.origin = route.origin;
  filters.destination = route.destination;
  filters.mode = "";
  meta.value.current_page = 1;
  fetchTickets();
}

// ===== FETCH =====
async function fetchTickets() {
  isLoading.value = true;

  try {
    const params = {
      page: meta.value.current_page,
      per_page: meta.value.per_page,
    };

    if (filters.origin) params.origin = filters.origin;
    if (filters.destination) params.destination = filters.destination;
    if (filters.date) params.date = filters.date;
    if (filters.passengers) params.passengers = filters.passengers;
    if (filters.mode) params.mode = filters.mode;
    if (filters.sort) params.sort = filters.sort;
    if (filters.min_price) params.min_price = filters.min_price;
    if (filters.max_price) params.max_price = filters.max_price;
    if (filters.direct_only) params.direct_only = 1;

    const res = await api.get("/api/transport-tickets", { params });
    tickets.value = res.data.data;
    meta.value = res.data.meta;
  } catch {
    toast.error("Gagal memuat tiket");
  } finally {
    isLoading.value = false;
  }
}

async function fetchStats() {
  try {
    const res = await api.get("/api/transport-tickets/stats");
    stats.value = res.data.data;
  } catch {
    // silent
  }
}

// ===== ACTIONS =====
function setMode(mode) {
  filters.mode = mode;
  meta.value.current_page = 1;
  fetchTickets();
}

function clearFilter(key) {
  if (key === 'origin') {
    filters.origin = "";
    originQuery.value = "";
  } else if (key === 'destination') {
    filters.destination = "";
    destQuery.value = "";
  } else {
    filters[key] = key === 'passengers' ? "" : "";
  }
  meta.value.current_page = 1;
  fetchTickets();
}

function resetFilters() {
  filters.origin = "";
  filters.destination = "";
  filters.date = "";
  filters.passengers = "";
  filters.mode = "";
  filters.sort = "";
  filters.min_price = "";
  filters.max_price = "";
  filters.direct_only = false;
  originQuery.value = "";
  destQuery.value = "";
  meta.value.current_page = 1;
  fetchTickets();
}

function prevPage() {
  if (meta.value.current_page > 1) {
    meta.value.current_page--;
    fetchTickets();
    window.scrollTo({ top: 300, behavior: "smooth" });
  }
}

function nextPage() {
  if (meta.value.current_page < meta.value.last_page) {
    meta.value.current_page++;
    fetchTickets();
    window.scrollTo({ top: 300, behavior: "smooth" });
  }
}

function goToBook(ticket) {
  if (!authStore.isLoggedIn) {
    toast.error("Silakan login terlebih dahulu");
    router.push({ name: "login", query: { redirect: router.currentRoute.value.fullPath } });
    return;
  }

  router.push({
    name: "transport-ticket.book",
    query: {
      ticket_id: ticket.id,
      passengers: filters.passengers || 1,
    },
  });
}

// ===== HELPERS =====
function formatDateShort(dateStr) {
  return dayjs(dateStr).format("MMM");
}

function formatDay(dateStr) {
  return dayjs(dateStr).format("DD");
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
    .replace(/\s+(International|Soekarno-Hatta|Sultan\s+.+)$/i, "");
}

function getCityName(code) {
  const city = cities.find(c => c.code === code);
  return city ? city.name : code;
}

// ===== INIT =====
onMounted(() => {
  filteredOrigin.value = cities;
  filteredDest.value = cities;
  fetchStats();
  fetchTickets();
});
</script>