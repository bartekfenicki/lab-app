<template>
  <section
    class="bg-white rounded-xl shadow-md p-6 w-full max-w-xl mx-auto"
  >
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800">Upcoming Events</h2>
      <RouterLink
        to="/events"
        class="text-blue-600 text-sm font-medium hover:underline"
      >
        View All
      </RouterLink>
    </div>

    <!-- Events List -->
    <ul class="divide-y divide-gray-200">
      <li
        v-for="event in upcomingEvents.slice(0, 3)"
        :key="event.id"
        class="py-3 flex items-start gap-3"
      >
        <!-- Date Badge -->
        <div class="flex flex-col items-center justify-center bg-blue-100 text-blue-700 rounded-md px-2 py-1 w-14">
          <span class="text-sm font-bold">{{ event.day }}</span>
          <span class="text-xs uppercase">{{ event.month }}</span>
        </div>

        <!-- Event Info -->
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-gray-800">
            {{ event.title }}
          </h3>
          <p class="text-xs text-gray-500">
            {{ event.timeSpan }}
          </p>
        </div>
      </li>
    </ul>

    <!-- Footer Button -->
    <div class="mt-4 flex justify-end">
      <RouterLink
        to="/events"
        class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go to Events
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";

interface Event {
  id: number;
  title: string;
  day: string;
  month: string;
  timeSpan: string;
}

const upcomingEvents: Event[] = [
  {
    id: 1,
    title: "Quarterly Planning Meeting",
    day: "10",
    month: "SEP",
    timeSpan: "10:00 AM - 1:00 PM"
  },
  {
    id: 2,
    title: "Team Building Activity",
    day: "15",
    month: "SEP",
    timeSpan: "2:00 PM - 5:00 PM"
  },
  {
    id: 3,
    title: "Client Presentation",
    day: "20",
    month: "SEP",
    timeSpan: "9:00 AM - 11:00 AM"
  }
];
</script>
