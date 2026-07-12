<template>
  <div class="min-h-screen bg-slate-50 pb-24">
    <!-- ===== HEADER ===== -->
    <div class="bg-white border-b border-slate-100 sticky top-0 z-30">
      <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <button 
          @click="$router.push('/orders')"
          class="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition"
        >
          <ArrowLeft class="w-4 h-4" /> Pesanan Saya
        </button>
        <h1 class="text-base font-bold text-slate-800">Detail Pesanan</h1>
        <div class="w-20"></div>
      </div>
    </div>

    <!-- ===== LOADING ===== -->
    <div v-if="isLoading" class="max-w-4xl mx-auto px-6 py-8">
      <div class="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse space-y-6">
        <div class="flex justify-between">
          <div class="h-5 bg-slate-200 rounded w-40"></div>
          <div class="h-7 bg-slate-200 rounded-full w-24"></div>
        </div>
        <div class="h-40 bg-slate-200 rounded-2xl"></div>
        <div class="space-y-3">
          <div class="h-4 bg-slate-200 rounded w-full"></div>
          <div class="h-4 bg-slate-200 rounded w-3/4"></div>
          <div class="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- ===== CONTENT ===== -->
    <div v-else-if="order" class="max-w-4xl mx-auto px-6 py-8 space-y-6">

      <!-- Order Number & Status -->
      <div class="bg-white rounded-2xl border border-slate-100 p-6">
        <div class="flex items-start justify-between mb-4">
          <div>
            <p class="text-xs text-slate-400 mb-1">Nomor Pesanan</p>
            <p class="text-xl font-black text-slate-800 font-mono">{{ order.order_number }}</p>
            <p class="text-xs text-slate-400 mt-1">{{ formatFullDate(order.created_at) }}</p>
          </div>
          <span 
            class="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex-shrink-0"
            :class="statusStyle(order.status)"
          >
            {{ statusLabel(order.status) }}
          </span>
        </div>

        <!-- QR Code Section -->
        <div 
          v-if="order.qr_code && !isFinalStatus(order.status)" 
          class="bg-slate-50 rounded-2xl p-6 text-center"
        >
          <p class="text-xs text-slate-400 mb-4">Tunjukkan QR Code ini ke penjual saat pengambilan</p>
          <div 
            class="bg-white rounded-xl p-5 inline-block shadow-sm border border-slate-100"
            v-html="order.qr_code"
          ></div>
        </div>

        <!-- Cancelled Info -->
        <div 
          v-if="order.status === 'cancelled'" 
          class="bg-red-50 border border-red-200 rounded-2xl p-4 mt-4"
        >
          <div class="flex items-start gap-3">
            <XCircle class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-bold text-red-700">Pesanan Dibatalkan</p>
              <p class="text-xs text-red-500 mt-1">Pesanan ini telah dibatalkan dan tidak dapat diproses lagi.</p>
            </div>
          </div>
        </div>

        <!-- Picked Up Info -->
        <div 
          v-if="order.status === 'picked_up'" 
          class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mt-4"
        >
          <div class="flex items-start gap-3">
            <CheckCircle class="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-bold text-emerald-700">Pesanan Selesai</p>
              <p class="text-xs text-emerald-600 mt-1">Pesanan telah berhasil diambil pada {{ formatFullDate(order.picked_up_at) }}. Terima kasih!</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Timeline -->
      <div class="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 class="text-sm font-bold text-slate-800 mb-6">Status Pesanan</h3>
        
        <div class="relative">
          <!-- Vertical Line -->
          <div class="absolute left-[15px] top-3 bottom-3 w-0.5 bg-slate-100"></div>
          <div 
            class="absolute left-[15px] top-3 w-0.5 bg-emerald-500 transition-all duration-500"
            :style="{ height: timelineProgressHeight }"
          ></div>

          <!-- Steps -->
          <div class="space-y-6">
            <div 
              v-for="(step, index) in timelineSteps" 
              :key="step.key"
              class="relative flex items-start gap-4"
            >
              <!-- Dot -->
              <div 
                class="w-[31px] h-[31px] rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 transition-all duration-300"
                :class="getStepClass(index)"
              >
                <component :is="step.icon" v-if="isStepCompleted(index)" class="w-4 h-4" />
                <span v-else class="text-[10px] font-bold">{{ index + 1 }}</span>
              </div>

              <!-- Content -->
              <div class="pt-1">
                <p 
                  class="text-sm font-bold transition-colors duration-300"
                  :class="isStepActive(index) ? 'text-slate-800' : 'text-slate-400'"
                >
                  {{ step.label }}
                </p>
                <p 
                  v-if="getStepDate(step.key)"
                  class="text-xs text-slate-400 mt-0.5"
                >
                  {{ formatFullDate(getStepDate(step.key)) }}
                </p>
                <p 
                  v-else-if="isStepActive(index) && order.status === step.key"
                  class="text-xs text-blue-500 mt-0.5 font-medium"
                >
                  {{ step.activeText }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Info -->
      <div class="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 class="text-sm font-bold text-slate-800 mb-4">Informasi Pesanan</h3>
        
        <div class="space-y-3 text-sm">
          <div class="flex justify-between items-center">
            <span class="text-slate-400">UMKM</span>
            <router-link 
              :to="`/umkm/${order.umkm.slug || order.umkm.id}`"
              class="font-bold text-blue-600 hover:text-blue-700 no-underline flex items-center gap-1"
            >
              {{ order.umkm.name }}
              <ExternalLink class="w-3 h-3" />
            </router-link>
          </div>

          <div class="border-t border-slate-50"></div>

          <div class="flex justify-between items-center">
            <span class="text-slate-400">Metode Pembayaran</span>
            <div class="flex items-center gap-2">
              <component :is="order.payment_method === 'coin' ? 'Wallet' : 'Banknote'" class="w-4 h-4 text-slate-400" />
              <span class="font-bold text-slate-700">
                {{ order.payment_method === 'coin' ? 'Coin' : 'Bayar saat Ambil' }}
              </span>
            </div>
          </div>

          <div v-if="order.payment_method === 'coin'" class="flex justify-between items-center">
            <span class="text-slate-400">Dibayar dengan</span>
            <span class="font-bold text-emerald-600">-{{ order.coin_amount_formatted }}</span>
          </div>

          <div class="border-t border-slate-50"></div>

          <div class="flex justify-between items-center">
            <span class="text-slate-400">Tanggal Pesan</span>
            <span class="font-medium text-slate-600">{{ formatFullDate(order.created_at) }}</span>
          </div>

          <div v-if="order.paid_at" class="flex justify-between items-center">
            <span class="text-slate-400">Dibayar pada</span>
            <span class="font-medium text-slate-600">{{ formatFullDate(order.paid_at) }}</span>
          </div>

          <div v-if="order.picked_up_at" class="flex justify-between items-center">
            <span class="text-slate-400">Diambil pada</span>
            <span class="font-medium text-slate-600">{{ formatFullDate(order.picked_up_at) }}</span>
          </div>

          <div v-if="order.notes" class="pt-3 border-t border-slate-100">
            <span class="text-slate-400 block mb-1.5">Catatan</span>
            <p class="text-slate-700 bg-slate-50 rounded-xl p-3 text-sm">{{ order.notes }}</p>
          </div>
        </div>
      </div>

      <!-- Items List -->
      <div class="bg-white rounded-2xl border border-slate-100 p-6">
        <h3 class="text-sm font-bold text-slate-800 mb-4">Item Pesanan ({{ order.items.length }})</h3>
        
        <div class="space-y-3">
          <div 
            v-for="item in order.items" 
            :key="item.id"
            class="flex items-center justify-between bg-slate-50 rounded-xl p-4"
          >
            <div class="flex-1 min-w-0 mr-4">
              <p class="text-sm font-bold text-slate-700 truncate">{{ item.product_name }}</p>
              <p class="text-xs text-slate-400 mt-0.5">
                {{ item.quantity }}x × {{ item.price_formatted }}
              </p>
            </div>
            <p class="text-sm font-bold text-slate-800 flex-shrink-0">{{ item.subtotal_formatted }}</p>
          </div>
        </div>
      </div>

      <!-- Total Payment -->
      <div class="bg-slate-800 rounded-2xl p-6">
        <div class="flex justify-between items-center">
          <div>
            <span class="text-sm text-slate-300 block">Total Pembayaran</span>
            <span v-if="order.payment_method === 'coin'" class="text-xs text-slate-400">
              {{ order.coin_amount_formatted }}
            </span>
          </div>
          <span class="text-2xl font-black text-white">{{ order.total_price_formatted }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="canCancel" class="space-y-3">
        <button
          @click="showCancelModal = true"
          class="w-full py-4 bg-white border-2 border-red-200 text-red-600 font-bold text-sm rounded-xl hover:bg-red-50 hover:border-red-300 transition flex items-center justify-center gap-2"
        >
          <XCircle class="w-4 h-4" />
          Batalkan Pesanan
        </button>
        <p class="text-xs text-slate-400 text-center">
          Pembatalan hanya dapat dilakukan sebelum pesanan diproses
        </p>
      </div>

      <!-- Ready to pick up reminder -->
      <div v-if="order.status === 'ready'" class="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5">
        <div class="flex items-start gap-3">
          <MapPin class="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p class="text-sm font-bold text-emerald-700">Pesanan Siap Diambil!</p>
            <p class="text-xs text-emerald-600 mt-1">Segera datang ke lokasi UMKM dan tunjukkan QR Code di atas ke penjual untuk mengambil pesananmu.</p>
          </div>
        </div>
      </div>

      <!-- Pending payment reminder -->
      <div v-if="order.status === 'pending'" class="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
        <div class="flex items-start gap-3">
          <Clock class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p class="text-sm font-bold text-amber-700">Menunggu Pembayaran</p>
            <p class="text-xs text-amber-600 mt-1">Silakan datang ke lokasi UMKM dan bayar langsung ke penjual. Atau batalkan pesanan ini jika berubah pikiran.</p>
          </div>
        </div>
      </div>

      <!-- Preparing reminder -->
      <div v-if="order.status === 'preparing'" class="bg-purple-50 border-2 border-purple-200 rounded-2xl p-5">
        <div class="flex items-start gap-3">
          <Loader2 class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5 animate-spin" />
          <div>
            <p class="text-sm font-bold text-purple-700">Sedang Disiapkan</p>
            <p class="text-xs text-purple-600 mt-1">Penjual sedang menyiapkan pesananmu. Kamu akan mendapat notifikasi saat pesanan sudah siap diambil.</p>
          </div>
        </div>
      </div>

    </div>

    <!-- ===== ERROR STATE ===== -->
    <div v-else class="max-w-4xl mx-auto px-6 py-20 text-center">
      <AlertTriangle class="w-16 h-16 text-slate-200 mx-auto mb-4" />
      <h3 class="text-lg font-bold text-slate-700 mb-2">Pesanan Tidak Ditemukan</h3>
      <p class="text-sm text-slate-400 mb-6">Pesanan yang kamu cari tidak tersedia</p>
      <router-link 
        to="/orders" 
        class="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 no-underline"
      >
        Kembali ke Pesanan Saya
        <ArrowRight class="w-4 h-4" />
      </router-link>
    </div>

    <!-- ===== CANCEL MODAL ===== -->
    <Transition name="fade">
      <div 
        v-if="showCancelModal"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
        @click.self="showCancelModal = false"
      >
        <div class="bg-white rounded-3xl p-8 max-w-sm w-full text-center" @click.stop>
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <XCircle class="w-8 h-8 text-red-500" />
          </div>

          <h2 class="text-xl font-black text-slate-800 mb-2">Batalkan Pesanan?</h2>
          <p class="text-sm text-slate-400 mb-6">
            Kamu yakin ingin membatalkan pesanan <span class="font-bold text-slate-600 font-mono">{{ order?.order_number }}</span>? 
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <!-- Cancel Reason -->
          <div class="text-left mb-6">
            <label class="text-xs font-bold text-slate-700 mb-2 block">Alasan pembatalan (opsional)</label>
            <textarea
              v-model="cancelReason"
              placeholder="Tuliskan alasan pembatalan..."
              rows="3"
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-red-400 transition resize-none"
            ></textarea>
          </div>

          <div class="space-y-3">
            <button
              @click="cancelOrder"
              :disabled="isCancelling"
              class="w-full py-3.5 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Loader2 v-if="isCancelling" class="w-4 h-4 animate-spin" />
              {{ isCancelling ? 'Membatalkan...' : 'Ya, Batalkan Pesanan' }}
            </button>
            <button
              @click="showCancelModal = false"
              :disabled="isCancelling"
              class="w-full py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition disabled:opacity-50"
            >
              Tidak, Kembali
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import dayjs from 'dayjs'
import {
  ArrowLeft, ArrowRight, CheckCircle, XCircle, Clock, Loader2,
  Wallet, Banknote, Package, MapPin, ExternalLink, AlertTriangle,
  ShoppingBag, ChefHat, Truck
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// State
const isLoading = ref(true)
const order = ref(null)
const showCancelModal = ref(false)
const isCancelling = ref(false)
const cancelReason = ref('')

// Timeline steps
const timelineSteps = [
  { 
    key: 'pending', 
    label: 'Menunggu Pembayaran', 
    icon: Clock,
    activeText: 'Menunggu kamu melakukan pembayaran ke penjual'
  },
  { 
    key: 'paid', 
    label: 'Pembayaran Dikonfirmasi', 
    icon: Wallet,
    activeText: 'Menunggu penjual mengkonfirmasi pembayaran'
  },
  { 
    key: 'preparing', 
    label: 'Sedang Disiapkan', 
    icon: ChefHat,
    activeText: 'Penjual sedang menyiapkan pesananmu'
  },
  { 
    key: 'ready', 
    label: 'Siap Diambil', 
    icon: ShoppingBag,
    activeText: 'Pesanan sudah siap, segera ambil ke lokasi UMKM!'
  },
  { 
    key: 'picked_up', 
    label: 'Selesai', 
    icon: CheckCircle,
    activeText: ''
  },
]

// Status order index mapping
const statusIndexMap = {
  pending: 0,
  paid: 1,
  preparing: 2,
  ready: 3,
  picked_up: 4,
  cancelled: -1,
}

// Computed
const currentStepIndex = computed(() => {
  if (!order.value) return -1
  return statusIndexMap[order.value.status] ?? -1
})

const timelineProgressHeight = computed(() => {
  if (currentStepIndex.value <= 0) return '0px'
  const stepHeight = 56 // approximate height per step (gap + content)
  const totalSteps = timelineSteps.length - 1
  const progress = Math.min(currentStepIndex.value, totalSteps)
  return `${progress * stepHeight}px`
})

const canCancel = computed(() => {
  if (!order.value) return false
  return ['pending', 'paid'].includes(order.value.status)
})

// Methods
const statusLabel = (status) => {
  const labels = {
    pending: 'Menunggu',
    paid: 'Dibayar',
    preparing: 'Diproses',
    ready: 'Siap Diambil',
    picked_up: 'Selesai',
    cancelled: 'Dibatalkan',
  }
  return labels[status] || status
}

const statusStyle = (status) => {
  const styles = {
    pending: 'bg-amber-100 text-amber-700',
    paid: 'bg-blue-100 text-blue-700',
    preparing: 'bg-purple-100 text-purple-700',
    ready: 'bg-emerald-100 text-emerald-700',
    picked_up: 'bg-slate-100 text-slate-600',
    cancelled: 'bg-red-100 text-red-600',
  }
  return styles[status] || 'bg-slate-100 text-slate-600'
}

const isFinalStatus = (status) => {
  return ['picked_up', 'cancelled'].includes(status)
}

const isStepCompleted = (index) => {
  if (currentStepIndex.value === -1) return false
  return index < currentStepIndex.value
}

const isStepActive = (index) => {
  if (currentStepIndex.value === -1) return false
  return index <= currentStepIndex.value
}

const getStepClass = (index) => {
  if (currentStepIndex.value === -1) {
    return 'bg-slate-100 border-slate-200 text-slate-400'
  }
  
  if (index < currentStepIndex.value) {
    return 'bg-emerald-500 border-emerald-500 text-white'
  }
  
  if (index === currentStepIndex.value) {
    return 'bg-white border-emerald-500 text-emerald-600'
  }
  
  return 'bg-white border-slate-200 text-slate-400'
}

const getStepDate = (key) => {
  if (!order.value) return null
  if (key === 'paid' || key === 'preparing' || key === 'ready') {
    return order.value.paid_at
  }
  if (key === 'picked_up') {
    return order.value.picked_up_at
  }
  if (key === 'pending') {
    return order.value.created_at
  }
  return null
}

const formatFullDate = (date) => {
  if (!date) return null
  return dayjs(date).format('DD MMMM YYYY, HH:mm')
}

// Fetch order detail
const fetchOrder = async () => {
  isLoading.value = true
  try {
    const res = await api.get(`/api/orders/${route.params.id}`)
    order.value = res.data.data
  } catch (err) {
    if (err.response?.status === 404) {
      order.value = null
    } else if (err.response?.status === 403) {
      toast.error('Kamu tidak memiliki akses ke pesanan ini')
      router.push('/orders')
    } else {
      toast.error('Gagal memuat detail pesanan')
    }
  } finally {
    isLoading.value = false
  }
}

// Cancel order
const cancelOrder = async () => {
  isCancelling.value = true
  try {
    await api.post(`/api/orders/${route.params.id}/cancel`, {
      reason: cancelReason.value,
    })
    
    toast.success('Pesanan berhasil dibatalkan')
    showCancelModal.value = false
    cancelReason.value = ''
    
    // Refresh order data
    await fetchOrder()
  } catch (err) {
    const msg = err.response?.data?.message || 'Gagal membatalkan pesanan'
    toast.error(msg)
  } finally {
    isCancelling.value = false
  }
}

// On mounted
onMounted(() => {
  fetchOrder()
})
</script>

<style scoped>
@reference "../../assets/css/app.css";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>