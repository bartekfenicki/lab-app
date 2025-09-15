<template>
  <div class="max-w-5xl mx-auto p-6 space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-center border-b pb-4">
      <h1 class="text-2xl font-bold text-gray-800">My Availability</h1>

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

    <!-- Weekday Headers -->
    <div class="grid grid-cols-7 text-center font-medium text-gray-600 mb-2">
      <div v-for="d in weekDays" :key="d">{{ d }}</div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-2">
      <!-- Empty cells before month starts -->
      <div
        v-for="n in firstDayOfMonth"
        :key="'empty-' + n"
        class="h-16"
      ></div>

      <!-- Actual Days -->
      <div
        v-for="day in daysInMonth"
        :key="day"
        class="flex justify-center items-center border rounded relative h-16"
      >
        <button
          @click="toggleAvailability(day)"
          :class="[
            'w-full h-full rounded-md flex flex-col justify-center items-center transition',
            availabilityStatus(day) === 'available'
              ? 'bg-green-100 hover:bg-green-200 text-green-800'
              : availabilityStatus(day) === 'unavailable'
              ? 'bg-red-100 hover:bg-red-200 text-red-800'
              : 'hover:bg-gray-100'
          ]"
        >
          <span class="font-medium">{{ day }}</span>
          <small v-if="availabilityStatus(day) === 'available'">Available</small>
          <small v-else-if="availabilityStatus(day) === 'unavailable'">Unavailable</small>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

// Store availability
// Example: { "2025-08-29": "available" }
const availability = ref<Record<string, "available" | "unavailable">>({})

const daysInMonth = computed(() => {
  const days = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  return Array.from({ length: days }, (_, i) => i + 1)
})

const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

const availabilityStatus = (day: number) => {
  const key = `${currentYear.value}-${currentMonth.value + 1}-${day}`
  return availability.value[key]
}

const toggleAvailability = (day: number) => {
  const key = `${currentYear.value}-${currentMonth.value + 1}-${day}`
  if (!availability.value[key]) {
    availability.value[key] = "available"
  } else if (availability.value[key] === "available") {
    availability.value[key] = "unavailable"
  } else {
    delete availability.value[key] // reset
  }
}

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
