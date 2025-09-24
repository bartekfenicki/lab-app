<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Role Management</h2>
    
    <!-- Create New Role -->
    <div class="mt-6 border-t pt-4">
      <h3 class="text-lg font-semibold mb-2">Create New Role</h3>
      <form @submit.prevent="createRole" class="space-y-3">
        <input
          v-model="newRoleName"
          type="text"
          placeholder="Role name"
          class="w-full px-4 py-2 border rounded-lg"
        />
        <input
          v-model="newRolePermissions"
          type="text"
          placeholder="Permissions (comma separated)"
          class="w-full px-4 py-2 border rounded-lg"
        />
        <button
          type="submit"
          class="px-4 py-2 block ms-auto me-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Role
        </button>
      </form>
    </div>

    <!-- Default Roles -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-2">Default Roles</h3>
      <ul class="space-y-2">
        <li
          v-for="role in roleStore.defaultRoles"
          :key="role.role_id"
          class="p-3 bg-gray-100 rounded-lg shadow-sm flex justify-between"
        >
          <span>{{ role.name }}</span>
          <span class="text-sm text-gray-500">({{ role.permissions }})</span>
        </li>
      </ul>
    </div>

   <!-- Custom Roles -->
<div>
  <h3 class="text-lg font-semibold mb-2">Custom Roles</h3>
  <ul class="space-y-2">
    <li
      v-for="role in roleStore.roles.filter(r => r.company_id === companyStore.company?.company_id)"
      :key="role.role_id"
      class="p-3 bg-gray-100 rounded-lg shadow-sm flex justify-between items-center"
    >
      <div>
        <span>{{ role.name }}</span>
        <span class="text-sm text-gray-500">({{ role.permissions }})</span>
      </div>
      <button
        @click="deleteRole(role.role_id)"
        class="text-red-500 hover:text-red-700 text-sm font-medium"
      >
        Delete
      </button>
    </li>
  </ul>
</div>

  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoleStore } from "@/stores/roles";
import { useCompanyStore } from "@/stores/company";

const roleStore = useRoleStore();
const companyStore = useCompanyStore();

const newRoleName = ref("");
const newRolePermissions = ref("");

// ✅ Load default + custom roles on mount
onMounted(async () => {
  await roleStore.fetchDefaultRoles(); // loads company_id = 1
  if (companyStore.company) {
    await roleStore.fetchRolesByCompany(companyStore.company.company_id);
  }
});

// ✅ Create new role
const createRole = async () => {
  if (!newRoleName.value || !companyStore.company) return;

  await roleStore.createRole({
    company_id: companyStore.company.company_id,
    name: newRoleName.value,
    permissions: newRolePermissions.value || "basic", // fallback
  });

  // reset form
  newRoleName.value = "";
  newRolePermissions.value = "";
};

const deleteRole = async (roleId: number) => {
  await roleStore.deleteRole(roleId);
};
</script>