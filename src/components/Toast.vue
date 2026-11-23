<template>
  <Teleport :to="teleportTo" :disabled="disableTeleport">
    <div
      v-if="visibleToasts.length"
      :class="['js-toast-region', 'js-toast-region--' + position]"
      role="region"
      :aria-label="ariaLabel"
    >
      <TransitionGroup name="js-toast-fade" tag="div" class="js-toast-stack">
        <div
          v-for="item in visibleToasts"
          :key="item.id"
          :class="[
            'js-toast-item',
            { 'js-toast-item--paused': Boolean(pausedIds[item.id]) },
          ]"
          @mouseenter="onMouseEnter(item)"
          @mouseleave="onMouseLeave(item)"
          @focusin="onFocusIn(item)"
          @focusout="onFocusOut(item, $event)"
          @keydown.esc.stop="dismissToast(item)"
        >
          <JsAlert
            class="js-toast-alert"
            :type="item.type || 'info'"
            :variant="item.variant || variant"
            :theme="item.theme || theme"
            :title="item.title || ''"
            :message="item.message || ''"
            :icon="item.icon || ''"
            :hide-icon="Boolean(item.hideIcon)"
            :dismissible="resolveDismissible(item)"
            :close-label="closeLabel"
            :parse-markdown="item.parseMarkdown ?? parseMarkdown"
            @dismiss="dismissToast(item)"
          >
            <template v-if="$slots.default && isSingleMode" #default>
              <slot :item="item" :dismiss="() => dismissToast(item)" />
            </template>

            <template v-if="item.actionLabel || $slots.actions" #actions>
              <slot
                name="actions"
                :item="item"
                :dismiss="() => dismissToast(item)"
              >
                <JsNavItem
                  v-if="item.actionLabel"
                  size="xs"
                  :theme="actionButtonTheme(item)"
                  :item="{ label: item.actionLabel, button: 'button' }"
                  @click="triggerAction(item)"
                />
              </slot>
            </template>
          </JsAlert>

          <div
            v-if="showProgress && effectiveDuration(item) > 0"
            class="js-toast-progress"
            :style="{ '--js-toast-duration': effectiveDuration(item) + 'ms' }"
            aria-hidden="true"
          ></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script>
import JsAlert from "./Alert.vue";
import JsNavItem from "./NavItem.vue";
import { toastState, toast } from "../utils/toast.js";

const SINGLE_TOAST_ID = "js-toast-single";

export default {
  name: "JsToast",
  components: {
    JsAlert,
    JsNavItem,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: undefined,
    },
    items: {
      type: Array,
      default: null,
    },
    type: {
      type: String,
      default: "info",
      validator(v) {
        return ["info", "success", "warning", "danger"].includes(v);
      },
    },
    title: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    variant: {
      type: String,
      default: "soft",
      validator(v) {
        return ["soft", "solid", "outline"].includes(v);
      },
    },
    icon: {
      type: String,
      default: "",
    },
    hideIcon: {
      type: Boolean,
      default: false,
    },
    actionLabel: {
      type: String,
      default: "",
    },
    parseMarkdown: {
      type: [Boolean, String],
      default: "",
    },
    position: {
      type: String,
      default: "bottom-center",
      validator(v) {
        return [
          "top-right",
          "top-center",
          "top-left",
          "bottom-right",
          "bottom-center",
          "bottom-left",
        ].includes(v);
      },
    },
    duration: {
      type: Number,
      default: 5000,
    },
    autoDismiss: {
      type: Boolean,
      default: true,
    },
    dismissible: {
      type: Boolean,
      default: true,
    },
    pauseOnHover: {
      type: Boolean,
      default: true,
    },
    showProgress: {
      type: Boolean,
      default: true,
    },
    maxVisible: {
      type: Number,
      default: 5,
    },
    theme: {
      type: String,
      default: "light",
      validator(v) {
        return ["light", "dark"].includes(v);
      },
    },
    ariaLabel: {
      type: String,
      default: "Notifications",
    },
    closeLabel: {
      type: String,
      default: "Dismiss notification",
    },
    teleportTo: {
      type: [String, Object],
      default: "body",
    },
    disableTeleport: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "update:items", "dismiss", "action"],
  data() {
    return {
      pausedIds: {},
    };
  },
  computed: {
    isSingleMode() {
      return typeof this.modelValue === "boolean";
    },
    sourceToasts() {
      if (this.isSingleMode) {
        if (!this.modelValue) return [];
        return [
          {
            id: SINGLE_TOAST_ID,
            type: this.type,
            title: this.title,
            message: this.message,
            variant: this.variant,
            theme: this.theme,
            icon: this.icon,
            hideIcon: this.hideIcon,
            actionLabel: this.actionLabel,
            parseMarkdown: this.parseMarkdown,
          },
        ];
      }
      if (Array.isArray(this.items)) {
        return this.items.map((item, idx) => ({
          ...item,
          id: item.id || `js-toast-item-${idx}`,
        }));
      }
      return toastState.items;
    },
    visibleToasts() {
      const limit = Math.max(1, Number(this.maxVisible) || 5);
      return this.sourceToasts.slice(0, limit);
    },
  },
  watch: {
    visibleToasts: {
      handler(next) {
        this.syncTimers(next);
      },
      deep: true,
    },
  },
  created() {
    this._timers = new Map();
  },
  mounted() {
    this.syncTimers(this.visibleToasts);
  },
  unmounted() {
    this.clearAllTimers();
  },
  methods: {
    getTimerMap() {
      if (!this._timers) {
        this._timers = new Map();
      }
      return this._timers;
    },
    resolveDismissible(item) {
      return item.dismissible !== undefined ? Boolean(item.dismissible) : this.dismissible;
    },
    effectiveDuration(item) {
      if (!this.autoDismiss) return 0;
      if (item.duration !== undefined) {
        if (item.duration === null) return 0;
        return Math.max(0, Number(item.duration) || 0);
      }
      return Math.max(0, Number(this.duration) || 0);
    },
    actionButtonTheme(item) {
      const resolvedTheme = item.theme || this.theme;
      const resolvedVariant = item.variant || this.variant;
      if (resolvedVariant === "solid" && item.type !== "warning") {
        return "light";
      }
      return resolvedTheme === "dark" ? "light" : "dark";
    },
    syncTimers(list) {
      if (typeof window === "undefined") return;
      const timers = this.getTimerMap();
      const activeIds = new Set(list.map((item) => item.id));

      for (const id of Array.from(timers.keys())) {
        if (!activeIds.has(id)) {
          this.clearTimer(id);
        }
      }

      for (const item of list) {
        const ms = this.effectiveDuration(item);
        if (ms <= 0) {
          if (timers.has(item.id)) {
            this.clearTimer(item.id);
          }
          continue;
        }
        if (!timers.has(item.id)) {
          this.startTimer(item, ms);
        }
      }
    },
    startTimer(item, ms) {
      if (typeof window === "undefined" || ms <= 0) return;
      const timers = this.getTimerMap();
      const timeoutId = window.setTimeout(() => {
        this.dismissToast(item);
      }, ms);
      timers.set(item.id, {
        item,
        timeoutId,
        startedAt: Date.now(),
        remaining: ms,
        total: ms,
        paused: false,
      });
    },
    clearTimer(id) {
      const timers = this.getTimerMap();
      const entry = timers.get(id);
      if (entry && entry.timeoutId !== null && typeof window !== "undefined") {
        window.clearTimeout(entry.timeoutId);
      }
      timers.delete(id);
      if (this.pausedIds[id]) {
        const copy = { ...this.pausedIds };
        delete copy[id];
        this.pausedIds = copy;
      }
    },
    clearAllTimers() {
      const timers = this.getTimerMap();
      for (const id of Array.from(timers.keys())) {
        this.clearTimer(id);
      }
    },
    pauseTimer(item) {
      const timers = this.getTimerMap();
      const entry = timers.get(item.id);
      if (!entry || entry.paused) return;
      if (entry.timeoutId !== null && typeof window !== "undefined") {
        window.clearTimeout(entry.timeoutId);
      }
      const elapsed = Date.now() - entry.startedAt;
      entry.remaining = Math.max(0, entry.remaining - elapsed);
      entry.timeoutId = null;
      entry.paused = true;
      this.pausedIds = { ...this.pausedIds, [item.id]: true };
    },
    resumeTimer(item) {
      const timers = this.getTimerMap();
      const entry = timers.get(item.id);
      if (!entry || !entry.paused) return;
      entry.paused = false;
      const copy = { ...this.pausedIds };
      delete copy[item.id];
      this.pausedIds = copy;

      if (entry.remaining <= 0) {
        this.dismissToast(item);
        return;
      }
      if (typeof window !== "undefined") {
        entry.startedAt = Date.now();
        entry.timeoutId = window.setTimeout(() => {
          this.dismissToast(item);
        }, entry.remaining);
      }
    },
    onMouseEnter(item) {
      if (this.pauseOnHover) {
        this.pauseTimer(item);
      }
    },
    onMouseLeave(item) {
      if (this.pauseOnHover) {
        this.resumeTimer(item);
      }
    },
    onFocusIn(item) {
      this.pauseTimer(item);
    },
    onFocusOut(item, event) {
      const current = event.currentTarget;
      const next = event.relatedTarget;
      if (current && next && current.contains(next)) {
        return;
      }
      this.resumeTimer(item);
    },
    dismissToast(item) {
      this.clearTimer(item.id);
      this.$emit("dismiss", item);
      if (this.isSingleMode) {
        this.$emit("update:modelValue", false);
        return;
      }
      if (Array.isArray(this.items)) {
        this.$emit(
          "update:items",
          this.items.filter((it, idx) => (it.id || `js-toast-item-${idx}`) !== item.id)
        );
        return;
      }
      toast.dismiss(item.id);
    },
    triggerAction(item) {
      if (typeof item.onAction === "function") {
        item.onAction(item);
      }
      this.$emit("action", item);
    },
  },
};
</script>

<style scoped>
.js-toast-region {
  position: fixed;
  z-index: var(--js-z-toast);
  width: min(calc(100vw - 2rem), 24rem);
  pointer-events: none;
  font-family: var(--js-font-family);
}

.js-toast-region--top-right {
  top: var(--js-space-4);
  right: var(--js-space-4);
}

.js-toast-region--top-left {
  top: var(--js-space-4);
  left: var(--js-space-4);
}

.js-toast-region--top-center {
  top: var(--js-space-4);
  left: 50%;
  transform: translateX(-50%);
}

.js-toast-region--bottom-right {
  bottom: var(--js-space-4);
  right: var(--js-space-4);
}

.js-toast-region--bottom-left {
  bottom: var(--js-space-4);
  left: var(--js-space-4);
}

.js-toast-region--bottom-center {
  bottom: var(--js-space-4);
  left: 50%;
  transform: translateX(-50%);
}

.js-toast-stack {
  display: flex;
  flex-direction: column;
  gap: var(--js-space-2);
}

.js-toast-item {
  position: relative;
  pointer-events: auto;
  border-radius: var(--js-radius-md);
  box-shadow: var(--js-shadow-lg);
  overflow: hidden;
}

.js-toast-alert {
  box-shadow: none;
}

.js-toast-progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background-color: currentColor;
  opacity: 0.45;
  transform-origin: left center;
  animation: js-toast-progress var(--js-toast-duration, 5000ms) linear forwards;
  pointer-events: none;
}

.js-toast-item--paused .js-toast-progress {
  animation-play-state: paused;
}

@keyframes js-toast-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.js-toast-fade-enter-active,
.js-toast-fade-leave-active {
  transition: opacity var(--js-transition-base), transform var(--js-transition-base);
}

.js-toast-fade-enter-from,
.js-toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}

.js-toast-region--bottom-right .js-toast-fade-enter-from,
.js-toast-region--bottom-right .js-toast-fade-leave-to,
.js-toast-region--bottom-center .js-toast-fade-enter-from,
.js-toast-region--bottom-center .js-toast-fade-leave-to,
.js-toast-region--bottom-left .js-toast-fade-enter-from,
.js-toast-region--bottom-left .js-toast-fade-leave-to {
  transform: translateY(0.5rem);
}

@media (max-width: 480px) {
  .js-toast-region--top-right,
  .js-toast-region--top-left,
  .js-toast-region--top-center {
    top: var(--js-space-2);
    left: 50%;
    right: auto;
    transform: translateX(-50%);
  }

  .js-toast-region--bottom-right,
  .js-toast-region--bottom-left,
  .js-toast-region--bottom-center {
    bottom: var(--js-space-2);
    left: 50%;
    right: auto;
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .js-toast-progress {
    animation: none;
    display: none;
  }

  .js-toast-fade-enter-active,
  .js-toast-fade-leave-active {
    transition: none;
  }
}
</style>
