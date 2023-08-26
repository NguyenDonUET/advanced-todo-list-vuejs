import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import router from "@/router";
import Loading from "@/components/Loading.vue";

const pinia = createPinia();
const app = createApp(App);

app.component("Loading", Loading).use(pinia).use(router).mount("#app");
