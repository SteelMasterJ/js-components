/**
 * Uses `getBoundingClientRect()` to determine whether a dropdown should flip
 * above its trigger (or align right) to stay within the current viewport.
 *
 * @param {HTMLElement|null} triggerEl
 * @param {HTMLElement|null} dropEl
 * @param {object} [options]
 * @param {number} [options.margin=8] - Minimum breathing room from viewport edge (px)
 * @param {boolean} [options.preferRight=false] - Initial horizontal alignment preference
 * @returns {{ openAbove: boolean, alignRight: boolean }}
 */
export function computeDropdownPlacement(
  triggerEl,
  dropEl,
  { margin = 8, preferRight = false } = {}
) {
  const fallback = { openAbove: false, alignRight: Boolean(preferRight) };
  if (typeof window === "undefined" || !triggerEl || !dropEl) {
    return fallback;
  }

  const triggerRect = triggerEl.getBoundingClientRect();
  const dropRect = dropEl.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight || 0;
  const viewportWidth =
    window.innerWidth || document.documentElement.clientWidth || 0;

  const spaceBelow = viewportHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;
  const neededHeight = dropRect.height + margin;

  const openAbove = spaceBelow < neededHeight && spaceAbove > spaceBelow;

  let alignRight = Boolean(preferRight);
  const neededWidth = dropRect.width + margin;
  if (!alignRight && viewportWidth > 0) {
    const spaceRight = viewportWidth - triggerRect.left;
    const spaceLeft = triggerRect.right;
    if (spaceRight < neededWidth && spaceLeft > spaceRight) {
      alignRight = true;
    }
  } else if (alignRight && viewportWidth > 0) {
    const spaceLeft = triggerRect.right;
    const spaceRight = viewportWidth - triggerRect.left;
    if (spaceLeft < neededWidth && spaceRight > spaceLeft) {
      alignRight = false;
    }
  }

  return { openAbove, alignRight };
}
