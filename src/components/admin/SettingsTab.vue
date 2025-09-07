<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Company Settings</h2>
    <form class="space-y-4">
      <div>
        <label class="block text-sm font-medium">Company Name</label>
        <input type="text" class="w-full border rounded px-3 py-2" value="My Company Ltd." />
      </div>
      <div>
        <label class="block text-sm font-medium">Company Email</label>
        <input type="email" class="w-full border rounded px-3 py-2" value="info@company.com" />
      </div>
      <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Save Changes
      </button>
    </form>
  </div>
</template>
