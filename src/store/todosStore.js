import { reactive } from "vue";
import { defineStore } from "pinia";

const todos = [
    {
        id: 1,
        title: "Todo 1",
        description:
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam veritatis odit dolorem? Lorem ipsum dolor sit amet consectetur, adipisicing elit. hello world...",
        priority: "medium",
        deadline: "30/08/2023",
        completed: true,
    },
    {
        id: 2,
        title: "Todo 2",
        description:
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam veritatis odit dolorem? Lorem ipsum dolor sit amet consectetur, adipisicing elit. hello world...",
        priority: "high",
        deadline: "10/08/2023",
        completed: false,
    },
    {
        id: 3,
        title: "Todo 3",
        description:
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Numquam veritatis odit dolorem? Lorem ipsum dolor sit amet consectetur, adipisicing elit. hello world...",
        priority: "low",
        deadline: "10/08/2023",
        completed: false,
    },
];

export const useTodosStore = defineStore("todosStore", () => {
    const todoList = reactive(todos);

    return { todoList };
});
