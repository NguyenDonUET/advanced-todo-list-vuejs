<template>
    <div class="todo-functions is-flex">
        <button
            @click="modal.addTodoForm = true"
            class="button is-primary has-text-weight-semibold"
        >
            <span class="icon is-small">
                <i class="fa fa-add"></i>
            </span>
            <span> THÊM MỚI </span>
        </button>
        <SearchBar />
        <TodoFilters />
    </div>
    <AddEditForm v-if="modal.addTodoForm" v-model="modal.addTodoForm">
        <template #title>
            <p class="modal-card-title has-text-weight-bold is-uppercase">
                Thêm công việc mới
            </p>
        </template>
    </AddEditForm>
</template>

<script setup>
import TodoFilters from "@/components/Todos/TodoFilters.vue";
import AddEditForm from "@/components/Todos/AddEditForm.vue";
import SearchBar from "@/components/SearchBar.vue";
import { ref, reactive } from "vue";

// modals
const modal = reactive({
    addTodoForm: false,
});
</script>

<style scoped>
.todo-functions {
    flex-direction: column;
    justify-content: center;
    gap: 24px;
    padding: 0 1rem;
}
@media screen and (min-width: 768px) {
    .todo-functions {
        flex-direction: row;
        flex-wrap: wrap;
    }
}
@media screen and (min-width: 1024px) {
    .todo-functions {
        flex-wrap: nowrap;
    }
}
@media screen and (min-width: 1440px) {
    .todo-functions {
        justify-content: space-between;
    }
}
</style>
