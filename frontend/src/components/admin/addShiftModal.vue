<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
      <h2 class="text-xl font-semibold mb-4">➕ Add New Shift</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Select user -->
        <div>
          <label class="block text-sm font-medium mb-1">Select User</label>
          <select v-model.number="selectedUserId" class="w-full border rounded px-3 py-2">
            <option disabled value="">-- Choose User --</option>
            <option v-for="user in userStore.users.filter(u => u.company_id === companyStore.company?.company_id)" :key="user.user_id" :value="user.user_id">
              {{ user.first_name }} {{ user.last_name }} ({{ roleName(user.role_id) }})
            </option>
          </select>
        </div>

        <!-- Date -->
        <div>
          <label class="block text-sm font-medium mb-1">Date</label>
          <input type="date" v-model="form.date" class="w-full border rounded px-3 py-2" required />
        </div>

        <!-- Assigned Start Time -->
        <div>
          <label class="block text-sm font-medium mb-1">Assigned Start Time</label>
          <input type="time" v-model="form.assigned_start_time" class="w-full border rounded px-3 py-2" required />
        </div>

        <!-- Assigned End Time -->
        <div>
          <label class="block text-sm font-medium mb-1">Assigned End Time</label>
          <input type="time" v-model="form.assigned_end_time" class="w-full border rounded px-3 py-2" required />
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium mb-1">Status</label>
          <select v-model="form.status" class="w-full border rounded px-3 py-2">
            <option value="upcoming">Upcoming</option>
            <option value="waiting_approval">Waiting for Approval</option>
          </select>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-3 mt-4">
          <button
            type="button"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            @click="closeModal"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Shift
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useShiftStore } from "@/stores/shifts";
import { useCompanyStore } from "@/stores/company";
import { useUserStore } from "@/stores/users";
import { useRoleStore } from "@/stores/roles";

const companyStore = useCompanyStore();
const userStore = useUserStore();
const roleStore = useRoleStore();

onMounted(async () => {
  await userStore.fetchUsers();
  if (companyStore.company) {
    await roleStore.fetchRolesByCompany(companyStore.company.company_id);
    await roleStore.fetchDefaultRoles();
  }
});

const props = defineProps<{
  companyId: number;
  isOpen: boolean;
}>();

const emits = defineEmits(["close", "shiftCreated"]);

const shiftStore = useShiftStore();
const selectedUserId = ref<number | null>(null);

const form = ref({
  date: "",
  assigned_start_time: "",
  assigned_end_time: "",
  status: "upcoming",
});


const handleSubmit = async () => {
  if (!selectedUserId.value) {
    alert("Please select a user");
    return;
  }

  try {
    const newShift = await shiftStore.createShift({
      user_id: selectedUserId.value,
      company_id: props.companyId, // ignored in backend (but needed for TS type)
      role_id: 0, // ignored in backend
      date: form.value.date,
      assigned_start_time: form.value.assigned_start_time,
      assigned_end_time: form.value.assigned_end_time,
      start_time: null,
      end_time: null,
      status: form.value.status,
    });

    emits("shiftCreated", newShift);
    closeModal();
  } catch (error) {
    console.error(error);
    alert("Failed to create shift.");
  }
};

const closeModal = () => {
  emits("close");
};

const roleName = (roleId: number) => {
  const role =
    roleStore.defaultRoles.find(r => r.role_id === roleId) ||
    roleStore.roles.find(r => r.role_id === roleId);
  return role ? role.name : "Unknown";
};

// Fetch users whenever the modal opens
watch(
  () => props.isOpen,
  (val) => {
    if (val) userStore.fetchUsers();
  }
);
</script>
