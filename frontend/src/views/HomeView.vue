<template>
  <main class="px-4 py-6 sm:px-6 lg:px-8 bg-gray-100 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-6">

      <!-- Top Row (Shift Manager full width on mobile, half width on lg) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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


</script>