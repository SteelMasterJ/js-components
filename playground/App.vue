<template>
  <main class="pg-shell">
    <header class="pg-header">
      <h1>js-components Playground</h1>
      <p>
        Batch 2A Showcase — Vue 3 Options API, semantic HTML, WCAG 2.1 AA,
        vanilla CSS, and slotted SVG icons.
      </p>
    </header>

    <!-- 1. JsNavItem (Primary Component + All Composed Sub-Items) -->
    <section class="pg-section" aria-labelledby="navitem-heading">
      <h2 id="navitem-heading">
        1. JsNavItem (Core Component &amp; Composed Sub-Items)
      </h2>
      <p v-if="lastNavClick" class="pg-hint" role="status" aria-live="polite">
        Last clicked item: <strong>{{ lastNavClick }}</strong>
      </p>

      <div class="pg-stack">
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
    </section>

    <!-- 2. JsModal -->
    <section class="pg-section" aria-labelledby="modal-heading">
      <h2 id="modal-heading">
        2. JsModal (Sizes, Slots, Dynamic Component, Focus Trap &amp; Escape)
      </h2>
      <div class="pg-row">
        <button type="button" class="pg-btn" @click="openModal('sm')">
          Open Small Modal
        </button>
        <button
          type="button"
          class="pg-btn pg-btn--primary"
          @click="openModal('md')"
        >
          Open Medium Modal (Header + Footer)
        </button>
        <button type="button" class="pg-btn" @click="openModal('lg')">
          Open Large Modal
        </button>
        <button type="button" class="pg-btn" @click="openModal('full')">
          Open Fullscreen Modal
        </button>
        <button type="button" class="pg-btn" @click="lockedModalOpen = true">
          Open Locked Modal (No Backdrop/ESC Close)
        </button>
        <button type="button" class="pg-btn" @click="dynamicModalOpen = true">
          Open Dynamic Component Modal
        </button>
      </div>

      <JsModal
        v-model="modalOpen"
        :size="modalSize"
        :title="`Modal Example (${modalSize.toUpperCase()})`"
      >
        <p>
          Try pressing <strong>Tab</strong> and <strong>Shift+Tab</strong> to
          verify focus stays trapped inside the modal, or press
          <strong>Escape</strong> (or click the backdrop) to close and restore
          focus to the trigger button.
        </p>
        <label class="pg-field">
          Sample focusable input
          <input type="text" placeholder="Type something..." />
        </label>
        <template #footer="{ close }">
          <button type="button" class="pg-btn" @click="close">Cancel</button>
          <button type="button" class="pg-btn pg-btn--primary" @click="close">
            Confirm
          </button>
        </template>
      </JsModal>

      <JsModal
        v-model="lockedModalOpen"
        title="Action Required"
        size="sm"
        :close-on-backdrop="false"
        :close-on-esc="false"
        :hide-close="true"
      >
        <p>
          Backdrop clicks and Escape are disabled here. You must explicitly
          choose an action below.
        </p>
        <template #footer="{ close }">
          <button type="button" class="pg-btn pg-btn--primary" @click="close">
            Acknowledge
          </button>
        </template>
      </JsModal>

      <JsModal
        v-model="dynamicModalOpen"
        title="Dynamic :component Rendering"
        :component="dynamicModalContent"
        :component-props="{
          val: 'Rendered dynamically via **:component** + **:component-props** gn[Works!]',
          parse: true,
        }"
      >
        <template #footer="{ close }">
          <button type="button" class="pg-btn" @click="close">Done</button>
        </template>
      </JsModal>
    </section>

    <!-- 3. JsMarkdown -->
    <section class="pg-section" aria-labelledby="md-heading">
      <h2 id="md-heading">
        3. JsMarkdown (Inline Formatting, Accessible Tags &amp; XSS Safety)
      </h2>
      <div class="pg-stack">
        <div class="pg-card">
          <h3>Plain text (parse=false)</h3>
          <JsMarkdown val="This *remains* plain _text_ with [unparsed] tags." />
        </div>

        <div class="pg-card">
          <h3>Parsed rich text + links + showTitle (parse=true)</h3>
          <JsMarkdown
            :parse="true"
            :show-title="true"
            val="**Bold**, *also bold*, _semantic em_, [Accessible Link](https://vuejs.org), and bare URL https://developer.mozilla.org"
          />
        </div>

        <div class="pg-card">
          <h3>All WCAG-checked Tag Colors</h3>
          <JsMarkdown
            :parse="true"
            val="[default] bl[blue] db[dark-blue] lb[light-blue] lt[light] wh[white] dk[dark] yw[yellow] or[orange] pu[purple] gn[green] rd[red]"
          />
        </div>

        <div class="pg-card">
          <h3>XSS &amp; Unsafe URL Sanitization Check</h3>
          <JsMarkdown
            :parse="true"
            val='<script>alert("xss")</script> [Blocked JS Link](javascript:alert(1)) &amp; *safe bold*'
          />
        </div>
      </div>
    </section>

    <!-- 4. JsTabs -->
    <section class="pg-section" aria-labelledby="tabs-heading">
      <h2 id="tabs-heading">
        4. JsTabs (Themes, Sizes, Alignments, Keyboard Arrows &amp; Disabled)
      </h2>
      <div class="pg-stack">
        <div class="pg-card">
          <h3>
            Light Theme, Stretch (default), Icons, Badges &amp; Disabled Tab
            (v-model={{ activeTab1 }})
          </h3>
          <JsTabs
            v-model="activeTab1"
            :items="tabItems1"
            aria-label="Account sections"
          >
            <template #tab-overview>
              <p>
                Use <strong>ArrowLeft</strong>, <strong>ArrowRight</strong>,
                <strong>Home</strong>, and <strong>End</strong> while focused on
                a tab to move cleanly across enabled tabs (skipping Disabled).
              </p>
            </template>
            <template #tab-notifications>
              <p>
                You have 4 unread notifications rendered inside named slot
                <code>#tab-notifications</code>.
              </p>
            </template>
            <template #tab-settings>
              <p>
                Settings panel content (accessible <code>role="tabpanel"</code>).
              </p>
            </template>
          </JsTabs>
        </div>

        <div class="pg-card">
          <h3>
            Dark Theme, Small Size, Start-Aligned + Markdown Labels &amp; Custom
            SVG Slot
          </h3>
          <JsTabs
            v-model="activeTab2"
            :items="tabItems2"
            theme="dark"
            size="sm"
            align="start"
            :parse-markdown="true"
            aria-label="Dark theme tabs"
          >
            <template #tab-icon="{ index }">
              <JsIcon v-if="index === 0">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  />
                </svg>
              </JsIcon>
            </template>
            <template #tab0>
              <p>
                Rendered via index-based slot <code>#tab0</code> with a custom
                slotted SVG icon.
              </p>
            </template>
            <template #tab1>
              <p>Rendered via index-based slot <code>#tab1</code>.</p>
            </template>
            <template #tab2>
              <p>Rendered via index-based slot <code>#tab2</code>.</p>
            </template>
          </JsTabs>
        </div>

        <div class="pg-card">
          <h3>
            Large Size, Center-Aligned + Fallback Scoped #panel Slot (5 Tabs —
            Responsive Scroll on Mobile)
          </h3>
          <JsTabs
            :items="tabItems3"
            size="lg"
            align="center"
            aria-label="Large scrollable tabs"
          >
            <template #panel="{ item, index }">
              <p>
                Dynamic panel #{{ index + 1 }}: <strong>{{ item.label }}</strong>
                — {{ item.content }}
              </p>
            </template>
          </JsTabs>
        </div>
      </div>
    </section>

    <!-- 5. JsIcon -->
    <section class="pg-section" aria-labelledby="icons-heading">
      <h2 id="icons-heading">
        5. JsIcon (Built-in Chrome &amp; Slotted Custom SVGs)
      </h2>
      <div class="pg-row">
        <span class="pg-chip"><JsIcon name="search" /> search</span>
        <span class="pg-chip"><JsIcon name="chevron-down" /> chevron-down</span>
        <span class="pg-chip"><JsIcon name="chevron-right" /> chevron-right</span>
        <span class="pg-chip"><JsIcon name="caret-down" /> caret-down</span>
        <span class="pg-chip"><JsIcon name="check" color="#1e7e34" /> check (colored)</span>
        <span class="pg-chip"><JsIcon name="alert" color="#c5221f" /> alert</span>
        <span class="pg-chip"><JsIcon name="bell" /> bell</span>
        <span class="pg-chip"><JsIcon name="external" /> external</span>
        <span class="pg-chip"><JsIcon name="close" /> close</span>
        <span class="pg-chip"><JsIcon name="spinner" spin /> spinner (spin)</span>
        <span class="pg-chip">
          <JsIcon label="Custom star" color="#b85600">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
          </JsIcon>
          Custom SVG slot
        </span>
      </div>
    </section>
  </main>
</template>

<script>
import { markRaw } from "vue";
import JsMarkdown from "../src/components/Markdown.vue";

export default {
  name: "PlaygroundApp",
  data() {
    return {
      modalOpen: false,
      modalSize: "md",
      lockedModalOpen: false,
      dynamicModalOpen: false,
      dynamicModalContent: markRaw(JsMarkdown),
      activeTab1: "overview",
      activeTab2: 0,
      tabItems1: [
        { id: "overview", label: "Overview", icon: "search" },
        { id: "notifications", label: "Notifications", icon: "bell", badge: 4 },
        { id: "disabled", label: "Disabled", disabled: true },
        { id: "settings", label: "Settings", icon: "check" },
      ],
      tabItems2: [
        { label: "*Featured* gn[New]" },
        { label: "Analytics bl[Pro]" },
        { label: "Exports" },
      ],
      tabItems3: [
        { label: "General", content: "Core configuration options." },
        { label: "Security", content: "Password & 2FA controls." },
        { label: "Billing", content: "Invoices and subscription details." },
        { label: "Integrations", content: "Webhooks and API keys." },
        { label: "Audit Log", content: "Recent account activity." },
      ],
      demoThumb:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#1d6f90"/><circle cx="32" cy="25" r="11" fill="#ffffff"/><path d="M14 54c3-11 33-11 36 0" fill="#ffffff"/></svg>'
        ),
      lastNavClick: "",
      lightBgThemes: [
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
      ],
      darkBgThemes: ["light-text", "headingdark", "dark-xray"],
      navDropdownSimple: {
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
      },
      navDropdownLight: {
        label: "Light Menu",
        icon: "ellipsis-vertical",
        items: [
          { label: "Edit", icon: "check" },
          { label: "Duplicate" },
          { divider: true },
          { label: "Disabled Option", disabled: true },
        ],
      },
      navDropdownTabbed: {
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
      },
    };
  },
  methods: {
    openModal(size) {
      this.modalSize = size;
      this.modalOpen = true;
    },
    onNavClick(_event, item) {
      this.lastNavClick = item?.label || "(unnamed)";
    },
  },
};
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  color: var(--js-color-text);
  background: var(--js-color-surface-alt);
  line-height: var(--js-line-height);
}

.pg-shell {
  max-width: 68rem;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
}

.pg-header {
  margin-bottom: 2rem;
}

.pg-header h1 {
  margin: 0 0 0.25rem;
  font-size: 1.75rem;
}

.pg-header p {
  margin: 0;
  color: var(--js-color-text-muted);
}

.pg-section {
  background: var(--js-color-surface);
  border: 1px solid var(--js-color-border);
  border-radius: var(--js-radius-lg);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.pg-section > h2 {
  margin: 0 0 1rem;
  font-size: 1.15rem;
}

.pg-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pg-card {
  padding: 1rem;
  border: 1px solid var(--js-color-border);
  border-radius: var(--js-radius-md);
  background: var(--js-color-surface-alt);
}

.pg-card > h3 {
  margin: 0 0 0.75rem;
  font-size: 0.9rem;
  color: var(--js-color-text-muted);
}

.pg-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  align-items: center;
}

.pg-row--spacious {
  padding-top: 0.6rem;
  gap: 1rem;
}

.pg-grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 0.75rem;
}

.pg-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  border-radius: var(--js-radius-pill);
  background: var(--js-color-surface);
  border: 1px solid var(--js-color-border);
  font-size: var(--js-font-size-sm);
}

.pg-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--js-touch-min);
  padding: 0.45rem 0.9rem;
  border: 1px solid var(--js-color-border-strong);
  border-radius: var(--js-radius-md);
  background: var(--js-color-surface);
  color: var(--js-color-text);
  font: inherit;
  font-size: var(--js-font-size-sm);
  font-weight: 600;
  cursor: pointer;
}

.pg-btn:hover {
  background: var(--js-color-surface-hover);
}

.pg-btn:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: var(--js-focus-offset);
}

.pg-btn--primary {
  background: var(--js-color-primary);
  border-color: var(--js-color-primary);
  color: var(--js-color-primary-text);
}

.pg-btn--primary:hover {
  background: var(--js-color-primary-hover);
}

.pg-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: var(--js-font-size-sm);
  font-weight: 600;
}

.pg-field input {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--js-color-border-strong);
  border-radius: var(--js-radius-sm);
  font: inherit;
}

.pg-field input:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: 1px;
}

.pg-hint {
  margin: 0 0 0.75rem;
  font-size: var(--js-font-size-sm);
  color: var(--js-color-primary-hover);
}

.pg-dark-strip {
  margin-top: 0.75rem;
  padding: 0.75rem;
  border-radius: var(--js-radius-md);
  background: var(--js-color-surface-dark);
}
</style>
