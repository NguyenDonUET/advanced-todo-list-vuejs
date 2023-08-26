<template>
    <main>
        <div class="signup">
            <h1
                class="is-size-2 mb-5 has-text-centered has-text-weight-semibold has-text-danger"
            >
                Đăng nhập
            </h1>
            <div class="form-container">
                <Form
                    @submit="handleLogin"
                    :validation-schema="simpleSchema"
                    class="form-group"
                    v-slot="{ errors }"
                >
                    <div class="form-control">
                        <label for="email"> Email </label>
                        <Field
                            name="email"
                            id="email"
                            class="input is-primary"
                            :class="{ 'is-error': errors.email }"
                            placeholder="example@gmail.com"
                            v-autofocus
                        />
                        <ErrorMessage class="error-message" name="email" />
                    </div>
                    <div class="form-control">
                        <label for="password"> Password </label>
                        <Field
                            name="password"
                            class="input is-primary"
                            :class="{ 'is-error': errors.password }"
                            type="password"
                            id="password"
                            placeholder="Mật khẩu có ít nhất 6 ký tự"
                        />
                        <ErrorMessage class="error-message" name="password" />
                    </div>

                    <button class="button mt-2 is-primary has-text-weight-bold">
                        Đăng nhập
                    </button>
                    <p class="has-text-centered mt-4">
                        Chưa có tài khoản?
                        <RouterLink to="/register"> Đăng ký</RouterLink>
                    </p>
                </Form>
            </div>
        </div>
    </main>
</template>

<script setup>
import { auth } from "@/firebase/firebase.js";
import { useTodosStore } from "@/store/todosStore";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { vAutofocus } from "@/directives/vAutofocus.js";

import { ErrorMessage, Field, Form } from "vee-validate";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import * as yup from "yup";
/**
 * Store
 */
const store = useTodosStore();
const { login, initialUser } = store;
/**
 * Router
 */
const router = useRouter();

const simpleSchema = yup.object({
    email: yup
        .string()
        .required("Vui lòng nhập email")
        .email("Email không hợp lệ"),
    password: yup
        .string()
        .required("Vui lòng nhập mật khẩu")
        .min(6, "Mật khẩu cần dài ít nhất 6 ký tự"),
});

const handleLogin = (value) => {
    const { email, password } = value;
    login(email, password);
};

onMounted(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            router.push("/");
        }
    });
});
</script>

<style scoped>
main {
    min-height: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.form-container {
    min-width: 360px;
}

@media screen and (min-width: 768px) {
    .form-container {
        width: 500px;
    }
    .form-control .input {
        font-size: 1.2rem;
    }
}
@media screen and (min-width: 1024px) {
    .form-container {
        width: 540px;
    }
    .form-control .input {
        font-size: 1.12rem;
    }
    .form-container .form-control label {
        font-size: 1rem;
    }
    .form-container .button {
        font-size: 1.3rem;
    }
}

.form-control,
.form-group {
    display: flex;
    flex-direction: column;
}
.form-group {
    gap: 12px;
}
.form-control {
    gap: 4px;
}
.form-control .is-error {
    border: 1px solid red;
}
.form-control label {
    color: hsla(0, 0%, 0%, 0.6);
    font-weight: bold;
    font-size: 1rem;
}
.error-message {
    font-size: 1rem;
    font-style: italic;
    color: red;
}
</style>
