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
      <h2 class="text-lg font-semibold text-gray-700 mb-2">Hours Progress</h2>
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
          <div class="absolute inset-0 flex items-center justify-center text-lg font-semibold">
            {{ formatHours(workedHours) }}
          </div>
        </div>
        <p class="text-gray-600">
          of <span class="font-semibold">{{ formatHours(assignedHours) }}</span> assigned
        </p>
      </div>
    </div>

    <!-- Shifts Tabs -->
    <div>
      <div class="flex border-b mb-4 space-x-2">
        <button
          v-for="tab in statusTabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'px-4 py-2 font-medium rounded-t',
            activeTab === tab.key
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Shift List -->
      <div v-if="shiftsForTab.length" class="space-y-3">
        <div
          v-for="shift in shiftsForTab"
          :key="shift.shift_id"
          class="bg-white rounded-lg shadow p-4 flex justify-between items-center"
        >
          <div>
            <p class="font-semibold">{{ formatDate(shift.date) }}</p>
            <p class="text-sm text-gray-600">
              {{ formatTime(shift.assigned_start_time) }} - {{ formatTime(shift.assigned_end_time) }}
              ({{ formatHours(calculateShiftHours(shift, shift.status === 'approved' || shift.status === 'pending_approval')) }})
            </p>
          </div>
          <span
            class="font-medium"
            :class="{
              'text-blue-600': shift.status === 'upcoming',
              'text-yellow-600': shift.status === 'in_progress',
              'text-orange-600': shift.status === 'pending_approval',
              'text-green-600': shift.status === 'approved'
            }"
          >
            {{ shift.status }}
          </span>
        </div>
      </div>
      <p v-else class="text-gray-500 mt-4">No shifts in this category.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useShiftStore } from "@/stores/shifts";
import { useUserStore } from "@/stores/users";
import { useCompanyStore } from "@/stores/company";

const authStore = useAuthStore();
const shiftStore = useShiftStore();
const userStore = useUserStore();
const companyStore = useCompanyStore();

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const activeTab = ref<"upcoming" | "in_progress" | "pending_approval" | "approved">("upcoming");

const statusTabs: { key: "upcoming" | "in_progress" | "pending_approval" | "approved"; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "in_progress", label: "In Progress" },
  { key: "pending_approval", label: "Pending Approval" },
  { key: "approved", label: "Approved" },
];

const me = authStore.user;
const companyId = me.company_id ?? companyStore.company?.company_id;

// Fetch shifts on mount
onMounted(async () => {
  await shiftStore.fetchCompanyShifts(companyId);
  await userStore.fetchUsers(); 
});

// Filtered shifts by status and month
const shiftsForTab = computed(() =>
  shiftStore.shifts.filter(s => {
    const date = new Date(s.date);
    return (
      s.user_id === me.user_id &&
      s.status === activeTab.value &&
      date.getMonth() === currentMonth.value &&
      date.getFullYear() === currentYear.value
    );
  })
);

// Calculate difference in hours
function diffHours(startTime: string | null, endTime: string | null, label = ""): number {
  if (!startTime || !endTime) return 0;

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    console.error(`[${label}] Invalid date format:`, startTime, endTime);
    return 0;
  }

  const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return Math.max(0, Math.round(diff * 100) / 100);
}

// Calculate shift hours
const calculateShiftHours = (shift: any, useActual = false) => {
  const start = useActual && shift.start_time ? shift.start_time : shift.assigned_start_time;
  const end = useActual && shift.end_time ? shift.end_time : shift.assigned_end_time;

  const label = `Shift ID ${shift.shift_id}`;
  const hours = diffHours(start, end, label);
  return hours;
};

// Assigned hours (mix of actual approved + scheduled for others)
const assignedHours = computed(() => {
  const filtered = shiftStore.shifts.filter(
    s =>
      s.user_id === me.user_id &&
      new Date(s.date).getMonth() === currentMonth.value &&
      new Date(s.date).getFullYear() === currentYear.value
  );

  const total = filtered.reduce((sum, shift) => {
    if (shift.status === "approved") {
      // use actual hours
      return sum + calculateShiftHours(shift, true);
    } else {
      // use scheduled hours
      return sum + calculateShiftHours(shift, false);
    }
  }, 0);

  console.log("Total assigned hours (mixed):", total);
  return total;
});

// Worked hours (only approved with actual times)
const workedHours = computed(() => {
  const filtered = shiftStore.shifts.filter(
    s =>
      s.user_id === me.user_id &&
      s.status === "approved" &&
      s.start_time &&
      s.end_time &&
      new Date(s.date).getMonth() === currentMonth.value &&
      new Date(s.date).getFullYear() === currentYear.value
  );

  const total = filtered.reduce((sum, shift) => sum + calculateShiftHours(shift, true), 0);
  console.log("Total worked hours:", total);
  return total;
});

function formatHours(hours: number) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
}

// Month navigation
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value -= 1;
  } else {
    currentMonth.value -= 1;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value += 1;
  } else {
    currentMonth.value += 1;
  }
};

// Helpers
const formatTime = (timestamp: string | Date) => {
  const d = new Date(timestamp);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};
const formatDate = (date: string) => new Date(date).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
</script>
