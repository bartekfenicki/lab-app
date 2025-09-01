<template>
  <article
    class="overflow-hidden rounded-lg w-72 lg:w-96 p-2 mx-auto m-10 max-w-lg shadow-sm transition hover:shadow-lg bg-white"
  >
    <!-- Image -->
    <img
      :src="event.image"
      alt="Event image"
      class="h-48 w-full object-cover"
    />

    <!-- Content -->
    <div class="p-4 sm:p-6">
      <!-- Title -->
      <h3 class="text-lg font-semibold text-gray-900">
        {{ event.title }}
      </h3>

      <!-- Short Description -->
      <p class="mt-1 text-sm text-gray-600 line-clamp-2">
        {{ event.description }}
      </p>

      <!-- Date & Time -->
      <div class="mt-2 text-sm text-gray-500">
        <p>
          📅 {{ event.date }} <br />
          ⏰ {{ event.timeSpan }} ({{ event.duration }})
        </p>
      </div>

      <!-- Created By -->
      <div class="mt-2 text-xs text-gray-400">
        Created by <span class="font-medium">{{ event.createdBy }}</span>
        · Posted {{ event.postedAt }}
      </div>
    <div class="mt-4 flex justify-between items-center gap-4">
      <!-- Expand Button -->
      <button
        @click="expanded = !expanded"
        class="mt-4 text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline"
      >
        {{ expanded ? 'Hide Details' : 'View Details' }}
        <svg
          :class="{ 'rotate-180': expanded }"
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <RouterLink
          to="/calendar"
          class="px-3 py-1 bg-blue-600 text-white text-sm rounded-md shadow hover:bg-blue-700 transition"
        >
          Go to Calendar
        </RouterLink>   
    </div>
    </div>

    <!-- Expanded Section -->
    <transition name="expand">
      <div v-if="expanded" class="border-t px-4 py-3 sm:px-6 bg-gray-50">
        <h4 class="font-semibold mb-2 text-gray-800">Assigned Employees</h4>
        <ul class="space-y-1">
          <li
            v-for="emp in event.assignedEmployees"
            :key="emp.id"
            class="flex items-center gap-2"
          >
            <img
              :src="emp.avatar"
              alt="employee avatar"
              class="w-6 h-6 rounded-full object-cover"
            />
            <span class="text-sm text-gray-700">{{ emp.name }}</span>
          </li>
        </ul>
      </div>
    </transition>
  </article>
</template>

<script setup lang="ts">
import { ref } from "vue";

const expanded = ref(false);

interface Employee {
  id: number;
  name: string;
  avatar: string;
}

interface Event {
  title: string;
  description: string;
  date: string;
  timeSpan: string;
  duration: string;
  createdBy: string;
  postedAt: string;
  image: string;
  assignedEmployees: Employee[];
}

const event: Event = {
  title: "Quarterly Planning Meeting",
  description: "We will discuss company objectives, team progress, and roadmap alignment.",
  date: "September 10, 2025",
  timeSpan: "10:00 AM - 1:00 PM",
  duration: "3 hours",
  createdBy: "Alice Johnson",
  postedAt: "2 days ago",
  image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
  assignedEmployees: [
    { id: 1, name: "John Doe", avatar: "https://i.pravatar.cc/40?img=1" },
    { id: 2, name: "Jane Smith", avatar: "https://i.pravatar.cc/40?img=2" },
    { id: 3, name: "Michael Lee", avatar: "https://i.pravatar.cc/40?img=3" }
  ]
};
</script>

<style>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
