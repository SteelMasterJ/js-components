/**
 * Live Vue Options API prop, emit, and slot table builders for JsTable.
 * Introspects the actual component definition so documented props never
 * drift out of sync with src/components/.
 */

function singleTypeName(fn) {
  if (!fn) return "Any";
  if (typeof fn === "function" && fn.name) return fn.name;
  return String(fn);
}

export function formatPropType(propDef) {
  if (!propDef) return "Any";
  const typeVal =
    typeof propDef === "function" || Array.isArray(propDef)
      ? propDef
      : propDef.type;
  if (!typeVal) return "Any";
  if (Array.isArray(typeVal)) {
    return typeVal.map(singleTypeName).join(" | ");
  }
  return singleTypeName(typeVal);
}

export function formatPropDefault(propDef) {
  if (!propDef || typeof propDef !== "object" || Array.isArray(propDef)) {
    return "—";
  }
  if (propDef.required) {
    return "Required";
  }
  if (!Object.prototype.hasOwnProperty.call(propDef, "default")) {
    return "undefined";
  }
  const raw = propDef.default;
  let resolved = raw;
  if (typeof raw === "function") {
    const typeField = propDef.type;
    const isFunctionType =
      typeField === Function ||
      (Array.isArray(typeField) && typeField.includes(Function));
    if (!isFunctionType) {
      try {
        resolved = raw();
      } catch {
        return "() => ...";
      }
    } else {
      return "fn";
    }
  }
  if (resolved === undefined) return "undefined";
  if (resolved === null) return "null";
  if (resolved === "") return '""';
  if (typeof resolved === "string") return `"${resolved}"`;
  if (typeof resolved === "boolean" || typeof resolved === "number") {
    return String(resolved);
  }
  try {
    const json = JSON.stringify(resolved);
    return json.length > 48 ? json.slice(0, 45) + "..." : json;
  } catch {
    return String(resolved);
  }
}

export function buildPropRows(component, propDocs = {}) {
  const header = [
    "Prop",
    "Type",
    "Default",
    "Accepted Values / Notes",
    "Description",
  ];
  const propsObj = component?.props || {};
  const body = Object.entries(propsObj).map(([name, def]) => {
    const doc = propDocs[name] || {};
    const isRequired = Boolean(def && typeof def === "object" && def.required);
    const propLabel = isRequired ? `**${name}** rd[Required]` : `**${name}**`;
    const typeStr = formatPropType(def);
    const defaultStr = formatPropDefault(def);
    const valuesStr = doc.values || "—";
    const descStr = doc.description || "Component prop.";

    return [
      { label: propLabel, wrap: true },
      { label: `bl[${typeStr}]`, wrap: true },
      { label: defaultStr, wrap: true },
      { label: valuesStr, wrap: true },
      { label: descStr, wrap: true },
    ];
  });

  return [header, ...body];
}

export function buildEmitRows(component, emitDocs = {}) {
  const emits = Array.isArray(component?.emits) ? component.emits : [];
  if (!emits.length) return [];

  const header = ["Event", "Payload", "Description"];
  const body = emits.map((eventName) => {
    const doc = emitDocs[eventName] || {};
    return [
      { label: `**@${eventName}**`, wrap: true },
      { label: doc.payload || "—", wrap: true },
      { label: doc.description || `Emitted on ${eventName}.`, wrap: true },
    ];
  });

  return [header, ...body];
}

export function buildSlotRows(slots = []) {
  if (!slots.length) return [];
  const header = ["Slot", "Slot Props", "Description"];
  const body = slots.map((s) => [
    { label: `**#${s.name}**`, wrap: true },
    { label: s.scope || "—", wrap: true },
    { label: s.description || "", wrap: true },
  ]);
  return [header, ...body];
}
