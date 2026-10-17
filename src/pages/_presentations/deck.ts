/**
 * Deck manifest structure.
 *
 * `slides` is a tree: a leaf node is a slide id (a file in `decks/<slug>/`),
 * an inner node is a titled section that groups its descendants. Flattening is
 * depth-first, so the visual order below is the play order. Every slide's
 * breadcrumb is the chain of section titles from the root to its parent,
 * prefixed by the deck title and suffixed by the slide's own title — e.g.
 * "投资 / 债券 / 长期债券的风险".
 */
export interface SlideSection {
  title: string;
  slides: readonly SlideNode[];
}

export type SlideNode = string | SlideSection;

export interface PresentationManifest {
  title: string;
  slides: readonly SlideNode[];
}

export const presentationDecks = {
  demo: {
    title: "Demo Presentation",
    slides: [
      "01-title",
      "02-points",
      "02b-typewriter",
      "03-end",
      "04-captioned-image",
    ],
  },
  investment: {
    title: "投资",
    slides: [
      {
        title: "开场",
        slides: [
          "01-title",
          "02-warmup",
          "02a-shangri-la-scenes",
          "02b-disclaimer",
        ],
      },
      {
        title: "预测未来的活动",
        slides: [
          "03-what-is-investment",
          "06-prediction-difficulty",
          "07-asset-directory",
        ],
      },
      {
        title: "期货",
        slides: ["13-russia-story",
          "02c-glossary",
          "14-why-futures",
          "14a-why-margin",
          "14b-why-offset",
          "14b2-margin-case",
        ],
      },
      {
        title: "债券",
        slides: [
          "07c-bonds-example",
          "08-bonds",
          "08a-bond-types",
          "08b-long-bond-risk",
          "08c-convertible-bonds",
        ],
      },
      {
        title: "股票与股息",
        slides: [
          "09-dividend-stocks",
          "09a-1001-nights",
          "15a3-asia-profit",
          "09c-digest-bad-assets",
          "09d-social-responsibility",
          {
            title: "长江电力",
            slides: [
              "09a-yangtze-hydropower",
              "09b-yangtze-hydropower-2",
            ],
          },
          "09e-tax-and-audit",
          "09f-settling-predecessor",
          "05a-moutai-comic",
          {
            title: "成长股",
            slides: ["15a-growth-stocks", "15a1-chongqing-beer"],
          },
        ],
      },
      {
        title: "共识与黄金",
        slides: [
          "09g-consensus-wall",
          "10-consensus-traits-venn",
          "11-gold",
          "11a-gold-comic",
          "11a-gold-risk",
        ],
      },
      {
        title: "房地产",
        slides: ["15-real-estate"],
      },
      "16-thank-you",
    ],
  },
} satisfies Record<string, PresentationManifest>;
