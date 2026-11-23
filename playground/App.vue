<template>
  <main class="pg-shell">
    <header class="pg-header">
      <h1>js-components Playground</h1>
      <p>
        Complete Component Library Showcase (Batches 2A–2D) — Vue 3 Options
        API, semantic HTML, WCAG 2.1 AA, vanilla CSS, and slotted SVG icons.
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

    <!-- 2. JsBtnSplit (Batch 2B) -->
    <section class="pg-section" aria-labelledby="btnsplit-heading">
      <h2 id="btnsplit-heading">
        2. JsBtnSplit (Split Button Groups — Grow Modes, Spaced Pills, Sizes &amp; Dropdowns)
      </h2>
      <div class="pg-stack">
        <div class="pg-card">
          <h3>Connected Split Button with Action Dropdown &amp; Sizes (sm, md, lg)</h3>
          <div class="pg-row">
            <JsBtnSplit
              size="sm"
              theme="blue"
              aria-label="Publish actions small"
              :items="splitPublishItems"
              @click="onNavClick"
            />
            <JsBtnSplit
              size="md"
              theme="lightblue"
              aria-label="Publish actions medium"
              :items="splitPublishItems"
              @click="onNavClick"
            />
            <JsBtnSplit
              size="lg"
              theme="green"
              aria-label="Publish actions large"
              :items="splitPublishItems"
              @click="onNavClick"
            />
          </div>
        </div>

        <div class="pg-card">
          <h3>Grow Modes (grow="first", grow="first-hover", grow="last", grow="all")</h3>
          <div class="pg-stack">
            <JsBtnSplit
              grow="first"
              theme="light"
              aria-label="Grow first group"
              :items="[
                { label: 'Primary (grow=first)', icon: 'check', button: 'button' },
                { label: 'Edit', button: 'button' },
                { icon: 'ellipsis-vertical', tip: 'More', items: [{ label: 'Archive' }, { label: 'Delete' }] },
              ]"
              @click="onNavClick"
            />
            <JsBtnSplit
              grow="first-hover"
              theme="light"
              aria-label="Grow first-hover group"
              :items="[
                { label: 'Hover me to highlight siblings (grow=first-hover)', button: 'button' },
                { label: 'Info', button: 'button' },
                { label: 'Open', arrow: true, button: 'button' },
              ]"
              @click="onNavClick"
            />
            <JsBtnSplit
              grow="last"
              theme="light"
              aria-label="Grow last group"
              :items="[
                { icon: 'bell', tip: 'Alerts', button: 'button' },
                { label: 'Stretched Trailing Button (grow=last)', button: 'button' },
              ]"
              @click="onNavClick"
            />
            <JsBtnSplit
              grow="all"
              theme="dark"
              aria-label="Equal width segmented buttons"
              :items="[
                { label: 'Day', active: true, button: 'button' },
                { label: 'Week', button: 'button' },
                { label: 'Month', button: 'button' },
              ]"
              @click="onNavClick"
            />
          </div>
        </div>

        <div class="pg-card">
          <h3>Spaced Pill Mode (spaced=true)</h3>
          <JsBtnSplit
            :spaced="true"
            grow="all"
            theme="lightblue"
            aria-label="Spaced navigation actions"
            :items="[
              { label: 'Back', icon: 'chevron-left', button: 'button' },
              { label: 'Save Draft', button: 'button' },
              { label: 'Next', icon: 'chevron-right', button: 'button' },
            ]"
            @click="onNavClick"
          />
        </div>
      </div>
    </section>

    <!-- 3. JsNavList (Batch 2B) -->
    <section class="pg-section" aria-labelledby="navlist-heading">
      <h2 id="navlist-heading">
        3. JsNavList (Headers, Semantic Dividers, Nested Submenus, Embedded Split &amp; Custom Component)
      </h2>
      <div class="pg-grid-2">
        <div class="pg-card pg-dark-card">
          <h3>Dark Theme (menu=true, Headers, Dividers, Embedded JsBtnSplit &amp; Nested Submenu)</h3>
          <JsNavList
            theme="dark"
            size="sm"
            :menu="true"
            :parse-markdown="true"
            aria-label="Dark navigation list"
            :items="navListDemoItems"
            @select="onListSelect"
          />
        </div>

        <div class="pg-card">
          <h3>Light Theme (Custom :component Entry, Badges &amp; External Link)</h3>
          <JsNavList
            theme="light"
            size="sm"
            :parse-markdown="true"
            aria-label="Light navigation list"
            :items="navListLightItems"
            @select="onListSelect"
          />
        </div>
      </div>
    </section>

    <!-- 4. JsDrop (Batch 2B) -->
    <section class="pg-section" aria-labelledby="drop-heading">
      <h2 id="drop-heading">
        4. JsDrop (Triggered Popovers w/ Viewport Flip, Tabbed Menus, Dynamic :component &amp; Inline Panels)
      </h2>
      <div class="pg-stack">
        <div class="pg-card">
          <h3>Triggered Dropdowns (Auto-Flips Above Near Bottom Edge, Escape &amp; Outside-Click Close)</h3>
          <div class="pg-row">
            <JsDrop
              trigger-label="Dark Menu (sm)"
              trigger-icon="list-ul"
              theme="dark"
              size="sm"
              :items="dropSimpleItems"
              @select="onListSelect"
            />
            <JsDrop
              trigger-label="Light Tabbed (md, right)"
              trigger-icon="table-cells"
              theme="light"
              size="md"
              :tabs="true"
              :right="true"
              :parse-markdown="true"
              :items="navDropdownTabbed.items"
              @select="onListSelect"
            />
            <JsDrop
              trigger-label="Dynamic :component (md)"
              theme="light"
              size="md"
              :component="dynamicModalContent"
              :component-props="{
                val: 'Rendered inside **JsDrop** via `:component` gn[Live]',
                parse: true,
              }"
            />
            <JsDrop
              v-model="controlledDropOpen"
              trigger-label="v-model Controlled"
              theme="dark"
              size="sm"
            >
              <template #default="{ close }">
                <div class="pg-drop-custom">
                  <p>Custom slot content inside <code>JsDrop</code>.</p>
                  <button type="button" class="pg-btn pg-btn--primary" @click="close">
                    Close Programmatically
                  </button>
                </div>
              </template>
            </JsDrop>
          </div>
        </div>

        <div class="pg-card">
          <h3>Standalone Inline Panels (No Trigger — Backwards-Compatible Panel Mode)</h3>
          <div class="pg-row pg-row--top">
            <JsDrop
              theme="dark"
              size="sm"
              aria-label="Inline dark panel"
              :items="dropSimpleItems"
              @select="onListSelect"
            />
            <JsDrop
              theme="light"
              size="md"
              :tabs="true"
              :parse-markdown="true"
              aria-label="Inline light tabbed panel"
              :items="navDropdownTabbed.items"
              @select="onListSelect"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 5. JsPanelNavItem (Batch 2B) -->
    <section class="pg-section" aria-labelledby="panelnavitem-heading">
      <h2 id="panelnavitem-heading">
        5. JsPanelNavItem (Thin Wrapper Delegating to JsNavItem + dropPos &amp; Slot Forwarding)
      </h2>
      <div class="pg-row">
        <JsPanelNavItem
          theme="blue"
          drop-pos="br"
          :item="{
            label: 'Panel Item (dropPos=br)',
            icon: 'bell',
            notifyCount: 2,
            items: dropSimpleItems,
          }"
          @click="onNavClick"
        />
        <JsPanelNavItem
          theme="light"
          :item="{ label: 'Forwarded Custom SVG Slot', subLabel: 'Delegates to JsNavItem', button: 'button' }"
          @click="onNavClick"
        >
          <template #icon>
            <JsIcon color="#1e7e34">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </JsIcon>
          </template>
        </JsPanelNavItem>
      </div>
    </section>

    <!-- 6. JsModal -->
    <!-- 6. JsTitleBar (Batch 2C) -->
    <section class="pg-section" aria-labelledby="titlebar-heading">
      <h2 id="titlebar-heading">
        6. JsTitleBar (Breadcrumbs, Configurable Heading Level, Docked Banner, Dropdown Header &amp; Dark Theme)
      </h2>
      <div class="pg-stack">
        <div class="pg-card">
          <h3>Full TitleBar (Breadcrumbs, Custom SVG Slot, Action Buttons, Docked Banner &amp; Description)</h3>
          <JsTitleBar
            :heading-level="3"
            title="Design *System* gn[v0.1]"
            sub-title="Lightweight, accessible Vue 3 primitives"
            :parse-markdown="true"
            background="#e6f3f8"
            :crumbs="[
              { label: 'Home', route: '#navitem-heading' },
              { label: 'Library', route: '#titlebar-heading' },
              { label: 'Components' },
            ]"
            :buttons="[
              { label: 'Docs', linkExt: 'https://vuejs.org', theme: 'light' },
              { label: 'New Release', icon: 'check', theme: 'blue', button: 'button', onClick: onNavClick },
            ]"
            banner-icon="bell"
            banner-label="Zero FontAwesome or Sass required — style SVGs directly from your app."
            banner-background="#ffffff"
            :banner-buttons="[
              { label: 'Dismiss', theme: 'dark-text', button: 'button', onClick: onNavClick },
            ]"
            description="Semantic <header>, <nav><ol> breadcrumbs, configurable heading levels, and responsive stacking."
          >
            <template #icon>
              <JsIcon color="#1d6f90">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </JsIcon>
            </template>
          </JsTitleBar>
        </div>

        <div class="pg-card pg-dark-card">
          <h3>Dark Theme + Dropdown Title Switcher</h3>
          <JsTitleBar
            :heading-level="3"
            :dark="true"
            title="Workspace Alpha"
            sub-title="Click heading to switch workspace"
            icon="table-cells"
            background="#1c1f23"
            drop-theme="dark"
            drop-size="md"
            :drop="[
              { header: true, label: 'Switch Workspace' },
              { label: 'Workspace Alpha', active: true, icon: 'check', onClick: onNavClick },
              { label: 'Workspace Beta', icon: 'bell', onClick: onNavClick },
              { divider: true },
              { label: 'Create Workspace', icon: 'chevron-right', onClick: onNavClick },
            ]"
          />
        </div>
      </div>
    </section>

    <!-- 7. JsPanel (Batch 2C) -->
    <section class="pg-section" aria-labelledby="panel-heading">
      <h2 id="panel-heading">
        7. JsPanel (Semantic Landmarks, Header/Footer Slots, Scroll Nudges, Compact &amp; Background Card)
      </h2>
      <div class="pg-grid-2">
        <JsPanel
          title="Scrollable *Panel* bl[Live]"
          :heading-level="3"
          :parse-markdown="true"
          icon="list-ul"
          height="sm"
          :scroll-hint="true"
          :footer="{ label: 'View all activity', linkExt: 'https://vuejs.org', icon: 'external' }"
        >
          <template #headerRight>
            <JsNavItem
              size="xs"
              theme="lightblue"
              :item="{ label: 'Refresh', button: 'button' }"
              @click="onNavClick"
            />
          </template>
          <p v-for="n in 8" :key="n" class="pg-panel-line">
            Activity entry #{{ n }} — scroll or click the accessible chevron nudge buttons.
          </p>
        </JsPanel>

        <JsPanel
          as="article"
          title="Compact Card with Above Note"
          :heading-level="3"
          above-note="Featured gn[New]"
          :parse-markdown="true"
          :compact="true"
          height="auto"
          :scroll="false"
          :img="demoThumb"
          img-alt="Geometric emblem"
          banner="Updated today"
          :banner-dark="false"
          notify="2 updates"
          :notify-dark="false"
        >
          <p class="pg-panel-line">
            Uses semantic <code>&lt;article&gt;</code>, <code>&lt;header&gt;</code>, and <code>&lt;footer&gt;</code> with zero rigid <code>min-width</code> locks.
          </p>
          <template #footer>
            <JsNavItem
              size="sm"
              theme="blue"
              :item="{ label: 'Open Details', arrow: true, button: 'button' }"
              @click="onNavClick"
            />
          </template>
        </JsPanel>

        <JsPanel
          title="Hero Background Panel"
          :heading-level="3"
          :title-background-transparent="true"
          :background-image="demoHeroBg"
          :background-image-shade-top="true"
          :background-image-zoom="true"
          height="md"
          :scroll="false"
          :primary-action="{ label: 'Explore', icon: 'search', button: 'button', circle: true }"
          :caption="{ label: 'Hover to zoom background', link: '#panel-heading', dark: true }"
          @action-click="onNavClick"
        >
          <template #icon>
            <JsIcon color="#ffffff">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </JsIcon>
          </template>
        </JsPanel>
      </div>
    </section>

    <!-- 8. JsPanelNav (Batch 2C) -->
    <section class="pg-section" aria-labelledby="panelnav-heading">
      <h2 id="panelnav-heading">
        8. JsPanelNav (Live Search + &lt;output&gt; Count, View Switcher, Grouping, Limit &amp; Responsive Grids)
      </h2>
      <div class="pg-stack">
        <div class="pg-card">
          <h3>Searchable + View Switcher (List / Thumb Grid) + Load All Limit (4 of 6 shown initially)</h3>
          <JsPanelNav
            aria-label="Library modules"
            :menu="true"
            :search="true"
            item-units="modules"
            layout="cols-3"
            :items-limit="4"
            :parse-markdown="true"
            :items="panelNavItems"
            @select="onListSelect"
          />
        </div>

        <div class="pg-card">
          <h3>Grouped Navigation (group-label-show-count + group-labels-left + cols-2)</h3>
          <JsPanelNav
            aria-label="Grouped components"
            :grouped="true"
            group-by="category"
            :group-label-show-count="true"
            :group-labels-left="true"
            layout="cols-2"
            :items="panelNavGroupedItems"
            @select="onListSelect"
          />
        </div>
      </div>
    </section>

    <!-- 9. JsTable (Batch 2C) -->
    <section class="pg-section" aria-labelledby="table-heading">
      <h2 id="table-heading">
        9. JsTable (Semantic Caption &amp; Scope Headers, Sticky Column, Themes, Actions &amp; Dark Mode)
      </h2>
      <div class="pg-stack">
        <div class="pg-card">
          <h3>Light Table (Striped, Hover, V-Lines, Row Headers, Sticky First Col, Cell Themes &amp; Interactive Cells)</h3>
          <JsTable
            caption="Component Readiness Matrix (Batch 2A–2C)"
            :rows="tableLightRows"
            :header-row-count="1"
            :header-col-count="1"
            :left-col-sticky="true"
            :striped="true"
            :hover="true"
            :v-lines="true"
            :parse-markdown="true"
            @cell-click="onTableCellClick"
          />
        </div>

        <div class="pg-card pg-dark-card">
          <h3>Dark Theme Table (Compact Padding, Right-Aligned Metrics &amp; Custom Scoped #cell Slot)</h3>
          <JsTable
            caption="Bundle Snapshot (Dark Theme)"
            :rows="tableDarkRows"
            :dark="true"
            :striped="true"
            :hover="true"
            padding="sm"
            :parse-markdown="true"
            @cell-click="onTableCellClick"
          />
        </div>
      </div>
    </section>

    <!-- 10. JsInput (Batch 2D) -->
    <section class="pg-section" aria-labelledby="input-heading">
      <h2 id="input-heading">
        10. JsInput (Text, Select, Textarea, Autocomplete Combobox, Floating Label, $attrs, Validation &amp; Dark Theme)
      </h2>
      <div class="pg-stack">
        <div class="pg-card">
          <h3>Text, Autocomplete Combobox (Arrow/Enter/Esc + Viewport Flip), Select &amp; Textarea</h3>
          <div class="pg-grid-2">
            <JsInput
              v-model="demoText"
              label="Full Name"
              placeholder="Jane Doe"
              icon="search"
              hint="Native $attrs like maxlength=40 are forwarded directly."
              maxlength="40"
              autocomplete="name"
            />
            <JsInput
              v-model="demoCombo"
              label="Framework (Autocomplete)"
              placeholder="Type or focus to search..."
              :items="comboItems"
              drop-theme="light"
              hint="Use ArrowDown/ArrowUp, Enter, or Escape."
            />
            <JsInput
              v-model="demoSelect"
              type="select"
              label="Role"
              placeholder="Select a role..."
              :items="[
                { label: 'Frontend Engineer', value: 'fe' },
                { label: 'Accessibility Lead', value: 'a11y' },
                { label: 'Design Systems', value: 'ds' },
              ]"
            />
            <JsInput
              v-model="demoTextarea"
              type="textarea"
              label="Bio"
              :rows="3"
              placeholder="Write a short summary..."
            />
          </div>
        </div>

        <div class="pg-card">
          <h3>States &amp; Variants (Error + role="alert", Floating Label, Custom SVG #icon, Notify, Disabled &amp; Dark)</h3>
          <div class="pg-grid-2">
            <JsInput
              v-model="demoInvalid"
              type="email"
              label="Work Email"
              placeholder="name@company.com"
              :invalid="true"
              error="Please enter a valid work email address."
            />
            <JsInput
              v-model="demoFloat"
              label="Floating Label"
              :label-placeholder="true"
              :notify-count="3"
              notify-color="blue"
            >
              <template #icon>
                <JsIcon color="#1d6f90">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </JsIcon>
              </template>
            </JsInput>
            <JsInput
              model-value="Read-only value"
              label="Disabled Input"
              :disabled="true"
              size="sm"
            />
            <div class="pg-dark-strip pg-dark-strip--flush">
              <JsInput
                v-model="demoDarkInput"
                label="Dark Theme Input"
                theme="dark"
                placeholder="Type in dark mode..."
                icon="bell"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 11. JsInputCheckbox (Batch 2D) -->
    <section class="pg-section" aria-labelledby="checkbox-heading">
      <h2 id="checkbox-heading">
        11. JsInputCheckbox (Semantic &lt;fieldset&gt;/&lt;legend&gt; Groups, Single Boolean Mode &amp; Responsive Grids)
      </h2>
      <div class="pg-grid-2">
        <div class="pg-card">
          <h3>Checkbox Group (layout="cols-2", selected: {{ demoChecks.join(", ") || "none" }})</h3>
          <JsInputCheckbox
            v-model="demoChecks"
            label="Enabled Features"
            icon="check"
            layout="cols-2"
            :items="[
              { label: 'Keyboard Nav', value: 'kb' },
              { label: 'WCAG AA Contrast', value: 'contrast' },
              { label: 'Vanilla CSS', value: 'css' },
              { label: 'SSR Safe (disabled)', value: 'ssr', disabled: true },
            ]"
            hint="Multi-column layouts collapse cleanly to 1 column on mobile."
          />
        </div>

        <div class="pg-card">
          <h3>Single Boolean Checkbox &amp; Error State (checked={{ demoSingleCheck }})</h3>
          <div class="pg-stack">
            <JsInputCheckbox
              v-model="demoSingleCheck"
              label="I agree to the *terms* and privacy policy"
              :parse-markdown="true"
              :error="demoSingleCheck ? '' : 'Acceptance is required to continue.'"
            />
            <div class="pg-dark-strip pg-dark-strip--flush">
              <JsInputCheckbox
                v-model="demoDarkChecks"
                label="Dark Theme Options"
                theme="dark"
                layout="rows"
                :items="[
                  { label: 'Email', value: 'email' },
                  { label: 'SMS', value: 'sms' },
                ]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 12. JsInputRadio (Batch 2D) -->
    <section class="pg-section" aria-labelledby="radio-heading">
      <h2 id="radio-heading">
        12. JsInputRadio (Semantic &lt;fieldset&gt;/&lt;legend&gt;, Accessible Color Swatch Dots &amp; Dark Theme)
      </h2>
      <div class="pg-grid-2">
        <div class="pg-card">
          <h3>Standard Radio Group (selected={{ demoRadio }})</h3>
          <JsInputRadio
            v-model="demoRadio"
            label="Preferred Density"
            :items="[
              { label: 'Compact', value: 'compact' },
              { label: 'Comfortable', value: 'comfortable' },
              { label: 'Spacious', value: 'spacious' },
            ]"
            hint="Use Arrow keys to move between radio options."
          />
        </div>

        <div class="pg-card">
          <h3>Color Swatch Dots Mode (dots=true + .js-sr-only labels, selected={{ demoDotColor }})</h3>
          <JsInputRadio
            v-model="demoDotColor"
            label="Accent Color"
            :dots="true"
            :items="[
              { label: 'Ocean Blue', value: '#1d6f90', color: '#1d6f90' },
              { label: 'Forest Green', value: '#1e7e34', color: '#1e7e34' },
              { label: 'Burnt Orange', value: '#a64b00', color: '#a64b00' },
              { label: 'Royal Purple', value: '#7b3896', color: '#7b3896' },
              { label: 'Crimson Red', value: '#c5221f', color: '#c5221f' },
            ]"
          />
        </div>
      </div>
    </section>

    <!-- 13. JsForm (Batch 2D) -->
    <section class="pg-section" aria-labelledby="form-heading">
      <h2 id="form-heading">
        13. JsForm (Multi-Step Wizard, Validation Summary Links, Conditional Show/Hide &amp; Responsive Grid)
      </h2>
      <div class="pg-card">
        <JsForm
          v-model="demoFormModel"
          submit-button-label="Create Project"
          :parse-markdown="true"
          @submit="onFormSubmit"
        />
        <div v-if="formSubmittedPayload" class="pg-submit-result" role="status" aria-live="polite">
          <strong>Submitted payload:</strong>
          <pre>{{ JSON.stringify(formSubmittedPayload, null, 2) }}</pre>
        </div>
      </div>
    </section>

    <!-- 14. JsModal -->
    <section class="pg-section" aria-labelledby="modal-heading">
      <h2 id="modal-heading">
        14. JsModal (Sizes, Slots, Dynamic Component, Focus Trap &amp; Escape)
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

    <!-- 15. JsMarkdown -->
    <section class="pg-section" aria-labelledby="md-heading">
      <h2 id="md-heading">
        15. JsMarkdown (Inline Formatting, Accessible Tags &amp; XSS Safety)
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

    <!-- 16. JsTabs -->
    <section class="pg-section" aria-labelledby="tabs-heading">
      <h2 id="tabs-heading">
        16. JsTabs (Themes, Sizes, Alignments, Keyboard Arrows &amp; Disabled)
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

    <!-- 17. JsIcon -->
    <section class="pg-section" aria-labelledby="icons-heading">
      <h2 id="icons-heading">
        17. JsIcon (Built-in Chrome &amp; Slotted Custom SVGs)
      </h2>
      <div class="pg-row">
        <span class="pg-chip"><JsIcon name="search" /> search</span>
        <span class="pg-chip"><JsIcon name="chevron-down" /> chevron-down</span>
        <span class="pg-chip"><JsIcon name="chevron-right" /> chevron-right</span>
        <span class="pg-chip"><JsIcon name="caret-down" /> caret-down</span>
        <span class="pg-chip"><JsIcon name="check" color="#1e7e34" /> check (colored)</span>
        <span class="pg-chip"><JsIcon name="info-circle" color="#1d6f90" /> info-circle</span>
        <span class="pg-chip"><JsIcon name="check-circle" color="#1e7e34" /> check-circle</span>
        <span class="pg-chip"><JsIcon name="warning-triangle" color="#a64b00" /> warning-triangle</span>
        <span class="pg-chip"><JsIcon name="danger-circle" color="#c5221f" /> danger-circle</span>
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

    <!-- 18. JsAlert -->
    <section class="pg-section" aria-labelledby="alert-heading">
      <h2 id="alert-heading">
        18. JsAlert (Semantic States, Distinct SVG Icons, Variants &amp; Dismissible)
      </h2>
      <div class="pg-stack">
        <div class="pg-card">
          <h3>All 4 Semantic States (Soft Default)</h3>
          <div class="pg-stack">
            <JsAlert
              type="info"
              title="Information"
              message="A new version of `@steelmasterj/js-components` is available."
              :parse-markdown="true"
            />
            <JsAlert
              type="success"
              title="Changes Saved"
              message="Your workspace configuration has been updated."
            />
            <JsAlert
              type="warning"
              title="Storage Almost Full"
              message="You are using 90% of your allocated quota."
            />
            <JsAlert
              type="danger"
              title="Deployment Failed"
              message="Unable to reach the build server. Please try again."
            />
          </div>
        </div>

        <div class="pg-card">
          <h3>Solid &amp; Outline Variants + Actions &amp; Custom Icon Slots</h3>
          <div class="pg-stack">
            <JsAlert
              type="success"
              variant="solid"
              title="Solid Success Banner"
              message="High-emphasis feedback with accessible contrast."
            />
            <JsAlert
              type="warning"
              variant="outline"
              title="Outline Warning with JsNavItem Action"
              message="Review pending permissions before continuing."
            >
              <template #actions="{ dismiss }">
                <JsNavItem
                  size="xs"
                  theme="orange"
                  :item="{ label: 'Acknowledge', button: 'button', onClick: dismiss }"
                />
              </template>
            </JsAlert>
            <JsAlert
              v-model="alertDismissibleOpen"
              type="info"
              :dismissible="true"
              title="Dismissible Alert (Custom SVG Icon)"
              message="Click the close button to dismiss, or reset below."
            >
              <template #icon>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </template>
            </JsAlert>
            <div v-if="!alertDismissibleOpen">
              <JsNavItem
                size="sm"
                theme="light"
                :item="{ label: 'Restore Dismissible Alert', button: 'button', onClick: () => { alertDismissibleOpen = true; } }"
              />
            </div>
          </div>
        </div>

        <div class="pg-card pg-dark-card">
          <h3>Dark Theme Alerts</h3>
          <div class="pg-stack">
            <JsAlert
              type="info"
              theme="dark"
              title="Dark Info"
              message="AA-compliant contrast on dark surfaces."
            />
            <JsAlert
              type="danger"
              theme="dark"
              variant="outline"
              title="Dark Outline Danger"
              message="Session expired. Sign in again to continue."
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 19. JsToast -->
    <section class="pg-section" aria-labelledby="toast-heading">
      <h2 id="toast-heading">
        19. JsToast (Programmatic &amp; Declarative Snackbar Composing JsAlert)
      </h2>
      <div class="pg-stack">
        <div class="pg-card">
          <h3>Programmatic Queue (`toast.info / success / warning / danger`)</h3>
          <div class="pg-row" style="margin-bottom: 0.75rem;">
            <JsNavItem
              size="sm"
              theme="blue"
              :item="{ label: 'Trigger Info', icon: 'info-circle', button: 'button' }"
              @click="triggerDemoToast('info')"
            />
            <JsNavItem
              size="sm"
              theme="green"
              :item="{ label: 'Trigger Success', icon: 'check-circle', button: 'button' }"
              @click="triggerDemoToast('success')"
            />
            <JsNavItem
              size="sm"
              theme="orange"
              :item="{ label: 'Trigger Warning', icon: 'warning-triangle', button: 'button' }"
              @click="triggerDemoToast('warning')"
            />
            <JsNavItem
              size="sm"
              theme="purple"
              :item="{ label: 'Trigger Danger', icon: 'danger-circle', button: 'button' }"
              @click="triggerDemoToast('danger')"
            />
            <JsNavItem
              size="sm"
              theme="dark"
              :item="{ label: 'Manual Dismiss Only', button: 'button' }"
              @click="triggerPersistentToast"
            />
            <JsNavItem
              size="sm"
              theme="light"
              :item="{ label: 'With Undo Action', button: 'button' }"
              @click="triggerUndoToast"
            />
            <JsNavItem
              size="sm"
              theme="light"
              :item="{ label: 'Clear All', button: 'button' }"
              @click="clearToasts"
            />
          </div>

          <div class="pg-row">
            <JsInput
              v-model="toastPosition"
              type="select"
              label="Toast Position"
              size="sm"
              :items="toastPositionOptions"
            />
          </div>
        </div>

        <div class="pg-card">
          <h3>Declarative v-model Snackbar</h3>
          <div class="pg-row">
            <JsNavItem
              size="sm"
              theme="lightblue"
              :item="{ label: singleSnackbarOpen ? 'Hide Snackbar' : 'Show v-model Snackbar', button: 'button' }"
              @click="singleSnackbarOpen = !singleSnackbarOpen"
            />
          </div>
        </div>
      </div>

      <JsToast :position="toastPosition" />
      <JsToast
        v-model="singleSnackbarOpen"
        type="success"
        position="bottom-center"
        :auto-dismiss="false"
        title="Declarative Snackbar"
        message="Controlled directly with v-model and manual dismiss."
      />
    </section>
  </main>
</template>

<script>
import { markRaw } from "vue";
import JsMarkdown from "../src/components/Markdown.vue";
import { toast } from "../src/utils/toast.js";

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
      controlledDropOpen: false,
      splitPublishItems: [
        { label: "Publish", icon: "check", button: "button" },
        {
          tip: "Publish options",
          items: [
            { label: "Publish Now", icon: "check" },
            { label: "Schedule...", icon: "bell" },
            { divider: true },
            { label: "Save as Draft" },
          ],
        },
      ],
      dropSimpleItems: [
        { header: true, label: "Actions" },
        { label: "View Details", icon: "search" },
        { label: "Mark Complete", icon: "check" },
        { divider: true },
        { label: "Vue Docs", linkExt: "https://vuejs.org" },
      ],
      navListDemoItems: [
        { header: true, label: "Workspace" },
        { label: "Dashboard", icon: "table-cells", active: true },
        { label: "Notifications", icon: "bell", notifyCount: 6, notifyColor: "red" },
        { divider: true },
        {
          split: true,
          items: [
            { label: "Import", button: "button" },
            { label: "Export", button: "button" },
          ],
        },
        { divider: true },
        {
          label: "Nested Tools",
          items: [
            { label: "Token Inspector" },
            { label: "WCAG Audit", icon: "check" },
          ],
        },
      ],
      navListLightItems: [
        { header: true, label: "Resources *v3*" },
        {
          component: markRaw(JsMarkdown),
          props: {
            val: "Custom **component** row rendered inside JsNavList bl[Live]",
            parse: true,
          },
        },
        { divider: true },
        { label: "Design System", subLabel: "Tokens & vanilla CSS", icon: "check" },
        { label: "External Guide", linkExt: "https://vuejs.org" },
      ],
      demoHeroBg:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f3d52"/><stop offset="100%" stop-color="#2783a8"/></linearGradient></defs><rect width="600" height="300" fill="url(#g)"/><circle cx="480" cy="70" r="105" fill="#ffffff" fill-opacity="0.18"/><circle cx="120" cy="230" r="85" fill="#ffffff" fill-opacity="0.14"/><polygon points="220,260 320,90 420,260" fill="#ffffff" fill-opacity="0.12"/></svg>'
        ),
      panelNavItems: [
        { label: "NavItem", subLabel: "Core interactive pill", icon: "check", img: "", notifyCount: 3, button: "button" },
        { label: "Modal", subLabel: "Accessible dialog", icon: "bell", button: "button" },
        { label: "Tabs", subLabel: "WAI-ARIA tablist", icon: "table-cells", button: "button" },
        { label: "Table", subLabel: "Semantic data grid", icon: "list-ul", button: "button" },
        { label: "Panel", subLabel: "Scrollable landmark", icon: "search", button: "button" },
        { label: "TitleBar", subLabel: "Header & breadcrumbs", icon: "external", button: "button" },
      ],
      panelNavGroupedItems: [
        { category: "Primitives", label: "JsIcon", icon: "search", button: "button" },
        { category: "Primitives", label: "JsMarkdown", icon: "check", button: "button" },
        { category: "Navigation", label: "JsNavItem", icon: "bell", notifyCount: 2, button: "button" },
        { category: "Navigation", label: "JsBtnSplit", icon: "list-ul", button: "button" },
        { category: "Layout", label: "JsPanel", icon: "table-cells", button: "button" },
        { category: "Layout", label: "JsTitleBar", icon: "external", button: "button" },
      ],
      tableLightRows: [
        [
          "Component",
          "Batch",
          { label: "Status", align: "c" },
          { label: "WCAG AA", align: "c" },
          { label: "Action", align: "r" },
        ],
        [
          { label: "*JsNavItem*", icon: "check", iconBG: true },
          "2A",
          { label: "Complete", theme: "green", align: "c" },
          { label: "Verified", theme: "blue", align: "c" },
          { label: "Inspect", button: true, align: "r" },
        ],
        [
          { label: "*JsBtnSplit*", icon: "list-ul" },
          "2B",
          { label: "Complete", theme: "green", align: "c" },
          { label: "Verified", theme: "blue", align: "c" },
          { label: "Docs", linkExt: "https://vuejs.org", align: "r" },
        ],
        [
          { label: "*JsTable*", icon: "table-cells" },
          "2C",
          { label: "In Review", theme: "yellow", align: "c" },
          { label: "Verified", theme: "blue", align: "c" },
          { label: "Inspect", button: true, align: "r" },
        ],
        [
          { label: "*JsForm*", icon: "alert" },
          "2D",
          { label: "Queued", theme: "grey", align: "c" },
          { label: "Pending", theme: "muted", align: "c" },
          { label: "Next", button: true, align: "r" },
        ],
      ],
      tableDarkRows: [
        [
          "Artifact",
          { label: "Format", align: "c" },
          { label: "Status", align: "c" },
          { label: "Notes", align: "r" },
        ],
        [
          "js-components.js",
          { label: "ESM", align: "c" },
          { label: "Tree-shakeable", theme: "green", align: "c" },
          { label: "Vue 3 Options API", align: "r" },
        ],
        [
          "style.css",
          { label: "Vanilla CSS", align: "c" },
          { label: "Zero Sass", theme: "blue", align: "c" },
          { label: "--js-* tokens", align: "r" },
        ],
      ],
      demoText: "",
      demoCombo: "",
      comboItems: [
        { label: "Vue 3", subLabel: "Options & Composition API" },
        { label: "Vite", subLabel: "Fast library bundler" },
        { label: "Vitest", subLabel: "Unit test runner" },
        { label: "Vanilla CSS", subLabel: "Custom properties, zero Sass" },
      ],
      demoSelect: "",
      demoTextarea: "",
      demoInvalid: "not-an-email",
      demoFloat: "Floating active",
      demoDarkInput: "",
      demoChecks: ["kb", "contrast"],
      demoSingleCheck: true,
      demoDarkChecks: ["email"],
      demoRadio: "comfortable",
      demoDotColor: "#1d6f90",
      formSubmittedPayload: null,
      demoFormModel: {
        steps: [
          {
            label: "Step 1: Project Basics",
            subLabel: "Try clicking Next with empty required fields to see the accessible error summary links.",
            icon: "list-ul",
            end: 4,
          },
          {
            label: "Step 2: Configuration",
            subLabel: "Choose deployment options and confirm settings.",
            icon: "check",
          },
        ],
        items: [
          {
            name: "projectName",
            label: "Project Name",
            placeholder: "e.g. my-app",
            value: "",
            span: "1 / 7",
            validation: [{ min: 3 }],
          },
          {
            name: "ownerEmail",
            type: "email",
            label: "Owner Email",
            placeholder: "you@example.com",
            value: "",
            span: "7 / 13",
          },
          {
            name: "visibility",
            type: "select",
            label: "Visibility",
            placeholder: "Choose visibility...",
            value: "public",
            span: "1 / 7",
            items: [
              { label: "Public", value: "public" },
              { label: "Private", value: "private" },
            ],
            actions: [{ name: "accessCode", action: "show", value: "private" }],
          },
          {
            name: "accessCode",
            label: "Private Access Code",
            placeholder: "Shown only when Private is selected",
            value: "",
            span: "7 / 13",
            hide: true,
          },
          {
            name: "features",
            type: "checkbox",
            label: "Included Capabilities",
            layout: "cols-2",
            value: ["a11y"],
            items: [
              { label: "WCAG 2.1 AA", value: "a11y" },
              { label: "Tree-shaking", value: "tree" },
              { label: "Dark Theme", value: "dark" },
              { label: "SSR Ready", value: "ssr" },
            ],
          },
          {
            name: "accent",
            type: "radio",
            label: "Brand Accent",
            dots: true,
            value: "#1d6f90",
            items: [
              { label: "Ocean Blue", value: "#1d6f90", color: "#1d6f90" },
              { label: "Forest Green", value: "#1e7e34", color: "#1e7e34" },
              { label: "Royal Purple", value: "#7b3896", color: "#7b3896" },
            ],
          },
          {
            name: "notes",
            type: "textarea",
            label: "Release Notes (Optional)",
            optional: true,
            placeholder: "Optional details...",
            value: "",
          },
          {
            type: "alert",
            alertType: "info",
            title: "Inline Form Alert",
            message: "Schema items with `type: 'alert'` render JsAlert directly inside a step without affecting submission data.",
            parseMarkdown: true,
          },
        ],
      },
      alertDismissibleOpen: true,
      singleSnackbarOpen: false,
      toastPosition: "bottom-center",
      toastPositionOptions: [
        { label: "Top Right", value: "top-right" },
        { label: "Top Center", value: "top-center" },
        { label: "Top Left", value: "top-left" },
        { label: "Bottom Right", value: "bottom-right" },
        { label: "Bottom Center", value: "bottom-center" },
        { label: "Bottom Left", value: "bottom-left" },
      ],
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
    onListSelect(item) {
      this.lastNavClick = item?.label || "(list item)";
    },
    onTableCellClick({ cell }) {
      this.lastNavClick = `Table cell: ${cell?.label || "(cell)"}`;
    },
    onFormSubmit(payload) {
      this.formSubmittedPayload = payload;
      toast.success("Form payload captured successfully.", {
        title: "Form Submitted",
      });
    },
    triggerDemoToast(type) {
      const copy = {
        info: { title: "Info", message: "Auto-dismisses in 5s (hover or focus to pause)." },
        success: { title: "Success", message: "Profile preferences saved." },
        warning: { title: "Warning", message: "API rate limit is at 85%." },
        danger: { title: "Error", message: "Could not sync changes to remote." },
      };
      toast[type](copy[type].message, { title: copy[type].title });
    },
    triggerPersistentToast() {
      toast.info("This snackbar stays open until manually dismissed.", {
        title: "Manual Dismiss",
        duration: 0,
      });
    },
    triggerUndoToast() {
      const id = toast.warning("Archived 3 items.", {
        title: "Action Required",
        duration: 7000,
        actionLabel: "Undo",
        onAction: () => {
          toast.dismiss(id);
          toast.success("Archive undone!");
        },
      });
    },
    clearToasts() {
      toast.clear();
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

.pg-dark-card {
  background: var(--js-color-surface-dark);
  color: var(--js-color-text-inverse);
}

.pg-dark-card > h3 {
  color: var(--js-color-text-inverse-muted);
}

.pg-row--top {
  align-items: flex-start;
}

.pg-drop-custom {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 0.35rem;
}

.pg-drop-custom p {
  margin: 0;
  font-size: var(--js-font-size-sm);
}

.pg-panel-line {
  margin: 0 0 0.5rem;
  font-size: var(--js-font-size-sm);
}

.pg-panel-line:last-child {
  margin-bottom: 0;
}

.pg-dark-strip--flush {
  margin-top: 0;
}

.pg-submit-result {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: var(--js-radius-md);
  background: var(--js-color-primary-soft);
  color: var(--js-color-primary-hover);
  font-size: var(--js-font-size-sm);
}

.pg-submit-result pre {
  margin: 0.5rem 0 0;
  overflow-x: auto;
  font-size: var(--js-font-size-xs);
}
</style>
