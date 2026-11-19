<template>
  <div
    :class="[
      'btn-split',
      'btn-split-grow-' + grow,
      { 'btn-split-spaced': spaced },
    ]"
    role="group"
    :aria-label="`${items.length} Button(s)`"
  >
    <JsPanelNavItem
      v-for="(item, i) in items"
      :key="item.id || i"
      class="btn-split-btn"
      :item="item"
      :theme="item.theme || theme"
      :circle="item.circle || circle"
      :thumb="item.thumb || thumb"
      :size="item.size || size"
      :dropRight="item.dropRight || dropRight"
      :dropTabs="item.dropTabs"
      :dropTabSelected="item.dropTabSelected"
      :dropSize="item.dropSize || dropSize"
      :dropTheme="item.dropTheme"
      :parseMarkdown="item.parseMarkdown || parseMarkdown"
    />
  </div>
</template>

<script>
import JsPanelNavItem from "./PanelNavItem.vue";

export default {
  name: "JsBtnSplit",
  components: {
    JsPanelNavItem,
  },
  data() {
    return {};
  },
  props: {
    items: Array,
    size: {
      type: String,
      default: "md",
      validator(v) {
        return ["xs", "sm", "md", "lg"].includes(v);
      },
    },
    grow: {
      type: String,
      default: "none",
      validator(v) {
        return [
          "first",
          "first-hover",
          "first-hover-1",
          "last",
          "all",
          "none",
        ].includes(v);
      },
    },
    parseMarkdown: {
      type: String,
      default: "",
    },
    circle: Boolean,
    thumb: Boolean,
    spaced: Boolean,
    theme: String,
    dropSize: {
      type: String,
      default: "auto",
      validator(value) {
        return ["auto", "sm", "md", "lg"].includes(value);
      },
    },
    dropRight: {
      type: Boolean,
      default: true,
    },
  },
  computed: {},
  methods: {},
};
</script>
<style lang="scss">
.btn-split {
  position: relative;
  display: flex;
  align-items: stretch;
  /* gap: 1px; */
  min-width: 0;
  justify-content: center;
  .btn-split-btn {
    display: flex;
    &:not(:first-child):not(:last-child) {
      > .item {
        border-radius: 0 !important;
      }
    }
    &:first-child > .item {
      /* border-radius: 1em 0 0 1em !important; */
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }
    &:last-child > .item {
      /* border-radius: 0 1em 1em 0 !important; */
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
    .drop {
      left: 0;
      top: 100%;
    }
    .drop-right {
      left: unset;
      right: 0;
    }
  }

  &.btn-split-grow-first,
  &.btn-split-grow-first-hover {
    .btn-split-btn:first-child {
      flex: 1;
      > .item {
        flex: 1;
      }
    }
  }
  &.btn-split-grow-first-hover-1
    .btn-split-btn.panel-nav-item-light:first-child {
    &:hover {
      + .btn-split-btn > .item {
        background: #e1effc;
      }
    }
  }
  &.btn-split-grow-first-hover .btn-split-btn.panel-nav-item-light:first-child {
    &:hover {
      + .btn-split-btn > .item,
      + .btn-split-btn + .btn-split-btn > .item,
      + .btn-split-btn + .btn-split-btn + .btn-split-btn > .item {
        background: #e1effc;
      }
    }
  }
  &.btn-split-grow-first-hover
    .btn-split-btn.panel-nav-item-light-text:first-child {
    &:hover {
      + .btn-split-btn > .item,
      + .btn-split-btn + .btn-split-btn > .item,
      + .btn-split-btn + .btn-split-btn + .btn-split-btn > .item {
        background: rgba(0, 0, 0, 0.5);
      }
    }
  }
  &.btn-split-grow-last .btn-split-btn:last-child {
    flex: 1;
    > .item {
      flex: 1;
    }
  }
  &.btn-split-grow-all .btn-split-btn {
    flex: 1;
    > .item {
      flex: 1;
      justify-content: center;
      .labels {
        flex: unset;
      }
    }
  }
  &.btn-split-spaced {
    justify-content: space-between;
    .btn-split-btn {
      flex: unset;
      > .item {
        flex: unset;
        border-radius: 1em !important;
      }
    }
  }
}
</style>
