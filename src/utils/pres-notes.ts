// ============================================================================
// Shared speaker-notes extraction for the presentation modes.
// ============================================================================
// Speaker notes are authored in a slide's MDX as a <Notes> component, which
// renders an inert <template class="speaker-notes">. Both the speaker view and
// the presenter notes panel need to clone that template's content into a
// visible container. This module is the single home for that extraction.
//
// NOTE: the document mode (src/pages/pres/[slug]/document.astro) extracts notes
// inside an is:inline script so they appear before first paint (no flash); it
// therefore cannot import this module (inline scripts run synchronously during
// parse). Keep its inline logic as the documented no-flash special case.
// ============================================================================

/**
 * Clone the speaker-notes <template> content from inside a slide root, or null
 * if the slide has no notes. Returns a detached DocumentFragment — the caller
 * decides where to mount it (append / replaceChildren).
 */
export function extractNotes(root: HTMLElement): DocumentFragment | null {
  const tpl = root.querySelector<HTMLTemplateElement>(
    "template.speaker-notes",
  );
  return tpl ? (tpl.content.cloneNode(true) as DocumentFragment) : null;
}