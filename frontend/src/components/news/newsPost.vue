<template>
  <!-- Article Card -->
  <article
    @click="openModal = true"
    class="overflow-hidden mx-auto rounded-lg w-full max-w-80 sm:w-72 lg:w-96 shadow-sm m-10 transition hover:shadow-lg cursor-pointer"
  >
    <img
      alt=""
      src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80"
      class="h-56 w-full object-cover"
    />
    <div class="bg-gray-50 p-4 sm:p-6">
      <time datetime="2022-10-10" class="block text-xs text-gray-500">10th Oct 2022</time>
      <h3 class="mt-0.5 text-lg text-gray-900">How to position your furniture for positivity</h3>
      <p class="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae dolores, possimus
        pariatur animi temporibus nesciunt praesentium dolore sed nulla ipsum eveniet corporis quidem...
      </p>
    </div>
  </article>

  <!-- Modal -->
  <transition name="fade">
    <div
      v-if="openModal"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center overflow-auto p-4"
    >
      <div class="bg-white rounded-lg w-full max-w-5xl flex flex-col md:flex-row overflow-hidden relative">
        <!-- Exit button -->
        <button
          @click="openModal = false"
          class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl font-bold"
        >
          &times;
        </button>

        <!-- Image -->
        <img
          src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80"
          alt=""
          class="w-full md:w-1/2 h-64 md:h-auto object-cover"
        />

        <!-- Content -->
        <div class="p-6 flex flex-col justify-between md:w-1/2">
          <div>
            <time datetime="2022-10-10" class="block text-sm text-gray-500 mb-2">10th Oct 2022</time>
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">
              How to position your furniture for positivity
            </h2>
            <p class="text-gray-600 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae dolores, possimus
              pariatur animi temporibus nesciunt praesentium dolore sed nulla ipsum eveniet corporis
              quidem, mollitia itaque minus soluta, voluptates neque explicabo tempora nisi culpa eius
              atque dignissimos. Molestias explicabo corporis voluptatem? Lorem ipsum dolor sit amet,
              consectetur adipisicing elit.
            </p>
          </div>

          <!-- Like button -->
          <button
            class="mt-4 self-end bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            ❤️ Like
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from "vue";

const openModal = ref(false);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
