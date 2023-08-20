<template>
    <main>
        <Title />
        <TodoFunctions />
        <TodoList />
    </main>
    <Pagination />
</template>

<script setup>
import TodoList from "@/components/Todos/TodoList.vue";
import TodoFunctions from "@/components/Todos/TodoFunctions.vue";
import Pagination from "@/components/Pagination.vue";
import Title from "@/components/Title.vue";
</script>

<style scoped>
main {
    min-height: 68%;
}
</style>
