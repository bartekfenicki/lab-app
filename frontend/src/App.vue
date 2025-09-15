<script setup lang="ts">
import { RouterView , useRoute} from 'vue-router';
import DesktopNav from './components/desktopNav.vue';

const route = useRoute()
</script>

<template>
    <DesktopNav v-if="route.path !== '/auth' && route.path !== '/register'" />

    <RouterView/>
</template>

<style scoped></style>
