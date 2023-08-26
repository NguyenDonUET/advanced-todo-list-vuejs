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
                    <div class="form-control">
                        <label for="title">Tiêu đề</label>
                        <Field
                            name="title"
                            as="input"
                            class="input"
                            id="title"
                            v-model="editedTitle"
                            v-autofocus
                        />
                        <ErrorMessage class="error" name="title" />
                    </div>
                    <div class="form-control">
                        <label for="description">Mô tả</label>
                        <Field
                            name="description"
                            as="textarea"
                            class="textarea"
                            id="description"
                            v-model="editedDescription"
                        />
                        <ErrorMessage class="error" name="description" />
                    </div>

                    <div class="radio-group">
                        <label>Mức độ ưu tiên</label>
                        <div class="control">
                            <label
                                class="radio"
                                v-for="{ as, name, value, label } in radios"
                                :key="name"
                            >
                                <Field
                                    :as="as"
                                    type="radio"
                                    :name="name"
                                    :value="value"
                                    v-model="selectedPriority"
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
                            v-model="selectedDeadline"
                        />
                        <ErrorMessage class="error" name="deadline" />
                    </div>

                    <div class="buttons mt-3">
                        <slot name="btnAdd" />
                        <slot name="btnEdit" />
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
import { convertDateToISOFormat } from "@/utils/convertDateFormat";
import { vAutofocus } from "@/directives/vAutofocus.js";

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    handleFuntion: {
        type: Function,
        required: true,
    },
    todo: {
        type: Object,
        required: false,
    },
});

const handleSubmit = (value) => {
    const { title, description, priority, deadline } = value;
    if (!title || !deadline || !description || !priority) {
        return;
    }
    props.handleFuntion(value);
    closeModal();
};

const selectedDeadline = ref("");
const selectedPriority = ref("");
const editedTitle = ref("");
const editedDescription = ref("");

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
            const result = (originalValue, "dd.MM.yyyy", new Date());
            return result;
        })
        .typeError("error")
        .required("Vui lòng chọn ngày")
        .min("2023-08-19", "Thời gian không hợp lệ"),
});

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
    if (props.todo) {
        // console.log("🚀 ~ props.todo:", props.todo);
        const { deadline, priority, title, description } = props.todo;
        const formatedDate = convertDateToISOFormat(deadline);
        selectedPriority.value = priority;
        selectedDeadline.value = formatedDate;
        editedTitle.value = title;
        editedDescription.value = description;
    }
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
