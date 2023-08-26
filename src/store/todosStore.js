import { db } from "@/firebase/firebase";
import { set, ref as refDB, onValue, remove, update } from "firebase/database";
import { collection, orderBy, query } from "firebase/firestore";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { convertDateFormat } from "../utils/convertDateFormat";
import { checkIsLoggedIn } from "../utils/checkIsLoggedIn";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useRouter } from "vue-router";
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

    // khi đăng nhập xong update user
    const login = (userAuth) => {
        user.displayName = userAuth.displayName;
        user.email = userAuth.email;
        isLoggedIn.value = true;
    };

    const signUp = (userName, email, password) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                updateProfile(auth.currentUser, {
                    displayName: userName,
                }).then(() => {
                    const user = auth.currentUser;
                    // thêm account vào realtime
                    const modifiedEmail = user.email.replace(".", ",");
                    const todosRef = refDB(db, `todos/${modifiedEmail}/`);
                    try {
                        set(todosRef, { null: "" });
                        console.log("add user account to realtime");
                    } catch (error) {
                        console.log(error);
                    }
                    console.log("Signup success", user);
                });
            })
            .catch((error) => console.log(error.message));
    };

    // Khi refresh lại trang nếu user đã login thì update state user
    const initialUser = () => {
        onAuthStateChanged(auth, (userInfo) => {
            if (userInfo) {
                isLoggedIn.value = true;
                user.email = userInfo.email;
                user.displayName = userInfo.displayName;
                console.log("email", user.email);
            } else {
                console.log("chưa login");
            }
        });
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
            id: crypto.randomUUID(),
        };
        const modifiedEmail = user.email.replace(".", ",");
        const todosRef = refDB(db, `todos/${modifiedEmail}/${newTodo.id}`);
        try {
            set(todosRef, newTodo);
            console.log("add todo");
        } catch (error) {
            console.log(error);
        }
    };

    const updateTodo = async (todoId, todoInfo) => {
        let todo = todoList.value.find((todo) => todo.id === todoId);
        if (!todo) {
            return;
        }
        const modifiedEmail = user.email.replace(".", ",");
        const todosRef = refDB(db, `todos/${modifiedEmail}/${todoId}`);
        try {
            update(todosRef, todoInfo)
                .then(() => {
                    // update local todos
                    visibleTodos.value = visibleTodos.value.map((todo) =>
                        todo.id === todoId
                            ? {
                                  id: todoId,
                                  ...todoInfo,
                              }
                            : todo
                    );
                    todoList.value = todoList.value.map((todo) =>
                        todo.id === todoId
                            ? {
                                  id: todoId,
                                  ...todoInfo,
                              }
                            : todo
                    );
                    console.log("update success");
                })
                .catch((error) => {
                    console.log(error.message);
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
        const modifiedEmail = user.email.replace(".", ",");
        const todosRef = refDB(db, `todos/${modifiedEmail}/${todoId}`);
        try {
            update(todosRef, {
                ...todo,
                completed,
            })
                .then(() => {
                    // update local todos
                    visibleTodos.value = visibleTodos.value.map((todo) =>
                        todo.id === todoId
                            ? {
                                  ...todo,
                                  completed,
                              }
                            : todo
                    );
                    todoList.value = todoList.value.map((todo) =>
                        todo.id === todoId
                            ? {
                                  ...todo,
                                  completed,
                              }
                            : todo
                    );
                    console.log("toggle success");
                })
                .catch((error) => {
                    console.log(error.message);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const deleteTodo = (todoId) => {
        let index = todoList.value.findIndex((todo) => todo.id === todoId);
        const modifiedEmail = user.email.replace(".", ",");
        const todosRef = refDB(db, `todos/${modifiedEmail}/${todoId}`);

        if (index !== -1) {
            // xóa trong db
            remove(todosRef)
                .then(() => {
                    console.log("remove todo");
                    // xóa trên UI
                    visibleTodos.value = visibleTodos.value.filter(
                        (todo) => todo.id !== todoId
                    );
                })
                .catch((error) => console.log(error.message));
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

    async function getTodosFromDB(query) {
        isLoading.value = true;
        console.log("get data");

        try {
            onAuthStateChanged(auth, (userInfo) => {
                if (userInfo) {
                    isLoggedIn.value = true;
                    user.email = userInfo.email;
                    user.displayName = userInfo.displayName;
                    //     sau khi có user
                    const modifiedEmail = user.email.replace(".", ",");

                    const todosRef = refDB(db, `todos/${modifiedEmail}`);
                    onValue(todosRef, (snapshot) => {
                        const data = snapshot.val();
                        isLoading.value = false;
                        let todos = [];
                        for (const key of Object.keys(data)) {
                            // update visibleTodo và todoList
                            if (key !== "null") {
                                todos.push(data[key]);
                            }
                        }
                        visibleTodos.value = todos;
                        todoList.value = todos;
                    });
                } else {
                    isLoading.value = false;
                    console.log("user chưa login");
                }
            });
        } catch (error) {
            console.log(error.message);
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
        signUp,
    };
});
