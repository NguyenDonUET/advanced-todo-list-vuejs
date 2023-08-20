<template>
    <div class="todo-item" :class="priority">
        <div class="todo-head">
            <input type="checkbox" class="checkbox" :checked="todo.completed" />
            <h3 class="todo-title">{{ todo.title }}</h3>
        </div>
        <div class="todo-body">
            <p>{{ todo.description }}</p>
        </div>
        <div class="is-flex mt-4">
            <p class="has-text-weight-bold">HẾT HẠN: {{ todo.deadline }}</p>
            <div class="todo-buttons ml-auto is-flex">
                <button class="button is-info is-small mr-1">
                    <span class="icon is-small">
                        <i class="fa fa-edit"></i>
                    </span>
                    <span>Edit</span>
                </button>
                <button
                    @click="deleteTodo(todo.id)"
                    class="button is-danger is-small"
                >
                    <span class="icon is-small">
                        <i class="fa fa-trash-alt"></i>
                    </span>
                    <span>Delete </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
    todo: {
        type: Object,
        required: true,
    },
});
const { priority } = props.todo;
import { useTodosStore } from "@/store/todosStore";
/**
 * Store
 */
const store = useTodosStore();
const { deleteTodo } = store;

// const isExpired = checkIsExpiredDate();

const showDetail = ref(true);
</script>
<style scoped>
.todo-item {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    align-self: flex-start;
    background-color: hsl(210, 20%, 96%);
    padding: 16px 22px;
}
.todo-item.medium {
    background: hsl(48, 100%, 67%);
}
.todo-item.high {
    background: hsl(348, 100%, 42%);
}
.todo-head {
    display: flex;
    align-items: center;
    border-radius: 4px;
    gap: 8px;
}
.todo-title {
    font-weight: bold;
    cursor: pointer;
    font-size: 20px;
}

/* custom checkbox */
input[type="checkbox"] {
    /* Add if not using autoprefixer */
    -webkit-appearance: none;
    /* Remove most all native input styles */
    appearance: none;
    /* For iOS < 15 */
    background-color: #fff;
    /* Not removed via appearance */
    margin: 0;

    font: inherit;
    color: currentColor;
    width: 1.15em;
    height: 1.15em;
    border: 0.15em solid currentColor;
    border-radius: 0.15em;
    transform: translateY(-0.075em);

    display: grid;
    place-content: center;
}

input[type="checkbox"]::before {
    content: "";
    width: 0.65em;
    height: 0.65em;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    transform: scale(0);
    transform-origin: bottom left;
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em #00d1b2;
    /* Windows High Contrast Mode */
    background-color: CanvasText;
}
input[type="checkbox"]:checked::before {
    transform: scale(1);
}

input[type="checkbox"]:focus {
    outline: max(2px, 0.15em) solid currentColor;
    outline-offset: max(2px, 0.15em);
}

input[type="checkbox"]:disabled {
    --form-control-color: var(--form-control-disabled);

    color: var(--form-control-disabled);
    cursor: not-allowed;
}
</style>
