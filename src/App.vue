<template>
    <div class="container">
        <Header />
        <RouterView></RouterView>
    </div>
</template>
<script setup>
import Header from "@/components/Header.vue";
</script>

<style>
@import "bulma/css/bulma.min.css";
html,
body {
    height: 100%;
}

#app {
    height: 100%;
}

.container {
    height: 100%;
}
</style>
