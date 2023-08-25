<template>
    <header class="header">
        <nav class="navbar pt-2" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <router-link to="/" class="navbar-item">
                    <img class="logo" src="/images/logo.png" />
                </router-link>

                <a
                    role="button"
                    class="navbar-burger burger"
                    :class="{ 'is-active': showMobileNav }"
                    @click="showMobileNav = !showMobileNav"
                    aria-label="menu"
                    aria-expanded="false"
                    data-target="header-navbar"
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div
                id="header-navbar"
                :class="[{ 'is-active': showMobileNav }, 'navbar-menu']"
            >
                <div class="navbar-start"></div>

                <div class="navbar-end">
                    <!-- <pre>{{ isLoggedIn ? "True" : "false" }} </pre> -->

                    <!-- Khi chưa login in -->
                    <div class="navbar-item" v-if="!isLoggedIn">
                        <div class="buttons">
                            <RouterLink
                                to="/register"
                                class="button is-primary"
                            >
                                <strong>Đăng ký</strong>
                            </RouterLink>
                            <RouterLink to="/login" class="button is-light">
                                Đăng nhập
                            </RouterLink>
                        </div>
                    </div>
                    <!-- Khi đã login in mới hiện -->
                    <div
                        v-if="isLoggedIn"
                        class="navbar-item has-dropdown"
                        :class="{ 'is-hoverable': true }"
                    >
                        <p class="navbar-link">
                            {{ user.displayName }}
                        </p>
                        <div class="navbar-dropdown">
                            <p class="navbar-item">{{ user.email }}</p>
                            <hr class="navbar-divider" />
                            <RouterLink
                                @click="handleLogout"
                                to="/login"
                                class="navbar-item"
                                >Đăng xuất</RouterLink
                            >
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { auth } from "../firebase/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useTodosStore } from "@/store/todosStore";
/**
 * Store
 */
const store = useTodosStore();
const { user, isLoggedIn } = storeToRefs(store);
const { logout, initialUser } = store;

const router = useRouter();
const showMobileNav = ref(false);

const handleLogout = () => {
    signOut(auth)
        .then(() => {
            logout();
        })
        .catch((error) => console.log(error.message));
};

// nếu đã login
onMounted(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            initialUser(user);
        } else {
            router.push("/login");
        }
    });
});

// onMounted(() => {
//     onAuthStateChanged(auth, (user) => {
//         if (user) {
//             isLoggedIn.value = true;
//         } else {
//             isLoggedIn.value = false;
//         }
//     });
// });
</script>

<style scoped>
@media (max-width: 1023px) {
    .navbar-menu {
        position: absolute;
        left: 0;
        width: 100%;
    }
}
.logo {
    max-width: 100%;
    display: block;
    height: 28px;
}
</style>
