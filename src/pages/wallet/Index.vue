<template>
  <div class="min-h-screen bg-[#0a0f1e] pb-32">

    <!-- Subtle background accents -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-900/15 rounded-full blur-[120px]"></div>
      <div class="absolute top-1/2 -left-32 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-800/8 rounded-full blur-[80px]"></div>
    </div>

    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">

      <!-- ===== HEADER ===== -->
      <div class="mb-8">
        <p class="text-blue-400/70 text-xs font-semibold tracking-widest uppercase mb-2">Wallet</p>
        <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">Top Up Coin</h1>
      </div>

      <!-- ===== SALDO STRIP ===== -->
      <div class="bg-gradient-to-r from-blue-900/40 via-blue-800/20 to-transparent border border-blue-800/30 rounded-2xl px-6 py-4 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
            <Wallet class="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p class="text-blue-300/60 text-[11px] font-semibold tracking-wide uppercase">Saldo Saat Ini</p>
            <p class="text-white text-xl font-black tracking-tight">{{ walletData.balance_formatted || '0 Coin' }}</p>
          </div>
        </div>
        <div class="sm:text-right">
          <p class="text-blue-300/40 text-[11px] font-medium">Setara nilai</p>
          <p class="text-blue-200 text-sm font-bold">{{ walletData.balance_in_rupiah_formatted || 'Rp 0' }}</p>
        </div>
      </div>

      <!-- ===== MAIN GRID: FORM + HISTORY ===== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- ===== LEFT: TOP UP FORM ===== -->
        <div class="lg:col-span-5">
          <div class="bg-[#111827]/80 backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 sticky top-8">

            <!-- Section Title -->
            <div class="flex items-center gap-2.5 mb-6">
              <div class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <PlusCircle class="w-4 h-4 text-blue-400" />
              </div>
              <h2 class="text-white text-sm font-bold">Pilih Nominal</h2>
            </div>

            <!-- Nominal Grid -->
            <div class="grid grid-cols-3 gap-2 mb-5">
              <button
                v-for="nominal in nominalOptions" :key="nominal"
                @click="selectNominal(nominal)"
                :class="[
                  'relative p-3 rounded-xl border text-center transition-all duration-200 group',
                  selectedAmount === nominal
                    ? 'bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/10'
                    : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12]'
                ]"
              >
                <div v-if="selectedAmount === nominal" class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <p :class="selectedAmount === nominal ? 'text-white font-extrabold' : 'text-white/70 font-bold'" class="text-xs">
                  {{ formatRupiahShort(nominal) }}
                </p>
                <p :class="selectedAmount === nominal ? 'text-blue-300/80' : 'text-white/30'" class="text-[10px] font-semibold mt-0.5">
                  {{ Math.floor(nominal / 2000) }} Coin
                </p>
              </button>
            </div>

            <!-- Divider -->
            <div class="flex items-center gap-3 mb-5">
              <div class="flex-1 h-px bg-white/[0.06]"></div>
              <span class="text-white/20 text-[10px] font-semibold tracking-widest uppercase">atau custom</span>
              <div class="flex-1 h-px bg-white/[0.06]"></div>
            </div>

            <!-- Manual Input -->
            <div class="relative mb-5">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 font-bold text-sm">Rp</span>
              <input
                v-model="customAmount"
                type="number"
                placeholder="Masukkan nominal"
                class="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm font-bold placeholder-white/20 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 outline-none transition"
                @input="selectedAmount = null"
              >
            </div>

            <!-- Estimasi Box -->
            <Transition name="slide-fade">
              <div v-if="finalAmount >= 4000" class="bg-blue-950/40 border border-blue-500/15 rounded-xl p-4 mb-5">
                <div class="flex justify-between items-center mb-3">
                  <span class="text-white/40 text-xs font-medium">Pembayaran</span>
                  <span class="text-white text-sm font-bold">{{ formatRupiah(finalAmount) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-white/40 text-xs font-medium">Kamu dapat</span>
                  <span class="text-blue-400 text-lg font-black">+{{ calculatedCoins }} Coin</span>
                </div>
                <p class="text-white/15 text-[10px] mt-3 pt-3 border-t border-white/[0.05]">1 Coin = Rp 2.000 · Minimal 2 Coin</p>
              </div>
            </Transition>

            <!-- Submit Button -->
            <button
              @click="handleTopUp"
              :disabled="!finalAmount || isProcessing || finalAmount < 4000"
              class="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 relative overflow-hidden"
              :class="finalAmount >= 4000
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/30'
                : 'bg-white/[0.06] text-white/30'"
            >
              <div v-if="finalAmount >= 4000" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
              <Loader2 v-if="isProcessing" class="w-4 h-4 animate-spin relative z-10" />
              <Lock v-else class="w-4 h-4 relative z-10" />
              <span class="relative z-10">{{ isProcessing ? 'Menghubungkan...' : 'Bayar Sekarang' }}</span>
            </button>

            <p v-if="isDev" class="text-[10px] text-center text-amber-400/60 bg-amber-400/[0.06] p-2 rounded-lg border border-amber-400/10 font-medium mt-3">
              🧪 Dev Mode — simulasi tersedia di modal
            </p>
          </div>
        </div>

        <!-- ===== RIGHT: HISTORY ===== -->
        <div class="lg:col-span-7">
          <div class="bg-[#111827]/80 backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 flex flex-col min-h-[600px]">

            <!-- History Header -->
            <div class="flex items-center justify-between mb-5">
              <div class="flex gap-1 bg-white/[0.04] p-1 rounded-lg">
                <button
                  @click="historyTab = 'topup'; fetchTopUpHistory()"
                  class="px-4 py-2 text-xs font-bold rounded-md transition-all duration-200"
                  :class="historyTab === 'topup' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-white/40 hover:text-white/60'"
                >
                  Top Up
                </button>
                <button
                  @click="historyTab = 'coin'; fetchCoinHistory()"
                  class="px-4 py-2 text-xs font-bold rounded-md transition-all duration-200"
                  :class="historyTab === 'coin' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-white/40 hover:text-white/60'"
                >
                  Transaksi Coin
                </button>
              </div>
              <span v-if="currentHistoryData.length > 0" class="text-white/20 text-[11px] font-semibold">
                {{ currentHistoryData.length }} record
              </span>
            </div>

            <!-- Loading -->
            <div v-if="isLoadingHistory" class="flex-1 flex flex-col items-center justify-center">
              <div class="relative w-10 h-10 mb-3">
                <div class="absolute inset-0 border-2 border-white/[0.06] rounded-full"></div>
                <div class="absolute inset-0 border-2 border-blue-500/50 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p class="text-white/30 text-xs font-medium">Memuat riwayat...</p>
            </div>

            <!-- Empty -->
            <div v-else-if="currentHistoryData.length === 0" class="flex-1 flex flex-col items-center justify-center">
              <div class="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
                <FileText class="w-7 h-7 text-white/10" />
              </div>
              <p class="text-white/40 text-sm font-semibold">Belum ada riwayat</p>
              <p class="text-white/15 text-xs mt-1">Transaksi akan muncul di sini</p>
            </div>

            <!-- TOP UP HISTORY -->
            <div v-else-if="historyTab === 'topup'" class="space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
              <div
                v-for="tx in currentHistoryData" :key="tx.id"
                class="flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 group"
                :class="tx.status === 'success'
                  ? 'bg-emerald-500/[0.06] border-emerald-500/15 hover:bg-emerald-500/[0.1]'
                  : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]'"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-lg flex items-center justify-center text-sm"
                    :class="tx.status === 'success' ? 'bg-emerald-500/15' : 'bg-white/[0.06]'"
                  >
                    <CheckCircle2 v-if="tx.status === 'success'" class="w-4.5 h-4.5 text-emerald-400" />
                    <Clock v-else class="w-4 h-4 text-white/30" />
                  </div>
                  <div>
                    <p class="text-white text-sm font-bold">{{ tx.amount_rupiah_formatted }}</p>
                    <p class="text-white/25 text-[11px] font-medium">{{ formatDate(tx.created_at) }}</p>
                  </div>
                </div>
                <div class="text-right flex items-center gap-3">
                  <div>
                    <p class="text-sm font-bold" :class="tx.status === 'success' ? 'text-emerald-400' : 'text-white/30'">
                      +{{ tx.coins_received_formatted }}
                    </p>
                    <span :class="getStatusClass(tx.status)" class="text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wide">
                      {{ getStatusLabel(tx.status) }}
                    </span>
                  </div>
                  <ChevronRight class="w-4 h-4 text-white/10 group-hover:text-white/25 transition" />
                </div>
              </div>
            </div>

            <!-- COIN HISTORY -->
            <div v-else class="space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
              <div
                v-for="tx in currentHistoryData" :key="tx.id"
                class="flex items-center justify-between p-3.5 rounded-xl border bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] transition-all duration-200 group"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-lg flex items-center justify-center"
                    :class="tx.type === 'credit' ? 'bg-emerald-500/10' : 'bg-red-500/10'"
                  >
                    <ArrowDownLeft v-if="tx.type === 'credit'" class="w-4 h-4 text-emerald-400" />
                    <ArrowUpRight v-else class="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p class="text-white text-sm font-bold truncate max-w-[220px]">{{ tx.description }}</p>
                    <p class="text-white/25 text-[11px] font-medium">{{ formatDate(tx.created_at) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <p :class="tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'" class="text-sm font-bold">
                    {{ tx.type === 'credit' ? '+' : '-' }}{{ tx.amount_formatted }}
                  </p>
                  <ChevronRight class="w-4 h-4 text-white/10 group-hover:text-white/25 transition" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ===== MODAL: MENUNGGU PEMBAYARAN ===== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showPaymentModal" class="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div class="bg-[#111827] border border-white/[0.08] rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl shadow-black/50">

            <!-- Spinner -->
            <div class="relative w-16 h-16 mx-auto mb-6">
              <div class="absolute inset-0 border-[3px] border-white/[0.06] rounded-full"></div>
              <div class="absolute inset-0 border-[3px] border-blue-500 rounded-full border-t-transparent animate-spin"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <CreditCard class="w-6 h-6 text-blue-400" />
              </div>
            </div>

            <h3 class="text-lg font-bold text-white mb-1.5">Menunggu Pembayaran</h3>
            <p class="text-white/35 text-xs leading-relaxed mb-5">
              Selesaikan pembayaran di jendela yang terbuka.<br>Status akan diperbarui otomatis.
            </p>

            <!-- Timer Bar -->
            <div class="bg-white/[0.04] rounded-full h-1.5 mb-1.5 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-1000 ease-linear"
                :class="pollingCount > MAX_POLLING_SECONDS * 0.8 ? 'bg-red-500' : 'bg-blue-500'"
                :style="{ width: Math.min((pollingCount / MAX_POLLING_SECONDS) * 100, 100) + '%' }"
              ></div>
            </div>
            <p class="text-white/20 text-[10px] font-medium mb-6">
              {{ formatTimer(pollingCount) }} · maks 2 menit
            </p>

            <!-- Dev Tools -->
            <div v-if="isDev && currentOrderId" class="mb-5 p-3.5 bg-amber-400/[0.06] rounded-xl border border-amber-400/15">
              <p class="text-[10px] text-amber-400/60 font-bold mb-2 tracking-wide uppercase">Dev Tools</p>
              <button
                @click="simulatePaymentSuccess"
                :disabled="isSimulating"
                class="w-full bg-amber-500/20 text-amber-300 py-2.5 px-4 rounded-lg text-xs font-bold hover:bg-amber-500/30 transition disabled:opacity-40 flex items-center justify-center gap-2 border border-amber-500/20"
              >
                <Loader2 v-if="isSimulating" class="w-3.5 h-3.5 animate-spin" />
                <Zap v-else class="w-3.5 h-3.5" />
                {{ isSimulating ? 'Processing...' : 'Simulasi Bayar Berhasil' }}
              </button>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                @click="closePaymentModal"
                class="flex-1 text-white/40 hover:text-white/60 py-3 px-4 rounded-xl border border-white/[0.08] text-xs font-bold hover:bg-white/[0.04] transition"
              >
                Tutup
              </button>
              <button
                @click="refreshStatus"
                :disabled="isRefreshing"
                class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl text-xs font-bold hover:bg-blue-500 transition disabled:opacity-40 flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/20"
              >
                <Loader2 v-if="isRefreshing" class="w-3.5 h-3.5 animate-spin" />
                <RefreshCw v-else class="w-3.5 h-3.5" />
                Cek Status
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ===== MODAL: SUKSES ===== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showSuccessModal" class="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div class="bg-[#111827] border border-white/[0.08] rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl shadow-black/50">

            <div class="w-16 h-16 mx-auto mb-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
              <span class="text-3xl">🎉</span>
            </div>

            <h3 class="text-lg font-bold text-white mb-4">Top Up Berhasil!</h3>

            <div class="bg-emerald-500/[0.08] border border-emerald-500/15 rounded-xl p-5 mb-6">
              <p class="text-3xl font-black text-emerald-400 mb-1">+{{ successCoins }} Coin</p>
              <p class="text-white/30 text-xs font-medium">Saldo baru: {{ walletData.balance_formatted }}</p>
            </div>

            <button
              @click="showSuccessModal = false"
              class="w-full bg-blue-600 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-600/25"
            >
              Selesai
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import dayjs from 'dayjs'
import {
  Wallet, PlusCircle, Loader2, Lock, CreditCard, Zap, RefreshCw,
  ArrowUpRight, ArrowDownLeft, FileText, CheckCircle2, Clock, ChevronRight
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const isDev = import.meta.env.DEV

// State
const walletData = ref({ balance: 0 })
const topUpHistoryData = ref([])
const coinHistoryData = ref([])
const historyTab = ref('topup')
const selectedAmount = ref(null)
const customAmount = ref(null)
const isProcessing = ref(false)
const isLoadingHistory = ref(false)

// Polling State
const currentOrderId = ref(null)
const showPaymentModal = ref(false)
const showSuccessModal = ref(false)
const successCoins = ref(0)
const pollingCount = ref(0)
const isSimulating = ref(false)
const isRefreshing = ref(false)
const MAX_POLLING_SECONDS = 120

let pollingInterval = null
let pollingCountInterval = null

const nominalOptions = [
  5000, 10000, 15000, 20000,
  25000, 50000, 75000, 100000,
  150000, 200000, 500000, 1000000
]

// Computed
const currentHistoryData = computed(() => {
  return historyTab.value === 'topup' ? topUpHistoryData.value : coinHistoryData.value
})

const finalAmount = computed(() => {
  const custom = parseInt(customAmount.value)
  return selectedAmount.value || (isNaN(custom) ? 0 : custom)
})

const calculatedCoins = computed(() => {
  if (finalAmount.value <= 0) return 0
  return Math.floor(finalAmount.value / 2000)
})

// Formatters
const formatRupiah = (val) => 'Rp ' + Number(val).toLocaleString('id-ID')
const formatRupiahShort = (val) => {
  if (val >= 1000000) return `${val / 1000000} Jt`
  if (val >= 1000) return `${val / 1000} Rb`
  return val.toString()
}
const formatTimer = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
const formatDate = (dateStr) => dayjs(dateStr).format('DD MMM YYYY, HH:mm')

const getStatusClass = (status) => {
  const classes = {
    success: 'text-emerald-400 bg-emerald-500/15',
    pending: 'text-amber-400 bg-amber-500/15',
    failed: 'text-red-400 bg-red-500/15',
    expired: 'text-white/30 bg-white/[0.06]',
    refunded: 'text-blue-400 bg-blue-500/15',
  }
  return classes[status] || 'text-white/30 bg-white/[0.06]'
}

const getStatusLabel = (status) => {
  const labels = {
    success: 'Berhasil',
    pending: 'Pending',
    failed: 'Gagal',
    expired: 'Kadaluarsa',
    refunded: 'Refund',
  }
  return labels[status] || status
}

// Actions
const selectNominal = (nominal) => {
  selectedAmount.value = nominal
  customAmount.value = null
}

const fetchWallet = async () => {
  try {
    const res = await api.get('/api/wallet')
    walletData.value = res.data.data
  } catch (error) {
    console.error('Fetch wallet error:', error)
  }
}

const fetchTopUpHistory = async () => {
  if (topUpHistoryData.value.length > 0) return
  isLoadingHistory.value = true
  try {
    const res = await api.get('/api/wallet/top-up-history')
    topUpHistoryData.value = res.data.data
  } catch (error) {
    console.error('Fetch top-up history error:', error)
  } finally {
    isLoadingHistory.value = false
  }
}

const fetchCoinHistory = async () => {
  if (coinHistoryData.value.length > 0) return
  isLoadingHistory.value = true
  try {
    const res = await api.get('/api/wallet/transactions')
    coinHistoryData.value = res.data.data
  } catch (error) {
    console.error('Fetch coin history error:', error)
  } finally {
    isLoadingHistory.value = false
  }
}

// Polling Logic
const startPolling = (orderId) => {
  stopPolling()
  currentOrderId.value = orderId
  showPaymentModal.value = true
  pollingCount.value = 0

  pollingCountInterval = setInterval(() => {
    pollingCount.value++
    if (pollingCount.value >= MAX_POLLING_SECONDS) {
      stopPolling()
      toast.warning('Waktu menunggu habis. Cek riwayat transaksi.')
    }
  }, 1000)

  pollingInterval = setInterval(async () => {
    try {
      const res = await api.get(`/api/wallet/check-status/${orderId}`)

      if (res.data.status === 'success') {
        successCoins.value = res.data.coins_received
        stopPolling()
        showSuccessModal.value = true
        await fetchWallet()
        topUpHistoryData.value = []
        await fetchTopUpHistory()
      } else if (['failed', 'expired'].includes(res.data.status)) {
        stopPolling()
        toast.error('Pembayaran gagal atau kadaluarsa.')
        topUpHistoryData.value = []
        await fetchTopUpHistory()
      }
    } catch (error) {
      console.error("Polling error:", error)
    }
  }, 3000)
}

const stopPolling = () => {
  if (pollingInterval) { clearInterval(pollingInterval); pollingInterval = null }
  if (pollingCountInterval) { clearInterval(pollingCountInterval); pollingCountInterval = null }
  showPaymentModal.value = false
  isProcessing.value = false
  pollingCount.value = 0
}

const closePaymentModal = () => {
  showPaymentModal.value = false
}

const refreshStatus = async () => {
  if (!currentOrderId.value) return
  isRefreshing.value = true
  try {
    const res = await api.get(`/api/wallet/check-status/${currentOrderId.value}`)
    if (res.data.status === 'success') {
      successCoins.value = res.data.coins_received
      stopPolling()
      showSuccessModal.value = true
      await fetchWallet()
      topUpHistoryData.value = []
      await fetchTopUpHistory()
    } else {
      toast.info(`Status saat ini: ${getStatusLabel(res.data.status)}`)
    }
  } catch (error) {
    toast.error('Gagal memeriksa status')
  } finally {
    isRefreshing.value = false
  }
}

const simulatePaymentSuccess = async () => {
  if (!currentOrderId.value) return
  isSimulating.value = true
  try {
    const res = await api.post(`/api/wallet/simulate-webhook/${currentOrderId.value}`)
    if (res.data.current_status === 'success') {
      successCoins.value = res.data.coins_received
      stopPolling()
      showSuccessModal.value = true
      await fetchWallet()
      topUpHistoryData.value = []
      await fetchTopUpHistory()
      toast.success('✨ Simulasi berhasil! Coin ditambahkan.')
    } else {
      toast.error('Simulasi gagal: ' + res.data.current_status)
    }
  } catch (error) {
    toast.error('Gagal mensimulasikan pembayaran')
  } finally {
    isSimulating.value = false
  }
}

const handleTopUp = async () => {
  if (finalAmount.value < 4000) {
    toast.error('Minimal top up Rp 4.000 (2 Coin)')
    return
  }

  if (!window.snap) {
    toast.error('Payment gateway belum siap. Silakan refresh halaman.')
    return
  }

  isProcessing.value = true
  try {
    const res = await api.post('/api/wallet/top-up', { amount_rupiah: finalAmount.value })
    const snapToken = res.data.data.snap_token
    const orderId = res.data.data.order_id

    window.snap.pay(snapToken, {
      onSuccess: function(result) {
        toast.info('Pembayaran berhasil! Memproses coin...')
        startPolling(orderId)
      },
      onPending: function(result) {
        startPolling(orderId)
      },
      onError: function(result) {
        stopPolling()
        toast.error('Pembayaran gagal atau dibatalkan.')
        topUpHistoryData.value = []
        fetchTopUpHistory()
      },
      onClose: function() {
        if (!showPaymentModal.value) isProcessing.value = false
      }
    })
  } catch (error) {
    toast.error(error.response?.data?.message || 'Gagal memulai top up.')
    isProcessing.value = false
  }
}

const handleMidtransCallback = async () => {
  const status = route.query.status
  if (!status) return

  await fetchTopUpHistory()
  const lastPending = topUpHistoryData.value.find(tx => tx.status === 'pending')

  if (lastPending && lastPending.order_id) {
    if (status === 'finish') {
      toast.info('Pembayaran selesai, mengecek status...')
      startPolling(lastPending.order_id)
    } else if (status === 'error') {
      toast.error('Terjadi kesalahan saat pembayaran.')
      topUpHistoryData.value = []
      fetchTopUpHistory()
    } else if (status === 'pending') {
      toast.info('Pembayaran belum selesai.')
      startPolling(lastPending.order_id)
    }
  }

  window.history.replaceState({}, document.title, window.location.pathname)
}

onMounted(async () => {
  await fetchWallet()
  await fetchTopUpHistory()
  handleMidtransCallback()
})

onBeforeUnmount(() => {
  stopPolling()
})
</script>

<style scoped>
/* Hide number input spinners */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Slide fade */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-6px);
  opacity: 0;
}

/* Modal transitions */
.modal-enter-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-leave-active {
  transition: all 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95) translateY(8px);
}
</style>