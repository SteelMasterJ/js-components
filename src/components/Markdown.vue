<template>
  <span
    v-if="shouldParse"
    class="js-md"
    :title="showTitle ? plainText : undefined"
    :data-test-id="textTestId || undefined"
    v-html="parsedHtml"
  ></span>
  <span
    v-else
    class="js-md"
    :data-test-id="textTestId || undefined"
  >{{ val }}</span>
</template>

<script>
import { escapeHtml, isSafeUrl } from "../utils/sanitize.js";

const VALID_TAG_COLORS = new Set([
  "bl",
  "db",
  "lb",
  "lt",
  "wh",
  "dk",
  "yw",
  "or",
  "pu",
  "gn",
  "rd",
]);

export default {
  name: "JsMarkdown",
  props: {
    val: {
      type: String,
      default: "",
    },
    parse: {
      type: [Boolean, Array, String],
      default: false,
    },
    showTitle: {
      type: Boolean,
      default: false,
    },
    textTestId: {
      type: String,
      default: "",
    },
  },
  computed: {
    shouldParse() {
      if (Array.isArray(this.parse)) {
        return this.parse.length > 0;
      }
      return Boolean(this.parse);
    },
    parsedHtml() {
      return this.parseMarkdown(this.val);
    },
    plainText() {
      return this.stripMarkdown(this.val);
    },
  },
  methods: {
    parseMarkdown(raw) {
      if (!raw) return "";
      let output = escapeHtml(raw);

      // Markdown links: [Label](https://example.com)
      output = output.replace(
        /\[([^\]]+)\]\(([^)\s]+)\)/g,
        (_, label, url) => {
          if (!isSafeUrl(url)) return label;
          return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
        }
      );

      // Bold: **text** or *text*
      output = output.replace(/\*\*([^*<\n]+)\*\*/g, "<strong>$1</strong>");
      output = output.replace(/(?<!\*)\*([^*<\n]+)\*(?!\*)/g, "<strong>$1</strong>");

      // Italic: _text_ (semantic <em>)
      output = output.replace(/(^|\s)_([^_<\n]+)_(?=\s|$|[.,!?;:])/g, "$1<em>$2</em>");

      // Colored tags: bl[Info], gn[Active], rd[Alert], etc.
      output = output.replace(
        /(^|\s)([a-z]{2})\[([^[\]<\n]+)\](?=\s|$|[.,!?;:])/gi,
        (match, lead, code, text) => {
          const key = code.toLowerCase();
          if (!VALID_TAG_COLORS.has(key)) return match;
          return `${lead}<span class="js-tag js-tag--${key}">${text}</span>`;
        }
      );

      // Default tags: [Tag]
      output = output.replace(
        /(^|\s)\[([^[\]<\n]+)\](?=\s|$|[.,!?;:])/g,
        '$1<span class="js-tag">$2</span>'
      );

      // Standalone safe URLs (not already inside an href="...")
      output = output.replace(
        /(^|\s)(https?:\/\/[^\s<]+)/g,
        (match, lead, url) => {
          if (!isSafeUrl(url)) return match;
          return `${lead}<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        }
      );

      return output;
    },
    stripMarkdown(raw) {
      if (!raw) return "";
      return String(raw)
        .replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1")
        .replace(/\*\*([^*<\n]+)\*\*/g, "$1")
        .replace(/\*([^*<\n]+)\*/g, "$1")
        .replace(/(^|\s)_([^_<\n]+)_(?=\s|$|[.,!?;:])/g, "$1$2")
        .replace(/(^|\s)[a-z]{2}\[([^[\]<\n]+)\]/gi, "$1$2")
        .replace(/\[([^[\]<\n]+)\]/g, "$1")
        .trim();
    },
  },
};
</script>

<style scoped>
.js-md {
  overflow-wrap: anywhere;
}

.js-md :deep(strong) {
  font-weight: 700;
}

.js-md :deep(em) {
  font-style: italic;
}

.js-md :deep(a) {
  color: var(--js-color-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.js-md :deep(a:hover) {
  color: var(--js-color-primary-hover);
}

.js-md :deep(a:focus-visible) {
  outline: var(--js-focus-ring);
  outline-offset: var(--js-focus-offset);
  border-radius: 2px;
}
</style>
