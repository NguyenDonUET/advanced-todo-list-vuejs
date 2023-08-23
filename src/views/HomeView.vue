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
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

import { useTodosStore } from "@/store/todosStore";
/**
 * Store
 */
const store = useTodosStore();
/**
 * Router
 */
const router = useRouter();
</script>

<style scoped>
main {
    min-height: 68%;
}
</style>
