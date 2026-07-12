<template>
  <div class="min-h-screen bg-slate-50 pb-24">
    <!-- ===== HEADER ===== -->
    <div class="bg-white border-b border-slate-100 sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <h1 class="text-xl font-black text-slate-800">Event & Aktivitas</h1>
        <p class="text-xs text-slate-400 mt-0.5">Temukan pengalaman seru di Jawa Timur</p>
      </div>

      <!-- Search & Filter -->
      <div class="max-w-7xl mx-auto px-6 pb-4 flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            v-model="searchQuery"
            @keyup.enter="fetchEvents"
            type="text" 
            placeholder="Cari event..." 
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-900 transition"
          />
        </div>
        <div class="flex gap-2 overflow-x-auto no-scrollbar">
          <button 
            v-for="tab in tabs" 
            :key="tab.value"
            @click="activeTab = tab.value; fetchEvents()"
            class="flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
            :class="activeTab === tab.value 
              ? 'bg-blue-950 text-white shadow-md' 
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8">
      
      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
          <div class="h-52 bg-slate-200"></div>
          <div class="p-5 space-y-3">
            <div class="h-4 bg-slate-200 rounded w-3/4"></div>
            <div class="h-3 bg-slate-200 rounded w-full"></div>
            <div class="flex justify-between mt-4">
              <div class="h-5 bg-slate-200 rounded w-24"></div>
              <div class="h-5 bg-slate-200 rounded-full w-20"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="events.length === 0" class="text-center py-20 bg-white rounded-2xl border border-slate-100">
        <CalendarX class="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <h3 class="text-lg font-bold text-slate-700 mb-2">Event Tidak Ditemukan</h3>
        <p class="text-sm text-slate-400">Tidak ada event dengan filter ini</p>
      </div>

      <!-- Event Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link 
          v-for="event in events" 
          :key="event.id"
          :to="`/events/${event.slug}`"
          class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group no-underline"
        >
          <!-- Image -->
          <div class="relative h-52 bg-slate-100 overflow-hidden">
            <img 
              v-if="event.image" 
              :src="event.image" 
              :alt="event.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-slate-200">
              <ImageOff class="w-10 h-10 text-slate-300" />
            </div>
            
            <!-- Status Badge -->
            <div class="absolute top-3 left-3">
              <span :class="event.status_color" class="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {{ event.status_label }}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-5">
            <!-- Date & Location Info -->
            <div class="flex items-center gap-4 text-xs text-slate-400 mb-3">
              <div class="flex items-center gap-1.5">
                <Calendar class="w-3.5 h-3.5" />
                <span>{{ formatDate(event.start_date) }}</span>
              </div>
              <div v-if="event.location" class="flex items-center gap-1.5 truncate">
                <MapPin class="w-3.5 h-3.5 flex-shrink-0" />
                <span class="truncate">{{ event.location }}</span>
              </div>
            </div>

            <h3 class="text-base font-extrabold text-slate-800 mb-2 group-hover:text-blue-900 transition line-clamp-2">
              {{ event.title }}
            </h3>
            
            <p class="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
              {{ event.description }}
            </p>

            <!-- Destination Tag -->
            <div v-if="event.destination" class="border-t border-slate-100 pt-3 mt-auto">
              <span class="text-[11px] font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md">
                📍 {{ event.destination.name }}
              </span>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Load More -->
      <div v-if="hasMorePages && events.length > 0" class="pt-8 text-center">
        <button 
          @click="loadMore" 
          :disabled="isLoadingMore"
          class="px-8 py-3 bg-white border border-slate-200 text-sm font-bold text-slate-600 rounded-xl hover:bg-slate-50 transition disabled:opacity-50 flex items-center gap-2 mx-auto"
        >
          <Loader2 v-if="isLoadingMore" class="w-4 h-4 animate-spin" />
          {{ isLoadingMore ? 'Memuat...' : 'Muat Lebih Banyak' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import dayjs from 'dayjs'
import { Search, Calendar, MapPin, CalendarX, ImageOff, Loader2 } from 'lucide-vue-next'

const toast = useToast()

const events = ref([])
const isLoading = ref(false)
const isLoadingMore = ref(false)
const activeTab = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const lastPage = ref(1)

const tabs = [
  { label: 'Semua', value: 'all' },
  { label: 'Akan Datang', value: 'upcoming' },
  { label: 'Berlangsung', value: 'ongoing' },
  { label: 'Selesai', value: 'finished' },
]

const hasMorePages = computed(() => currentPage.value < lastPage.value)

const formatDate = (date) => dayjs(date).format('DD MMM YYYY')

const fetchEvents = async () => {
  isLoading.value = true
  currentPage.value = 1
  try {
    const params = { page: 1, per_page: 12 }
    if (activeTab.value !== 'all') params.status = activeTab.value
    if (searchQuery.value) params.search = searchQuery.value

    const res = await api.get('/api/events', { params })
    events.value = res.data.data
    lastPage.value = res.data.meta.last_page
  } catch (err) {
    toast.error('Gagal memuat event')
  } finally {
    isLoading.value = false
  }
}

const loadMore = async () => {
  if (isLoadingMore.value || !hasMorePages.value) return
  isLoadingMore.value = true
  try {
    const nextPage = currentPage.value + 1
    const params = { page: nextPage, per_page: 12 }
    if (activeTab.value !== 'all') params.status = activeTab.value
    if (searchQuery.value) params.search = searchQuery.value

    const res = await api.get('/api/events', { params })
    events.value = [...events.value, ...res.data.data]
    currentPage.value = nextPage
    lastPage.value = res.data.meta.last_page
  } catch (err) {
    toast.error('Gagal memuat event')
  } finally {
    isLoadingMore.value = false
  }
}

onMounted(() => {
  fetchEvents()
})
</script>

<style scoped>
@reference "../../assets/css/app.css";

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>