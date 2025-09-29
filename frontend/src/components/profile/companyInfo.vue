<template>
  <div class="bg-white shadow rounded-xl p-6">
    <h3 class="text-lg font-semibold mb-4">Company Information</h3>
    <ul class="space-y-3 text-gray-700">
      <li class="flex justify-between">
        <span class="font-medium">Company Name:</span>
        <span>{{ company?.name }}</span>
      </li>
      <li class="flex justify-between">
        <span class="font-medium">Email:</span>
        <span>{{ company?.email }}</span>
      </li>
      <li class="flex justify-between">
        <span class="font-medium">Tax ID:</span>
        <span>{{ company?.tax_id }}</span>
      </li>
      <li class="flex justify-between">
        <span class="font-medium">Phone:</span>
        <span>{{ company?.phone || "Not set" }}</span>
      </li>
      <li class="flex justify-between">
        <span class="font-medium">Address:</span>
        <span>{{ company?.headquarters_address || "Not set" }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCompanyStore } from "@/stores/company";

const companyStore = useCompanyStore();
const company = computed(() => companyStore.company);
</script>
