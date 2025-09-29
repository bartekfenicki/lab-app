<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Posts</h2>

    <ul class="space-y-2">
      <li
        v-for="post in postStore.posts"
        :key="post.news_id"
        class="flex justify-between items-center bg-gray-100 p-3 rounded shadow-sm"
      >
        <span>{{ post.title }}</span>
        <button
          @click="postStore.deletePost(post.news_id)"
          class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useNewsStore } from "@/stores/news";
import { useCompanyStore } from "@/stores/company";

const postStore = useNewsStore();
const companyStore = useCompanyStore()

onMounted(async () => {
  await postStore.fetchPostsByCompany(companyStore.company.company_id);
});
</script>
