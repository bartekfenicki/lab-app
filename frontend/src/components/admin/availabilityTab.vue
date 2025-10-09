<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center border-b pb-4">
      <h1 class="text-2xl font-bold text-gray-800">Team Availability</h1>

      <div class="flex space-x-2">
        <button @click="prevMonth" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          Prev
        </button>
        <span class="px-4 font-medium">
          {{ monthNames[currentMonth] }} {{ currentYear }}
        </span>
        <button @click="nextMonth" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          Next
        </button>
      </div>
    </div>

    <!-- User List -->
    <div v-for="user in companyUsers" :key="user.user_id" class="border rounded-lg">
      <button
        class="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-left"
        @click="toggleExpand(user.user_id)"
      >
        <div class="flex flex-col">
          <span class="font-medium text-gray-800">{{ user.first_name }} {{ user.last_name }}</span>
        </div>
        <span>
          <svg
            v-if="expandedUsers.includes(user.user_id)"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 transform rotate-180 transition"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"
              clip-rule="evenodd" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 transition"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fill-rule="evenodd"
              d="M14.77 12.79a.75.75 0 01-1.06-.02L10 9.06 6.29 12.77a.75.75 0 11-1.06-1.06l4.24-4.24a.75.75 0 011.06 0l4.24 4.24a.75.75 0 01-.02 1.08z"
              clip-rule="evenodd" />
          </svg>
        </span>
      </button>

      <!-- Expanded Availability -->
      <transition name="fade">
        <div v-if="expandedUsers.includes(user.user_id)" class="p-4 bg-white">
          <div class="grid grid-cols-7 text-center font-medium text-gray-600 mb-2">
            <div v-for="d in weekDays" :key="d">{{ d }}</div>
          </div>

          <div class="grid grid-cols-7 gap-2">
            <div v-for="n in firstDayOfMonth" :key="'empty-' + n" class="h-16"></div>

            <div
              v-for="day in daysInMonth"
              :key="day"
              class="flex flex-col justify-center items-center border rounded relative h-16"
              :class="calendarCellClass(user.user_id, day)"
            >
              <span class="font-medium">{{ day }}</span>
              <small v-if="availabilityStatus(user.user_id, day) === 'available'">Available</small>
              <small v-else-if="availabilityStatus(user.user_id, day) === 'unavailable'">Unavailable</small>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/users";
import { useAuthStore } from "@/stores/auth";
import { useAvailabilityStore } from "@/stores/availability";

const authStore = useAuthStore();
const userStore = useUserStore();
const availabilityStore = useAvailabilityStore();

const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const expandedUsers = ref<number[]>([]);

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const daysInMonth = computed(() => {
  const days = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
  return Array.from({ length: days }, (_, i) => i + 1);
});

const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

const companyUsers = computed(() => {
  const companyId = authStore.user.company_id;
  return userStore.users.filter(u => u.company_id === companyId);
});

const formatDateKey = (day: number) => {
  const m = String(currentMonth.value + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${currentYear.value}-${m}-${d}`;
};

const availabilityStatus = (userId: number, day: number) => {
  const key = formatDateKey(day);
  const userAvailabilities = availabilityStore.allAvailability[userId];
  return userAvailabilities ? userAvailabilities[key] : null;
};

const calendarCellClass = (userId: number, day: number) => {
  const status = availabilityStatus(userId, day);
  return [
    "flex justify-center items-center border rounded relative h-16 transition",
    status === "available"
      ? "bg-green-100 text-green-800"
      : status === "unavailable"
      ? "bg-red-100 text-red-800"
      : "hover:bg-gray-100"
  ];
};

const toggleExpand = async (userId: number) => {
  const index = expandedUsers.value.indexOf(userId);
  if (index > -1) {
    expandedUsers.value.splice(index, 1);
  } else {
    expandedUsers.value.push(userId);
    if (!availabilityStore.allAvailability[userId]) {
      await availabilityStore.fetchAvailability(userId);
    }
  }
};

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value -= 1;
  } else {
    currentMonth.value -= 1;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value += 1;
  } else {
    currentMonth.value += 1;
  }
};

onMounted(async () => {
  await userStore.fetchUsers();
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
