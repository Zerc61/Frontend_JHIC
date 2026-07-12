<template>
  <div>
    <!-- ===== HEADER ===== -->
    <section class="relative bg-slate-900 py-16 overflow-hidden">
      <div class="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>

      <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <button 
          @click="$router.back()" 
          class="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition mb-6"
        >
          <ArrowLeft class="w-3.5 h-3.5" /> Kembali
        </button>
        <p class="text-purple-400 text-xs font-bold tracking-[0.2em] mb-2">DESTINASI</p>
        <h1 class="text-3xl font-black text-white mb-2">{{ destinationName }}</h1>
        <p class="text-slate-400 text-sm">Temukan produk dan jasa UMKM lokal terbaik</p>
      </div>
    </section>

    <!-- ===== CONTENT ===== -->
    <main class="max-w-7xl mx-auto px-6 py-12">
      
      <!-- Search & Filter -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
        <div class="relative flex-1">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari UMKM..."
            class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 transition"
            @input="debouncedSearch"
          />
        </div>
        <div class="flex gap-2">
          <button
            @click="activeStatus = 'all'"
            :class="activeStatus === 'all' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-slate-200'"
            class="px-4 py-3 rounded-xl text-xs font-bold border transition"
          >
            Semua ({{ totalCount }})
          </button>
          <button
            @click="activeStatus = 'active'"
            :class="activeStatus === 'active' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200'"
            class="px-4 py-3 rounded-xl text-xs font-bold border transition"
          >
            Aktif
          </button>
        </div>
      </div>

      <!-- Results Info -->
      <p class="text-sm text-slate-400 mb-6">
        Menampilkan <span class="font-bold text-slate-600">{{ umkms.length }}</span> UMKM
      </p>

      <!-- Loading -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
          <div class="h-40 bg-slate-200"></div>
          <div class="p-5 space-y-3">
            <div class="h-4 bg-slate-200 rounded w-3/4"></div>
            <div class="h-3 bg-slate-200 rounded w-full"></div>
            <div class="h-3 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="umkms.length === 0" class="text-center py-20">
        <Store class="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <h3 class="text-lg font-bold text-slate-700 mb-2">Belum ada UMKM</h3>
        <p class="text-sm text-slate-400">Belum ada UMKM yang terdaftar di destinasi ini</p>
      </div>

      <!-- UMKM Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="umkm in umkms"
          :key="umkm.id"
          @click="$router.push(`/umkms/${umkm.slug}`)"
          class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
        >
          <!-- Image -->
          <div class="relative h-40 bg-slate-100 overflow-hidden">
            <img
              v-if="umkm.image"
              :src="umkm.image"
              :alt="umkm.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <Store class="w-12 h-12 text-slate-200" />
            </div>

            <!-- Status Badge -->
            <div 
              class="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              :class="statusColor(umkm.status)"
            >
              {{ umkm.status }}
            </div>

            <!-- Category Badge -->
            <div class="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full">
              {{ umkm.category?.name }}
            </div>
          </div>

          <!-- Info -->
          <div class="p-5">
            <h3 class="text-base font-extrabold text-slate-800 mb-1.5 truncate group-hover:text-purple-600 transition">
              {{ umkm.name }}
            </h3>
            <p class="text-xs text-slate-400 flex items-center gap-1.5 mb-3 truncate">
              <MapPin class="w-3.5 h-3.5 flex-shrink-0" />
              {{ umkm.address }}
            </p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1">
                <Star class="w-4 h-4 text-amber-400 fill-amber-400" />
                <span class="text-sm font-bold text-slate-700">{{ umkm.average_rating }}</span>
              </div>
              <div class="flex items-center gap-1 text-slate-400">
                <Clock class="w-3.5 h-3.5" />
                <span class="text-xs">{{ umkm.opening_hours }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import { Search, Store, MapPin, Star, Clock, ArrowLeft } from 'lucide-vue-next'

const route = useRoute()

const isLoading = ref(true)
const umkms = ref([])
const totalCount = ref(0)
const destinationName = ref('')
const searchQuery = ref('')
const activeStatus = ref('all')
let searchTimeout = null

const statusColor = (status) => {
  const colors = {
    active: 'bg-emerald-500 text-white',
    inactive: 'bg-slate-400 text-white',
    pending: 'bg-amber-500 text-white',
    rejected: 'bg-red-500 text-white',
  }
  return colors[status] || 'bg-slate-200 text-slate-600'
}

const fetchUmkm = async () => {
  isLoading.value = true
  try {
    const params = { per_page: 50 }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    const res = await api.get(`/api/destinations/${route.params.destinationSlug}/umkms`, { params })
    
    let data = res.data.data || []
    
    // Filter by status if not 'all'
    if (activeStatus.value !== 'all') {
      data = data.filter(u => u.status === activeStatus.value)
    }

    totalCount.value = res.data.data?.length || 0
    umkms.value = data
  } catch (err) {
    console.error('Gagal fetch UMKM:', err)
  } finally {
    isLoading.value = false
  }
}

// Fetch destination name
const fetchDestinationName = async () => {
  try {
    const res = await api.get(`/api/destinations/${route.params.destinationSlug}`)
    destinationName.value = res.data.data.name
  } catch {
    destinationName.value = 'UMKM Lokal'
  }
}

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchUmkm()
  }, 500)
}

// Watch status change
import { watch } from 'vue'
watch(activeStatus, () => {
  fetchUmkm()
})

onMounted(() => {
  fetchDestinationName()
  fetchUmkm()
})
</script>