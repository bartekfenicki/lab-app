<template>
  <div>
    <!-- Header -->
    <h2 class="text-xl font-semibold mb-4">Manage Shifts</h2>

    <!-- Sub-tabs -->
    <div class="flex space-x-4 border-b mb-4">
      <button
        v-for="tab in subTabs"
        :key="tab.key"
        @click="currentSubTab = tab.key"
        :class="[
          'px-4 py-2 font-medium border-b-2 transition',
          currentSubTab === tab.key
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-600 hover:text-blue-500'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Sub-tab Content -->
    <div>
      <!-- Add Shifts -->
      <div v-if="currentSubTab === 'add'">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
        >
          ➕ Add Shift
        </button>

        <ul class="space-y-3">
          <li
            v-for="shift in exampleShifts"
            :key="shift.id"
            class="p-3 border rounded shadow-sm flex justify-between items-center"
          >
            <div>
              <strong>{{ shift.employee }}</strong> – {{ shift.time }}
            </div>
            <button class="text-blue-600 hover:underline">Edit</button>
          </li>
        </ul>
      </div>

      <!-- Approve Shifts -->
      <div v-if="currentSubTab === 'approve'">
        <h3 class="text-lg font-semibold mb-3">Pending Approvals</h3>

        <ul class="space-y-3">
          <li
            v-for="shift in pendingShifts"
            :key="shift.id"
            class="p-3 border rounded shadow-sm flex justify-between items-center"
          >
            <div>
              <strong>{{ shift.employee }}</strong> – {{ shift.time }}
              <p class="text-sm text-gray-500">Submitted for approval</p>
            </div>
            <div class="space-x-2">
              <button
                class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button
                class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

const subTabs = [
  { key: "add", label: "Add Shifts" },
  { key: "approve", label: "Approve Shifts" }
]

const currentSubTab = ref("add")

// Example data
const exampleShifts = [
  { id: 1, employee: "John Doe", time: "09:00 - 17:00" },
  { id: 2, employee: "Jane Smith", time: "10:00 - 18:00" }
]

const pendingShifts = [
  { id: 3, employee: "Alice Johnson", time: "08:00 - 16:00" },
  { id: 4, employee: "Bob Williams", time: "12:00 - 20:00" }
]
</script>

