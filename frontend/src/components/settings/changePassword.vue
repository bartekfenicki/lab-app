<template>
  <section class="bg-white rounded-xl shadow p-6 space-y-4">
    <h2 class="text-lg font-semibold text-gray-700">Change Password</h2>
    <form @submit.prevent="changePassword" class="space-y-4">

      <div>
        <label class="block text-sm text-gray-600">Current Password</label>
        <input
          v-model="form.current_password"
          type="password"
          class="mt-1 w-full rounded-lg border-gray-300 p-1 border-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600">New Password</label>
        <input
          v-model="form.new_password"
          type="password"
          class="mt-1 w-full rounded-lg border-gray-300 p-1 border-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600">Confirm New Password</label>
        <input
          v-model="form.confirm_password"
          type="password"
          class="mt-1 w-full rounded-lg border-gray-300 p-1 border-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div class="flex justify-end">
        <button
          type="submit"
          class="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          :disabled="loading"
        >
          {{ loading ? "Updating..." : "Change Password" }}
        </button>
      </div>

    </form>

    <p v-if="error" class="text-red-500">{{ error }}</p>
    <p v-if="success" class="text-green-500">{{ success }}</p>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { useUserStore } from "@/stores/users";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const userStore = useUserStore();

const form = reactive({
  current_password: "",
  new_password: "",
  confirm_password: "",
});

const success = ref<string | null>(null);

const loading = computed(() => userStore.loading);
const error = computed(() => userStore.error);

const changePassword = async () => {
  success.value = null; // reset previous success message
  if (form.new_password !== form.confirm_password) {
    userStore.error = "Passwords do not match!";
    return;
  }

  const updated = await userStore.updateUser(authStore.user!.user_id!, {
    password_hash: form.new_password, // hashed on backend
  });

  if (updated) {
    success.value = "Password has been changed successfully!";
    form.current_password = "";
    form.new_password = "";
    form.confirm_password = "";
  }
};
</script>

