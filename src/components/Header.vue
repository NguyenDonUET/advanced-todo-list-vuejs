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
                <div class="navbar-start">
                    <!-- Khi đã login in mới hiện -->
                    <!-- <a class="navbar-item"> Trang chủ </a>

                    <a class="navbar-item"> Thống kê </a> -->
                </div>

                <div class="navbar-end">
                    <div class="navbar-item">
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
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { ref } from "vue";

const showMobileNav = ref(false);
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
