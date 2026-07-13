<template>
  <div class="min-h-screen bg-slate-50 pb-24">
    <!-- Header -->
    <div class="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <button @click="$router.back()" class="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-950 transition">
          <ArrowLeft class="w-4 h-4" /> Kembali
        </button>
        <div class="text-center">
          <h1 class="text-base font-black text-blue-950">Wishlist Saya</h1>
          <p class="text-[10px] text-slate-400 font-medium" v-if="!isLoading && wishlists.length > 0">
            {{ wishlists.length }} tempat tersimpan
          </p>
        </div>
        <div class="w-16"></div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-6 py-8">

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="n in 8" :key="n" class="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
          <div class="h-44 bg-slate-200"></div>
          <div class="p-4 space-y-2">
            <div class="h-4 bg-slate-200 rounded w-3/4"></div>
            <div class="h-3 bg-slate-200 rounded w-1/2"></div>
            <div class="h-5 bg-slate-200 rounded w-1/3 mt-3"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="wishlists.length === 0" class="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200">
        <div class="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-slate-100">
          <Heart class="w-9 h-9 text-slate-300" />
        </div>
        <h3 class="text-lg font-black text-slate-700 mb-2">Wishlist Masih Kosong</h3>
        <p class="text-sm text-slate-400 mb-8 max-w-sm mx-auto">
          Temukan destinasi favoritmu saat jelajah, lalu tekan ikon hati untuk menyimpannya di sini.
        </p>
        <router-link to="/explore" class="inline-flex items-center gap-2 text-sm font-bold text-white bg-blue-950 px-8 py-3.5 rounded-xl no-underline hover:bg-slate-800 transition shadow-lg">
          <Compass class="w-4 h-4" /> Jelajahi Sekarang
        </router-link>
      </div>

      <!-- Wishlist Grid -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div 
          v-for="item in wishlists" 
          :key="item.id" 
          class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
        >
          <!-- Image Area -->
          <router-link :to="`/destination/${item.destination.slug}`" class="block relative h-44 bg-slate-100 overflow-hidden">
            <img 
              v-if="item.destination.main_image" 
              :src="item.destination.main_image" 
              :alt="item.destination.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-slate-200">
              <ImageOff class="w-10 h-10 text-slate-300" />
            </div>
            
            <!-- Remove Button (Heart) -->
            <button 
              @click.prevent="removeFromWishlist(item.destination.id)"
              :disabled="isRemoving === item.destination.id"
              class="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-red-500 hover:bg-red-50 hover:scale-110 transition-all disabled:opacity-50"
            >
              <Loader2 v-if="isRemoving === item.destination.id" class="w-4 h-4 animate-spin" />
              <HeartOff v-else class="w-4 h-4" />
            </button>

            <!-- Category Badge -->
            <div v-if="item.destination.category" class="absolute bottom-3 left-3">
              <span class="bg-blue-950/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase">
                {{ item.destination.category.name }}
              </span>
            </div>
          </router-link>

          <!-- Info Area -->
          <div class="p-4">
            <router-link 
              :to="`/destination/${item.destination.slug}`" 
              class="no-underline block mb-2"
            >
              <h3 class="text-sm font-extrabold text-slate-800 truncate group-hover:text-blue-950 transition">
                {{ item.destination.name }}
              </h3>
            </router-link>
            
            <div class="flex items-center gap-1.5 text-slate-400 mb-3">
              <MapPin class="w-3 h-3 flex-shrink-0" />
              <p class="text-[11px] truncate">{{ item.destination.address }}</p>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-slate-100">
              <p class="text-sm font-black text-blue-950">
                {{ item.destination.ticket_price_formatted }}
              </p>
            <span class="text-[10px] text-slate-400">
  {{ formatDate(item.created_at) }}
</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import dayjs from 'dayjs'
import { 
  ArrowLeft, Heart, HeartOff, Compass, MapPin, ImageOff, Loader2 
} from 'lucide-vue-next'

const router = useRouter()
const toast = useToast()

const wishlists = ref([])
const isLoading = ref(false)
const isRemoving = ref(null) // Menyimpan ID destinasi yang sedang dihapus (untuk loading spinner)

const formatDate = (date) => dayjs(date).format('DD MMM YYYY')

const fetchWishlists = async () => {
  isLoading.value = true
  try {
    const res = await api.get('/api/wishlists')
    wishlists.value = res.data.data
  } catch (err) {
    toast.error('Gagal memuat wishlist')
  } finally {
    isLoading.value = false
  }
}

const removeFromWishlist = async (destinationId) => {
  isRemoving.value = destinationId
  try {
    await api.delete(`/api/wishlists/${destinationId}`)
    
    // H langsung dari array tanpa perlu fetch ulang (biar animasi smooth)
    wishlists.value = wishlists.value.filter(item => item.destination.id !== destinationId)
    
    toast.success('Dihapus dari wishlist')
  } catch (err) {
    toast.error('Gagal menghapus dari wishlist')
  } finally {
    isRemoving.value = null
  }
}

onMounted(() => {
  fetchWishlists()
})
</script>

<style scoped>
/* Tidak perlu custom CSS tambahan, semuanya sudah menggunakan utility class Tailwind */
</style>