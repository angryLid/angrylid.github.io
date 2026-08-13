// ============================================================================
// Shared data-anim / data-step visibility logic for the live and speaker modes.
// ============================================================================
// Both modes used to duplicate the same two functions: computeSteps (scan a
// slide for the max [data-anim] index, combine with the frontmatter `steps`
// value) and syncVisibility (toggle [data-visible] on each [data-anim] element
// based on the current step). This module is their single home; each mode keeps
// only a thin local wrapper that supplies its own frontmatter-steps source.
//
// The reveal system is CSS-driven: elements with [data-anim] are opacity:0 until
// a [data-visible] attribute is toggled (see PresHead's global base). Because it
// is opacity-based (not display:none), hidden content stays in the a11y tree.
// ============================================================================

/**
 * Compute the total number of steps for a slide: the larger of the frontmatter
 * `steps` value (0 or unset → 1) and the highest [data-anim] index + 1.
 * `frontmatterSteps` is the raw value read from the slide's frontmatter.
 */
export function computeSteps(
  root: HTMLElement,
  frontmatterSteps: number,
): number {
  const fm = frontmatterSteps || 1;
  let maxAnim = 0;
  root.querySelectorAll("[data-anim]").forEach((el) => {
    const n = parseInt(el.getAttribute("data-anim") ?? "", 10);
    if (!Number.isNaN(n) && n > maxAnim) maxAnim = n;
  });
  return Math.max(fm, maxAnim + 1);
}

/**
 * Toggle [data-visible] on every [data-anim] element so that steps <= the given
 * step are revealed. Does not touch [data-step] on the body — callers handle
 * that their own way.
 */
export function syncVisibility(root: HTMLElement, step: number): void {
  root.querySelectorAll("[data-anim]").forEach((el) => {
    const n = parseInt(el.getAttribute("data-anim") ?? "", 10);
    if (!Number.isNaN(n) && n <= step) {
      el.setAttribute("data-visible", "");
    } else {
      el.removeAttribute("data-visible");
    }
  });
}