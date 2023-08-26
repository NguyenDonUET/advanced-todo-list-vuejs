import { db } from "@/firebase/firebase";
import {
    onValue,
    query,
    ref as refDB,
    remove,
    set,
    update,
} from "firebase/database";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { convertDateFormat } from "../utils/convertDateFormat";
import { sortByDeadlineAscending } from "../utils/sortByDeadlineAscending";

import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";
import { useRouter } from "vue-router";
import { POSITION, useToast } from "vue-toastification";
import { auth } from "../firebase/firebase";

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

const CRUD_TOAST_OPTIONS = {
    position: POSITION.TOP_RIGHT,
};

export const useTodosStore = defineStore("todosStore", () => {
    const user = reactive({});
    const isLoggedIn = ref(false);
    const todoList = ref([]);
    const visibleTodos = ref([]);
    const isLoading = ref(false);

    const priority = ref("");
    const title = ref("");
    const status = ref("");

    const router = useRouter();
    const toast = useToast();

    // khi đăng nhập xong update user
    const login = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((credential) => {
                const userAuth = credential.user;
                user.displayName = userAuth.displayName;
                user.email = userAuth.email;
                isLoggedIn.value = true;
                localStorage.setItem("ACCESS_TOKEN", userAuth.accessToken);
                localStorage.setItem("USER", JSON.stringify(user));

                toast.success("Đăng nhập thành công");
                router.push("/");
            })
            .catch((error) => {
                switch (error.code) {
                    case "auth/invalid-email":
                        toast.error("Email không hợp lệ.");
                        break;
                    case "auth/user-not-found":
                        toast.error("Email không tồn tại.");
                        break;
                    case "auth/wrong-password":
                        toast.error("Mật khẩu không chính xác.");
                        break;
                    default:
                        console.log(error.message);
                        toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
                }
            });
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

                    set(todosRef, { null: "" })
                        .then(() => {
                            toast.success("Đăng ký thành công", {
                                position: POSITION.TOP_CENTER,
                            });
                            console.log("Signup success", user);
                            router.push("/login");
                        })
                        .catch((error) => {
                            toast.error("Update displayName bị lỗi");
                            console.log(error);
                        });
                });
            })
            .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                    toast.error("Email này đã tồn tại");
                } else {
                    toast.error(error.code);
                }
                console.log(error);
            });
    };

    // Khi refresh lại trang nếu user đã login thì update state user
    const initialUser = (userInfo) => {
        isLoggedIn.value = true;
        user.email = userInfo.email;
        user.displayName = userInfo.displayName;

        console.log("email", user.email);
    };

    const logout = () => {
        console.log("logout ~ store");
        signOut(auth)
            .then(() => {
                isLoggedIn.value = false;
                localStorage.removeItem("ACCESS_TOKEN");
                localStorage.removeItem("USER");
                toast.success("Đăng xuất", {
                    timeout: 1000,
                });
                router.push("/login");
            })
            .catch((error) => console.log(error.message));
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

        set(todosRef, newTodo)
            .then(() => {
                console.log("add todo");
                toast.success("Thêm thành công", CRUD_TOAST_OPTIONS);
            })
            .catch((error) => {
                console.log(error.message);
                toast.error("Thêm thất bại", CRUD_TOAST_OPTIONS);
            });
        title.value = "";
    };

    const updateTodo = async (todoId, todoInfo) => {
        let todo = todoList.value.find((todo) => todo.id === todoId);
        if (!todo) {
            return;
        }
        todoInfo.deadline = convertDateFormat(todoInfo.deadline);
        const modifiedEmail = user.email.replace(".", ",");
        const todosRef = refDB(db, `todos/${modifiedEmail}/${todoId}`);
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
                title.value = "";

                toast.success("Cập nhật thành công", CRUD_TOAST_OPTIONS);
                console.log("update success");
            })
            .catch((error) => {
                console.log(error.message);
                toast.error("Cập nhật thất bại", CRUD_TOAST_OPTIONS);
            });
    };

    const toggleTodoStatus = async (todoId, completed) => {
        let todo = todoList.value.find((todo) => todo.id === todoId);
        if (!todo) {
            return;
        }
        const modifiedEmail = user.email.replace(".", ",");
        const todosRef = refDB(db, `todos/${modifiedEmail}/${todoId}`);
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
                if (completed) {
                    toast.success(
                        "Chúc mừng bạn hoàn thành!",
                        CRUD_TOAST_OPTIONS
                    );
                } else {
                    toast.info("Đánh dấu chưa hoàn thành", CRUD_TOAST_OPTIONS);
                }
            })
            .catch((error) => {
                console.log(error.message);
                toast.error(error.message, CRUD_TOAST_OPTIONS);
            });
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
                    toast.success("Xóa thành công", CRUD_TOAST_OPTIONS);
                })
                .catch((error) => {
                    console.log(error.message);
                    toast.error("Xóa thất bại", CRUD_TOAST_OPTIONS);
                });
        }
    };

    const filterTodosByTitle = async () => {
        if (priority.value || status.value) {
            filterTodosByPriority();
            filterTodosByStatus();
            visibleTodos.value = visibleTodos.value.filter((todo) =>
                todo.title.toLowerCase().includes(title.value.toLowerCase())
            );
        } else {
            visibleTodos.value = todoList.value.filter((todo) =>
                todo.title.toLowerCase().includes(title.value.toLowerCase())
            );
        }
    };

    const filterTodosByPriority = async () => {
        // nếu ko có đk lọc của status
        if (status.value === "") {
            visibleTodos.value = todoList.value.filter(
                (todo) =>
                    todo.priority.includes(priority.value) &&
                    todo.title.toLowerCase().includes(title.value.toLowerCase())
            );
        } else {
            visibleTodos.value = todoList.value.filter(
                (todo) =>
                    todo.completed === JSON.parse(status.value) &&
                    todo.priority.includes(priority.value) &&
                    todo.title.toLowerCase().includes(title.value.toLowerCase())
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
                        todo.title
                            .toLowerCase()
                            .includes(title.value.toLowerCase())
                );
        } else {
            console.log(status.value);
            if (status.value === "") {
                visibleTodos.value = todoList.value.filter(
                    (todo) =>
                        todo.priority.includes(priority.value) &&
                        todo.title
                            .toLowerCase()
                            .includes(title.value.toLowerCase())
                );
            } else
                visibleTodos.value = todoList.value.filter(
                    (todo) =>
                        todo.priority.includes(priority.value) &&
                        todo.completed === JSON.parse(status.value) &&
                        todo.title
                            .toLowerCase()
                            .includes(title.value.toLowerCase())
                );
        }
    };

    const getTodosFromDB = () => {
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

                    const todosRef = query(refDB(db, `todos/${modifiedEmail}`));
                    onValue(todosRef, (snapshot) => {
                        const data = snapshot.val();
                        isLoading.value = false;
                        let todos = [];
                        if (data) {
                            for (const key of Object.keys(data)) {
                                // update visibleTodo và todoList
                                if (key !== "null") {
                                    todos.push(data[key]);
                                }
                            }
                            sortByDeadlineAscending(todos);
                            visibleTodos.value = todos;
                            todoList.value = todos;
                        }
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
    };

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
