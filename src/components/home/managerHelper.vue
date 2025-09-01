<template>
  <section
    class="bg-white rounded-xl shadow-md p-6 w-full max-w-3xl mx-auto"
  >
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

    <!-- Forms -->
    <transition name="slide-fade">
      <div v-if="showForm === 'event'" class="p-4 border rounded-lg bg-gray-50 mb-4">
        <h3 class="text-lg font-medium mb-3">New Event</h3>
        <form @submit.prevent="submitEvent" class="space-y-3">
          <input v-model="event.title" placeholder="Event Title" class="w-full p-2 border rounded" />
          <textarea v-model="event.description" placeholder="Description" class="w-full p-2 border rounded"></textarea>
          <input v-model="event.date" type="date" class="w-full p-2 border rounded" />
          <input v-model="event.time" type="time" class="w-full p-2 border rounded" />
          <button
            type="submit"
            class="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Save Event
          </button>
        </form>
      </div>
    </transition>

    <transition name="slide-fade">
      <div v-if="showForm === 'post'" class="p-4 border rounded-lg bg-gray-50 mb-4">
        <h3 class="text-lg font-medium mb-3">New Post</h3>
        <form @submit.prevent="submitPost" class="space-y-3">
          <input v-model="post.title" placeholder="Post Title" class="w-full p-2 border rounded" />
          <textarea v-model="post.content" placeholder="Content" class="w-full p-2 border rounded"></textarea>
          <input v-model="post.image" type="url" placeholder="Image URL" class="w-full p-2 border rounded" />
          <button
            type="submit"
            class="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Publish Post
          </button>
        </form>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";

const showForm = ref<null | "event" | "post">(null);

function toggleForm(type: "event" | "post") {
  showForm.value = showForm.value === type ? null : type;
}

// Event state
const event = ref({
  title: "",
  description: "",
  date: "",
  time: "",
});

function submitEvent() {
  console.log("Event created:", event.value);
  alert(`Event "${event.value.title}" created!`);
  event.value = { title: "", description: "", date: "", time: "" };
  showForm.value = null;
}

// Post state
const post = ref({
  title: "",
  content: "",
  image: "",
});

function submitPost() {
  console.log("Post created:", post.value);
  alert(`Post "${post.value.title}" published!`);
  post.value = { title: "", content: "", image: "" };
  showForm.value = null;
}
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
