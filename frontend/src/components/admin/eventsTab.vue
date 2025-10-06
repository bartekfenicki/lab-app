<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Manage Events</h2>

    <!-- Add Event Form -->
   <form @submit.prevent="addEvent" class="space-y-4 mb-6 bg-white p-4 rounded shadow">
  <input v-model="form.title" placeholder="Title" class="border p-2 rounded w-full" />
  <textarea v-model="form.description" placeholder="Description" class="border p-2 rounded w-full"></textarea>
  <input type="date" v-model="form.date" class="border p-2 rounded w-full" />
  <input type="time" v-model="form.event_start" class="border p-2 rounded w-full" />
  <input type="time" v-model="form.event_end" class="border p-2 rounded w-full" />

 <!-- Multi-select users -->
<AssignUserEvent v-model="form.assigned_users" />


  <input type="file" @change="onFileChange" />
  <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create Event</button>
</form>

    <!-- Events List -->
    <div v-for="event in eventsStore.events.filter(u => u.company_id === companyStore.company?.company_id)" :key="event.event_id" class="bg-white border rounded-lg p-6 shadow hover:shadow-lg transition mb-4">
  <div class="flex justify-between items-start">
    <div>
      <h3 class="font-bold text-lg text-gray-800">{{ event.title }}</h3>
      <p class="text-gray-600 mt-1">{{ event.description }}</p>
    </div>
    <div v-if="event.image" class="ml-4 flex-shrink-0">
      <img :src="event.image" alt="Event Image" class="w-32 h-20 object-cover rounded-md shadow-sm" />
    </div>
  </div>

  <div class="mt-3 flex space-x-4 text-gray-500 text-sm">
    <p><strong>Date:</strong> {{ formatDate(event.date) }}</p>
    <p><strong>Time:</strong> {{ formatTime(event.event_start) }} - {{ formatTime(event.event_end) }}</p>
  </div>
</div>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useEventsStore } from "@/stores/events";
import { useUserStore } from "@/stores/users";
import { useAuthStore } from "@/stores/auth";
import { useCompanyStore } from "@/stores/company";
import AssignUserEvent from "./assignUserEvent.vue";

const eventsStore = useEventsStore();
const userStore = useUserStore();
const companyStore = useCompanyStore()


const form = reactive({
  title: "",
  description: "",
  date: "",        // YYYY-MM-DD
  event_start: "",
  event_end: "",
  assigned_users: [] as number[],
});

const file = ref<File | null>(null);

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) file.value = target.files[0];
};

const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const formatTime = (timestamp: string | Date) => {
  const d = new Date(timestamp);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

const addEvent = async () => {
  if (!form.title || !form.description || !form.date || !form.event_start || !form.event_end) {
    alert("All fields are required");
    return;
  }

  const formData = new FormData();
  formData.append("title", form.title);
  formData.append("description", form.description);
  
  // Send exactly what backend expects
  formData.append("date", form.date);                 // YYYY-MM-DD
  formData.append("event_start", form.event_start);   // HH:MM
  formData.append("event_end", form.event_end);       // HH:MM

  if (file.value) formData.append("image", file.value);
  formData.append("assigned_users", JSON.stringify(form.assigned_users));

  await eventsStore.createEvent(formData);

  // Reset
  form.title = "";
  form.description = "";
  form.date = "";
  form.event_start = "";
  form.event_end = "";
  form.assigned_users = [];
  file.value = null;
};


onMounted(() => {
  eventsStore.fetchCompanyEvents();
  userStore.fetchUsers();

});
</script>

