<template>
  <div class="min-h-screen bg-slate-50 pb-24">
    <!-- ===== HEADER ===== -->
    <div class="bg-white border-b border-slate-100 sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button 
          @click="$router.back()" 
          class="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition"
        >
          <ArrowLeft class="w-4 h-4" /> Kembali
        </button>
        <h1 class="text-lg font-bold text-slate-800">Checkout</h1>
        <div class="text-sm text-slate-400">
          {{ cartStore.totalItems }} item
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- ===== LEFT: Cart Items ===== -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Cart Empty State -->
          <div v-if="cartStore.items.length === 0" class="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <ShoppingCart class="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-slate-700 mb-2">Keranjang Kosong</h3>
            <p class="text-sm text-slate-400 mb-6">Anda belum menambahkan produk apapun</p>
            <router-link 
              to="/explore" 
              class="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 no-underline"
            >
              Jelajahi Produk
              <ArrowRight class="w-4 h-4" />
            </router-link>
          </div>

          <!-- Cart Items List -->
          <div v-else class="space-y-4">
            <!-- UMKM Info Banner -->
            <div class="bg-purple-50 border border-purple-100 rounded-2xl p-5">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Store class="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p class="text-xs text-purple-500 font-medium">Memesan dari</p>
                  <p class="text-base font-bold text-slate-800">{{ cartStore.items[0]?.umkm_name }}</p>
                </div>
              </div>
            </div>

            <!-- Items -->
            <div 
              v-for="item in cartStore.items" 
              :key="item.id"
              class="bg-white rounded-2xl border border-slate-100 p-5 relative"
            >
              <div class="flex gap-4">
                <!-- Product Image -->
                <div class="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <Package class="w-8 h-8 text-slate-300" />
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-bold text-slate-800 truncate">{{ item.name }}</h3>
                  <p class="text-xs text-slate-400 mb-2">Rp {{ item.price.toLocaleString('id-ID') }} / {{ item.unit }}</p>
                  <!-- Subtotal diletakkan di dalam sini -->
                  <p class="text-sm text-slate-500">
                    Subtotal: <span class="font-bold text-slate-700">{{ formatRupiah(item.price * item.quantity) }}</span>
                  </p>
                </div>

                <!-- Quantity & Remove Controls -->
                <div class="flex flex-col items-end justify-between flex-shrink-0">
                  <!-- Remove Button -->
                  <button 
                    @click="cartStore.removeItem(item.id)"
                    class="text-slate-300 hover:text-red-500 transition"
                  >
                    <X class="w-4 h-4" />
                  </button>
                  
                  <!-- Quantity Buttons -->
                  <div class="flex items-center gap-2">
                    <button 
                      @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                      :disabled="item.quantity <= 1"
                      class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus class="w-4 h-4" />
                    </button>
                    <span class="w-10 text-center text-sm font-bold text-slate-700">{{ item.quantity }}</span>
                    <button 
                      @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                      :disabled="item.quantity >= item.stock"
                      class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        <!-- ===== RIGHT: Order Summary ===== -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
            <h2 class="text-base font-bold text-slate-800 mb-6">Ringkasan Pesanan</h2>

            <!-- Price Breakdown -->
            <div class="space-y-3 mb-6 pb-6 border-b border-slate-100">
              <div class="flex justify-between text-sm">
                <span class="text-slate-500">Subtotal ({{ cartStore.totalItems }} item)</span>
                <span class="text-slate-700 font-medium">{{ formatRupiah(cartStore.totalPrice) }}</span>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="mb-6">
              <h3 class="text-sm font-bold text-slate-800 mb-3">Metode Pembayaran</h3>
              <div class="space-y-2">
                <label 
                  class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition"
                  :class="form.payment_method === 'coin' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'"
                >
                  <input 
                    type="radio" 
                    v-model="form.payment_method" 
                    value="coin"
                    class="accent-blue-600"
                  />
                  <div class="flex-1">
                    <p class="text-sm font-bold text-slate-700">Bayar Pakai Coin</p>
                    <p class="text-xs text-slate-400">
                      Saldo coin Anda: <span class="font-bold text-blue-600">{{ formatCoin(walletBalance) }}</span>
                    </p>
                  </div>
                  <Wallet class="w-5 h-5 text-slate-400" />
                </label>

                <label 
                  class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition"
                  :class="form.payment_method === 'cash_on_pickup' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'"
                >
                  <input 
                    type="radio" 
                    v-model="form.payment_method" 
                    value="cash_on_pickup"
                    class="accent-blue-600"
                  />
                  <div class="flex-1">
                    <p class="text-sm font-bold text-slate-700">Bayar saat Ambil</p>
                    <p class="text-xs text-slate-400">Bayar langsung ke penjual</p>
                  </div>
                  <Banknote class="w-5 h-5 text-slate-400" />
                </label>
              </div>

              <!-- Coin Warning -->
              <div 
                v-if="form.payment_method === 'coin' && coinShortage > 0"
                class="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl mt-3"
              >
                <div class="flex items-center gap-2">
                  <AlertCircle class="w-4 h-4 flex-shrink-0" />
                  <div>
                    <p class="font-bold">Saldo coin tidak cukup</p>
                    <p>Kekurangan: {{ formatCoin(coinShortage) }}</p>
                  </div>
                </div>
              </div>

              <!-- Coin Enough Info -->
              <div 
                v-else-if="form.payment_method === 'coin' && coinShortage <= 0"
                class="bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs p-3 rounded-xl mt-3"
              >
                <div class="flex items-center gap-2">
                  <CheckCircle class="w-4 h-4 flex-shrink-0" />
                  <p class="font-bold">Saldo cukup! Sisa: {{ formatCoin(walletBalance - coinAmount) }}</p>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div class="mb-6">
              <label class="text-sm font-bold text-slate-800 mb-2 block">Catatan (Opsional)</label>
              <textarea
                v-model="form.notes"
                placeholder="Contoh: Pesanan untuk besok siap diambil"
                rows="3"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition resize-none"
              ></textarea>
            </div>

            <!-- Total -->
            <div class="bg-slate-50 rounded-xl p-5 mb-6">
              <div class="flex justify-between mb-1">
                <span class="text-sm text-slate-500">Total Pembayaran</span>
              </div>
              <div class="flex justify-between items-end">
                <span class="text-2xl font-black text-slate-800">
                  {{ formatRupiah(totalPayment) }}
                </span>
                <span v-if="form.payment_method === 'coin'" class="text-xs text-slate-400">
                  ≈ {{ formatCoin(coinAmount) }} Coin
                </span>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              @click="submitOrder"
              :disabled="isSubmitting || (form.payment_method === 'coin' && coinShortage > 0) || cartStore.items.length === 0"
              class="w-full py-4 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              {{ isSubmitting ? 'Memproses...' : 'Buat Pesanan' }}
            </button>

            <!-- Back to UMKM -->
            <button 
              @click="$router.back()"
              class="w-full py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition text-center"
            >
              Kembali Belanja
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== SUCCESS MODAL ===== -->
    <Transition name="fade">
      <div 
        v-if="showSuccessModal"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
        @click.self="goToOrders"
      >
        <div 
          class="bg-white rounded-3xl p-10 max-w-sm w-full text-center"
          @click.stop
        >
          <!-- Success Icon -->
          <div class="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle class="w-10 h-10 text-emerald-600" />
          </div>

          <h2 class="text-2xl font-black text-slate-800 mb-2">Pesanan Berhasil!</h2>
          
          <p class="text-sm text-slate-400 mb-2">Pesanan Anda telah dibuat</p>

          <!-- Order Number -->
          <div class="bg-slate-50 rounded-xl p-4 mb-6">
            <p class="text-xs text-slate-400 mb-1">Nomor Pesanan</p>
            <p class="text-lg font-black text-slate-800 font-mono">{{ orderNumber }}</p>
          </div>

          <!-- Payment Info -->
          <div class="text-left bg-slate-50 rounded-xl p-4 mb-6 text-sm space-y-2">
            <div class="flex justify-between">
              <span class="text-slate-400">Total</span>
              <span class="font-bold text-slate-700">{{ formatRupiah(totalPayment) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Pembayaran</span>
              <span class="font-bold text-slate-700">{{ form.payment_method === 'coin' ? 'Coin' : 'Bayar saat Ambil' }}</span>
            </div>
            <div v-if="form.payment_method === 'coin'" class="flex justify-between">
              <span class="text-slate-400">Dibayar dengan</span>
              <span class="font-bold text-emerald-600">-{{ formatCoin(coinAmount) }} Coin</span>
            </div>
          </div>

          <!-- Next Steps -->
          <div class="text-left bg-blue-50 rounded-xl p-4 mb-6 text-xs text-slate-600 space-y-1.5">
            <p v-if="form.payment_method === 'cash_on_pickup'">
              📍 Datang ke UMKM dan bayar langsung ke penjual
            </p>
            <p v-else>
              ✅ Pesanan otomatis dibayar dengan coin
            </p>
            <p>📦 Ambil pesanan sesuai jam buka UMKM</p>
          </div>

          <!-- Buttons -->
          <div class="space-y-3">
            <button 
              @click="goToOrders"
              class="w-full py-3.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition"
            >
              Lihat Pesanan Saya
            </button>
            <button 
              @click="goToExplore"
              class="w-full py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition"
            >
              Belanja Lagi
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'vue-toastification'
import api from '@/services/api'
import {
  ArrowLeft, ArrowRight, Minus, Plus, X, ShoppingCart, Package,
  Wallet, Banknote, CheckCircle, AlertCircle, Loader2
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const toast = useToast()

const isSubmitting = ref(false)
const showSuccessModal = ref(false)
const orderNumber = ref('')
const walletBalance = ref(0)
const totalPayment = computed(() => cartStore.totalPrice)
const coinAmount = ref(0)
const coinShortage = ref(0)

const form = reactive({
  payment_method: 'cash_on_pickup',
  notes: '',
})

// Format helpers
const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatCoin = (amount) => {
  return `${amount.toFixed(1).replace(/\.?0+$/, '')} Coin`
}

// Coin calculation
const calculateCoinAmount = () => {
  const rate = 2000 // 1 Coin = Rp 2000
  coinAmount.value = Math.ceil(cartStore.totalPrice / rate * 10000) / 10000
  coinShortage.value = Math.max(0, coinAmount.value - walletBalance.value)
}

// Fetch wallet balance
const fetchWallet = async () => {
  try {
    const res = await api.get('/api/wallet')
    walletBalance.value = parseFloat(res.data.data.balance)
    calculateCoinAmount()
  } catch (err) {
    console.error('Gagal fetch wallet:', err)
  }
}

// Submit order
const submitOrder = async () => {
  if (cartStore.items.length === 0) {
    toast.warning('Keranjang masih kosong')
    return
  }

  if (form.payment_method === 'coin' && coinShortage.value > 0) {
    toast.error('Saldo coin tidak mencukupi!')
    return
  }

  isSubmitting.value = true

  try {
    const orderData = {
      items: cartStore.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      payment_method: form.payment_method,
      notes: form.notes,
    }

    const res = await api.post('/api/orders', orderData)

    orderNumber.value = res.data.data.order_number
    totalPayment.value = parseFloat(res.data.data.total_price)
    
    if (form.payment_method === 'coin') {
      coinAmount.value = parseFloat(res.data.data.coin_amount)
    }

    showSuccessModal.value = true
    cartStore.clearCart()

  } catch (error) {
    const msg = error.response?.data?.message || 'Gagal membuat pesanan'
    toast.error(msg)
  } finally {
    isSubmitting.value = false
  }
}

// Navigation after success
const goToOrders = () => {
  showSuccessModal.value = false
  router.push('/orders')
}

const goToExplore = () => {
  showSuccessModal.value = false
  router.push('/explore')
}

// Fetch wallet on mount (if logged in)
onMounted(() => {
  if (authStore.isLoggedIn) {
    fetchWallet()
  }
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