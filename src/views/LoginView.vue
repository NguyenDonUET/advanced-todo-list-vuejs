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
                    @submit="handleSubmit"
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
                </Form>
            </div>
        </div>
    </main>
</template>

<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
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

const handleSubmit = (value) => {
    console.log(value);
};
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
