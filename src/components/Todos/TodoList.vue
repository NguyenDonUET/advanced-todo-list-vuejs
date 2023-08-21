<template>
    <div class="wrapper my-5 px-2">
        <div class="empty-list-notification" v-if="todoList.length <= 0">
            <figure class="image">
                <img src="/images/empty-list-img.png" />
            </figure>
            <p class="is-size-4 mt-4 has-text-centered">Danh sách đang trống</p>
        </div>
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

.empty-list-notification .image {
    display: flex;
    justify-content: center;
}
.image img {
    max-width: 100%;
    width: auto;
}
.empty-list-notification p {
    font-style: italic;
    color: grey;
}
</style>
