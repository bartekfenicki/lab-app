<template>
  <section
    class="bg-white rounded-xl shadow-md p-6 w-full max-w-5xl mx-auto"
  >
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800">Recent News</h2>
      <RouterLink
        to="/news"
        class="text-blue-600 text-sm font-medium hover:underline"
      >
        View All
      </RouterLink>
    </div>

    <!-- News Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="post in recentNews.slice(0, 3)"
        :key="post.id"
        class="rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-gray-50"
      >
        <!-- Image -->
        <img
          :src="post.image"
          :alt="post.title"
          class="h-40 w-full object-cover"
        />

        <!-- Title -->
        <div class="p-3">
          <h3 class="text-sm font-semibold text-gray-800 line-clamp-2">
            {{ post.title }}
          </h3>
        </div>
      </div>
    </div>

    <!-- Footer Button -->
    <div class="mt-4 flex justify-end">
      <RouterLink
        to="/news"
        class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go to News
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";

interface NewsPost {
  id: number;
  title: string;
  image: string;
}

const recentNews: NewsPost[] = [
  {
    id: 1,
    title: "Company Achieves Record Growth in Q2",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
  },
  {
    id: 2,
    title: "New Office Opened in Downtown",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
  },
  {
    id: 3,
    title: "Employee Spotlight: Meet Our Team Lead",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
  }
];
</script>
