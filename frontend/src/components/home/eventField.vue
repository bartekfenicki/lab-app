<template>
  <section
    class="bg-white rounded-xl shadow-md p-6 w-full max-w-3xl mx-auto"
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
            <span class="text-sm font-semibold text-gray-600">
            {{ formatDayMonth(event.date) }}
          </span>
        </div>

        <!-- Event Info -->
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-gray-800">
            {{ event.title }}
          </h3>
          <p class="text-xs text-gray-500">
            {{formatTime(event.event_start) }} - {{ formatTime(event.event_end) }} 
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
import { useCompanyStore } from "@/stores/company";
import { useEventsStore } from "@/stores/events";
import { computed, onMounted } from "vue";
import { RouterLink } from "vue-router";

const eventsStore = useEventsStore();
const companyStore = useCompanyStore();

onMounted(() => {
  eventsStore.fetchCompanyEvents();
 
});

const formatTime = (timestamp: string | Date) => {
  const d = new Date(timestamp);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

const today = new Date();
today.setHours(0, 0, 0, 0);

const upcomingEvents = computed(() => {
  return eventsStore.events
    .filter(e => e.company_id === companyStore.company?.company_id) 
    .filter(e => {
      const eventDate = new Date(e.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today; // only today or future
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // sort ascending
});


const formatDayMonth = (dateString: string | Date) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }); // "Jan", "Feb", etc.
  return `${day} ${month}`;
}

</script>
