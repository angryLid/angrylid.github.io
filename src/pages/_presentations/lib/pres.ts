import { getCollection, type CollectionEntry } from "astro:content";
import { presentationDecks } from "../deck";

export interface PresDeck {
  slug: string;
  slides: CollectionEntry<"pres">[];
  total: number;
  deckTitle: string;
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

    const slides = manifest.slides.map((slideId) => {
      if (seenSlideIds.has(slideId)) {
        throw new Error(`Duplicate slide "${slideId}" in presentation "${slug}".`);
      }
      seenSlideIds.add(slideId);

      const entryId = `${slug}/${slideId}`;
      const entry = entriesById.get(entryId);
      if (!entry) {
        throw new Error(`Missing slide entry "${entryId}" in the pres collection.`);
      }
      return entry;
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
