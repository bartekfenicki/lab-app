<template>
  <div class="max-w-4xl mx-auto p-6 space-y-8">
    <div class="flex justify-between items-center border-b pb-4">
      <h1 class="text-2xl font-bold text-gray-800">User Settings</h1>
      <RouterLink to="/profile" class="text-blue-600 hover:underline text-sm">
        ← Back to Profile
      </RouterLink>
    </div>

    <PersonalInfoSettings />
    <ChangePassword />
  </div>
</template>

<script setup lang="ts">
import PersonalInfoSettings from "./personalSettings.vue";
import ChangePassword from "./changePassword.vue";
</script>
