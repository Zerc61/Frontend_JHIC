<template>
  <div class="min-h-screen bg-slate-50 pb-24">
    <div class="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
        <button @click="$router.back()" class="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-950 transition">
          <ArrowLeft class="w-4 h-4" />
        </button>
        <div class="flex-1 relative">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="search"
            type="text"
            placeholder="Cari kendaraan..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-950 transition"
            @input="debouncedFetch"
          />
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-6 py-6">
      <!-- Filter Chips -->
      <div class="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        <button
          v-for="t in types"
          :key="t.value"
          @click="typeFilter = t.value; fetchTransports()"
          class="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition whitespace-nowrap"
          :class="typeFilter === t.value
            ? 'bg-blue-950 text-white border-blue-950'
            : 'bg-white text-slate-600 border-slate-200 hover:border-blue-950'"
        >
          {{ t.label }}
        </button>
      </div>

      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="n in 6" :key="n" class="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
          <div class="h-44 bg-slate-200"></div>
          <div class="p-5 space-y-3">
            <div class="h-5 bg-slate-200 rounded w-3/4"></div>
            <div class="h-4 bg-slate-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>

      <div v-else-if="transports.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <router-link
          v-for="t in transports"
          :key="t.id"
          :to="{ name: 'transportation.detail', params: { slug: t.slug } }"
          class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group no-underline"
        >
          <div class="h-44 bg-slate-100 overflow-hidden">
            <img v-if="t.thumbnail" :src="t.thumbnail" :alt="t.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <Car v-else class="w-16 h-16 text-slate-300 mx-auto mt-14" />
          </div>
          <div class="p-5">
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-slate-100 text-slate-500">
              {{ t.type }}
            </span>
            <h3 class="text-sm font-black text-slate-800 mt-2 mb-1 group-hover:text-blue-950 transition line-clamp-1">{{ t.name }}</h3>
            <div class="flex items-center gap-3 text-[11px] text-slate-400 mb-3">
              <span class="flex items-center gap-1"><Users class="w-3 h-3" /> {{ t.capacity }} orang</span>
              <span v-if="t.includes_driver" class="flex items-center gap-1"><Check class="w-3 h-3 text-emerald-500" /> Supir</span>
            </div>
            <p class="text-base font-black text-blue-950">
              Rp {{ Number(t.price_per_day).toLocaleString('id-ID') }}
              <span class="text-[10px] font-medium text-slate-400">/hari</span>
            </p>
          </div>
        </router-link>
      </div>

      <div v-else class="text-center py-20">
        <Car class="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <p class="text-sm text-slate-400 font-medium">Transportasi tidak ditemukan</p>
      </div>

      <div v-if="meta.lastPage > 1" class="flex justify-center gap-2 mt-10">
        <button v-for="p in meta.lastPage" :key="p" @click="page = p; fetchTransports()" class="w-10 h-10 rounded-xl text-sm font-bold border transition" :class="page === p ? 'bg-blue-950 text-white border-blue-950' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-950'">{{ p }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/services/api'
import { Car, Users, Check, Search, ArrowLeft } from 'lucide-vue-next'

const transports = ref([])
const isLoading = ref(true)
const search = ref('')
const typeFilter = ref(null)
const page = ref(1)
const meta = reactive({ currentPage: 1, lastPage: 1, total: 0 })

const types = [
  { value: null, label: 'Semua' },
  { value: 'car', label: '🚗 Mobil' },
  { value: 'motorcycle', label: '🏍️ Motor' },
  { value: 'bus', label: '🚌 Bus' },
  { value: 'boat', label: '🚢 Kapal' },
]

let debounceTimer = null
const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1; fetchTransports() }, 400)
}

const fetchTransports = async () => {
  isLoading.value = true
  try {
    const params = { page: page.value, per_page: 12 }
    if (search.value) params.search = search.value
    if (typeFilter.value) params.type = typeFilter.value
    const res = await api.get('/api/transportations', { params })
    transports.value = res.data.data
    Object.assign(meta, res.data.meta)
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

onMounted(fetchTransports)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
</style>