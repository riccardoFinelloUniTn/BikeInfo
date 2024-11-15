<template>
    <div class="container m-8">
        <h1 class="text-5xl font-bold">{{ page.pageTitle }}</h1>
        <p class="pt-3">{{ page.content }}</p>
    </div>
</template>

<script lang="ts">
export default {
    props: ['page']
}
</script>