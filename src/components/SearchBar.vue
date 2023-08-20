<template>
    <div class="is-flex">
        <p class="control has-icons-left has-icons-right">
            <input
                class="input is-primary"
                v-model="searchVal"
                type="text"
                placeholder="Nhập tên "
            />
            <span class="icon is-small is-left">
                <i class="fa fa-search"></i>
            </span>
        </p>

        <button @click="handleSearch" class="button is-primary ml-3">
            Tìm kiếm
        </button>
    </div>
</template>

<script setup>
import { ref } from "vue";

const searchVal = ref("");

const handleSearch = () => {
    console.log("🚀 ~ searchVal:", searchVal.value);
};
</script>

<style lang="scss" scoped></style>
