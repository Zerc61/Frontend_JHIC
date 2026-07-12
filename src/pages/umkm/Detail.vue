<template>
  <div v-if="!isLoading && umkm">
    <!-- ===== HEADER ===== -->
    <section class="relative bg-slate-900 py-16 overflow-hidden">
      <div
        class="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"
      ></div>

      <div class="relative z-10 max-w-7xl mx-auto px-6">
        <button
          @click="$router.back()"
          class="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition mb-8"
        >
          <ArrowLeft class="w-3.5 h-3.5" /> Kembali
        </button>

        <div class="flex flex-col lg:flex-row items-start gap-8">
          <!-- Image -->
          <div
            class="w-full lg:w-80 h-48 lg:h-52 bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0"
          >
            <img
              v-if="umkm.image"
              :src="umkm.image"
              :alt="umkm.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <Store class="w-12 h-12 text-slate-600" />
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <span
                class="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                :class="statusColor(umkm.status)"
              >
                {{ umkm.status }}
              </span>
              <span class="text-slate-500 text-xs">•</span>
              <span class="text-purple-400 text-xs font-bold">{{
                umkm.category?.name
              }}</span>
            </div>
            <h1 class="text-3xl font-black text-white mb-3">{{ umkm.name }}</h1>
            <p class="text-slate-400 text-sm flex items-center gap-2 mb-4">
              <MapPin class="w-4 h-4" />
              {{ umkm.address }}
            </p>

            <!-- Quick Info -->
            <div class="flex flex-wrap gap-4">
              <div class="flex items-center gap-2 text-slate-300">
                <Star class="w-4 h-4 text-amber-400 fill-amber-400" />
                <span class="text-sm">{{ umkm.average_rating }}</span>
              </div>
              <div class="flex items-center gap-2 text-slate-300">
                <Clock class="w-4 h-4" />
                <span class="text-sm">{{
                  umkm.opening_hours || "Tidak tersedia"
                }}</span>
              </div>
              <div class="flex items-center gap-2 text-slate-300">
                <Phone class="w-4 h-4" />
                <span class="text-sm">{{ umkm.phone }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CONTENT ===== -->
    <main class="max-w-7xl mx-auto px-6 py-12">
      <!-- Description -->
      <div v-if="umkm.description" class="mb-12">
        <h2 class="text-lg font-bold text-slate-800 mb-3">Tentang UMKM</h2>
        <p class="text-sm text-slate-500 leading-relaxed max-w-3xl">
          {{ umkm.description }}
        </p>
      </div>

      <!-- ===== PRODUCT SECTION ===== -->
      <div>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-slate-800">Produk UMKM</h2>
          <p class="text-sm text-slate-400">
            <span class="font-bold text-slate-600">{{ products.length }}</span>
            produk tersedia
          </p>
        </div>

        <!-- Loading Products -->
        <div
          v-if="isLoadingProducts"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="n in 6"
            :key="n"
            class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse"
          >
            <div class="h-48 bg-slate-200"></div>
            <div class="p-5 space-y-3">
              <div class="h-4 bg-slate-200 rounded w-3/4"></div>
              <div class="h-3 bg-slate-200 rounded w-full"></div>
              <div class="flex justify-between mt-4">
                <div class="h-5 bg-slate-200 rounded w-24"></div>
                <div class="h-8 bg-slate-200 rounded-lg w-24"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty Products -->
        <div
          v-else-if="products.length === 0"
          class="text-center py-16 bg-slate-50 rounded-2xl"
        >
          <Package class="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <h3 class="text-base font-bold text-slate-700 mb-1">
            Belum Ada Produk
          </h3>
          <p class="text-sm text-slate-400">
            UMKM ini belum menambahkan produk
          </p>
        </div>

        <!-- Product Grid -->
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="product in products"
            :key="product.id"
            class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
          >
            <!-- Product Image -->
            <div class="relative h-48 bg-slate-100 overflow-hidden">
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
              >
                <Package class="w-12 h-12 text-slate-200" />
              </div>

              <!-- Stock Badge -->
              <div
                class="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                :class="
                  product.is_available
                    ? 'bg-emerald-500 text-white'
                    : 'bg-red-500 text-white'
                "
              >
                {{ product.is_available ? "Tersedia" : "Habis" }}
              </div>

              <!-- Price Badge -->
              <div
                class="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-lg"
              >
                {{ product.price_formatted }}
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-5">
              <h3
                class="text-sm font-extrabold text-slate-800 mb-1 truncate group-hover:text-purple-600 transition"
              >
                {{ product.name }}
              </h3>
              <p
                v-if="product.description"
                class="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed"
              >
                {{ product.description }}
              </p>

              <!-- Bottom Row -->
              <div class="flex items-center justify-between">
                <!-- Stock -->
                <div class="text-xs text-slate-400">
                  Stok:
                  <span
                    :class="
                      product.stock > 0
                        ? 'text-emerald-600 font-bold'
                        : 'text-red-500 font-bold'
                    "
                    >{{ product.stock }}</span
                  >
                  <span class="text-slate-300">{{ product.unit }}</span>
                </div>

                <!-- Add to Cart Button -->
                <button
                  @click.stop="addToCart(product)"
                  :disabled="!product.is_available"
                  class="flex items-center gap-1.5 bg-purple-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-purple-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingCart class="w-3.5 h-3.5" />
                  Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== REVIEW SECTION ===== -->
      <div class="mt-12">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-slate-800">
            Ulasan
            <span class="text-sm font-normal text-slate-400"
              >({{ reviews.length }})</span
            >
          </h2>
          <button
            v-if="authStore.isLoggedIn"
            @click="showReviewForm = !showReviewForm"
            class="text-sm font-bold text-purple-600 hover:text-purple-700 transition"
          >
            {{ showReviewForm ? "Batal" : "+ Tulis Ulasan" }}
          </button>
        </div>

        <!-- Review Form -->
        <div v-if="showReviewForm" class="bg-slate-50 rounded-2xl p-6 mb-6">
          <h3 class="text-sm font-bold text-slate-700 mb-4">Tulis Ulasanmu</h3>

          <div class="flex gap-1 mb-4">
            <button
              v-for="n in 5"
              :key="n"
              @click="reviewRating = n"
              class="text-2xl transition hover:scale-110"
            >
              <Star
                :class="
                  n <= reviewRating
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-200'
                "
                class="w-7 h-7"
              />
            </button>
          </div>

          <textarea
            v-model="reviewComment"
            placeholder="Bagaimana pengalamanmu dengan UMKM ini?"
            rows="3"
            class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-purple-500 transition resize-none"
          ></textarea>

          <div class="flex justify-end mt-3">
            <button
              @click="submitReview"
              :disabled="!reviewRating || isSubmittingReview"
              class="bg-purple-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
            >
              {{ isSubmittingReview ? "Mengirim..." : "Kirim Ulasan" }}
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
              <div
                class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
              >
                <img
                  v-if="review.user?.avatar"
                  :src="review.user.avatar"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-sm font-bold text-slate-400">{{
                  review.user?.name?.charAt(0)
                }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-sm font-bold text-slate-700 truncate">
                    {{ review.user?.name }}
                  </p>
                  <span class="text-xs text-slate-400 flex-shrink-0 ml-2">{{
                    formatDate(review.created_at)
                  }}</span>
                </div>
                <div class="flex gap-0.5 mb-2">
                  <Star
                    v-for="n in 5"
                    :key="n"
                    :class="
                      n <= review.rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200'
                    "
                    class="w-3.5 h-3.5"
                  />
                </div>
                <p
                  v-if="review.comment"
                  class="text-sm text-slate-500 leading-relaxed"
                >
                  {{ review.comment }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 bg-slate-50 rounded-xl">
          <MessageSquare class="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p class="text-sm text-slate-400">Belum ada ulasan</p>
        </div>
      </div>
    </main>

    <!-- ===== FLOATING CART BAR ===== -->
    <Transition name="slide-up">
      <div
        v-if="cartStore.totalItems > 0"
        class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl z-40 px-6 py-4"
      >
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <div
                class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center"
              >
                <ShoppingCart class="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p class="text-sm font-bold text-slate-700">
                  {{ cartStore.totalItems }} Item
                </p>
                <p class="text-xs text-slate-400">di keranjang</p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-xs text-slate-400">Total</p>
             <p class="text-lg font-black text-slate-75">
  {{ cartStoreTotalFormatted }}
</p>
            </div>
            <button
              @click="$router.push('/checkout')"
              class="bg-purple-600 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-purple-700 transition flex items-center gap-2"
            >
              Checkout
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <Loader2 class="w-8 h-8 text-purple-500 animate-spin mx-auto mb-3" />
      <p class="text-sm text-slate-400">Memuat UMKM...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import { useToast } from "vue-toastification";
import api from "@/services/api";
import dayjs from "dayjs";
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Phone,
  Store,
  Package,
  ShoppingCart,
  MessageSquare,
  Loader2,
  ArrowRight,
} from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();
const toast = useToast();

const isLoading = ref(true);
const isLoadingProducts = ref(true);
const umkm = ref(null);
const products = ref([]);
const reviews = ref([]);
const showReviewForm = ref(false);
const isSubmittingReview = ref(false);
const reviewRating = ref(0);
const reviewComment = ref("");

// Computed total price formatted (add to cart store if not exists)
const cartStoreTotalFormatted = computed(() => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(cartStore.totalPrice);
});

const statusColor = (status) => {
  const colors = {
    active: "bg-emerald-500 text-white",
    inactive: "bg-slate-400 text-white",
    pending: "bg-amber-500 text-white",
    rejected: "red-500 text-white bg-red-500",
  };
  return colors[status] || "bg-slate-200 text-slate-600";
};

const formatDate = (date) => {
  return dayjs(date).format("DD MMM YYYY");
};

// Fetch UMKM detail
const fetchUmkm = async () => {
  isLoading.value = true;
  try {
    const res = await api.get(`/api/umkms/${route.params.slug}`);
    umkm.value = res.data.data;
  } catch (err) {
    if (err.response?.status === 404) {
      toast.error("UMKM tidak ditemukan");
      router.back();
    } else {
      toast.error("Gagal memuat UMKM");
    }
  } finally {
    isLoading.value = false;
  }
};

// Fetch products
const fetchProducts = async () => {
  isLoadingProducts.value = true;
  try {
    const res = await api.get(`/api/umkms/${route.params.slug}/products`);
    products.value = res.data.data || [];
  } catch (err) {
    console.error("Gagal fetch produk:", err);
  } finally {
    isLoadingProducts.value = false;
  }
};

// Fetch reviews
const fetchReviews = async () => {
  try {
    const res = await api.get("/api/reviews", {
      params: {
        reviewable_type: "Umkm",
        reviewable_id: umkm.value?.id,
      },
    });
    reviews.value = res.data.data;
  } catch (err) {
    console.error("Gagal fetch reviews:", err);
  }
};

// Add to cart
const addToCart = (product) => {
  if (!authStore.isLoggedIn) {
    toast.error("Silakan login terlebih dahulu untuk melanjutkan belanja");
    router.push({ path: "/login", query: { redirect: route.fullPath } });
    return;
  }

  const result = cartStore.addItem({
    id: product.id,
    name: product.name,
    price: parseFloat(product.price),
    stock: product.stock,
    unit: product.unit,
    umkm_id: umkm.value.id,
    umkm_name: umkm.value.name,
  });

  if (result.success) {
    toast.success(result.message);
  } else {
    toast.error(result.message);
  }
};

// Submit review
const submitReview = async () => {
  if (!reviewRating.value) {
    toast.warning("Pilih rating terlebih dahulu");
    return;
  }

  isSubmittingReview.value = true;
  try {
    await api.post("/api/reviews", {
      reviewable_type: "Umkm",
      reviewable_id: umkm.value.id,
      rating: reviewRating.value,
      comment: reviewComment.value,
    });
    toast.success("Ulasan berhasil dikirim!");
    showReviewForm.value = false;
    reviewRating.value = 0;
    reviewComment.value = "";
    fetchReviews();
  } catch (err) {
    toast.error(err.response?.data?.message || "Gagal mengirim ulasan");
  } finally {
    isSubmittingReview.value = false;
  }
};

onMounted(async () => {
  await fetchUmkm();
  if (umkm.value) {
    fetchProducts();
    fetchReviews();
  }
});
</script>

<style scoped>
@reference "../../assets/css/app.css";

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
