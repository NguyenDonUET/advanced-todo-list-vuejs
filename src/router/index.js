import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

import LoginView from "@/views/LoginView.vue";
import SignupView from "@/views/SignupView.vue";
import { checkIsLoggedIn } from "../utils/checkIsLoggedIn";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            name: "Home",
            path: "/",
            component: HomeView,
            beforeEnter() {
                const token = localStorage.getItem("ACCESS_TOKEN");
                if (!token) {
                    router.push("/login");
                }
            },
        },
        {
            name: "Login",
            path: "/login",
            component: LoginView,
            beforeEnter() {
                const token = localStorage.getItem("ACCESS_TOKEN");
                if (token) {
                    router.push("/");
                }
            },
        },
        {
            name: "Register",
            path: "/register",
            component: SignupView,
            beforeEnter() {
                const token = localStorage.getItem("ACCESS_TOKEN");
                if (token) {
                    router.push("/");
                }
            },
        },
        {
            path: "/:catchall(.*)*",
            name: "Not Found",
            component: NotFoundView,
        },
    ],
});

function checkTokenAndRedirect() {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
        router.push("/");
    } else {
        router.push("/login");
    }
}

// Gọi hàm checkTokenAndRedirect()
checkTokenAndRedirect();

export default router;
