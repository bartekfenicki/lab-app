<template>
  <button
    v-if="authStore.user"
    @click="logout"
    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
  >
    Logout
  </button>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logoutUser();
  router.push("/auth");
};
</script>
