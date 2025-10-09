<template>
<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Company Users</h1>

    <div
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div 
        v-for="user in userStore.users.filter(u => u.company_id === authStore.user?.company_id)"
        :key="user.user_id"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between"
      >
        <!-- Header -->
        <div>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-800">
              {{ user.first_name }} {{ user.last_name }}
            </h2>
            <span
              class="text-xs font-medium px-2 py-1 rounded-full"
              :class="roleBadgeColor(user.role_id)"
            >
              {{ roleName(user.role_id) }}
            </span>
          </div>

          <!-- Contact Info -->
          <div class="mt-3 text-gray-600 space-y-1">
            <p class="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0V8a4 4 0 00-8 0v4a4 4 0 008 0z" />
              </svg>
              {{ user.email }}
            </p>

            <p class="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 5a2 2 0 012-2h2a2 2 0 012 2v1h6V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2v-1H9v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
              </svg>
              {{ user.phone || 'No phone number' }}
            </p>
          </div>
        </div>

        <!-- Optional Footer (Actions, etc.) -->
        <div class="mt-4 flex justify-end">
          <button
            class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            View Profile →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


</template>
<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { useRoleStore } from "@/stores/roles";
import { useUserStore } from "@/stores/users";
import { computed, onMounted } from "vue";

const authStore = useAuthStore();
const userStore = useUserStore();
const roleStore = useRoleStore();

onMounted(  ()=> {
    userStore.fetchUsers();
    roleStore.fetchDefaultRoles();
})

console.log(authStore.user)
console.log(userStore.users.filter(u => u.company_id === authStore.user?.company_id))

const roleName = (roleId: number) => {
  const role =
    roleStore.defaultRoles.find(r => r.role_id === roleId) ||
    roleStore.roles.find(r => r.role_id === roleId);
  return role ? role.name : "Unknown";
};


const roleBadgeColor = (roleId: number) => {
  switch (roleId) {
    case 1:
      return "bg-red-100 text-red-700";
    case 2:
      return "bg-yellow-100 text-yellow-700";
    case 3:
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};
</script>