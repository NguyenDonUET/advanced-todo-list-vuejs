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
                <DynamicForm :schema="formSchema"> </DynamicForm>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success">Save changes</button>
                <button @click="closeModal()" class="button">Cancel</button>
            </footer>
        </div>
    </div>
</template>

<script setup>
// Imports
import { onClickOutside } from "@vueuse/core";
import { onMounted, onUnmounted, ref } from "vue";
import * as Yup from "yup";
import DynamicForm from "@/components/DynamicForm.vue";

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["update:modelValue"]);

// :schema="formSchema"
const formSchema = {
    fields: [
        {
            label: "Tiêu đề(*)",
            name: "title",
            as: "input",
            type: "text",
            placeholder: "Nhập tiêu đề",
            rules: Yup.string().trim().required("Vui lòng nhập tiêu đề"),
        },
        {
            label: "Mô tả(*)",
            name: "description",
            as: "textarea",
            placeholder: "Nhập mô tả...",
            rules: Yup.string().trim().required("Vui lòng nhập mô tả"),
        },
        {
            label: "Mức độ ưu tiên",
            name: "priority",
            as: "select",
            rules: Yup.string().required("Vui lòng chọn mức độ"),
            children: [
                {
                    tag: "option",
                    value: "high",
                    text: "Cao",
                },
                {
                    tag: "option",
                    value: "medium",
                    text: "Trung bình",
                },
                {
                    tag: "option",
                    value: "low",
                    text: "Thấp",
                },
            ],
        },
        {
            label: "Ngày hoàn thành(*)",
            name: "date",
            as: "input",
            type: "date",
            rules: Yup.date()
                .transform(function (value, originalValue) {
                    if (this.isType(value)) {
                        return value;
                    }
                    const result = parse(
                        originalValue,
                        "MM.dd.yyyy",
                        new Date()
                    );
                    return result;
                })
                .typeError("please enter a valid date")
                .required()
                .min("2023-08-20", "Thời gian không hợp lệ"),
        },
    ],
};

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

<style scoped></style>
