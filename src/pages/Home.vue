<template>
  <div>
    <!-- ==================== HERO SECTION ==================== -->
    <section class="relative w-full h-[420px] flex items-center overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center" :style="{ backgroundImage: `url(${heroBg})` }"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-transparent"></div>
      <div class="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 flex justify-between items-center">
        <div class="max-w-lg text-white">
          <h4 class="text-xs font-bold text-amber-400 tracking-[0.2em] mb-3">EXPLORE NUSANTARA - ID</h4>
          <h1 class="text-4xl sm:text-5xl font-black leading-[1.1] mb-5 drop-shadow-lg">
            EXPLORE<br />BEAUTIFUL<br />WORLD WITH US
          </h1>
          <p class="text-sm font-medium text-slate-300 leading-relaxed mb-8 max-w-md">
            Tinggalkan kerumitan merencanakan liburan. Fokuslah pada petualangan dan biarkan kami mengurus sisanya.
          </p>
          <button @click="$router.push('/explore')" class="border-2 border-white text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-white hover:text-slate-900 transition-all duration-300 cursor-pointer">
            Discover Now
          </button>
        </div>
        <div class="hidden lg:flex gap-4 items-center">
          <div class="w-40 h-60 rounded-2xl overflow-hidden border-4 border-white/90 shadow-2xl transform translate-y-5">
            <img :src="heroCard1" class="w-full h-full object-cover" alt="Card 1" />
          </div>
          <div class="w-40 h-64 rounded-2xl overflow-hidden border-4 border-white/90 shadow-2xl transform -translate-y-3 z-10">
            <img :src="heroCard2" class="w-full h-full object-cover" alt="Card 2" />
          </div>
          <div class="w-40 h-60 rounded-2xl overflow-hidden border-4 border-white/90 shadow-2xl transform translate-y-5">
            <img :src="heroCard3" class="w-full h-full object-cover" alt="Card 3" />
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== MAIN CONTENT ==================== -->
    <main class="max-w-7xl mx-auto px-6 sm:px-10 py-10">

      <!-- ===== 8 MENU IKON ===== -->
      <Transition name="fade-up">
        <div class="grid grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4 mb-10">
          <div v-for="menu in menus" :key="menu.label" @click="menu.action()" class="flex flex-col items-center gap-2 cursor-pointer group">
            <div :class="menu.bgColor" class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-200">
              <component :is="menu.icon" :class="menu.iconColor" class="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span class="text-[11px] sm:text-[13px] font-bold text-slate-700 text-center leading-tight">{{ menu.label }}</span>
          </div>
        </div>
      </Transition>

      <!-- ===== LOADING SKELETON ===== -->
      <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-10">
        <div v-for="n in 3" :key="n" class="bg-white rounded-xl border border-slate-100 p-6 animate-pulse">
          <div class="h-5 bg-slate-100 rounded w-40 mb-4"></div>
          <div class="h-8 bg-slate-100 rounded w-64 mb-3"></div>
          <div class="h-4 bg-slate-100 rounded w-48"></div>
        </div>
      </div>

      <!-- ===== CONTENT (setelah loading) ===== -->
      <template v-else>

        <!-- ===== WELCOME + WALLET (Logged In) ===== -->
        <Transition name="fade-up">
          <div v-if="dashboard.user" class="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-10">
            <!-- Welcome Card -->
            <div class="bg-[#3b82f6] rounded-xl p-6 text-white relative overflow-hidden">
              <div class="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full"></div>
              <div class="absolute right-16 -top-6 w-20 h-20 bg-white/5 rounded-full"></div>
              <div class="relative z-10">
                <div class="flex items-start justify-between mb-5">
                  <div>
                    <p class="text-blue-100 text-xs mb-1">{{ greeting }}</p>
                    <h2 class="text-xl font-bold text-white leading-tight">{{ dashboard.user.name }}!</h2>
                  </div>
                  <div class="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-white/20">
                    <img v-if="dashboard.user.avatar" :src="dashboard.user.avatar" class="w-full h-full object-cover" />
                    <UserCircle v-else class="w-6 h-6 text-white/60" />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-x-6 gap-y-3 mb-5">
                  <div>
                    <p class="text-[10px] text-blue-200 uppercase tracking-wider mb-0.5">Email</p>
                    <p class="text-xs font-medium text-white truncate">{{ dashboard.user.email }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] text-blue-200 uppercase tracking-wider mb-0.5">Telepon</p>
                    <p class="text-xs font-medium text-white">{{ dashboard.user.phone || '-' }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] text-blue-200 uppercase tracking-wider mb-0.5">Tipe Akun</p>
                    <p class="text-xs font-medium text-white capitalize">{{ formatRole(dashboard.user.role) }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] text-blue-200 uppercase tracking-wider mb-0.5">Bergabung</p>
                    <p class="text-xs font-medium text-white">{{ formatJoinDate(dashboard.user.created_at) }}</p>
                  </div>
                </div>
                <div class="pt-4 border-t border-white/15 flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <div class="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                    <span class="text-[11px] text-blue-100">Akun Aktif</span>
                  </div>
                  <button @click="$router.push('/profile')" class="text-[11px] font-semibold text-white/80 hover:text-white transition cursor-pointer">
                    Edit Profil →
                  </button>
                </div>
              </div>
            </div>

            <!-- NusaCoin Wallet -->
            <div class="lg:col-span-2 bg-[#0f172a] rounded-xl text-white relative overflow-hidden">
              <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full"></div>
              <div class="absolute -right-2 -bottom-8 w-24 h-24 bg-white/5 rounded-full"></div>
              <div class="relative z-10 p-6 pb-3">
                <div class="flex items-center justify-between mb-5">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Coins class="w-4 h-4 text-blue-400" />
                    </div>
                    <span class="text-xs font-semibold text-slate-400">NusaCoin</span>
                  </div>
                  <button @click="$router.push('/wallet')" class="bg-white/10 hover:bg-white/15 text-white text-[11px] font-semibold px-4 py-2 rounded-lg transition cursor-pointer">
                    + Top Up
                  </button>
                </div>
                <p class="text-[11px] text-slate-500 mb-0.5">Saldo Kamu</p>
                <p class="text-2xl font-bold text-white mb-0.5 tracking-tight">{{ dashboard.wallet?.balance_formatted || '0' }}</p>
                <p class="text-[11px] text-slate-500 mb-5">≈ {{ dashboard.wallet?.balance_in_rupiah_formatted || 'Rp 0' }}</p>
              </div>

              <!-- Riwayat Scrollable -->
              <div v-if="dashboard.recent_transactions?.length > 0" class="relative z-10 border-t border-white/10">
                <div class="max-h-[140px] overflow-y-auto px-6 py-3 space-y-1.5" style="scrollbar-width: 4px; scrollbar-color: rgba(255,255,255,0.1);">
                  <div v-for="tx in dashboard.recent_transactions" :key="tx.id" class="flex items-center justify-between py-1.5">
                    <div class="flex items-center gap-2.5 min-w-0">
                      <div class="w-5 h-5 rounded flex items-center justify-center shrink-0" :class="tx.type === 'credit' ? 'bg-emerald-500/15' : 'bg-red-500/15'">
                        <ArrowUpRight v-if="tx.type === 'credit'" class="w-3 h-3 text-emerald-400" />
                        <ArrowDownLeft v-else class="w-3 h-3 text-red-400" />
                      </div>
                      <p class="text-[11px] text-slate-400 truncate pr-2">{{ tx.description }}</p>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                      <span class="text-[11px] font-medium" :class="tx.type === 'credit' ? 'text-emerald-400' : 'text-red-400'">
                        {{ tx.type === 'credit' ? '+' : '-' }}{{ tx.amount_formatted }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none z-20"></div>
              </div>
              <div v-else class="relative z-10 border-t border-white/10 px-6 py-5">
                <p class="text-[11px] text-slate-600 text-center">Belum ada transaksi</p>
              </div>
              <div class="relative z-10 border-t border-white/10 px-6 py-3 flex items-center justify-between">
                <span class="text-[10px] text-slate-600">{{ dashboard.recent_transactions?.length || 0 }} transaksi terakhir</span>
                <router-link to="/wallet" class="text-[10px] text-slate-500 hover:text-slate-300 transition">Lihat Semua →</router-link>
              </div>
            </div>
          </div>
          <!-- Not Logged In -->
          <div v-else class="bg-[#0f172a] rounded-xl p-8 mt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 class="text-lg font-bold text-white mb-1">Masuk ke akun kamu</h2>
              <p class="text-sm text-slate-400">Kelola booking, top up NusaCoin, dan dapatkan rekomendasi personal.</p>
            </div>
            <button @click="$router.push('/login')" class="bg-white text-[#0f172a] text-sm font-bold px-8 py-3 rounded-lg hover:bg-slate-100 transition cursor-pointer whitespace-nowrap">
              Masuk
            </button>
          </div>
        </Transition>

        <!-- ===== TRANSPORT DEALS ===== -->
        <Transition name="fade-up">
          <section class="mt-10">
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-2">
                <Plane class="w-5 h-5 text-blue-600" />
                <h2 class="text-base font-bold text-slate-900">Deal Transportasi</h2>
              </div>
              <div class="flex items-center gap-1.5">
                <button @click="scrollTransport(-1)" class="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer">
                  <ChevronLeft class="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button @click="scrollTransport(1)" class="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer">
                  <ChevronRight class="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            <!-- Loading -->
            <div v-if="isLoading" class="flex gap-4 overflow-hidden">
              <div v-for="n in 6" :key="n" class="w-52 shrink-0 bg-white rounded-xl border border-slate-100 p-4 animate-pulse">
                <div class="h-4 bg-slate-100 rounded w-24 mb-3"></div>
                <div class="h-8 bg-slate-100 rounded w-32 mb-2"></div>
                <div class="h-5 bg-slate-100 rounded w-20"></div>
              </div>
            </div>

            <!-- Cards -->
            <div v-else ref="transportScroll" class="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
              <div
                v-for="ticket in dashboard.transport_deals"
                :key="ticket.id"
                @click="goToTransportBook(ticket)"
                class="w-52 shrink-0 bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group"
              >
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-base">{{ ticket.transport_icon }}</span>
                  <div class="min-w-0">
                    <p class="text-xs font-semibold text-slate-700 truncate">{{ ticket.provider }}</p>
                    <p class="text-[10px] text-slate-400 truncate">{{ ticket.flight_number || ticket.transport_label }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-sm font-bold text-slate-900">{{ ticket.origin_code }}</span>
                  <div class="flex-1 h-px bg-slate-200 relative">
                    <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                    <div class="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border-2 border-blue-600 bg-white"></div>
                  </div>
                  <span class="text-sm font-bold text-slate-900">{{ ticket.destination_code }}</span>
                </div>
                <p class="text-[11px] text-slate-400 mb-1">{{ ticket.departure_date }} · {{ ticket.departure_time }} - {{ ticket.arrival_time }}</p>
                <div class="flex items-end justify-between">
                  <p class="text-sm font-bold text-blue-600">{{ ticket.price_formatted }}</p>
                  <span class="text-[10px] font-semibold text-blue-500 group-hover:translate-x-0.5 transition">Pilih →</span>
                </div>
              </div>
            </div>
          </section>
        </Transition>

        <!-- ===== POPULAR HOTELS ===== -->
        <Transition name="fade-up">
          <section class="mt-10">
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-2">
                <Building2 class="w-5 h-5 text-violet-600" />
                <h2 class="text-base font-bold text-slate-900">Hotel Populer</h2>
              </div>
              <router-link to="/hotels" class="text-xs font-semibold text-blue-600 hover:text-blue-700 transition">Lihat Semua →</router-link>
            </div>

            <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div v-for="n in 3" :key="n" class="bg-white rounded-xl overflow-hidden border border-slate-100 animate-pulse">
                <div class="h-40 bg-slate-200"></div>
                <div class="p-4 space-y-2">
                  <div class="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div class="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
              </div>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div
                v-for="hotel in dashboard.popular_hotels"
                :key="hotel.id"
                @click="$router.push(`/hotels/${hotel.slug}`)"
                class="bg-white rounded-xl overflow-hidden border border-slate-100 cursor-pointer hover:shadow-md hover:border-slate-200 transition-all group"
              >
                <div class="relative h-40 bg-slate-100 overflow-hidden">
                  <img v-if="hotel.thumbnail" :src="hotel.thumbnail" :alt="hotel.name" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                  <div v-else class="w-full h-full flex items-center justify-center text-slate-200"><Building2 class="w-8 h-8" /></div>
                  <div class="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm rounded-md px-2 py-0.5 flex items-center gap-0.5">
                    <Star v-for="n in Math.floor(hotel.star_rating || 0)" :key="n" class="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  </div>
                </div>
                <div class="p-4">
                  <h3 class="text-sm font-semibold text-slate-800 truncate mb-0.5">{{ hotel.name }}</h3>
                  <p v-if="hotel.destination" class="text-[11px] text-slate-400 truncate mb-2.5">{{ hotel.destination.name }}</p>
                  <p class="text-sm font-bold text-slate-900">{{ formatRupiah(hotel.min_price) }} <span class="text-[11px] font-normal text-slate-400">/malam</span></p>
                </div>
              </div>
            </div>
          </section>
        </Transition>

        <!-- ===== DESTINASI POPULER ===== -->
        <Transition name="fade-up">
          <section class="mt-10">
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-2">
                <MapPin class="w-5 h-5 text-rose-600" />
                <h2 class="text-base font-bold text-slate-900">Destinasi Populer</h2>
              </div>
              <router-link to="/explore" class="text-xs font-semibold text-blue-600 hover:text-blue-700 transition">Lihat Semua →</router-link>
            </div>

            <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div v-for="n in 4" :key="n" class="bg-white rounded-xl overflow-hidden border border-slate-100 animate-pulse">
                <div class="h-40 bg-slate-200"></div>
                <div class="p-4 space-y-2">
                  <div class="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div class="flex gap-1"><div class="h-5 bg-slate-100 rounded-full w-14"></div><div class="h-5 bg-slate-100 rounded-full w-14"></div><div class="h-5 bg-slate-100 rounded-full w-14"></div></div>
                  <div class="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
              </div>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div
                v-for="dest in dashboard.destinations"
                :key="dest.id"
                @click="$router.push(`/destination/${dest.slug}`)"
                class="bg-white rounded-xl overflow-hidden border border-slate-100 cursor-pointer hover:shadow-md hover:border-slate-200 transition-all group"
              >
                <div class="relative h-40 bg-slate-100 overflow-hidden">
                  <img v-if="dest.main_image" :src="dest.main_image" :alt="dest.name" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                  <div v-else class="w-full h-full flex items-center justify-center text-slate-200"><MapPin class="w-8 h-8" /></div>
                  <div class="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm rounded-md px-2 py-0.5 flex items-center gap-1">
                    <span class="text-[10px]">{{ dest.category?.icon }}</span>
                    <span class="text-[11px] font-medium text-slate-700">{{ dest.category?.name }}</span>
                  </div>
                  <div class="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm rounded-md px-2 py-0.5 flex items-center gap-1">
                    <Star class="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    <span class="text-[11px] font-semibold text-slate-700">{{ dest.average_rating }}</span>
                  </div>
                </div>
                <div class="p-4">
                  <h3 class="text-sm font-semibold text-slate-800 truncate mb-2">{{ dest.name }}</h3>
                  <div v-if="dest.facilities?.length" class="flex flex-wrap gap-1 mb-3">
                    <span v-for="fac in dest.facilities?.slice(0, 4)" :key="fac.name" class="text-[10px] text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                      {{ fac.icon }} {{ fac.name }}
                    </span>
                    <span v-if="dest.facilities?.length > 4" class="text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                      +{{ dest.facilities.length - 4 }}
                    </span>
                  </div>
                  <div v-if="dest.operating_hours" class="flex items-center gap-1.5 mb-3">
                    <Clock class="w-3 h-3 text-slate-400" />
                    <span class="text-[11px] text-slate-400">{{ dest.operating_hours }}</span>
                  </div>
                  <div class="flex items-end justify-between pt-2.5 border-t border-slate-50">
                    <div>
                      <p class="text-[10px] text-slate-400">Tiket masuk</p>
                      <p class="text-sm font-bold text-slate-900">{{ dest.ticket_price_formatted }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-[10px] text-slate-400">Estimasi</p>
                      <p class="text-xs font-semibold text-slate-500">{{ dest.estimated_cost_formatted || '-' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Transition>

        <!-- ===== REKOMENDASI UMKM ===== -->
        <Transition name="fade-up">
          <section class="mt-10">
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-2">
                <Store class="w-5 h-5 text-emerald-600" />
                <h2 class="text-base font-bold text-slate-900">Rekomendasi UMKM</h2>
              </div>
              <router-link to="/explore" class="text-xs font-semibold text-blue-600 hover:text-blue-700 transition">
                Lihat Semua →
              </router-link>
            </div>

            <!-- Loading Skeleton -->
            <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div v-for="n in 4" :key="n" class="bg-white rounded-xl overflow-hidden border border-slate-100 animate-pulse">
                <div class="h-36 bg-slate-200"></div>
                <div class="p-4 space-y-2">
                  <div class="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div class="h-3 bg-slate-100 rounded w-1/2"></div>
                  <div class="h-3 bg-slate-100 rounded w-2/3"></div>
                </div>
              </div>
            </div>

            <!-- Cards UMKM -->
            <div v-else-if="dashboard.umkms?.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div
                v-for="umkm in dashboard.umkms"
                :key="umkm.id"
                @click="$router.push(`/umkms/${umkm.slug}`)"
                class="bg-white rounded-xl overflow-hidden border border-slate-100 cursor-pointer hover:shadow-md hover:border-slate-200 transition-all group"
              >
                <!-- Cover: dari produk pertama -->
                <div class="relative h-36 bg-emerald-50 overflow-hidden">
                  <img
                    v-if="umkm.cover_image"
                    :src="umkm.cover_image"
                    :alt="umkm.name"
                    class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <Store class="w-12 h-12 text-emerald-200" />
                  </div>

                  <!-- Badge destinasi -->
                  <div
                    v-if="umkm.destination"
                    class="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm rounded-md px-2 py-0.5 flex items-center gap-1 max-w-[60%]"
                  >
                    <MapPinned class="w-3 h-3 text-rose-500 shrink-0" />
                    <span class="text-[10px] font-medium text-slate-700 truncate">
                      {{ umkm.destination.name }}
                    </span>
                  </div>

                  <!-- Badge kategori -->
                  <div
                    v-if="umkm.category"
                    class="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md"
                  >
                    {{ umkm.category.icon }} {{ umkm.category.name }}
                  </div>
                </div>

                <!-- Body -->
                <div class="p-4">
                  <h3 class="text-sm font-semibold text-slate-800 truncate mb-0.5">{{ umkm.name }}</h3>
                  <p v-if="umkm.address" class="text-[11px] text-slate-400 truncate mb-2.5">{{ umkm.address }}</p>

                  <!-- Box "Dekat wisata" -->
                  <div v-if="umkm.destination" class="flex items-start gap-2 mb-3 p-2.5 bg-rose-50 rounded-lg border border-rose-100">
                    <MapPin class="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                    <div class="min-w-0">
                      <p class="text-[10px] text-rose-400 font-medium uppercase tracking-wide">Dekat wisata</p>
                      <p class="text-[11px] text-rose-600 font-semibold truncate">{{ umkm.destination.name }}</p>
                    </div>
                  </div>

                  <!-- Preview produk -->
                  <div v-if="umkm.products?.length > 0" class="border-t border-slate-100 pt-3">
                    <div class="flex items-center gap-1 mb-2">
                      <ShoppingBag class="w-3 h-3 text-slate-400" />
                      <span class="text-[10px] text-slate-400 font-medium">Produk unggulan</span>
                    </div>
                    <div class="space-y-1.5">
                      <div
                        v-for="product in umkm.products.slice(0, 2)"
                        :key="product.id"
                        class="flex items-center justify-between"
                      >
                        <div class="flex items-center gap-2 min-w-0">
                          <div class="w-7 h-7 rounded-md bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                            <img v-if="product.image" :src="product.image" class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full flex items-center justify-center">
                              <ShoppingBag class="w-3 h-3 text-slate-300" />
                            </div>
                          </div>
                          <span class="text-[11px] text-slate-600 truncate">{{ product.name }}</span>
                        </div>
                        <span class="text-[11px] font-semibold text-emerald-600 shrink-0 ml-2">
                          {{ formatRupiah(product.price) }}
                        </span>
                      </div>
                      <p v-if="umkm.products.length > 2" class="text-[10px] text-slate-400 pl-9">
                        +{{ umkm.products.length - 2 }} produk lainnya
                      </p>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span class="text-[10px] text-slate-400">{{ umkm.products?.length || 0 }} produk</span>
                    <span class="text-[10px] font-semibold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                      Kunjungi →
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-10">
              <Store class="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p class="text-sm text-slate-400">Belum ada UMKM terdaftar</p>
            </div>
          </section>
        </Transition>

        <!-- ===== EVENT MENDELANG ===== -->
        <Transition name="fade-up">
          <section class="mt-10 mb-10">
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-2">
                <CalendarDays class="w-5 h-5 text-amber-600" />
                <h2 class="text-base font-bold text-slate-900">Event Mendatang</h2>
              </div>
              <router-link to="/events" class="text-xs font-semibold text-blue-600 hover:text-blue-700 transition">Lihat Semua →</router-link>
            </div>

            <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div v-for="n in 3" :key="n" class="bg-white rounded-xl overflow-hidden border border-slate-100 animate-pulse">
                <div class="h-36 bg-slate-200"></div>
                <div class="p-4 space-y-2">
                  <div class="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div class="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
              </div>
            </div>

            <div v-else-if="dashboard.upcoming_events?.length > 0" class="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div
                v-for="event in dashboard.upcoming_events"
                :key="event.id"
                @click="$router.push(`/events/${event.slug}`)"
                class="bg-white rounded-xl overflow-hidden border border-slate-100 cursor-pointer hover:shadow-md hover:border-slate-200 transition-all group"
              >
                <div class="relative h-32 bg-slate-100 overflow-hidden">
                  <img v-if="event.image" :src="event.image" :alt="event.title" class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                  <div v-else class="w-full h-full flex items-center justify-center text-slate-200"><CalendarDays class="w-8 h-8" /></div>
                  <div class="absolute top-2.5 right-2.5 bg-[#0f172a] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-md">
                    {{ event.status_label }}
                  </div>
                </div>
                <div class="p-4">
                  <h3 class="text-sm font-semibold text-slate-800 mb-1 truncate">{{ event.title }}</h3>
                  <p class="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar class="w-3 h-3" />
                    {{ formatDate(event.start_date) }}
                  </p>
                  <p v-if="event.destination" class="text-[11px] text-slate-400 truncate mt-0.5">{{ event.destination.name }}</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-10">
              <CalendarDays class="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p class="text-sm text-slate-400">Belum ada event mendatang</p>
            </div>
          </section>
        </Transition>

      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";
import {
  Compass,
  Building2,
  Plane,
  Package,
  CalendarDays,
  MapPin,
  Heart,
  UserCircle,
  Star,
  Calendar,
  Clock,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Store,
  ShoppingBag,
  MapPinned,
} from "lucide-vue-next";
import dayjs from "dayjs";
import api from "@/services/api";

import heroBg from "@/assets/images/batu.png";
import heroCard1 from "@/assets/images/batu.png";
import heroCard2 from "@/assets/images/angkut.png";
import heroCard3 from "@/assets/images/malang.png";

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const isLoading = ref(true);
const transportScroll = ref(null);

const dashboard = ref({
  user: null,
  wallet: null,
  recent_transactions: [],
  transport_deals: [],
  popular_hotels: [],
  destinations: [],
  upcoming_events: [],
  umkms: [],
});

// ===== GREETING =====
const greeting = computed(() => {
  const hour = dayjs().hour();
  if (hour < 11) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
});

// ===== MENU =====
const menus = [
  { label: "Explore", icon: Compass, bgColor: "bg-sky-100", iconColor: "text-sky-600", action: () => router.push("/explore") },
  { label: "Hotels", icon: Building2, bgColor: "bg-violet-100", iconColor: "text-violet-600", action: () => router.push("/hotels") },
  { label: "Tiket", icon: Plane, bgColor: "bg-emerald-100", iconColor: "text-emerald-600", action: () => router.push("/transport-tickets") },
  { label: "Paket", icon: Package, bgColor: "bg-rose-100", iconColor: "text-rose-600", action: () => router.push("/packages") },
  { label: "Events", icon: CalendarDays, bgColor: "bg-amber-100", iconColor: "text-amber-600", action: () => router.push("/events") },
  { label: "Booking", icon: Ticket, bgColor: "bg-cyan-100", iconColor: "text-cyan-600", action: () => requireAuth("/bookings") },
  { label: "Wishlist", icon: Heart, bgColor: "bg-pink-100", iconColor: "text-pink-600", action: () => requireAuth("/wishlist") },
  { label: "Profil", icon: UserCircle, bgColor: "bg-indigo-100", iconColor: "text-indigo-600", action: () => requireAuth("/profile") },
];

// ===== HELPERS =====
const requireAuth = (path) => {
  if (!authStore.isLoggedIn) {
    toast.error("Silakan login terlebih dahulu");
    router.push({ path: "/login", query: { redirect: path } });
    return;
  }
  router.push(path);
};

const formatRole = (role) => {
  const map = { tourist: 'Wisatawan', umkm: 'Pelaku UMKM', manager: 'Pengelola', admin: 'Administrator' };
  return map[role] || role;
};

const formatJoinDate = (date) => {
  if (!date) return "-";
  return dayjs(date).format("MMM YYYY");
};

const formatDate = (date) => dayjs(date).format("DD MMM YYYY");

const formatRupiah = (value) => {
  if (!value) return "Rp 0";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

const scrollTransport = (dir) => {
  transportScroll.value?.scrollBy({ left: dir * 220, behavior: "smooth" });
};

const goToTransportBook = (ticket) => {
  if (!authStore.isLoggedIn) {
    toast.error("Silakan login terlebih dahulu");
    router.push({ path: "/login", query: { redirect: router.currentRoute.value.fullPath } });
    return;
  }
  router.push({ name: "transport-ticket.book", query: { ticket_id: ticket.id, passengers: 1 } });
};

// ===== FETCH =====
const fetchDashboard = async () => {
  try {
    const res = await api.get("/api/dashboard");
    dashboard.value = res.data.data || dashboard.value;
  } catch (err) {
    console.error("Gagal fetch dashboard:", err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchDashboard);
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.fade-up-enter-active {
  transition: all 0.5s ease-out;
}

.fade-up-leave-active {
  transition: all 0.3s ease-in;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>