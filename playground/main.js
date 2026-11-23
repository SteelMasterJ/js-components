import { createApp } from "vue";
import JsComponents from "../src/index.js";
import "./styles/theme.css";
import "./styles/base.css";
import App from "./App.vue";
import router from "./router/index.js";

const app = createApp(App);
app.use(JsComponents);
app.use(router);
app.mount("#app");
