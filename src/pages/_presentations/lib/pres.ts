import { getCollection, type CollectionEntry } from "astro:content";
import { presentationDecks, type SlideNode } from "../deck";

/** A flattened slide: its collection entry plus the breadcrumb section chain. */
export interface FlatSlide {
  entry: CollectionEntry<"pres">;
  /** Section titles from the outermost group down to the slide's direct parent. */
  crumbs: string[];
}

export interface PresDeck {
  slug: string;
  slides: FlatSlide[];
  total: number;
  deckTitle: string;
}

/** Depth-first walk of the manifest tree; `crumbs` accumulates section titles. */
function flattenSlides(
  nodes: readonly SlideNode[],
  path: readonly string[],
  visit: (slideId: string, crumbs: string[]) => void,
): void {
  for (const node of nodes) {
    if (typeof node === "string") {
      visit(node, [...path]);
    } else {
      if (node.slides.length === 0) {
        throw new Error(`Slide section "${node.title}" must not be empty.`);
      }
      flattenSlides(node.slides, [...path, node.title], visit);
    }
  }
}

export async function getPresDecks(): Promise<PresDeck[]> {
  const entries = await getCollection("pres");
  const entriesById = new Map<string, CollectionEntry<"pres">>();
  for (const entry of entries) entriesById.set(entry.id, entry);
  const decks = Object.entries(presentationDecks).map(([slug, manifest]) => {
    const seenSlideIds = new Set<string>();
    if (manifest.slides.length === 0) {
      throw new Error(`Presentation "${slug}" must contain at least one slide.`);
    }

    const slides: FlatSlide[] = [];
    flattenSlides(manifest.slides, [], (slideId, crumbs) => {
      if (seenSlideIds.has(slideId)) {
        throw new Error(`Duplicate slide "${slideId}" in presentation "${slug}".`);
      }
      seenSlideIds.add(slideId);

      const entryId = `${slug}/${slideId}`;
      const entry = entriesById.get(entryId);
      if (!entry) {
        throw new Error(`Missing slide entry "${entryId}" in the pres collection.`);
      }
      slides.push({ entry, crumbs });
    });

    return {
      slug,
      slides,
      total: slides.length,
      deckTitle: manifest.title,
    };
  });

  return decks;
}
