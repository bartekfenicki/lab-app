<template>
  <div class="max-w-5xl mx-auto p-6 space-y-8">
    <!-- Page Header -->
    <div class="flex justify-between items-center border-b pb-4">
      <h1 class="text-2xl font-bold text-gray-800">My Hours</h1>
      <div class="flex space-x-2">
        <button
          @click="prevMonth"
          class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Prev
        </button>
        <span class="px-4 font-medium">
          {{ monthNames[currentMonth] }} {{ currentYear }}
        </span>
        <button
          @click="nextMonth"
          class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Hours Counter -->
    <div class="bg-white shadow rounded-xl p-6 text-center">
      <h2 class="text-lg font-semibold text-gray-700 mb-2">
        Hours Progress
      </h2>
      <div class="flex justify-center items-center space-x-6">
        <div class="relative w-24 h-24">
          <svg class="w-full h-full transform -rotate-90">
            <circle
              class="text-gray-200"
              stroke-width="8"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50%"
              cy="50%"
            />
            <circle
              class="text-blue-600"
              stroke-width="8"
              stroke-linecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50%"
              cy="50%"
              :stroke-dasharray="2 * Math.PI * 40"
              :stroke-dashoffset="(1 - workedHours / assignedHours) * 2 * Math.PI * 40"
            />
          </svg>
          <div
            class="absolute inset-0 flex items-center justify-center text-lg font-semibold"
          >
            {{ workedHours }}h
          </div>
        </div>
        <p class="text-gray-600">
          of <span class="font-semibold">{{ assignedHours }}h</span> assigned
        </p>
      </div>
    </div>

    <!-- Shifts Tabs -->
    <div>
      <div class="flex border-b mb-4">
        <button
          @click="activeTab = 'completed'"
          :class="[
            'px-4 py-2 font-medium',
            activeTab === 'completed'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          ]"
        >
          Completed Shifts
        </button>
        <button
          @click="activeTab = 'upcoming'"
          :class="[
            'px-4 py-2 font-medium',
            activeTab === 'upcoming'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          ]"
        >
          Upcoming Shifts
        </button>
      </div>

      <!-- Completed Shifts -->
      <div v-if="activeTab === 'completed'" class="space-y-3">
        <div
          v-for="shift in completedShifts"
          :key="shift.id"
          class="bg-white rounded-lg shadow p-4 flex justify-between items-center"
        >
          <div>
            <p class="font-semibold">{{ shift.date }}</p>
            <p class="text-sm text-gray-600">
              {{ shift.time }} ({{ shift.duration }}h)
            </p>
          </div>
          <span class="text-green-600 font-medium">Approved</span>
        </div>
      </div>

      <!-- Upcoming Shifts -->
      <div v-else class="space-y-3">
        <div
          v-for="shift in upcomingShifts"
          :key="shift.id"
          class="bg-white rounded-lg shadow p-4 flex justify-between items-center"
        >
          <div>
            <p class="font-semibold">{{ shift.date }}</p>
            <p class="text-sm text-gray-600">
              {{ shift.time }} ({{ shift.duration }}h)
            </p>
          </div>
          <span class="text-blue-600 font-medium">Scheduled</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

const workedHours = ref(30)
const assignedHours = ref(45)

const activeTab = ref<"completed" | "upcoming">("completed")

const completedShifts = ref([
  { id: 1, date: "Aug 5, 2025", time: "09:00 - 13:00", duration: 4 },
  { id: 2, date: "Aug 12, 2025", time: "14:00 - 20:00", duration: 6 }
])

const upcomingShifts = ref([
  { id: 3, date: "Aug 20, 2025", time: "10:00 - 18:00", duration: 8 },
  { id: 4, date: "Aug 28, 2025", time: "08:00 - 12:00", duration: 4 }
])

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value -= 1
  } else {
    currentMonth.value -= 1
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value += 1
  } else {
    currentMonth.value += 1
  }
}
</script>
