<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from "vue";
import { useNewsStore } from "@/stores/news";
import { useUserStore } from "@/stores/users";
import { useAuthStore } from "@/stores/auth";

const newsStore = useNewsStore();
const authStore = useAuthStore()

const props = defineProps<{ postId: number }>();
watchEffect(() => {
  if (props.postId) {
    newsStore.fetchLikes(props.postId);
  }
});


const showLikesModal = ref(false);

onMounted(() => {
  if (!newsStore.likes[props.postId]) {
    newsStore.fetchLikes(props.postId);
  }
});

const likeCount = computed(() => newsStore.likes[props.postId]?.length || 0);
const hasLiked = computed(() => {
  if (!authStore.user || !newsStore.likes[props.postId]) return false;
  return newsStore.likes[props.postId].some(r => r.user_id === authStore.user.user_id);
});

const toggleLike = async () => {
  if (!authStore.user) return;
  await newsStore.toggleLike(props.postId, authStore.user.user_id);
};

const usersWhoLiked = computed(() => {
  return newsStore.likes[props.postId]?.map(r => r.user_name) || [];
});
</script>

<template>
  <div class="flex items-center justify-between mt-4">
    <!-- Like button -->
    <button
      @click="toggleLike"
      :class="[
        'px-4 py-2 rounded transition',
        hasLiked ? 'bg-red-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
      ]"
    >
      {{ hasLiked ? '❤️ Liked' : '🤍 Like' }}
    </button>

    <!-- Like count -->
    <span
      @click="showLikesModal = true"
      class="text-gray-600 cursor-pointer hover:underline"
    >
      {{ likeCount }} {{ likeCount === 1 ? 'like' : 'likes' }}
    </span>

    <!-- Likes list modal -->
    <transition name="fade">
      <div
        v-if="showLikesModal"
        class="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4"
      >
        <div class="bg-white rounded-lg p-6 w-full max-w-md relative">
          <button
            @click="showLikesModal = false"
            class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
          >
            &times;
          </button>
          <h3 class="text-lg font-semibold mb-4">Liked by</h3>
          <ul>
          <li v-for="user in usersWhoLiked" :key="user" class="border-b py-2">
            {{ user }}
          </li>
        </ul>
        </div>
      </div>
    </transition>
  </div>
</template>
