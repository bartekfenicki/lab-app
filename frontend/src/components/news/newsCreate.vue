<template>
  <div>
    <!-- Create Post Button -->
    <button
      v-if="canCreate"
      @click="showForm = true"
      class="px-6 py-2 mt-6 ms-6 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 flex items-center"
    >
      + Create Post
    </button>

    <!-- Modal -->
    <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 class="text-lg font-bold mb-4">Create News Post</h2>
        <form @submit.prevent="submit">
          <input
            v-model="title"
            placeholder="Title"
            class="w-full mb-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <textarea
            v-model="description"
            placeholder="Description"
            class="w-full mb-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          ></textarea>
          <input
            type="file"
            name="image"
            accept="image/*"
            @change="handleFile"
            class="w-full mb-4 p-2 border rounded"
          />

          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="closeForm"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              :disabled="loading"
            >
              <span v-if="loading" class="loader mr-2"></span>
              {{ loading ? "Creating..." : "Create" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useNewsStore } from "@/stores/news";
import { useAuthStore } from "@/stores/auth";

const newsStore = useNewsStore();
const authStore = useAuthStore();

const showForm = ref(false);
const title = ref("");
const description = ref("");
const file = ref<File | null>(null);
const loading = ref(false);

// ✅ Allow only admins (1), managers (2), editors (3)
const canCreate = computed(() =>
  authStore.user && [1, 2, 3].includes(authStore.user.role_id)
);

// Handle file selection
const handleFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    file.value = target.files[0];
  }
};

// Reset and close form
const closeForm = () => {
  showForm.value = false;
  title.value = "";
  description.value = "";
  file.value = null;
};

// Submit new post using Pinia store
const submit = async () => {
  try {
    await newsStore.createPost({
      title: title.value,
      description: description.value,
      image: file.value, // Can be File or null
    });
    closeForm();
  } catch (err: any) {
    console.error("Failed to create post:", err.message);
  }
};
</script>

