import { db } from "@/firebase/firebase";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { convertDateFormat } from "../utils/convertDateFormat";

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
];

export const useTodosStore = defineStore("todosStore", () => {
    const user = reactive({});
    const isLoggedIn = ref(false);
    const todoList = ref([]);
    const visibleTodos = ref([]);
    const isLoading = ref(false);

    const priority = ref("");
    const title = ref("");
    const status = ref("");

    const todosCollectionRef = collection(db, "todos");
    const todosCollectionQuery = query(
        todosCollectionRef,
        orderBy("date", "desc")
    );

    // khi đăng nhập xong update user
    const login = (userAuth) => {
        user.displayName = userAuth.displayName;
        user.email = userAuth.email;
        isLoggedIn.value = true;
    };

    // Khi user đã login
    const initialUser = (userInfo) => {
        isLoggedIn.value = true;
        user.displayName = userInfo.displayName;
        user.email = userInfo.email;
    };

    const logout = () => {
        console.log("logout ~ store");
        isLoggedIn.value = false;
    };

    const createNewTodo = async (todo) => {
        const deadline = convertDateFormat(todo.deadline);
        const newTodo = {
            ...todo,
            deadline,
            completed: false,
            date: Date.now(),
        };
        try {
            const docRef = await addDoc(todosCollectionRef, newTodo);
            console.log("thêm success", docRef.id);
        } catch (error) {
            console.log(error);
        }
    };

    const updateTodo = async (todoId, todoInfo) => {
        let todo = todoList.value.find((todo) => todo.id === todoId);
        if (!todo) {
            return;
        }
        try {
            await updateDoc(doc(todosCollectionRef, todoId), {
                ...todoInfo,
                completed: todo.completed,
                deadline: convertDateFormat(todoInfo.deadline),
            });
        } catch (error) {
            console.log(error);
        }
    };

    const toggleTodoStatus = async (todoId, completed) => {
        let todo = todoList.value.find((todo) => todo.id === todoId);
        if (!todo) {
            return;
        }
        try {
            await updateDoc(doc(todosCollectionRef, todoId), {
                ...todo,
                completed,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const deleteTodo = (todoId) => {
        let index = todoList.value.findIndex((todo) => todo.id === todoId);
        if (index !== -1) {
            deleteDoc(doc(todosCollectionRef, todoId));
        }
    };

    const filterTodosByTitle = async () => {
        if (priority.value || status.value) {
            filterTodosByPriority();
            filterTodosByStatus();
            visibleTodos.value = visibleTodos.value.filter((todo) =>
                todo.title.includes(title.value)
            );
        } else {
            visibleTodos.value = todoList.value.filter((todo) =>
                todo.title.includes(title.value)
            );
        }
    };

    const filterTodosByPriority = async () => {
        // nếu ko có đk lọc của status
        if (status.value === "") {
            visibleTodos.value = todoList.value.filter(
                (todo) =>
                    todo.priority.includes(priority.value) &&
                    todo.title.includes(title.value)
            );
        } else {
            visibleTodos.value = todoList.value.filter(
                (todo) =>
                    todo.completed === JSON.parse(status.value) &&
                    todo.priority.includes(priority.value) &&
                    todo.title.includes(title.value)
            );
        }
    };

    const filterTodosByStatus = async () => {
        if (priority.value === "") {
            if (status.value === "") {
                filterTodosByTitle();
            } else
                visibleTodos.value = todoList.value.filter(
                    (todo) =>
                        todo.completed === JSON.parse(status.value) &&
                        todo.title.includes(title.value)
                );
        } else {
            console.log(status.value);
            if (status.value === "") {
                visibleTodos.value = todoList.value.filter(
                    (todo) =>
                        todo.priority.includes(priority.value) &&
                        todo.title.includes(title.value)
                );
            } else
                visibleTodos.value = todoList.value.filter(
                    (todo) =>
                        todo.priority.includes(priority.value) &&
                        todo.completed === JSON.parse(status.value) &&
                        todo.title.includes(title.value)
                );
        }
    };

    function getTodosFromDB(query = todosCollectionQuery) {
        isLoading.value = true;
        try {
            onSnapshot(query, (querySnapshot) => {
                let todos = [];
                querySnapshot.forEach((doc) => {
                    todos.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                });
                todoList.value = todos;
                visibleTodos.value = todos;
                isLoading.value = false;
            });
        } catch (error) {
            console.log(error);
            isLoading.value = false;
            alert("Error getting todos from database", error.message);
        }
    }

    return {
        visibleTodos,
        createNewTodo,
        deleteTodo,
        updateTodo,
        toggleTodoStatus,
        user,
        login,
        logout,
        isLoggedIn,
        initialUser,
        getTodosFromDB,
        isLoading,
        filterTodosByTitle,
        filterTodosByPriority,
        filterTodosByStatus,
        priority,
        status,
        title,
    };
});
