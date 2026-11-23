<script setup>
import { ref } from "vue";
import { JsIcon, JsNavItem } from "@steelmasterj/js-components";
import { demoThumb } from "../../data/demoAssets.js";

const lastNavClick = ref("");

const lightBgThemes = [
  "light",
  "dark",
  "dark-text",
  "lightblue",
  "blue",
  "blue-text",
  "darkblue",
  "darkblue-text",
  "green",
  "green-text",
  "orange",
  "orange-text",
  "lightorange",
  "purple",
  "purple-text",
  "heading",
  "light-xray",
];

const darkBgThemes = ["light-text", "headingdark", "dark-xray"];

const navDropdownSimple = {
  label: "Dark Dropdown",
  icon: "list-ul",
  items: [
    { header: true, label: "Quick Actions" },
    { label: "Profile", icon: "check", onClick: () => {} },
    { label: "Notifications", icon: "bell", notifyCount: 4 },
    { divider: true },
    {
      label: "More Options",
      items: [
        { label: "Nested Action A", onClick: () => {} },
        { label: "External Guide", linkExt: "https://vuejs.org" },
      ],
    },
  ],
};

const navDropdownLight = {
  label: "Light Menu",
  icon: "ellipsis-vertical",
  items: [
    { label: "Edit", icon: "check" },
    { label: "Duplicate" },
    { divider: true },
    { label: "Disabled Option", disabled: true },
  ],
};

const navDropdownTabbed = {
  label: "Tabbed Dropdown",
  icon: "table-cells",
  items: [
    {
      id: "recent",
      label: "Recent",
      items: [
        { label: "*Project Alpha* gn[Active]", subLabel: "Updated 2m ago" },
        { label: "Design Tokens", subLabel: "Updated 1h ago" },
      ],
    },
    {
      id: "starred",
      label: "Starred",
      items: [
        { label: "Component Guide bl[Docs]", linkExt: "https://vuejs.org" },
        { label: "Accessibility Checklist", icon: "check" },
      ],
    },
  ],
};

function onNavClick(_event, item) {
  lastNavClick.value = item?.label || "(unnamed)";
}
</script>

<template>
  <div class="pg-stack">
    <p v-if="lastNavClick" class="pg-hint" role="status" aria-live="polite">
      Last clicked item: <strong>{{ lastNavClick }}</strong>
    </p>

    <!-- Interactive Types & States -->
    <div class="pg-card">
      <h3>Interactive Types &amp; States</h3>
      <div class="pg-row">
        <JsNavItem
          :item="{ label: 'Action Button', icon: 'check', button: 'button' }"
          theme="blue"
          @click="onNavClick"
        />
        <JsNavItem
          :item="{
            label: 'Active Item',
            icon: 'bell',
            active: true,
            notifyCount: 3,
            notifyUnits: 'alert',
          }"
          theme="light"
          @click="onNavClick"
        />
        <JsNavItem
          :item="{
            label: 'Vue Docs',
            linkExt: 'https://vuejs.org',
            tip: 'Opens in new tab',
            tipPos: 't',
          }"
          theme="lightblue"
        />
        <JsNavItem
          :item="{
            label: 'Internal Route',
            route: '#navitem-heading',
            arrow: true,
          }"
          theme="light"
        />
        <JsNavItem
          :item="{ label: 'Loading...', wait: true, disabled: true }"
          theme="blue"
        />
        <JsNavItem
          :item="{
            label: '*Composed* Item',
            subLabel: 'Tags + Icon + Notify + Action',
            tags: 'gn[New] bl[v3]',
            icon: 'search',
            notifyCount: 7,
            notifyColor: 'red',
            arrow: true,
            tip: 'Hover or keyboard focus me!',
            tipPos: 'tr',
          }"
          :parse-markdown="true"
          theme="light"
          @click="onNavClick"
        />
      </div>
    </div>

    <!-- Dropdown Menus (Viewport-Aware Positioning) -->
    <div class="pg-card">
      <h3>Dropdown Menus (Nested Submenu, Light Right-Aligned &amp; Tabbed — Auto-Flips Near Viewport Edges)</h3>
      <div class="pg-row">
        <JsNavItem
          :item="navDropdownSimple"
          theme="dark"
          drop-theme="dark"
          drop-size="md"
          @click="onNavClick"
        />
        <JsNavItem
          :item="navDropdownLight"
          theme="light"
          drop-theme="light"
          drop-size="sm"
          :drop-right="true"
          @click="onNavClick"
        />
        <JsNavItem
          :item="navDropdownTabbed"
          theme="blue"
          :drop-tabs="true"
          drop-theme="dark"
          drop-size="lg"
          :parse-markdown="true"
          @click="onNavClick"
        />
      </div>
    </div>

    <!-- All Color Themes -->
    <div class="pg-card">
      <h3>Color Themes (Solid, Soft &amp; Text Variants)</h3>
      <div class="pg-row">
        <JsNavItem
          v-for="t in lightBgThemes"
          :key="t"
          :item="{ label: t, button: 'button' }"
          :theme="t"
          size="sm"
          @click="onNavClick"
        />
      </div>
      <div class="pg-row pg-dark-strip">
        <JsNavItem
          v-for="t in darkBgThemes"
          :key="t"
          :item="{ label: t, button: 'button' }"
          :theme="t"
          size="sm"
          @click="onNavClick"
        />
      </div>
    </div>

    <!-- Sizes -->
    <div class="pg-card">
      <h3>Sizes (xs, sm, md, lg, xl, xxl)</h3>
      <div class="pg-row">
        <JsNavItem
          v-for="s in ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']"
          :key="s"
          :item="{ label: s.toUpperCase(), icon: 'check', button: 'button' }"
          :size="s"
          theme="lightblue"
          @click="onNavClick"
        />
      </div>
    </div>

    <!-- Shapes -->
    <div class="pg-card">
      <h3>Shapes (Circle, Thumbnail Card &amp; Inset)</h3>
      <div class="pg-row">
        <JsNavItem
          :item="{ label: 'Profile', icon: 'bell', button: 'button' }"
          theme="blue"
          :circle="true"
          @click="onNavClick"
        />
        <JsNavItem
          :item="{
            label: 'Thumbnail Card',
            subLabel: 'Responsive image card',
            img: demoThumb,
            imgAlt: 'Geometric card preview',
            tags: ['Featured'],
            notifyCount: 2,
            button: 'button',
          }"
          theme="light"
          :thumb="true"
          @click="onNavClick"
        />
        <JsNavItem
          :item="{ label: 'Inset Style', icon: 'check', button: 'button' }"
          theme="lightblue"
          :inset="true"
          @click="onNavClick"
        />
      </div>
    </div>

    <!-- Sub-Item: NavItemIcon housed inside JsNavItem -->
    <div class="pg-card">
      <h3>Sub-Item: NavItemIcon (Built-in Icon, Custom SVG Slot, Number &amp; Thumbnail)</h3>
      <div class="pg-row">
        <JsNavItem
          :item="{ label: 'Built-in Icon', icon: 'bell', iconColor: '#1d6f90', button: 'button' }"
          theme="light"
          @click="onNavClick"
        />
        <JsNavItem
          :item="{ label: 'Custom SVG Slot', subLabel: 'Zero FontAwesome', button: 'button' }"
          theme="purple"
          @click="onNavClick"
        >
          <template #icon>
            <JsIcon>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </JsIcon>
          </template>
        </JsNavItem>
        <JsNavItem
          :item="{ label: 'Active Users', subLabel: 'Number media', number: 42, button: 'button' }"
          theme="light"
          @click="onNavClick"
        />
        <JsNavItem
          :item="{
            label: 'Avatar Thumbnail',
            subLabel: 'Inline image',
            img: demoThumb,
            imgAlt: 'Sample geometric avatar',
            button: 'button',
          }"
          theme="light"
          @click="onNavClick"
        />
      </div>
    </div>

    <!-- Sub-Item: NavItemLabels housed inside JsNavItem -->
    <div class="pg-card">
      <h3>Sub-Item: NavItemLabels (Truncated vs Wrapped &amp; Markdown)</h3>
      <div class="pg-grid-2">
        <JsNavItem
          :block="true"
          theme="light"
          :item="{
            label: 'Single Line Truncated Label That Is Very Long For Testing Overflow',
            subLabel: 'Compact truncated subtitle',
            button: 'button',
          }"
          @click="onNavClick"
        />
        <JsNavItem
          :block="true"
          theme="light"
          :parse-markdown="true"
          :wrap="true"
          :item="{
            label: '*Formatted* Label gn[New]',
            subLabel: 'Wrapped _subtitle_ that flows cleanly across narrow viewports.',
            button: 'button',
          }"
          @click="onNavClick"
        />
      </div>
    </div>

    <!-- Sub-Item: NavItemNotify housed inside JsNavItem -->
    <div class="pg-card">
      <h3>Sub-Item: NavItemNotify (All WCAG AA Badge Colors, Counts, Labels &amp; Icons)</h3>
      <div class="pg-row">
        <JsNavItem
          :item="{ label: 'Messages', notifyCount: 3, notifyUnits: 'message', button: 'button' }"
          notify-color="orange"
          theme="light"
          @click="onNavClick"
        />
        <JsNavItem
          :item="{ label: 'Alerts', notifyCount: 12, notifyUnits: 'alert', button: 'button' }"
          notify-color="red"
          theme="light"
          @click="onNavClick"
        />
        <JsNavItem
          :item="{ label: 'Status', notifyLabel: 'Online', notifyIcon: 'check', button: 'button' }"
          notify-color="green"
          theme="light"
          @click="onNavClick"
        />
        <JsNavItem
          :item="{ label: 'Updates', notifyCount: 5, notifyIcon: 'bell', button: 'button' }"
          notify-color="blue"
          theme="light"
          @click="onNavClick"
        />
        <JsNavItem
          :item="{ label: 'Archived', notifyLabel: 'Muted', button: 'button' }"
          notify-color="grey"
          theme="light"
          @click="onNavClick"
        />
        <JsNavItem
          :item="{ label: 'Light Badge', notifyLabel: 'Info', button: 'button' }"
          notify-color="light"
          theme="dark"
          @click="onNavClick"
        />
      </div>
    </div>

    <!-- Sub-Item: NavItemTags housed inside JsNavItem -->
    <div class="pg-card">
      <h3>Sub-Item: NavItemTags (Array Tags &amp; Colored Markdown Tags)</h3>
      <div class="pg-row pg-row--spacious">
        <JsNavItem
          :item="{
            label: 'Array Tags',
            subLabel: 'Semantic tag list overlay',
            tags: ['Vue 3', 'WCAG AA'],
            button: 'button',
          }"
          theme="light"
          @click="onNavClick"
        />
        <JsNavItem
          :item="{
            label: 'Markdown Tags',
            subLabel: 'Color-coded status tags',
            tags: 'bl[Info] gn[Stable] or[Beta]',
            button: 'button',
          }"
          theme="light"
          @click="onNavClick"
        />
      </div>
    </div>

    <!-- Sub-Item: NavItemActions housed inside JsNavItem -->
    <div class="pg-card">
      <h3>Sub-Item: NavItemActions (External, Spinner, Check, Arrow, Dropdown, Kabob &amp; Custom Slot)</h3>
      <div class="pg-row">
        <JsNavItem
          :item="{ label: 'External', linkExt: 'https://vuejs.org' }"
          theme="light"
        />
        <JsNavItem
          :item="{ label: 'Working', wait: true, button: 'button' }"
          theme="light"
          @click="onNavClick"
        />
        <JsNavItem
          :item="{ label: 'Saved', check: true, button: 'button' }"
          theme="light"
          @click="onNavClick"
        />
        <JsNavItem
          :item="{ label: 'Continue', arrow: true, button: 'button' }"
          theme="light"
          @click="onNavClick"
        />
        <JsNavItem
          :item="{ label: 'Options', kabob: true, button: 'button' }"
          theme="light"
          @click="onNavClick"
        />
        <JsNavItem
          :item="{ label: 'Custom Action SVG', button: 'button' }"
          theme="lightblue"
          @click="onNavClick"
        >
          <template #action>
            <JsIcon>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                />
              </svg>
            </JsIcon>
          </template>
        </JsNavItem>
      </div>
    </div>
  </div>
</template>
