<template>
    <div class="todo-filters is-flex">
        <div class="select is-primary">
            <select name="priority" title="Priority">
                <option>Mức độ ưu tiên</option>
                <option>Cao</option>
                <option>Trung bình</option>
                <option>Thấp</option>
            </select>
        </div>
        <div class="select is-primary">
            <select name="status" title="Status">
                <option>Trạng thái</option>
                <option>Hoàn thành</option>
                <option>Chưa hoàn thành</option>
                <option>Hết hạn</option>
            </select>
        </div>
    </div>
</template>

<script setup></script>

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
