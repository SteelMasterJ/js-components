<template>
  <div
    :class="['drop', 'drop-' + size, 'drop-' + theme, { 'drop-right': right }]"
  >
    <div v-if="component">render a component in a drop here</div>
    <div v-if="items" @keydown.tab="tab(item)">
      <div v-if="tabs" class="tabs">
        <template v-for="(tab, i) in items">
          <input
            class="tab-input"
            :name="_uid + 'tabs'"
            tabindex="1"
            type="radio"
            :checked="tabSelected == i"
            :id="_uid + 'tab' + i"
            :key="'ti' + i"
          />
          <label
            :style="{ width: 96 / items.length + '%' }"
            class="tab-label"
            :for="_uid + 'tab' + i"
            :key="'tl' + i"
            ><JsMarkdown :val="tab.label"
          /></label>
          <div class="tab-content" :key="'tc' + i">
            <JsNavList :theme="theme" :items="tab.items" />
          </div>
        </template>
      </div>
      <JsNavList v-else :theme="theme" :items="items" />
    </div>
  </div>
</template>

<script>
import JsMarkdown from "./Markdown.vue";
import JsNavList from "./NavList.vue";

export default {
  name: "JsDrop",
  components: {
    JsMarkdown,
    JsNavList,
  },
  data() {
    return {};
  },
  props: {
    items: Array,
    component: Object,
    right: Boolean,
    tabs: Boolean,
    tabSelected: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      default: "auto",
      validator(v) {
        return ["auto", "sm", "md", "lg"].includes(v);
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
<style lang="scss">
.drop,
.drop-auto,
.drop-dark {
  min-width: 170px;
  padding: 0.6em;
  border-radius: 0.5em;
  background: #3c3434;
  text-align: left;
  &.drop-fly {
    left: 100%;
    top: -0.5em;
  }
  .tabs {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .tab-input {
      position: absolute;
      opacity: 0;
    }
    .tab-label {
      cursor: pointer;
      color: rgb(175, 175, 175);
      text-align: center;
      white-space: nowrap;
      margin: 0.35em 0 1.25em 0;
      font-size: 0.85em;
      font-weight: 500;
      padding: 0.1em 0;
      background: rgba(0, 0, 0, 0.35);
      transition: all 0.35s;
      &:hover,
      &:active {
        color: #fff;
        background: #929292;
      }
      &:first-of-type {
        border-radius: 1em 0 0 1em;
      }
      &:last-of-type {
        border-radius: 0 1em 1em 0;
      }
    }
    .tab-content {
      display: none;
      order: 99;
      width: 100%;
    }
    .tab-input:checked + .tab-label {
      color: #222;
      background: #eaeaea;
      background: rgba(255, 255, 255, 0.8);
    }
    .tab-input:checked + .tab-label + .tab-content {
      display: block;
    }
  }
  &.drop-light {
    background: #fff;
    .tab-label {
      color: #797979;
      background: #ededed;
      &:active {
        color: #fff;
        background: rgb(0 0 0 / 80%);
      }
    }
    .tab-input:checked + .tab-label {
      color: #fff;
      background: rgb(98 98 98);
    }
  }
  &.drop-right {
    left: unset;
    right: 0;
  }
  &.drop-sm {
    width: 200px;
  }
  &.drop-md {
    width: 280px;
  }
  &.drop-lg {
    width: 360px;
  }
  &.drop-pinned {
    display: block;
  }
}
> .drop .sub-item:focus + .drop {
  display: block;
}

@keyframes folddown {
  0% {
    transform-origin: top center;
    transform: translateY(-1em);
  }
  100% {
  }
}
@keyframes folddown2 {
  0% {
    transform-origin: top center;
    transform: translate(-50%, -2em);
  }
  100% {
  }
}
</style>
