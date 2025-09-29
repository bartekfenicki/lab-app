<template>
  <main class="px-4 py-6 sm:px-6 lg:px-8 bg-gray-100 min-h-screen">
    <div class="max-w-3xl mx-auto space-y-6">

      <!-- Profile Header -->
      <div class="bg-white shadow rounded-xl p-6 flex flex-col sm:flex-row items-center sm:items-start sm:justify-between">
        <div class="flex items-center space-x-4">
          <img
            :src="avatarUrl"
            alt="Profile Avatar"
            class="w-20 h-20 rounded-full border shadow"
          />
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ user?.first_name }} {{ user?.last_name }}</h2>
            <p class="text-gray-600 text-sm">{{ roleName(user.role_id) }}</p>
          </div>
        </div>
        <RouterLink
          to="/settings"
          class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          ⚙ Settings
        </RouterLink>
      </div>

      <!-- User Personal Info -->
      <UserPersonalInfo />

      <!-- Company Info -->
      <CompanyInfo />

    </div>
  </main>
</template>

<script setup lang="ts">
import UserPersonalInfo from "./userInfo.vue";
import CompanyInfo from "./companyInfo.vue";
import { useAuthStore } from "@/stores/auth";
import { useRoleStore } from "@/stores/roles";
import { onMounted } from "vue";

const authStore = useAuthStore();
const user = authStore.user;
const roleStore = useRoleStore();

onMounted(async () => {
    await roleStore.fetchDefaultRoles();
});


// Mock role mapping, replace with dynamic logic if needed
const roleName = (roleId: number) => {
  const role =
    roleStore.defaultRoles.find(r => r.role_id === roleId) ||
    roleStore.roles.find(r => r.role_id === roleId);
  return role ? role.name : "Unknown";
};

// Placeholder avatar
const avatarUrl = "https://i.pravatar.cc/150?img=12";
</script>
