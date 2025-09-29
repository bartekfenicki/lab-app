<template>
    <!-- Loop through news posts -->
    <article
      v-for="post in newsStore.posts"
      :key="post.news_id"
      @click="openPost(post)"
      class="overflow-hidden bg-gray-50 rounded-lg w-full max-w-80 sm:w-72 lg:w-96 shadow-sm mx-auto m-10 transition hover:shadow-lg cursor-pointer"
    >
      <!-- Image -->
      <img
        :alt="post.title"
        :src="post.image || placeholderImage"
        class="h-56 w-full object-cover"
      />

      <!-- Card content -->
      <div class="bg-gray-50 p-4 sm:p-6">
        <time :datetime="post.created_at" class="block text-xs text-gray-500">
          {{ formatDate(post.created_at) }}
        </time>
        <h3 class="mt-0.5 text-lg text-gray-900">
          {{ post.title }}
        </h3>
        <p class="mt-2 line-clamp-3 text-sm text-gray-500">
          {{ post.description }}
        </p>
        <p class="mt-2 text-xs text-gray-400">
          By <span class="font-medium text-gray-600">{{ authorName(post.created_by) }}</span>
        </p>
      </div>
    </article>
  

  <!-- Modal -->
  <transition name="fade">
    <div
      v-if="selectedPost"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center overflow-auto p-4"
    >
      <div class="bg-white rounded-lg w-full max-w-5xl flex flex-col md:flex-row overflow-hidden relative">
        <!-- Exit button -->
        <button
          @click="selectedPost = null"
          class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl font-bold"
        >
          &times;
        </button>

        <!-- Image -->
        <img
          :src="selectedPost.image || placeholderImage"
          alt=""
          class="w-full md:w-1/2 h-64 md:h-auto object-cover"
        />

        <!-- Content -->
        <div class="p-6 flex flex-col justify-between md:w-1/2">
          <div>
            <time :datetime="selectedPost.created_at" class="block text-sm text-gray-500 mb-2">
              {{ formatDate(selectedPost.created_at) }}
            </time>
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">
              {{ selectedPost.title }}
            </h2>
            <p class="text-gray-600 mb-4">
              {{ selectedPost.description }}
            </p>
            <p class="text-sm text-gray-400">
              By <span class="font-medium text-gray-600">{{ authorName(selectedPost.created_by) }}</span>
            </p>
          </div>

          <!-- Like button -->
         <LikeButton :postId="selectedPost.news_id" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useNewsStore } from "@/stores/news";
import { useUserStore } from "@/stores/users";
import { useCompanyStore } from "@/stores/company";
import LikeButton from "./likeButton.vue";

const newsStore = useNewsStore();
const userStore = useUserStore();
const companyStore = useCompanyStore()

const selectedPost = ref<any | null>(null);
const placeholderImage = "https://via.placeholder.com/400x250?text=No+Image";

// ✅ Load posts and users on mount
onMounted(async () => {
  await userStore.fetchUsers();
 if (companyStore.company) {
    await newsStore.fetchPostsByCompany(companyStore.company.company_id);
  }
});

// ✅ Open modal
const openPost = (post: any) => {
  selectedPost.value = post;
};

// ✅ Format date
const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString();
};

// ✅ Resolve author name
const authorName = (userId: number) => {
  const user = userStore.users.find((u) => u.user_id === userId);
  return user ? `${user.first_name} ${user.last_name}` : "Unknown";
};
</script>
