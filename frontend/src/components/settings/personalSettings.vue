<template>
  <section class="bg-white rounded-xl shadow p-6 space-y-4">
    <h2 class="text-lg font-semibold text-gray-700">Account Information</h2>
    <form @submit.prevent="saveChanges" class="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div>
        <label class="block text-sm text-gray-600">First Name</label>
        <input
          v-model="form.first_name"
          type="text"
          class="mt-1 w-full rounded-lg border-gray-300 p-1 border-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600">Last Name</label>
        <input
          v-model="form.last_name"
          type="text"
          class="mt-1 w-full rounded-lg border-gray-300 p-1 border-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm text-gray-600">Email</label>
        <input
          v-model="form.email"
          type="email"
          class="mt-1 w-full rounded-lg border-gray-300 p-1 border-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm text-gray-600">Phone Number</label>
        <input
          v-model="form.phone"
          type="tel"
          class="mt-1 w-full rounded-lg border-gray-300 p-1 border-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div class="md:col-span-2 flex justify-end mt-2">
        <button
          type="submit"
          class="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          :disabled="loading"
        >
          {{ loading ? "Saving..." : "Save Changes" }}
        </button>
      </div>
    </form>

    <p v-if="error" class="text-red-500">{{ error }}</p>
  </section>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/users";

const authStore = useAuthStore();
const userStore = useUserStore();

const form = reactive({
  first_name: authStore.user?.first_name || "",
  last_name: authStore.user?.last_name || "",
  email: authStore.user?.email || "",
  phone: authStore.user?.phone || "",
});

const loading = computed(() => userStore.loading);
const error = computed(() => userStore.error);

const saveChanges = async () => {
  await userStore.updateUser(authStore.user!.user_id!, { ...form });
};
</script>
