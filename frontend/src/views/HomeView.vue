<template>
  <main class="px-4 py-6 sm:px-6 lg:px-8 bg-gray-100 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-6">

      <div
        v-if="!canCreate"
        class="flex justify-center items-center min-h-[70vh]"
      >
        <ShiftManager />
      </div>

      <div
        v-else
        class="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <section class="col-span-1">
          <ShiftManager />
        </section>
        <section class="col-span-1">
          <ManagerHelper />
        </section>
      </div>


      <!-- Middle Row (Events + News) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section class="col-span-1">
          <EventField />
        </section>
        <section class="col-span-1">
          <NewsField />
        </section>
      </div>

    </div>
  </main>
</template>
<script lang="ts" setup>
import EventField from '@/components/home/eventField.vue';
import ManagerHelper from '@/components/home/managerHelper.vue';
import NewsField from '@/components/home/newsField.vue';
import ShiftManager from '@/components/home/shiftManager.vue';
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';

const authStore = useAuthStore()

const canCreate = computed(() =>
  authStore.user && [1, 2, 3].includes(authStore.user.role_id)
);

</script>