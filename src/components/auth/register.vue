<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <img src="" alt="Logo" class="h-12" />
      </div>

      <!-- Title -->
      <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
        Register Company
      </h2>

      <!-- Form -->
      <form class="space-y-5">
        <!-- Company Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            type="text"
            placeholder="Enter company name"
            class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Registration Number / Tax ID -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Company Registration Number / Tax ID</label>
          <input
            type="text"
            placeholder="Enter registration number"
            class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Industry Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Industry Type</label>
          <select
            class="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select industry</option>
            <option value="it">Information Technology</option>
            <option value="health">Healthcare</option>
            <option value="finance">Finance</option>
            <option value="education">Education</option>
            <option value="retail">Retail</option>
          </select>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Company Email Address</label>
          <input
            type="email"
            placeholder="example@company.com"
            class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Company Phone Number</label>
          <input
            type="tel"
            placeholder="+1 234 567 890"
            class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Headquarters Address -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Headquarters Address</label>
          <textarea
            rows="3"
            placeholder="Enter full address"
            class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>
        </div>

        <!-- Company Logo -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Company Logo (optional)</label>
          <input
            type="file"
            accept="image/*"
            class="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
                   file:rounded-lg file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-600
                   hover:file:bg-blue-100"
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
    </div>
  </div>
</template>

<script setup lang="ts">
// here later you’ll bind inputs with v-model and submit handler
</script>
