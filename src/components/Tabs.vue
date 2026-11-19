<template>
  <div :class="['tabs']">
    <nav>
      <a
        :id="'tab' + i"
        v-for="(item, i) in items"
        :key="item.id"
        :class="{ sel: item.selected }"
        href="?group=a"
        ><span>{{ item.label }}</span></a
      >
    </nav>
    <div class="tab-content-areas">
      <div
        class="tab-content"
        v-for="(item, i) in items"
        :key="item.id"
        :aria-labelledby="'tab' + i"
      >
        <slot :name="'tab' + i"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import JsMarkdown from "./Markdown.vue";

export default {
  name: "JsTabs",
  components: {
    JsMarkdown,
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
        return ["sm", "md", "lg"].includes(v);
      },
    },
    theme: {
      type: String,
      default: "dark",
      validator(v) {
        return ["light", "dark"].includes(v);
      },
    },
  },
  computed: {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.tabs {
  padding: 1em;

  &:has(nav > a:nth-child(1).sel) {
    .tab-content:nth-child(1) {
      display: block;
    }
  }
  &:has(nav > a:nth-child(2).sel) {
    .tab-content:nth-child(2) {
      display: block;
    }
  }
  &:has(nav > a:nth-child(3).sel) {
    .tab-content:nth-child(3) {
      display: block;
    }
  }
  .tab-content {
    display: none;
  }
  nav {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background: #f8f8f8;
    margin: 0 -1.2em;
    padding: 0 1.2em;
    a {
      padding: 1.2em;
      text-align: center;
      flex: 1;
      text-decoration: none;
      color: #2783a8;
      font-weight: 600;
      span {
        font-size: 1em;
      }
      &.sel {
        position: relative;
        &:before {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 0.25em;
          background: #2783a8;
          border-radius: 0.5em 0.5em 0 0;
        }
      }
      &:hover:not(.sel) {
        background: #f2f2f2;
        color: #19536a;
        border-radius: 0.5em;
      }
    }
  }
}
</style>
