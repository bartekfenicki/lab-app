<template>
  <div class="mx-4 rounded-lg">
    <!-- Loading -->
    <p v-if="auth.loading" class="text-blue-600">Loading...</p>

    <!-- Error -->
    <p v-else-if="auth.error" class="text-red-600">Error: {{ auth.error }}</p>

    <!-- Logged in -->
    <div v-else-if="auth.user" class="text-green-700 font-semibold">
      <span class="font-bold">{{ auth.user.first_name }} {{ auth.user.last_name }}</span>
    </div>

    <!-- Not logged in -->
    <p v-else class="text-gray-600"> Not logged in</p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
</script>
