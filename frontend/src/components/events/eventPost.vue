<template>
  <article
    v-for="event in upcomingEvents" 
    :key="event.event_id"
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
          📅 {{ formatDate(event.date) }}
          <br />
          ⏰ {{ formatTime(event.event_start) }} - {{ formatTime(event.event_end) }}
        </p>
      </div>

      <!-- Created By -->
      <div class="mt-2 text-xs text-gray-400">
        Created by <span class="font-medium">{{ authorName(event.created_by) }}</span>
        · Posted {{ formatPostedAt(event.created_at) }}
      </div>

      <!-- Buttons -->
      <div class="mt-4 flex justify-between items-center gap-4">
        <!-- <button
          @click="toggleExpanded(event.event_id)"
          class="mt-4 text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline"
        >
          {{ expanded[event.event_id] ? "Hide Details" : "View Details" }}
          <svg
            :class="{ 'rotate-180': expanded[event.event_id] }"
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button> -->
        <RouterLink
          to="/calendar"
          class="px-3 py-1 bg-blue-600 text-white text-sm rounded-md shadow hover:bg-blue-700 transition"
        >
          Go to Calendar
        </RouterLink>
      </div>
    </div>

    <!-- Expanded Section -->
    <!-- <transition name="expand">
      <div
        v-if="expanded[event.event_id]"
        class="border-t px-4 py-3 sm:px-6 bg-gray-50"
      >
        <h4 class="font-semibold mb-2 text-gray-800">Assigned Employees</h4>
        <ul class="space-y-1">
          <li
            v-for="emp in event.assigned_users"
            :key="emp.user_id"
            class="flex items-center gap-2"
          >
            <img
              :src="emp.profilepic || '/default-avatar.png'"
              alt="employee avatar"
              class="w-6 h-6 rounded-full object-cover"
            />
            <span class="text-sm text-gray-700"
              >{{ emp.first_name }} {{ emp.last_name }}</span
            >
          </li>
        </ul>
      </div>
    </transition> -->
  </article>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useEventsStore } from "@/stores/events";
import { useUserStore } from "@/stores/users";
import { useCompanyStore } from "@/stores/company";

const companyStore = useCompanyStore();
const eventsStore = useEventsStore();
const userStore = useUserStore();

watch(
  () => eventsStore.events,
  (val: any[]) => {
    console.log("Events visible in card component:", val.map(e => e.event_id));
  },
  { immediate: true }
);

onMounted( () => {
  if (!eventsStore._fetched) {
     eventsStore.fetchCompanyEvents();
  }
  console.log('component sees events:', eventsStore.events.length);
  console.log(eventsStore.events);
});


const expanded = ref<{ [key: number]: boolean }>({});

const toggleExpanded = (id: number) => {
  expanded.value[id] = !expanded.value[id];
};

const today = new Date();
today.setHours(0, 0, 0, 0);

const upcomingEvents = computed(() => {
  return eventsStore.events
    .filter(e => e.company_id === companyStore.company?.company_id) // only current company
    .filter(e => {
      const eventDate = new Date(e.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today; // only today or future
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // sort ascending
});

const formatPostedAt = (createdAt: string) => {
  return new Date(createdAt).toLocaleDateString();
};

const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const formatTime = (timestamp: string | Date) => {
  const d = new Date(timestamp);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

const authorName = (userId: number) => {
  const user = userStore.users.find((u) => u.user_id === userId);
  return user ? `${user.first_name} ${user.last_name}` : "Unknown";
};
</script>
