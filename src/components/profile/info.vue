<template>
  <main class="px-4 py-6 sm:px-6 lg:px-8 bg-gray-100 min-h-screen">
    <div class="max-w-3xl mx-auto space-y-6">

      <!-- Profile Header -->
      <div class="bg-white shadow rounded-xl p-6 flex flex-col sm:flex-row items-center sm:items-start sm:justify-between">
        <div class="flex items-center space-x-4">
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="Profile Avatar"
            class="w-20 h-20 rounded-full border shadow"
          />
          <div>
            <h2 class="text-2xl font-bold text-gray-900">John Doe</h2>
            <p class="text-gray-600 text-sm">Employee</p>
          </div>
        </div>
        <RouterLink
          to="/settings"
          class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          ⚙ Settings
        </RouterLink>
      </div>

      <!-- Personal Info -->
      <div class="bg-white shadow rounded-xl p-6">
        <h3 class="text-lg font-semibold mb-4">Personal Information</h3>
        <ul class="space-y-3 text-gray-700">
          <li class="flex justify-between">
            <span class="font-medium">First Name:</span> <span>John</span>
          </li>
          <li class="flex justify-between">
            <span class="font-medium">Last Name:</span> <span>Doe</span>
          </li>
          <li class="flex justify-between">
            <span class="font-medium">Phone:</span> <span>+123 456 789</span>
          </li>
          <li class="flex justify-between">
            <span class="font-medium">Email:</span> <span>john.doe@email.com</span>
          </li>
        </ul>
      </div>

      <!-- Quick Settings -->
      <div class="bg-white shadow rounded-xl p-6">
        <h3 class="text-lg font-semibold mb-4">Quick Settings</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-700">Enable Notifications</span>
            <input type="checkbox" class="toggle-checkbox" />
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-700">Dark Mode</span>
            <input type="checkbox" class="toggle-checkbox" />
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup lang="ts">
// later you could bind these checkboxes to user preferences
</script>

<style scoped>
/* Simple toggle switch style */
.toggle-checkbox {
  width: 40px;
  height: 20px;
  appearance: none;
  background: #d1d5db;
  border-radius: 9999px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
}
.toggle-checkbox:checked {
  background: #2563eb;
}
.toggle-checkbox:before {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  transition: transform 0.3s;
}
.toggle-checkbox:checked:before {
  transform: translateX(20px);
}
</style>
