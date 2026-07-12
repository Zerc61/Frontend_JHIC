<template>
  <div class="min-h-screen bg-slate-50 pb-24">
    <!-- ===== HEADER ===== -->
    <div class="bg-white border-b border-slate-100 sticky top-0 z-30">
      <div class="max-w-4xl mx-auto px-6 py-4">
        <h1 class="text-xl font-black text-slate-800">Pesanan Saya</h1>
        <p class="text-xs text-slate-400 mt-0.5">Kelola dan lacak pesanan kamu</p>
      </div>

      <!-- ===== STATUS TABS ===== -->
      <div class="max-w-4xl mx-auto px-6 pb-3">
        <div class="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="activeTab = tab.value; currentPage = 1; fetchOrders()"
            class="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition"
            :class="activeTab === tab.value 
              ? 'bg-slate-800 text-white' 
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-6 py-6">

      <!-- ===== LOADING STATE ===== -->
      <div v-if="isLoading && orders.length === 0" class="space-y-4">
        <div 
          v-for="n in 3" 
          :key="n" 
          class="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse"
        >
          <div class="flex justify-between mb-4">
            <div class="h-4 bg-slate-200 rounded w-32"></div>
            <div class="h-6 bg-slate-200 rounded-full w-20"></div>
          </div>
          <div class="space-y-2 mb-4">
            <div class="h-3 bg-slate-200 rounded w-3/4"></div>
            <div class="h-3 bg-slate-200 rounded w-1/2"></div>
          </div>
          <div class="border-t border-slate-100 pt-4">
            <div class="h-4 bg-slate-200 rounded w-24"></div>
          </div>
        </div>
      </div>

      <!-- ===== EMPTY STATE ===== -->
      <div 
        v-else-if="!isLoading && orders.length === 0" 
        class="text-center py-20 bg-white rounded-2xl border border-slate-100"
      >
        <Package class="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <h3 class="text-lg font-bold text-slate-700 mb-2">Belum Ada Pesanan</h3>
        <p class="text-sm text-slate-400 mb-6">
          {{ activeTab === 'all' ? 'Kamu belum memiliki pesanan apapun' : 'Tidak ada pesanan dengan status ini' }}
        </p>
        <router-link
          to="/explore"
          class="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 no-underline"
        >
          Jelajahi UMKM
          <ArrowRight class="w-4 h-4" />
        </router-link>
      </div>

      <!-- ===== ORDERS LIST ===== -->
      <div v-else class="space-y-4">
        <router-link
          v-for="order in orders"
          :key="order.id"
          :to="`/orders/${order.id}`"
          class="bg-white rounded-2xl border border-slate-100 p-5 block cursor-pointer hover:border-slate-200 hover:shadow-sm transition-all duration-200 no-underline"
        >
          <!-- Top Row: Order Number & Status -->
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="text-xs text-slate-400 font-mono">{{ order.order_number }}</p>
              <p class="text-sm font-bold text-slate-700 mt-0.5">{{ order.umkm.name }}</p>
            </div>
            <span 
              class="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex-shrink-0"
              :class="statusStyle(order.status)"
            >
              {{ statusLabel(order.status) }}
            </span>
          </div>

          <!-- Items Preview -->
          <div class="bg-slate-50 rounded-xl p-3 mb-4">
            <div class="space-y-1.5">
              <p 
                v-for="(item, index) in order.items.slice(0, 3)" 
                :key="item.id"
                class="text-xs text-slate-500"
              >
                <span class="font-medium text-slate-600">{{ item.quantity }}x</span> 
                {{ item.product_name }}
              </p>
              <p v-if="order.items.length > 3" class="text-xs text-slate-400 italic">
                +{{ order.items.length - 3 }} item lainnya
              </p>
            </div>
          </div>

          <!-- Bottom Row: Date & Total -->
          <div class="flex items-center justify-between">
            <p class="text-xs text-slate-400">{{ formatDate(order.created_at) }}</p>
            <div class="flex items-center gap-3">
              <p class="text-sm font-black text-slate-800">{{ order.total_price_formatted }}</p>
              <ChevronRight class="w-4 h-4 text-slate-300" />
            </div>
          </div>
        </router-link>

        <!-- ===== LOAD MORE ===== -->
        <div v-if="hasMorePages" class="pt-4 text-center">
          <button
            @click="loadMore"
            :disabled="isLoadingMore"
            class="px-8 py-3 bg-white border border-slate-200 text-sm font-bold text-slate-600 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            <Loader2 v-if="isLoadingMore" class="w-4 h-4 animate-spin" />
            {{ isLoadingMore ? 'Memuat...' : 'Muat Lebih Banyak' }}
          </button>
        </div>

        <!-- End of list -->
        <div v-else-if="orders.length > 0" class="pt-4 text-center">
          <p class="text-xs text-slate-400">Semua pesanan sudah ditampilkan</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import dayjs from 'dayjs'
import {
  Package, ArrowRight, ChevronRight, Loader2
} from 'lucide-vue-next'

const toast = useToast()

// State
const isLoading = ref(false)
const isLoadingMore = ref(false)
const orders = ref([])
const activeTab = ref('all')
const currentPage = ref(1)
const lastPage = ref(1)

// Tabs
const tabs = [
  { label: 'Semua', value: 'all' },
  { label: 'Menunggu', value: 'pending' },
  { label: 'Diproses', value: 'processing' },
  { label: 'Siap Diambil', value: 'ready' },
  { label: 'Selesai', value: 'picked_up' },
  { label: 'Dibatalkan', value: 'cancelled' },
]

// Computed
const hasMorePages = computed(() => currentPage.value < lastPage.value)

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
    picked_up: 'bg-slate-100 text-slate-500',
    cancelled: 'bg-red-100 text-red-600',
  }
  return styles[status] || 'bg-slate-100 text-slate-600'
}

const formatDate = (date) => {
  return dayjs(date).format('DD MMM YYYY, HH:mm')
}

// Map tab ke parameter status API
const getApiStatusParam = () => {
  if (activeTab.value === 'all') return null
  if (activeTab.value === 'processing') return 'paid,preparing'
  return activeTab.value
}

// Fetch orders
const fetchOrders = async () => {
  isLoading.value = true
  try {
    const params = {
      page: currentPage.value,
      per_page: 10,
    }

    const statusParam = getApiStatusParam()
    if (statusParam) {
      params.status = statusParam
    }

    const res = await api.get('/api/orders', { params })
    
    orders.value = res.data.data
    lastPage.value = res.data.meta.last_page
  } catch (err) {
    console.error('Gagal fetch orders:', err)
    toast.error('Gagal memuat pesanan')
  } finally {
    isLoading.value = false
  }
}

// Load more
const loadMore = async () => {
  if (isLoadingMore.value || !hasMorePages.value) return

  isLoadingMore.value = true
  try {
    const nextPage = currentPage.value + 1
    
    const params = {
      page: nextPage,
      per_page: 10,
    }

    const statusParam = getApiStatusParam()
    if (statusParam) {
      params.status = statusParam
    }

    const res = await api.get('/api/orders', { params })
    
    orders.value = [...orders.value, ...res.data.data]
    currentPage.value = nextPage
    lastPage.value = res.data.meta.last_page
  } catch (err) {
    console.error('Gagal load more:', err)
    toast.error('Gagal memuat pesanan')
  } finally {
    isLoadingMore.value = false
  }
}

// On mounted
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
@reference "../../assets/css/app.css";

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>