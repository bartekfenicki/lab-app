<template>
  <section class="bg-white rounded-xl shadow-md p-6 w-full max-w-3xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800">Manager Helper</h2>
      <RouterLink
        to="/admin"
        class="text-blue-600 text-sm font-medium hover:underline"
      >
        Go to Admin Panel
      </RouterLink>
    </div>

    <!-- Quick Action Buttons -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <button
        @click="toggleForm('event')"
        class="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
      >
        <span>＋</span> Post Event
      </button>
      <button
        @click="toggleForm('post')"
        class="flex items-center justify-center gap-2 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
      >
        <span>📰</span> Create Post
      </button>
    </div>

    <!-- ====== EVENT CREATION FORM ====== -->
    <transition name="slide-fade">
      <div
        v-if="showForm === 'event'"
        class="p-4 border rounded-lg bg-gray-50 mb-4"
      >
        <h3 class="text-lg font-medium mb-3">New Event</h3>
        <form @submit.prevent="addEvent" class="space-y-3">
          <input
            v-model="form.title"
            placeholder="Event Title"
            class="w-full p-2 border rounded"
          />
          <textarea
            v-model="form.description"
            placeholder="Description"
            class="w-full p-2 border rounded"
          ></textarea>
          <input type="date" v-model="form.date" class="border p-2 rounded w-full" />
          <input type="time" v-model="form.event_start" class="border p-2 rounded w-full" />
          <input type="time" v-model="form.event_end" class="border p-2 rounded w-full" />
          <AssignUserEvent v-model="form.assigned_users" />
          <input type="file" @change="onFileChange" />
          <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Create Event
          </button>
        </form>
      </div>
    </transition>

    <!-- ====== POST CREATION FORM ====== -->
    <transition name="slide-fade">
      <div
        v-if="showForm === 'post'"
        class="p-4 border rounded-lg bg-gray-50 mb-4"
      >
        <h3 class="text-lg font-medium mb-3">New Post</h3>
        <form @submit.prevent="submitPost" class="space-y-3">
          <input
            v-model="title"
            placeholder="Post Title"
            class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <textarea
            v-model="description"
            placeholder="Content"
            class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          ></textarea>
          <input
            type="file"
            name="image"
            accept="image/*"
            @change="handleFile"
            class="w-full p-2 border rounded"
          />

          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="resetPostForm"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition flex items-center justify-center"
              :disabled="loading"
            >
              <span v-if="loading" class="loader mr-2"></span>
              {{ loading ? "Publishing..." : "Publish Post" }}
            </button>
          </div>
        </form>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { RouterLink } from "vue-router";
import AssignUserEvent from "@/components/admin/assignUserEvent.vue";
import { useEventsStore } from "@/stores/events";
import { useNewsStore } from "@/stores/news";
import { useUserStore } from "@/stores/users";
import { useCompanyStore } from "@/stores/company";

const eventsStore = useEventsStore();
const newsStore = useNewsStore();
const userStore = useUserStore();
const companyStore = useCompanyStore();

const showForm = ref<null | "event" | "post">(null);

function toggleForm(type: "event" | "post") {
  showForm.value = showForm.value === type ? null : type;
}

/* ========= EVENT CREATION ========= */
const form = reactive({
  title: "",
  description: "",
  date: "",
  event_start: "",
  event_end: "",
  assigned_users: [] as number[],
});

const file = ref<File | null>(null);

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) file.value = target.files[0];
};

const addEvent = async () => {
  if (!form.title || !form.description || !form.date || !form.event_start || !form.event_end) {
    alert("All fields are required");
    return;
  }

  const formData = new FormData();
  formData.append("title", form.title);
  formData.append("description", form.description);
  formData.append("date", form.date);
  formData.append("event_start", form.event_start);
  formData.append("event_end", form.event_end);
  if (file.value) formData.append("image", file.value);
  formData.append("assigned_users", JSON.stringify(form.assigned_users));

  await eventsStore.createEvent(formData);

  // Reset form
  form.title = "";
  form.description = "";
  form.date = "";
  form.event_start = "";
  form.event_end = "";
  form.assigned_users = [];
  file.value = null;
  showForm.value = null;
};

/* ========= POST CREATION ========= */
const title = ref("");
const description = ref("");
const imageFile = ref<File | null>(null);
const loading = ref(false);

const handleFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    imageFile.value = target.files[0];
  }
};

const resetPostForm = () => {
  title.value = "";
  description.value = "";
  imageFile.value = null;
  showForm.value = null;
};

const submitPost = async () => {
  try {
    loading.value = true;
    await newsStore.createPost({
      title: title.value,
      description: description.value,
      image: imageFile.value,
    });
    resetPostForm();
  } catch (err: any) {
    console.error("Failed to publish post:", err.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
