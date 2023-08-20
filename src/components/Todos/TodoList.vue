<template>
    <div class="wrapper my-5 px-2">
        <div class="todo-list is-3">
            <TodoItem v-for="todo in todoList" :key="todo.id" :todo="todo">
            </TodoItem>
        </div>
    </div>
</template>

<script setup>
import TodoItem from "@/components/Todos/TodoItem.vue";
import { useTodosStore } from "@/store/todosStore";
import { storeToRefs } from "pinia";

/**
 * Store
 */

const store = useTodosStore();
const { todoList } = storeToRefs(store);
</script>

<style scoped>
.todo-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 8px;
}
</style>
