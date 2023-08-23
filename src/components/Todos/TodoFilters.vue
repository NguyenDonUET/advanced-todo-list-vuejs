<template>
    <div class="todo-filters is-flex">
        <div class="select is-primary">
            <select
                name="priority"
                title="Priority"
                v-model="priority"
                @change="handleSelectPriority"
            >
                <option value="">Mức độ ưu tiên</option>
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
            </select>
        </div>
        <div class="select is-primary">
            <select
                name="status"
                title="Status"
                v-model="status"
                @change="handleSelectStatus"
            >
                <option value="">Trạng thái</option>
                <option value="true">Hoàn thành</option>
                <option value="false">Chưa hoàn thành</option>
                <!-- <option value="expired">Hết hạn</option> -->
            </select>
        </div>
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
const { priority, status } = storeToRefs(store);
const { filterTodosByPriority, filterTodosByStatus } = store;

const handleSelectPriority = () => {
    filterTodosByPriority();
};
const handleSelectStatus = () => {
    filterTodosByStatus();
};
</script>

<style scoped>
.todo-filters {
    gap: 4px;
    justify-content: space-between;
}

@media screen and (min-width: 425px) {
    .todo-filters .select {
        font-size: 1.1rem;
    }
    .todo-filters {
        gap: 12px;
    }
}
</style>
