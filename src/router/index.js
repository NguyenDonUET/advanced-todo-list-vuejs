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
        },
        {
            name: "Login",
            path: "/login",
            component: LoginView,
            beforeEnter() {
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        router.push("/");
                    }
                });
            },
        },
        {
            name: "Register",
            path: "/register",
            component: SignupView,
        },
        {
            path: "/:catchall(.*)*",
            name: "Not Found",
            component: NotFoundView,
        },
    ],
});

export default router;
