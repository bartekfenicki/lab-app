<template>
  <div class="flex flex-col md:flex-row h-screen bg-gray-100">
    <!-- Calendar Panel -->
    <div
      class="bg-white shadow-lg p-4 md:p-6 transition-all duration-300"
      :style="{
        width: selectedDay !== null ? (isMobile ? '100%' : '50%') : (isMobile ? '100%' : '66.6667%'),
      }"
    >
      <!-- Month / Year Header -->
      <div class="flex justify-between items-center mb-4">
        <button @click="prevMonth" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          Prev
        </button>
        <div class="text-lg font-semibold">
          {{ monthNames[currentMonth] }} {{ currentYear }}
        </div>
        <button @click="nextMonth" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
          Next
        </button>
      </div>

      <!-- Weekday Headers -->
      <div class="grid grid-cols-7 text-center font-medium text-gray-600 mb-2">
        <div v-for="d in weekDays" :key="d">{{ d }}</div>
      </div>

      <!-- Days Grid -->
      <div class="grid grid-cols-7 gap-2">
        <!-- Empty cells before first day -->
        <div v-for="n in firstDayOfMonth" :key="'empty-' + n" class="h-12"></div>

        <!-- Actual days -->
        <div
          v-for="day in daysInMonth"
          :key="day"
          class="flex flex-col justify-center items-center border rounded relative"
        >
          <button
            @click="selectDay(day)"
            :class="[
              'w-full h-12 md:h-10 transition-colors rounded-md relative',
              day === selectedDay ? 'bg-blue-600 text-white' : 'hover:bg-blue-100'
            ]"
          >
            {{ day }}

            <!-- Blue dot for events -->
            <span
              v-if="eventsByDay[day] && eventsByDay[day].length > 0"
              class="absolute bottom-1 left-4 transform -translate-x-2 w-2 h-2 rounded-full bg-blue-600"
            ></span>

            <!-- Green dot for user's shifts -->
            <span
              v-if="userShiftsByDay[day] && userShiftsByDay[day].length > 0"
              class="absolute bottom-1 right-4 transform translate-x-2 w-2 h-2 rounded-full bg-green-500"
            ></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Details Panel -->
    <transition name="slide-fade">
      <div
        v-if="selectedDay"
        class="bg-white shadow-lg w-full md:w-1/2 p-4 md:p-6 overflow-y-auto mt-4 md:mt-0"
      >
        <h2 class="text-2xl font-bold mb-4">
          {{ monthNames[currentMonth] }} {{ selectedDay }}, {{ currentYear }}
        </h2>

        <!-- Events -->
        <section v-if="eventsForSelectedDay.length > 0">
          <h3 class="text-xl font-semibold mb-2">Events</h3>
          <div
            v-for="event in eventsForSelectedDay"
            :key="event.event_id"
            class="mb-3 p-3 border rounded hover:shadow transition"
          >
            <h4 class="font-semibold">{{ event.title }}</h4>
            <p class="text-gray-600 text-sm">{{ event.description }}</p>
            <p class="text-gray-500 text-xs mt-1">
              {{ formatTime(event.event_start) }} - {{ formatTime(event.event_end) }}
            </p>
          </div>
        </section>

        <section v-else>
          <p class="text-gray-500 italic">No events for this day.</p>
        </section>

        <!-- Shifts -->
        <section v-if="shiftsForSelectedDay.length > 0" class="mt-6">
          <h3 class="text-xl font-semibold mb-2">Shifts</h3>
          <div
            v-for="shift in shiftsForSelectedDay"
            :key="shift.shift_id"
            class="mb-3 p-3 border rounded hover:shadow transition"
          >
            <h4 class="font-semibold">
              {{ getUserName(shift.user_id) }}
            </h4>
            <p class="text-gray-600 text-sm">
              {{ formatTime(shift.assigned_start_time) }} - {{ formatTime(shift.assigned_end_time) }}
            </p>
            <p class="text-gray-500 text-xs mt-1">Status: {{ shift.status }}</p>
          </div>
        </section>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useEventsStore } from "@/stores/events";
import { useCompanyStore } from "@/stores/company";
import { useShiftStore } from "@/stores/shifts";
import { useUserStore } from "@/stores/users";
import { useAuthStore } from "@/stores/auth";

const eventsStore = useEventsStore();
const companyStore = useCompanyStore();
const shiftStore = useShiftStore();
const userStore = useUserStore();
const authStore = useAuthStore();

// Responsive
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
  loadData();
});

async function loadData() {
  try {
    if (companyStore.company) {
      await Promise.all([
        eventsStore.fetchCompanyEvents(companyStore.company.company_id),
        shiftStore.fetchCompanyShifts(companyStore.company.company_id),
        userStore.fetchUsers(),
      ]);
    }
  } catch (err) {
    console.error("Failed to fetch data:", err);
  }
}

// Calendar state
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());
const selectedDay = ref<number | null>(null);

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Days in month
const daysInMonth = computed(() => {
  return new Array(new Date(currentYear.value, currentMonth.value + 1, 0).getDate())
    .fill(0)
    .map((_, i) => i + 1);
});

const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

// Events grouped by day
const eventsByDay = computed(() => {
  const map: Record<number, any[]> = {};
  for (const e of eventsStore.events) {
    const date = new Date(e.date);
    if (
      date.getFullYear() === currentYear.value &&
      date.getMonth() === currentMonth.value
    ) {
      const day = date.getDate();
      if (!map[day]) map[day] = [];
      map[day].push(e);
    }
  }
  return map;
});

// Shifts grouped by day for current user
const userShiftsByDay = computed(() => {
  const map: Record<number, any[]> = {};
  const userId = authStore.user?.user_id;
  if (!userId) return map;

  for (const shift of shiftStore.shifts) {
    if (shift.user_id !== userId) continue;
    const date = new Date(shift.date);
    if (
      date.getFullYear() === currentYear.value &&
      date.getMonth() === currentMonth.value
    ) {
      const day = date.getDate();
      if (!map[day]) map[day] = [];
      map[day].push(shift);
    }
  }
  return map;
});

// Events for selected day
const eventsForSelectedDay = computed(() => {
  if (!selectedDay.value) return [];
  return eventsByDay.value[selectedDay.value] || [];
});

// Shifts for selected day
const shiftsForSelectedDay = computed(() => {
  if (!selectedDay.value) return [];
  const userId = authStore.user?.user_id;
  return shiftStore.shifts.filter((shift) => {
    const date = new Date(shift.date);
    return (
      date.getDate() === selectedDay.value &&
      date.getMonth() === currentMonth.value &&
      date.getFullYear() === currentYear.value &&
      shift.user_id === userId
    );
  });
});

function selectDay(day: number) {
  selectedDay.value = selectedDay.value === day ? null : day;
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  selectedDay.value = null;
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  selectedDay.value = null;
}

// Format time nicely
const formatTime = (timestamp: string | Date) => {
  const d = new Date(timestamp);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

const getUserName = (userId: number) => {
  const user = userStore.users.find((u) => u.user_id === userId);
  return user ? `${user.first_name} ${user.last_name}` : `User #${userId}`;
};
</script>

<style>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>





