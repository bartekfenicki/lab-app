<template>
  <section class="bg-white rounded-xl shadow-md p-6 w-full max-w-3xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800">Your Shifts</h2>
      <RouterLink to="/calendar" class="text-blue-600 text-sm font-medium hover:underline">
        View All
      </RouterLink>
    </div>

    <!-- Big Start/Stop Button -->
    <div class="mb-6">
      <div class="p-4 border rounded-lg bg-gray-50 shadow-sm text-center">
        <p class="text-sm text-gray-600 mb-2">
          Next shift:
          <span v-if="nextShift" class="font-medium text-gray-800">
            {{ nextShift.role_id }} ({{ formatDate(nextShift.date) }} {{ displayAssignedTime(nextShift) }} - {{ formatTime(nextShift.assigned_end_time) }})
          </span>
          <span v-else>No upcoming shift</span>
        </p>

        <!-- Start / Stop Button -->
        <button
          v-if="!activeShift && nextShift && canStart(nextShift)"
          @click="handleStart(nextShift)"
          class="w-full py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-green-700 transition"
        >
          ▶ Start Shift
        </button>

        <button
          v-else-if="activeShift"
          @click="handleStop(activeShift)"
          class="w-full py-3 bg-red-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-red-700 transition"
        >
          ■ Stop Shift
        </button>

        <p v-if="activeShift" class="mt-2 text-blue-600 font-semibold text-lg">
          ⏱ {{ formattedElapsed }}
        </p>
      </div>
    </div>

    <!-- Upcoming Shifts List -->
    <div>
      <h3 class="text-lg font-medium text-gray-700 mb-3">Upcoming Shifts</h3>

      <div v-if="upcomingShifts.length === 0" class="text-gray-500 italic">No shifts incoming</div>

      <div
        v-for="shift in upcomingShifts.slice(0, 3)"
        :key="shift.shift_id"
        class="p-4 mb-3 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition"
      >
        <p class="font-semibold text-gray-800">{{ shift.role_id }}</p>
        <p class="text-sm text-gray-600">
          {{ formatDate(shift.date) }} | {{ displayAssignedTime(shift) }} - {{ formatTime(shift.assigned_end_time) }}
        </p>
        <p class="text-xs text-gray-500">Status: {{ shift.status }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useAuthStore } from "@/stores/auth"; // your auth store
import { useCompanyStore } from "@/stores/company";
import { useShiftStore } from "@/stores/shifts";
import { useUserStore } from "@/stores/users";

const authStore = useAuthStore();
const companyStore = useCompanyStore();
const shiftStore = useShiftStore();
const userStore = useUserStore();

// timer
const elapsedMs = ref(0);
let timerHandle: number | null = null;

// activeShift is the shift that has status === 'in_progress' for this user
const activeShift = computed(() => {
  const me = authStore.user;
  if (!me) return null;
  return shiftStore.shifts.find(s => s.user_id === me.user_id && s.status === 'in_progress') || null;
});

// upcomingShifts: filter for this user, status === 'upcoming', date/time after now, sorted ascending
const upcomingShifts = computed(() => {
  const me = authStore.user;
  if (!me) return [];
  return shiftStore.shifts
    .filter(s => s.user_id === me.user_id && s.status === 'upcoming')
    .filter(s => {
      // compare assigned_start_time or combine date+assigned time depending on your schema:
      // assume assigned_start_time is an ISO/timestamp string in UTC or local iso
      const assigned = s.assigned_start_time ? new Date(s.assigned_start_time) : new Date(`${s.date}T00:00:00`);
      return assigned.getTime() >= Date.now() - 24 * 3600 * 1000; // exclude far past; tweak if needed
    })
    .sort((a,b) => {
      const ta = new Date(a.assigned_start_time).getTime();
      const tb = new Date(b.assigned_start_time).getTime();
      return ta - tb;
    });
});

// nextShift is the soonest upcoming
const nextShift = computed(() => {
  return upcomingShifts.value.length > 0 ? upcomingShifts.value[0] : null;
});

// compute whether Start button allowed: only within 3 hours before assigned start (and not already started)
function canStart(shift: any) {
  if (!shift) return false;
  if (shift.status !== 'upcoming') return false;
  const assigned = new Date(shift.assigned_start_time).getTime();
  const now = Date.now();
  // open window is from assigned - 3h until maybe assigned + some margin
  const threeHours = 3 * 3600 * 1000;
  return now >= (assigned - threeHours);
}

// format assigned time to "HH:mm" for display
function displayAssignedTime(shift: any) {
  try {
    const d = new Date(shift.assigned_start_time);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

const formatTime = (timestamp: string | Date) => {
  const d = new Date(timestamp);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

// compute elapsed from server start_time for activeShift
const computeElapsedFromShift = (shift: any) => {
  if (!shift || !shift.start_time) return 0;
  const start = new Date(shift.start_time).getTime();
  return Math.max(0, Date.now() - start);
};

const formattedElapsed = computed(() => {
  const ms = elapsedMs.value;
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
});

// start the interval to update elapsedMs continuously
const startLocalTimer = (initialMs = 0) => {
  elapsedMs.value = initialMs;
  if (timerHandle) window.clearInterval(timerHandle);
  timerHandle = window.setInterval(() => {
    elapsedMs.value = Date.now() - (new Date(activeShift.value?.start_time || Date.now()).getTime());
  }, 1000);
};

const stopLocalTimer = () => {
  if (timerHandle) {
    window.clearInterval(timerHandle);
    timerHandle = null;
  }
};

async function initData() {
  const me = authStore.user;
  if (!me) return;
  const companyId = me.company_id ?? companyStore.company?.company_id;
  if (!companyId) return;
  await shiftStore.fetchCompanyShifts(companyId);
  await userStore.fetchUsers(); // for role/name display if needed

  // If user already has an in-progress shift, start timer using server start_time
  const inProgress = shiftStore.shifts.find(s => s.user_id === me.user_id && s.status === 'in_progress');
  if (inProgress) {
    const initial = computeElapsedFromShift(inProgress);
    startLocalTimer(initial);
  }
}

onMounted(() => {
  initData();
});

// clean-up
onBeforeUnmount(() => {
  stopLocalTimer();
});

// Start shift action
async function handleStart(shift: any) {
  try {
    // optimistic UI: call backend to set start_time and status
    const updated = await shiftStore.startShift(shift.shift_id);
    // start timer using returned start_time
    const initial = computeElapsedFromShift(updated);
    startLocalTimer(initial);
  } catch (err) {
    console.error("Failed to start shift", err);
    alert("Failed to start shift. Please try again.");
  }
}

// Stop shift action — confirm and call backend
async function handleStop(shift: any) {
  if (!shift) return;
  const ok = window.confirm("Are you sure you want to end this shift? This will set your end time and submit the shift for approval.");
  if (!ok) return;

  try {
    const updated = await shiftStore.endShift(shift.shift_id);
    // stop local timer
    stopLocalTimer();
    elapsedMs.value = 0;
    // optionally refresh user shifts
    const me = authStore.user;
    if (me) await shiftStore.refreshShiftsForUser(me.company_id, me.user_id);
  } catch (err) {
    console.error("Failed to end shift", err);
    alert("Failed to end shift. Please try again.");
  }
}
</script>

