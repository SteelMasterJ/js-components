import { markRaw } from "vue";
import {
  JsAccordion,
  JsPanel,
  JsPanelNav,
  JsTable,
  JsTitleBar,
} from "@steelmasterj/js-components";
import DemoJsAccordion from "../components/demos/DemoJsAccordion.vue";
import DemoJsPanel from "../components/demos/DemoJsPanel.vue";
import DemoJsPanelNav from "../components/demos/DemoJsPanelNav.vue";
import DemoJsTitleBar from "../components/demos/DemoJsTitleBar.vue";
import DemoJsTable from "../components/demos/DemoJsTable.vue";

export const layoutDocs = [
  {
    slug: "js-panel",
    name: "JsPanel",
    category: "layout",
    categoryLabel: "Layout & Data",
    icon: "table-cells",
    summary: "Semantic container landmark with hero background zoom, scroll nudges, and header/footer slots.",
    description:
      "JsPanel is a versatile layout container rendering semantic <section>, <article>, <aside>, or <div> landmarks with configurable heading levels, optional scrollable body with keyboard-accessible scroll nudge buttons, hero background images with zoom/shading, banners, and primary action overlays.",
    accessibilityNotes: [
      "Configure `as` and `headingLevel` (1–6) to preserve strict document landmark and heading hierarchy.",
      "Scroll nudge buttons are keyboard-focusable and include descriptive aria-labels.",
      "Informative thumbnails use `imgAlt` (empty string treats images as decorative when paired with a title).",
    ],
    component: markRaw(JsPanel),
    demoComponent: markRaw(DemoJsPanel),
    importSnippet: `import { JsPanel } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsPanel as="section" :heading-level="2" title="Recent Activity" height="sm">
  <p>Panel content goes here.</p>
</JsPanel>`,
    propDocs: {
      as: { values: "section | article | div | aside", description: "Root HTML landmark element." },
      headingLevel: { values: "1 – 6", description: "Heading tag level (h1–h6) for the panel title." },
      title: { values: "String", description: "Panel header title text." },
      titleTestId: { values: "String", description: "Optional data-test-id on the heading element." },
      titleDark: { values: "true | false", description: "Uses light inverse text styling in the header." },
      titleSize: { values: "sm | md | lg", description: "Header title font scale." },
      aboveNote: { values: "String", description: "Eyebrow/note label rendered above the header." },
      banner: { values: "String", description: "Status banner overlay pill inside the media/body region." },
      bannerDark: { values: "true | false", description: "Dark styling for the banner overlay." },
      notify: { values: "String", description: "Notification badge text rendered in the header/card." },
      notifyDark: { values: "true | false", description: "Dark styling for the notify pill." },
      footer: { values: "Object | null", description: "Footer action/link item config passed to JsNavItem." },
      icon: { values: "JsIcon name", description: "Leading icon in the panel header." },
      img: { values: "URL string", description: "Leading thumbnail image in the header." },
      imgAlt: { values: "String", description: "Alt text for the header thumbnail image." },
      titleBackgroundTransparent: { values: "true | false", description: "Removes header background fill (ideal over hero images)." },
      parseMarkdown: { values: "Boolean | String", description: "Enables JsMarkdown in title, aboveNote, banner, and caption." },
      height: { values: "sm | md | lg | xl | auto", description: "Fixed height preset or auto-expanding height." },
      scroll: { values: "true | false", description: "Enables vertical scrolling inside the panel body." },
      compact: { values: "true | false", description: "Reduces padding for dense card layouts." },
      scrollbars: { values: "true | false", description: "Shows native scrollbars instead of hiding them." },
      scrollHint: { values: "true | false", description: "Displays accessible up/down scroll nudge buttons when overflow exists." },
      backgroundImage: { values: "URL string", description: "Full-bleed background image inside the panel." },
      backgroundImagePadded: { values: "true | false", description: "Insets background image with padding." },
      backgroundImageCentered: { values: "true | false", description: "Centers background image position." },
      backgroundImageShadeTop: { values: "true | false", description: "Adds a top dark gradient scrim for title contrast." },
      backgroundImageZoom: { values: "true | false", description: "Subtly zooms the background image on hover." },
      backgroundColor: { values: "CSS color", description: "Custom background color for the panel container." },
      backgroundImageSize: { values: "Number | null", description: "Explicit background-size percentage." },
      backgroundPositionLeft: { values: "true | false", description: "Aligns background image to the left edge." },
      backgroundPositionRight: { values: "true | false", description: "Aligns background image to the right edge." },
      primaryAction: { values: "JsNavItem item object | null", description: "Overlay action button rendered on the panel." },
      primaryActionHover: { values: "true | false", description: "Reveals primaryAction prominently on hover/focus." },
      primaryActionCoverLink: { values: "true | false", description: "Expands primaryAction click target across the panel card." },
      caption: { values: "Object ({ label, link, dark }) | null", description: "Optional caption bar at the bottom of a media panel." },
      span: { values: "String | Number", description: "CSS grid column span hint." },
    },
    emitDocs: {
      "action-click": { payload: "(event, item)", description: "Emitted when primaryAction is activated." },
    },
    slots: [
      { name: "above", scope: "—", description: "Custom content above the panel header." },
      { name: "header", scope: "—", description: "Replaces the entire panel header." },
      { name: "icon", scope: "—", description: "Custom icon in the panel header." },
      { name: "headerLeft", scope: "—", description: "Content placed alongside the header title on the left." },
      { name: "headerRight", scope: "—", description: "Actions or badges placed on the right side of the header." },
      { name: "subActions", scope: "—", description: "Secondary toolbar strip directly below the header." },
      { name: "default", scope: "—", description: "Main panel body content." },
      { name: "footer", scope: "—", description: "Custom footer content." },
    ],
  },
  {
    slug: "js-accordion",
    name: "JsAccordion",
    category: "layout",
    categoryLabel: "Layout & Data",
    icon: "chevron-down",
    summary: "WAI-ARIA disclosure accordion with single/multi expand, keyboard navigation, and 3 variants.",
    description:
      "JsAccordion renders a vertically stacked set of collapsible sections using semantic headings (configurable headingLevel) and native <button type='button'> triggers linked to role='region' panels. Supports single or multiple open panels, controlled v-model or uncontrolled mode, bordered/separated/flush variants, light and dark themes, sizes, markdown, and named or scoped panel slots.",
    accessibilityNotes: [
      "Implements the WAI-ARIA Authoring Practices Accordion pattern with `aria-expanded`, `aria-controls`, `role='region'`, and `aria-labelledby`.",
      "Supports `ArrowDown`, `ArrowUp`, `Home`, and `End` focus movement across enabled header buttons while keeping all buttons in the natural Tab order.",
      "Chevron rotation and hover transitions honor `prefers-reduced-motion: reduce` and `--js-touch-min` targets.",
    ],
    component: markRaw(JsAccordion),
    demoComponent: markRaw(DemoJsAccordion),
    importSnippet: `import { JsAccordion } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsAccordion v-model="openId" :heading-level="3" :items="[
  { id: 'overview', label: 'Overview', icon: 'info-circle' },
  { id: 'details', label: 'Details', badge: 2 },
]">
  <template #item-overview>Overview content</template>
  <template #item-details>Detailed information</template>
</JsAccordion>`,
    propDocs: {
      items: { values: "Array<{ id?, label, subLabel?, content?, icon?, badge?, disabled?, open? }>", description: "Accordion section definitions array." },
      modelValue: { values: "String | Number | Array | undefined", description: "Controlled open item id/index (single mode) or array of ids/indices (multiple mode)." },
      multiple: { values: "true | false", description: "Allows multiple accordion panels to remain open simultaneously." },
      collapsible: { values: "true | false", description: "When false, prevents collapsing the last open panel." },
      headingLevel: { values: "1 – 6", description: "Semantic heading tag level (h1–h6) wrapping each header button." },
      variant: { values: "bordered | separated | flush", description: "Container visual style: connected box, separated cards, or edge-to-edge dividers." },
      size: { values: "sm | md | lg", description: "Header and panel padding and typography scale." },
      theme: { values: "light | dark", description: "Light or dark surface palette." },
      chevronPosition: { values: "right | left", description: "Places the expand/collapse chevron indicator on the trailing or leading edge." },
      parseMarkdown: { values: "Boolean | String", description: "Enables JsMarkdown formatting inside item labels, subLabels, and fallback content." },
      ariaLabel: { values: "String", description: "Optional accessible label applied to the outer accordion container." },
    },
    emitDocs: {
      "update:modelValue": { payload: "String | Number | null | Array", description: "Emitted with the next open key(s) for v-model binding." },
      change: { payload: "{ value, openKeys }", description: "Emitted whenever the set of open panels changes." },
      toggle: { payload: "{ item, index, open, value }", description: "Emitted when an item is toggled open or closed." },
      open: { payload: "{ item, index, value }", description: "Emitted when an item transitions to open." },
      close: { payload: "{ item, index, value }", description: "Emitted when an item transitions to closed." },
    },
    slots: [
      { name: "item-icon", scope: "{ item, index, open }", description: "Custom leading icon per accordion header." },
      { name: "item-label", scope: "{ item, index, open }", description: "Custom label markup inside each accordion trigger." },
      { name: "chevron", scope: "{ item, index, open }", description: "Custom expand/collapse indicator icon." },
      { name: "item-<id> / item<index>", scope: "{ item, index, open, toggle }", description: "Dedicated content slot for a specific accordion panel." },
      { name: "panel", scope: "{ item, index, open, toggle }", description: "Fallback scoped slot for any panel without a dedicated named slot." },
    ],
  },
  {
    slug: "js-panel-nav",
    name: "JsPanelNav",
    category: "layout",
    categoryLabel: "Layout & Data",
    icon: "list-ul",
    summary: "Searchable, groupable navigation directory with live count, layout switcher, and limit toggle.",
    description:
      "JsPanelNav renders responsive grids or lists of JsNavItem and JsBtnSplit controls with built-in client-side search, an accessible <output aria-live='polite'> match counter, a List/Grid view switcher, category grouping, and a Load All truncation toggle.",
    accessibilityNotes: [
      "Wraps items in `<nav :aria-label='ariaLabel'>` with `<div role='search'>` when search is enabled.",
      "Live match count uses `<output aria-live='polite'>` so screen readers hear filtered counts automatically.",
      "Multi-column grids collapse safely on narrow mobile viewports down to 320px.",
    ],
    component: markRaw(JsPanelNav),
    demoComponent: markRaw(DemoJsPanelNav),
    importSnippet: `import { JsPanelNav } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsPanelNav
  aria-label="Component directory"
  :search="true"
  :grouped="true"
  group-by="category"
  layout="cols-3"
  :items="items"
/>`,
    propDocs: {
      ariaLabel: { values: "String", description: "Accessible label on the outer <nav> landmark." },
      menu: { values: "true | false", description: "Shows layout view switcher buttons defined by menuConfig." },
      menuConfig: { values: "Array<Object>", description: "View switcher button presets (list, thumb grid, etc.)." },
      grouped: { values: "true | false", description: "Groups items by the groupBy property." },
      search: { values: "true | false", description: "Enables the expandable live search input." },
      searchMinCount: { values: "Number", description: "Minimum item count before showing the search control." },
      searchableProperties: { values: "Array<String>", description: "Item keys inspected during search filtering." },
      columns: { values: "String", description: "Column configuration hint." },
      itemUnits: { values: "String", description: "Plural noun used in search placeholder and empty state." },
      items: { values: "Array<Object>", description: "Navigation items, headers, dividers, or split items." },
      itemsLimit: { values: "Number | null", description: "Initially truncates list to N items with a Load All button." },
      loadAllLabel: { values: "String", description: "Label for the Load All expansion button." },
      parseMarkdown: { values: "Boolean | String", description: "Enables JsMarkdown in item labels, group labels, and headers." },
      groupBy: { values: "String", description: "Item property key used to form groups." },
      groupLabelsHidden: { values: "true | false", description: "Visually hides group headings while keeping grouping." },
      groupLabelsLeft: { values: "true | false", description: "Places group labels in a left column beside items." },
      groupLabelShowCount: { values: "true | false", description: "Appends item counts to group headings." },
      grid: { values: "true | false", description: "Enables CSS grid layout mode." },
      layout: { values: "cols-auto | cols-1..cols-5 | row | ...", description: "Responsive column/row layout preset." },
      layoutGap: { values: "sm | md | lg", description: "Spacing gap between items." },
      emptySize: { values: "sm | md | lg", description: "Padding scale for the empty state message." },
      layoutRight: { values: "true | false", description: "Right-aligns items in row layouts." },
      layoutCompact: { values: "true | false", description: "Reduces spacing for compact directories." },
      size: { values: "xs | sm | md | lg | xl | xxl", description: "Default size forwarded to child JsNavItem items." },
      theme: { values: "JsNavItem theme", description: "Default theme forwarded to child items." },
      circle: { values: "true | false", description: "Renders child items in circle mode." },
      thumb: { values: "true | false", description: "Renders child items as thumbnail cards." },
      splitGrow: { values: "none | first | first-hover | last | all", description: "Grow mode forwarded to embedded JsBtnSplit items." },
      dropRight: { values: "true | false", description: "Right-aligns child dropdowns." },
      dropTabs: { values: "true | false", description: "Enables tabbed dropdowns on child items." },
      dropSize: { values: "auto | sm | md | lg | min", description: "Dropdown panel width forwarded to child items." },
      dropTheme: { values: "light | dark", description: "Dropdown theme forwarded to child items." },
    },
    emitDocs: {
      click: { payload: "(event, item)", description: "Emitted when any item is clicked." },
      select: { payload: "item", description: "Emitted with the activated item object." },
      search: { payload: "query: String", description: "Emitted as the user types in the search box." },
      "config-change": { payload: "config", description: "Emitted when the user switches view layout via menuConfig." },
    },
    slots: [
      { name: "empty", scope: "—", description: "Custom empty state message when no items match the search." },
    ],
  },
  {
    slug: "js-title-bar",
    name: "JsTitleBar",
    category: "layout",
    categoryLabel: "Layout & Data",
    icon: "external",
    summary: "Semantic page header with breadcrumbs, configurable heading level, dropdown switcher, and banner.",
    description:
      "JsTitleBar renders a structured <header> landmark with <nav aria-label='Breadcrumb'><ol> breadcrumbs, leading icon or thumbnail, configurable headingLevel (1–6), optional dropdown title switcher, action buttons, description, and a docked status banner.",
    accessibilityNotes: [
      "Always set `headingLevel={1}` for the main page header and `headingLevel={2..6}` for sub-headers so only one <h1> exists per page.",
      "Breadcrumbs render semantic `<nav aria-label='Breadcrumb'><ol>` with `aria-current='page'` on the active item.",
      "Action buttons stack cleanly on mobile 320px viewports without clipping.",
    ],
    component: markRaw(JsTitleBar),
    demoComponent: markRaw(DemoJsTitleBar),
    importSnippet: `import { JsTitleBar } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsTitleBar
  :heading-level="1"
  title="Project Dashboard"
  sub-title="Overview & metrics"
  :crumbs="[{ label: 'Home', route: '/' }, { label: 'Dashboard' }]"
  :buttons="[{ label: 'New Item', theme: 'blue', button: 'button' }]"
/>`,
    propDocs: {
      headingLevel: { values: "1 – 6", description: "Semantic heading level (h1–h6) for the title." },
      title: { values: "String", description: "Primary title text (falls back to label)." },
      subTitle: { values: "String", description: "Secondary subtitle text (falls back to subLabel)." },
      label: { values: "String", description: "Fallback title when `title` is not set." },
      subLabel: { values: "String", description: "Fallback subtitle when `subTitle` is not set." },
      icon: { values: "JsIcon name", description: "Built-in icon displayed beside the title." },
      description: { values: "String", description: "Optional descriptive paragraph below the header row." },
      img: { values: "URL string", description: "Optional leading thumbnail image." },
      imgAlt: { values: "String", description: "Alt text for the thumbnail image." },
      background: { values: "CSS color / gradient", description: "Custom background for the title bar header." },
      buttons: { values: "Array<JsNavItem item>", description: "Action buttons rendered on the trailing edge." },
      bannerLabel: { values: "String", description: "Text for the optional docked status banner." },
      bannerButtons: { values: "Array<JsNavItem item>", description: "Action buttons inside the docked banner." },
      bannerBackground: { values: "CSS color", description: "Background fill for the docked banner." },
      bannerBackgroundDark: { values: "true | false", description: "Applies dark surface contrast to the banner." },
      bannerIcon: { values: "JsIcon name", description: "Leading icon in the docked banner." },
      buttonSize: { values: "sm | md | lg", description: "Size applied to header action buttons." },
      parseMarkdown: { values: "Boolean | String", description: "Enables JsMarkdown in title, subTitle, description, and banner." },
      crumbs: { values: "Array<{ label, route?, link?, linkExt? }>", description: "Breadcrumb trail items." },
      drop: { values: "Array<Object>", description: "Turns the title into an interactive dropdown switcher." },
      dropTabs: { values: "true | false", description: "Enables tabbed menu mode on the title dropdown." },
      dropTabSelected: { values: "Number", description: "Default selected tab index for tabbed title dropdown." },
      dropSize: { values: "auto | sm | md | lg | min", description: "Width preset for the title dropdown." },
      dropTheme: { values: "light | dark", description: "Theme for the title dropdown." },
      dark: { values: "true | false", description: "Dark surface palette for the entire TitleBar." },
    },
    emitDocs: {},
    slots: [
      { name: "default", scope: "—", description: "Extra content inside the header body." },
      { name: "icon", scope: "—", description: "Custom SVG icon replacing the built-in icon prop." },
      { name: "actions", scope: "—", description: "Custom trailing action controls." },
      { name: "banner-icon", scope: "—", description: "Custom icon inside the docked banner." },
    ],
  },
  {
    slug: "js-table",
    name: "JsTable",
    category: "layout",
    categoryLabel: "Layout & Data",
    icon: "table-cells",
    summary: "Semantic data table with caption, scope headers, sticky columns, cell themes, and interactive cells.",
    description:
      "JsTable renders an accessible <table> with <caption>, proper <th scope='col'> and <th scope='row'> headers, a keyboard-focusable horizontal scroll region, optional sticky left/right columns, cell theme badges, markdown parsing, and scoped cell customization.",
    accessibilityNotes: [
      "Scrollable wrapper sets `role='region'`, `aria-label`, and `tabindex='0'` so keyboard users can scroll horizontally with Arrow keys.",
      "Generates `<caption>` and proper `scope='col'` / `scope='row'` attributes on header cells.",
      "Interactive cells render semantic `<button type='button'>`, `<a>`, or `<router-link>` elements.",
    ],
    component: markRaw(JsTable),
    demoComponent: markRaw(DemoJsTable),
    importSnippet: `import { JsTable } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsTable
  caption="Release Status"
  :rows="[
    ['Component', 'Status'],
    ['JsTable', { label: 'Verified', theme: 'green' }],
  ]"
  :striped="true"
  :hover="true"
/>`,
    propDocs: {
      caption: { values: "String", description: "Visible semantic <caption> and fallback scroll-region aria-label." },
      ariaLabel: { values: "String", description: "Accessible label on the scroll region when caption is omitted." },
      rows: { values: "Array<Array<String | CellObject>>", description: "2D matrix of header and body rows." },
      parseMarkdown: { values: "Boolean | String", description: "Enables JsMarkdown in cell labels." },
      padding: { values: "sm | md | lg", description: "Cell padding density." },
      headerRowCount: { values: "Number", description: "Number of leading rows rendered inside <thead>." },
      headerColCount: { values: "Number", description: "Number of leading columns rendered as <th scope='row'>." },
      colWidths: { values: "Array<String>", description: "Optional CSS width values applied to header columns." },
      leftColSticky: { values: "true | false", description: "Pins the first column during horizontal scroll." },
      rightColSticky: { values: "true | false", description: "Pins the last column during horizontal scroll." },
      scroll: { values: "true | false", description: "Wraps the table in a keyboard-scrollable horizontal container." },
      striped: { values: "true | false", description: "Alternates row background shading." },
      hover: { values: "true | false", description: "Highlights rows on pointer hover." },
      hLines: { values: "true | false", description: "Renders horizontal borders between rows." },
      vLines: { values: "true | false", description: "Renders vertical borders between columns." },
      dark: { values: "true | false", description: "Applies dark theme surface and contrast." },
      wrapHeaders: { values: "true | false", description: "Allows header cell labels to wrap across lines." },
    },
    emitDocs: {
      "cell-click": { payload: "{ event, cell, rowIndex, colIndex }", description: "Emitted when an interactive button/onClick cell is activated." },
    },
    slots: [
      { name: "header-cell", scope: "{ cell, rowIndex, colIndex }", description: "Custom renderer for <thead> header cells." },
      { name: "cell", scope: "{ cell, rowIndex, colIndex }", description: "Custom renderer for <tbody> data cells." },
    ],
    extraTables: [
      {
        id: "cell-object",
        label: "Cell Object Keys",
        caption: "Supported properties on object cells inside JsTable rows",
        rows: [
          ["Key", "Type", "Description"],
          ["**label**", "String | Number", "Cell text (supports JsMarkdown when parseMarkdown is active)."],
          ["**align**", "'l' | 'c' | 'r'", "Horizontal text alignment."],
          ["**theme**", "String", "Semantic pill/cell highlight (green, blue, yellow, red, grey, muted)."],
          ["**icon / iconBG / iconColor**", "String / Boolean", "Leading JsIcon inside the cell."],
          ["**button / onClick / link / linkExt / route**", "Boolean / Function / String", "Makes the cell an interactive button or link."],
          ["**wrap / span / rowspan / rowActive / auxText**", "Boolean / Number / String", "Wrapping, col/row spanning, active row highlight, and secondary text."],
          ["**component / props**", "Component / Object", "Renders a custom Vue component inside the cell."],
        ],
      },
    ],
  },
];
