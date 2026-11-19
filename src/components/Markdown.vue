<template>
  <span>
    <span
      v-if="parse"
      :title="stripMarkDown(val)"
      class="js-md"
      v-html="parseMarkDown(val)"
    ></span>
    <span v-else class="js-md">{{ val }}</span>
  </span>
</template>
<script>
export default {
  name: "JsMarkdown",
  props: {
    val: String,
    parse: Array,
  },
  methods: {
    parseMarkDown(val) {
      // some simple rich text processing
      // Tags.... b[test] .... b=blue, l|w=white
      val = ` ${val} `;
      return val
        .replace(
          /(?:\s\/)([^\/<\n]+)(?:\/\s)/g,
          ' <i class="icn fas fa-$1"></i> '
        )
        .replace(/(?:\*)([^*<\n]+)(?:\*)/g, "<strong>$1</strong>")
        .replace(/(?:_)([^_<\n]+)(?:_)/g, "<i>$1</i>")
        .replace(
          /\s\[([\w\s\d]+)\]\((https?:\/\/[\w\d./?=#]+)\)\s$/gm,
          ' <a target="_blank" href="$2">$1</a> '
        )
        .replace(
          /(\s(..)\[)([^[<\n]+)(?:\]\s)/gi,
          ' <span class="tag tag-$2">$3</span> '
        )
        .replace(
          /(\s(..)\[)([^[<\n]+)(?:\]\s)/gi,
          ' <span class="tag tag-$2">$3</span> '
        )
        .replace(/(?:\[)([^[<\n]+)(?:\])/g, ' <span class="tag">$1</span> ')
        .replace(
          /(\b(?:https?:\/\/)(?:(?:[a-z,-]+\.)+)[^\s,]+\b)/g,
          ' <a target="_blank" href="$1">$1</a> '
        )
        .replace(
          /(\b(?:(?:[a-z,-]+\.)+)[^\s,]+\b)/g,
          ' <a target="_blank" href="https://$1">$1</a> '
        )
        .replace(
          /^\[([\w\s\d]+)\]\((https?:\/\/[\w\d./?=#]+)\)$/gm,
          ' <a target="_blank" href="$2">$1</a> '
        );
    },
    stripMarkDown(val) {
      val = ` ${val} `;
      return val
        .replace(/(?:\s\/)([^/<\n]+)(?:\/\s)/g, "")
        .replace(/(?:\*)([^*<\n]+)(?:\*)/g, "$1")
        .replace(/(?:_)([^_<\n]+)(?:_)/g, "$1");
    },
  },
};
</script>
<style lang="scss">
.js-md {
  overflow: hidden;
  text-overflow: ellipsis;
  strong {
    font-weight: bolder;
  }
  a {
    text-decoration: none;
    color: #5bcefd;
  }
  .tag {
    font-size: 0.8em;
    padding: 0 0.35em;
    border-radius: 0.25em;
    display: inline-block;
    margin-bottom: 0.15em;
    vertical-align: middle;
    line-height: normal;
    white-space: nowrap;
    &.tag-bl {
      color: #fff !important;
      background: #2783a8 !important;
    }
    &.tag-db {
      color: #fff !important;
      background: #1b5c75 !important;
    }
    &.tag-lb {
      color: #1b5c75 !important;
      background: #e1effc !important;
    }
    &.tag-lt,
    &.tag-wh {
      color: #222 !important;
      background: #fff !important;
    }
    &.tag-dk {
      color: #fff !important;
      background: #222 !important;
    }
    &.tag-yw {
      color: #444 !important;
      background: rgb(238, 206, 26) !important;
    }
    &.tag-or {
      color: #fff !important;
      background: #ed9137 !important;
    }
    &.tag-pu {
      color: #fff !important;
      background: #974bb7 !important;
    }
    &.tag-gn {
      color: #fff !important;
      background: #41b445 !important;
    }
    &.tag-rd {
      color: #fff !important;
      background: #d81f1f !important;
    }
  }
}
</style>
