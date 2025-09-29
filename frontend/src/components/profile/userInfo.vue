<template>
  <div class="bg-white shadow rounded-xl p-6">
    <h3 class="text-lg font-semibold mb-4">Personal Information</h3>
    <ul class="space-y-3 text-gray-700">
      <li class="flex justify-between">
        <span class="font-medium">First Name:</span>
        <span>{{ user?.first_name }}</span>
      </li>
      <li class="flex justify-between">
        <span class="font-medium">Last Name:</span>
        <span>{{ user?.last_name }}</span>
      </li>
      <li class="flex justify-between">
        <span class="font-medium">Phone:</span>
        <span>{{ user?.phone || "Not set" }}</span>
      </li>
      <li class="flex justify-between">
        <span class="font-medium">Email:</span>
        <span>{{ user?.email }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const user = computed(() => authStore.user);
</script>
