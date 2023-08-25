<template>
    <div class="is-flex">
        <p class="control has-icons-left has-icons-right">
            <input
                class="input is-primary"
                v-model="title"
                type="search"
                placeholder="Nhập tên "
            />
            <span class="icon is-small is-left">
                <i class="fa fa-search"></i>
            </span>
        </p>

        <button @click="handleSearch" class="button is-primary ml-3">
            Tìm kiếm
        </button>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useTodosStore } from "@/store/todosStore";
import { storeToRefs } from "pinia";

/**
 * Store
 */
const store = useTodosStore();
const { title } = storeToRefs(store);
const { filterTodosByTitle } = store;

const handleSearch = () => {
    filterTodosByTitle(title.value.trim());
};
</script>

<style scoped>
.control .input {
    padding-right: 8px;
}
</style>
