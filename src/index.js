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

// Components are added here as each Step 2 batch is completed.
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
};

export default {
  install(app) {
    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component);
    });
  },
};
