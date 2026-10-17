/** Slide metadata the sorter menu needs; ships with every live page. */
export interface MenuSlide {
  title: string;
  pageNo: number;
  crumbs: string[];
}

/** A node of the mind map: a deck/section grouping or a slide leaf. */
export interface MenuNode {
  kind: "section" | "slide";
  title: string;
  pageNo?: number;
  children: MenuNode[];
}

/** Build the mind-map tree from the flat slide list; order is preserved and
 * same-titled sibling sections merge. */
export function buildMenuTree(
  slides: readonly MenuSlide[],
  deckTitle: string,
): MenuNode {
  const root: MenuNode = { kind: "section", title: deckTitle, children: [] };
  for (const s of slides) {
    let cur = root;
    for (const c of s.crumbs) {
      let next = cur.children.find((n) => n.kind === "section" && n.title === c);
      if (!next) {
        next = { kind: "section", title: c, children: [] };
        cur.children.push(next);
      }
      cur = next;
    }
    cur.children.push({
      kind: "slide",
      title: s.title,
      pageNo: s.pageNo,
      children: [],
    });
  }
  return root;
}
