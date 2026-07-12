import { createRouter, createWebHistory } from "vue-router";
import { createToastInterface } from "vue-toastification";
import { useAuthStore } from "@/stores/auth";

import AppLayout from "@/components/layout/AppLayout.vue";
import DashboardLayout from "@/components/layout/DashboardLayout.vue";

import Home from "@/pages/Home.vue";
import Login from "@/pages/auth/Login.vue";
import Register from "@/pages/auth/Register.vue";
import Explore from "@/pages/destination/Explore.vue";
import DestinationDetail from "@/pages/destination/Detail.vue";
import EventList from "@/pages/event/List.vue";
import EventDetail from "@/pages/event/Detail.vue";
import Wishlist from "@/pages/wishlist/Index.vue";
import MyOrders from "@/pages/order/MyOrders.vue";
import OrderDetail from "@/pages/order/Detail.vue";
import Wallet from "@/pages/wallet/Index.vue";
import TripPlanner from "@/pages/trip/Planner.vue";
import MyTrips from "@/pages/trip/MyTrips.vue";
import UmkmList from "@/pages/umkm/List.vue";
import UmkmDetail from "@/pages/umkm/Detail.vue";
import Checkout from "@/pages/order/Checkout.vue";
import UmkmDashboard from "@/pages/dashboard/umkm/Dashboard.vue";
import AdminDashboard from "@/pages/dashboard/admin/Dashboard.vue";

const toast = createToastInterface({
  position: "top-right",
  timeout: 3000,
});

const routes = [
  {
    path: "/",
    component: AppLayout,
    children: [
      { path: "", name: "home", component: Home },
      { path: "explore", name: "explore", component: Explore },
      {
        path: "destination/:slug",
        name: "destination.detail",
        component: DestinationDetail,
      },
      { path: "events", name: "events", component: EventList },
      { path: "events/:slug", name: "event.detail", component: EventDetail },
      {
        path: "destinations/:destinationSlug/umkms",
        name: "umkm.by-destination",
        component: UmkmList,
      },
      { path: "umkms/:slug", name: "umkm.detail", component: UmkmDetail },

      // Auth
      {
        path: "login",
        name: "login",
        component: Login,
        meta: { guestOnly: true },
      },
      {
        path: "register",
        name: "register",
        component: Register,
        meta: { guestOnly: true },
      },

      // Protected
      {
        path: "wishlist",
        name: "wishlist",
        component: Wishlist,
        meta: { requiresAuth: true },
      },
      {
        path: "orders",
        name: "orders",
        component: MyOrders,
        meta: { requiresAuth: true },
      },
      {
        path: "orders/:id",
        name: "order.detail",
        component: OrderDetail,
        meta: { requiresAuth: true },
      },
      {
        path: "wallet",
        name: "wallet",
        component: Wallet,
        meta: { requiresAuth: true },
      },
      {
        path: "plan-trip",
        name: "trip.planner",
        component: TripPlanner,
        meta: { requiresAuth: true },
      },
      {
        path: "my-trips",
        name: "my.trips",
        component: MyTrips,
        meta: { requiresAuth: true },
      },
      {
        path: "checkout",
        name: "checkout",
        component: Checkout,
        meta: { requiresAuth: true },
      },
      {
        path: "profile",
        name: "profile",
        component: () => import("@/pages/auth/Profile.vue"),
        meta: { requiresAuth: true },
      },
      // Hotels
      {
        path: "hotels",
        name: "hotels",
        component: () => import("@/pages/hotel/List.vue"),
      },
      {
        path: "hotels/:slug",
        name: "hotel.detail",
        component: () => import("@/pages/hotel/Detail.vue"),
      },

      // Transportations
      {
        path: "transportations",
        name: "transportations",
        component: () => import("@/pages/transportation/List.vue"),
      },
      {
        path: "transportations/:slug",
        name: "transportation.detail",
        component: () => import("@/pages/transportation/Detail.vue"),
      },

      // Travel Packages
      {
        path: "packages",
        name: "packages",
        component: () => import("@/pages/package/List.vue"),
      },
      {
        path: "packages/:slug",
        name: "package.detail",
        component: () => import("@/pages/package/Detail.vue"),
      },

      // Bookings
      {
        path: "bookings",
        name: "bookings",
        component: () => import("@/pages/booking/Index.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "bookings/:bookingNumber",
        name: "booking.detail",
        component: () => import("@/pages/booking/Detail.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "transport-tickets",
        name: "transport-tickets",
        component: () => import("@/pages/transport-ticket/Search.vue"),
      },
      {
        path: "transport-tickets/book",
        name: "transport-ticket.book",
        component: () => import("@/pages/transport-ticket/Book.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/dashboard/umkm",
    component: DashboardLayout,
    meta: { requiresAuth: true, role: "umkm" },
    children: [{ path: "", name: "umkm.dashboard", component: UmkmDashboard }],
  },
  {
    path: "/dashboard/admin",
    component: DashboardLayout,
    meta: { requiresAuth: true, role: "admin" },
    children: [
      { path: "", name: "admin.dashboard", component: AdminDashboard },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.user && !to.meta.guestOnly) {
    try {
      await authStore.fetchUser();
    } catch {
      // Ignore, biar halaman tetap load
    }
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    toast.error("Silakan login terlebih dahulu untuk membuka menu ini.");
    return next({ name: "login", query: { redirect: to.fullPath } });
  }

  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return next({ name: "home" });
  }

  if (to.meta.role && authStore.user?.role !== to.meta.role) {
    return next({ name: "home" });
  }

  next();
});

export default router;
