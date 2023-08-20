<template>
    <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card px-2" ref="modalRef">
            <header class="modal-card-head">
                <slot name="title" />
                <button
                    @click="closeModal()"
                    class="delete"
                    aria-label="close"
                ></button>
            </header>
            <section class="modal-card-body">
                <Form
                    @submit="handleSubmit"
                    :validation-schema="schema"
                    class="form-group"
                >
                    <div
                        class="form-control"
                        v-for="{ name, label, as, ...attrs } in formElements"
                        :key="name"
                    >
                        <label :for="name">{{ label }}</label>
                        <Field
                            :name="name"
                            :as="as"
                            :class="as"
                            :id="name"
                            v-bind="attrs"
                        />
                        <ErrorMessage class="error" :name="name" />
                    </div>

                    <div class="radio-group">
                        <label>Mức độ ưu tiên</label>
                        <div class="control">
                            <label
                                class="radio"
                                v-for="{
                                    as,
                                    name,
                                    value,
                                    label,
                                    checked,
                                } in radios"
                                :key="name"
                            >
                                <Field
                                    :as="as"
                                    type="radio"
                                    :name="name"
                                    :value="value"
                                />
                                {{ label }}
                            </label>
                        </div>
                        <ErrorMessage class="error" name="priority" />
                    </div>
                    <!-- Ngày hoàn thành -->
                    <div class="form-control">
                        <label for="deadline">Ngày hoàn thành</label>
                        <Field
                            name="deadline"
                            as="input"
                            id="deadline"
                            type="date"
                            class="date"
                        />
                        <ErrorMessage class="error" name="deadline" />
                    </div>

                    <div class="buttons mt-3">
                        <button type="submit" class="button is-success">
                            Lưu
                        </button>
                        <button @click="closeModal()" class="button">
                            Cancel
                        </button>
                    </div>
                </Form>
            </section>
        </div>
    </div>
</template>

<script setup>
// Imports
import { onClickOutside } from "@vueuse/core";
import { computed, onMounted, onUnmounted, ref } from "vue";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useTodosStore } from "@/store/todosStore";
/**
 * Store
 */

const store = useTodosStore();
const { createNewTodo } = store;
console.log("🚀 ~ createNewTodo:", createNewTodo);

const handleSubmit = (value) => {
    createNewTodo(value);
};

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
});

const schema = yup.object({
    title: yup.string().required("Vui lòng nhập tiêu đề"),
    description: yup.string().required("Vui lòng nhập mô tả"),
    priority: yup.string().required("Vui lòng chọn mức độ ưu tiên"),
    deadline: yup
        .date()
        .transform(function (value, originalValue) {
            if (this.isType(value)) {
                return value;
            }
            const result = parse(originalValue, "dd.MM.yyyy", new Date());
            return result;
        })
        .typeError("error")
        .required("Vui lòng chọn ngày")
        .min("2023-08-19", "Thời gian không hợp lệ"),
});

const formElements = [
    {
        label: "Tiêu đề",
        name: "title",
        as: "input",
        placeholder: `Nhập tiêu đề`,
    },
    {
        label: "Mô tả",
        name: "description",
        as: "textarea",
        placeholder: `Nhập mô tả`,
    },
];

const radios = [
    {
        as: "input",
        name: "priority",
        value: "low",
        label: "Thấp",
    },

    {
        as: "input",
        name: "priority",
        value: "medium",
        label: "Trung bình",
    },
    {
        as: "input",
        name: "priority",
        value: "high",
        label: "Cao",
        checked: "",
    },
];

const emit = defineEmits(["update:modelValue"]);

const closeModal = () => {
    emit("update:modelValue", false);
};
// click outside modal
const modalRef = ref(null);
onClickOutside(modalRef, closeModal);

// press ESC to close modal
const handlePressEsc = (e) => {
    if (e.key === "Escape") {
        closeModal();
    }
};

onMounted(() => {
    document.addEventListener("keyup", handlePressEsc);
});

onUnmounted(() => {
    document.removeEventListener("keyup", handlePressEsc);
});
</script>

<style scoped>
.form-group,
.form-control {
    display: flex;
    flex-direction: column;
}
.form-group {
    gap: 12px;
}
.form-control {
    gap: 4px;
}
.date {
    height: 40px;
    padding: 0.2rem 1rem;
}
.buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
}

.buttons button {
    width: 82px;
}
.error {
    color: red;
}
</style>
