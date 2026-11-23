import "./styles/index.css";

import JsIcon from "./components/Icon.vue";
import JsMarkdown from "./components/Markdown.vue";
import JsModal from "./components/Modal.vue";
import JsTabs from "./components/Tabs.vue";
import JsNavItem from "./components/NavItem.vue";
import JsNavItemActions from "./components/NavItem/NavItemActions.vue";
import JsNavItemIcon from "./components/NavItem/NavItemIcon.vue";
import JsNavItemLabels from "./components/NavItem/NavItemLabels.vue";
import JsNavItemNotify from "./components/NavItem/NavItemNotify.vue";
import JsNavItemTags from "./components/NavItem/NavItemTags.vue";
import JsPanelNavItem from "./components/PanelNavItem.vue";
import JsBtnSplit from "./components/BtnSplit.vue";
import JsNavList from "./components/NavList.vue";
import JsDrop from "./components/Drop.vue";
import JsPanel from "./components/Panel.vue";
import JsPanelNav from "./components/PanelNav.vue";
import JsTitleBar from "./components/TitleBar.vue";
import JsTable from "./components/Table.vue";
import JsInput from "./components/Input.vue";
import JsInputCheckbox from "./components/InputCheckbox.vue";
import JsInputRadio from "./components/InputRadio.vue";
import JsForm from "./components/Form.vue";
import JsAlert from "./components/Alert.vue";
import JsToast from "./components/Toast.vue";
import { toast } from "./utils/toast.js";

const components = {
  JsIcon,
  JsMarkdown,
  JsModal,
  JsTabs,
  JsNavItem,
  JsNavItemActions,
  JsNavItemIcon,
  JsNavItemLabels,
  JsNavItemNotify,
  JsNavItemTags,
  JsPanelNavItem,
  JsBtnSplit,
  JsNavList,
  JsDrop,
  JsPanel,
  JsPanelNav,
  JsTitleBar,
  JsTable,
  JsInput,
  JsInputCheckbox,
  JsInputRadio,
  JsForm,
  JsAlert,
  JsToast,
};

export {
  JsIcon,
  JsMarkdown,
  JsModal,
  JsTabs,
  JsNavItem,
  JsNavItemActions,
  JsNavItemIcon,
  JsNavItemLabels,
  JsNavItemNotify,
  JsNavItemTags,
  JsPanelNavItem,
  JsBtnSplit,
  JsNavList,
  JsDrop,
  JsPanel,
  JsPanelNav,
  JsTitleBar,
  JsTable,
  JsInput,
  JsInputCheckbox,
  JsInputRadio,
  JsForm,
  JsAlert,
  JsToast,
  toast,
};

export default {
  install(app) {
    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component);
    });
  },
};
