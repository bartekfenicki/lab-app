<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
      <!-- Title -->
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
        Register Admin User
      </h2>

      <!-- Form -->
      <form class="space-y-5" @submit.prevent="submitUser">
        <!-- First Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            v-model="form.first_name"
            type="text"
            placeholder="Enter first name"
            class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Last Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            v-model="form.last_name"
            type="text"
            placeholder="Enter last name"
            class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            v-model="form.phone"
            type="text"
            placeholder="+48 222 333 444"
            class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="example@company.com"
            class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="form.password_hash"
            type="password"
            placeholder="Enter password"
            class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Register User
        </button>

        <!-- Error Message -->
        <p v-if="authStore.error" class="text-red-600 text-center mt-2">
          {{ authStore.error }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  first_name: "",
  last_name: "",
  email: "",
  password_hash: "",
  phone: ""
});

const submitUser = async () => {
  const success = await authStore.registerFirstUser(form);
  if (success) {
    router.push("/"); // redirect to home
  }
};
</script>
