import { presentationDecks, type SlideNode } from "../deck";

/** Runtime shape of a compiled Astro component (props in, render out). */
export type SlideComponent = (props: Record<string, unknown>) => unknown;

/**
 * Static metadata every slide must export from its frontmatter:
 *
 *   export const meta = { title: "…", steps?: 4 };
 *
 * `steps` is optional — the runtime derives the real step count from the
 * max [data-anim] index anyway; it only serves as a floor.
 */
export interface SlideMetaExport {
  title: string;
  steps?: number;
}

export interface SlideModule {
  default: SlideComponent;
  meta: SlideMetaExport;
}

/** A flattened slide: its module id plus the breadcrumb section chain. */
export interface FlatSlide {
  id: string;
  title: string;
  steps: number;
  /** Section titles from the outermost group down to the slide's direct parent. */
  crumbs: string[];
}

export interface PresDeck {
  slug: string;
  slides: FlatSlide[];
  total: number;
  deckTitle: string;
}

/**
 * All slide modules, keyed by loader. Keys look like
 * "../decks/<deckSlug>/<slideId>.astro"; non-eager on purpose — each live
 * page must bundle only its own slide's component, not the whole deck.
 */
const slideLoaders = import.meta.glob<SlideModule>("../decks/**/*.astro");

/** Load one slide module by its "<deckSlug>/<slideId>" id and validate meta. */
export async function getSlideModule(id: string): Promise<SlideModule> {
  const load = slideLoaders[`../decks/${id}.astro`];
  if (!load) throw new Error(`Missing slide module "${id}".`);
  const mod = await load();
  if (!mod.meta?.title) {
    throw new Error(`Slide "${id}" must export "meta" with a title.`);
  }
  return mod;
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
  const decks = Object.entries(presentationDecks).map(([slug, manifest]) => {
    const seenSlideIds = new Set<string>();
    if (manifest.slides.length === 0) {
      throw new Error(`Presentation "${slug}" must contain at least one slide.`);
    }

    const pending: { slideId: string; crumbs: string[]; mod: Promise<SlideModule> }[] = [];
    flattenSlides(manifest.slides, [], (slideId, crumbs) => {
      if (seenSlideIds.has(slideId)) {
        throw new Error(`Duplicate slide "${slideId}" in presentation "${slug}".`);
      }
      seenSlideIds.add(slideId);

      // Meta is validated (and awaited) downstream so build fails fast on a
      // slide with a missing module or title — not deep inside a page render.
      pending.push({ slideId, crumbs, mod: getSlideModule(`${slug}/${slideId}`) });
    });

    return { slug, manifest, pending };
  });

  // Resolve all module metas in parallel, then assemble the final structure.
  const resolved = await Promise.all(
    decks.map(async ({ slug, manifest, pending }) => {
      const flat: FlatSlide[] = await Promise.all(
        pending.map(async ({ slideId, crumbs, mod }) => {
          const { meta } = await mod;
          return {
            id: `${slug}/${slideId}`,
            title: meta.title,
            steps: meta.steps ?? 1,
            crumbs,
          };
        }),
      );
      return {
        slug,
        slides: flat,
        total: flat.length,
        deckTitle: manifest.title,
      };
    }),
  );

  return resolved;
}
