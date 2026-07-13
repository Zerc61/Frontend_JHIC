<template>
  <div v-if="!isLoading && destination">
    <!-- ===== HERO GALLERY ===== -->
    <section class="relative h-[500px] bg-slate-900 overflow-hidden">
      <!-- Main Image -->
      <img
        v-if="currentImage"
        :src="currentImage"
        :alt="destination.name"
        class="w-full h-full object-cover transition-opacity duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <MapPin class="w-16 h-16 text-slate-700" />
      </div>

      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>

      <!-- Back Button -->
      <div class="absolute top-6 left-6 z-20">
        <button 
          @click="$router.back()" 
          class="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>
      </div>

      <!-- Wishlist Button -->
      <div class="absolute top-6 right-6 z-20">
        <button 
          @click="toggleWishlist"
          :class="isWishlisted ? 'bg-red-500 text-white' : 'bg-black/30 backdrop-blur-sm text-white hover:bg-red-500'"
          class="w-10 h-10 rounded-full flex items-center justify-center transition"
        >
          <Heart :class="isWishlisted ? 'fill-white' : ''" class="w-5 h-5" />
        </button>
      </div>

      <!-- Image Navigation -->
      <div v-if="galleries.length > 1" class="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        <button 
          @click="prevImage"
          class="w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        
        <div class="flex gap-1.5">
          <button
            v-for="(img, index) in galleries"
            :key="img.id"
            @click="goToImage(index)"
            :class="currentImageIndex === index ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-80'"
            class="w-12 h-8 rounded-lg overflow-hidden transition-all duration-200"
          >
            <img :src="img.image" :alt="img.caption" class="w-full h-full object-cover" />
          </button>
        </div>

        <button 
          @click="nextImage"
          class="w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/60 transition"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

      <!-- Title Overlay -->
      <div class="absolute bottom-6 left-6 right-6 z-10">
        <span class="inline-block bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
          {{ destination.category?.name }}
        </span>
        <h1 class="text-3xl font-black text-white mb-1">{{ destination.name }}</h1>
        <p class="text-white/60 text-sm flex items-center gap-2">
          <MapPin class="w-3.5 h-3.5" />
          {{ destination.address }}
        </p>
      </div>
    </section>

    <!-- ===== MAIN CONTENT ===== -->
    <main class="max-w-7xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <!-- LEFT: Info Utama -->
        <div class="lg:col-span-2 space-y-8">

          <!-- Quick Info Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-blue-50 rounded-xl p-4 text-center">
              <Clock class="w-5 h-5 text-blue-500 mx-auto mb-2" />
              <p class="text-xs text-slate-400 mb-0.5">Jam Buka</p>
              <p class="text-sm font-bold text-slate-700">{{ destination.open_hour }} - {{ destination.close_hour }}</p>
            </div>
            <div class="bg-emerald-50 rounded-xl p-4 text-center">
              <Ticket class="w-5 h-5 text-emerald-500 mx-auto mb-2" />
              <p class="text-xs text-slate-400 mb-0.5">Tiket</p>
              <p class="text-sm font-bold text-emerald-600">{{ destination.ticket_price_formatted }}</p>
            </div>
            <div class="bg-amber-50 rounded-xl p-4 text-center">
              <Star class="w-5 h-5 text-amber-500 mx-auto mb-2" />
              <p class="text-xs text-slate-400 mb-0.5">Rating</p>
              <p class="text-sm font-bold text-slate-700">{{ destination.average_rating }} / 5</p>
            </div>
            <div class="bg-purple-50 rounded-xl p-4 text-center">
              <Store class="w-5 h-5 text-purple-500 mx-auto mb-2" />
              <p class="text-xs text-slate-400 mb-0.5">UMKM</p>
              <p class="text-sm font-bold text-slate-700">{{ destination.umkms_count }} Tempat</p>
            </div>
          </div>

          <!-- Description -->
          <div>
            <h2 class="text-lg font-bold text-slate-800 mb-3">Tentang Destinasi</h2>
            <p class="text-sm text-slate-500 leading-relaxed whitespace-pre-line">{{ destination.description }}</p>
          </div>

          <!-- Facilities -->
          <div v-if="destination.facilities && destination.facilities.length > 0">
            <h2 class="text-lg font-bold text-slate-800 mb-3">Fasilitas</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div 
                v-for="fac in destination.facilities" 
                :key="fac.id"
                class="flex items-center gap-2.5 bg-slate-50 rounded-xl px-4 py-3"
              >
                <span class="text-lg">{{ fac.icon || '✓' }}</span>
                <span class="text-sm font-medium text-slate-600">{{ fac.name }}</span>
              </div>
            </div>
          </div>

          <!-- Reviews Section -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-slate-800">
                Ulasan 
                <span class="text-sm font-normal text-slate-400">({{ reviews.length }})</span>
              </h2>
              <button 
                v-if="authStore.isLoggedIn"
                @click="showReviewForm = !showReviewForm"
                class="text-sm font-bold text-blue-600 hover:text-blue-700 transition"
              >
                {{ showReviewForm ? 'Batal' : '+ Tulis Ulasan' }}
              </button>
            </div>

            <!-- Review Form -->
            <div v-if="showReviewForm" class="bg-slate-50 rounded-2xl p-6 mb-6">
              <h3 class="text-sm font-bold text-slate-700 mb-4">Tulis Ulasanmu</h3>
              
              <!-- Star Rating Input -->
              <div class="flex gap-1 mb-4">
                <button 
                  v-for="n in 5" :key="n"
                  @click="reviewRating = n"
                  class="text-2xl transition hover:scale-110"
                >
                  <Star 
                    :class="n <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'" 
                    class="w-7 h-7" 
                  />
                </button>
              </div>

              <textarea
                v-model="reviewComment"
                placeholder="Bagaimana pengalamanmu di destinasi ini?"
                rows="3"
                class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition resize-none"
              ></textarea>

              <div class="flex justify-end mt-3">
                <button 
                  @click="submitReview"
                  :disabled="!reviewRating || isSubmittingReview"
                  class="bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {{ isSubmittingReview ? 'Mengirim...' : 'Kirim Ulasan' }}
                </button>
              </div>
            </div>

            <!-- Reviews List -->
            <div v-if="reviews.length > 0" class="space-y-4">
              <div 
                v-for="review in reviews" 
                :key="review.id"
                class="bg-white border border-slate-100 rounded-xl p-5"
              >
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img v-if="review.user?.avatar" :src="review.user.avatar" class="w-full h-full object-cover" />
                    <span v-else class="text-sm font-bold text-slate-400">{{ review.user?.name?.charAt(0) }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-1">
                      <p class="text-sm font-bold text-slate-700 truncate">{{ review.user?.name }}</p>
                      <span class="text-xs text-slate-400 flex-shrink-0 ml-2">{{ formatDate(review.created_at) }}</span>
                    </div>
                    <div class="flex gap-0.5 mb-2">
                      <Star v-for="n in 5" :key="n" :class="n <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'" class="w-3.5 h-3.5" />
                    </div>
                    <p v-if="review.comment" class="text-sm text-slate-500 leading-relaxed">{{ review.comment }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty Reviews -->
            <div v-else class="text-center py-8 bg-slate-50 rounded-xl">
              <MessageSquare class="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p class="text-sm text-slate-400">Belum ada ulasan</p>
            </div>
          </div>
        </div>

        <!-- RIGHT: Sidebar -->
        <div class="space-y-6">

          <!-- Map Placeholder -->
          <div class="bg-slate-100 rounded-2xl h-48 flex items-center justify-center overflow-hidden">
            <div v-if="destination.latitude && destination.longitude" class="text-center">
              <MapPin class="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p class="text-xs text-slate-500">Koordinat tersedia</p>
              <p class="text-[10px] text-slate-400 mt-1">{{ destination.latitude }}, {{ destination.longitude }}</p>
            </div>
            <div v-else class="text-center">
              <MapPin class="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p class="text-xs text-slate-400">Peta tidak tersedia</p>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="bg-white border border-slate-100 rounded-2xl p-5 space-y-4">
            <h3 class="text-sm font-bold text-slate-800">Informasi Kontak</h3>
            
            <div v-if="destination.phone" class="flex items-center gap-3">
              <div class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone class="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p class="text-xs text-slate-400">Telepon</p>
                <p class="text-sm font-medium text-slate-700">{{ destination.phone }}</p>
              </div>
            </div>

            <div v-if="destination.website" class="flex items-center gap-3">
              <div class="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe class="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <p class="text-xs text-slate-400">Website</p>
                <a :href="destination.website" target="_blank" class="text-sm font-medium text-blue-600 hover:underline truncate block">
                  {{ destination.website }}
                </a>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin class="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p class="text-xs text-slate-400">Alamat</p>
                <p class="text-sm font-medium text-slate-700">{{ destination.address }}</p>
              </div>
            </div>
          </div>

          <!-- UMKM at this Destination -->
          <div v-if="destination.umkms_count > 0" class="bg-white border border-slate-100 rounded-2xl p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-bold text-slate-800">UMKM Lokal</h3>
              <router-link 
                :to="`/destinations/${destination.slug}/umkms`" 
                class="text-xs font-bold text-blue-600 hover:text-blue-700 no-underline"
              >
                Lihat Semua →
              </router-link>
            </div>
            <p class="text-xs text-slate-400 mb-3">{{ destination.umkms_count }} UMKM tersedia di destinasi ini</p>
            <div class="space-y-3">
              <div 
                v-for="umkm in umkmsPreview" 
                :key="umkm.id"
                @click="$router.push(`/umkms/${umkm.slug}`)"
                class="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition"
              >
                <div class="w-12 h-12 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                  <img v-if="umkm.image" :src="umkm.image" class="w-full h-full object-cover" />
                  <Store v-else class="w-full h-full p-2 text-slate-300" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-slate-700 truncate">{{ umkm.name }}</p>
                  <p class="text-xs text-slate-400">{{ umkm.category?.name }}</p>
                </div>
                <ChevronRight class="w-4 h-4 text-slate-300 flex-shrink-0" />
              </div>
            </div>
          </div>

          <!-- Events at this Destination -->
          <div v-if="destination.events_count > 0" class="bg-white border border-slate-100 rounded-2xl p-5">
            <h3 class="text-sm font-bold text-slate-800 mb-3">Event Mendatang</h3>
            <p class="text-xs text-slate-400 mb-3">{{ destination.events_count }} event di destinasi ini</p>
            <div class="space-y-3">
              <div 
                v-for="event in eventsPreview" 
                :key="event.id"
                @click="$router.push(`/event/${event.slug}`)"
                class="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition"
              >
                <div class="w-12 h-12 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden">
                  <img v-if="event.image" :src="event.image" class="w-full h-full object-cover" />
                  <CalendarDays v-else class="w-full h-full p-2 text-slate-300" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-slate-700 truncate">{{ event.title }}</p>
                  <p class="text-xs text-slate-400">{{ formatDate(event.start_date) }}</p>
                </div>
                <ChevronRight class="w-4 h-4 text-slate-300 flex-shrink-0" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <Loader2 class="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
      <p class="text-sm text-slate-400">Memuat destinasi...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import dayjs from 'dayjs'
import {
  ArrowLeft, Heart, ChevronLeft, ChevronRight, MapPin, Clock,
  Ticket, Star, Store, Phone, Globe, CalendarDays, MessageSquare,
  Loader2
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const isLoading = ref(true)
const destination = ref(null)
const galleries = ref([])
const reviews = ref([])
const umkmsPreview = ref([])
const eventsPreview = ref([])
const isWishlisted = ref(false)
const showReviewForm = ref(false)
const isSubmittingReview = ref(false)
const reviewRating = ref(0)
const reviewComment = ref('')
const currentImageIndex = ref(0)

const currentImage = computed(() => {
  if (galleries.value.length > 0) {
    return galleries.value[currentImageIndex.value]?.image
  }
  return null
})

const formatDate = (date) => {
  return dayjs(date).format('DD MMM YYYY')
}

// Fetch destination detail
const fetchDestination = async () => {
  isLoading.value = true
  try {
    const res = await api.get(`/api/destinations/${route.params.slug}`)
    destination.value = res.data.data
    galleries.value = res.data.data.galleries || []
  } catch (err) {
    if (err.response?.status === 404) {
      toast.error('Destinasi tidak ditemukan')
      router.push('/explore')
    } else {
      toast.error('Gagal memuat destinasi')
    }
  } finally {
    isLoading.value = false
  }
}

// Fetch reviews
const fetchReviews = async () => {
  try {
    const res = await api.get('/api/reviews', {
      params: {
        reviewable_type: 'Destination',
        reviewable_id: destination.value?.id,
      }
    })
    reviews.value = res.data.data
  } catch (err) {
    console.error('Gagal fetch reviews:', err)
  }
}

// Fetch UMKM preview (limit 3)
const fetchUmkmsPreview = async () => {
  try {
    const res = await api.get(`/api/destinations/${route.params.slug}/umkms`, {
      params: { per_page: 3 }
    })
    umkmsPreview.value = res.data.data || []
  } catch (err) {
    console.error('Gagal fetch UMKM:', err)
  }
}

// Fetch Events preview (limit 3) - using destination events
const fetchEventsPreview = async () => {
  // Events already loaded in destination detail
  if (destination.value?.events) {
    eventsPreview.value = destination.value.events.slice(0, 3)
  }
}

// Check wishlist status
// Check wishlist status
const checkWishlist = async () => {
  if (!authStore.isLoggedIn) return
  try {
    const res = await api.get(`/api/wishlists/check/${destination.value?.id}`)
    isWishlisted.value = res.data.is_wishlisted ?? false
  } catch (err) {
    console.error('Gagal check wishlist:', err)
    isWishlisted.value = false
  }
}

// Toggle wishlist
const toggleWishlist = async () => {
  if (!authStore.isLoggedIn) {
    toast.error('Silakan login terlebih dahulu untuk menambahkan wishlist')
    router.push({ path: '/login', query: { redirect: route.fullPath } })
    return
  }

  // Optimistic UI update
  const previousState = isWishlisted.value
  isWishlisted.value = !isWishlisted.value

  try {
    if (previousState) {
      // Delete from wishlist
      await api.delete(`/api/wishlists/${destination.value.id}`)
      toast.success('Dihapus dari wishlist')
    } else {
      // Add to wishlist
      await api.post('/api/wishlists', {
        destination_id: destination.value.id,
      })
      toast.success('Ditambahkan ke wishlist ❤️')
    }
  } catch (err) {
    // Revert on error
    isWishlisted.value = previousState
    const message = err.response?.data?.message || 'Gagal mengubah wishlist'
    toast.error(message)
  }
}

// Submit review
const submitReview = async () => {
  if (!reviewRating.value) {
    toast.warning('Pilih rating terlebih dahulu')
    return
  }

  isSubmittingReview.value = true
  try {
    await api.post('/api/reviews', {
      reviewable_type: 'Destination',
      reviewable_id: destination.value.id,
      rating: reviewRating.value,
      comment: reviewComment.value,
    })
    toast.success('Ulasan berhasil dikirim!')
    showReviewForm.value = false
    reviewRating.value = 0
    reviewComment.value = ''
    fetchReviews()
    // Re-fetch destination to update average rating
    fetchDestination()
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal mengirim ulasan')
  } finally {
    isSubmittingReview.value = false
  }
}

// Image navigation
const prevImage = () => {
  if (galleries.value.length === 0) return
  currentImageIndex.value = currentImageIndex.value === 0 ? galleries.value.length - 1 : currentImageIndex.value - 1
}

const nextImage = () => {
  if (galleries.value.length === 0) return
  currentImageIndex.value = currentImageIndex.value === galleries.value.length - 1 ? 0 : currentImageIndex.value + 1
}

const goToImage = (index) => {
  currentImageIndex.value = index
}

onMounted(async () => {
  await fetchDestination()
  if (destination.value) {
    fetchReviews()
    fetchUmkmsPreview()
    fetchEventsPreview()
    checkWishlist()
  }
})
</script>
