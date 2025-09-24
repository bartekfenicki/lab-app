<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- Left Panel (Auth Form) -->
    <div class="relative w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white shadow-lg z-10">
      <!-- Logo -->
      <div class="absolute top-6 left-6 flex items-center space-x-2">
        <img src="" alt="Logo" class="h-10 w-10" />
        <span class="text-xl font-bold text-gray-800">MyApp</span>
      </div>

      <!-- Login Form -->
      <div class="w-full max-w-md">
        <h2 class="text-3xl font-bold text-gray-800 mb-6">Welcome Back</h2>

        <form class="space-y-4" @submit.prevent="submitLogin">
          <div>
            <label class="block text-gray-600 mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-gray-600 mb-1">Password</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>

        <!-- Error Message -->
        <p v-if="authStore.error" class="text-red-600 text-center mt-2">
          {{ authStore.error }}
        </p>

        <!-- Register Redirect -->
        <p class="mt-4 text-center text-gray-600">
          Don’t have an account?
          <RouterLink to="/register" class="text-blue-600 hover:underline">Register</RouterLink>
        </p>
      </div>
    </div>

    <!-- Right Panel (Image & Text) -->
    <div class="hidden md:flex w-1/2 relative bg-blue-600 text-white overflow-hidden">
      <!-- Slant Shape -->
      <div
        class="absolute inset-y-0 left-0 w-24 bg-white transform -skew-x-12 -translate-x-1/2"
      ></div>

      <!-- Content -->
      <div class="flex flex-col justify-center items-center text-center px-12 relative z-10">
        <img
          src="https://source.unsplash.com/600x600/?technology,teamwork"
          alt="Auth Illustration"
          class="rounded-lg shadow-xl mb-6"
        />
        <h2 class="text-4xl font-bold mb-4">Manage your work smarter</h2>
        <p class="text-lg text-blue-100">
          Stay on top of your events, shifts, and projects all in one place.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

// Reactive form
const form = reactive({
  email: "",
  password: "",
});

// Submit handler
const submitLogin = async () => {
  const success = await authStore.loginUser(form);
  if (success) {
    console.log("Logged in user:", authStore.user);
    router.push("/"); // redirect to main page
  }
};
</script>

