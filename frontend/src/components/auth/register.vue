<template>
  <div v-if="!companyStore.company" class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
      <!-- Title -->
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
        Register Company
      </h2>

      <form @submit.prevent="submitCompany" class="space-y-5">
        <!-- Company Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Tax ID -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tax ID</label>
          <input
            v-model="form.tax_id"
            type="text"
            required
            class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Industry Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Industry Type</label>
          <select
            v-model="form.industry_type"
            class="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select industry</option>
            <option value="IT">IT</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Retail">Retail</option>
          </select>
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            v-model="form.phone"
            type="tel"
            class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Headquarters Address -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Headquarters Address</label>
          <textarea
            v-model="form.headquarters_address"
            rows="3"
            class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>
        </div>

        <!-- Logo (optional string for now) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Company Logo (URL, optional)</label>
          <input
            v-model="form.logo"
            type="text"
            placeholder="https://example.com/logo.png"
            class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Register Company
        </button>
      </form>

      <!-- Error -->
      <p v-if="companyStore.error" class="mt-4 text-red-600 text-center">
        {{ companyStore.error }}
      </p>
    </div>
  </div>

  <!-- Load Register User if success -->
  <RegisterUser v-if="companyStore.company" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCompanyStore } from "@/stores/company";
import RegisterUser from "@/components/auth/registerUser.vue";

const companyStore = useCompanyStore();

const form = ref({
  name: "",
  tax_id: "",
  email: "",
  industry_type: "",
  phone: "",
  headquarters_address: "",
  logo: "", // ✅ now a string instead of File
});

const submitCompany = async () => {
  await companyStore.registerCompany(form.value);
};
</script>



