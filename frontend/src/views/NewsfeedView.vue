<template>
    <NewsCreate/>
<div class="container mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
    <NewsList/>
</div>

</template>
<script lang="ts" setup>
import NewsCreate from '@/components/news/newsCreate.vue';
import NewsList from '@/components/news/newsList.vue';
import NewsPost from '@/components/news/newsPost.vue';


</script>