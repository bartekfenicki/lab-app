<template>
  <div v-if="authStore.user && companyStore.company" class="">
    <p class="text-blue-500 text-xl text-center">
       <strong>{{ companyStore.company.name }}</strong>
    </p>
  </div>
</template>
<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useCompanyStore } from "@/stores/company";

const authStore = useAuthStore();
const companyStore = useCompanyStore();
</script>