<template>
  <div class="min-h-screen bg-slate-50 pb-24">
    <!-- ===== HEADER ===== -->
    <div class="bg-white border-b border-slate-100 sticky top-0 z-30">
      <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <button 
          @click="$router.push('/events')" 
          class="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition"
        >
          <ArrowLeft class="w-4 h-4" /> Event
        </button>
        <h1 class="text-base font-bold text-slate-800 truncate mx-4">Detail Event</h1>
        <div class="w-16"></div>
      </div>
    </div>

    <!-- ===== LOADING ===== -->
    <div v-if="isLoading" class="max-w-4xl mx-auto px-6 py-8 space-y-6 animate-pulse">
      <div class="h-80 bg-slate-200 rounded-2xl"></div>
      <div class="bg-white rounded-2xl p-6 space-y-4">
        <div class="h-6 bg-slate-200 rounded w-3/4"></div>
        <div class="h-4 bg-slate-200 rounded w-full"></div>
        <div class="h-4 bg-slate-200 rounded w-5/6"></div>
      </div>
    </div>

    <!-- ===== CONTENT ===== -->
    <div v-else-if="event" class="max-w-4xl mx-auto px-6 py-8 space-y-6">
      
      <!-- Hero Image -->
      <div class="relative h-[350px] sm:h-[450px] bg-slate-100 rounded-2xl overflow-hidden">
        <img 
          v-if="event.image" 
          :src="event.image" 
          :alt="event.title"
          class="w-full h-full object-cover" 
        />
        <div v-else class="w-full h-full flex items-center justify-center bg-slate-200">
          <ImageOff class="w-16 h-16 text-slate-300" />
        </div>
        
        <!-- Status Badge on Image -->
        <div class="absolute bottom-4 left-4">
          <span :class="event.status_color" class="text-xs font-bold px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm">
            {{ event.status_label }}
          </span>
        </div>
      </div>

      <!-- Title & Core Info -->
      <div class="bg-white rounded-2xl border border-slate-100 p-6">
        <h1 class="text-2xl sm:text-3xl font-black text-slate-800 mb-5 leading-tight">
          {{ event.title }}
        </h1>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CalendarDays class="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <p class="text-xs text-slate-400 font-medium">Waktu</p>
              <p class="text-sm font-bold text-slate-700">{{ formatFullDate(event.start_date) }}</p>
              <p v-if="event.end_date !== event.start_date" class="text-xs text-slate-400">
                s/d {{ formatFullDate(event.end_date) }}
              </p>
            </div>
          </div>

          <div v-if="event.location" class="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin class="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p class="text-xs text-slate-400 font-medium">Lokasi</p>
              <p class="text-sm font-bold text-slate-700">{{ event.location }}</p>
            </div>
          </div>
        </div>

        <!-- Destination Link -->
        <div v-if="event.destination" class="mt-4 pt-4 border-t border-slate-100">
          <router-link 
            :to="`/destination/${event.destination.slug}`"
            class="inline-flex items-center gap-2 text-sm font-bold text-blue-900 hover:text-blue-700 no-underline bg-blue-50 px-4 py-2 rounded-lg transition"
          >
            <MapPinned class="w-4 h-4" />
            Lihat Destinasi: {{ event.destination.name }}
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
      </div>

      <!-- Description -->
      <div class="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 class="text-base font-bold text-slate-800 mb-3">Tentang Event</h3>
        <div class="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {{ event.description }}
        </div>
      </div>

      <!-- Gallery -->
      <div v-if="event.galleries && event.galleries.length > 0" class="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 class="text-base font-bold text-slate-800 mb-4">Galeri Foto</h3>
        
        <!-- Main Preview Image -->
        <div class="mb-4 rounded-xl overflow-hidden bg-slate-100 h-72 sm:h-96" v-if="selectedGallery">
          <img :src="selectedGallery.image" :alt="selectedGallery.caption" class="w-full h-full object-cover" />
        </div>

        <!-- Thumbnail Grid -->
        <div class="grid grid-cols-4 sm:grid-cols-5 gap-2">
          <button 
            v-for="(img, index) in event.galleries" 
            :key="img.id"
            @click="selectedGallery = img"
            class="h-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all"
            :class="selectedGallery?.id === img.id ? 'border-blue-900 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'"
          >
            <img :src="img.image" :alt="img.caption" class="w-full h-full object-cover" />
          </button>
        </div>
        
        <!-- Caption -->
        <p v-if="selectedGallery?.caption" class="text-xs text-slate-400 mt-3 text-center italic">
          {{ selectedGallery.caption }}
        </p>
      </div>

    </div>

    <!-- ===== ERROR STATE ===== -->
    <div v-else class="max-w-4xl mx-auto px-6 py-20 text-center">
      <CalendarX class="w-16 h-16 text-slate-200 mx-auto mb-4" />
      <h3 class="text-lg font-bold text-slate-700 mb-2">Event Tidak Ditemukan</h3>
      <router-link to="/events" class="text-sm font-bold text-blue-900 hover:text-blue-700 no-underline">
        Kembali ke Event
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import dayjs from 'dayjs'
import {
  ArrowLeft, ArrowRight, CalendarDays, MapPin, MapPinned, 
  CalendarX, ImageOff, Loader2
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const event = ref(null)
const isLoading = ref(true)
const selectedGallery = ref(null)

const formatFullDate = (date) => {
  return dayjs(date).format('DD MMMM YYYY, HH:mm')
}

const fetchEvent = async () => {
  isLoading.value = true
  try {
    const res = await api.get(`/api/events/${route.params.slug}`)
    event.value = res.data.data
    
    // Set default gallery preview
    if (event.value.galleries && event.value.galleries.length > 0) {
      selectedGallery.value = event.value.galleries[0]
    }
  } catch (err) {
    if (err.response?.status === 404) {
      event.value = null
    } else {
      toast.error('Gagal memuat detail event')
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchEvent()
  // Scroll to top
  window.scrollTo(0, 0)
})
</script>

<style scoped>
@reference "../../assets/css/app.css";
</style>