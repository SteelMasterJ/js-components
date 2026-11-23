import { markRaw } from "vue";
import {
  JsBtnSplit,
  JsDrop,
  JsNavItem,
  JsNavItemActions,
  JsNavItemIcon,
  JsNavItemLabels,
  JsNavItemNotify,
  JsNavItemTags,
  JsNavList,
  JsPanelNavItem,
} from "@steelmasterj/js-components";
import DemoJsNavItem from "../components/demos/DemoJsNavItem.vue";
import DemoJsPanelNavItem from "../components/demos/DemoJsPanelNavItem.vue";
import DemoJsBtnSplit from "../components/demos/DemoJsBtnSplit.vue";
import DemoJsNavList from "../components/demos/DemoJsNavList.vue";
import DemoJsDrop from "../components/demos/DemoJsDrop.vue";
import DemoJsNavItemIcon from "../components/demos/DemoJsNavItemIcon.vue";
import DemoJsNavItemLabels from "../components/demos/DemoJsNavItemLabels.vue";
import DemoJsNavItemNotify from "../components/demos/DemoJsNavItemNotify.vue";
import DemoJsNavItemTags from "../components/demos/DemoJsNavItemTags.vue";
import DemoJsNavItemActions from "../components/demos/DemoJsNavItemActions.vue";

const SHARED_NAV_ITEM_PROP_DOCS = {
  item: {
    values: "Object ({ label, subLabel?, icon?, link?, route?, linkExt?, button?, items?, ... })",
    description: "Configuration object describing label, media, action, route/link, or dropdown submenu.",
  },
  size: {
    values: "xs | sm | md | lg | xl | xxl",
    description: "Typography, padding, and minimum touch-target scale.",
  },
  active: {
    values: "true | false",
    description: "Highlights the item as currently active and sets aria-current='page' on links.",
  },
  child: {
    values: "true | false",
    description: "Indicates the item is nested inside a dropdown or list menu.",
  },
  disabled: {
    values: "true | false",
    description: "Prevents interaction and applies disabled styles + aria-disabled/disabled.",
  },
  block: {
    values: "true | false",
    description: "Expands the item to fill 100% of its parent container width.",
  },
  wrap: {
    values: "true | false",
    description: "Allows both label and subLabel to wrap onto multiple lines.",
  },
  wrapLabel: {
    values: "true | false",
    description: "Allows only the primary label to wrap.",
  },
  wrapSubLabel: {
    values: "true | false",
    description: "Allows only the secondary subLabel to wrap.",
  },
  inset: {
    values: "true | false",
    description: "Adds an inset inner border ring around the pill.",
  },
  circle: {
    values: "true | false",
    description: "Renders a circular stacked icon + label button tile.",
  },
  thumb: {
    values: "true | false",
    description: "Renders a responsive thumbnail card layout when item.img is present.",
  },
  theme: {
    values: "light | light-text | lightblue | dark | dark-text | blue | blue-text | darkblue | darkblue-text | green | green-text | orange | orange-text | lightorange | purple | purple-text | heading | headingdark | light-xray | dark-xray",
    description: "WCAG AA compliant solid, soft, or text color theme.",
  },
  parseMarkdown: {
    values: "Boolean | String",
    description: "Enables JsMarkdown formatting on labels and subLabels.",
  },
  dropRight: {
    values: "true | false",
    description: "Prefers right-aligned dropdown menu placement.",
  },
  dropTabs: {
    values: "true | false",
    description: "Renders item.items as tabbed sections inside the dropdown.",
  },
  dropTabSelected: {
    values: "Number",
    description: "Initial active tab index when dropTabs is true.",
  },
  dropSize: {
    values: "auto | sm | md | lg | min",
    description: "Width preset for the dropdown panel.",
  },
  dropTheme: {
    values: "light | dark",
    description: "Color theme for the dropdown menu panel.",
  },
  notifyColor: {
    values: "grey | gray | blue | green | red | orange | light | white",
    description: "Badge color preset forwarded to JsNavItemNotify.",
  },
};

export const navigationDocs = [
  {
    slug: "js-nav-item",
    name: "JsNavItem",
    category: "navigation",
    categoryLabel: "Navigation & Menus",
    icon: "bell",
    summary: "Core button, router-link, external link, and viewport-aware dropdown trigger.",
    description:
      "JsNavItem is the foundational interactive primitive in @steelmasterj/js-components. It automatically resolves to <button>, <router-link>, or <a target='_blank' rel='noopener noreferrer'> based on the item config, composes five sub-components (Icon, Labels, Notify, Tags, Actions), and supports nested or tabbed dropdowns with viewport-aware flipping.",
    accessibilityNotes: [
      "Resolves semantic `<button type='button'>`, `<router-link>`, or `<a>` automatically via `resolveLinkTag()`.",
      "Sets `aria-haspopup`, `aria-expanded`, `aria-controls`, and supports Escape-to-close with focus restoration.",
      "Tooltips on `item.tip` reveal on both `:hover` and `:focus-visible`.",
    ],
    component: markRaw(JsNavItem),
    demoComponent: markRaw(DemoJsNavItem),
    importSnippet: `import { JsNavItem } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsNavItem
  theme="blue"
  :item="{ label: 'Save Changes', icon: 'check', button: 'button' }"
  @click="onSave"
/>`,
    propDocs: {
      ...SHARED_NAV_ITEM_PROP_DOCS,
      itemRole: {
        values: "'' | 'menuitem' | ...",
        description: "Optional ARIA role applied to the inner interactive element (e.g. menuitem inside role='menu').",
      },
    },
    emitDocs: {
      click: { payload: "(event, item)", description: "Emitted when the trigger element is activated." },
      toggle: { payload: "open: Boolean", description: "Emitted when an attached dropdown opens or closes." },
    },
    slots: [
      { name: "default", scope: "{ item }", description: "Custom inline content placed after the leading icon." },
      { name: "icon", scope: "{ item }", description: "Custom SVG or media element replacing JsNavItemIcon." },
      { name: "tags", scope: "{ item }", description: "Custom overlay tags replacing JsNavItemTags." },
      { name: "notify-icon", scope: "{ item }", description: "Custom icon inside the notification badge." },
      { name: "action", scope: "{ item, action }", description: "Custom trailing action icon replacing JsNavItemActions." },
      { name: "dropdown", scope: "{ items, close }", description: "Custom dropdown panel body replacing the default menu list." },
    ],
    extraTables: [
      {
        id: "item-schema",
        label: "item Object Keys",
        caption: "Supported properties on the required item prop object",
        rows: [
          ["Key", "Type", "Description"],
          ["**label / subLabel**", "String", "Primary and secondary text strings."],
          ["**icon / iconColor / img / imgAlt / number**", "String / Number", "Leading icon, thumbnail image, or numeric badge."],
          ["**link / route / linkExt / button / onClick**", "String / Function", "Navigation target or button behavior (linkExt adds target='_blank' rel='noopener noreferrer')."],
          ["**items**", "Array<Object>", "Turns the item into a dropdown trigger with nested or tabbed menu entries."],
          ["**notifyCount / notifyLabel / notifyIcon / notifyUnits / notifyColor**", "Number / String", "Trailing pill badge configuration."],
          ["**tags / tip / tipPos**", "Array | String / String", "Overlay tag pills and hover/focus tooltip."],
          ["**wait / check / arrow / kabob / actionIcon**", "Boolean | String", "Trailing action icon flags."],
        ],
      },
    ],
  },
  {
    slug: "js-panel-nav-item",
    name: "JsPanelNavItem",
    category: "navigation",
    categoryLabel: "Navigation & Menus",
    icon: "bell",
    summary: "Panel-friendly JsNavItem wrapper adding dropPos directional alignment.",
    description:
      "JsPanelNavItem is a lightweight wrapper around JsNavItem designed for panel headers and toolbars. It forwards all props, events, and slots while adding a convenient `dropPos` prop (`bl`, `br`, `tl`, `tr`, `l`, `r`) for aligning attached dropdown menus.",
    accessibilityNotes: [
      "Inherits full keyboard operability, Escape handling, and semantic tag resolution from JsNavItem.",
    ],
    component: markRaw(JsPanelNavItem),
    demoComponent: markRaw(DemoJsPanelNavItem),
    importSnippet: `import { JsPanelNavItem } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsPanelNavItem
  theme="blue"
  drop-pos="br"
  :item="{ label: 'Options', icon: 'ellipsis-vertical', items: menuItems }"
/>`,
    propDocs: {
      ...SHARED_NAV_ITEM_PROP_DOCS,
      dropPos: {
        values: "bl | br | tl | tr | l | r",
        description: "Convenience dropdown alignment preset (br/tr automatically enable dropRight).",
      },
    },
    emitDocs: {
      click: { payload: "(event, item)", description: "Forwarded from JsNavItem when activated." },
      toggle: { payload: "open: Boolean", description: "Forwarded from JsNavItem when dropdown toggles." },
    },
    slots: [
      { name: "tags", scope: "{ item }", description: "Forwarded to JsNavItem #tags." },
      { name: "icon", scope: "{ item }", description: "Forwarded to JsNavItem #icon." },
      { name: "default", scope: "{ item }", description: "Forwarded to JsNavItem default slot." },
      { name: "notify-icon", scope: "{ item }", description: "Forwarded to JsNavItem #notify-icon." },
      { name: "action", scope: "{ item, action }", description: "Forwarded to JsNavItem #action." },
      { name: "dropdown", scope: "{ items, close }", description: "Forwarded to JsNavItem #dropdown." },
    ],
  },
  {
    slug: "js-btn-split",
    name: "JsBtnSplit",
    category: "navigation",
    categoryLabel: "Navigation & Menus",
    icon: "list-ul",
    summary: "Accessible split and segmented button group composing connected JsNavItem controls.",
    description:
      "JsBtnSplit groups multiple JsNavItem buttons, links, or dropdown triggers inside a semantic `role='group'` container with connected pill radii, flexible grow modes (`first`, `first-hover`, `last`, `all`), or spaced pill separation.",
    accessibilityNotes: [
      "Wraps items in `<div role='group' :aria-label='ariaLabel'>`.",
      "Each segment remains an independent keyboard-reachable button, link, or dropdown trigger.",
    ],
    component: markRaw(JsBtnSplit),
    demoComponent: markRaw(DemoJsBtnSplit),
    importSnippet: `import { JsBtnSplit } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsBtnSplit
  theme="blue"
  aria-label="Publish actions"
  :items="[
    { label: 'Publish', icon: 'check', button: 'button' },
    { tip: 'More options', items: [{ label: 'Schedule...' }, { label: 'Save Draft' }] },
  ]"
/>`,
    propDocs: {
      items: { values: "Array<JsNavItem item>", description: "Buttons, links, or dropdown triggers in the group." },
      ariaLabel: { values: "String", description: "Accessible label on the role='group' container." },
      size: { values: "xs | sm | md | lg", description: "Control size forwarded to child JsNavItem buttons." },
      grow: { values: "none | first | first-hover | first-hover-1 | last | all", description: "Flex-grow behavior for segments inside full-width containers." },
      parseMarkdown: { values: "Boolean | String", description: "Enables JsMarkdown in segment labels." },
      circle: { values: "true | false", description: "Renders segments in circle button mode." },
      thumb: { values: "true | false", description: "Renders segments in thumbnail card mode." },
      spaced: { values: "true | false", description: "Adds spacing gap between pill segments instead of joining borders." },
      theme: { values: "JsNavItem theme", description: "Default theme applied to group segments." },
      dropSize: { values: "auto | sm | md | lg | min", description: "Dropdown panel width for segment dropdowns." },
      dropTheme: { values: "light | dark", description: "Dropdown theme for segment dropdowns." },
      dropRight: { values: "true | false", description: "Right-aligns segment dropdowns (defaults to true)." },
    },
    emitDocs: {
      click: { payload: "(event, item)", description: "Emitted when any segment item is clicked." },
      toggle: { payload: "(open, item)", description: "Emitted when a segment dropdown opens or closes." },
    },
    slots: [],
  },
  {
    slug: "js-nav-list",
    name: "JsNavList",
    category: "navigation",
    categoryLabel: "Navigation & Menus",
    icon: "list-ul",
    summary: "Vertical menu and list renderer with headers, dividers, nested submenus, and split buttons.",
    description:
      "JsNavList renders structured vertical navigation lists and ARIA menus. Entries can be clickable items, section headers, <hr> dividers, nested flyout submenus, embedded JsBtnSplit rows, or custom dynamic Vue components.",
    accessibilityNotes: [
      "Automatically sets `role='menu'` and `role='menuitem'` when `menu=true` and no non-menu widgets are present.",
      "Disables scroll clipping automatically when nested flyout submenus are present so submenus are never clipped.",
    ],
    component: markRaw(JsNavList),
    demoComponent: markRaw(DemoJsNavList),
    importSnippet: `import { JsNavList } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsNavList
  theme="light"
  aria-label="Workspace navigation"
  :items="[
    { header: true, label: 'Workspace' },
    { label: 'Overview', icon: 'search', active: true },
    { divider: true },
    { label: 'Settings', icon: 'check' },
  ]"
/>`,
    propDocs: {
      items: { values: "Array<Object>", description: "Menu entries: standard items, { header: true }, { divider: true }, { split: true, items }, or { component, props }." },
      size: { values: "xs | sm | md | lg | xl", description: "Item sizing scale." },
      dropSize: { values: "auto | sm | md | lg | min", description: "Width preset for nested submenu flyouts." },
      parseMarkdown: { values: "Boolean | String", description: "Enables JsMarkdown in headers and item labels." },
      theme: { values: "light | dark", description: "Light or dark list surface theme." },
      menu: { values: "true | false", description: "Enables WAI-ARIA role='menu' semantics when appropriate." },
      scrollable: { values: "true | false", description: "Caps height and enables vertical scrolling (auto-disabled if nested menus exist)." },
      ariaLabel: { values: "String", description: "Accessible label on the <ul> element." },
    },
    emitDocs: {
      select: { payload: "(item, event)", description: "Emitted when a list item is selected." },
      click: { payload: "(event, item)", description: "Emitted when a list item is clicked." },
    },
    slots: [
      { name: "item", scope: "{ item, index }", description: "Custom renderer overriding the default JsNavItem entry." },
    ],
  },
  {
    slug: "js-drop",
    name: "JsDrop",
    category: "navigation",
    categoryLabel: "Navigation & Menus",
    icon: "chevron-down",
    summary: "Triggered popover dropdown or inline panel with viewport flip, tabs, and dynamic components.",
    description:
      "JsDrop works either as a triggered floating popover (with triggerLabel or custom #trigger slot, v-model support, Escape and outside-click closing, and viewport-aware flipping) or as a standalone inline panel when no trigger is supplied.",
    accessibilityNotes: [
      "Trigger button exposes `aria-expanded`, `aria-haspopup='true'`, and `aria-controls`.",
      "Pressing Escape closes the floating panel and restores keyboard focus to the trigger.",
      "Automatically flips above or right-aligns to stay inside the viewport down to 320px.",
    ],
    component: markRaw(JsDrop),
    demoComponent: markRaw(DemoJsDrop),
    importSnippet: `import { JsDrop } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsDrop
  trigger-label="Actions"
  theme="light"
  :items="[{ label: 'Edit', icon: 'check' }, { label: 'Delete' }]"
  @select="onSelect"
/>`,
    propDocs: {
      items: { values: "Array<Object>", description: "Menu items passed to JsNavList (or tabbed JsTabs + JsNavList)." },
      component: { values: "Component | Function | String | null", description: "Optional dynamic component rendered inside the panel." },
      componentProps: { values: "Object", description: "Props bound to the dynamic :component." },
      triggerLabel: { values: "String", description: "Button label enabling triggered popover mode." },
      triggerIcon: { values: "JsIcon name", description: "Leading icon inside the default trigger button." },
      modelValue: { values: "Boolean | undefined", description: "Controlled open state via v-model." },
      right: { values: "true | false", description: "Prefers right-edge alignment for the floating panel." },
      tabs: { values: "true | false", description: "Renders items as tabbed panels using JsTabs." },
      tabSelected: { values: "Number", description: "Initial selected tab index when tabs=true." },
      size: { values: "auto | sm | md | lg", description: "Panel width preset." },
      theme: { values: "light | dark", description: "Light or dark panel theme." },
      parseMarkdown: { values: "Boolean | String", description: "Enables JsMarkdown in menu items and tabs." },
      closeOnSelect: { values: "true | false", description: "Automatically closes popover when a leaf item is selected." },
      ariaLabel: { values: "String", description: "Accessible label on the popover region." },
    },
    emitDocs: {
      "update:modelValue": { payload: "Boolean", description: "Emitted when open state changes." },
      open: { payload: "—", description: "Emitted when the popover opens." },
      close: { payload: "—", description: "Emitted when the popover closes." },
      select: { payload: "(item, event)", description: "Emitted when a menu item is selected." },
      "tab-change": { payload: "payload", description: "Emitted when switching tabs inside a tabbed dropdown." },
    },
    slots: [
      { name: "trigger", scope: "{ open, toggle, panelId }", description: "Custom trigger control replacing the default button." },
      { name: "default", scope: "{ close }", description: "Custom panel body replacing JsNavList/JsTabs." },
    ],
  },
  {
    slug: "js-nav-item-icon",
    name: "JsNavItemIcon",
    category: "navigation",
    categoryLabel: "Navigation & Menus",
    icon: "info-circle",
    summary: "Leading icon, lazy-loaded thumbnail, or numeric media sub-primitive for JsNavItem.",
    description:
      "JsNavItemIcon renders the leading media slot inside JsNavItem (and can also be used standalone). It prioritizes custom slot content, then built-in JsIcon names, then lazy-loaded thumbnails with smart alt handling, and finally numeric counters.",
    accessibilityNotes: [
      "Thumbnails default `alt=''` (decorative) when a text `item.label` accompanies them, or accept explicit `item.imgAlt`.",
      "Built-in icons support `item.iconLabel` for meaningful standalone icons.",
    ],
    component: markRaw(JsNavItemIcon),
    demoComponent: markRaw(DemoJsNavItemIcon),
    importSnippet: `import { JsNavItemIcon } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsNavItemIcon :item="{ icon: 'bell', iconColor: '#1d6f90' }" />
<JsNavItemIcon :item="{ number: 42 }" />`,
    propDocs: {
      item: { values: "Object ({ icon?, iconColor?, iconLabel?, img?, imgAlt?, imgSize?, number?, numberSize?, label?, subLabel? })", description: "Item media configuration object." },
      circle: { values: "true | false", description: "Indicates circular parent layout (suppresses subLabel icon upscaling)." },
      thumb: { values: "true | false", description: "Indicates thumbnail card parent layout." },
    },
    emitDocs: {},
    slots: [
      { name: "default", scope: "—", description: "Custom icon/SVG element overriding item.icon." },
    ],
  },
  {
    slug: "js-nav-item-labels",
    name: "JsNavItemLabels",
    category: "navigation",
    categoryLabel: "Navigation & Menus",
    icon: "check",
    summary: "Primary label and secondary subLabel stack with ellipsis truncation, wrapping, and markdown.",
    description:
      "JsNavItemLabels renders the two-line label stack inside JsNavItem. By default, labels truncate cleanly with text-overflow: ellipsis; enabling `wrap`, `wrapLabel`, or `wrapSubLabel` allows multi-line flow, and `parseMarkdown` supports selective or full JsMarkdown formatting.",
    accessibilityNotes: [
      "Maintains readable contrast and supports wrapping down to 320px viewports without horizontal overflow.",
    ],
    component: markRaw(JsNavItemLabels),
    demoComponent: markRaw(DemoJsNavItemLabels),
    importSnippet: `import { JsNavItemLabels } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsNavItemLabels
  :wrap="true"
  :parse-markdown="true"
  :item="{ label: '*Formatted* Title', subLabel: 'Descriptive subtitle' }"
/>`,
    propDocs: {
      item: { values: "Object ({ label?, subLabel?, wrap?, wrapLabel?, wrapSubLabel?, parseMarkdown?, dataTestId? })", description: "Item label configuration object." },
      parseMarkdown: { values: "Boolean | String", description: "Enables JsMarkdown in label/subLabel (supports 'label', 'subLabel', '*', or boolean)." },
      wrap: { values: "true | false", description: "Enables multi-line wrapping on both label and subLabel." },
      wrapLabel: { values: "true | false", description: "Enables multi-line wrapping on the primary label." },
      wrapSubLabel: { values: "true | false", description: "Enables multi-line wrapping on the secondary subLabel." },
    },
    emitDocs: {},
    slots: [],
  },
  {
    slug: "js-nav-item-notify",
    name: "JsNavItemNotify",
    category: "navigation",
    categoryLabel: "Navigation & Menus",
    icon: "bell",
    summary: "Optically balanced notification count and status badge with pluralized tooltips.",
    description:
      "JsNavItemNotify renders WCAG AA contrast notification pills inside JsNavItem, JsInput, and standalone toolbars. It supports numeric counts with automatic pluralized tooltips (via `notifyUnits`), text status labels, leading/trailing icons, six color presets, and optional `aria-live='polite'` updates.",
    accessibilityNotes: [
      "Generates descriptive `aria-label` and `title` from `notifyTip` or pluralized `notifyCount + notifyUnits`.",
      "Set `live` to `true` to announce dynamic badge count changes with `aria-live='polite'`.",
    ],
    component: markRaw(JsNavItemNotify),
    demoComponent: markRaw(DemoJsNavItemNotify),
    importSnippet: `import { JsNavItemNotify } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsNavItemNotify
  notify-color="blue"
  :live="true"
  :item="{ notifyCount: 5, notifyUnits: 'message' }"
/>`,
    propDocs: {
      item: { values: "Object ({ notifyCount?, notifyLabel?, notifyIcon?, notifyTip?, notifyUnits?, notifyColor? })", description: "Badge data and unit configuration." },
      notifyColor: { values: "orange | red | green | blue | grey | gray | light | white", description: "WCAG AA pill color preset." },
      live: { values: "true | false", description: "Sets aria-live='polite' for live count updates." },
    },
    emitDocs: {},
    slots: [
      { name: "icon", scope: "—", description: "Custom SVG/icon rendered inside the badge." },
    ],
  },
  {
    slug: "js-nav-item-tags",
    name: "JsNavItemTags",
    category: "navigation",
    categoryLabel: "Navigation & Menus",
    icon: "check",
    summary: "Semantic tag pill list from arrays or color-coded JsMarkdown tag syntax.",
    description:
      "JsNavItemTags renders tag pills from either an array of strings (`['Vue 3', 'WCAG AA']`) as an accessible `<ul aria-label='Tags'>` or from JsMarkdown color-coded tag strings (`'bl[Info] gn[Stable]'`).",
    accessibilityNotes: [
      "Array tags render as semantic `<ul>` / `<li>` items with `aria-label='Tags'`.",
      "Markdown tags inherit WCAG AA color palettes from JsMarkdown.",
    ],
    component: markRaw(JsNavItemTags),
    demoComponent: markRaw(DemoJsNavItemTags),
    importSnippet: `import { JsNavItemTags } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsNavItemTags :item="{ tags: 'bl[Info] gn[Stable] or[Beta]' }" />`,
    propDocs: {
      item: { values: "Object ({ tags: String | Array<String>, dataTestId? })", description: "Item object containing string or array tags." },
    },
    emitDocs: {},
    slots: [],
  },
  {
    slug: "js-nav-item-actions",
    name: "JsNavItemActions",
    category: "navigation",
    categoryLabel: "Navigation & Menus",
    icon: "chevron-right",
    summary: "Trailing action icon resolver for external links, spinners, checks, arrows, and menus.",
    description:
      "JsNavItemActions resolves the appropriate trailing action icon for a JsNavItem according to priority (`actionIcon`, `linkExt`, `wait` spinner, `check`, `arrow`, nested `items` caret, or `kabob`), or lets you suppress or replace the icon via `actionIcon: false` or the default slot.",
    accessibilityNotes: [
      "Inherits spin animation reduction under `prefers-reduced-motion: reduce` via JsIcon.",
    ],
    component: markRaw(JsNavItemActions),
    demoComponent: markRaw(DemoJsNavItemActions),
    importSnippet: `import { JsNavItemActions } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsNavItemActions :item="{ arrow: true }" />`,
    propDocs: {
      item: { values: "Object ({ actionIcon?, actionIconColor?, linkExt?, wait?, check?, arrow?, items?, kabob? })", description: "Item flags controlling which trailing icon renders." },
    },
    emitDocs: {},
    slots: [
      { name: "default", scope: "{ action }", description: "Custom action icon markup; receives the resolved action name." },
    ],
  },
];
