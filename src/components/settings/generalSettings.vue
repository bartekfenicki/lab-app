<template>
  <div class="max-w-4xl mx-auto p-6 space-y-8">
    <!-- Page Header -->
    <div class="flex justify-between items-center border-b pb-4">
      <h1 class="text-2xl font-bold text-gray-800">User Settings</h1>
      <RouterLink
        to="/profile"
        class="text-blue-600 hover:underline text-sm"
      >
        ← Back to Profile
      </RouterLink>
    </div>

    <!-- Account Information -->
    <section class="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 class="text-lg font-semibold text-gray-700">Account Information</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-600">First Name</label>
          <input
            type="text"
            placeholder="John"
            class="mt-1 w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm text-gray-600">Last Name</label>
          <input
            type="text"
            placeholder="Doe"
            class="mt-1 w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm text-gray-600">Email</label>
          <input
            type="email"
            placeholder="john.doe@example.com"
            class="mt-1 w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm text-gray-600">Phone Number</label>
          <input
            type="tel"
            placeholder="+1 234 567 890"
            class="mt-1 w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </section>

    <!-- Preferences -->
    <section class="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 class="text-lg font-semibold text-gray-700">Preferences</h2>

      <div class="flex items-center justify-between">
        <span class="text-gray-600">Dark Mode</span>
        <input type="checkbox" class="toggle-checkbox h-5 w-5 text-blue-600" />
      </div>

      <div class="flex items-center justify-between">
        <span class="text-gray-600">Email Notifications</span>
        <input type="checkbox" class="toggle-checkbox h-5 w-5 text-blue-600" />
      </div>
    </section>

    <!-- Security -->
    <section class="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 class="text-lg font-semibold text-gray-700">Security</h2>

      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <p class="font-medium text-gray-800">Password</p>
          <p class="text-sm text-gray-500">Last changed 2 months ago</p>
        </div>
        <button
          class="mt-3 md:mt-0 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Change Password
        </button>
      </div>
    </section>

    <!-- Save Button -->
    <div class="flex justify-end">
      <button
        class="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
      >
        Save Changes
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// later you can bind real user data here
</script>
