<template>
  <div class="min-h-screen bg-slate-50 pb-24">
    <!-- Header -->
    <div class="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <button @click="$router.back()" class="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-950 transition">
          <ArrowLeft class="w-4 h-4" /> Kembali
        </button>
        <div class="text-center">
          <h1 class="text-base font-black text-blue-950">My Trips</h1>
          <p class="text-[10px] text-slate-400 font-medium">Rencana perjalanan tersimpan</p>
        </div>
        <router-link to="/plan-trip" class="text-xs font-bold text-white bg-blue-950 px-3.5 py-2.5 rounded-lg hover:bg-slate-800 transition no-underline flex items-center gap-1.5 shadow-sm">
          <Plus class="w-3.5 h-3.5" /> Buat Baru
        </router-link>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-6 py-6 space-y-5">
      
      <!-- Loading -->
      <div v-if="isLoading" class="space-y-5">
        <div v-for="n in 2" :key="n" class="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
          <div class="h-44 bg-slate-200"></div>
          <div class="p-5 space-y-3">
            <div class="h-5 bg-slate-200 rounded w-2/3"></div>
            <div class="flex gap-3"><div class="h-4 bg-slate-200 rounded w-1/4"></div><div class="h-4 bg-slate-200 rounded w-1/4"></div></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="plans.length === 0" class="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200">
        <div class="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-slate-100">
          <Map class="w-9 h-9 text-slate-300" />
        </div>
        <h3 class="text-lg font-black text-slate-700 mb-2">Belum Ada Rencana</h3>
        <p class="text-sm text-slate-400 mb-8 max-w-xs mx-auto">Mulai susun destinasi favoritmu menjadi sebuah rencana perjalanan yang terorganisir.</p>
        <router-link to="/plan-trip" class="inline-flex items-center gap-2 text-sm font-bold text-white bg-blue-950 px-8 py-3.5 rounded-xl no-underline hover:bg-slate-800 transition shadow-lg">
          <Plus class="w-4 h-4" /> Buat Rencana Sekarang
        </router-link>
      </div>

      <!-- List Trip Cards -->
      <div v-else class="space-y-5">
        <div v-for="plan in plans" :key="plan.id" class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
          
          <!-- Card Banner Image -->
          <div class="relative h-44 bg-slate-100 overflow-hidden">
            <img 
              v-if="getFirstImage(plan)" 
              :src="getFirstImage(plan)" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-slate-200">
              <ImageOff class="w-12 h-12 text-slate-300" />
            </div>
            
            <!-- Overlay Gradient & Actions -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            <div class="absolute top-3 right-3 flex gap-2">
              <span class="bg-white/90 backdrop-blur-sm text-blue-950 text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-sm uppercase flex items-center gap-1">
                <CalendarDays class="w-3 h-3" /> {{ plan.duration_days }} Hari
              </span>
              <button @click="confirmDelete(plan)" class="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>

            <!-- Title on Image -->
            <div class="absolute bottom-0 left-0 right-0 p-5">
              <h3 class="text-xl font-black text-white drop-shadow-md">{{ plan.title }}</h3>
            </div>
          </div>

          <!-- Card Body -->
          <div class="p-5">
            <!-- Info Stats Row -->
            <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Users class="w-4 h-4 text-slate-400" />
                  <span>{{ plan.total_people }} Orang</span>
                </div>
                <div class="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <MapPin class="w-4 h-4 text-slate-400" />
                  <span>{{ getTotalDestinations(plan) }} Tempat</span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-[10px] text-slate-400 font-bold uppercase">Estimasi Biaya</p>
                <p class="text-lg font-black text-blue-950 leading-tight">{{ formatRupiahShort(plan.estimated_cost) }}</p>
              </div>
            </div>

            <!-- Action Button -->
            <button @click="openDetail(plan)" class="w-full py-3 text-sm font-bold text-blue-950 bg-blue-50 rounded-xl hover:bg-blue-100 transition flex items-center justify-center gap-2 border border-blue-100">
              <ListChecks class="w-4 h-4" />
              Lihat Detail Itinerary
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== MODAL DETAIL ITINERARY ==================== -->
    <Teleport to="body">
      <div v-if="selectedPlan" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-6">
        <div class="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-3xl max-h-[90vh] flex flex-col shadow-2xl">
          
          <!-- Modal Header -->
          <div class="p-6 border-b border-slate-100 flex-shrink-0">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h2 class="text-xl font-black text-blue-950">{{ selectedPlan.title }}</h2>
                <p class="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <Clock class="w-3.5 h-3.5" />
                  Dibuat {{ formatDate(selectedPlan.created_at) }}
                </p>
              </div>
              <button @click="selectedPlan = null" class="p-2 hover:bg-slate-100 rounded-lg transition">
                <X class="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <!-- Cost Summary Bar -->
            <div class="bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-200">
              <div class="flex items-center gap-6">
                <div class="flex items-center gap-2 text-xs text-slate-500">
                  <Users class="w-4 h-4" />
                  <span class="font-bold">{{ selectedPlan.total_people }} Orang</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-slate-500">
                  <CalendarDays class="w-4 h-4" />
                  <span class="font-bold">{{ selectedPlan.duration_days }} Hari</span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-[10px] text-slate-400 font-bold uppercase">Total Estimasi</p>
                <p class="text-xl font-black text-blue-950">{{ formatRupiah(selectedPlan.estimated_cost) }}</p>
              </div>
            </div>
          </div>

          <!-- Day Selector Tabs -->
          <div class="px-6 pt-4 pb-2 border-b border-slate-100 flex-shrink-0 bg-slate-50/50">
            <div class="flex gap-2 overflow-x-auto no-scrollbar">
              <button 
                v-for="(day, key) in parsedItinerary" :key="key"
                @click="activeModalDay = key"
                class="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold transition-all border"
                :class="activeModalDay === key 
                  ? 'bg-blue-950 text-white border-blue-950' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-blue-950 hover:text-blue-950'"
              >
                {{ formatDayTitle(key) }}
                <span class="ml-1.5 opacity-70">({{ day.length }})</span>
              </button>
            </div>
          </div>

          <!-- Modal Body Content -->
          <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div v-if="parsedItinerary[activeModalDay] && parsedItinerary[activeModalDay].length > 0" class="space-y-4">
              <div 
                v-for="(item, index) in parsedItinerary[activeModalDay]" 
                :key="item.destination_id" 
                class="flex gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100 group/dest hover:border-blue-200 transition-colors"
              >
                <!-- Step Number -->
                <div class="flex flex-col items-center flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-950 text-white rounded-lg flex items-center justify-center text-xs font-black">
                    {{ index + 1 }}
                  </div>
                  <div v-if="index < parsedItinerary[activeModalDay].length - 1" class="w-0.5 h-full bg-slate-200 my-1"></div>
                </div>

                <!-- Image -->
                <div class="w-24 h-24 bg-slate-200 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                  <img v-if="item.destination_image" :src="item.destination_image" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <ImageOff class="w-6 h-6 text-slate-300" />
                  </div>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0 flex flex-col justify-center">
                  <router-link 
                    v-if="item.destination_slug" 
                    :to="`/destination/${item.destination_slug}`" 
                    @click="selectedPlan=null"
                    class="text-sm font-bold text-blue-950 hover:underline no-underline truncate block mb-1"
                  >
                    {{ item.destination_name }}
                  </router-link>
                  <p v-else class="text-sm font-bold text-slate-800 truncate mb-1">{{ item.destination_name }}</p>
                  
                  <div class="flex items-center gap-3">
                    <span class="text-xs text-slate-500 flex items-center gap-1">
                      <Ticket class="w-3 h-3" />
                      {{ formatRupiah(item.estimated_cost) }}/org
                    </span>
                  </div>

                  <p v-if="item.notes" class="text-xs text-slate-400 mt-2 italic bg-white p-2 rounded-lg border border-slate-100 truncate">
                    📝 {{ item.notes }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-10 text-slate-400">
              <CalendarOff class="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p class="text-sm font-medium">Tidak ada destinasi di hari ini</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ==================== MODAL HAPUS ==================== -->
    <Teleport to="body">
      <div v-if="planToDelete" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
        <div class="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div class="w-16 h-16 bg-red-50 border-2 border-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Trash2 class="w-8 h-8 text-red-500" />
          </div>
          <h3 class="text-lg font-black text-slate-800 mb-2">Hapus Rencana?</h3>
          <p class="text-sm text-slate-500 mb-8">Rencana "<strong class="text-slate-700">{{ planToDelete.title }}</strong>" beserta seluruh itinerary-nya akan dihapus permanen.</p>
          <div class="flex gap-3">
            <button @click="planToDelete = null" class="flex-1 py-3.5 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition text-sm">Batal</button>
            <button @click="deletePlan" :disabled="isDeleting" class="flex-1 py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
              <Loader2 v-if="isDeleting" class="w-4 h-4 animate-spin" />
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import dayjs from 'dayjs'
import { 
  ArrowLeft, Plus, Map, MapPin, CalendarDays, Users, Trash2, 
  ListChecks, X, Loader2, ImageOff, Clock, Ticket, CalendarOff
} from 'lucide-vue-next'

const toast = useToast()

const plans = ref([])
const isLoading = ref(false)
const selectedPlan = ref(null)
const planToDelete = ref(null)
const isDeleting = ref(false)
const activeModalDay = ref('day_1')

// Helpers
const formatRupiah = (val) => 'Rp ' + Number(val).toLocaleString('id-ID')
const formatRupiahShort = (val) => {
  if (val >= 1000000000) return `${(val / 1000000000).toFixed(1)}M`
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}jt`
  if (val >= 1000) return `${(val / 1000).toFixed(0)}rb`
  return formatRupiah(val)
}
const formatDate = (date) => dayjs(date).format('DD MMM YYYY')
const formatDayTitle = (key) => 'Hari ' + key.replace('day_', '')

// Ambil gambar pertama dari itinerary untuk banner card
const getFirstImage = (plan) => {
  const itinerary = typeof plan.itinerary === 'string' ? JSON.parse(plan.itinerary) : plan.itinerary
  if (!itinerary) return null
  const firstDay = Object.values(itinerary)[0]
  if (firstDay && firstDay.length > 0) {
    return firstDay[0].destination_image
  }
  return null
}

// Hitung total destinasi
const getTotalDestinations = (plan) => {
  const itinerary = typeof plan.itinerary === 'string' ? JSON.parse(plan.itinerary) : plan.itinerary
  if (!itinerary) return 0
  return Object.values(itinerary).reduce((total, day) => total + day.length, 0)
}

// Parse itinerary yang sudah di sanitize
const parsedItinerary = computed(() => {
  if (!selectedPlan.value) return {}
  return typeof selectedPlan.value.itinerary === 'string' 
    ? JSON.parse(selectedPlan.value.itinerary) 
    : selectedPlan.value.itinerary
})

const fetchPlans = async () => {
  isLoading.value = true
  try {
    const res = await api.get('/api/trip-plans')
    plans.value = res.data.data
  } catch (err) {
    toast.error('Gagal memuat rencana trip')
  } finally {
    isLoading.value = false
  }
}

const openDetail = (plan) => {
  activeModalDay.value = 'day_1' // Reset tab ke hari 1 saat buka
  selectedPlan.value = {
    ...plan,
    itinerary: typeof plan.itinerary === 'string' ? JSON.parse(plan.itinerary) : plan.itinerary
  }
}

const confirmDelete = (plan) => {
  planToDelete.value = plan
}

const deletePlan = async () => {
  if (!planToDelete.value) return
  isDeleting.value = true
  try {
    await api.delete(`/api/trip-plans/${planToDelete.value.id}`)
    toast.success('Rencana trip berhasil dihapus')
    plans.value = plans.value.filter(p => p.id !== planToDelete.value.id)
    planToDelete.value = null
  } catch (err) {
    toast.error('Gagal menghapus rencana trip')
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  fetchPlans()
})
</script>

<style scoped>
/* Hide Scrollbar for Tabs */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Custom Scrollbar for Modal */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
</style>