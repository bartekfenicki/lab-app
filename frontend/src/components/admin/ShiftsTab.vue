<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold">Company Shifts</h1>
      <button
        @click="isModalOpen = true"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ➕ Add Shift
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex space-x-2 mb-4">
      <button
        v-for="status in statuses"
        :key="status.key"
        @click="activeTab = status.key"
        :class="[
          'px-4 py-2 rounded font-medium',
          activeTab === status.key ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
        ]"
      >
        {{ status.label }}
      </button>
    </div>

    <!-- Shifts grouped by employee -->
    <div v-if="groupedShifts.length" class="space-y-3">
      <div
        v-for="userGroup in groupedShifts"
        :key="userGroup.user_id"
        class="border rounded-lg bg-white shadow-sm"
      >
        <!-- Employee header -->
        <button
          class="w-full flex justify-between items-center px-4 py-3 text-left font-medium hover:bg-gray-100"
          @click="toggleUser(userGroup.user_id)"
        >
          <span>{{ userGroup.user_name }}</span>
          <span>{{ expandedUsers.includes(userGroup.user_id) ? '▾' : '▸' }}</span>
        </button>

        <!-- Employee shifts (expandable) -->
        <div v-if="expandedUsers.includes(userGroup.user_id)" class="px-4 py-2 space-y-2">
          <div
            v-for="shift in userGroup.shifts"
            :key="shift.shift_id"
            class="p-3 border rounded flex justify-between items-center"
          >
            <div>
              <p class="text-sm">{{ formatDate(shift.date) }}</p>
              <p class="text-xs text-gray-500">
                {{ formatTime(shift.assigned_start_time) }} - {{ formatTime(shift.assigned_end_time) }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <span
                class="text-xs px-2 py-1 rounded-full"
                :class="{
                  'bg-yellow-200 text-yellow-700': shift.status === 'upcoming',
                  'bg-blue-200 text-blue-700': shift.status === 'in_progress',
                  'bg-orange-200 text-orange-700': shift.status === 'pending_approval',
                  'bg-green-200 text-green-700': shift.status === 'approved',
                }"
              >
                {{ shift.status }}
              </span>

              <!-- Approve button for pending_approval -->
              <button
                v-if="shift.status === 'pending_approval'"
                @click="handleApprove(shift)"
                class="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p v-else class="text-gray-500 mt-4">No shifts in this category.</p>

    <!-- Modal -->
    <AddShiftModal
      :isOpen="isModalOpen"
      :companyId="companyId"
      @close="isModalOpen = false"
      @shiftCreated="handleShiftCreated"
    />
  </div>
</template>



<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import AddShiftModal from "@/components/admin/addShiftModal.vue";
import { useShiftStore } from "@/stores/shifts";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/users";

const shiftStore = useShiftStore();
const authStore = useAuthStore();
const userStore = useUserStore();

const companyId = authStore.user.company_id;
const isModalOpen = ref(false);
const activeTab = ref("upcoming");
const expandedUsers = ref<number[]>([]);

const statuses = [
  { key: "upcoming", label: "Upcoming" },
  { key: "in_progress", label: "In Progress" },
  { key: "pending_approval", label: "Pending Approval" },
  { key: "approved", label: "Approved" },
];

const handleShiftCreated = async () => {
  await shiftStore.fetchCompanyShifts(companyId);
  isModalOpen.value = false;
};

// Filter shifts by active tab
const filteredShifts = computed(() =>
  shiftStore.shifts.filter(s => s.status === activeTab.value)
);

// Group shifts by user
const groupedShifts = computed(() => {
  const groups: { user_id: number; user_name: string; shifts: any[] }[] = [];
  const users = userStore.users.filter(u => u.company_id === companyId);

  users.forEach(u => {
    const userShifts = filteredShifts.value.filter(s => s.user_id === u.user_id);
    if (userShifts.length > 0) {
      groups.push({
        user_id: u.user_id,
        user_name: `${u.first_name} ${u.last_name}`,
        shifts: userShifts,
      });
    }
  });

  return groups;
});

// Toggle expand/collapse user shifts
const toggleUser = (userId: number) => {
  if (expandedUsers.value.includes(userId)) {
    expandedUsers.value = expandedUsers.value.filter(id => id !== userId);
  } else {
    expandedUsers.value.push(userId);
  }
};

const formatTime = (timestamp: string | Date) => {
  const d = new Date(timestamp);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

// Approve a shift
const handleApprove = async (shift: any) => {
  try {
    const approved = await shiftStore.approveShift(shift.shift_id, authStore.user.user_id);
    console.log("Approved shift:", approved);
  } catch (err) {
    console.error("Failed to approve shift:", err);
  }
};

onMounted(async () => {
  await shiftStore.fetchCompanyShifts(companyId);
  await userStore.fetchUsers();
});
</script>




