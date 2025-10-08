<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Users</h2>
      <button
        @click="showModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Add User
      </button>
    </div>

    <!-- Users Table -->
    <table class="w-full border rounded-lg shadow-sm">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 text-left">Name</th>
          <th class="p-2 text-left">Email</th>
          <th class="p-2 text-left">Phone</th>
          <th class="p-2 text-left">Role</th>
          <th class="p-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in userStore.users.filter(u => u.company_id === companyStore.company?.company_id)"
          :key="user.user_id"
          class="border-t"
        >
          <td class="p-2">{{ user.first_name }} {{ user.last_name }}</td>
          <td class="p-2">{{ user.email }}</td>
          <td class="p-2">{{ user.phone }}</td>
          <td class="p-2">
            {{ roleName(user.role_id) }}
          </td>
          <td class="p-2 text-right">
           <button
            v-if="canDeleteUser(user)"
            @click="confirmDeleteUser(user.user_id)"
            class="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
          <span v-else class="text-gray-400 text-sm">
            Cannot delete this user
          </span>
          </td>
        </tr>
      </tbody>
    </table>

  <!-- delete cofirm modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h3 class="text-lg font-bold mb-4">Confirm Deletion</h3>
        <p class="mb-6">Are you sure you want to delete this user permanently?</p>
        <div class="flex justify-end space-x-4">
          <button
            @click="cancelDelete"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="deleteUserConfirmed"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Add New User</h3>

        <form @submit.prevent="createUser" class="space-y-3">
          <input v-model="firstName" placeholder="First Name" class="w-full p-2 border rounded" />
          <input v-model="lastName" placeholder="Last Name" class="w-full p-2 border rounded" />
          <input v-model="email" placeholder="Email" class="w-full p-2 border rounded" />
          <input v-model="phone" placeholder="Phone" class="w-full p-2 border rounded" />

          <!-- Roles Dropdown -->
          <select v-model="roleId" class="w-full p-2 border rounded">
            <option v-for="role in allRoles" :key="role.role_id" :value="role.role_id">
              {{ role.name }}
            </option>
          </select>

          <div class="flex justify-end space-x-2">
            <button type="button" @click="showModal = false" class="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Create
            </button>
          </div>
        </form>

          <!-- Show generated password -->
    <div v-if="generatedPassword" class="mt-4">
      <p class="font-semibold">Generated Password:</p>
      <div class="flex justify-between items-center bg-gray-100 p-2 rounded">
        <span>{{ generatedPassword }}</span>
        <button @click="generatedPassword = ''" class="text-blue-500 text-sm">Hide</button>
      </div>
    </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/users";
import { useRoleStore } from "@/stores/roles";
import { useCompanyStore } from "@/stores/company";
import { useAuthStore } from "@/stores/auth";
import { computed } from "vue";

const userStore = useUserStore();
const roleStore = useRoleStore();
const companyStore = useCompanyStore();
const authStore = useAuthStore();

const showModal = ref(false);
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const phone = ref("");
const roleId = ref<number | null>(null);

const generatedPassword = ref("");

// ✅ Load users & roles
onMounted(async () => {
  await userStore.fetchUsers();
  if (companyStore.company) {
    await roleStore.fetchRolesByCompany(companyStore.company.company_id);
    await roleStore.fetchDefaultRoles();
  }
});

// ✅ Generate random password
const generateRandomPassword = (length = 10) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

// ✅ Create new user
const createUser = async () => {
  if (!companyStore.company || !roleId.value) return;

  // Generate password
  generatedPassword.value = generateRandomPassword();

  // Call store to create user
  const success = await userStore.createUser({
    first_name: firstName.value,
    last_name: lastName.value,
    email: email.value,
    phone: phone.value,
    role_id: roleId.value,
    company_id: companyStore.company.company_id,
    password_hash: generatedPassword.value // backend will hash it
  });

  if (success) {
    // Clear form (except password which is shown)
    firstName.value = "";
    lastName.value = "";
    email.value = "";
    phone.value = "";
    roleId.value = null;
  } else {
    generatedPassword.value = "";
  }
};

const userToDelete = ref<number | null>(null);
const showDeleteConfirm = ref(false);

const confirmDeleteUser = (userId: number) => {
  userToDelete.value = userId;
  showDeleteConfirm.value = true;
};

const cancelDelete = () => {
  userToDelete.value = null;
  showDeleteConfirm.value = false;
};

const deleteUserConfirmed = async () => {
  if (userToDelete.value !== null) {
    await userStore.deleteUser(userToDelete.value);
    userToDelete.value = null;
    showDeleteConfirm.value = false;
  }
};



const canDeleteUser = (user: any) => {
  const currentUser = authStore.user;
  if (!currentUser) return false;

  // Admin can delete anyone
  if (currentUser.role_id === 1) return true;

  // Non-admin cannot delete admin or manager
  if (user.role_id === 1 || user.role_id === 2) return false;

  // Everyone else can be deleted
  return true;
};

const roleName = (roleId: number) => {
  const role =
    roleStore.defaultRoles.find(r => r.role_id === roleId) ||
    roleStore.roles.find(r => r.role_id === roleId);
  return role ? role.name : "Unknown";
};

const allRoles = computed(() => [
  ...roleStore.defaultRoles,
  ...roleStore.roles,
]);
</script>

