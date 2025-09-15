<template>
  <section
    class="bg-white rounded-xl shadow-md p-6 w-full max-w-3xl mx-auto"
  >
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800">Your Shifts</h2>
      <RouterLink
        to="/calendar"
        class="text-blue-600 text-sm font-medium hover:underline"
      >
        View All
      </RouterLink>
    </div>

    <!-- Big Start/Stop Button -->
    <div class="mb-6">
      <div class="p-4 border rounded-lg bg-gray-50 shadow-sm text-center">
        <p class="text-sm text-gray-600 mb-2">
          Next shift: 
          <span v-if="nextShift" class="font-medium text-gray-800">
            {{ nextShift.role }} ({{ nextShift.date }} {{ nextShift.time }})
          </span>
          <span v-else>No upcoming shift</span>
        </p>

        <!-- Start / Stop Button -->
        <button
          v-if="!activeShiftId && nextShift"
          @click="startShift(nextShift.id)"
          class="w-full py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-green-700 transition"
        >
          ▶ Start Shift
        </button>
        <button
          v-else-if="activeShiftId"
          @click="stopShift"
          class="w-full py-3 bg-red-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-red-700 transition"
        >
          ■ Stop Shift
        </button>

        <!-- Timer -->
        <p v-if="activeShiftId" class="mt-2 text-blue-600 font-semibold text-lg">
          ⏱ {{ formatTime(elapsedTime) }}
        </p>
      </div>
    </div>

    <!-- Upcoming Shifts List -->
    <div>
      <h3 class="text-lg font-medium text-gray-700 mb-3">Upcoming Shifts</h3>
      <div
        v-for="shift in upcomingShifts.slice(0, 2)"
        :key="shift.id"
        class="p-4 mb-3 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition"
      >
        <p class="font-semibold text-gray-800">{{ shift.role }}</p>
        <p class="text-sm text-gray-600">
          {{ shift.date }} | {{ shift.time }}
        </p>
        <p class="text-xs text-gray-500">Duration: {{ shift.duration }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed } from "vue";
import { RouterLink } from "vue-router";

interface Shift {
  id: number;
  role: string;
  date: string;
  time: string;
  duration: string;
}

const upcomingShifts: Shift[] = [
  {
    id: 1,
    role: "Morning Shift",
    date: "Aug 29, 2025",
    time: "08:00 - 14:00",
    duration: "6h"
  },
  {
    id: 2,
    role: "Evening Shift",
    date: "Aug 30, 2025",
    time: "16:00 - 22:00",
    duration: "6h"
  },
  {
    id: 3,
    role: "Night Shift",
    date: "Aug 31, 2025",
    time: "22:00 - 06:00",
    duration: "8h"
  }
];

// computed: the next upcoming shift
const nextShift = computed(() => upcomingShifts[0] || null);

// State for active shift
const activeShiftId = ref<number | null>(null);
const elapsedTime = ref(0);
let timer: number | null = null;

function startShift(shiftId: number) {
  activeShiftId.value = shiftId;
  elapsedTime.value = 0;

  timer = setInterval(() => {
    elapsedTime.value++;
  }, 1000) as unknown as number;
}

function stopShift() {
  activeShiftId.value = null;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>
