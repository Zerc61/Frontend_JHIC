<template>
  <div class="min-h-screen bg-slate-50 pb-32">
    <!-- Header -->
    <div class="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <button @click="$router.back()" class="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-950 transition">
          <ArrowLeft class="w-4 h-4" /> Kembali
        </button>
        <div class="text-center">
          <h1 class="text-base font-black text-blue-950">Rencanakan Tripmu</h1>
          <p class="text-[10px] text-slate-400 font-medium">Bangun itinerary otomatis</p>
        </div>
        <div class="w-16"></div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-6 py-6 space-y-5">
      
      <!-- ==================== FORM INFO DASAR ==================== -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6">
        <div class="flex items-center gap-2.5 mb-5">
          <div class="w-8 h-8 bg-blue-950 rounded-lg flex items-center justify-center">
            <Pencil class="w-4 h-4 text-white" />
          </div>
          <h2 class="text-sm font-black text-blue-950 uppercase tracking-wide">Detail Perjalanan</h2>
        </div>
        
        <div class="mb-5">
          <label class="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Nama Trip</label>
          <input v-model="form.title" type="text" placeholder="Contoh: Eksplorasi Lombok 3 Hari" class="w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl focus:border-blue-950 focus:outline-none transition text-sm font-medium text-slate-800 placeholder:text-slate-300" />
        </div>
        
        <div class="grid grid-cols-3 gap-3">
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
            <CalendarDays class="w-5 h-5 text-blue-950 mx-auto mb-1.5" />
            <input v-model.number="form.duration_days" type="number" min="1" max="30" class="w-full text-center text-xl font-black text-blue-950 bg-transparent outline-none" />
            <p class="text-[10px] text-slate-400 font-bold mt-1 uppercase">Hari</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
            <Users class="w-5 h-5 text-blue-950 mx-auto mb-1.5" />
            <input v-model.number="form.total_people" type="number" min="1" max="100" class="w-full text-center text-xl font-black text-blue-950 bg-transparent outline-none" />
            <p class="text-[10px] text-slate-400 font-bold mt-1 uppercase">Orang</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
            <Wallet class="w-5 h-5 text-blue-950 mx-auto mb-1.5" />
            <input v-model.number="form.budget" type="number" min="0" placeholder="0" class="w-full text-center text-xl font-black text-slate-800 bg-transparent outline-none placeholder:text-slate-300" />
            <p class="text-[10px] text-slate-400 font-bold mt-1 uppercase">Budget (Rp)</p>
          </div>
        </div>
      </div>

      <!-- ==================== PILIH DESTINASI ==================== -->
      <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        
        <!-- Header Section -->
        <div class="p-6 pb-4">
          <div class="flex items-center gap-2.5 mb-4">
            <div class="w-8 h-8 bg-blue-950 rounded-lg flex items-center justify-center">
              <MapPin class="w-4 h-4 text-white" />
            </div>
            <h2 class="text-sm font-black text-blue-950 uppercase tracking-wide">Pilih Destinasi</h2>
          </div>

          <!-- Tabs Hari -->
          <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button 
              v-for="day in form.duration_days" :key="day"
              @click="activeDay = day"
              class="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-2"
              :class="activeDay === day 
                ? 'bg-blue-950 text-white border-blue-950' 
                : 'bg-white text-slate-500 border-slate-200 hover:border-blue-950 hover:text-blue-950'"
            >
              <Calendar class="w-3.5 h-3.5" />
              Hari {{ day }}
              <span v-if="getDestinationsForDay(day).length > 0" 
                    class="bg-white text-blue-950 w-5 h-5 rounded-md text-[10px] flex items-center justify-center font-black"
                    :class="activeDay !== day ? 'bg-blue-950 text-white' : ''">
                {{ getDestinationsForDay(day).length }}
              </span>
            </button>
          </div>
        </div>

        <!-- Search Area -->
        <div class="px-6 pb-4 relative">
          <div class="relative">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              v-model="searchQuery"
              @input="searchDestinations()"
              type="text" 
              placeholder="Cari nama tempat atau alamat..." 
              class="w-full pl-11 pr-10 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-950 focus:bg-white transition font-medium"
            />
            <button v-if="searchQuery" @click="searchQuery = ''; searchResults = []" class="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-md transition">
              <X class="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
          
          <!-- Dropdown Hasil Pencarian (Dengan Gambar) -->
          <div v-if="searchResults.length > 0" class="absolute z-20 left-6 right-6 mt-1 bg-white border-2 border-slate-200 rounded-2xl shadow-2xl max-h-72 overflow-y-auto">
            <div class="p-2 border-b border-slate-100">
              <p class="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wide">Temukan {{ searchResults.length }} tempat</p>
            </div>
            <button 
              v-for="dest in searchResults" :key="dest.id"
              @click="addDestination(dest)"
              class="w-full flex items-center gap-3 p-3 text-left hover:bg-blue-50 transition border-b border-slate-50 last:border-0 group"
            >
              <!-- Gambar Destinasi -->
              <div class="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                <img v-if="dest.image" :src="dest.image" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center bg-slate-100">
                  <ImageOff class="w-5 h-5 text-slate-300" />
                </div>
              </div>
              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-slate-800 truncate group-hover:text-blue-950 transition">{{ dest.name }}</p>
                <div class="flex items-center gap-2 mt-0.5">
                  <MapPin class="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <p class="text-xs text-slate-400 truncate">{{ dest.address }}</p>
                </div>
                <div class="flex items-center gap-3 mt-1">
                  <span class="text-[10px] font-bold text-white bg-blue-950 px-2 py-0.5 rounded-md uppercase">{{ dest.category }}</span>
                  <span class="text-[10px] font-bold text-slate-500">Tiket: {{ formatRupiah(dest.ticket_price) }}</span>
                </div>
              </div>
              <!-- Add Button -->
              <div class="w-8 h-8 bg-blue-950 text-white rounded-lg flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition">
                <Plus class="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>

        <!-- List Destinasi Terpilih -->
        <div class="border-t border-slate-100 bg-slate-50/50 min-h-[200px]">
          
          <!-- Empty State -->
          <div v-if="getDestinationsForDay(activeDay).length === 0" class="text-center py-12 px-6">
            <div class="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <MapPinOff class="w-7 h-7 text-slate-300" />
            </div>
            <p class="text-sm font-bold text-slate-500 mb-1">Hari {{ activeDay }} Masih Kosong</p>
            <p class="text-xs text-slate-400 max-w-xs mx-auto">Cari dan tambahkan destinasi yang ingin kamu kunjungi pada hari ini</p>
          </div>

          <!-- Selected List -->
          <div v-else class="p-4 space-y-2.5">
            <TransitionGroup name="list">
              <div v-for="(dest, index) in getDestinationsForDay(activeDay)" :key="dest.id" 
                   class="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 group hover:shadow-sm transition-all">
                
                <!-- Step Number -->
                <div class="w-7 h-7 bg-blue-950 text-white rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black">
                  {{ index + 1 }}
                </div>

                <!-- Image Thumbnail -->
                <div class="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                  <img v-if="dest.image" :src="dest.image" class="w-full h-full object-cover" />
                  <MapPin v-else class="w-full h-full p-2 text-slate-300" />
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-slate-800 truncate">{{ dest.name }}</p>
                  <div class="flex items-center gap-2 mt-0.5">
                    <Ticket class="w-3 h-3 text-slate-400" />
                    <p class="text-xs text-slate-400 font-medium">{{ formatRupiah(dest.ticket_price) }}/org</p>
                  </div>
                </div>

                <!-- Remove Button -->
                <button @click="removeDestination(activeDay, dest.id)" 
                        class="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>

      <!-- ==================== SUBMIT AREA ==================== -->
      <div class="bg-white rounded-2xl border-2 border-blue-950 p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-sm font-black text-blue-950">Siap Dibuat?</h3>
            <p class="text-xs text-slate-400 mt-0.5">{{ totalDestinations }} destinasi di {{ form.duration_days }} hari</p>
          </div>
          <div class="flex items-center gap-1.5 text-blue-950">
            <Sparkles class="w-5 h-5" />
            <span class="text-sm font-bold">Smart Estimasi</span>
          </div>
        </div>

        <button 
          @click="submitPlan"
          :disabled="isSubmitting || !form.title || form.duration_days < 1 || totalDestinations === 0"
          class="w-full py-4 bg-blue-950 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
          <Wand2 v-else class="w-5 h-5" />
          {{ isSubmitting ? 'Memproses...' : 'Buat Rencana & Hitung Biaya' }}
        </button>
        <p class="text-[10px] text-slate-400 text-center mt-2">
          Sistem akan otomatis menghitung estimasi (Tiket, Makan, Transport, Hotel)
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import { 
  ArrowLeft, Pencil, CalendarDays, Users, Wallet, MapPin, Search, Calendar, 
  Plus, X, ImageOff, MapPinOff, Trash2, Ticket, Sparkles, Wand2, Loader2
} from 'lucide-vue-next'

const router = useRouter()
const toast = useToast()

const form = reactive({
  title: '',
  duration_days: 2,
  total_people: 2,
  budget: null,
})

const activeDay = ref(1)
const searchQuery = ref('')
const searchResults = ref([])
const isSubmitting = ref(false)

const selectedDestinations = ref({})

const initDays = () => {
  const currentDays = Object.keys(selectedDestinations.value).map(Number)
  for (let i = 1; i <= form.duration_days; i++) {
    if (!currentDays.includes(i)) {
      selectedDestinations.value[i] = []
    }
  }
  Object.keys(selectedDestinations.value).forEach(key => {
    if (Number(key) > form.duration_days) {
      delete selectedDestinations.value[key]
    }
  })
  if (activeDay.value > form.duration_days) {
    activeDay.value = form.duration_days
  }
}

onBeforeMount(() => {
  initDays()
})

watch(() => form.duration_days, () => {
  initDays()
})

const totalDestinations = computed(() => {
  return Object.values(selectedDestinations.value).reduce((total, arr) => total + (arr ? arr.length : 0), 0)
})

const getDestinationsForDay = (day) => {
  return selectedDestinations.value[day] || []
}

let searchTimeout = null
const searchDestinations = async () => {
  clearTimeout(searchTimeout)
  if (searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }
  
  searchTimeout = setTimeout(async () => {
    try {
      const res = await api.get('/api/trip-plans/destinations', { 
        params: { search: searchQuery.value } 
      })
      searchResults.value = res.data.data
    } catch (err) {
      console.error('Gagal search:', err)
    }
  }, 500)
}

const addDestination = (dest) => {
  if (!selectedDestinations.value[activeDay.value]) {
    selectedDestinations.value[activeDay.value] = []
  }

  const dayList = selectedDestinations.value[activeDay.value]
  
  if (dayList.some(d => d.id === dest.id)) {
    toast.warning('Sudah ada di Hari ' + activeDay.value)
    return
  }
  
  dayList.push({
    id: dest.id,
    name: dest.name,
    address: dest.address,
    ticket_price: dest.ticket_price,
    image: dest.image,
    day_number: activeDay.value,
    sort_order: dayList.length
  })
  
  selectedDestinations.value = { ...selectedDestinations.value }
  
  searchQuery.value = ''
  searchResults.value = []
  toast.success(`${dest.name} ditambahkan ke Hari ${activeDay.value}`)
}

const removeDestination = (day, destId) => {
  if (selectedDestinations.value[day]) {
    selectedDestinations.value[day] = selectedDestinations.value[day].filter(d => d.id !== destId)
    selectedDestinations.value = { ...selectedDestinations.value }
  }
}

const formatRupiah = (val) => 'Rp ' + Number(val).toLocaleString('id-ID')

const submitPlan = async () => {
  isSubmitting.value = true
  try {
    const destinationsPayload = []
    for (const day in selectedDestinations.value) {
      const dayList = selectedDestinations.value[day]
      if (dayList && dayList.length > 0) {
        dayList.forEach((dest, index) => {
          destinationsPayload.push({
            id: dest.id,
            day_number: parseInt(day),
            sort_order: index,
            notes: null
          })
        })
      }
    }

    await api.post('/api/trip-plans', {
      title: form.title,
      budget: form.budget,
      duration_days: form.duration_days,
      total_people: form.total_people,
      destinations: destinationsPayload
    })

    toast.success('Rencana perjalanan berhasil dibuat!')
    router.push('/my-trips')
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal membuat rencana trip')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Hide Number Spinners */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type=number] { -moz-appearance: textfield; }

/* Hide Scrollbar for Tabs */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* List Animation */
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(-10px); }
</style>