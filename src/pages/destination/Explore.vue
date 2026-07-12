<template>
  <div>
    <!-- ===== HERO SEARCH ===== -->
    <section class="relative bg-slate-900 py-20 overflow-hidden">
      <!-- Decorative -->
      <div
        class="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"
      ></div>

      <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <p class="text-blue-400 text-xs font-bold tracking-[0.2em] mb-3">
          JELAJAHI
        </p>
        <h1 class="text-4xl font-black text-white mb-4">Temukan Destinasimu</h1>
        <p class="text-slate-400 text-sm mb-10 max-w-md mx-auto">
          Jelajahi ribuan destinasi indah di Nusantara, dari pantai hingga
          pegunungan
        </p>

        <!-- Search Bar -->
        <div class="relative max-w-xl mx-auto">
          <Search
            class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari destinasi..."
            class="w-full pl-14 pr-32 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
            @input="debouncedSearch"
          />
          <button
            @click="handleSearch"
            class="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition"
          >
            Cari
          </button>
        </div>
      </div>
    </section>

    <!-- ===== KONTEN UTAMA ===== -->
    <main class="max-w-7xl mx-auto px-6 py-12">
      <!-- Category Chips -->
      <div
        class="flex items-center gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide"
      >
        <button
          @click="selectCategory(null)"
          :class="
            !selectedCategory
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
          "
          class="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-200"
        >
          Semua
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="selectCategory(cat.slug)"
          :class="
            selectedCategory === cat.slug
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
          "
          class="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-200 flex items-center gap-2"
        >
          <span v-if="cat.icon">{{ cat.icon }}</span>
          {{ cat.name }}
          <span class="text-xs opacity-60">({{ cat.destinations_count }})</span>
        </button>
      </div>

      <!-- Results Info -->
      <div class="flex items-center justify-between mb-6">
        <p class="text-sm text-slate-500">
          Menampilkan
          <span class="font-bold text-slate-700">{{
            destinations.length
          }}</span>
          destinasi
          <span v-if="selectedCategory" class="text-blue-600">
            di <span class="font-bold">{{ selectedCategory }}</span>
          </span>
          <span v-if="searchQuery" class="text-blue-600">
            untuk "<span class="font-bold">{{ searchQuery }}</span
            >"
          </span>
        </p>
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-400">Urutkan:</span>
          <select
            v-model="sortBy"
            @change="fetchDestinations"
            class="text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="latest">Terbaru</option>
            <option value="cheapest">Termurah</option>
            <option value="expensive">Termahal</option>
          </select>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div
        v-if="isLoading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="n in 9"
          :key="n"
          class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse"
        >
          <div class="h-48 bg-slate-200"></div>
          <div class="p-5 space-y-3">
            <div class="h-4 bg-slate-200 rounded w-2/3"></div>
            <div class="h-3 bg-slate-200 rounded w-full"></div>
            <div class="h-3 bg-slate-200 rounded w-1/2"></div>
            <div class="flex justify-between">
              <div class="h-5 bg-slate-200 rounded w-24"></div>
              <div class="h-5 bg-slate-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="destinations.length === 0" class="text-center py-20">
        <div
          class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <SearchX class="w-8 h-8 text-slate-300" />
        </div>
        <h3 class="text-lg font-bold text-slate-700 mb-2">
          Destinasi tidak ditemukan
        </h3>
        <p class="text-sm text-slate-400 mb-6">
          Coba ubah kata kunci atau filter kategori
        </p>
        <button
          @click="resetFilters"
          class="text-sm font-bold text-blue-600 hover:text-blue-700 transition"
        >
          Reset Filter
        </button>
      </div>

      <!-- Destination Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="dest in destinations"
          :key="dest.id"
          @click="$router.push(`/destination/${dest.slug}`)"
          class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
        >
          <!-- Image -->
          <div class="relative h-48 bg-slate-100 overflow-hidden">
            <img
              v-if="dest.main_image"
              :src="dest.main_image"
              :alt="dest.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <MapPin class="w-12 h-12 text-slate-200" />
            </div>

            <!-- Badge Kategori -->
            <div
              class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full"
            >
              {{ dest.category?.name }}
            </div>

            <!-- Badge Harga -->
            <div
              class="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg"
            >
              {{ dest.ticket_price_formatted }}
            </div>
          </div>

          <!-- Info -->
          <div class="p-5">
            <h3
              class="text-base font-extrabold text-slate-800 mb-2 truncate group-hover:text-blue-600 transition"
            >
              {{ dest.name }}
            </h3>
            <p
              class="text-xs text-slate-400 flex items-center gap-1.5 mb-3 truncate"
            >
              <MapPin class="w-3.5 h-3.5 flex-shrink-0" />
              {{ dest.address }}
            </p>
            <div class="flex items-center justify-between">
              <!-- Rating -->
              <div class="flex items-center gap-1">
                <Star class="w-4 h-4 text-amber-400 fill-amber-400" />
                <span class="text-sm font-bold text-slate-700">{{
                  dest.average_rating
                }}</span>
              </div>
              <!-- Status -->
              <span
                class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                :class="
                  dest.status === 'published'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-slate-100 text-slate-500'
                "
              >
                {{ dest.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="meta.lastPage > 1"
        class="flex items-center justify-center gap-2 mt-12"
      >
        <button
          @click="goToPage(meta.currentPage - 1)"
          :disabled="meta.currentPage <= 1"
          class="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>

        <template v-for="(page, index) in visiblePages">
          <button
            v-if="page !== '...'"
            :key="`page-${index}`"
            @click="goToPage(page)"
            :class="
              page === meta.currentPage
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
            "
            class="w-10 h-10 rounded-xl border text-sm font-bold flex items-center justify-center transition"
          >
            {{ page }}
          </button>
          <span
            v-else
            :key="`ellipsis-${index}`"
            class="w-10 h-10 flex items-center justify-center text-slate-400"
            >...</span
          >
        </template>

        <button
          @click="goToPage(meta.currentPage + 1)"
          :disabled="meta.currentPage >= meta.lastPage"
          class="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/services/api";
import {
  Search,
  MapPin,
  Star,
  SearchX,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";

const route = useRoute();
const router = useRouter();

const isLoading = ref(true);
const destinations = ref([]);
const categories = ref([]);
const searchQuery = ref("");
const selectedCategory = ref(null);
const sortBy = ref("latest");
let searchTimeout = null;

const meta = reactive({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  perPage: 12,
});

// Visible pagination pages
const visiblePages = computed(() => {
  const pages = [];
  const current = meta.currentPage;
  const last = meta.lastPage;

  if (last <= 5) {
    for (let i = 1; i <= last; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (current < last - 2) pages.push("...");
    pages.push(last);
  }

  return pages;
});

// Fetch categories
const fetchCategories = async () => {
  try {
    const res = await api.get("/api/destination-categories");
    categories.value = res.data.data;
  } catch (err) {
    console.error("Gagal fetch kategori:", err);
  }
};

// Fetch destinations
const fetchDestinations = async () => {
  isLoading.value = true;
  try {
    const params = {
      page: meta.currentPage,
      per_page: meta.perPage,
    };

    if (selectedCategory.value) {
      params.category = selectedCategory.value;
    }
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }

    const res = await api.get("/api/destinations", { params });

    // Sort client-side if needed (since backend doesn't support sort param)
    let data = res.data.data;
    if (sortBy.value === "cheapest") {
      data.sort((a, b) => a.ticket_price - b.ticket_price);
    } else if (sortBy.value === "expensive") {
      data.sort((a, b) => b.ticket_price - a.ticket_price);
    }

    destinations.value = data;
    meta.currentPage = res.data.meta.current_page;
    meta.lastPage = res.data.meta.last_page;
    meta.total = res.data.meta.total;
  } catch (err) {
    console.error("Gagal fetch destinasi:", err);
  } finally {
    isLoading.value = false;
  }
};

// Debounced search
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    meta.currentPage = 1;
    fetchDestinations();
  }, 500);
};

// Handle search button
const handleSearch = () => {
  clearTimeout(searchTimeout);
  meta.currentPage = 1;
  fetchDestinations();
};

// Select category
const selectCategory = (slug) => {
  selectedCategory.value = slug;
  meta.currentPage = 1;
  fetchDestinations();
};

// Reset filters
const resetFilters = () => {
  searchQuery.value = "";
  selectedCategory.value = null;
  sortBy.value = "latest";
  meta.currentPage = 1;
  fetchDestinations();
};

// Go to page
const goToPage = (page) => {
  if (page < 1 || page > meta.lastPage) return;
  meta.currentPage = page;
  fetchDestinations();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Watch route query params
watch(
  () => route.query,
  (query) => {
    if (query.category) {
      selectedCategory.value = query.category;
    }
    if (query.search) {
      searchQuery.value = query.search;
    }
    fetchDestinations();
  },
  { immediate: true },
);

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
@reference "../../assets/css/app.css";

/* Hide scrollbar for category chips */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
