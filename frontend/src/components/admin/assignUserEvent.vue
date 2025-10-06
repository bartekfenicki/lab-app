<!-- AssignUsersSelect.vue -->
<template>
  <div class="w-full">
    <label class="block text-sm font-semibold mb-1">Assign Users</label>

    <!-- Input box -->
    <div
      class="border rounded p-2 bg-white flex flex-wrap gap-1 cursor-pointer relative"
      @click="toggleDropdown"
    >
      <!-- Selected chips -->
      <span
        v-for="userId in modelValue"
        :key="userId"
        class="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
      >
        {{ userName(userId) }}
        <button
          @click.stop="removeUser(userId)"
          class="text-blue-500 hover:text-blue-700"
        >
          ✕
        </button>
      </span>

      <!-- Placeholder -->
      <span v-if="!modelValue.length" class="text-gray-400 text-sm">
        Select users...
      </span>
    </div>

    <!-- Dropdown -->
    <div
      v-if="dropdownOpen"
      class="absolute mt-1 max-h-40 w-full overflow-y-auto border bg-white rounded shadow z-10"
    >
      <div
        v-for="user in users"
        :key="user.user_id"
        class="px-3 py-2 hover:bg-blue-50 cursor-pointer flex justify-between items-center"
        @click="toggleUser(user.user_id)"
      >
        <span>{{ user.first_name }} {{ user.last_name }}</span>
        <span v-if="modelValue.includes(user.user_id)" class="text-blue-500">✔</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "@/stores/users";
import { useCompanyStore } from "@/stores/company";

const props = defineProps<{
  modelValue: number[];
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: number[]): void;
}>();

const dropdownOpen = ref(false);

const userStore = useUserStore();
const companyStore = useCompanyStore();

const users = computed(() =>
  userStore.users.filter(u => u.company_id === companyStore.company?.company_id)
);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const toggleUser = (id: number) => {
  if (props.modelValue.includes(id)) {
    emit(
      "update:modelValue",
      props.modelValue.filter(u => u !== id)
    );
  } else {
    emit("update:modelValue", [...props.modelValue, id]);
  }
};

const removeUser = (id: number) => {
  emit(
    "update:modelValue",
    props.modelValue.filter(u => u !== id)
  );
};

const userName = (id: number) => {
  const user = users.value.find(u => u.user_id === id);
  return user ? `${user.first_name} ${user.last_name}` : "Unknown";
};

onMounted(() => {
  if (!userStore.users.length) {
    userStore.fetchUsers();
  }
});
</script>
