<template>
  <section class="bg-white rounded-xl shadow p-6 space-y-4">
    <h2 class="text-lg font-semibold text-gray-700">Personal Information</h2>

    <form @submit.prevent="updatePersonalInfo" class="space-y-4">
      <!-- Profile Picture Preview -->
      <div class="flex items-center space-x-4">
        <img
          :src="previewUrl || authStore.user?.profilepic || 'https://via.placeholder.com/100'"
          alt="Profile Picture"
          class="w-20 h-20 rounded-full border shadow"
        />
        <input type="file" @change="onFileChange" />
      </div>

      <!-- First Name -->
      <div>
        <label class="block text-sm text-gray-600">First Name</label>
        <input
          v-model="form.first_name"
          type="text"
          class="mt-1 w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Last Name -->
      <div>
        <label class="block text-sm text-gray-600">Last Name</label>
        <input
          v-model="form.last_name"
          type="text"
          class="mt-1 w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm text-gray-600">Email</label>
        <input
          v-model="form.email"
          type="email"
          class="mt-1 w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Phone -->
      <div>
        <label class="block text-sm text-gray-600">Phone</label>
        <input
          v-model="form.phone"
          type="tel"
          class="mt-1 w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div class="flex justify-end">
        <button
          type="submit"
          class="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          :disabled="loading"
        >
          {{ loading ? "Updating..." : "Save Changes" }}
        </button>
      </div>
    </form>

    <p v-if="successMessage" class="text-green-600">{{ successMessage }}</p>
    <p v-if="error" class="text-red-500">{{ error }}</p>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useUserStore } from "@/stores/users";
import { useAuthStore } from "@/stores/auth";

const userStore = useUserStore();
const authStore = useAuthStore();

const form = reactive({
  first_name: authStore.user?.first_name || "",
  last_name: authStore.user?.last_name || "",
  email: authStore.user?.email || "",
  phone: authStore.user?.phone || "",
});

const file = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const successMessage = ref("");

const loading = computed(() => userStore.loading);
const error = computed(() => userStore.error);

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    file.value = target.files[0];
    previewUrl.value = URL.createObjectURL(file.value);
  }
};

const updatePersonalInfo = async () => {
  const formData = new FormData();
  formData.append("first_name", form.first_name);
  formData.append("last_name", form.last_name);
  formData.append("email", form.email);
  formData.append("phone", form.phone || "");
  if (file.value) {
    formData.append("profilepic", file.value);
  }

  await userStore.updateUserWithFormData(authStore.user!.user_id, formData);

  if (!userStore.error) {
    successMessage.value = "Profile updated successfully!";
    authStore.restoreSession(); // refresh session to get latest data
  }
};
</script>

