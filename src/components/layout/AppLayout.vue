<template>
  <div class="min-h-screen bg-white">
    <!-- ===== NAVBAR ===== -->
    <nav
      class="fixed top-0 left-0 w-full z-50 bg-[#0a0f1e]/95 backdrop-blur-xl border-b border-white/[0.06]"
    >
      <div
        class="max-w-7xl mx-auto px-6 h-[70px] flex items-center justify-between"
      >
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3 no-underline">
          <img
            v-if="logoUrl"
            :src="logoUrl"
            alt="Logo"
            class="w-9 h-9 object-contain brightness-0 invert"
          />
          <div
            v-else
            class="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center"
          >
            <span class="text-white font-black text-sm">NT</span>
          </div>
          <span
            class="font-extrabold text-white/90 text-sm tracking-[0.15em] uppercase hidden sm:block"
          >
            NusaTrip
          </span>
        </router-link>

        <!-- Desktop Menu -->
        <div class="hidden lg:flex items-center gap-1">
          <router-link
            to="/"
            exact-active-class="!text-white !bg-white/[0.08]"
            class="nav-link"
          >
            Home
          </router-link>
          <router-link
            to="/explore"
            active-class="!text-white !bg-white/[0.08]"
            class="nav-link"
          >
            Explore
          </router-link>
          <router-link
            to="/hotels"
            active-class="!text-white !bg-white/[0.08]"
            class="nav-link"
          >
            Hotels
          </router-link>
          <router-link
            to="/transport-tickets"
            active-class="!text-white !bg-white/[0.08]"
            class="nav-link"
          >
            Tiket
          </router-link>
          <router-link
            to="/packages"
            active-class="!text-white !bg-white/[0.08]"
            class="nav-link"
          >
            Paket
          </router-link>
          <router-link
            to="/events"
            active-class="!text-white !bg-white/[0.08]"
            class="nav-link"
          >
            Events
          </router-link>

          <!-- === SUDAH LOGIN === -->
          <template v-if="authStore.isLoggedIn">
            <div class="w-px h-5 bg-white/[0.08] mx-2"></div>

            <router-link
              to="/wallet"
              active-class="!text-white !bg-white/[0.08]"
              class="nav-link"
            >
              Wallet
            </router-link>

            <!-- Dropdown Profil -->
            <div class="relative group">
              <button
                class="flex items-center gap-2 text-white/50 hover:text-white/80 transition ml-1 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04]"
              >
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-white/10 group-hover:ring-white/20 transition"
                >
                  <img
                    v-if="authStore.user?.avatar"
                    :src="authStore.user.avatar"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-xs font-bold text-white/60">
                    {{ authStore.user?.name?.charAt(0)?.toUpperCase() }}
                  </span>
                </div>
                <ChevronDown
                  class="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition"
                />
              </button>

              <!-- Dropdown Menu -->
              <div
                class="absolute right-0 top-full mt-2 w-56 bg-[#111827] rounded-2xl shadow-2xl shadow-black/50 border border-white/[0.08] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden"
              >
                <!-- Info User -->
                <div class="px-4 py-3.5 border-b border-white/[0.06]">
                  <p class="text-sm font-bold text-white truncate">
                    {{ authStore.user?.name }}
                  </p>
                  <p class="text-xs text-white/30 truncate mt-0.5">
                    {{ authStore.user?.email }}
                  </p>
                </div>

                <!-- Menu Utama -->
                <div class="py-1.5">
                  <router-link to="/profile" class="dropdown-item">
                    <User class="w-4 h-4" /> Profil Saya
                  </router-link>
                  <router-link to="/wishlist" class="dropdown-item">
                    <Heart class="w-4 h-4" /> Wishlist
                  </router-link>
                  <router-link to="/orders" class="dropdown-item">
                    <ShoppingBag class="w-4 h-4" /> Pesanan UMKM
                  </router-link>
                  <router-link to="/bookings" class="dropdown-item">
                    <Ticket class="w-4 h-4" /> Booking Saya
                  </router-link>
                  <router-link to="/my-trips" class="dropdown-item">
                    <Map class="w-4 h-4" /> Trip Planner
                  </router-link>
                </div>

                <!-- Dashboard Khusus Role -->
                <div
                  v-if="authStore.isUmkm || authStore.isAdmin"
                  class="py-1.5 border-t border-white/[0.06]"
                >
                  <router-link
                    v-if="authStore.isUmkm"
                    to="/dashboard/umkm"
                    class="dropdown-item"
                  >
                    <LayoutDashboard class="w-4 h-4" /> Dashboard UMKM
                  </router-link>
                  <router-link
                    v-if="authStore.isAdmin"
                    to="/dashboard/admin"
                    class="dropdown-item"
                  >
                    <ShieldCheck class="w-4 h-4" /> Dashboard Admin
                  </router-link>
                </div>

                <!-- Logout -->
                <div class="py-1.5 border-t border-white/[0.06]">
                  <button
                    @click="handleLogout"
                    class="dropdown-item dropdown-item-danger w-full text-left"
                  >
                    <LogOut class="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- === BELUM LOGIN === -->
          <template v-else>
            <div class="w-px h-5 bg-white/[0.08] mx-2"></div>
            <router-link to="/login" class="nav-link"> Login </router-link>
            <router-link
              to="/register"
              class="ml-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full hover:bg-blue-500 transition shadow-lg shadow-blue-600/25"
            >
              Daftar
            </router-link>
          </template>
        </div>

        <!-- Mobile Hamburger -->
        <button
          @click="mobileOpen = !mobileOpen"
          class="lg:hidden text-white/60 hover:text-white p-1 transition"
        >
          <Menu v-if="!mobileOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Menu -->
      <Transition name="slide">
        <div
          v-if="mobileOpen"
          class="lg:hidden bg-[#0d1326] border-t border-white/[0.06] max-h-[80vh] overflow-y-auto custom-scrollbar"
        >
          <div class="px-6 py-5 space-y-1">
            <router-link to="/" @click="mobileOpen = false" class="mobile-link"
              >Home</router-link
            >
            <router-link
              to="/explore"
              @click="mobileOpen = false"
              class="mobile-link"
              >Explore</router-link
            >
            <router-link
              to="/hotels"
              @click="mobileOpen = false"
              class="mobile-link"
              >Hotels</router-link
            >
            <router-link
              to="/transport-tickets"
              @click="mobileOpen = false"
              class="mobile-link"
              >Tiket Transport</router-link
            >
            <router-link
              to="/packages"
              @click="mobileOpen = false"
              class="mobile-link"
              >Paket Wisata</router-link
            >
            <router-link
              to="/events"
              @click="mobileOpen = false"
              class="mobile-link"
              >Events</router-link
            >

            <template v-if="authStore.isLoggedIn">
              <div class="h-px bg-white/[0.06] my-3"></div>

              <!-- Mobile User Info -->
              <div class="flex items-center gap-3 px-3 py-3 mb-1">
                <div
                  class="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center overflow-hidden ring-1 ring-white/10"
                >
                  <img
                    v-if="authStore.user?.avatar"
                    :src="authStore.user.avatar"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-sm font-bold text-white/50">
                    {{ authStore.user?.name?.charAt(0)?.toUpperCase() }}
                  </span>
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-bold text-white truncate">
                    {{ authStore.user?.name }}
                  </p>
                  <p class="text-xs text-white/30 truncate">
                    {{ authStore.user?.email }}
                  </p>
                </div>
              </div>

              <router-link
                to="/profile"
                @click="mobileOpen = false"
                class="mobile-link"
              >
                <User class="w-4 h-4 inline mr-2 opacity-50" /> Profil Saya
              </router-link>
              <router-link
                to="/wallet"
                @click="mobileOpen = false"
                class="mobile-link"
              >
                <Wallet class="w-4 h-4 inline mr-2 opacity-50" /> Wallet
              </router-link>
              <router-link
                to="/wishlist"
                @click="mobileOpen = false"
                class="mobile-link"
              >
                <Heart class="w-4 h-4 inline mr-2 opacity-50" /> Wishlist
              </router-link>
              <router-link
                to="/orders"
                @click="mobileOpen = false"
                class="mobile-link"
              >
                <ShoppingBag class="w-4 h-4 inline mr-2 opacity-50" /> Pesanan
                UMKM
              </router-link>
              <router-link
                to="/bookings"
                @click="mobileOpen = false"
                class="mobile-link"
              >
                <Ticket class="w-4 h-4 inline mr-2 opacity-50" /> Booking Saya
              </router-link>
              <router-link
                to="/my-trips"
                @click="mobileOpen = false"
                class="mobile-link"
              >
                <Map class="w-4 h-4 inline mr-2 opacity-50" /> Trip Planner
              </router-link>

              <template v-if="authStore.isUmkm">
                <router-link
                  to="/dashboard/umkm"
                  @click="mobileOpen = false"
                  class="mobile-link"
                >
                  <LayoutDashboard class="w-4 h-4 inline mr-2 opacity-50" />
                  Dashboard UMKM
                </router-link>
              </template>
              <template v-if="authStore.isAdmin">
                <router-link
                  to="/dashboard/admin"
                  @click="mobileOpen = false"
                  class="mobile-link"
                >
                  <ShieldCheck class="w-4 h-4 inline mr-2 opacity-50" />
                  Dashboard Admin
                </router-link>
              </template>

              <div class="h-px bg-white/[0.06] my-3"></div>
              <button
                @click="
                  handleLogout();
                  mobileOpen = false;
                "
                class="mobile-link !text-red-400 w-full text-left"
              >
                <LogOut class="w-4 h-4 inline mr-2 opacity-50" /> Logout
              </button>
            </template>

            <template v-else>
              <div class="h-px bg-white/[0.06] my-3"></div>
              <router-link
                to="/login"
                @click="mobileOpen = false"
                class="mobile-link"
                >Login</router-link
              >
              <router-link
                to="/register"
                @click="mobileOpen = false"
                class="mobile-link !text-blue-400"
                >Daftar</router-link
              >
            </template>
          </div>
        </div>
      </Transition>
    </nav>

    <!-- ===== PAGE CONTENT ===== -->
    <main class="pt-[70px]">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import {
  Menu,
  X,
  ChevronDown,
  Heart,
  ShoppingBag,
  Map,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  User,
  Wallet,
  Ticket,
} from "lucide-vue-next";

import logoUrl from "@/assets/images/scream 2.png";

const router = useRouter();
const authStore = useAuthStore();
const mobileOpen = ref(false);

const handleLogout = async () => {
  await authStore.logout();
  router.push("/");
};
</script>

<style scoped>
@reference "../../assets/css/app.css";

.nav-link {
  @apply text-white/40 text-xs font-bold uppercase tracking-wider no-underline transition-all duration-200 hover:text-white/80 px-3 py-2 rounded-lg hover:bg-white/[0.04];
}

.dropdown-item {
  @apply flex items-center gap-3 px-4 py-2.5 text-sm text-white/50 no-underline transition-all duration-150 hover:bg-white/[0.06] hover:text-white;
}

.dropdown-item-danger {
  @apply text-red-400/70 hover:!text-red-400 hover:!bg-red-500/[0.08];
}

.mobile-link {
  @apply flex items-center py-2.5 px-3 text-sm font-bold text-white/40 uppercase tracking-wider no-underline transition-all duration-200 hover:text-white/80 hover:bg-white/[0.04] rounded-lg;
}

/* Slide animation */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Custom scrollbar for mobile menu */
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
</style>
