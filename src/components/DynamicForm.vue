<template>
    <Form @submit="handleSubmit">
        <div
            v-for="{
                as,
                type,
                name,
                label,
                children,
                value,
                ...attrs
            } in schema.fields"
            :key="name"
            class="form-control"
        >
            <label v-if="label" :for="name">{{ label }}</label>

            <Field
                :as="as"
                :id="name"
                :name="name"
                :class="as"
                v-bind="attrs"
                :type="type"
            >
                <template v-if="children && children.length">
                    <component
                        v-for="({ tag, text, ...childAttrs }, idx) in children"
                        :key="idx"
                        :is="tag"
                        v-bind="childAttrs"
                    >
                        {{ text }}
                    </component>
                </template>
            </Field>
            <ErrorMessage :name="name" class="error" />
        </div>

        <!-- <div class="priority">
            <label class="priority-label">Mức độ ưu tiên</label>
            <div class="radio-group control">
                <label class="radio">
                    <Field name="priority" type="radio" value="low" />
                    Thấp
                </label>
                <label class="radio">
                    <Field name="priority" type="radio" value="medium" />
                    Trung bình
                </label>
                <label class="radio">
                    <Field name="priority" type="radio" value="high" />
                    Cao
                </label>
            </div>
        </div> -->
    </Form>
</template>
<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";

const props = defineProps({
    schema: {
        type: Object,
        required: true,
    },
});
const handleSubmit = (value) => {
    // emit value to AddEditForm
    console.log(value);
};
</script>

<style scoped>
.form-control {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 1rem;
}
.error {
    color: red;
}
.radio-group {
    display: flex;
    gap: 4px;
}
</style>
