import { foundationDocs } from "./docsFoundation.js";
import { navigationDocs } from "./docsNavigation.js";
import { layoutDocs } from "./docsLayout.js";
import { formsDocs } from "./docsForms.js";

export const COMPONENT_CATEGORIES = [
  {
    id: "foundation",
    label: "Foundation & Feedback",
    shortLabel: "Core",
    icon: "info-circle",
    description: "Icons, safe inline markdown, alerts, toasts, modals, and tabs.",
  },
  {
    id: "navigation",
    label: "Navigation & Menus",
    shortLabel: "Nav",
    icon: "list-ul",
    description: "Buttons, links, split groups, vertical lists, popovers, and NavItem sub-primitives.",
  },
  {
    id: "layout",
    label: "Layout & Data",
    shortLabel: "Layout",
    icon: "table-cells",
    description: "Semantic panels, searchable directories, page headers, and data tables.",
  },
  {
    id: "forms",
    label: "Forms & Inputs",
    shortLabel: "Forms",
    icon: "check-circle",
    description: "Unified inputs, combobox/select, checkboxes, radios, and multi-step wizards.",
  },
];

export const COMPONENT_DOCS = [
  ...foundationDocs,
  ...navigationDocs,
  ...layoutDocs,
  ...formsDocs,
];

const DOCS_BY_SLUG = new Map(COMPONENT_DOCS.map((doc) => [doc.slug, doc]));

export function getComponentDoc(slug) {
  return DOCS_BY_SLUG.get(String(slug || "")) || null;
}

export function getAdjacentDocs(slug) {
  const index = COMPONENT_DOCS.findIndex((doc) => doc.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? COMPONENT_DOCS[index - 1] : null,
    next: index < COMPONENT_DOCS.length - 1 ? COMPONENT_DOCS[index + 1] : null,
  };
}

export function getComponentsByCategory() {
  return COMPONENT_CATEGORIES.map((cat) => ({
    ...cat,
    items: COMPONENT_DOCS.filter((doc) => doc.category === cat.id),
  }));
}
