<template>
  <div class="min-h-screen bg-slate-100 flex">
    <!-- Sidebar akan dibuat nanti -->
    <aside class="w-64 bg-slate-900 text-white flex items-center justify-center">
      <span class="font-bold text-slate-400">Sidebar</span>
    </aside>

    <main class="flex-1 p-8">
      <router-view />
    </main>
  </div>
</template>