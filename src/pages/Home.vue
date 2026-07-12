<template>
  <div>
    <!-- ==================== HERO SECTION ==================== -->
    <section
      class="relative w-full h-[500px] flex items-center overflow-hidden"
    >
      <!-- Background -->
      <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(${heroBg})` }"
      ></div>
      <div
        class="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-transparent"
      ></div>

      <div
        class="relative z-10 max-w-7xl mx-auto w-full px-10 flex justify-between items-center"
      >
        <!-- Teks Kiri -->
        <div class="max-w-lg text-white">
          <h4 class="text-xs font-bold text-amber-400 tracking-[0.2em] mb-3">
            EXPLORE NUSANTARA - ID
          </h4>
          <h1 class="text-5xl font-black leading-[1.1] mb-5 drop-shadow-lg">
            EXPLORE<br />BEAUTIFUL<br />WORLD WITH US
          </h1>
          <p
            class="text-sm font-medium text-slate-300 leading-relaxed mb-8 max-w-md"
          >
            Tinggalkan kerumitan merencanakan liburan. Fokuslah pada petualangan
            dan biarkan kami mengurus sisanya.
          </p>
          <button
            @click="$router.push('/explore')"
            class="border-2 border-white text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-white hover:text-slate-900 transition-all duration-300 cursor-pointer"
          >
            Discover Now
          </button>
        </div>

        <!-- 3 Kartu Kanan -->
        <div class="hidden lg:flex gap-4 items-center">
          <div
            class="w-40 h-60 rounded-2xl overflow-hidden border-4 border-white/90 shadow-2xl transform translate-y-5"
          >
            <img
              :src="heroCard1"
              class="w-full h-full object-cover"
              alt="Card 1"
            />
          </div>
          <div
            class="w-40 h-64 rounded-2xl overflow-hidden border-4 border-white/90 shadow-2xl transform -translate-y-3 z-10"
          >
            <img
              :src="heroCard2"
              class="w-full h-full object-cover"
              alt="Card 2"
            />
          </div>
          <div
            class="w-40 h-60 rounded-2xl overflow-hidden border-4 border-white/90 shadow-2xl transform translate-y-5"
          >
            <img
              :src="heroCard3"
              class="w-full h-full object-cover"
              alt="Card 3"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== MAIN CONTENT ==================== -->
    <main class="max-w-7xl mx-auto px-10 py-12">
      <!-- ===== 8 MENU IKON ===== -->
      <div class="grid grid-cols-4 md:grid-cols-8 gap-4 mb-16">
        <div
          v-for="menu in menus"
          :key="menu.label"
          @click="menu.action()"
          class="flex flex-col items-center gap-2.5 cursor-pointer group"
        >
          <div
            :class="menu.bgColor"
            class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-200"
          >
            <component
              :is="menu.icon"
              :class="menu.iconColor"
              class="w-7 h-7"
            />
          </div>
          <span
            class="text-[13px] font-bold text-slate-700 text-center leading-tight"
          >
            {{ menu.label }}
          </span>
        </div>
      </div>

      <!-- ===== DESTINASI POPULER (Data API) ===== -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-extrabold text-slate-800">Destinasi Populer</h2>
        <router-link
          to="/explore"
          class="text-sm font-bold text-blue-600 hover:underline no-underline"
        >
          Lihat Semua →
        </router-link>
      </div>

      <!-- Loading Skeleton -->
      <div
        v-if="isLoadingDest"
        class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
      >
        <div
          v-for="n in 3"
          :key="n"
          class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse"
        >
          <div class="h-44 bg-slate-200"></div>
          <div class="p-5 space-y-2">
            <div class="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div>
            <div class="h-3 bg-slate-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>

      <!-- Card Destinasi -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div
          v-for="dest in destinations"
          :key="dest.id"
          @click="$router.push(`/destination/${dest.slug}`)"
          class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
        >
          <div class="relative h-44 bg-slate-100 overflow-hidden">
            <img
              v-if="dest.main_image"
              :src="dest.main_image"
              :alt="dest.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-slate-300"
            >
              <MapPin class="w-12 h-12" />
            </div>
            <!-- Badge Kategori -->
            <div
              class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm"
            >
              {{ dest.category?.name }}
            </div>
          </div>
          <div class="p-5 text-center">
            <h3 class="text-base font-extrabold text-slate-800 mb-1 truncate">
              {{ dest.name }}
            </h3>
            <p class="text-blue-600 font-bold text-sm">
              {{ dest.ticket_price_formatted }}
            </p>
            <!-- Rating -->
            <div class="flex items-center justify-center gap-1 mt-2">
              <Star class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span class="text-xs font-bold text-slate-500">{{
                dest.average_rating
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== EVENT MENDELANG (Data API) ===== -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-extrabold text-slate-800">Event Mendatang</h2>
        <router-link
          to="/events"
          class="text-sm font-bold text-blue-600 hover:underline no-underline"
        >
          Lihat Semua →
        </router-link>
      </div>

      <!-- Loading Skeleton Events -->
      <div
        v-if="isLoadingEvents"
        class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        <div
          v-for="n in 3"
          :key="n"
          class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse"
        >
          <div class="h-36 bg-slate-200"></div>
          <div class="p-4 space-y-2">
            <div class="h-4 bg-slate-200 rounded w-3/4"></div>
            <div class="h-3 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Card Events -->
      <div
        v-else-if="!isLoadingEvents && events.length > 0"
        class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        <div
          v-for="event in events"
          :key="event.id"
          @click="$router.push(`/events/${event.slug}`)"
          class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
        >
          <div class="relative h-36 bg-slate-100 overflow-hidden">
            <img
              v-if="event.image"
              :src="event.image"
              :alt="event.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-slate-300"
            >
              <CalendarDays class="w-10 h-10" />
            </div>
            <!-- Badge Status -->
            <div
              :class="eventStatusColor(event.status)"
              class="absolute top-3 right-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider"
            >
              {{ event.status }}
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-sm font-extrabold text-slate-800 mb-1 truncate">
              {{ event.title }}
            </h3>
            <p class="text-xs text-slate-400 flex items-center gap-1">
              <Calendar class="w-3 h-3" />
              {{ formatDate(event.start_date) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Empty State Events -->
      <div v-else class="text-center py-10 mb-10">
        <CalendarDays class="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p class="text-sm text-slate-400 font-medium">
          Belum ada event mendatang
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";
// Tambahkan Plane di import lucide
import {
  Compass,
  Building2,
  Plane,    // ← TAMBAHKAN
  Package,
  CalendarDays,
  MapPin,
  Heart,
  ShoppingBag,
  UserCircle,
  Star,
  Calendar,
  Map,
  Ticket,
} from "lucide-vue-next";
import dayjs from "dayjs";
import api from "@/services/api";

// Import gambar hero (taruh di src/assets/images/)
import heroBg from "@/assets/images/batu.png";
import heroCard1 from "@/assets/images/batu.png";
import heroCard2 from "@/assets/images/angkut.png";
import heroCard3 from "@/assets/images/malang.png";

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const isLoadingDest = ref(true);
const isLoadingEvents = ref(true);
const destinations = ref([]);
const events = ref([]);

// ===== MENU IKON =====
const menus = [
  {
    label: "Explore",
    icon: Compass,
    bgColor: "bg-sky-100",
    iconColor: "text-sky-600",
    action: () => router.push("/explore"),
  },
  {
    label: "Hotels",
    icon: Building2,
    bgColor: "bg-violet-100",
    iconColor: "text-violet-600",
    action: () => router.push("/hotels"),
  },
{
  label: "Tiket",
  icon: Plane,
  bgColor: "bg-emerald-100",
  iconColor: "text-emerald-600",
  action: () => router.push("/transport-tickets"),
},
  {
    label: "Paket",
    icon: Package,
    bgColor: "bg-rose-100",
    iconColor: "text-rose-600",
    action: () => router.push("/packages"),
  },
  {
    label: "Events",
    icon: CalendarDays,
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
    action: () => router.push("/events"),
  },
  {
    label: "Booking",
    icon: Ticket,
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-600",
    action: () => requireAuth("/bookings"),
  },
  {
    label: "Wishlist",
    icon: Heart,
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
    action: () => requireAuth("/wishlist"),
  },
  {
    label: "Profil",
    icon: UserCircle,
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
    action: () => requireAuth("/profile"),
  },
];

// ===== HELPERS =====
const requireAuth = (path) => {
  if (!authStore.isLoggedIn) {
    toast.error("Silakan login terlebih dahulu untuk membuka menu ini");
    router.push({ path: "/login", query: { redirect: path } });
    return;
  }
  router.push(path);
};

const formatDate = (date) => {
  return dayjs(date).format("DD MMM YYYY");
};

const eventStatusColor = (status) => {
  const colors = {
    upcoming: "bg-blue-500",
    ongoing: "bg-green-500",
    finished: "bg-slate-400",
    cancelled: "bg-red-500",
  };
  return colors[status] || "bg-slate-400";
};

// ===== FETCH DATA =====
const fetchDestinations = async () => {
  try {
    const res = await api.get("/api/destinations", {
      params: { per_page: 3 },
    });
    destinations.value = res.data.data;
  } catch (err) {
    console.error("Gagal fetch destinasi:", err);
  } finally {
    isLoadingDest.value = false;
  }
};

const fetchEvents = async () => {
  try {
    const res = await api.get("/api/events", {
      params: { per_page: 3 },
    });
    events.value = res.data.data;
  } catch (err) {
    console.error("Gagal fetch events:", err);
  } finally {
    isLoadingEvents.value = false;
  }
};

onMounted(() => {
  fetchDestinations();
  fetchEvents();
});
</script>
