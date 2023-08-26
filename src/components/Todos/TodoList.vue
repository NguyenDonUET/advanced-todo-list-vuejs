<template>
    <div class="wrapper my-5 px-2">
        <div
            class="empty-list-notification"
            v-if="!isLoading && visibleTodos?.length <= 0"
        >
            <figure class="image">
                <img src="/images/empty-list-img.png" />
            </figure>
            <p class="is-size-4 mt-4 has-text-centered">Danh sách trống</p>
        </div>
        <div v-if="!isLoading" class="todo-list is-3">
            <TodoItem v-for="todo in visibleTodos" :key="todo.id" :todo="todo">
            </TodoItem>
        </div>
        <h1 v-if="isLoading" class="is-size-2">Đang tải...</h1>
    </div>
</template>

<script setup>
import TodoItem from "@/components/Todos/TodoItem.vue";
import { useTodosStore } from "@/store/todosStore";
import { storeToRefs } from "pinia";
import { db } from "@/firebase/firebase";
import { onMounted, ref, reactive } from "vue";
import { collection, getDocs, onSnapshot } from "firebase/firestore";

/**
 * Store
 */

const store = useTodosStore();
const { visibleTodos } = storeToRefs(store);
const { isLoading } = storeToRefs(store);
const { getTodosFromDB, initialUser } = store;

onMounted(() => {
    getTodosFromDB();
});
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
