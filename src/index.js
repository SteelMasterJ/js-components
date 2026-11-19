import "./styles/index.css";

import JsIcon from "./components/Icon.vue";

// Components are added here as each Step 2 batch is completed.
const components = {
  JsIcon,
};

export { JsIcon };

export default {
  install(app) {
    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component);
    });
  },
};
