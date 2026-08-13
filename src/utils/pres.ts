// ============================================================================
// Shared deck helpers for the three presentation modes
// (live /pres/[slug]/live/[pageNo]/, document /pres/[slug]/document/,
//  speaker /pres/[slug]/speaker/).
// ============================================================================
// All three pages used to duplicate the same "fetch all pres entries, group by
// slug, sort each deck, derive total + presTitle" logic inside their own
// getStaticPaths. This module is the single home for that deck grouping; each
// page keeps only its own path fan-out (per-slide vs per-slug).
// ============================================================================
import { getCollection, type CollectionEntry } from "astro:content";

/** A pres entry grouped under its deck slug (first segment of entry.id). */
export interface PresDeck {
  slug: string;
  /** Sorted lexicographically by id — hence the 01-, 02- naming convention. */
  slides: CollectionEntry<"pres">[];
  total: number;
  presTitle: string;
}

/**
 * Fetch every pres entry and group it into decks keyed by slug.
 * Shared by all three modes' getStaticPaths.
 */
export async function getPresDecks(): Promise<PresDeck[]> {
  const entries = await getCollection("pres");

  // Group by slug = first segment of entry.id
  // (id for content/pres/demo/01-title.mdx === "demo/01-title")
  const bySlug = new Map<string, CollectionEntry<"pres">[]>();
  for (const entry of entries) {
    const slug = entry.id.split("/")[0];
    if (!bySlug.has(slug)) bySlug.set(slug, []);
    bySlug.get(slug)!.push(entry);
  }

  return [...bySlug.entries()].map(([slug, slides]) => {
    slides.sort((a, b) => a.id.localeCompare(b.id));
    return {
      slug,
      slides,
      total: slides.length,
      presTitle: slides[0].data.presTitle || slug,
    };
  });
}