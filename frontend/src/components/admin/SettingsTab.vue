<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Company Settings</h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium">Company Name</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Company Email</label>
        <input
          v-model="form.email"
          type="email"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Tax ID</label>
        <input
          v-model="form.tax_id"
          type="text"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Phone</label>
        <input
          v-model="form.phone"
          type="text"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Headquarters Address</label>
        <input
          v-model="form.headquarters_address"
          type="text"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label class="block text-sm font-medium">Industry Type</label>
        <input
          v-model="form.industry_type"
          type="text"
          class="w-full border rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        :disabled="loading"
      >
        {{ loading ? "Saving..." : "Save Changes" }}
      </button>

      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed } from "vue";
import { useCompanyStore } from "@/stores/company";

const companyStore = useCompanyStore();
const companyId = companyStore.company.company_id; // Replace with dynamic company ID if needed

const form = reactive({
  name: "",
  email: "",
  tax_id: "",
  phone: "",
  headquarters_address: "",
  industry_type: "",
});

const loading = computed(() => companyStore.loading);
const error = computed(() => companyStore.error);

onMounted(async () => {
  await companyStore.fetchCompanyById(companyId);
  if (companyStore.company) {
    Object.assign(form, companyStore.company);
  }
});

const handleSubmit = async () => {
  await companyStore.updateCompany(companyId, form);
};
</script>

