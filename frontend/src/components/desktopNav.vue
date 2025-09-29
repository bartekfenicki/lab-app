<template>
  <nav class="bg-white shadow-md px-4 py-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      
      <!-- Lewa strona (logo + linki) -->
      <div class="flex items-center space-x-6">
        <!-- Logo -->
        <RouterLink to="/" class="text-2xl font-bold text-blue-600">LOGO</RouterLink>

        <!-- Linki desktop -->
        <div class="hidden md:flex space-x-10">
          <RouterLink 
            to="/" 
            class="text-gray-700 text-lg hover:text-blue-600 transition"
          >
            Dashboard
          </RouterLink>
          <RouterLink 
            to="/calendar" 
            class="text-gray-700 text-lg hover:text-blue-600 transition"
          >
            Calendar
          </RouterLink>
          <RouterLink 
            to="/events" 
            class="text-gray-700 text-lg hover:text-blue-600 transition"
          >
            Events
          </RouterLink>
          <RouterLink 
            to="/news" 
            class="text-gray-700 text-lg hover:text-blue-600 transition"
          >
            News
          </RouterLink>
        </div>
        <CompanyStatus/>
      </div>

      <!-- Prawa strona (profile + settings) -->
      <div class="flex items-center space-x-4">
        <div class="relative flex items-center">
          <authStatus />
    <!-- Ikona profilu -->
    <button @click="toggleMenu" class="focus:outline-none">
      <img
        :src="authStore.user?.profilepic"
        alt="Profile"
        class="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-blue-600 transition"
      />
    </button>

    <!-- Menu rozwijane -->
    <transition name="fade">
      <div
        v-if="menuOpen"
        class="absolute top-0 right-0 mt-16 w-48 bg-white shadow-lg rounded-lg py-2 z-50"
      >
        <RouterLink
          to="/profile"
          class="block px-4 py-2 text-gray-700 hover:bg-blue-100 transition"
          @click="menuOpen = false"
        >
          Profile
        </RouterLink>
        <RouterLink
          to="/settings"
          class="block px-4 py-2 text-gray-700 hover:bg-blue-100 transition"
          @click="menuOpen = false"
        >
          Settings
        </RouterLink>
        <RouterLink
          to="/hours"
          class="block px-4 py-2 text-gray-700 hover:bg-blue-100 transition"
          @click="menuOpen = false"
        >
          Hours
        </RouterLink>
        <RouterLink
          to="/availability"
          class="block px-4 py-2 text-gray-700 hover:bg-blue-100 transition"
          @click="menuOpen = false"
        >
          Availability
        </RouterLink>
        <RouterLink
          v-if="authStore.user && [1, 2].includes(authStore.user.role_id)"
          to="/admin"
          class="block px-4 py-2 text-gray-700 hover:bg-blue-100 transition"
          @click="menuOpen = false"
        >
          Admin Panel
        </RouterLink>
        <LogoutButton class="mx-auto my-2 block"/>
      </div>
    </transition>
  </div>
      </div>

    </div>

    <!-- Mobile menu -->
    <div class="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 shadow-inner flex justify-around py-2">
        <RouterLink to="/" class="flex flex-col items-center text-gray-700 hover:text-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l9-9 9 9M4 10v10h16V10" />
        </svg>
        <span class="text-xs">Home</span>
        </RouterLink>

        <RouterLink to="/calendar" class="flex flex-col items-center text-gray-700 hover:text-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z" />
        </svg>
        <span class="text-xs">Calendar</span>
        </RouterLink>

        <RouterLink to="/events" class="flex flex-col items-center text-gray-700 hover:text-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-6h6v6M3 7h18M5 7v14h14V7H5z" />
        </svg>
        <span class="text-xs">Events</span>
        </RouterLink>

        <RouterLink to="/news" class="flex flex-col items-center text-gray-700 hover:text-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-3 2 3h4a2 2 0 012 2v12a2 2 0 01-2 2z" />
        </svg>
        <span class="text-xs">News</span>
        </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue'
import authStatus from './auth/authStatus.vue';
import LogoutButton from './auth/logoutButton.vue';
import CompanyStatus from './auth/companyStatus.vue';
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
}

console.log(authStore.user)

document.addEventListener("click", (e) => {
  const menu = document.querySelector(".relative");
  if (menu && !menu.contains(e.target)) {
    menuOpen.value = false;
  }
});
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
