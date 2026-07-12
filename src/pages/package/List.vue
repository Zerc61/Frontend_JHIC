<template>
  <div class="min-h-screen bg-slate-50 pb-24">
    <div class="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
        <button @click="$router.back()" class="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-950 transition"><ArrowLeft class="w-4 h-4" /></button>
        <div class="flex-1 relative">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input v-model="search" type="text" placeholder="Cari paket wisata..." class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-950 transition" @input="debouncedFetch" />
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-6 py-6">
      <div v-if="isLoading" class="space-y-5">
        <div v-for="n in 4" :key="n" class="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
          <div class="h-56 bg-slate-200"></div>
          <div class="p-6 space-y-3"><div class="h-6 bg-slate-200 rounded w-2/3"></div><div class="h-4 bg-slate-200 rounded w-1/3"></div></div>
        </div>
      </div>

      <div v-else-if="packages.length" class="space-y-6">
        <router-link
          v-for="pkg in packages"
          :key="pkg.id"
          :to="{ name: 'package.detail', params: { slug: pkg.slug } }"
          class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group no-underline block"
        >
          <div class="flex flex-col md:flex-row">
            <div class="w-full md:w-80 h-56 md:h-auto bg-slate-100 overflow-hidden flex-shrink-0">
              <img v-if="pkg.thumbnail" :src="pkg.thumbnail" :alt="pkg.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <Package v-else class="w-16 h-16 text-slate-300 mx-auto mt-20" />
            </div>
            <div class="flex-1 p-6 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-950 text-white">
                    {{ pkg.duration_days }}H{{ pkg.duration_nights ? pkg.duration_nights + 'M' : '' }}
                  </span>
                  <span v-if="pkg.next_schedule" class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {{ pkg.next_schedule.remaining_slots }} slot tersisa
                  </span>
                </div>
                <h3 class="text-lg font-black text-slate-800 mb-2 group-hover:text-blue-950 transition">{{ pkg.name }}</h3>
                <p class="text-sm text-slate-500 line-clamp-2 mb-4">{{ pkg.description }}</p>
              </div>
              <div class="flex items-end justify-between">
                <div>
                  <p class="text-xl font-black text-blue-950">
                    Rp {{ Number(pkg.price_per_person).toLocaleString('id-ID') }}
                    <span class="text-xs font-medium text-slate-400">/orang</span>
                  </p>
                  <p v-if="pkg.next_schedule" class="text-[11px] text-slate-400 mt-0.5">
                    Berangkat {{ formatDate(pkg.next_schedule.departure_date) }}
                  </p>
                </div>
                <span class="text-xs font-bold text-blue-950 bg-blue-50 px-4 py-2.5 rounded-xl group-hover:bg-blue-100 transition">
                  Lihat Detail →
                </span>
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <div v-else class="text-center py-20">
        <Package class="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <p class="text-sm text-slate-400 font-medium">Paket wisata tidak ditemukan</p>
      </div>

      <div v-if="meta.lastPage > 1" class="flex justify-center gap-2 mt-10">
        <button v-for="p in meta.lastPage" :key="p" @click="page = p; fetchPackages()" class="w-10 h-10 rounded-xl text-sm font-bold border transition" :class="page === p ? 'bg-blue-950 text-white border-blue-950' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-950'">{{ p }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/services/api'
import dayjs from 'dayjs'
import { Package, Search, ArrowLeft } from 'lucide-vue-next'

const packages = ref([])
const isLoading = ref(true)
const search = ref('')
const page = ref(1)
const meta = reactive({ currentPage: 1, lastPage: 1, total: 0 })

const formatDate = (d) => dayjs(d).format('D MMM YYYY')

let debounceTimer = null
const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1; fetchPackages() }, 400)
}

const fetchPackages = async () => {
  isLoading.value = true
  try {
    const params = { page: page.value, per_page: 10 }
    if (search.value) params.search = search.value
    const res = await api.get('/api/travel-packages', { params })
    packages.value = res.data.data
    Object.assign(meta, res.data.meta)
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

onMounted(fetchPackages)
</script>

<style scoped>
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>