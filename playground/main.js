import { createApp } from "vue";
import App from "./App.vue";
import JsComponents from "../src/index.js";

const app = createApp(App);
app.use(JsComponents);
app.mount("#app");
