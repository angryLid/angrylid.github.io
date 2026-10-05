export interface PresentationManifest {
  title: string;
  slides: readonly string[];
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
      "01-title",
      "02-warmup",
      "02a-shangri-la-scenes",
      "02b-disclaimer",
      "02c-glossary",

      "03-what-is-investment",
      "13-russia-story",
      "14-why-futures",
      "14a-why-margin",
      "14b-why-offset",
      "14b2-margin-case",

      "06-three-essentials",
      "07-asset-directory",

      "07c-bonds-example",
      "08-bonds",
      "08a-bond-types",
      "08b-long-bond-risk",
      "08c-convertible-bonds",

      "09-dividend-stocks",
      "09a-1001-nights",
      "15a3-asia-profit",
      "09c-digest-bad-assets",
      "09d-social-responsibility",
      "09a-yangtze-hydropower",
      "09b-yangtze-hydropower-2",
      "09e-tax-and-audit",
      "09f-settling-predecessor",
      "05a-moutai-comic",
      "15a-growth-stocks",
      "15a1-chongqing-beer",

      "09g-consensus-wall",
      "10-consensus-traits-venn",
      "11-gold",
      "11a-gold-comic",
      "11a-gold-risk",

      "15-real-estate",
    ],
  },
} satisfies Record<string, PresentationManifest>;
