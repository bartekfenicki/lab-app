<template>
  <div class="flex flex-col md:flex-row h-screen bg-gray-100">
    <!-- Calendar Panel -->
    <div
      class="bg-white shadow-lg p-4 md:p-6 transition-all duration-300"
      :style="{
        width: selectedDay !== null ? (isMobile ? '100%' : '50%') : (isMobile ? '100%' : '66.6667%'),
        transform: selectedDay !== null && !isMobile ? 'translateX(0%)' : 'translateX(0)'
      }"
    >
      <!-- Month / Year Header -->
      <div class="flex justify-between items-center mb-4">
        <button
          @click="prevMonth"
          class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Prev
        </button>

        <div class="text-lg font-semibold">
          {{ monthNames[currentMonth] }} {{ currentYear }}
        </div>

        <button
          @click="nextMonth"
          class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
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
        <div
          v-for="n in firstDayOfMonth"
          :key="'empty-' + n"
          class="h-12"
        ></div>

        <!-- Actual days -->
        <div
          v-for="day in daysInMonth"
          :key="day"
          class="flex justify-center items-center border rounded"
        >
          <button
            @click="selectDay(day)"
            :class="[
              'w-full h-12 md:h-10 transition-colors rounded-md',
              day === selectedDay ? 'bg-blue-600 text-white' : 'hover:bg-blue-100'
            ]"
          >
            {{ day }}
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

        <section class="mb-6">
          <h3 class="text-xl font-semibold mb-2">Events</h3>
          <div
            v-for="event in sampleEvents"
            :key="event.id"
            class="mb-3 p-3 border rounded hover:shadow"
          >
            <h4 class="font-semibold">{{ event.title }}</h4>
            <p class="text-gray-600 text-sm">{{ event.description }}</p>
            <p class="text-gray-500 text-xs mt-1">
              {{ event.time }} - Duration: {{ event.duration }}
            </p>
          </div>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-2">Employee Shifts</h3>
          <div
            v-for="shift in sampleShifts"
            :key="shift.id"
            class="mb-3 p-3 border rounded hover:shadow"
          >
            <p class="font-semibold">{{ shift.employee }}</p>
            <p class="text-gray-500 text-sm">{{ shift.shiftTime }}</p>
          </div>
        </section>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// Responsive detection
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};
onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

// Calendar state
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());
const selectedDay = ref<number | null>(null);

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Sample events / shifts
const sampleEvents = [
  { id: 1, title: "Team Meeting", description: "Project updates", time: "10:00 AM - 11:00 AM", duration: "1h" }
];
const sampleShifts = [
  { id: 1, employee: "Alice", shiftTime: "09:00 AM - 05:00 PM" },
  { id: 2, employee: "Bob", shiftTime: "10:00 AM - 06:00 PM" }
];

// Computed: number of days in month
const daysInMonth = computed(() => {
  return new Array(new Date(currentYear.value, currentMonth.value + 1, 0).getDate())
    .fill(0)
    .map((_, i) => i + 1);
});

// Computed: first day of month (0=Sun)
const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

// Functions
function selectDay(day: number) {
  selectedDay.value = day;
}
function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value -= 1;
  } else currentMonth.value -= 1;
  selectedDay.value = null;
}
function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value += 1;
  } else currentMonth.value += 1;
  selectedDay.value = null;
}
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
.slide-fade-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-fade-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>



