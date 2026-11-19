/**
 * Recursively searches string properties of an object or array for a case-insensitive match.
 * @param {unknown} obj
 * @param {string} query
 * @param {string[]} [searchableProperties=[]]
 * @returns {boolean}
 */
export function findInObject(obj, query, searchableProperties = []) {
  if (obj == null || !query) return false;
  const q = String(query).toLowerCase();

  return Object.keys(obj).some((key) => {
    const val = obj[key];
    if (Array.isArray(val) || (typeof val === "object" && val !== null)) {
      return findInObject(val, q, searchableProperties);
    }
    if (typeof val === "string") {
      const allowed =
        searchableProperties.length === 0 ||
        searchableProperties.includes(key) ||
        !Number.isNaN(Number(key));
      return allowed && val.toLowerCase().includes(q);
    }
    return false;
  });
}

/**
 * Simple count-based pluralizer.
 * @param {number} count
 * @param {string} [noun="item"]
 * @param {string} [suffix="s"]
 * @returns {string}
 */
export function pluralize(count, noun = "item", suffix = "s") {
  const safeNoun = noun || "item";
  return `${count} ${safeNoun}${count !== 1 ? suffix : ""}`;
}
