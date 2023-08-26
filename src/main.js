import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import router from "@/router";
import Loading from "@/components/Loading.vue";
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import { POSITION } from "vue-toastification";

const options = {
    position: POSITION.TOP_CENTER,
};

const pinia = createPinia();
const app = createApp(App);

app.component("Loading", Loading)
    .use(Toast, options)
    .use(pinia)
    .use(router)
    .mount("#app");
